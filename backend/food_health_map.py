"""
GutSense — Food-to-Health Mapping
Maps detected food classes to estimated gut health and brain focus scores.
Covers 89 food classes: Indian-first, then global.

Scores are based on general nutritional research:
  - Gut Health (0-100): fiber, probiotics, prebiotics, fermented foods boost score;
    processed, fried, high-sugar foods lower it.
  - Brain Focus (0-100): omega-3, antioxidants, B-vitamins, iron boost score;
    refined carbs, sugar, trans fats lower it.
"""

# Each food has: (gut_health_score, brain_focus_score)
# Scores are 0-100, where higher = better for gut/brain
FOOD_HEALTH_MAP = {

    # ── Indian Foods ──────────────────────────────────────────────────────────
    # Lentil & legume-based — high fiber, prebiotic, excellent for gut
    "dal":              (88, 78),   # Lentil curry — high fiber + protein, turmeric
    "sambar":           (87, 76),   # Lentil-veggie stew — fiber + antioxidants
    "chole":            (85, 75),   # Chickpea curry — prebiotic fiber, iron
    "lentils":          (88, 78),   # General lentils — same as dal
    "rajma":            (84, 74),   # Kidney bean curry

    # Fermented — probiotic powerhouses
    "idli":             (92, 74),   # Fermented rice-lentil cake — probiotics + easy digest
    "dosa":             (90, 72),   # Fermented crepe — probiotics, light
    "uttapam":          (88, 72),   # Thick fermented pancake with veggies
    "raita":            (91, 68),   # Yogurt-based — live cultures, cooling
    "lassi":            (90, 65),   # Yogurt drink — probiotics, refreshing

    # Flatbreads & staples
    "roti":             (65, 60),   # Whole wheat flatbread — fiber, neutral
    "naan":             (50, 48),   # Refined flour, often buttered
    "paratha":          (48, 50),   # Pan-fried, heavier, ghee-based
    "poha":             (72, 68),   # Flattened rice — light, turmeric, peanuts
    "upma":             (70, 65),   # Semolina dish — moderate fiber, veggies
    "khichdi":          (82, 72),   # Rice + lentils — easy digest, healing food

    # Curries & mains
    "curry":            (72, 70),   # Generic curry — turmeric, spices help gut
    "paneer":           (65, 68),   # Cottage cheese — protein, moderate fat
    "palak-paneer":     (80, 82),   # Spinach + paneer — iron, vitamins, fiber
    "aloo-gobi":        (75, 70),   # Potato + cauliflower — fiber, vitamin C
    "korma":            (60, 62),   # Cream-based — rich, heavier
    "tikka":            (70, 75),   # Grilled/spiced — good protein, spices
    "tandoori-chicken": (68, 78),   # Grilled — lean protein, spices
    "pav-bhaji":        (55, 55),   # Butter-heavy veggie mash + bread
    "biryani":          (58, 62),   # Spiced rice + meat/veg — moderate

    # Snacks (fried = lower gut score)
    "pakora":           (30, 35),   # Deep-fried fritters
    "samosa":           (28, 32),   # Deep-fried pastry
    "vada":             (35, 38),   # Deep-fried lentil donut
    "chaat":            (55, 50),   # Street snack — mixed, some fermented elements

    # Indian sweets & drinks
    "gulab-jamun":      (18, 20),   # Deep-fried, sugar-soaked
    "jalebi":           (15, 18),   # Deep-fried sugar spirals
    "kheer":            (45, 42),   # Rice pudding — milk-based, moderate sugar

    # ── Vegetables ────────────────────────────────────────────────────────────
    "broccoli":         (95, 88),   # Sulforaphane, fiber, vitamin C
    "spinach":          (93, 90),   # Iron, folate, antioxidants
    "carrot":           (88, 80),   # Beta-carotene, fiber
    "cucumber":         (85, 75),   # Hydrating, light fiber
    "tomato":           (83, 78),   # Lycopene, vitamin C
    "potato":           (65, 62),   # Resistant starch when cooled, moderate
    "cauliflower":      (88, 82),   # Cruciferous, fiber, vitamin C
    "eggplant":         (82, 72),   # Fiber, nasunin antioxidant
    "onion":            (80, 70),   # Prebiotic (inulin), quercetin
    "bell-pepper":      (84, 78),   # Vitamin C, antioxidants
    "cabbage":          (86, 74),   # Cruciferous, prebiotic fiber
    "beans":            (87, 76),   # High fiber, prebiotic, protein

    # ── Fruits ────────────────────────────────────────────────────────────────
    "apple":            (87, 78),   # Pectin fiber, polyphenols
    "banana":           (82, 75),   # Prebiotic (green), potassium
    "orange":           (85, 80),   # Vitamin C, flavonoids, fiber
    "mango":            (78, 74),   # Fiber, vitamin A, enzymes
    "grapes":           (80, 76),   # Resveratrol, antioxidants
    "watermelon":       (72, 65),   # Hydrating, lycopene, low fiber
    "papaya":           (88, 75),   # Papain enzyme, great for digestion
    "pomegranate":      (90, 85),   # Ellagic acid, powerful antioxidant

    # ── Proteins ──────────────────────────────────────────────────────────────
    "chicken":          (68, 78),   # Lean protein, B-vitamins
    "fish":             (78, 92),   # Omega-3 (brain), protein, anti-inflammatory
    "egg":              (72, 85),   # Choline (brain), protein, B12
    "mutton":           (55, 68),   # Iron, B12, but heavier to digest
    "shrimp":           (70, 80),   # Lean protein, selenium, B12
    "tofu":             (80, 72),   # Plant protein, isoflavones, easy digest

    # ── Grains & Staples ─────────────────────────────────────────────────────
    "rice":             (62, 58),   # Easily digestible, low fiber (white)
    "pasta":            (55, 52),   # Refined wheat, moderate
    "bread":            (52, 48),   # Depends on type — scored as white bread
    "noodles":          (50, 50),   # Refined, neutral
    "oats":             (90, 78),   # Beta-glucan fiber, prebiotic, great for gut
    "quinoa":           (88, 82),   # Complete protein, fiber, minerals
    "couscous":         (58, 55),   # Refined wheat, moderate
    "tortilla":         (55, 52),   # Refined flour, neutral

    # ── Global Prepared Foods ─────────────────────────────────────────────────
    "pizza":            (35, 40),   # Refined dough, cheese, processed
    "burger":           (30, 38),   # Processed meat, refined bun
    "sandwich":         (55, 55),   # Varies widely — scored as average
    "soup":             (78, 72),   # Often veggie-rich, easy digest
    "salad":            (90, 82),   # Raw veggies, fiber, enzymes
    "sushi":            (75, 82),   # Fish (omega-3), rice, seaweed
    "tacos":            (50, 52),   # Mixed — some fiber, some processed
    "stir-fry":         (76, 74),   # Veggies + protein, quick-cooked
    "fried-rice":       (48, 50),   # Oily, refined carbs
    "ramen":            (45, 48),   # High sodium, refined noodles
    "falafel":          (78, 72),   # Chickpea-based, baked/fried
    "hummus":           (82, 74),   # Chickpea + tahini, fiber, healthy fats

    # ── Dairy & Drinks ────────────────────────────────────────────────────────
    "yogurt":           (92, 70),   # Probiotics, live cultures
    "milk":             (65, 62),   # Calcium, moderate — some people intolerant
    "cheese":           (55, 58),   # Aged has some probiotics, but high fat
    "smoothie":         (80, 75),   # Fruit + yogurt base assumed
    "juice":            (50, 55),   # Sugar without fiber
    "tea":              (75, 78),   # Polyphenols, L-theanine (focus)

    # ── Snacks & Sweets ──────────────────────────────────────────────────────
    "fries":            (20, 28),   # Deep-fried, acrylamide, no fiber
    "chips":            (15, 22),   # Processed, high salt, trans fats
    "cake":             (18, 22),   # Sugar, refined flour, butter
    "candy":            (8,  12),   # Pure sugar, zero nutrition
    "cookies":          (16, 20),   # Sugar + refined flour + fat
    "chocolate":        (45, 55),   # Dark chocolate has flavonoids; scored as mixed
}

