// Define the business rules
export const COMMISSION_PLAN = [
  { level: 0, percentage: 0.05, minRank: "Associate" }, // Self Purchase
  { level: 1, percentage: 0.15, minRank: "Associate" }, // Direct
  { level: 2, percentage: 0.10, minRank: "Associate" },
  { level: 3, percentage: 0.05, minRank: "Associate" },
  { level: 4, percentage: 0.04, minRank: "Associate" },
  { level: 5, percentage: 0.03, minRank: "Associate" },
  { level: 6, percentage: 0.02, minRank: "Associate" },
  { level: 7, percentage: 0.02, minRank: "Star" },
  { level: 8, percentage: 0.01, minRank: "Super Star" },
  { level: 9, percentage: 0.01, minRank: "Diamond" },
  { level: 10, percentage: 0.01, minRank: "Star Diamond" },
  { level: 11, percentage: 0.01, minRank: "Diplomate" },
  { level: 12, percentage: 0.01, minRank: "Star Diplomate" },
  { level: 13, percentage: 0.01, minRank: "Diamond Diplomate" },
  { level: 14, percentage: 0.01, minRank: "Crown Ambassador" },
  { level: 15, percentage: 0.01, minRank: "Chairman" },
];

/**
 * Calculates how a single purchase is distributed upwards.
 * @param purchaseAmount The total amount of the order
 * @param levelsUp How many levels away the earning associate is from the purchaser
 * @param associateRank The current rank of the associate receiving the commission
 */
export const calculateCommission = (
  purchaseAmount: number,
  levelsUp: number,
  associateRank: string
) => {
  const config = COMMISSION_PLAN.find((p) => p.level === levelsUp);
  if (!config) return 0;

  // Rank Requirement Check (Simplified logic)
  const ranks = ["Associate", "Star", "Super Star", "Diamond", "Star Diamond", "Diplomate", "Star Diplomate", "Diamond Diplomate", "Crown Ambassador", "Chairman"];
  const requiredRankIndex = ranks.indexOf(config.minRank);
  const currentRankIndex = ranks.indexOf(associateRank);

  if (currentRankIndex < requiredRankIndex) return 0;

  return purchaseAmount * config.percentage;
};