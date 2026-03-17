// ============================================
// Terraria Clone - Data & Sprite Definitions
// ============================================

// Block Types
const BLOCKS = {
    AIR: 0, DIRT: 1, GRASS: 2, STONE: 3, COPPER_ORE: 4, IRON_ORE: 5, GOLD_ORE: 6, DIAMOND: 7,
    WOOD: 8, LEAVES: 9, SAND: 10, WATER: 11, TORCH: 12, WORKBENCH: 13, FURNACE: 14, CHEST: 15,
    WOOD_PLATFORM: 16, COBBLESTONE: 17, BRICK: 18, GLASS: 19, HELLSTONE: 20, OBSIDIAN: 21,
    MUSHROOM: 22, FLOWER_RED: 23, FLOWER_YELLOW: 24, TALL_GRASS: 25, CLAY: 26, MUD: 27,
    SNOW: 29, ICE: 30, LAVA: 31, CORRUPT_GRASS: 32, EBONSTONE: 33, DEMONITE_ORE: 34,
    CRIMSON_GRASS: 35, CRIMSTONE: 36, CRIMTANE_ORE: 37, VILE_MUSHROOM: 38,
    DOOR: 39
};

const BLOCK_DATA = {
    [BLOCKS.AIR]: { name: 'Air', solid: false, transparent: true, hardness: 0 },
    [BLOCKS.DIRT]: { name: 'Dirt', solid: true, transparent: false, hardness: 1, color: '#9B6B3C', drops: BLOCKS.DIRT },
    [BLOCKS.GRASS]: { name: 'Grass', solid: true, transparent: false, hardness: 1, color: '#7B5B3A', topColor: '#4CAF50', drops: BLOCKS.DIRT },
    [BLOCKS.STONE]: { name: 'Stone', solid: true, transparent: false, hardness: 3, color: '#8A8A8A', drops: BLOCKS.COBBLESTONE },
    [BLOCKS.COPPER_ORE]: { name: 'Copper Ore', solid: true, transparent: false, hardness: 4, color: '#CD7F32', drops: BLOCKS.COPPER_ORE },
    [BLOCKS.IRON_ORE]: { name: 'Iron Ore', solid: true, transparent: false, hardness: 5, color: '#8B7355', drops: BLOCKS.IRON_ORE },
    [BLOCKS.GOLD_ORE]: { name: 'Gold Ore', solid: true, transparent: false, hardness: 6, color: '#FFD700', drops: BLOCKS.GOLD_ORE },
    [BLOCKS.DIAMOND]: { name: 'Diamond', solid: true, transparent: false, hardness: 8, color: '#00CED1', drops: BLOCKS.DIAMOND },
    [BLOCKS.WOOD]: { name: 'Wood', solid: false, transparent: true, hardness: 2, color: '#5C3A1E', drops: BLOCKS.WOOD },
    [BLOCKS.LEAVES]: { name: 'Leaves', solid: false, transparent: true, hardness: 0.5, color: '#228B22', drops: null },
    [BLOCKS.SAND]: { name: 'Sand', solid: true, transparent: false, hardness: 1, color: '#E8C872', drops: BLOCKS.SAND },
    [BLOCKS.WATER]: { name: 'Water', solid: false, transparent: true, hardness: 0, color: 'rgba(30,144,255,0.6)', liquid: true },
    [BLOCKS.TORCH]: { name: 'Torch', solid: false, transparent: true, hardness: 0.1, light: 12, drops: BLOCKS.TORCH },
    [BLOCKS.WORKBENCH]: { name: 'Workbench', solid: false, transparent: false, hardness: 2, color: '#DEB887', drops: BLOCKS.WORKBENCH, station: true, platform: true },
    [BLOCKS.FURNACE]: { name: 'Furnace', solid: false, transparent: false, hardness: 3, color: '#696969', drops: BLOCKS.FURNACE, station: true, platform: true },
    [BLOCKS.CHEST]: { name: 'Chest', solid: true, transparent: false, hardness: 2, color: '#DAA520', drops: BLOCKS.CHEST },
    [BLOCKS.WOOD_PLATFORM]: { name: 'Platform', solid: false, transparent: true, hardness: 1, color: '#A0522D', platform: true, drops: BLOCKS.WOOD_PLATFORM },
    [BLOCKS.COBBLESTONE]: { name: 'Stone', solid: true, transparent: false, hardness: 3, color: '#6B6B6B', drops: BLOCKS.COBBLESTONE },
    [BLOCKS.BRICK]: { name: 'Brick', solid: true, transparent: false, hardness: 4, color: '#B33A2A', drops: BLOCKS.BRICK },
    [BLOCKS.GLASS]: { name: 'Glass', solid: true, transparent: true, hardness: 1, color: '#C8E8F0', drops: BLOCKS.GLASS },
    [BLOCKS.HELLSTONE]: { name: 'Hellstone', solid: true, transparent: false, hardness: 10, color: '#FF4500', drops: BLOCKS.HELLSTONE },
    [BLOCKS.OBSIDIAN]: { name: 'Obsidian', solid: true, transparent: false, hardness: 15, color: '#1a0a2e', drops: BLOCKS.OBSIDIAN },
    [BLOCKS.MUSHROOM]: { name: 'Mushroom', solid: false, transparent: true, hardness: 0.1, color: '#FF6B6B', drops: BLOCKS.MUSHROOM },
    [BLOCKS.FLOWER_RED]: { name: 'Red Flower', solid: false, transparent: true, hardness: 0.1, color: '#FF0000', drops: BLOCKS.FLOWER_RED },
    [BLOCKS.FLOWER_YELLOW]: { name: 'Yellow Flower', solid: false, transparent: true, hardness: 0.1, color: '#FFFF00', drops: BLOCKS.FLOWER_YELLOW },
    [BLOCKS.TALL_GRASS]: { name: 'Tall Grass', solid: false, transparent: true, hardness: 0.1, color: '#90EE90', drops: null },
    [BLOCKS.CLAY]: { name: 'Clay', solid: true, transparent: false, hardness: 2, color: '#C47A52', drops: BLOCKS.CLAY },
    [BLOCKS.MUD]: { name: 'Mud', solid: true, transparent: false, hardness: 1, color: '#4A3728', drops: BLOCKS.MUD },
    [BLOCKS.SNOW]: { name: 'Snow', solid: true, transparent: false, hardness: 1, color: '#FFFAFA', drops: BLOCKS.SNOW },
    [BLOCKS.ICE]: { name: 'Ice', solid: true, transparent: true, hardness: 2, color: '#87CEEB', drops: BLOCKS.ICE },
    [BLOCKS.LAVA]: { name: 'Lava', solid: false, transparent: true, hardness: 0, color: 'rgba(255,69,0,0.8)', liquid: true, damage: 50, light: 10 },
    [BLOCKS.CORRUPT_GRASS]: { name: 'Corrupt Grass', solid: true, transparent: false, hardness: 1, color: '#3d2d4d', topColor: '#6b4d8a', drops: BLOCKS.DIRT },
    [BLOCKS.EBONSTONE]: { name: 'Ebonstone', solid: true, transparent: false, hardness: 6, color: '#2a1a3a', drops: BLOCKS.EBONSTONE },
    [BLOCKS.DEMONITE_ORE]: { name: 'Demonite Ore', solid: true, transparent: false, hardness: 7, color: '#6633aa', drops: BLOCKS.DEMONITE_ORE },
    [BLOCKS.CRIMSON_GRASS]: { name: 'Crimson Grass', solid: true, transparent: false, hardness: 1, color: '#4d1a1a', topColor: '#8b0000', drops: BLOCKS.DIRT },
    [BLOCKS.CRIMSTONE]: { name: 'Crimstone', solid: true, transparent: false, hardness: 6, color: '#5a1a1a', drops: BLOCKS.CRIMSTONE },
    [BLOCKS.CRIMTANE_ORE]: { name: 'Crimtane Ore', solid: true, transparent: false, hardness: 7, color: '#aa1133', drops: BLOCKS.CRIMTANE_ORE },
    [BLOCKS.VILE_MUSHROOM]: { name: 'Vile Mushroom', solid: false, transparent: true, hardness: 0.1, color: '#6633aa', drops: BLOCKS.VILE_MUSHROOM },
    [BLOCKS.DOOR]: { name: 'Door', solid: true, transparent: true, hardness: 1, color: '#8B5E3C', drops: BLOCKS.DOOR, door: true }
};

// Items
const ITEMS = {
    // Pickaxes (100-119)
    WOOD_PICKAXE: 100, STONE_PICKAXE: 101, COPPER_PICKAXE: 102, IRON_PICKAXE: 103,
    GOLD_PICKAXE: 104, DIAMOND_PICKAXE: 105, NIGHTMARE_PICKAXE: 106, DEATHBRINGER_PICKAXE: 107,
    MOLTEN_PICKAXE: 108,
    // Axes (120-129)
    WOOD_AXE: 120, STONE_AXE: 121, COPPER_AXE: 122, IRON_AXE: 123, GOLD_AXE: 124,
    // Hammers (130-139)
    WOOD_HAMMER: 130, COPPER_HAMMER: 131, IRON_HAMMER: 132, GOLD_HAMMER: 133,
    // Swords (140-169)
    WOOD_SWORD: 140, CACTUS_SWORD: 141, COPPER_SHORTSWORD: 142, COPPER_BROADSWORD: 143,
    IRON_SHORTSWORD: 144, IRON_BROADSWORD: 145, GOLD_SHORTSWORD: 146, GOLD_BROADSWORD: 147,
    DIAMOND_SWORD: 148, LIGHTS_BANE: 149, BLOOD_BUTCHERER: 150, BLADE_OF_GRASS: 151,
    FIERY_GREATSWORD: 152, NIGHTS_EDGE: 153, MURAMASA: 154, STARFURY: 155,
    ENCHANTED_SWORD: 156, ARKHALIS: 157, ICE_BLADE: 158,
    // Spears (170-179)
    WOOD_SPEAR: 170, COPPER_SPEAR: 171, IRON_SPEAR: 172, GOLD_SPEAR: 173, 
    DARK_LANCE: 174, TRIDENT: 175, SWORDFISH: 176,
    // Bows (180-189)
    WOOD_BOW: 180, COPPER_BOW: 181, IRON_BOW: 182, GOLD_BOW: 183, 
    DEMON_BOW: 184, MOLTEN_FURY: 185, TENDON_BOW: 186,
    // Arrows (190-199)
    WOOD_ARROW: 190, FLAMING_ARROW: 191, JESTER_ARROW: 192, UNHOLY_ARROW: 193, 
    HELLFIRE_ARROW: 194, FROSTBURN_ARROW: 195,
    // Magic (200-229)
    WAND_OF_SPARKING: 200, WATER_BOLT: 201, VILETHORN: 202, MAGIC_MISSILE: 203,
    FLAMELASH: 204, DEMON_SCYTHE: 205, SPACE_GUN: 206, AQUA_SCEPTER: 207,
    FLOWER_OF_FIRE: 208, CRIMSON_ROD: 209, THUNDER_ZAPPER: 210, GRAY_ZAPINATOR: 211,
    // Boomerangs (230-239)
    WOOD_BOOMERANG: 230, ENCHANTED_BOOMERANG: 231, FLAMARANG: 232, THORN_CHAKRAM: 233, ICE_BOOMERANG: 234,
    // Yoyos (240-249)
    WOOD_YOYO: 240, RALLY: 241, MALAISE: 242, ARTERY: 243, AMAZON: 244, CASCADE: 245,
    // Flails (250-259)
    CHAIN_KNIFE: 250, BALL_O_HURT: 251, BLUE_MOON: 252, SUNFURY: 253,
    // Bars & Materials (300-349)
    COPPER_BAR: 300, IRON_BAR: 301, GOLD_BAR: 302, DEMONITE_BAR: 303, CRIMTANE_BAR: 304,
    HELLSTONE_BAR: 305, METEORITE_BAR: 306,
    WOOD_PLANK: 310, STICK: 311, GEL: 312, LENS: 313, FALLEN_STAR: 314,
    COBWEB: 315, STINGER: 316, VINE: 317, JUNGLE_SPORES: 318, SHADOW_SCALE: 319,
    TISSUE_SAMPLE: 320, BONE: 321, ROTTEN_CHUNK: 322, VERTEBRAE: 323, FEATHER: 324,
    SHARK_FIN: 325, HOOK: 326, CHAIN: 327, OBSIDIAN_SKULL: 328, ANTLION_MANDIBLE: 329,
    // Consumables (400-449)
    HEALING_POTION: 400, GREATER_HEALING_POTION: 401, MANA_POTION: 402, GREATER_MANA_POTION: 403,
    HEART_CRYSTAL: 404, MANA_CRYSTAL: 405,
    IRONSKIN_POTION: 410, SWIFTNESS_POTION: 411, REGENERATION_POTION: 412, SHINE_POTION: 413,
    NIGHT_OWL_POTION: 414, SPELUNKER_POTION: 415, ARCHERY_POTION: 416, HUNTER_POTION: 417,
    // Tools & Accessories (450-499)
    MAGIC_MIRROR: 450, GRAPPLING_HOOK: 451, IVY_WHIP: 452, DUAL_HOOK: 453,
    HERMES_BOOTS: 460, ROCKET_BOOTS: 461, SPECTRE_BOOTS: 462, LIGHTNING_BOOTS: 463,
    CLOUD_IN_BOTTLE: 464, SHINY_RED_BALLOON: 465, LUCKY_HORSESHOE: 466, FART_IN_JAR: 467,
    BAND_OF_REGENERATION: 468, BAND_OF_STARPOWER: 469, MANA_FLOWER: 470,
    AGLET: 471, ANKLET_OF_WIND: 472, FERAL_CLAWS: 473, TITAN_GLOVE: 474,
    COBALT_SHIELD: 475, OBSIDIAN_SHIELD: 476, CROSS_NECKLACE: 477, STAR_CLOAK: 478,
    // Armor - Helmets (500-509)
    WOOD_HELMET: 500, COPPER_HELMET: 501, IRON_HELMET: 502, GOLD_HELMET: 503, SHADOW_HELMET: 504, CRIMSON_HELMET: 505, MOLTEN_HELMET: 506,
    // Armor - Chestplates (510-519)
    WOOD_CHESTPLATE: 510, COPPER_CHESTPLATE: 511, IRON_CHESTPLATE: 512, GOLD_CHESTPLATE: 513, SHADOW_CHESTPLATE: 514, CRIMSON_CHESTPLATE: 515, MOLTEN_CHESTPLATE: 516,
    // Armor - Leggings (520-529)
    WOOD_LEGGINGS: 520, COPPER_LEGGINGS: 521, IRON_LEGGINGS: 522, GOLD_LEGGINGS: 523, SHADOW_LEGGINGS: 524, CRIMSON_LEGGINGS: 525, MOLTEN_LEGGINGS: 526,
    // Guns (540-559)
    FLINTLOCK_PISTOL: 540, MUSKET: 541, HANDGUN: 542, PHOENIX_BLASTER: 543, STAR_CANNON: 544, MINISHARK: 545,
    // Bullets (560-569)
    MUSKET_BALL: 560, SILVER_BULLET: 561, METEOR_SHOT: 562,
    // Zenith weapons (570-579)
    ZENITH_BOW: 570, ZENITH_BLASTER: 571, ZENITH_STAFF: 572,
    // Throwables (580-589)
    GRENADE: 580, NUKE: 581
};