# Default scores for unknown foods
DEFAULT_GUT_HEALTH = 50
DEFAULT_BRAIN_FOCUS = 50


def get_health_scores(food_name: str) -> dict:
    """
    Returns gut health and brain focus scores for a detected food item.

    Args:
        food_name: The name of the detected food (case-insensitive)

    Returns:
        dict with 'gut_health' and 'brain_focus' scores (0-100)
    """
    food_lower = food_name.lower().strip()

    # Direct match
    if food_lower in FOOD_HEALTH_MAP:
        gut, brain = FOOD_HEALTH_MAP[food_lower]
        return {"gut_health": gut, "brain_focus": brain}

    # Partial match — check if any key is contained in the food name
    for key, (gut, brain) in FOOD_HEALTH_MAP.items():
        if key in food_lower or food_lower in key:
            return {"gut_health": gut, "brain_focus": brain}

    # No match — return defaults
    return {"gut_health": DEFAULT_GUT_HEALTH, "brain_focus": DEFAULT_BRAIN_FOCUS}


def get_combined_health_scores(detections: list) -> dict:
    """
    Calculates weighted average health scores from multiple food detections.
    Weights are based on detection confidence.

    Args:
        detections: List of dicts with 'class' and 'confidence' keys

    Returns:
        dict with weighted average 'gut_health' and 'brain_focus' scores
    """
    if not detections:
        return {"gut_health": DEFAULT_GUT_HEALTH, "brain_focus": DEFAULT_BRAIN_FOCUS}

    total_weight = 0
    weighted_gut = 0
    weighted_brain = 0

    for det in detections:
        scores = get_health_scores(det["class"])
        weight = det.get("confidence", 0.5)
        weighted_gut += scores["gut_health"] * weight
        weighted_brain += scores["brain_focus"] * weight
        total_weight += weight

    if total_weight == 0:
        return {"gut_health": DEFAULT_GUT_HEALTH, "brain_focus": DEFAULT_BRAIN_FOCUS}

    return {
        "gut_health": round(weighted_gut / total_weight),
        "brain_focus": round(weighted_brain / total_weight),
    }
