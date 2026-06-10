// data/products.ts
export interface Product {
  id: string
  name: string
  category: "energy" | "sleep" | "stress" | "digestion" | "immunity"
  ingredients: string[]
  description: string
}

export const productCatalog: Product[] = [
  {
    id: "stress-tea",
    name: "Stress Relief Herbal Tea",
    category: "stress",
    ingredients: ["Tulsi", "Brahmi", "Ashwagandha"],
    description: "Calms the nervous system, decreases cortisol levels, and reduces psychological stress factors."
  },
  {
    id: "ashwagandha-capsules",
    name: "Premium Ashwagandha Extract",
    category: "stress",
    ingredients: ["Ashwagandha Root Extract"],
    description: "An adaptogenic herb designed to help the body resist external physical and chemical stressors."
  },
  {
    id: "protein-sattu",
    name: "Protein Sattu Mix",
    category: "energy",
    ingredients: ["Roasted Chana", "Barley", "Cumin"],
    description: "Traditional high-fiber energy source providing sustained glycemic index fuel release."
  },
  {
    id: "moringa",
    name: "Organic Moringa Powder",
    category: "energy",
    ingredients: ["Moringa Oleifera Leaves"],
    description: "Packed with iron, vitamins, and vital micronutrients to optimize dynamic metabolic cellular functions."
  },
  {
    id: "triphala",
    name: "Triphala Pure Powder",
    category: "digestion",
    ingredients: ["Amla", "Bibhitaki", "Haritaki"],
    description: "Time-tested gastrointestinal cleanser that promotes bowel regularity and microbiome health."
  },
  {
    id: "amla",
    name: "Amla Vitamin C Powder",
    category: "immunity",
    ingredients: ["Pure Indian Gooseberry"],
    description: "Highly bioavailable source of natural Vitamin C to protect against cellular oxidative stress."
  },
  {
    id: "giloy",
    name: "Giloy Immune Juice",
    category: "immunity",
    ingredients: ["Giloy Stem Extract"],
    description: "An immunomodulator herb that enhances macrophage activity and supports baseline defenses."
  }
]