const ITEM_DATA = {
    // Pickaxes
    [ITEMS.WOOD_PICKAXE]: { name: 'Wood Pickaxe', type: 'pickaxe', power: 35, damage: 3, speed: 20, size: 0.7 },
    [ITEMS.STONE_PICKAXE]: { name: 'Stone Pickaxe', type: 'pickaxe', power: 50, damage: 5, speed: 18, size: 0.75 },
    [ITEMS.COPPER_PICKAXE]: { name: 'Copper Pickaxe', type: 'pickaxe', power: 55, damage: 6, speed: 16, size: 0.8 },
    [ITEMS.IRON_PICKAXE]: { name: 'Iron Pickaxe', type: 'pickaxe', power: 65, damage: 7, speed: 14, size: 0.85 },
    [ITEMS.GOLD_PICKAXE]: { name: 'Gold Pickaxe', type: 'pickaxe', power: 75, damage: 8, speed: 12, size: 0.9 },
    [ITEMS.DIAMOND_PICKAXE]: { name: 'Diamond Pickaxe', type: 'pickaxe', power: 100, damage: 12, speed: 10, size: 0.95, rarity: 'rare' },
    [ITEMS.NIGHTMARE_PICKAXE]: { name: 'Nightmare Pickaxe', type: 'pickaxe', power: 120, damage: 15, speed: 9, size: 1.0, rarity: 'rare' },
    [ITEMS.DEATHBRINGER_PICKAXE]: { name: 'Deathbringer Pickaxe', type: 'pickaxe', power: 125, damage: 16, speed: 7, size: 1.0, rarity: 'rare' },
    [ITEMS.MOLTEN_PICKAXE]: { name: 'Molten Pickaxe', type: 'pickaxe', power: 150, damage: 18, speed: 5, size: 1.05, rarity: 'rare' },
    // Axes
    [ITEMS.WOOD_AXE]: { name: 'Wood Axe', type: 'axe', power: 30, damage: 4, speed: 24, size: 0.7 },
    [ITEMS.STONE_AXE]: { name: 'Stone Axe', type: 'axe', power: 45, damage: 6, speed: 22, size: 0.75 },
    [ITEMS.COPPER_AXE]: { name: 'Copper Axe', type: 'axe', power: 55, damage: 7, speed: 20, size: 0.8 },
    [ITEMS.IRON_AXE]: { name: 'Iron Axe', type: 'axe', power: 65, damage: 9, speed: 18, size: 0.85 },
    [ITEMS.GOLD_AXE]: { name: 'Gold Axe', type: 'axe', power: 75, damage: 11, speed: 14, size: 0.9 },
    // Hammers
    [ITEMS.WOOD_HAMMER]: { name: 'Wood Hammer', type: 'hammer', power: 25, damage: 3, speed: 30, size: 0.8 },
    [ITEMS.COPPER_HAMMER]: { name: 'Copper Hammer', type: 'hammer', power: 45, damage: 6, speed: 26, size: 0.85 },
    [ITEMS.IRON_HAMMER]: { name: 'Iron Hammer', type: 'hammer', power: 60, damage: 9, speed: 22, size: 0.9 },
    [ITEMS.GOLD_HAMMER]: { name: 'Gold Hammer', type: 'hammer', power: 75, damage: 12, speed: 14, size: 0.95 },
    // Swords
    [ITEMS.WOOD_SWORD]: { name: 'Wood Sword', type: 'sword', damage: 8, speed: 20, knockback: 4, size: 0.8 },
    [ITEMS.CACTUS_SWORD]: { name: 'Cactus Sword', type: 'sword', damage: 12, speed: 18, knockback: 4, size: 0.85 },
    [ITEMS.COPPER_SHORTSWORD]: { name: 'Copper Shortsword', type: 'sword', damage: 9, speed: 12, knockback: 3, size: 0.6 },
    [ITEMS.COPPER_BROADSWORD]: { name: 'Copper Broadsword', type: 'sword', damage: 14, speed: 18, knockback: 5, size: 0.9 },
    [ITEMS.IRON_SHORTSWORD]: { name: 'Iron Shortsword', type: 'sword', damage: 12, speed: 11, knockback: 3, size: 0.65 },
    [ITEMS.IRON_BROADSWORD]: { name: 'Iron Broadsword', type: 'sword', damage: 20, speed: 16, knockback: 5, size: 0.95 },
    [ITEMS.GOLD_SHORTSWORD]: { name: 'Gold Shortsword', type: 'sword', damage: 15, speed: 10, knockback: 3, size: 0.7 },
    [ITEMS.GOLD_BROADSWORD]: { name: 'Gold Broadsword', type: 'sword', damage: 26, speed: 14, knockback: 6, size: 1.0 },
    [ITEMS.DIAMOND_SWORD]: { name: 'Diamond Blade', type: 'sword', damage: 38, speed: 10, knockback: 6, size: 1.1, rarity: 'rare' },
    [ITEMS.LIGHTS_BANE]: { name: "Light's Bane", type: 'sword', damage: 32, speed: 12, knockback: 5, size: 1.0, rarity: 'rare' },
    [ITEMS.BLOOD_BUTCHERER]: { name: 'Blood Butcherer', type: 'sword', damage: 35, speed: 11, knockback: 5, size: 1.05, rarity: 'rare' },
    [ITEMS.BLADE_OF_GRASS]: { name: 'Blade of Grass', type: 'sword', damage: 40, speed: 14, knockback: 4, size: 1.15, rarity: 'rare' },
    [ITEMS.FIERY_GREATSWORD]: { name: 'Fiery Greatsword', type: 'sword', damage: 52, speed: 16, knockback: 7, size: 1.3, rarity: 'rare' },
    [ITEMS.NIGHTS_EDGE]: { name: "Night's Edge", type: 'sword', damage: 65, speed: 14, knockback: 7, size: 1.4, rarity: 'legendary' },
    [ITEMS.MURAMASA]: { name: 'Muramasa', type: 'sword', damage: 30, speed: 8, knockback: 3, size: 1.0, rarity: 'rare' },
    [ITEMS.STARFURY]: { name: 'Starfury', type: 'sword', damage: 28, speed: 12, knockback: 5, size: 1.0, rarity: 'rare', special: 'starfall' },
    [ITEMS.ENCHANTED_SWORD]: { name: 'Enchanted Sword', type: 'sword', damage: 24, speed: 14, knockback: 4, size: 1.0, rarity: 'rare', special: 'beam' },
    [ITEMS.ARKHALIS]: { name: 'Arkhalis', type: 'sword', damage: 20, speed: 4, knockback: 2, size: 0.9, rarity: 'legendary' },
    [ITEMS.ICE_BLADE]: { name: 'Ice Blade', type: 'sword', damage: 22, speed: 14, knockback: 4, size: 1.0, rarity: 'rare', special: 'frostbolt' },
    // Spears
    [ITEMS.WOOD_SPEAR]: { name: 'Wood Spear', type: 'spear', damage: 10, speed: 24, knockback: 5, size: 1.2, range: 60 },
    [ITEMS.COPPER_SPEAR]: { name: 'Copper Spear', type: 'spear', damage: 14, speed: 22, knockback: 5, size: 1.25, range: 65 },
    [ITEMS.IRON_SPEAR]: { name: 'Iron Spear', type: 'spear', damage: 19, speed: 20, knockback: 6, size: 1.3, range: 70 },
    [ITEMS.GOLD_SPEAR]: { name: 'Gold Spear', type: 'spear', damage: 24, speed: 18, knockback: 6, size: 1.35, range: 75 },
    [ITEMS.DARK_LANCE]: { name: 'Dark Lance', type: 'spear', damage: 38, speed: 14, knockback: 7, size: 1.5, range: 90, rarity: 'rare' },
    [ITEMS.TRIDENT]: { name: 'Trident', type: 'spear', damage: 32, speed: 16, knockback: 6, size: 1.4, range: 80, rarity: 'rare' },
    [ITEMS.SWORDFISH]: { name: 'Swordfish', type: 'spear', damage: 26, speed: 18, knockback: 5, size: 1.3, range: 75, rarity: 'rare' },
    // Bows
    [ITEMS.WOOD_BOW]: { name: 'Wood Bow', type: 'bow', damage: 4, speed: 24, knockback: 1, size: 0.9 },
    [ITEMS.COPPER_BOW]: { name: 'Copper Bow', type: 'bow', damage: 7, speed: 20, knockback: 1, size: 0.95 },
    [ITEMS.IRON_BOW]: { name: 'Iron Bow', type: 'bow', damage: 11, speed: 18, knockback: 2, size: 1.0 },
    [ITEMS.GOLD_BOW]: { name: 'Gold Bow', type: 'bow', damage: 32, speed: 40, knockback: 5, size: 1.2 },
    [ITEMS.DEMON_BOW]: { name: 'Demon Bow', type: 'bow', damage: 15, speed: 14, knockback: 2, size: 1.1, rarity: 'rare' },
    [ITEMS.TENDON_BOW]: { name: 'Tendon Bow', type: 'bow', damage: 16, speed: 14, knockback: 2, size: 1.1, rarity: 'rare' },
    [ITEMS.MOLTEN_FURY]: { name: 'Molten Fury', type: 'bow', damage: 21, speed: 12, knockback: 3, size: 1.2, rarity: 'rare' },
    // Arrows
    [ITEMS.WOOD_ARROW]: { name: 'Wood Arrow', type: 'ammo', damage: 3, stackable: true },
    [ITEMS.FLAMING_ARROW]: { name: 'Flaming Arrow', type: 'ammo', damage: 7, stackable: true },
    [ITEMS.JESTER_ARROW]: { name: "Jester's Arrow", type: 'ammo', damage: 10, stackable: true, rarity: 'magic' },
    [ITEMS.UNHOLY_ARROW]: { name: 'Unholy Arrow', type: 'ammo', damage: 12, stackable: true, rarity: 'rare' },
    [ITEMS.HELLFIRE_ARROW]: { name: 'Hellfire Arrow', type: 'ammo', damage: 16, stackable: true, rarity: 'rare' },
    [ITEMS.FROSTBURN_ARROW]: { name: 'Frostburn Arrow', type: 'ammo', damage: 9, stackable: true, rarity: 'rare' },
    // Magic weapons
    [ITEMS.WAND_OF_SPARKING]: { name: 'Wand of Sparking', type: 'magic', damage: 9, speed: 14, mana: 2, projectile: 'spark', rarity: 'magic' },
    [ITEMS.WATER_BOLT]: { name: 'Water Bolt', type: 'magic', damage: 22, speed: 12, mana: 8, projectile: 'water_bolt', rarity: 'magic' },
    [ITEMS.VILETHORN]: { name: 'Vilethorn', type: 'magic', damage: 14, speed: 18, mana: 10, projectile: 'vilethorn', rarity: 'magic' },
    [ITEMS.MAGIC_MISSILE]: { name: 'Magic Missile', type: 'magic', damage: 28, speed: 10, mana: 12, projectile: 'magic_missile', rarity: 'magic' },
    [ITEMS.FLAMELASH]: { name: 'Flamelash', type: 'magic', damage: 35, speed: 8, mana: 16, projectile: 'flamelash', rarity: 'rare' },
    [ITEMS.DEMON_SCYTHE]: { name: 'Demon Scythe', type: 'magic', damage: 42, speed: 14, mana: 18, projectile: 'demon_scythe', rarity: 'rare' },
    [ITEMS.SPACE_GUN]: { name: 'Space Gun', type: 'magic', damage: 20, speed: 6, mana: 6, projectile: 'laser', rarity: 'rare' },
    [ITEMS.AQUA_SCEPTER]: { name: 'Aqua Scepter', type: 'magic', damage: 18, speed: 8, mana: 5, projectile: 'water_stream', rarity: 'magic' },
    [ITEMS.FLOWER_OF_FIRE]: { name: 'Flower of Fire', type: 'magic', damage: 48, speed: 12, mana: 14, projectile: 'fireball', rarity: 'rare' },
    [ITEMS.CRIMSON_ROD]: { name: 'Crimson Rod', type: 'magic', damage: 16, speed: 20, mana: 6, projectile: 'blood_rain', rarity: 'magic' },
    [ITEMS.THUNDER_ZAPPER]: { name: 'Thunder Zapper', type: 'magic', damage: 12, speed: 10, mana: 4, projectile: 'thunder', rarity: 'magic' },
    [ITEMS.GRAY_ZAPINATOR]: { name: 'Gray Zapinator', type: 'magic', damage: 25, speed: 8, mana: 8, projectile: 'zapinator', rarity: 'rare' },
    // Boomerangs
    [ITEMS.WOOD_BOOMERANG]: { name: 'Wood Boomerang', type: 'boomerang', damage: 6, speed: 16, knockback: 6, size: 0.8 },
    [ITEMS.ENCHANTED_BOOMERANG]: { name: 'Enchanted Boomerang', type: 'boomerang', damage: 14, speed: 12, knockback: 8, size: 0.9, rarity: 'magic' },
    [ITEMS.FLAMARANG]: { name: 'Flamarang', type: 'boomerang', damage: 38, speed: 25, knockback: 12, size: 1.0, rarity: 'rare' },
    [ITEMS.THORN_CHAKRAM]: { name: 'Thorn Chakram', type: 'boomerang', damage: 19, speed: 15, knockback: 8, size: 0.95, rarity: 'rare' },
    [ITEMS.ICE_BOOMERANG]: { name: 'Ice Boomerang', type: 'boomerang', damage: 21, speed: 12, knockback: 7, size: 0.9, rarity: 'rare' },
    // Yoyos
    [ITEMS.WOOD_YOYO]: { name: 'Wood Yoyo', type: 'yoyo', damage: 5, speed: 18, knockback: 2, size: 0.6, range: 80 },
    [ITEMS.RALLY]: { name: 'Rally', type: 'yoyo', damage: 8, speed: 16, knockback: 2, size: 0.65, range: 100, rarity: 'magic' },
    [ITEMS.MALAISE]: { name: 'Malaise', type: 'yoyo', damage: 12, speed: 14, knockback: 3, size: 0.7, range: 120, rarity: 'rare' },
    [ITEMS.ARTERY]: { name: 'Artery', type: 'yoyo', damage: 14, speed: 14, knockback: 3, size: 0.7, range: 120, rarity: 'rare' },
    [ITEMS.AMAZON]: { name: 'Amazon', type: 'yoyo', damage: 18, speed: 12, knockback: 3, size: 0.75, range: 140, rarity: 'rare' },
    [ITEMS.CASCADE]: { name: 'Cascade', type: 'yoyo', damage: 25, speed: 10, knockback: 4, size: 0.8, range: 160, rarity: 'rare' },
    // Flails
    [ITEMS.CHAIN_KNIFE]: { name: 'Chain Knife', type: 'flail', damage: 14, speed: 18, knockback: 4, size: 0.7, range: 60 },
    [ITEMS.BALL_O_HURT]: { name: "Ball O' Hurt", type: 'flail', damage: 22, speed: 20, knockback: 6, size: 0.9, range: 80, rarity: 'rare' },
    [ITEMS.BLUE_MOON]: { name: 'Blue Moon', type: 'flail', damage: 28, speed: 18, knockback: 7, size: 1.0, range: 100, rarity: 'rare' },
    [ITEMS.SUNFURY]: { name: 'Sunfury', type: 'flail', damage: 40, speed: 14, knockback: 8, size: 1.1, range: 120, rarity: 'rare' },
    // Bars
    [ITEMS.COPPER_BAR]: { name: 'Copper Bar', type: 'material', stackable: true },
    [ITEMS.IRON_BAR]: { name: 'Iron Bar', type: 'material', stackable: true },
    [ITEMS.GOLD_BAR]: { name: 'Gold Bar', type: 'material', stackable: true },
    [ITEMS.DEMONITE_BAR]: { name: 'Demonite Bar', type: 'material', stackable: true, rarity: 'rare' },
    [ITEMS.CRIMTANE_BAR]: { name: 'Crimtane Bar', type: 'material', stackable: true, rarity: 'rare' },
    [ITEMS.HELLSTONE_BAR]: { name: 'Hellstone Bar', type: 'material', stackable: true, rarity: 'rare' },
    [ITEMS.METEORITE_BAR]: { name: 'Meteorite Bar', type: 'material', stackable: true, rarity: 'rare' },
    // Materials
    [ITEMS.WOOD_PLANK]: { name: 'Wood Plank', type: 'material', stackable: true },
    [ITEMS.STICK]: { name: 'Stick', type: 'material', stackable: true },
    [ITEMS.GEL]: { name: 'Gel', type: 'material', stackable: true },
    [ITEMS.LENS]: { name: 'Lens', type: 'material', stackable: true },
    [ITEMS.FALLEN_STAR]: { name: 'Fallen Star', type: 'material', stackable: true, rarity: 'magic' },
    [ITEMS.COBWEB]: { name: 'Cobweb', type: 'material', stackable: true },
    [ITEMS.STINGER]: { name: 'Stinger', type: 'material', stackable: true },
    [ITEMS.VINE]: { name: 'Vine', type: 'material', stackable: true },
    [ITEMS.JUNGLE_SPORES]: { name: 'Jungle Spores', type: 'material', stackable: true },
    [ITEMS.SHADOW_SCALE]: { name: 'Shadow Scale', type: 'material', stackable: true, rarity: 'rare' },
    [ITEMS.TISSUE_SAMPLE]: { name: 'Tissue Sample', type: 'material', stackable: true, rarity: 'rare' },
    [ITEMS.BONE]: { name: 'Bone', type: 'material', stackable: true },
    [ITEMS.ROTTEN_CHUNK]: { name: 'Rotten Chunk', type: 'material', stackable: true },
    [ITEMS.VERTEBRAE]: { name: 'Vertebrae', type: 'material', stackable: true },
    [ITEMS.FEATHER]: { name: 'Feather', type: 'material', stackable: true },
    [ITEMS.SHARK_FIN]: { name: 'Shark Fin', type: 'material', stackable: true },
    [ITEMS.HOOK]: { name: 'Hook', type: 'material', stackable: true },
    [ITEMS.CHAIN]: { name: 'Chain', type: 'material', stackable: true },
    [ITEMS.OBSIDIAN_SKULL]: { name: 'Obsidian Skull', type: 'material', stackable: true },
    [ITEMS.ANTLION_MANDIBLE]: { name: 'Antlion Mandible', type: 'material', stackable: true },
    // Consumables
    [ITEMS.HEALING_POTION]: { name: 'Healing Potion', type: 'consumable', heal: 50, stackable: true },
    [ITEMS.GREATER_HEALING_POTION]: { name: 'Greater Healing Potion', type: 'consumable', heal: 120, stackable: true, rarity: 'rare' },
    [ITEMS.MANA_POTION]: { name: 'Mana Potion', type: 'consumable', manaRestore: 100, stackable: true, rarity: 'magic' },
    [ITEMS.GREATER_MANA_POTION]: { name: 'Greater Mana Potion', type: 'consumable', manaRestore: 200, stackable: true, rarity: 'magic' },
    [ITEMS.HEART_CRYSTAL]: { name: 'Heart Crystal', type: 'consumable', maxHealth: 20, stackable: true, rarity: 'rare' },
    [ITEMS.MANA_CRYSTAL]: { name: 'Mana Crystal', type: 'consumable', maxMana: 20, stackable: true, rarity: 'magic' },
    [ITEMS.IRONSKIN_POTION]: { name: 'Ironskin Potion', type: 'consumable', buff: 'defense', stackable: true },
    [ITEMS.SWIFTNESS_POTION]: { name: 'Swiftness Potion', type: 'consumable', buff: 'speed', stackable: true },
    [ITEMS.REGENERATION_POTION]: { name: 'Regeneration Potion', type: 'consumable', buff: 'regen', stackable: true },
    [ITEMS.SHINE_POTION]: { name: 'Shine Potion', type: 'consumable', buff: 'light', stackable: true },
    [ITEMS.NIGHT_OWL_POTION]: { name: 'Night Owl Potion', type: 'consumable', buff: 'nightvision', stackable: true },
    [ITEMS.SPELUNKER_POTION]: { name: 'Spelunker Potion', type: 'consumable', buff: 'spelunker', stackable: true },
    [ITEMS.ARCHERY_POTION]: { name: 'Archery Potion', type: 'consumable', buff: 'archery', stackable: true },
    [ITEMS.HUNTER_POTION]: { name: 'Hunter Potion', type: 'consumable', buff: 'hunter', stackable: true },
    // Tools & Accessories
    [ITEMS.MAGIC_MIRROR]: { name: 'Magic Mirror', type: 'tool', effect: 'teleport', stackable: false, rarity: 'magic' },
    [ITEMS.GRAPPLING_HOOK]: { name: 'Grappling Hook', type: 'tool', effect: 'grapple', stackable: false },
    [ITEMS.IVY_WHIP]: { name: 'Ivy Whip', type: 'tool', effect: 'grapple', stackable: false, rarity: 'rare' },
    [ITEMS.DUAL_HOOK]: { name: 'Dual Hook', type: 'tool', effect: 'grapple', stackable: false, rarity: 'rare' },
    [ITEMS.HERMES_BOOTS]: { name: 'Hermes Boots', type: 'accessory', effect: 'speed', stackable: false, rarity: 'rare' },
    [ITEMS.ROCKET_BOOTS]: { name: 'Rocket Boots', type: 'accessory', effect: 'flight', stackable: false, rarity: 'rare' },
    [ITEMS.SPECTRE_BOOTS]: { name: 'Spectre Boots', type: 'accessory', effect: 'speedflight', stackable: false, rarity: 'rare' },
    [ITEMS.LIGHTNING_BOOTS]: { name: 'Lightning Boots', type: 'accessory', effect: 'fastspeedflight', stackable: false, rarity: 'legendary' },
    [ITEMS.CLOUD_IN_BOTTLE]: { name: 'Cloud in a Bottle', type: 'accessory', effect: 'doublejump', stackable: false, rarity: 'rare' },
    [ITEMS.SHINY_RED_BALLOON]: { name: 'Shiny Red Balloon', type: 'accessory', effect: 'jumpboost', stackable: false, rarity: 'rare' },
    [ITEMS.LUCKY_HORSESHOE]: { name: 'Lucky Horseshoe', type: 'accessory', effect: 'nofall', stackable: false, rarity: 'rare' },
    [ITEMS.FART_IN_JAR]: { name: 'Fart in a Jar', type: 'accessory', effect: 'doublejump', stackable: false, rarity: 'rare' },
    [ITEMS.BAND_OF_REGENERATION]: { name: 'Band of Regeneration', type: 'accessory', effect: 'regen', stackable: false, rarity: 'rare' },
    [ITEMS.BAND_OF_STARPOWER]: { name: 'Band of Starpower', type: 'accessory', effect: 'mana', stackable: false, rarity: 'magic' },
    [ITEMS.MANA_FLOWER]: { name: 'Mana Flower', type: 'accessory', effect: 'automana', stackable: false, rarity: 'rare' },
    [ITEMS.AGLET]: { name: 'Aglet', type: 'accessory', effect: 'movespeed', stackable: false },
    [ITEMS.ANKLET_OF_WIND]: { name: 'Anklet of the Wind', type: 'accessory', effect: 'movespeed', stackable: false, rarity: 'rare' },
    [ITEMS.FERAL_CLAWS]: { name: 'Feral Claws', type: 'accessory', effect: 'attackspeed', stackable: false, rarity: 'rare' },
    [ITEMS.TITAN_GLOVE]: { name: 'Titan Glove', type: 'accessory', effect: 'knockback', stackable: false, rarity: 'rare' },
    [ITEMS.COBALT_SHIELD]: { name: 'Cobalt Shield', type: 'accessory', effect: 'noknockback', stackable: false, rarity: 'rare' },
    [ITEMS.OBSIDIAN_SHIELD]: { name: 'Obsidian Shield', type: 'accessory', effect: 'noknockbackfire', stackable: false, rarity: 'rare' },
    [ITEMS.CROSS_NECKLACE]: { name: 'Cross Necklace', type: 'accessory', effect: 'invincibility', stackable: false, rarity: 'rare' },
    [ITEMS.STAR_CLOAK]: { name: 'Star Cloak', type: 'accessory', effect: 'staronhit', stackable: false, rarity: 'rare' },
    // Armor - Helmets
    [ITEMS.WOOD_HELMET]: { name: 'Wood Helmet', type: 'helmet', defense: 1, stackable: false },
    [ITEMS.COPPER_HELMET]: { name: 'Copper Helmet', type: 'helmet', defense: 2, stackable: false },
    [ITEMS.IRON_HELMET]: { name: 'Iron Helmet', type: 'helmet', defense: 3, stackable: false },
    [ITEMS.GOLD_HELMET]: { name: 'Gold Helmet', type: 'helmet', defense: 4, stackable: false },
    [ITEMS.SHADOW_HELMET]: { name: 'Shadow Helmet', type: 'helmet', defense: 6, stackable: false, rarity: 'rare' },
    [ITEMS.CRIMSON_HELMET]: { name: 'Crimson Helmet', type: 'helmet', defense: 6, stackable: false, rarity: 'rare' },
    [ITEMS.MOLTEN_HELMET]: { name: 'Molten Helmet', type: 'helmet', defense: 8, stackable: false, rarity: 'rare' },
    // Armor - Chestplates
    [ITEMS.WOOD_CHESTPLATE]: { name: 'Wood Chestplate', type: 'chestplate', defense: 1, stackable: false },
    [ITEMS.COPPER_CHESTPLATE]: { name: 'Copper Chestplate', type: 'chestplate', defense: 3, stackable: false },
    [ITEMS.IRON_CHESTPLATE]: { name: 'Iron Chestplate', type: 'chestplate', defense: 4, stackable: false },
    [ITEMS.GOLD_CHESTPLATE]: { name: 'Gold Chestplate', type: 'chestplate', defense: 5, stackable: false },
    [ITEMS.SHADOW_CHESTPLATE]: { name: 'Shadow Chestplate', type: 'chestplate', defense: 8, stackable: false, rarity: 'rare' },
    [ITEMS.CRIMSON_CHESTPLATE]: { name: 'Crimson Chestplate', type: 'chestplate', defense: 8, stackable: false, rarity: 'rare' },
    [ITEMS.MOLTEN_CHESTPLATE]: { name: 'Molten Chestplate', type: 'chestplate', defense: 10, stackable: false, rarity: 'rare' },
    // Armor - Leggings
    [ITEMS.WOOD_LEGGINGS]: { name: 'Wood Leggings', type: 'leggings', defense: 1, stackable: false },
    [ITEMS.COPPER_LEGGINGS]: { name: 'Copper Leggings', type: 'leggings', defense: 2, stackable: false },
    [ITEMS.IRON_LEGGINGS]: { name: 'Iron Leggings', type: 'leggings', defense: 3, stackable: false },
    [ITEMS.GOLD_LEGGINGS]: { name: 'Gold Leggings', type: 'leggings', defense: 4, stackable: false },
    [ITEMS.SHADOW_LEGGINGS]: { name: 'Shadow Leggings', type: 'leggings', defense: 5, stackable: false, rarity: 'rare' },
    [ITEMS.CRIMSON_LEGGINGS]: { name: 'Crimson Leggings', type: 'leggings', defense: 5, stackable: false, rarity: 'rare' },
    [ITEMS.MOLTEN_LEGGINGS]: { name: 'Molten Leggings', type: 'leggings', defense: 7, stackable: false, rarity: 'rare' },
    // Guns
    [ITEMS.FLINTLOCK_PISTOL]: { name: 'Flintlock Pistol', type: 'gun', damage: 8, speed: 24, knockback: 2, size: 0.7 },
    [ITEMS.MUSKET]: { name: 'Musket', type: 'gun', damage: 27, speed: 48, knockback: 7, size: 1.0, rarity: 'rare' },
    [ITEMS.HANDGUN]: { name: 'Handgun', type: 'gun', damage: 12, speed: 10, knockback: 3, size: 0.75, rarity: 'rare' },
    [ITEMS.PHOENIX_BLASTER]: { name: 'Phoenix Blaster', type: 'gun', damage: 18, speed: 9, knockback: 2, size: 0.85, rarity: 'rare' },
    [ITEMS.STAR_CANNON]: { name: 'Star Cannon', type: 'gun', damage: 62, speed: 30, knockback: 14, size: 1.0, rarity: 'legendary', usesStars: true },
    [ITEMS.MINISHARK]: { name: 'Minishark', type: 'gun', damage: 1, speed: 4, knockback: 1, size: 0.9, rarity: 'rare' },
    // Bullets
    [ITEMS.MUSKET_BALL]: { name: 'Musket Ball', type: 'bullet', damage: 2, stackable: true },
    [ITEMS.SILVER_BULLET]: { name: 'Silver Bullet', type: 'bullet', damage: 6, stackable: true, rarity: 'magic' },
    [ITEMS.METEOR_SHOT]: { name: 'Meteor Shot', type: 'bullet', damage: 8, stackable: true, rarity: 'rare' },
    // Zenith weapons
    [ITEMS.ZENITH_BOW]: { name: 'Zenith Bow', type: 'bow', damage: 21, speed: 7, knockback: 6, size: 1.3, rarity: 'legendary', zenithBow: true },
    [ITEMS.ZENITH_BLASTER]: { name: 'Zenith Blaster', type: 'gun', damage: 8, speed: 2, knockback: 2, size: 1.0, rarity: 'legendary', zenithBlaster: true },
    [ITEMS.ZENITH_STAFF]: { name: 'Zenith Staff', type: 'magic', damage: 3, speed: 2, mana: 1, rarity: 'legendary', zenithStaff: true },
    // Throwables
    [ITEMS.GRENADE]: { name: 'Grenade', type: 'throwable', damage: 40, speed: 14, knockback: 6, stackable: true, blastRadius: 2.4 },
    [ITEMS.NUKE]: { name: 'Nuke', type: 'throwable', damage: 200, speed: 20, knockback: 15, stackable: true, blastRadius: 30, rarity: 'legendary' }
};

