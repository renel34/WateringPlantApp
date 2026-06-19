// plantSettings.js
const plantSettings = {
  succulent: {
    label: "Succulent / Cactus",
    defaultMlPerDay: 30,
    moistureThreshold: 20,
    description:
      "Only water when very dry; simulate deep, infrequent watering.",
  },
  herb: {
    label: "Herb (Basil, Mint, etc.)",
    defaultMlPerDay: 120,
    moistureThreshold: 35,
    description: "Prefer consistently moist soil; high daily water needs.",
  },
  leafyVeg: {
    label: "Leafy Vegetable (Lettuce, Spinach)",
    defaultMlPerDay: 200,
    moistureThreshold: 40,
    description: "High water demand; shallow roots require steady moisture.",
  },
  flowering: {
    label: "Flowering Houseplant",
    defaultMlPerDay: 150,
    moistureThreshold: 45,
    description: "Keep soil evenly moist; peace lilies droop when dry.",
  },
  tropical: {
    label: "Tropical Plant (Monstera, Pothos)",
    defaultMlPerDay: 120,
    moistureThreshold: 38,
    description: "Moderate drinkers; avoid soggy soil.",
  },
  woody: {
    label: "Woody Plant / Shrub",
    defaultMlPerDay: 90,
    moistureThreshold: 30,
    description: "Rosemary/lavender prefer drier soil; citrus prefers wetter.",
  },
  general: {
    label: "General Houseplant",
    defaultMlPerDay: 100,
    moistureThreshold: 35,
    description: "Safe middle‑ground for most indoor plants.",
  },
};

export default plantSettings;
