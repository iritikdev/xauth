// lib/engine.ts
import { AssessmentData } from "@/lib/validations/assessment"
import { productCatalog, Product } from "@/data/product"


export interface CategoryScore {
  name: string
  slug: "energy" | "sleep" | "stress" | "digestion" | "immunity"
  score: number
  status: "Optimal" | "Moderate Risk" | "High Attention"
}

export interface AssessmentResults {
  overallScore: number
  categories: CategoryScore[]
  recommendations: Product[]
  suggestions: string[]
  triggerSafetyWarning: boolean
}

export function calculateAssessment(data: AssessmentData): AssessmentResults {
  // Initialize baseline penalty counters (0 implies optimal health state)
  let energyRisk = 0
  let sleepRisk = 0
  let stressRisk = 0
  let digestionRisk = 0
  let immunityRisk = 0

  // --- Step 1 & 3: Demographics & Lifestyle Parsing ---
  if (data.activityLevel === "sedentary") energyRisk += 25
  if (data.sleepHours < 6) {
    sleepRisk += 40
    energyRisk += 20
  } else if (data.sleepHours < 7) {
    sleepRisk += 20
  }

  if (data.waterIntake < 2) digestionRisk += 20
  if (data.stressLevel >= 4) {
    stressRisk += 40
    sleepRisk += 20
  } else if (data.stressLevel === 3) {
    stressRisk += 20
  }
  if (data.screenTime > 7) sleepRisk += 15

  // --- Step 2: Goal Alignment Additions ---
  if (data.goals.includes("More Energy")) energyRisk += 15
  if (data.goals.includes("Better Sleep")) sleepRisk += 15
  if (data.goals.includes("Stress Management")) stressRisk += 15
  if (data.goals.includes("Better Digestion")) digestionRisk += 15
  if (data.goals.includes("Stronger Immunity")) immunityRisk += 15

  // --- Step 4: Symptom Specific Scoring ---
  if (data.symptoms.includes("fatigue")) energyRisk += 30
  if (data.symptoms.includes("brain_fog")) energyRisk += 20
  if (data.symptoms.includes("poor_sleep")) sleepRisk += 30
  if (data.symptoms.includes("anxiety")) stressRisk += 30
  if (data.symptoms.includes("acidity")) digestionRisk += 25
  if (data.symptoms.includes("bloating")) digestionRisk += 25
  if (data.symptoms.includes("constipation")) digestionRisk += 25
  if (data.symptoms.includes("gas")) digestionRisk += 20
  if (data.symptoms.includes("frequent_illness")) immunityRisk += 40
  if (data.symptoms.includes("hair_fall")) immunityRisk += 15
  if (data.symptoms.includes("dry_skin")) digestionRisk += 10

  // Transform risk scores to Wellness Scores (0 to 100 scale)
  const mapToWellnessScore = (risk: number) => Math.max(0, Math.min(100, 100 - risk))

  const categories: CategoryScore[] = [
    { name: "Energy & Vitality", slug: "energy", score: mapToWellnessScore(energyRisk), status: "Optimal" },
    { name: "Sleep Architecture", slug: "sleep", score: mapToWellnessScore(sleepRisk), status: "Optimal" },
    { name: "Stress Tolerance", slug: "stress", score: mapToWellnessScore(stressRisk), status: "Optimal" },
    { name: "Digestive Fire", slug: "digestion", score: mapToWellnessScore(digestionRisk), status: "Optimal" },
    { name: "Immune Response", slug: "immunity", score: mapToWellnessScore(immunityRisk), status: "Optimal" },
  ]

  // Set operational statuses based on boundaries
  categories.forEach((cat) => {
    if (cat.score < 50) cat.status = "High Attention"
    else if (cat.score < 75) cat.status = "Moderate Risk"
  })

  // Compute total consolidated aggregate score
  const overallScore = Math.round(categories.reduce((acc, c) => acc + c.score, 0) / categories.length)

  // --- Dynamic Recommendation Pipeline Extraction ---
  const targetCategories = categories
    .filter((c) => c.score < 75)
    .map((c) => c.slug)

  // Fallback to top goals if user registers high scores across all parameters
  if (targetCategories.length === 0) {
    if (data.goals.includes("Stress Management")) targetCategories.push("stress")
    if (data.goals.includes("Better Digestion")) targetCategories.push("digestion")
    if (targetCategories.length === 0) targetCategories.push("energy")
  }

  const recommendations = productCatalog.filter((product: Product) =>
    targetCategories.includes(product.category)
  )

  // --- Generate Contextual Lifestyle Suggestions ---
  const suggestions: string[] = []
  if (data.sleepHours < 7) {
    suggestions.push("Establish a digital curfew by locking down glowing screens 60 minutes before bedtime.")
  }
  if (data.waterIntake < 3) {
    suggestions.push("Target tracking liquid consumption explicitly up to 3 Litres using structural reminders.")
  }
  if (data.stressLevel >= 4) {
    suggestions.push("Integrate 5 minutes of somatic box breathing daily to downregulate hyperactive sympathetic signals.")
  }
  if (data.activityLevel === "sedentary") {
    suggestions.push("Break continuous sitting intervals every 90 minutes with active mobility postures.")
  }
  if (suggestions.length === 0) {
    suggestions.push("Maintain your excellent hydration and activity framework while safely tracking long-term vital indices.")
  }

  // Safety evaluations
  const triggerSafetyWarning = data.conditions.length > 0

  return {
    overallScore,
    categories,
    recommendations,
    suggestions,
    triggerSafetyWarning,
  }
}