// Add blocks to items
for (const [key, val] of Object.entries(BLOCKS)) {
    if (val !== 0 && !ITEM_DATA[val]) {
        ITEM_DATA[val] = { name: BLOCK_DATA[val]?.name || key, type: 'block', blockId: val, stackable: true };
    }
}

// Recipes
const RECIPES = [
    // Blocks
    { result: BLOCKS.COBBLESTONE, count: 4, ingredients: [{ id: BLOCKS.STONE, count: 1 }], station: BLOCKS.WORKBENCH },
    { result: BLOCKS.STONE, count: 1, ingredients: [{ id: BLOCKS.COBBLESTONE, count: 4 }], station: BLOCKS.FURNACE },
    { result: BLOCKS.TORCH, count: 3, ingredients: [{ id: ITEMS.STICK, count: 1 }, { id: ITEMS.GEL, count: 1 }], station: null },
    { result: BLOCKS.WOOD_PLATFORM, count: 2, ingredients: [{ id: ITEMS.WOOD_PLANK, count: 1 }], station: null },
    { result: BLOCKS.WORKBENCH, count: 1, ingredients: [{ id: ITEMS.WOOD_PLANK, count: 10 }], station: null },
    { result: BLOCKS.FURNACE, count: 1, ingredients: [{ id: BLOCKS.COBBLESTONE, count: 20 }, { id: BLOCKS.TORCH, count: 3 }], station: BLOCKS.WORKBENCH },
    { result: BLOCKS.CHEST, count: 1, ingredients: [{ id: ITEMS.WOOD_PLANK, count: 8 }, { id: ITEMS.IRON_BAR, count: 2 }], station: BLOCKS.WORKBENCH },
    { result: BLOCKS.GLASS, count: 1, ingredients: [{ id: BLOCKS.SAND, count: 2 }], station: BLOCKS.FURNACE },
    { result: BLOCKS.BRICK, count: 1, ingredients: [{ id: BLOCKS.CLAY, count: 2 }], station: BLOCKS.FURNACE },
    { result: BLOCKS.DIRT, count: 1, ingredients: [{ id: BLOCKS.MUD, count: 1 }], station: null },
    { result: BLOCKS.DOOR, count: 1, ingredients: [{ id: ITEMS.WOOD_PLANK, count: 6 }], station: BLOCKS.WORKBENCH },
    // Materials
    { result: ITEMS.WOOD_PLANK, count: 4, ingredients: [{ id: BLOCKS.WOOD, count: 1 }], station: null },
    { result: ITEMS.STICK, count: 4, ingredients: [{ id: ITEMS.WOOD_PLANK, count: 2 }], station: null },
    { result: ITEMS.CHAIN, count: 10, ingredients: [{ id: ITEMS.IRON_BAR, count: 1 }], station: null },
    { result: ITEMS.COPPER_BAR, count: 1, ingredients: [{ id: BLOCKS.COPPER_ORE, count: 3 }], station: BLOCKS.FURNACE },
    { result: ITEMS.IRON_BAR, count: 1, ingredients: [{ id: BLOCKS.IRON_ORE, count: 3 }], station: BLOCKS.FURNACE },
    { result: ITEMS.GOLD_BAR, count: 1, ingredients: [{ id: BLOCKS.GOLD_ORE, count: 4 }], station: BLOCKS.FURNACE },
    { result: ITEMS.DEMONITE_BAR, count: 1, ingredients: [{ id: BLOCKS.DEMONITE_ORE, count: 3 }], station: BLOCKS.FURNACE },
    { result: ITEMS.CRIMTANE_BAR, count: 1, ingredients: [{ id: BLOCKS.CRIMTANE_ORE, count: 3 }], station: BLOCKS.FURNACE },
    { result: ITEMS.HELLSTONE_BAR, count: 1, ingredients: [{ id: BLOCKS.HELLSTONE, count: 3 }, { id: BLOCKS.OBSIDIAN, count: 1 }], station: BLOCKS.FURNACE },
    { result: ITEMS.METEORITE_BAR, count: 5, ingredients: [{ id: ITEMS.IRON_BAR, count: 3 }, { id: ITEMS.FALLEN_STAR, count: 5 }], station: BLOCKS.FURNACE },
    { result: ITEMS.OBSIDIAN_SKULL, count: 1, ingredients: [{ id: BLOCKS.OBSIDIAN, count: 20 }], station: BLOCKS.FURNACE },
    // Pickaxes
    { result: ITEMS.WOOD_PICKAXE, count: 1, ingredients: [{ id: ITEMS.WOOD_PLANK, count: 8 }, { id: ITEMS.STICK, count: 4 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.STONE_PICKAXE, count: 1, ingredients: [{ id: BLOCKS.COBBLESTONE, count: 12 }, { id: ITEMS.STICK, count: 4 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.COPPER_PICKAXE, count: 1, ingredients: [{ id: ITEMS.COPPER_BAR, count: 12 }, { id: ITEMS.STICK, count: 4 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.IRON_PICKAXE, count: 1, ingredients: [{ id: ITEMS.IRON_BAR, count: 12 }, { id: ITEMS.STICK, count: 4 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.GOLD_PICKAXE, count: 1, ingredients: [{ id: ITEMS.GOLD_BAR, count: 15 }, { id: ITEMS.STICK, count: 4 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.DIAMOND_PICKAXE, count: 1, ingredients: [{ id: BLOCKS.DIAMOND, count: 15 }, { id: ITEMS.GOLD_BAR, count: 5 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.NIGHTMARE_PICKAXE, count: 1, ingredients: [{ id: ITEMS.DEMONITE_BAR, count: 12 }, { id: ITEMS.SHADOW_SCALE, count: 6 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.DEATHBRINGER_PICKAXE, count: 1, ingredients: [{ id: ITEMS.CRIMTANE_BAR, count: 12 }, { id: ITEMS.TISSUE_SAMPLE, count: 6 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.MOLTEN_PICKAXE, count: 1, ingredients: [{ id: ITEMS.HELLSTONE_BAR, count: 20 }], station: BLOCKS.WORKBENCH },
    // Axes
    { result: ITEMS.WOOD_AXE, count: 1, ingredients: [{ id: ITEMS.WOOD_PLANK, count: 6 }, { id: ITEMS.STICK, count: 3 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.STONE_AXE, count: 1, ingredients: [{ id: BLOCKS.COBBLESTONE, count: 10 }, { id: ITEMS.STICK, count: 3 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.COPPER_AXE, count: 1, ingredients: [{ id: ITEMS.COPPER_BAR, count: 10 }, { id: ITEMS.STICK, count: 3 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.IRON_AXE, count: 1, ingredients: [{ id: ITEMS.IRON_BAR, count: 10 }, { id: ITEMS.STICK, count: 3 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.GOLD_AXE, count: 1, ingredients: [{ id: ITEMS.GOLD_BAR, count: 12 }, { id: ITEMS.STICK, count: 3 }], station: BLOCKS.WORKBENCH },
    // Hammers
    { result: ITEMS.WOOD_HAMMER, count: 1, ingredients: [{ id: ITEMS.WOOD_PLANK, count: 10 }, { id: ITEMS.STICK, count: 4 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.COPPER_HAMMER, count: 1, ingredients: [{ id: ITEMS.COPPER_BAR, count: 10 }, { id: ITEMS.STICK, count: 4 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.IRON_HAMMER, count: 1, ingredients: [{ id: ITEMS.IRON_BAR, count: 10 }, { id: ITEMS.STICK, count: 4 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.GOLD_HAMMER, count: 1, ingredients: [{ id: ITEMS.GOLD_BAR, count: 12 }, { id: ITEMS.STICK, count: 4 }], station: BLOCKS.WORKBENCH },
    // Swords
    { result: ITEMS.WOOD_SWORD, count: 1, ingredients: [{ id: ITEMS.WOOD_PLANK, count: 7 }, { id: ITEMS.STICK, count: 2 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.COPPER_SHORTSWORD, count: 1, ingredients: [{ id: ITEMS.COPPER_BAR, count: 6 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.COPPER_BROADSWORD, count: 1, ingredients: [{ id: ITEMS.COPPER_BAR, count: 10 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.IRON_SHORTSWORD, count: 1, ingredients: [{ id: ITEMS.IRON_BAR, count: 7 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.IRON_BROADSWORD, count: 1, ingredients: [{ id: ITEMS.IRON_BAR, count: 10 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.GOLD_SHORTSWORD, count: 1, ingredients: [{ id: ITEMS.GOLD_BAR, count: 8 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.GOLD_BROADSWORD, count: 1, ingredients: [{ id: ITEMS.GOLD_BAR, count: 12 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.DIAMOND_SWORD, count: 1, ingredients: [{ id: BLOCKS.DIAMOND, count: 12 }, { id: ITEMS.GOLD_BAR, count: 3 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.LIGHTS_BANE, count: 1, ingredients: [{ id: ITEMS.DEMONITE_BAR, count: 10 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.BLOOD_BUTCHERER, count: 1, ingredients: [{ id: ITEMS.CRIMTANE_BAR, count: 10 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.BLADE_OF_GRASS, count: 1, ingredients: [{ id: ITEMS.JUNGLE_SPORES, count: 12 }, { id: ITEMS.STINGER, count: 15 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.FIERY_GREATSWORD, count: 1, ingredients: [{ id: ITEMS.HELLSTONE_BAR, count: 20 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.NIGHTS_EDGE, count: 1, ingredients: [{ id: ITEMS.LIGHTS_BANE, count: 1 }, { id: ITEMS.MURAMASA, count: 1 }, { id: ITEMS.BLADE_OF_GRASS, count: 1 }, { id: ITEMS.FIERY_GREATSWORD, count: 1 }], station: BLOCKS.WORKBENCH },
    // Spears
    { result: ITEMS.WOOD_SPEAR, count: 1, ingredients: [{ id: ITEMS.WOOD_PLANK, count: 6 }, { id: ITEMS.STICK, count: 4 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.COPPER_SPEAR, count: 1, ingredients: [{ id: ITEMS.COPPER_BAR, count: 8 }, { id: ITEMS.STICK, count: 3 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.IRON_SPEAR, count: 1, ingredients: [{ id: ITEMS.IRON_BAR, count: 9 }, { id: ITEMS.STICK, count: 3 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.GOLD_SPEAR, count: 1, ingredients: [{ id: ITEMS.GOLD_BAR, count: 10 }, { id: ITEMS.STICK, count: 3 }], station: BLOCKS.WORKBENCH },
    // Bows
    { result: ITEMS.WOOD_BOW, count: 1, ingredients: [{ id: ITEMS.WOOD_PLANK, count: 5 }, { id: ITEMS.STICK, count: 3 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.COPPER_BOW, count: 1, ingredients: [{ id: ITEMS.COPPER_BAR, count: 7 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.IRON_BOW, count: 1, ingredients: [{ id: ITEMS.IRON_BAR, count: 8 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.GOLD_BOW, count: 1, ingredients: [{ id: ITEMS.GOLD_BAR, count: 9 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.MOLTEN_FURY, count: 1, ingredients: [{ id: ITEMS.HELLSTONE_BAR, count: 15 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.DEMON_BOW, count: 1, ingredients: [{ id: ITEMS.DEMONITE_BAR, count: 8 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.TENDON_BOW, count: 1, ingredients: [{ id: ITEMS.CRIMTANE_BAR, count: 8 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.ZENITH_BOW, count: 1, ingredients: [{ id: ITEMS.WOOD_BOW, count: 1 }, { id: ITEMS.COPPER_BOW, count: 1 }, { id: ITEMS.IRON_BOW, count: 1 }, { id: ITEMS.GOLD_BOW, count: 1 }, { id: ITEMS.DEMON_BOW, count: 1 }, { id: ITEMS.MOLTEN_FURY, count: 1 }], station: BLOCKS.WORKBENCH },
    // Boomerangs
    { result: ITEMS.WOOD_BOOMERANG, count: 1, ingredients: [{ id: ITEMS.WOOD_PLANK, count: 8 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.THORN_CHAKRAM, count: 1, ingredients: [{ id: ITEMS.JUNGLE_SPORES, count: 6 }, { id: ITEMS.STINGER, count: 10 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.FLAMARANG, count: 1, ingredients: [{ id: ITEMS.HELLSTONE_BAR, count: 10 }, { id: ITEMS.ENCHANTED_BOOMERANG, count: 1 }], station: BLOCKS.WORKBENCH },
    // Yoyos
    { result: ITEMS.WOOD_YOYO, count: 1, ingredients: [{ id: ITEMS.WOOD_PLANK, count: 5 }, { id: ITEMS.COBWEB, count: 5 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.MALAISE, count: 1, ingredients: [{ id: ITEMS.DEMONITE_BAR, count: 8 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.ARTERY, count: 1, ingredients: [{ id: ITEMS.CRIMTANE_BAR, count: 8 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.AMAZON, count: 1, ingredients: [{ id: ITEMS.JUNGLE_SPORES, count: 8 }, { id: ITEMS.STINGER, count: 6 }, { id: ITEMS.VINE, count: 3 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.CASCADE, count: 1, ingredients: [{ id: ITEMS.HELLSTONE_BAR, count: 10 }], station: BLOCKS.WORKBENCH },
    // Flails
    { result: ITEMS.CHAIN_KNIFE, count: 1, ingredients: [{ id: ITEMS.IRON_BAR, count: 6 }, { id: ITEMS.CHAIN, count: 2 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.BALL_O_HURT, count: 1, ingredients: [{ id: ITEMS.DEMONITE_BAR, count: 10 }, { id: ITEMS.SHADOW_SCALE, count: 4 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.SUNFURY, count: 1, ingredients: [{ id: ITEMS.HELLSTONE_BAR, count: 15 }, { id: ITEMS.CHAIN, count: 10 }], station: BLOCKS.WORKBENCH },
    // Guns
    { result: ITEMS.FLINTLOCK_PISTOL, count: 1, ingredients: [{ id: ITEMS.IRON_BAR, count: 8 }, { id: ITEMS.WOOD_PLANK, count: 5 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.MUSKET, count: 1, ingredients: [{ id: ITEMS.IRON_BAR, count: 12 }, { id: ITEMS.WOOD_PLANK, count: 8 }, { id: ITEMS.LENS, count: 1 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.HANDGUN, count: 1, ingredients: [{ id: ITEMS.GOLD_BAR, count: 10 }, { id: ITEMS.IRON_BAR, count: 5 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.MINISHARK, count: 1, ingredients: [{ id: ITEMS.IRON_BAR, count: 15 }, { id: ITEMS.GOLD_BAR, count: 10 }, { id: ITEMS.SHARK_FIN, count: 5 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.PHOENIX_BLASTER, count: 1, ingredients: [{ id: ITEMS.HANDGUN, count: 1 }, { id: ITEMS.HELLSTONE_BAR, count: 10 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.STAR_CANNON, count: 1, ingredients: [{ id: ITEMS.GOLD_BAR, count: 15 }, { id: ITEMS.FALLEN_STAR, count: 20 }, { id: ITEMS.LENS, count: 3 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.ZENITH_BLASTER, count: 1, ingredients: [{ id: ITEMS.FLINTLOCK_PISTOL, count: 1 }, { id: ITEMS.MUSKET, count: 1 }, { id: ITEMS.HANDGUN, count: 1 }, { id: ITEMS.PHOENIX_BLASTER, count: 1 }, { id: ITEMS.MINISHARK, count: 1 }], station: BLOCKS.WORKBENCH },
    // Magic Weapons
    { result: ITEMS.WAND_OF_SPARKING, count: 1, ingredients: [{ id: ITEMS.STICK, count: 5 }, { id: ITEMS.FALLEN_STAR, count: 3 }, { id: ITEMS.GEL, count: 5 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.THUNDER_ZAPPER, count: 1, ingredients: [{ id: ITEMS.COPPER_BAR, count: 8 }, { id: ITEMS.FALLEN_STAR, count: 5 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.VILETHORN, count: 1, ingredients: [{ id: ITEMS.DEMONITE_BAR, count: 8 }, { id: ITEMS.FALLEN_STAR, count: 5 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.CRIMSON_ROD, count: 1, ingredients: [{ id: ITEMS.CRIMTANE_BAR, count: 8 }, { id: ITEMS.FALLEN_STAR, count: 5 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.FLAMELASH, count: 1, ingredients: [{ id: ITEMS.HELLSTONE_BAR, count: 10 }, { id: ITEMS.FALLEN_STAR, count: 10 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.FLOWER_OF_FIRE, count: 1, ingredients: [{ id: ITEMS.HELLSTONE_BAR, count: 15 }, { id: ITEMS.FALLEN_STAR, count: 12 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.ZENITH_STAFF, count: 1, ingredients: [{ id: ITEMS.WAND_OF_SPARKING, count: 1 }, { id: ITEMS.THUNDER_ZAPPER, count: 1 }, { id: ITEMS.VILETHORN, count: 1 }, { id: ITEMS.FLAMELASH, count: 1 }, { id: ITEMS.FLOWER_OF_FIRE, count: 1 }], station: BLOCKS.WORKBENCH },
    // Arrows
    { result: ITEMS.WOOD_ARROW, count: 5, ingredients: [{ id: ITEMS.STICK, count: 1 }, { id: BLOCKS.STONE, count: 1 }], station: null },
    { result: ITEMS.FLAMING_ARROW, count: 10, ingredients: [{ id: ITEMS.WOOD_ARROW, count: 10 }, { id: BLOCKS.TORCH, count: 1 }], station: null },
    { result: ITEMS.FROSTBURN_ARROW, count: 10, ingredients: [{ id: ITEMS.WOOD_ARROW, count: 10 }, { id: BLOCKS.ICE, count: 1 }], station: null },
    { result: ITEMS.JESTER_ARROW, count: 20, ingredients: [{ id: ITEMS.WOOD_ARROW, count: 20 }, { id: ITEMS.FALLEN_STAR, count: 1 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.UNHOLY_ARROW, count: 5, ingredients: [{ id: ITEMS.WOOD_ARROW, count: 5 }, { id: ITEMS.ROTTEN_CHUNK, count: 1 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.HELLFIRE_ARROW, count: 10, ingredients: [{ id: ITEMS.WOOD_ARROW, count: 10 }, { id: ITEMS.HELLSTONE_BAR, count: 1 }], station: BLOCKS.WORKBENCH },
    // Bullets
    { result: ITEMS.MUSKET_BALL, count: 50, ingredients: [{ id: ITEMS.IRON_BAR, count: 1 }], station: BLOCKS.FURNACE },
    { result: ITEMS.SILVER_BULLET, count: 25, ingredients: [{ id: ITEMS.MUSKET_BALL, count: 25 }, { id: ITEMS.GOLD_BAR, count: 1 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.METEOR_SHOT, count: 25, ingredients: [{ id: ITEMS.MUSKET_BALL, count: 25 }, { id: ITEMS.METEORITE_BAR, count: 1 }], station: BLOCKS.WORKBENCH },
    // Throwables
    { result: ITEMS.GRENADE, count: 5, ingredients: [{ id: ITEMS.IRON_BAR, count: 1 }, { id: ITEMS.GEL, count: 3 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.NUKE, count: 1, ingredients: [{ id: ITEMS.GRENADE, count: 50 }, { id: ITEMS.HELLSTONE_BAR, count: 30 }, { id: ITEMS.DEMONITE_BAR, count: 20 }, { id: ITEMS.GOLD_BAR, count: 20 }, { id: ITEMS.FALLEN_STAR, count: 15 }], station: BLOCKS.WORKBENCH },
    // Tools
    { result: ITEMS.IVY_WHIP, count: 1, ingredients: [{ id: ITEMS.VINE, count: 3 }, { id: ITEMS.JUNGLE_SPORES, count: 12 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.GRAPPLING_HOOK, count: 1, ingredients: [{ id: ITEMS.HOOK, count: 1 }, { id: ITEMS.CHAIN, count: 3 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.DUAL_HOOK, count: 1, ingredients: [{ id: ITEMS.HOOK, count: 2 }, { id: ITEMS.CHAIN, count: 6 }], station: BLOCKS.WORKBENCH },
    // Accessories
    { result: ITEMS.SPECTRE_BOOTS, count: 1, ingredients: [{ id: ITEMS.HERMES_BOOTS, count: 1 }, { id: ITEMS.ROCKET_BOOTS, count: 1 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.LIGHTNING_BOOTS, count: 1, ingredients: [{ id: ITEMS.SPECTRE_BOOTS, count: 1 }, { id: ITEMS.AGLET, count: 1 }, { id: ITEMS.ANKLET_OF_WIND, count: 1 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.OBSIDIAN_SHIELD, count: 1, ingredients: [{ id: ITEMS.OBSIDIAN_SKULL, count: 1 }, { id: ITEMS.COBALT_SHIELD, count: 1 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.MANA_FLOWER, count: 1, ingredients: [{ id: ITEMS.MANA_POTION, count: 5 }, { id: ITEMS.BAND_OF_STARPOWER, count: 1 }], station: BLOCKS.WORKBENCH },
    // Consumables
    { result: ITEMS.IRONSKIN_POTION, count: 1, ingredients: [{ id: ITEMS.IRON_BAR, count: 1 }, { id: BLOCKS.MUSHROOM, count: 1 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.MANA_CRYSTAL, count: 1, ingredients: [{ id: ITEMS.FALLEN_STAR, count: 5 }], station: null },
    { result: ITEMS.HEALING_POTION, count: 1, ingredients: [{ id: BLOCKS.MUSHROOM, count: 2 }, { id: ITEMS.GEL, count: 2 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.GREATER_HEALING_POTION, count: 1, ingredients: [{ id: ITEMS.HEALING_POTION, count: 3 }, { id: ITEMS.FALLEN_STAR, count: 1 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.MANA_POTION, count: 1, ingredients: [{ id: BLOCKS.VILE_MUSHROOM, count: 2 }, { id: ITEMS.FALLEN_STAR, count: 1 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.GREATER_MANA_POTION, count: 1, ingredients: [{ id: ITEMS.MANA_POTION, count: 3 }, { id: ITEMS.FALLEN_STAR, count: 2 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.SWIFTNESS_POTION, count: 1, ingredients: [{ id: ITEMS.GEL, count: 3 }, { id: BLOCKS.MUSHROOM, count: 1 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.REGENERATION_POTION, count: 1, ingredients: [{ id: BLOCKS.MUSHROOM, count: 2 }, { id: ITEMS.FALLEN_STAR, count: 1 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.ARCHERY_POTION, count: 1, ingredients: [{ id: ITEMS.LENS, count: 1 }, { id: BLOCKS.MUSHROOM, count: 1 }], station: BLOCKS.WORKBENCH },
    // Helmets
    { result: ITEMS.WOOD_HELMET, count: 1, ingredients: [{ id: ITEMS.WOOD_PLANK, count: 12 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.COPPER_HELMET, count: 1, ingredients: [{ id: ITEMS.COPPER_BAR, count: 12 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.IRON_HELMET, count: 1, ingredients: [{ id: ITEMS.IRON_BAR, count: 15 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.GOLD_HELMET, count: 1, ingredients: [{ id: ITEMS.GOLD_BAR, count: 20 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.SHADOW_HELMET, count: 1, ingredients: [{ id: ITEMS.DEMONITE_BAR, count: 15 }, { id: ITEMS.SHADOW_SCALE, count: 10 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.CRIMSON_HELMET, count: 1, ingredients: [{ id: ITEMS.CRIMTANE_BAR, count: 15 }, { id: ITEMS.TISSUE_SAMPLE, count: 10 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.MOLTEN_HELMET, count: 1, ingredients: [{ id: ITEMS.HELLSTONE_BAR, count: 15 }], station: BLOCKS.WORKBENCH },
    // Chestplates
    { result: ITEMS.WOOD_CHESTPLATE, count: 1, ingredients: [{ id: ITEMS.WOOD_PLANK, count: 20 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.COPPER_CHESTPLATE, count: 1, ingredients: [{ id: ITEMS.COPPER_BAR, count: 20 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.IRON_CHESTPLATE, count: 1, ingredients: [{ id: ITEMS.IRON_BAR, count: 25 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.GOLD_CHESTPLATE, count: 1, ingredients: [{ id: ITEMS.GOLD_BAR, count: 30 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.SHADOW_CHESTPLATE, count: 1, ingredients: [{ id: ITEMS.DEMONITE_BAR, count: 25 }, { id: ITEMS.SHADOW_SCALE, count: 15 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.CRIMSON_CHESTPLATE, count: 1, ingredients: [{ id: ITEMS.CRIMTANE_BAR, count: 25 }, { id: ITEMS.TISSUE_SAMPLE, count: 15 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.MOLTEN_CHESTPLATE, count: 1, ingredients: [{ id: ITEMS.HELLSTONE_BAR, count: 25 }], station: BLOCKS.WORKBENCH },
    // Leggings
    { result: ITEMS.WOOD_LEGGINGS, count: 1, ingredients: [{ id: ITEMS.WOOD_PLANK, count: 15 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.COPPER_LEGGINGS, count: 1, ingredients: [{ id: ITEMS.COPPER_BAR, count: 15 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.IRON_LEGGINGS, count: 1, ingredients: [{ id: ITEMS.IRON_BAR, count: 20 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.GOLD_LEGGINGS, count: 1, ingredients: [{ id: ITEMS.GOLD_BAR, count: 25 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.SHADOW_LEGGINGS, count: 1, ingredients: [{ id: ITEMS.DEMONITE_BAR, count: 20 }, { id: ITEMS.SHADOW_SCALE, count: 12 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.CRIMSON_LEGGINGS, count: 1, ingredients: [{ id: ITEMS.CRIMTANE_BAR, count: 20 }, { id: ITEMS.TISSUE_SAMPLE, count: 12 }], station: BLOCKS.WORKBENCH },
    { result: ITEMS.MOLTEN_LEGGINGS, count: 1, ingredients: [{ id: ITEMS.HELLSTONE_BAR, count: 20 }], station: BLOCKS.WORKBENCH }
];
// Chest loot tables
const CHEST_LOOT = {
    surface: [
        { id: ITEMS.HEALING_POTION, min: 2, max: 5, chance: 0.8 },
        { id: BLOCKS.TORCH, min: 10, max: 20, chance: 0.7 },
        { id: ITEMS.MAGIC_MIRROR, min: 1, max: 1, chance: 0.12 },
        { id: ITEMS.WAND_OF_SPARKING, min: 1, max: 1, chance: 0.2 },
        { id: ITEMS.CLOUD_IN_BOTTLE, min: 1, max: 1, chance: 0.1 },
        { id: ITEMS.HERMES_BOOTS, min: 1, max: 1, chance: 0.08 },
        { id: ITEMS.AGLET, min: 1, max: 1, chance: 0.15 },
        { id: ITEMS.WOOD_BOOMERANG, min: 1, max: 1, chance: 0.2 },
        { id: ITEMS.FLAMING_ARROW, min: 20, max: 50, chance: 0.3 },
        { id: ITEMS.RALLY, min: 1, max: 1, chance: 0.1 },
        { id: ITEMS.ENCHANTED_SWORD, min: 1, max: 1, chance: 0.03 },
        { id: ITEMS.SHARK_FIN, min: 1, max: 3, chance: 0.15 }
    ],
    underground: [
        { id: ITEMS.HEALING_POTION, min: 3, max: 6, chance: 0.8 },
        { id: ITEMS.IRON_BAR, min: 5, max: 12, chance: 0.5 },
        { id: ITEMS.WATER_BOLT, min: 1, max: 1, chance: 0.08 },
        { id: ITEMS.MAGIC_MISSILE, min: 1, max: 1, chance: 0.06 },
        { id: ITEMS.BAND_OF_REGENERATION, min: 1, max: 1, chance: 0.1 },
        { id: ITEMS.BAND_OF_STARPOWER, min: 1, max: 1, chance: 0.1 },
        { id: ITEMS.ENCHANTED_BOOMERANG, min: 1, max: 1, chance: 0.1 },
        { id: ITEMS.MURAMASA, min: 1, max: 1, chance: 0.06 },
        { id: ITEMS.COBALT_SHIELD, min: 1, max: 1, chance: 0.08 },
        { id: ITEMS.FERAL_CLAWS, min: 1, max: 1, chance: 0.1 },
        { id: ITEMS.ICE_BLADE, min: 1, max: 1, chance: 0.08 },
        { id: ITEMS.ICE_BOOMERANG, min: 1, max: 1, chance: 0.08 },
        { id: ITEMS.BLUE_MOON, min: 1, max: 1, chance: 0.06 },
        { id: ITEMS.HANDGUN, min: 1, max: 1, chance: 0.08 },
        { id: ITEMS.MUSKET_BALL, min: 30, max: 60, chance: 0.3 },
        { id: ITEMS.COBWEB, min: 5, max: 15, chance: 0.4 },
        { id: ITEMS.VINE, min: 1, max: 3, chance: 0.25 },
        { id: ITEMS.JUNGLE_SPORES, min: 3, max: 8, chance: 0.25 },
        { id: ITEMS.STINGER, min: 2, max: 5, chance: 0.2 },
        { id: ITEMS.ROCKET_BOOTS, min: 1, max: 1, chance: 0.06 },
        { id: ITEMS.ANKLET_OF_WIND, min: 1, max: 1, chance: 0.08 },
        { id: ITEMS.TITAN_GLOVE, min: 1, max: 1, chance: 0.06 },
        { id: ITEMS.CROSS_NECKLACE, min: 1, max: 1, chance: 0.06 },
        { id: ITEMS.HEART_CRYSTAL, min: 1, max: 1, chance: 0.5 }
    ],
    evil: [
        { id: ITEMS.VILETHORN, min: 1, max: 1, chance: 0.15 },
        { id: ITEMS.CRIMSON_ROD, min: 1, max: 1, chance: 0.15 },
        { id: ITEMS.DEMONITE_BAR, min: 3, max: 8, chance: 0.4 },
        { id: ITEMS.CRIMTANE_BAR, min: 3, max: 8, chance: 0.4 },
        { id: ITEMS.SHADOW_SCALE, min: 3, max: 8, chance: 0.3 },
        { id: ITEMS.TISSUE_SAMPLE, min: 3, max: 8, chance: 0.3 },
        { id: ITEMS.BALL_O_HURT, min: 1, max: 1, chance: 0.1 },
        { id: ITEMS.STAR_CLOAK, min: 1, max: 1, chance: 0.08 }
    ],
    hell: [
        { id: ITEMS.HELLSTONE_BAR, min: 5, max: 15, chance: 0.6 },
        { id: ITEMS.GREATER_HEALING_POTION, min: 2, max: 5, chance: 0.5 },
        { id: ITEMS.FLAMELASH, min: 1, max: 1, chance: 0.08 },
        { id: ITEMS.FLOWER_OF_FIRE, min: 1, max: 1, chance: 0.08 },
        { id: ITEMS.DARK_LANCE, min: 1, max: 1, chance: 0.1 },
        { id: ITEMS.SUNFURY, min: 1, max: 1, chance: 0.1 },
        { id: ITEMS.HELLFIRE_ARROW, min: 30, max: 75, chance: 0.4 },
        { id: ITEMS.PHOENIX_BLASTER, min: 1, max: 1, chance: 0.06 },
        { id: ITEMS.METEOR_SHOT, min: 30, max: 60, chance: 0.3 },
        { id: ITEMS.METEORITE_BAR, min: 3, max: 8, chance: 0.35 }
    ],
    sky: [
        { id: ITEMS.LUCKY_HORSESHOE, min: 1, max: 1, chance: 0.25 },
        { id: ITEMS.SHINY_RED_BALLOON, min: 1, max: 1, chance: 0.25 },
        { id: ITEMS.STARFURY, min: 1, max: 1, chance: 0.12 },
        { id: ITEMS.FEATHER, min: 5, max: 15, chance: 0.5 },
        { id: ITEMS.FART_IN_JAR, min: 1, max: 1, chance: 0.1 }
    ]
};

// Enemies
const ENEMIES = {
    // Surface - Day
    SLIME: { name: 'Green Slime', width: 16, height: 12, health: 25, damage: 7, defense: 0, color: '#00FF00', ai: 'slime', drops: [{ id: ITEMS.GEL, min: 1, max: 3, chance: 1 }], spawnDay: true, spawnNight: true, biome: 'any' },
    BLUE_SLIME: { name: 'Blue Slime', width: 18, height: 14, health: 40, damage: 10, defense: 2, color: '#0088FF', ai: 'slime', drops: [{ id: ITEMS.GEL, min: 2, max: 4, chance: 1 }], spawnDay: true, spawnNight: true, biome: 'any' },
    PURPLE_SLIME: { name: 'Purple Slime', width: 20, height: 16, health: 55, damage: 14, defense: 4, color: '#9932CC', ai: 'slime', drops: [{ id: ITEMS.GEL, min: 2, max: 5, chance: 1 }], spawnDay: true, spawnNight: true, biome: 'any' },
    PINKY: { name: 'Pinky', width: 18, height: 14, health: 150, damage: 8, defense: 5, color: '#FFB6C1', ai: 'slime', drops: [{ id: ITEMS.GEL, min: 10, max: 20, chance: 1 }], spawnDay: true, spawnNight: true, biome: 'any' },
    YELLOW_SLIME: { name: 'Yellow Slime', width: 19, height: 15, health: 65, damage: 18, defense: 5, color: '#FFD700', ai: 'slime', drops: [{ id: ITEMS.GEL, min: 3, max: 6, chance: 1 }], spawnDay: true, spawnNight: true, biome: 'any' },
    // Surface - Night
    ZOMBIE: { name: 'Zombie', width: 28, height: 48, health: 60, damage: 15, defense: 5, color: '#556B2F', ai: 'walker', drops: [{ id: ITEMS.ROTTEN_CHUNK, min: 0, max: 2, chance: 0.3 }], spawnDay: false, spawnNight: true, biome: 'any' },
    BLOOD_ZOMBIE: { name: 'Blood Zombie', width: 30, height: 50, health: 90, damage: 22, defense: 8, color: '#8B0000', ai: 'walker', drops: [{ id: ITEMS.VERTEBRAE, min: 1, max: 2, chance: 0.4 }], spawnDay: false, spawnNight: true, biome: 'any' },
    BALD_ZOMBIE: { name: 'Bald Zombie', width: 28, height: 48, health: 70, damage: 18, defense: 6, color: '#6B8E23', ai: 'walker', drops: [{ id: ITEMS.ROTTEN_CHUNK, min: 1, max: 2, chance: 0.35 }], spawnDay: false, spawnNight: true, biome: 'any' },
    DEMON_EYE: { name: 'Demon Eye', width: 15, height: 15, health: 80, damage: 20, defense: 3, color: '#FF0000', ai: 'flying', drops: [{ id: ITEMS.LENS, min: 1, max: 1, chance: 0.33 }], spawnDay: false, spawnNight: true, biome: 'any' },
    WANDERING_EYE: { name: 'Wandering Eye', width: 18, height: 18, health: 120, damage: 28, defense: 6, color: '#DC143C', ai: 'flying', drops: [{ id: ITEMS.LENS, min: 1, max: 2, chance: 0.5 }], spawnDay: false, spawnNight: true, biome: 'any' },
    CATARACT_EYE: { name: 'Cataract Eye', width: 14, height: 14, health: 60, damage: 16, defense: 2, color: '#E6E6FA', ai: 'flying', drops: [{ id: ITEMS.LENS, min: 1, max: 1, chance: 0.25 }], spawnDay: false, spawnNight: true, biome: 'any' },
    // Underground
    SKELETON: { name: 'Skeleton', width: 28, height: 48, health: 70, damage: 20, defense: 8, color: '#F5F5DC', ai: 'walker', drops: [{ id: ITEMS.BONE, min: 1, max: 3, chance: 0.5 }, { id: ITEMS.HOOK, min: 1, max: 1, chance: 0.02 }], spawnDay: true, spawnNight: true, biome: 'underground' },
    UNDEAD_MINER: { name: 'Undead Miner', width: 28, height: 48, health: 85, damage: 25, defense: 10, color: '#8B8B83', ai: 'walker', drops: [{ id: ITEMS.BONE, min: 2, max: 4, chance: 0.6 }], spawnDay: true, spawnNight: true, biome: 'underground' },
    TIM: { name: 'Tim', width: 28, height: 48, health: 100, damage: 30, defense: 6, color: '#9370DB', ai: 'caster', drops: [{ id: ITEMS.MAGIC_MISSILE, min: 1, max: 1, chance: 0.5 }], spawnDay: true, spawnNight: true, biome: 'underground' },
    GIANT_WORM: { name: 'Giant Worm', width: 24, height: 24, health: 40, damage: 12, defense: 2, color: '#8B4513', ai: 'worm', drops: [], spawnDay: true, spawnNight: true, biome: 'underground' },
    CAVE_BAT: { name: 'Cave Bat', width: 12, height: 10, health: 25, damage: 16, defense: 2, color: '#4A4A4A', ai: 'flying', drops: [], spawnDay: true, spawnNight: true, biome: 'underground' },
    GIANT_BAT: { name: 'Giant Bat', width: 18, height: 14, health: 60, damage: 28, defense: 6, color: '#363636', ai: 'flying', drops: [], spawnDay: true, spawnNight: true, biome: 'underground' },
    MOTHER_SLIME: { name: 'Mother Slime', width: 25, height: 20, health: 120, damage: 22, defense: 6, color: '#00AA00', ai: 'slime', drops: [{ id: ITEMS.GEL, min: 5, max: 10, chance: 1 }], spawnDay: true, spawnNight: true, biome: 'underground' },
    CRAWDAD: { name: 'Crawdad', width: 32, height: 20, health: 50, damage: 18, defense: 8, color: '#CD5555', ai: 'walker', drops: [], spawnDay: true, spawnNight: true, biome: 'underground' },
    // Corruption
    EATER: { name: 'Eater of Souls', width: 18, height: 18, health: 65, damage: 25, defense: 6, color: '#6633AA', ai: 'flying', drops: [{ id: ITEMS.ROTTEN_CHUNK, min: 1, max: 2, chance: 0.5 }, { id: ITEMS.SHADOW_SCALE, min: 1, max: 1, chance: 0.05 }], spawnDay: true, spawnNight: true, biome: 'corruption' },
    DEVOURER: { name: 'Devourer', width: 28, height: 28, health: 50, damage: 30, defense: 4, color: '#4B0082', ai: 'worm', drops: [{ id: ITEMS.ROTTEN_CHUNK, min: 2, max: 3, chance: 0.6 }], spawnDay: true, spawnNight: true, biome: 'corruption' },
    CORRUPTOR: { name: 'Corruptor', width: 22, height: 22, health: 150, damage: 40, defense: 10, color: '#551A8B', ai: 'flying', drops: [{ id: ITEMS.ROTTEN_CHUNK, min: 2, max: 4, chance: 0.7 }], spawnDay: true, spawnNight: true, biome: 'corruption' },
    SLIMER: { name: 'Slimer', width: 14, height: 14, health: 75, damage: 32, defense: 5, color: '#7B68EE', ai: 'flying', drops: [{ id: ITEMS.GEL, min: 3, max: 6, chance: 0.8 }], spawnDay: true, spawnNight: true, biome: 'corruption' },
    // Crimson
    CRIMERA: { name: 'Crimera', width: 16, height: 16, health: 70, damage: 28, defense: 5, color: '#AA1133', ai: 'flying', drops: [{ id: ITEMS.VERTEBRAE, min: 1, max: 2, chance: 0.5 }, { id: ITEMS.TISSUE_SAMPLE, min: 1, max: 1, chance: 0.05 }], spawnDay: true, spawnNight: true, biome: 'crimson' },
    FACE_MONSTER: { name: 'Face Monster', width: 36, height: 44, health: 100, damage: 35, defense: 8, color: '#CD5C5C', ai: 'walker', drops: [{ id: ITEMS.VERTEBRAE, min: 2, max: 3, chance: 0.6 }], spawnDay: true, spawnNight: true, biome: 'crimson' },
    BLOOD_CRAWLER: { name: 'Blood Crawler', width: 40, height: 24, health: 80, damage: 30, defense: 6, color: '#B22222', ai: 'walker', drops: [{ id: ITEMS.VERTEBRAE, min: 1, max: 2, chance: 0.5 }], spawnDay: true, spawnNight: true, biome: 'crimson' },
    BLOOD_FEEDER: { name: 'Blood Feeder', width: 12, height: 12, health: 55, damage: 22, defense: 3, color: '#DC143C', ai: 'flying', drops: [{ id: ITEMS.VERTEBRAE, min: 1, max: 1, chance: 0.4 }], spawnDay: true, spawnNight: true, biome: 'crimson' },
    // Hell
    DEMON: { name: 'Demon', width: 20, height: 24, health: 150, damage: 40, defense: 12, color: '#800000', ai: 'flying', drops: [{ id: ITEMS.DEMON_SCYTHE, min: 1, max: 1, chance: 0.03 }], spawnDay: true, spawnNight: true, biome: 'hell' },
    FIRE_IMP: { name: 'Fire Imp', width: 32, height: 44, health: 90, damage: 35, defense: 8, color: '#FF4500', ai: 'caster', drops: [], spawnDay: true, spawnNight: true, biome: 'hell' },
    BONE_SERPENT: { name: 'Bone Serpent', width: 32, height: 32, health: 120, damage: 45, defense: 10, color: '#FFFAF0', ai: 'worm', drops: [{ id: ITEMS.BONE, min: 3, max: 6, chance: 0.8 }], spawnDay: true, spawnNight: true, biome: 'hell' },
    HELLBAT: { name: 'Hellbat', width: 16, height: 14, health: 70, damage: 40, defense: 8, color: '#FF6347', ai: 'flying', drops: [], spawnDay: true, spawnNight: true, biome: 'hell' },
    LAVA_SLIME: { name: 'Lava Slime', width: 18, height: 14, health: 80, damage: 30, defense: 10, color: '#FF8C00', ai: 'slime', drops: [{ id: ITEMS.GEL, min: 2, max: 5, chance: 1 }], spawnDay: true, spawnNight: true, biome: 'hell' },
    // Sky
    HARPY: { name: 'Harpy', width: 22, height: 18, health: 100, damage: 30, defense: 6, color: '#87CEEB', ai: 'flying', drops: [{ id: ITEMS.FEATHER, min: 1, max: 3, chance: 0.5 }], spawnDay: true, spawnNight: true, biome: 'sky' },
    // Desert
    ANTLION: { name: 'Antlion', width: 36, height: 24, health: 50, damage: 18, defense: 4, color: '#C2B280', ai: 'burrower', drops: [{ id: ITEMS.ANTLION_MANDIBLE, min: 1, max: 1, chance: 0.3 }], spawnDay: true, spawnNight: true, biome: 'desert' },
    VULTURE: { name: 'Vulture', width: 19, height: 16, health: 55, damage: 22, defense: 4, color: '#696969', ai: 'flying', drops: [], spawnDay: true, spawnNight: false, biome: 'desert' },
    TOMB_CRAWLER: { name: 'Tomb Crawler', width: 28, height: 28, health: 60, damage: 24, defense: 6, color: '#D2B48C', ai: 'worm', drops: [], spawnDay: true, spawnNight: true, biome: 'underground' },
    // Snow
    ICE_SLIME: { name: 'Ice Slime', width: 17, height: 13, health: 35, damage: 12, defense: 3, color: '#ADD8E6', ai: 'slime', drops: [{ id: ITEMS.GEL, min: 1, max: 3, chance: 1 }], spawnDay: true, spawnNight: true, biome: 'snow' },
    UNDEAD_VIKING: { name: 'Undead Viking', width: 30, height: 50, health: 80, damage: 25, defense: 10, color: '#708090', ai: 'walker', drops: [{ id: ITEMS.BONE, min: 2, max: 4, chance: 0.5 }], spawnDay: true, spawnNight: true, biome: 'snow' },
    ICE_BAT: { name: 'Ice Bat', width: 14, height: 12, health: 45, damage: 20, defense: 4, color: '#E0FFFF', ai: 'flying', drops: [], spawnDay: true, spawnNight: true, biome: 'snow' },
    SNOW_FLINX: { name: 'Snow Flinx', width: 26, height: 22, health: 55, damage: 18, defense: 5, color: '#FFFAFA', ai: 'walker', drops: [], spawnDay: true, spawnNight: true, biome: 'snow' }
};

// ============================================
// Sprite Drawing Functions
// ============================================

function getToolColor(id) {
    const name = (ITEM_DATA[id]?.name || '').toLowerCase();
    if (name.includes('wood')) return '#8B4513';
    if (name.includes('stone')) return '#808080';
    if (name.includes('copper')) return '#CD7F32';
    if (name.includes('iron')) return '#C0C0C0';
    if (name.includes('gold')) return '#FFD700';
    if (name.includes('diamond')) return '#00CED1';
    if (name.includes('shadow') || name.includes('demonite') || name.includes("light's")) return '#6633AA';
    if (name.includes('crimson') || name.includes('crimtane') || name.includes('blood')) return '#AA1133';
    if (name.includes('molten') || name.includes('fiery') || name.includes('hellstone')) return '#FF4500';
    return '#808080';
}

function drawWeaponSprite(ctx, itemId, size) {
    const color = getToolColor(itemId);
    const itemData = ITEM_DATA[itemId];
    
    if (itemData.type === 'sword') {
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.moveTo(-3, 0); ctx.lineTo(0, -size); ctx.lineTo(3, 0); ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath(); ctx.moveTo(-1, 0); ctx.lineTo(0, -size + 5); ctx.lineTo(1, 0); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#8B4513'; ctx.fillRect(-8, 0, 16, 4); ctx.fillRect(-2, 4, 4, 12);
    } else if (itemData.type === 'pickaxe') {
        ctx.fillStyle = '#8B4513'; ctx.fillRect(-2, 0, 4, size * 0.8);
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.moveTo(-size * 0.3, -size * 0.1); ctx.lineTo(0, -size * 0.4); ctx.lineTo(size * 0.3, -size * 0.1); ctx.lineTo(size * 0.2, 0); ctx.lineTo(-size * 0.2, 0); ctx.closePath(); ctx.fill();
    } else if (itemData.type === 'axe') {
        ctx.fillStyle = '#8B4513'; ctx.fillRect(-2, 0, 4, size * 0.8);
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.moveTo(-2, -size * 0.3); ctx.lineTo(-size * 0.35, -size * 0.15); ctx.lineTo(-size * 0.35, size * 0.1); ctx.lineTo(-2, size * 0.05); ctx.closePath(); ctx.fill();
    } else if (itemData.type === 'hammer') {
        ctx.fillStyle = '#8B4513'; ctx.fillRect(-2, 0, 4, size * 0.8);
        ctx.fillStyle = color;
        ctx.fillRect(-size * 0.25, -size * 0.3, size * 0.5, size * 0.25);
    }
}

function drawItemSprite(ctx, x, y, id, size) {
    const d = ITEM_DATA[id];
    if (!d) return;
    
    if (d.type === 'block') {
        // Special torch sprite
        if (id === BLOCKS.TORCH) {
            ctx.fillStyle = '#8B4513'; ctx.fillRect(x + size * 0.38, y + size * 0.3, size * 0.24, size * 0.55);
            ctx.fillStyle = '#FFA500'; ctx.beginPath(); ctx.ellipse(x + size * 0.5, y + size * 0.3, size * 0.22, size * 0.28, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#FFFF00'; ctx.beginPath(); ctx.ellipse(x + size * 0.5, y + size * 0.28, size * 0.1, size * 0.15, 0, 0, Math.PI * 2); ctx.fill();
            // Label
            const abbr = 'TO';
            const fontSize = Math.max(6, Math.floor(size * 0.32));
            ctx.font = `bold ${fontSize}px sans-serif`;
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillStyle = '#000'; ctx.fillText(abbr, x + size / 2 + 1, y + size * 0.78 + 1);
            ctx.fillStyle = '#fff'; ctx.fillText(abbr, x + size / 2, y + size * 0.78);
            return;
        }
        ctx.fillStyle = BLOCK_DATA[id]?.color || '#808080';
        ctx.fillRect(x, y, size, size);
        // 2-letter label for blocks
        const abbr = (d.name || '').substring(0, 2).toUpperCase();
        const fontSize = Math.max(6, Math.floor(size * 0.32));
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = '#000'; ctx.fillText(abbr, x + size / 2 + 1, y + size / 2 + 1);
        ctx.fillStyle = '#fff'; ctx.fillText(abbr, x + size / 2, y + size / 2);
        return;
    }
    
    ctx.save();
    ctx.translate(x + size / 2, y + size / 2);
    const color = getToolColor(id);
    
    if (d.type === 'sword') {
        const s = (d.size || 1) * size * 0.8;
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.moveTo(-2, size / 3); ctx.lineTo(0, -s / 2); ctx.lineTo(2, size / 3); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#8B4513'; ctx.fillRect(-4, size / 3, 8, 3); ctx.fillRect(-2, size / 3 + 3, 4, 6);
    } else if (d.type === 'pickaxe') {
        ctx.fillStyle = '#8B4513'; ctx.fillRect(-2, -size / 2 + 4, 4, size - 4);
        ctx.fillStyle = color; ctx.fillRect(-size / 2 + 2, -size / 2 + 2, size - 4, 4); ctx.fillRect(-size / 2 + 2, -size / 2 + 2, 4, 8);
    } else if (d.type === 'axe') {
        ctx.fillStyle = '#8B4513'; ctx.fillRect(-2, -size / 2 + 4, 4, size - 4);
        ctx.fillStyle = color; ctx.fillRect(-size / 2 + 2, -size / 2 + 2, size / 2, size / 2);
    } else if (d.type === 'magic') {
        const name = (d.name || '').toLowerCase();
        if (d.zenithStaff) {
            // Rainbow staff
            ctx.fillStyle = '#8B4513'; ctx.fillRect(-2, -size / 3, 4, size * 0.7);
            const hue = (Date.now() / 10) % 360;
            for (let i = 0; i < 3; i++) {
                ctx.fillStyle = `hsl(${(hue + i * 120) % 360},100%,60%)`;
                ctx.beginPath(); ctx.arc(Math.cos(i * 2.1) * size * 0.06, -size / 3 + Math.sin(i * 2.1) * size * 0.06, size / 5, 0, Math.PI * 2); ctx.fill();
            }
            ctx.globalAlpha = 0.3; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, -size / 3, size / 3, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
        } else {
            const orbColor = name.includes('fire') || name.includes('flame') ? '#FF6622' : name.includes('water') || name.includes('aqua') ? '#22AAFF' : name.includes('demon') ? '#CC2222' : name.includes('crimson') || name.includes('blood') ? '#AA1133' : name.includes('vile') ? '#6633AA' : name.includes('space') || name.includes('zap') || name.includes('thunder') ? '#44DDFF' : '#9966FF';
            ctx.fillStyle = '#8B4513'; ctx.fillRect(-2, -size / 3, 4, size * 0.7);
            ctx.fillStyle = orbColor; ctx.beginPath(); ctx.arc(0, -size / 3, size / 4, 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = 0.35; ctx.fillStyle = orbColor; ctx.beginPath(); ctx.arc(0, -size / 3, size / 3, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.beginPath(); ctx.arc(-size * 0.06, -size / 3 - size * 0.06, size * 0.08, 0, Math.PI * 2); ctx.fill();
        }
    } else if (d.type === 'bow') {
        if (d.zenithBow) {
            // Golden glowing bow
            const hue = (Date.now() / 15) % 360;
            ctx.strokeStyle = `hsl(${hue},100%,60%)`; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(size * 0.1, 0, size * 0.35, -Math.PI * 0.6, Math.PI * 0.6); ctx.stroke();
            ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.arc(size * 0.1, 0, size * 0.3, -Math.PI * 0.55, Math.PI * 0.55); ctx.stroke();
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(size * 0.1 + Math.cos(-Math.PI * 0.6) * size * 0.35, Math.sin(-Math.PI * 0.6) * size * 0.35);
            ctx.lineTo(size * 0.1 + Math.cos(Math.PI * 0.6) * size * 0.35, Math.sin(Math.PI * 0.6) * size * 0.35);
            ctx.stroke();
        } else {
            const bowColor = getToolColor(id);
        // Bow arc
        ctx.strokeStyle = bowColor; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(size * 0.1, 0, size * 0.35, -Math.PI * 0.6, Math.PI * 0.6); ctx.stroke();
        // Bowstring
        ctx.strokeStyle = '#ddd'; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(size * 0.1 + Math.cos(-Math.PI * 0.6) * size * 0.35, Math.sin(-Math.PI * 0.6) * size * 0.35);
        ctx.lineTo(size * 0.1 + Math.cos(Math.PI * 0.6) * size * 0.35, Math.sin(Math.PI * 0.6) * size * 0.35);
        ctx.stroke();
        }
    } else if (d.type === 'ammo') {
        const name = (d.name || '').toLowerCase();
        const headColor = name.includes('flaming') ? '#FF6600' : name.includes('jester') ? '#FFFF00' : name.includes('unholy') ? '#9966FF' : name.includes('hellfire') ? '#FF2200' : name.includes('frost') ? '#00CCFF' : '#A0A0A0';
        const fletchColor = name.includes('flaming') ? '#FF8800' : name.includes('jester') ? '#FFDD00' : name.includes('unholy') ? '#8844CC' : name.includes('hellfire') ? '#FF4400' : name.includes('frost') ? '#44DDFF' : '#CC3333';
        // Arrow shaft
        ctx.fillStyle = '#8B6842'; ctx.fillRect(-1, -size / 3, 2, size * 0.65);
        // Arrowhead
        ctx.fillStyle = headColor;
        ctx.beginPath(); ctx.moveTo(-3, -size / 3); ctx.lineTo(0, -size / 2.2); ctx.lineTo(3, -size / 3); ctx.closePath(); ctx.fill();
        // Fletching
        ctx.fillStyle = fletchColor;
        ctx.beginPath(); ctx.moveTo(-3, size / 3 - 2); ctx.lineTo(0, size / 3 - 6); ctx.lineTo(0, size / 3 - 2); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(3, size / 3 - 2); ctx.lineTo(0, size / 3 - 6); ctx.lineTo(0, size / 3 - 2); ctx.closePath(); ctx.fill();
    } else if (d.type === 'gun') {
        const gunColor = getToolColor(id);
        const name = (d.name || '').toLowerCase();
        if (d.zenithBlaster) {
            // Rainbow shifting gun
            const hue = (Date.now() / 12) % 360;
            ctx.fillStyle = `hsl(${hue},100%,50%)`; ctx.fillRect(-size * 0.38, -size * 0.1, size * 0.65, size * 0.2);
            ctx.fillStyle = `hsl(${(hue + 60) % 360},100%,60%)`; ctx.fillRect(size * 0.1, -size * 0.06, size * 0.32, size * 0.12);
            ctx.fillStyle = '#FFD700'; ctx.fillRect(-size * 0.18, size * 0.1, size * 0.2, size * 0.25);
            ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.arc(size * 0.42, 0, size * 0.1, 0, Math.PI * 2); ctx.fill();
        } else {
            // Gun body - horizontal
            ctx.fillStyle = name.includes('phoenix') ? '#FF4500' : name.includes('star') ? '#FFD700' : name.includes('mini') ? '#6699CC' : gunColor === '#808080' ? '#555' : gunColor;
            ctx.fillRect(-size * 0.35, -size * 0.08, size * 0.6, size * 0.16);
            // Barrel
            ctx.fillStyle = '#444';
            ctx.fillRect(size * 0.1, -size * 0.05, size * 0.3, size * 0.1);
            // Handle
            ctx.fillStyle = '#6B3A1E';
            ctx.fillRect(-size * 0.15, size * 0.08, size * 0.18, size * 0.25);
            // Trigger guard
            ctx.strokeStyle = '#555'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(-size * 0.05, size * 0.15, size * 0.08, 0, Math.PI); ctx.stroke();
            // Muzzle flash hint
            if (name.includes('phoenix') || name.includes('blaster')) {
                ctx.fillStyle = 'rgba(255,150,0,0.3)';
                ctx.beginPath(); ctx.arc(size * 0.4, 0, size * 0.08, 0, Math.PI * 2); ctx.fill();
            }
        }
    } else if (d.type === 'bullet') {
        const name = (d.name || '').toLowerCase();
        const tipColor = name.includes('silver') ? '#D0D0D0' : name.includes('meteor') ? '#8B4583' : '#CD7F32';
        const shellColor = name.includes('silver') ? '#B0B0B0' : name.includes('meteor') ? '#6A3470' : '#AA6622';
        // Bullet casing
        ctx.fillStyle = shellColor;
        ctx.fillRect(-size * 0.08, -size * 0.05, size * 0.16, size * 0.2);
        // Bullet tip
        ctx.fillStyle = tipColor;
        ctx.beginPath();
        ctx.moveTo(-size * 0.08, -size * 0.05);
        ctx.lineTo(0, -size * 0.25);
        ctx.lineTo(size * 0.08, -size * 0.05);
        ctx.closePath(); ctx.fill();
        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(-size * 0.04, -size * 0.18, size * 0.04, size * 0.12);
    } else if (d.type === 'throwable') {
        const name = (d.name || '').toLowerCase();
        if (name.includes('nuke')) {
            // Nuke - large bomb with radiation symbol
            ctx.fillStyle = '#333'; ctx.beginPath(); ctx.ellipse(0, size * 0.05, size * 0.3, size * 0.35, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#FFD700'; ctx.beginPath(); ctx.arc(0, -size * 0.05, size * 0.12, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#FF0000';
            for (let i = 0; i < 3; i++) {
                const a = i * Math.PI * 2 / 3 - Math.PI / 2;
                ctx.beginPath(); ctx.moveTo(0, -size * 0.05);
                ctx.arc(0, -size * 0.05, size * 0.22, a - 0.3, a + 0.3); ctx.closePath(); ctx.fill();
            }
            ctx.fillStyle = '#555'; ctx.fillRect(-size * 0.04, -size * 0.38, size * 0.08, size * 0.12);
        } else {
            // Grenade - small round with pin
            ctx.fillStyle = '#556B2F'; ctx.beginPath(); ctx.ellipse(0, size * 0.05, size * 0.2, size * 0.25, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#333'; ctx.fillRect(-size * 0.12, -size * 0.2, size * 0.24, size * 0.06);
            ctx.fillStyle = '#888'; ctx.fillRect(-size * 0.03, -size * 0.35, size * 0.06, size * 0.18);
            ctx.strokeStyle = '#AAA'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(size * 0.08, -size * 0.32, size * 0.06, 0, Math.PI * 1.5); ctx.stroke();
        }
    } else if (d.type === 'hammer') {
        ctx.fillStyle = '#8B4513'; ctx.fillRect(-2, -size / 2 + 4, 4, size - 4);
        ctx.fillStyle = color; ctx.fillRect(-size / 3, -size / 2 + 2, size * 2 / 3, size / 3);
    } else if (d.type === 'spear') {
        ctx.fillStyle = '#8B4513'; ctx.fillRect(-1.5, -size / 4, 3, size * 0.6);
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.moveTo(-4, -size / 4); ctx.lineTo(0, -size / 2 + 2); ctx.lineTo(4, -size / 4); ctx.closePath(); ctx.fill();
    } else if (d.type === 'boomerang') {
        // L-shaped boomerang
        ctx.fillStyle = color || '#808080';
        ctx.save(); ctx.rotate(-Math.PI / 4);
        ctx.fillRect(-size * 0.35, -size * 0.08, size * 0.45, size * 0.16);
        ctx.fillRect(-size * 0.08, -size * 0.08, size * 0.16, size * 0.45);
        ctx.restore();
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(-size * 0.15, -size * 0.15, size * 0.1, size * 0.1);
    } else if (d.type === 'yoyo') {
        // Yoyo with string
        ctx.strokeStyle = '#ccc'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, -size * 0.35); ctx.lineTo(0, -size * 0.05); ctx.stroke();
        ctx.fillStyle = color || '#808080';
        ctx.beginPath(); ctx.arc(0, size * 0.08, size * 0.25, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath(); ctx.arc(0, size * 0.08, size * 0.1, 0, Math.PI * 2); ctx.fill();
    } else if (d.type === 'flail') {
        // Ball on chain
        ctx.strokeStyle = '#888'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(0, -size * 0.3); ctx.lineTo(0, 0); ctx.stroke();
        ctx.fillStyle = '#666'; ctx.fillRect(-2, -size * 0.3, 4, 4); // handle
        ctx.fillStyle = color || '#808080';
        ctx.beginPath(); ctx.arc(0, size * 0.12, size * 0.25, 0, Math.PI * 2); ctx.fill();
        // Spikes
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.fillRect(-size * 0.28, size * 0.08, size * 0.08, size * 0.08);
        ctx.fillRect(size * 0.2, size * 0.08, size * 0.08, size * 0.08);
        ctx.fillRect(-size * 0.04, size * 0.33, size * 0.08, size * 0.08);
    } else if (d.type === 'helmet') {
        ctx.fillStyle = color;
        // Dome
        ctx.beginPath(); ctx.arc(0, -size * 0.05, size * 0.3, Math.PI, 0); ctx.fill();
        // Band
        ctx.fillRect(-size * 0.3, -size * 0.05, size * 0.6, size * 0.25);
        // Visor
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(-size * 0.25, size * 0.05, size * 0.5, size * 0.1);
    } else if (d.type === 'chestplate') {
        ctx.fillStyle = color;
        // Torso
        ctx.fillRect(-size * 0.3, -size * 0.25, size * 0.6, size * 0.5);
        // Shoulders
        ctx.fillRect(-size * 0.4, -size * 0.25, size * 0.15, size * 0.2);
        ctx.fillRect(size * 0.25, -size * 0.25, size * 0.15, size * 0.2);
        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(-size * 0.15, -size * 0.2, size * 0.3, size * 0.15);
    } else if (d.type === 'leggings') {
        ctx.fillStyle = color;
        // Left leg
        ctx.fillRect(-size * 0.25, -size * 0.2, size * 0.2, size * 0.45);
        // Right leg
        ctx.fillRect(size * 0.05, -size * 0.2, size * 0.2, size * 0.45);
        // Belt
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(-size * 0.25, -size * 0.2, size * 0.5, size * 0.08);
    } else if (d.type === 'accessory') {
        const name = (d.name || '').toLowerCase();
        const rarityColor = d.rarity === 'legendary' ? '#FFD700' : d.rarity === 'rare' ? '#00FF88' : '#C0C0C0';
        if (name.includes('boot') || name.includes('aglet') || name.includes('anklet')) {
            // Boot shape
            ctx.fillStyle = rarityColor;
            ctx.fillRect(-size * 0.2, -size * 0.3, size * 0.35, size * 0.5);
            ctx.fillRect(-size * 0.2, size * 0.1, size * 0.5, size * 0.15);
            ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(-size * 0.2, size * 0.05, size * 0.35, size * 0.06);
        } else if (name.includes('shield')) {
            // Shield shape
            ctx.fillStyle = rarityColor;
            ctx.beginPath(); ctx.moveTo(0, -size * 0.35); ctx.lineTo(size * 0.3, -size * 0.15);
            ctx.lineTo(size * 0.25, size * 0.25); ctx.lineTo(0, size * 0.38);
            ctx.lineTo(-size * 0.25, size * 0.25); ctx.lineTo(-size * 0.3, -size * 0.15); ctx.closePath(); ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.fillRect(-size * 0.1, -size * 0.2, size * 0.2, size * 0.15);
        } else if (name.includes('balloon') || name.includes('bottle') || name.includes('jar')) {
            // Bottle/balloon shape
            ctx.fillStyle = rarityColor;
            ctx.beginPath(); ctx.ellipse(0, size * 0.05, size * 0.25, size * 0.3, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.beginPath(); ctx.ellipse(-size * 0.08, -size * 0.08, size * 0.08, size * 0.12, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#8B4513'; ctx.fillRect(-size * 0.08, -size * 0.35, size * 0.16, size * 0.12);
        } else if (name.includes('necklace') || name.includes('cloak') || name.includes('band')) {
            // Ring/necklace
            ctx.strokeStyle = rarityColor; ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2); ctx.stroke();
            ctx.fillStyle = rarityColor;
            ctx.beginPath(); ctx.arc(0, size * 0.25, size * 0.1, 0, Math.PI * 2); ctx.fill();
        } else if (name.includes('glove') || name.includes('claw')) {
            // Glove
            ctx.fillStyle = rarityColor;
            ctx.fillRect(-size * 0.25, -size * 0.15, size * 0.5, size * 0.35);
            ctx.fillRect(-size * 0.25, -size * 0.35, size * 0.12, size * 0.25);
            ctx.fillRect(-size * 0.08, -size * 0.38, size * 0.12, size * 0.28);
            ctx.fillRect(size * 0.08, -size * 0.35, size * 0.12, size * 0.25);
        } else if (name.includes('horseshoe')) {
            // Horseshoe U shape
            ctx.strokeStyle = rarityColor; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(0, -size * 0.05, size * 0.25, 0, Math.PI); ctx.stroke();
            ctx.fillStyle = rarityColor;
            ctx.fillRect(-size * 0.27, -size * 0.05, size * 0.08, size * 0.3);
            ctx.fillRect(size * 0.19, -size * 0.05, size * 0.08, size * 0.3);
        } else {
            // Default gem/trinket
            ctx.fillStyle = rarityColor;
            ctx.beginPath();
            ctx.moveTo(0, -size * 0.3); ctx.lineTo(size * 0.25, -size * 0.1);
            ctx.lineTo(size * 0.2, size * 0.25); ctx.lineTo(-size * 0.2, size * 0.25);
            ctx.lineTo(-size * 0.25, -size * 0.1); ctx.closePath(); ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.25)';
            ctx.beginPath(); ctx.moveTo(0, -size * 0.25); ctx.lineTo(size * 0.15, -size * 0.08);
            ctx.lineTo(0, size * 0.05); ctx.lineTo(-size * 0.15, -size * 0.08); ctx.closePath(); ctx.fill();
        }
    } else if (d.type === 'material') {
        const barColors = { [ITEMS.COPPER_BAR]: '#CD7F32', [ITEMS.IRON_BAR]: '#C0C0C0', [ITEMS.GOLD_BAR]: '#FFD700', [ITEMS.DEMONITE_BAR]: '#6633AA', [ITEMS.CRIMTANE_BAR]: '#AA1133', [ITEMS.HELLSTONE_BAR]: '#FF4500', [ITEMS.METEORITE_BAR]: '#8B4583' };
        const name = (d.name || '').toLowerCase();
        if (barColors[id]) {
            // Flat ingot bar shape
            ctx.fillStyle = barColors[id];
            ctx.fillRect(-size * 0.38, -size * 0.12, size * 0.76, size * 0.28);
            // Top bevel
            ctx.fillStyle = 'rgba(255,255,255,0.25)';
            ctx.fillRect(-size * 0.35, -size * 0.12, size * 0.7, size * 0.06);
            // Bottom shadow
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.fillRect(-size * 0.35, size * 0.08, size * 0.7, size * 0.06);
        } else if (name.includes('plank')) {
            ctx.fillStyle = '#C4996B'; ctx.fillRect(-size * 0.38, -size * 0.15, size * 0.76, size * 0.3);
            ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(-size * 0.1, -size * 0.15, 1, size * 0.3);
            ctx.fillRect(size * 0.15, -size * 0.15, 1, size * 0.3);
        } else if (name.includes('stick')) {
            ctx.fillStyle = '#8B6842'; ctx.fillRect(-1, -size * 0.38, 3, size * 0.76);
            ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(-1, -size * 0.38, 1, size * 0.76);
        } else if (name.includes('gel')) {
            ctx.fillStyle = '#44EE44'; ctx.globalAlpha = 0.8;
            ctx.beginPath(); ctx.ellipse(0, size * 0.05, size * 0.28, size * 0.22, 0, 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = 0.4;
            ctx.beginPath(); ctx.ellipse(size * 0.08, -size * 0.08, size * 0.15, size * 0.12, 0, 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = 1;
        } else if (name.includes('lens')) {
            ctx.fillStyle = '#FF4444';
            ctx.beginPath(); ctx.arc(0, 0, size * 0.28, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#220000';
            ctx.beginPath(); ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.35)';
            ctx.beginPath(); ctx.arc(-size * 0.08, -size * 0.1, size * 0.08, 0, Math.PI * 2); ctx.fill();
        } else if (name.includes('star')) {
            ctx.fillStyle = '#FFFF44';
            for (let i = 0; i < 5; i++) {
                const a = (i * Math.PI * 2 / 5) - Math.PI / 2;
                const r = size * 0.33;
                ctx.fillRect(Math.cos(a) * r - 2, Math.sin(a) * r - 2, 4, 4);
            }
            ctx.beginPath(); ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(255,255,200,0.4)';
            ctx.beginPath(); ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2); ctx.fill();
        } else if (name.includes('bone')) {
            ctx.fillStyle = '#F0E8D0';
            ctx.fillRect(-size * 0.05, -size * 0.3, size * 0.1, size * 0.6);
            ctx.beginPath(); ctx.arc(-size * 0.1, -size * 0.28, size * 0.08, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(size * 0.1, -size * 0.28, size * 0.08, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(-size * 0.1, size * 0.28, size * 0.08, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(size * 0.1, size * 0.28, size * 0.08, 0, Math.PI * 2); ctx.fill();
        } else if (name.includes('hook')) {
            ctx.strokeStyle = '#A0A0A0'; ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.arc(0, -size * 0.05, size * 0.2, 0.3, Math.PI * 1.8); ctx.stroke();
            ctx.fillStyle = '#A0A0A0';
            ctx.beginPath(); ctx.moveTo(size * 0.15, size * 0.12); ctx.lineTo(size * 0.25, size * 0.25); ctx.lineTo(size * 0.08, size * 0.18); ctx.closePath(); ctx.fill();
        } else if (name.includes('chain')) {
            ctx.strokeStyle = '#888'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.ellipse(0, -size * 0.18, size * 0.1, size * 0.14, 0, 0, Math.PI * 2); ctx.stroke();
            ctx.beginPath(); ctx.ellipse(0, size * 0.1, size * 0.1, size * 0.14, 0, 0, Math.PI * 2); ctx.stroke();
        } else if (name.includes('feather')) {
            ctx.fillStyle = '#D0D0D0';
            ctx.beginPath(); ctx.ellipse(0, 0, size * 0.08, size * 0.35, 0.2, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#888'; ctx.fillRect(-1, -size * 0.35, 2, size * 0.7);
        } else if (name.includes('scale') || name.includes('sample') || name.includes('chunk') || name.includes('vertebra')) {
            // Organic drops - irregular blob
            const c = name.includes('scale') || name.includes('rotten') ? '#6633AA' : name.includes('sample') || name.includes('vertebra') ? '#AA1133' : '#808080';
            ctx.fillStyle = c;
            ctx.beginPath(); ctx.moveTo(-size * 0.2, -size * 0.25); ctx.lineTo(size * 0.25, -size * 0.15);
            ctx.lineTo(size * 0.2, size * 0.2); ctx.lineTo(-size * 0.15, size * 0.25);
            ctx.lineTo(-size * 0.28, size * 0.05); ctx.closePath(); ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(-size * 0.1, -size * 0.15, size * 0.12, size * 0.12);
        } else if (name.includes('vine') || name.includes('spore') || name.includes('stinger') || name.includes('cobweb')) {
            const c = name.includes('cobweb') ? '#DDDDDD' : name.includes('stinger') ? '#CC8822' : '#44AA44';
            ctx.fillStyle = c;
            if (name.includes('cobweb')) {
                ctx.strokeStyle = c; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(-size * 0.3, -size * 0.3); ctx.lineTo(size * 0.3, size * 0.3); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(size * 0.3, -size * 0.3); ctx.lineTo(-size * 0.3, size * 0.3); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(0, -size * 0.35); ctx.lineTo(0, size * 0.35); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(-size * 0.35, 0); ctx.lineTo(size * 0.35, 0); ctx.stroke();
            } else if (name.includes('stinger')) {
                ctx.beginPath(); ctx.moveTo(0, -size * 0.38); ctx.lineTo(size * 0.12, size * 0.2); ctx.lineTo(-size * 0.12, size * 0.2); ctx.closePath(); ctx.fill();
            } else {
                // Vine / spores
                ctx.strokeStyle = c; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(0, -size * 0.35); ctx.bezierCurveTo(size * 0.2, -size * 0.1, -size * 0.2, size * 0.1, 0, size * 0.35); ctx.stroke();
            }
        } else if (name.includes('skull')) {
            ctx.fillStyle = '#D0C8B8';
            ctx.beginPath(); ctx.arc(0, -size * 0.05, size * 0.25, 0, Math.PI * 2); ctx.fill();
            ctx.fillRect(-size * 0.15, size * 0.12, size * 0.3, size * 0.12);
            ctx.fillStyle = '#222';
            ctx.fillRect(-size * 0.12, -size * 0.1, size * 0.08, size * 0.08);
            ctx.fillRect(size * 0.04, -size * 0.1, size * 0.08, size * 0.08);
        } else if (name.includes('mandible') || name.includes('fin')) {
            const c = name.includes('fin') ? '#5588AA' : '#C2A060';
            ctx.fillStyle = c;
            ctx.beginPath(); ctx.moveTo(0, -size * 0.35); ctx.lineTo(size * 0.25, size * 0.15);
            ctx.quadraticCurveTo(0, size * 0.35, -size * 0.25, size * 0.15); ctx.closePath(); ctx.fill();
        } else {
            // Generic material square with border
            ctx.fillStyle = '#808080'; ctx.fillRect(-size / 3, -size / 3, size * 2 / 3, size * 2 / 3);
            ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(-size / 3, -size / 3, size * 2 / 3, size * 0.12);
        }
    } else if (d.type === 'consumable' || d.type === 'tool') {
        const name = (d.name || '').toLowerCase();
        if (d.heal || d.manaRestore || name.includes('potion')) {
            // Potion bottle
            const potionColor = d.heal ? '#FF4455' : d.manaRestore ? '#4466FF' : name.includes('iron') ? '#CCAA55' : name.includes('swift') ? '#55CCFF' : name.includes('regen') ? '#FF88CC' : name.includes('archery') ? '#88FF44' : '#AABB44';
            // Bottle shape
            ctx.fillStyle = 'rgba(200,220,255,0.4)';
            ctx.fillRect(-size * 0.06, -size * 0.38, size * 0.12, size * 0.12); // neck
            ctx.beginPath(); ctx.ellipse(0, size * 0.08, size * 0.22, size * 0.28, 0, 0, Math.PI * 2); ctx.fill();
            // Liquid fill
            ctx.fillStyle = potionColor;
            ctx.beginPath(); ctx.ellipse(0, size * 0.12, size * 0.18, size * 0.2, 0, 0, Math.PI * 2); ctx.fill();
            // Cork
            ctx.fillStyle = '#AA8855'; ctx.fillRect(-size * 0.07, -size * 0.4, size * 0.14, size * 0.1);
            // Highlight
            ctx.fillStyle = 'rgba(255,255,255,0.35)';
            ctx.fillRect(-size * 0.14, -size * 0.02, size * 0.06, size * 0.12);
        } else if (name.includes('crystal')) {
            // Crystal shape
            const crystalColor = d.maxHealth ? '#FF1493' : '#4488FF';
            ctx.fillStyle = crystalColor;
            ctx.beginPath(); ctx.moveTo(0, -size * 0.38); ctx.lineTo(size * 0.22, -size * 0.05);
            ctx.lineTo(size * 0.15, size * 0.3); ctx.lineTo(-size * 0.15, size * 0.3);
            ctx.lineTo(-size * 0.22, -size * 0.05); ctx.closePath(); ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.beginPath(); ctx.moveTo(0, -size * 0.35); ctx.lineTo(size * 0.1, -size * 0.05);
            ctx.lineTo(0, size * 0.1); ctx.lineTo(-size * 0.1, -size * 0.05); ctx.closePath(); ctx.fill();
        } else if (name.includes('mirror')) {
            // Hand mirror
            ctx.fillStyle = '#8B4513'; ctx.fillRect(-size * 0.05, size * 0.05, size * 0.1, size * 0.3);
            ctx.fillStyle = '#88AADD';
            ctx.beginPath(); ctx.ellipse(0, -size * 0.1, size * 0.22, size * 0.25, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.beginPath(); ctx.ellipse(-size * 0.06, -size * 0.15, size * 0.08, size * 0.1, 0, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#AA8833'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.ellipse(0, -size * 0.1, size * 0.22, size * 0.25, 0, 0, Math.PI * 2); ctx.stroke();
        } else if (name.includes('hook') || name.includes('whip')) {
            // Grappling hook
            ctx.strokeStyle = '#888'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(0, -size * 0.35); ctx.lineTo(0, 0); ctx.stroke();
            ctx.fillStyle = '#A0A0A0';
            ctx.beginPath(); ctx.moveTo(-size * 0.2, size * 0.15); ctx.lineTo(0, size * 0.35); ctx.lineTo(size * 0.2, size * 0.15); ctx.lineTo(0, size * 0.05); ctx.closePath(); ctx.fill();
        } else {
            // Default tool orb
            ctx.fillStyle = '#9966FF';
            ctx.beginPath(); ctx.arc(0, 0, size * 0.28, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.25)';
            ctx.beginPath(); ctx.arc(-size * 0.06, -size * 0.08, size * 0.1, 0, Math.PI * 2); ctx.fill();
        }
    }
    
    // Draw 2-letter abbreviation on all items
    const abbr = (d.name || '').substring(0, 2).toUpperCase();
    const fontSize = Math.max(6, Math.floor(size * 0.32));
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.fillStyle = '#000'; ctx.fillText(abbr, 1, size / 2 + 1);
    ctx.fillStyle = '#fff'; ctx.fillText(abbr, 0, size / 2);
    
    ctx.restore();
}
