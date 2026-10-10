// English FFVIII reference catalog. Numeric bonuses for new spells are per 100 stock.
// Sources: https://ffonline.com/ff8/abilities and https://ffonline.com/ff8/magic
// Existing Garden spell coefficients are retained by engine.js for save compatibility.
export const CANON_ABILITIES = {
 "ability_x3": {
  "name": "Ability x3",
  "ap": 0,
  "kind": "junction",
  "sourceCategory": "junction",
  "description": "Unlocks a Junction option while its GF is equipped."
 },
 "ability_x4": {
  "name": "Ability x4",
  "ap": 0,
  "kind": "junction",
  "sourceCategory": "junction",
  "description": "Unlocks a Junction option while its GF is equipped."
 },
 "elem_atk_j": {
  "name": "Elem-Atk-J",
  "ap": 160,
  "kind": "junction",
  "sourceCategory": "junction",
  "description": "Unlocks a Junction option while its GF is equipped."
 },
 "elem_def_j": {
  "name": "Elem-Def-J",
  "ap": 100,
  "kind": "junction",
  "sourceCategory": "junction",
  "description": "Unlocks a Junction option while its GF is equipped."
 },
 "elem_def_jx2": {
  "name": "Elem-Def-Jx2",
  "ap": 130,
  "kind": "junction",
  "sourceCategory": "junction",
  "description": "Unlocks a Junction option while its GF is equipped."
 },
 "elem_def_jx4": {
  "name": "Elem-Def-Jx4",
  "ap": 180,
  "kind": "junction",
  "sourceCategory": "junction",
  "description": "Unlocks a Junction option while its GF is equipped."
 },
 "j_eva": {
  "name": "Eva-J",
  "ap": 200,
  "kind": "junction",
  "sourceCategory": "junction",
  "stat": "eva",
  "description": "Unlocks a Junction option while its GF is equipped."
 },
 "j_hit": {
  "name": "Hit-J",
  "ap": 120,
  "kind": "junction",
  "sourceCategory": "junction",
  "stat": "hit",
  "description": "Unlocks a Junction option while its GF is equipped."
 },
 "j_hp": {
  "name": "HP-J",
  "ap": 50,
  "kind": "junction",
  "sourceCategory": "junction",
  "stat": "hp",
  "description": "Unlocks a Junction option while its GF is equipped."
 },
 "j_luck": {
  "name": "Luck-J",
  "ap": 200,
  "kind": "junction",
  "sourceCategory": "junction",
  "stat": "luck",
  "description": "Unlocks a Junction option while its GF is equipped."
 },
 "j_mag": {
  "name": "Mag-J",
  "ap": 50,
  "kind": "junction",
  "sourceCategory": "junction",
  "stat": "mag",
  "description": "Unlocks a Junction option while its GF is equipped."
 },
 "j_spd": {
  "name": "Spd-J",
  "ap": 120,
  "kind": "junction",
  "sourceCategory": "junction",
  "stat": "spd",
  "description": "Unlocks a Junction option while its GF is equipped."
 },
 "j_spr": {
  "name": "Spr-J",
  "ap": 50,
  "kind": "junction",
  "sourceCategory": "junction",
  "stat": "spr",
  "description": "Unlocks a Junction option while its GF is equipped."
 },
 "st_atk_j": {
  "name": "ST-Atk-J",
  "ap": 160,
  "kind": "junction",
  "sourceCategory": "junction",
  "description": "Unlocks a Junction option while its GF is equipped."
 },
 "st_def_j": {
  "name": "ST-Def-J",
  "ap": 100,
  "kind": "junction",
  "sourceCategory": "junction",
  "description": "Unlocks a Junction option while its GF is equipped."
 },
 "st_def_jx2": {
  "name": "ST-Def-Jx2",
  "ap": 130,
  "kind": "junction",
  "sourceCategory": "junction",
  "description": "Unlocks a Junction option while its GF is equipped."
 },
 "st_def_jx4": {
  "name": "ST-Def-Jx4",
  "ap": 180,
  "kind": "junction",
  "sourceCategory": "junction",
  "description": "Unlocks a Junction option while its GF is equipped."
 },
 "j_str": {
  "name": "Str-J",
  "ap": 50,
  "kind": "junction",
  "sourceCategory": "junction",
  "stat": "str",
  "description": "Unlocks a Junction option while its GF is equipped."
 },
 "j_vit": {
  "name": "Vit-J",
  "ap": 50,
  "kind": "junction",
  "sourceCategory": "junction",
  "stat": "vit",
  "description": "Unlocks a Junction option while its GF is equipped."
 },
 "absorb": {
  "name": "Absorb",
  "ap": 80,
  "kind": "command",
  "sourceCategory": "command",
  "description": "A battle command available through an equipped GF."
 },
 "attack": {
  "name": "Attack",
  "ap": 0,
  "kind": "command",
  "sourceCategory": "command",
  "description": "A battle command available through an equipped GF."
 },
 "card": {
  "name": "Card",
  "ap": 40,
  "kind": "command",
  "sourceCategory": "command",
  "description": "A battle command available through an equipped GF."
 },
 "darkside": {
  "name": "Darkside",
  "ap": 100,
  "kind": "command",
  "sourceCategory": "command",
  "description": "A battle command available through an equipped GF."
 },
 "defend": {
  "name": "Defend",
  "ap": 100,
  "kind": "command",
  "sourceCategory": "command",
  "description": "A battle command available through an equipped GF."
 },
 "devour": {
  "name": "Devour",
  "ap": 0,
  "kind": "command",
  "sourceCategory": "command",
  "description": "A battle command available through an equipped GF."
 },
 "doom": {
  "name": "Doom",
  "ap": 60,
  "kind": "command",
  "sourceCategory": "command",
  "description": "A battle command available through an equipped GF."
 },
 "draw": {
  "name": "Draw",
  "ap": 0,
  "kind": "command",
  "sourceCategory": "command",
  "description": "A battle command available through an equipped GF."
 },
 "summon": {
  "name": "GF",
  "ap": 0,
  "kind": "command",
  "sourceCategory": "command",
  "description": "A battle command available through an equipped GF."
 },
 "item": {
  "name": "Item",
  "ap": 0,
  "kind": "command",
  "sourceCategory": "command",
  "description": "A battle command available through an equipped GF."
 },
 "kamikaze": {
  "name": "Kamikaze",
  "ap": 100,
  "kind": "command",
  "sourceCategory": "command",
  "description": "A battle command available through an equipped GF."
 },
 "lv_down": {
  "name": "LV Down",
  "ap": 0,
  "kind": "command",
  "sourceCategory": "command",
  "description": "A battle command available through an equipped GF."
 },
 "lv_up": {
  "name": "LV Up",
  "ap": 0,
  "kind": "command",
  "sourceCategory": "command",
  "description": "A battle command available through an equipped GF."
 },
 "mad_rush": {
  "name": "Mad Rush",
  "ap": 60,
  "kind": "command",
  "sourceCategory": "command",
  "description": "A battle command available through an equipped GF."
 },
 "magic": {
  "name": "Magic",
  "ap": 0,
  "kind": "command",
  "sourceCategory": "command",
  "description": "A battle command available through an equipped GF."
 },
 "minimog": {
  "name": "MiniMog",
  "ap": 0,
  "kind": "command",
  "sourceCategory": "command",
  "description": "A battle command available through an equipped GF."
 },
 "recover": {
  "name": "Recover",
  "ap": 200,
  "kind": "command",
  "sourceCategory": "command",
  "description": "A battle command available through an equipped GF."
 },
 "revive": {
  "name": "Revive",
  "ap": 200,
  "kind": "command",
  "sourceCategory": "command",
  "description": "A battle command available through an equipped GF."
 },
 "treatment": {
  "name": "Treatment",
  "ap": 0,
  "kind": "command",
  "sourceCategory": "command",
  "description": "A battle command available through an equipped GF."
 },
 "auto_haste": {
  "name": "Auto-Haste",
  "ap": 250,
  "kind": "passive",
  "sourceCategory": "character",
  "description": "A character support ability."
 },
 "auto_potion": {
  "name": "Auto-Potion",
  "ap": 150,
  "kind": "passive",
  "sourceCategory": "character",
  "description": "A character support ability."
 },
 "auto_protect": {
  "name": "Auto-Protect",
  "ap": 250,
  "kind": "passive",
  "sourceCategory": "character",
  "description": "A character support ability."
 },
 "auto_reflect": {
  "name": "Auto-Reflect",
  "ap": 250,
  "kind": "passive",
  "sourceCategory": "character",
  "description": "A character support ability."
 },
 "auto_shell": {
  "name": "Auto-Shell",
  "ap": 250,
  "kind": "passive",
  "sourceCategory": "character",
  "description": "A character support ability."
 },
 "counter": {
  "name": "Counter",
  "ap": 200,
  "kind": "passive",
  "sourceCategory": "character",
  "description": "A character support ability."
 },
 "cover": {
  "name": "Cover",
  "ap": 100,
  "kind": "passive",
  "sourceCategory": "character",
  "description": "A character support ability."
 },
 "eva30": {
  "name": "Eva+30%",
  "ap": 150,
  "kind": "passive",
  "sourceCategory": "character",
  "stat": "eva",
  "percent": 30,
  "description": "Increases EVA by 30% when equipped."
 },
 "expendx2_1": {
  "name": "Expendx2-1",
  "ap": 250,
  "kind": "passive",
  "sourceCategory": "character",
  "description": "A character support ability."
 },
 "expendx3_1": {
  "name": "Expendx3-1",
  "ap": 250,
  "kind": "passive",
  "sourceCategory": "character",
  "description": "A character support ability."
 },
 "hp_bonus": {
  "name": "HP Bonus",
  "ap": 100,
  "kind": "passive",
  "sourceCategory": "character",
  "description": "A character support ability."
 },
 "hp20": {
  "name": "HP+20%",
  "ap": 60,
  "kind": "passive",
  "sourceCategory": "character",
  "stat": "hp",
  "percent": 20,
  "description": "Increases HP by 20% when equipped."
 },
 "hp40": {
  "name": "HP+40%",
  "ap": 120,
  "kind": "passive",
  "sourceCategory": "character",
  "stat": "hp",
  "percent": 40,
  "description": "Increases HP by 40% when equipped."
 },
 "hp80": {
  "name": "HP+80%",
  "ap": 240,
  "kind": "passive",
  "sourceCategory": "character",
  "stat": "hp",
  "percent": 80,
  "description": "Increases HP by 80% when equipped."
 },
 "initiative": {
  "name": "Initiative",
  "ap": 160,
  "kind": "passive",
  "sourceCategory": "character",
  "description": "A character support ability."
 },
 "luck50": {
  "name": "Luck+50%",
  "ap": 200,
  "kind": "passive",
  "sourceCategory": "character",
  "stat": "luck",
  "percent": 50,
  "description": "Increases LUCK by 50% when equipped."
 },
 "mag_bonus": {
  "name": "Mag Bonus",
  "ap": 100,
  "kind": "passive",
  "sourceCategory": "character",
  "description": "A character support ability."
 },
 "mag20": {
  "name": "Mag+20%",
  "ap": 60,
  "kind": "passive",
  "sourceCategory": "character",
  "stat": "mag",
  "percent": 20,
  "description": "Increases MAG by 20% when equipped."
 },
 "mag40": {
  "name": "Mag+40%",
  "ap": 120,
  "kind": "passive",
  "sourceCategory": "character",
  "stat": "mag",
  "percent": 40,
  "description": "Increases MAG by 40% when equipped."
 },
 "mag60": {
  "name": "Mag+60%",
  "ap": 0,
  "kind": "passive",
  "sourceCategory": "character",
  "stat": "mag",
  "percent": 60,
  "description": "Increases MAG by 60% when equipped."
 },
 "med_data": {
  "name": "Med Data",
  "ap": 200,
  "kind": "passive",
  "sourceCategory": "character",
  "description": "A character support ability."
 },
 "move_hp_up": {
  "name": "Move-HP Up",
  "ap": 200,
  "kind": "passive",
  "sourceCategory": "character",
  "description": "A character support ability."
 },
 "mug": {
  "name": "Mug",
  "ap": 200,
  "kind": "passive",
  "sourceCategory": "character",
  "description": "A character support ability."
 },
 "return_damage": {
  "name": "Return Damage",
  "ap": 0,
  "kind": "passive",
  "sourceCategory": "character",
  "description": "A character support ability."
 },
 "ribbon": {
  "name": "Ribbon",
  "ap": 0,
  "kind": "passive",
  "sourceCategory": "character",
  "description": "A character support ability."
 },
 "spd20": {
  "name": "Spd+20%",
  "ap": 150,
  "kind": "passive",
  "sourceCategory": "character",
  "stat": "spd",
  "percent": 20,
  "description": "Increases SPD by 20% when equipped."
 },
 "spd40": {
  "name": "Spd+40%",
  "ap": 200,
  "kind": "passive",
  "sourceCategory": "character",
  "stat": "spd",
  "percent": 40,
  "description": "Increases SPD by 40% when equipped."
 },
 "spr_bonus": {
  "name": "Spr Bonus",
  "ap": 100,
  "kind": "passive",
  "sourceCategory": "character",
  "description": "A character support ability."
 },
 "spr20": {
  "name": "Spr+20%",
  "ap": 60,
  "kind": "passive",
  "sourceCategory": "character",
  "stat": "spr",
  "percent": 20,
  "description": "Increases SPR by 20% when equipped."
 },
 "spr40": {
  "name": "Spr+40%",
  "ap": 120,
  "kind": "passive",
  "sourceCategory": "character",
  "stat": "spr",
  "percent": 40,
  "description": "Increases SPR by 40% when equipped."
 },
 "spr60": {
  "name": "Spr+60%",
  "ap": 0,
  "kind": "passive",
  "sourceCategory": "character",
  "stat": "spr",
  "percent": 60,
  "description": "Increases SPR by 60% when equipped."
 },
 "str_bonus": {
  "name": "Str Bonus",
  "ap": 100,
  "kind": "passive",
  "sourceCategory": "character",
  "description": "A character support ability."
 },
 "str20": {
  "name": "Str+20%",
  "ap": 60,
  "kind": "passive",
  "sourceCategory": "character",
  "stat": "str",
  "percent": 20,
  "description": "Increases STR by 20% when equipped."
 },
 "str40": {
  "name": "Str+40%",
  "ap": 120,
  "kind": "passive",
  "sourceCategory": "character",
  "stat": "str",
  "percent": 40,
  "description": "Increases STR by 40% when equipped."
 },
 "str60": {
  "name": "Str+60%",
  "ap": 0,
  "kind": "passive",
  "sourceCategory": "character",
  "stat": "str",
  "percent": 60,
  "description": "Increases STR by 60% when equipped."
 },
 "vit_bonus": {
  "name": "Vit Bonus",
  "ap": 100,
  "kind": "passive",
  "sourceCategory": "character",
  "description": "A character support ability."
 },
 "vit20": {
  "name": "Vit+20%",
  "ap": 60,
  "kind": "passive",
  "sourceCategory": "character",
  "stat": "vit",
  "percent": 20,
  "description": "Increases VIT by 20% when equipped."
 },
 "vit40": {
  "name": "Vit+40%",
  "ap": 120,
  "kind": "passive",
  "sourceCategory": "character",
  "stat": "vit",
  "percent": 40,
  "description": "Increases VIT by 40% when equipped."
 },
 "vit60": {
  "name": "Vit+60%",
  "ap": 0,
  "kind": "passive",
  "sourceCategory": "character",
  "stat": "vit",
  "percent": 60,
  "description": "Increases VIT by 60% when equipped."
 },
 "alert": {
  "name": "Alert",
  "ap": 200,
  "kind": "party",
  "sourceCategory": "party",
  "description": "A party or exploration ability."
 },
 "enc_half": {
  "name": "Enc-Half",
  "ap": 30,
  "kind": "party",
  "sourceCategory": "party",
  "description": "A party or exploration ability."
 },
 "enc_none": {
  "name": "Enc-None",
  "ap": 100,
  "kind": "party",
  "sourceCategory": "party",
  "description": "A party or exploration ability."
 },
 "move_find": {
  "name": "Move-Find",
  "ap": 40,
  "kind": "party",
  "sourceCategory": "party",
  "description": "A party or exploration ability."
 },
 "rare_item": {
  "name": "Rare Item",
  "ap": 250,
  "kind": "party",
  "sourceCategory": "party",
  "description": "A party or exploration ability."
 },
 "boost": {
  "name": "Boost",
  "ap": 10,
  "kind": "gf",
  "sourceCategory": "gf",
  "description": "A support ability for the GF summon."
 },
 "gfhp_10": {
  "name": "GFHP+10%",
  "ap": 40,
  "kind": "gf",
  "sourceCategory": "gf",
  "description": "A support ability for the GF summon."
 },
 "gfhp_20": {
  "name": "GFHP+20%",
  "ap": 70,
  "kind": "gf",
  "sourceCategory": "gf",
  "description": "A support ability for the GF summon."
 },
 "gfhp_30": {
  "name": "GFHP+30%",
  "ap": 140,
  "kind": "gf",
  "sourceCategory": "gf",
  "description": "A support ability for the GF summon."
 },
 "gfhp_40": {
  "name": "GFHP+40%",
  "ap": 200,
  "kind": "gf",
  "sourceCategory": "gf",
  "description": "A support ability for the GF summon."
 },
 "summag_10": {
  "name": "SumMag+10%",
  "ap": 40,
  "kind": "gf",
  "sourceCategory": "gf",
  "description": "A support ability for the GF summon."
 },
 "summag_20": {
  "name": "SumMag+20%",
  "ap": 70,
  "kind": "gf",
  "sourceCategory": "gf",
  "description": "A support ability for the GF summon."
 },
 "summag_30": {
  "name": "SumMag+30%",
  "ap": 140,
  "kind": "gf",
  "sourceCategory": "gf",
  "description": "A support ability for the GF summon."
 },
 "summag_40": {
  "name": "SumMag+40%",
  "ap": 200,
  "kind": "gf",
  "sourceCategory": "gf",
  "description": "A support ability for the GF summon."
 },
 "ammo_rf": {
  "name": "Ammo-RF",
  "ap": 30,
  "kind": "menu",
  "sourceCategory": "menu",
  "description": "A menu or refinement ability."
 },
 "call_shop": {
  "name": "Call Shop",
  "ap": 200,
  "kind": "menu",
  "sourceCategory": "menu",
  "description": "A menu or refinement ability."
 },
 "card_mod": {
  "name": "Card Mod",
  "ap": 80,
  "kind": "menu",
  "sourceCategory": "menu",
  "description": "A menu or refinement ability."
 },
 "f_mag_rf": {
  "name": "F Mag-RF",
  "ap": 30,
  "kind": "menu",
  "sourceCategory": "menu",
  "description": "A menu or refinement ability."
 },
 "familiar": {
  "name": "Familiar",
  "ap": 150,
  "kind": "menu",
  "sourceCategory": "menu",
  "description": "A menu or refinement ability."
 },
 "forbid_mag_rf": {
  "name": "Forbid Mag-RF",
  "ap": 0,
  "kind": "menu",
  "sourceCategory": "menu",
  "description": "A menu or refinement ability."
 },
 "forbid_med_rf": {
  "name": "Forbid Med-RF",
  "ap": 200,
  "kind": "menu",
  "sourceCategory": "menu",
  "description": "A menu or refinement ability."
 },
 "gfabl_med_rf": {
  "name": "GFAbl Med-RF",
  "ap": 30,
  "kind": "menu",
  "sourceCategory": "menu",
  "description": "A menu or refinement ability."
 },
 "gfrecov_med_rf": {
  "name": "GFRecov Med-RF",
  "ap": 30,
  "kind": "menu",
  "sourceCategory": "menu",
  "description": "A menu or refinement ability."
 },
 "haggle": {
  "name": "Haggle",
  "ap": 150,
  "kind": "menu",
  "sourceCategory": "menu",
  "description": "A menu or refinement ability."
 },
 "high_mag_rf": {
  "name": "High Mag-RF",
  "ap": 60,
  "kind": "menu",
  "sourceCategory": "menu",
  "description": "A menu or refinement ability."
 },
 "i_mag_rf": {
  "name": "I Mag-RF",
  "ap": 30,
  "kind": "menu",
  "sourceCategory": "menu",
  "description": "A menu or refinement ability."
 },
 "junk_shop": {
  "name": "Junk Shop",
  "ap": 0,
  "kind": "menu",
  "sourceCategory": "menu",
  "description": "A menu or refinement ability."
 },
 "l_mag_rf": {
  "name": "L Mag-RF",
  "ap": 30,
  "kind": "menu",
  "sourceCategory": "menu",
  "description": "A menu or refinement ability."
 },
 "med_lv_up": {
  "name": "Med LV Up",
  "ap": 120,
  "kind": "menu",
  "sourceCategory": "menu",
  "description": "A menu or refinement ability."
 },
 "mid_mag_rf": {
  "name": "Mid Mag-RF",
  "ap": 60,
  "kind": "menu",
  "sourceCategory": "menu",
  "description": "A menu or refinement ability."
 },
 "recov_med_rf": {
  "name": "Recov Med-RF",
  "ap": 30,
  "kind": "menu",
  "sourceCategory": "menu",
  "description": "A menu or refinement ability."
 },
 "sell_high": {
  "name": "Sell-High",
  "ap": 150,
  "kind": "menu",
  "sourceCategory": "menu",
  "description": "A menu or refinement ability."
 },
 "st_mag_rf": {
  "name": "ST Mag-RF",
  "ap": 30,
  "kind": "menu",
  "sourceCategory": "menu",
  "description": "A menu or refinement ability."
 },
 "st_med_rf": {
  "name": "ST Med-RF",
  "ap": 30,
  "kind": "menu",
  "sourceCategory": "menu",
  "description": "A menu or refinement ability."
 },
 "supt_mag_rf": {
  "name": "Supt Mag-RF",
  "ap": 20,
  "kind": "menu",
  "sourceCategory": "menu",
  "description": "A menu or refinement ability."
 },
 "t_mag_rf": {
  "name": "T Mag-RF",
  "ap": 30,
  "kind": "menu",
  "sourceCategory": "menu",
  "description": "A menu or refinement ability."
 },
 "time_mag_rf": {
  "name": "Time Mag-RF",
  "ap": 30,
  "kind": "menu",
  "sourceCategory": "menu",
  "description": "A menu or refinement ability."
 },
 "tool_rf": {
  "name": "Tool-RF",
  "ap": 30,
  "kind": "menu",
  "sourceCategory": "menu",
  "description": "A menu or refinement ability."
 }
};
export const GF_CATALOG = {
 "quezacotl": {
  "id": "quezacotl",
  "name": "Quezacotl",
  "element": "Thunder",
  "description": "Quezacotl \u2014 canonical FFVIII Guardian Force.",
  "abilities": [
   "elem_atk_j",
   "elem_def_j",
   "elem_def_jx2",
   "j_hp",
   "j_mag",
   "j_vit",
   "card",
   "draw",
   "summon",
   "item",
   "magic",
   "mag20",
   "mag40",
   "boost",
   "gfhp_10",
   "gfhp_20",
   "summag_10",
   "summag_20",
   "summag_30",
   "card_mod",
   "mid_mag_rf",
   "t_mag_rf"
  ],
  "learned": [
   "magic",
   "draw",
   "item",
   "summon",
   "j_mag"
  ],
  "summonOnly": false
 },
 "shiva": {
  "id": "shiva",
  "name": "Shiva",
  "element": "Ice",
  "description": "Shiva \u2014 canonical FFVIII Guardian Force.",
  "abilities": [
   "elem_atk_j",
   "elem_def_j",
   "elem_def_jx2",
   "j_spr",
   "j_str",
   "j_vit",
   "doom",
   "draw",
   "summon",
   "item",
   "magic",
   "spr20",
   "spr40",
   "vit20",
   "vit40",
   "boost",
   "gfhp_10",
   "gfhp_20",
   "summag_10",
   "summag_20",
   "summag_30",
   "i_mag_rf"
  ],
  "learned": [
   "magic",
   "draw",
   "item",
   "summon",
   "j_spr"
  ],
  "summonOnly": false
 },
 "ifrit": {
  "id": "ifrit",
  "name": "Ifrit",
  "element": "Fire",
  "description": "Ifrit \u2014 canonical FFVIII Guardian Force.",
  "abilities": [
   "elem_atk_j",
   "elem_def_j",
   "elem_def_jx2",
   "j_hp",
   "j_str",
   "draw",
   "summon",
   "item",
   "mad_rush",
   "magic",
   "str_bonus",
   "str20",
   "str40",
   "boost",
   "gfhp_10",
   "gfhp_20",
   "gfhp_30",
   "summag_10",
   "summag_20",
   "summag_30",
   "ammo_rf",
   "f_mag_rf"
  ],
  "learned": [
   "magic",
   "draw",
   "item",
   "summon",
   "j_str",
   "elem_atk_j"
  ],
  "summonOnly": false
 },
 "siren": {
  "id": "siren",
  "name": "Siren",
  "element": "Non-elemental",
  "description": "Siren \u2014 canonical FFVIII Guardian Force.",
  "abilities": [
   "j_mag",
   "st_atk_j",
   "st_def_j",
   "st_def_jx2",
   "draw",
   "summon",
   "item",
   "magic",
   "treatment",
   "mag_bonus",
   "mag20",
   "mag40",
   "move_find",
   "boost",
   "gfhp_10",
   "gfhp_20",
   "summag_10",
   "summag_20",
   "summag_30",
   "l_mag_rf",
   "st_med_rf",
   "tool_rf"
  ],
  "learned": [
   "magic",
   "draw",
   "item",
   "summon",
   "j_mag",
   "st_atk_j",
   "st_def_j"
  ],
  "summonOnly": false
 },
 "brothers": {
  "id": "brothers",
  "name": "Brothers",
  "element": "Earth",
  "description": "Brothers \u2014 canonical FFVIII Guardian Force.",
  "abilities": [
   "elem_atk_j",
   "elem_def_j",
   "j_hp",
   "j_spr",
   "j_str",
   "defend",
   "draw",
   "summon",
   "item",
   "magic",
   "cover",
   "hp_bonus",
   "hp20",
   "hp40",
   "hp80",
   "boost",
   "gfhp_10",
   "gfhp_20",
   "gfhp_30",
   "summag_10",
   "summag_20",
   "summag_30"
  ],
  "learned": [
   "magic",
   "draw",
   "item",
   "summon",
   "j_hp",
   "hp20"
  ],
  "summonOnly": false
 },
 "diablos": {
  "id": "diablos",
  "name": "Diablos",
  "element": "Non-elemental",
  "description": "Diablos \u2014 canonical FFVIII Guardian Force.",
  "abilities": [
   "ability_x3",
   "j_hit",
   "j_hp",
   "j_mag",
   "darkside",
   "draw",
   "summon",
   "item",
   "magic",
   "hp20",
   "hp40",
   "hp80",
   "mag20",
   "mag40",
   "mug",
   "enc_half",
   "enc_none",
   "gfhp_10",
   "gfhp_20",
   "gfhp_30",
   "st_mag_rf",
   "time_mag_rf"
  ],
  "learned": [
   "magic",
   "draw",
   "item",
   "summon",
   "j_mag",
   "ability_x3"
  ],
  "summonOnly": false
 },
 "carbuncle": {
  "id": "carbuncle",
  "name": "Carbuncle",
  "element": "Non-elemental",
  "description": "Carbuncle \u2014 canonical FFVIII Guardian Force.",
  "abilities": [
   "ability_x3",
   "j_hp",
   "j_mag",
   "st_atk_j",
   "st_def_j",
   "st_def_jx2",
   "j_vit",
   "draw",
   "summon",
   "item",
   "magic",
   "auto_reflect",
   "counter",
   "hp20",
   "hp40",
   "vit_bonus",
   "vit20",
   "vit40",
   "gfhp_10",
   "gfhp_20",
   "gfhp_30",
   "recov_med_rf"
  ],
  "learned": [
   "magic",
   "draw",
   "item",
   "summon",
   "j_vit",
   "ability_x3"
  ],
  "summonOnly": false
 },
 "leviathan": {
  "id": "leviathan",
  "name": "Leviathan",
  "element": "Water",
  "description": "Leviathan \u2014 canonical FFVIII Guardian Force.",
  "abilities": [
   "elem_atk_j",
   "elem_def_jx2",
   "j_mag",
   "j_spr",
   "draw",
   "summon",
   "item",
   "magic",
   "recover",
   "auto_potion",
   "spr_bonus",
   "spr20",
   "spr40",
   "boost",
   "gfhp_10",
   "gfhp_20",
   "gfhp_30",
   "summag_10",
   "summag_20",
   "summag_30",
   "gfrecov_med_rf",
   "supt_mag_rf"
  ],
  "learned": [
   "magic",
   "draw",
   "item",
   "summon",
   "j_spr"
  ],
  "summonOnly": false
 },
 "pandemona": {
  "id": "pandemona",
  "name": "Pandemona",
  "element": "Wind",
  "description": "Pandemona \u2014 canonical FFVIII Guardian Force.",
  "abilities": [
   "elem_atk_j",
   "elem_def_j",
   "elem_def_jx2",
   "j_spd",
   "j_str",
   "absorb",
   "draw",
   "summon",
   "item",
   "magic",
   "initiative",
   "spd20",
   "spd40",
   "str20",
   "str40",
   "boost",
   "gfhp_10",
   "gfhp_20",
   "gfhp_30",
   "summag_10",
   "summag_20",
   "summag_30"
  ],
  "learned": [
   "magic",
   "draw",
   "item",
   "summon",
   "j_str",
   "j_spd"
  ],
  "summonOnly": false
 },
 "cerberus": {
  "id": "cerberus",
  "name": "Cerberus",
  "element": "Non-elemental",
  "description": "Cerberus \u2014 canonical FFVIII Guardian Force.",
  "abilities": [
   "ability_x3",
   "j_hit",
   "j_mag",
   "j_spd",
   "j_spr",
   "st_atk_j",
   "st_def_j",
   "st_def_jx2",
   "st_def_jx4",
   "j_str",
   "draw",
   "summon",
   "item",
   "magic",
   "auto_haste",
   "expendx2_1",
   "spd20",
   "spd40",
   "alert",
   "gfhp_10",
   "gfhp_20",
   "gfhp_30"
  ],
  "learned": [
   "magic",
   "draw",
   "item",
   "summon",
   "j_str",
   "j_mag",
   "j_spr"
  ],
  "summonOnly": false
 },
 "alexander": {
  "id": "alexander",
  "name": "Alexander",
  "element": "Holy",
  "description": "Alexander \u2014 canonical FFVIII Guardian Force.",
  "abilities": [
   "ability_x3",
   "elem_atk_j",
   "elem_def_jx2",
   "elem_def_jx4",
   "j_spr",
   "draw",
   "summon",
   "item",
   "magic",
   "revive",
   "med_data",
   "spr20",
   "spr40",
   "boost",
   "gfhp_10",
   "gfhp_20",
   "gfhp_30",
   "summag_10",
   "summag_20",
   "summag_30",
   "high_mag_rf",
   "med_lv_up"
  ],
  "learned": [
   "magic",
   "draw",
   "item",
   "summon",
   "j_spr",
   "elem_def_jx2"
  ],
  "summonOnly": false
 },
 "doomtrain": {
  "id": "doomtrain",
  "name": "Doomtrain",
  "element": "Poison",
  "description": "Doomtrain \u2014 canonical FFVIII Guardian Force.",
  "abilities": [
   "elem_atk_j",
   "elem_def_jx4",
   "st_atk_j",
   "st_def_jx4",
   "absorb",
   "darkside",
   "draw",
   "summon",
   "item",
   "magic",
   "auto_shell",
   "boost",
   "gfhp_10",
   "gfhp_20",
   "gfhp_30",
   "gfhp_40",
   "summag_10",
   "summag_20",
   "summag_30",
   "summag_40",
   "forbid_med_rf",
   "junk_shop"
  ],
  "learned": [
   "magic",
   "draw",
   "item",
   "summon",
   "elem_atk_j",
   "st_atk_j"
  ],
  "summonOnly": false
 },
 "bahamut": {
  "id": "bahamut",
  "name": "Bahamut",
  "element": "Non-elemental",
  "description": "Bahamut \u2014 canonical FFVIII Guardian Force.",
  "abilities": [
   "ability_x4",
   "draw",
   "summon",
   "item",
   "magic",
   "auto_protect",
   "expendx2_1",
   "mag60",
   "move_hp_up",
   "mug",
   "str60",
   "rare_item",
   "boost",
   "gfhp_10",
   "gfhp_20",
   "gfhp_30",
   "gfhp_40",
   "summag_10",
   "summag_20",
   "summag_30",
   "summag_40",
   "forbid_mag_rf"
  ],
  "learned": [
   "magic",
   "draw",
   "item",
   "summon",
   "ability_x4",
   "str60",
   "mag60"
  ],
  "summonOnly": false
 },
 "cactuar": {
  "id": "cactuar",
  "name": "Cactuar",
  "element": "Non-elemental",
  "description": "Cactuar \u2014 canonical FFVIII Guardian Force.",
  "abilities": [
   "j_eva",
   "j_luck",
   "defend",
   "draw",
   "summon",
   "item",
   "kamikaze",
   "magic",
   "auto_potion",
   "eva30",
   "expendx2_1",
   "hp_bonus",
   "initiative",
   "luck50",
   "mag_bonus",
   "move_hp_up",
   "spr_bonus",
   "str_bonus",
   "vit_bonus",
   "gfhp_10",
   "gfhp_20",
   "gfhp_30"
  ],
  "learned": [
   "magic",
   "draw",
   "item",
   "summon"
  ],
  "summonOnly": false
 },
 "tonberry": {
  "id": "tonberry",
  "name": "Tonberry",
  "element": "Non-elemental",
  "description": "Tonberry \u2014 canonical FFVIII Guardian Force.",
  "abilities": [
   "draw",
   "summon",
   "item",
   "lv_down",
   "lv_up",
   "magic",
   "auto_potion",
   "eva30",
   "initiative",
   "luck50",
   "move_hp_up",
   "boost",
   "gfhp_10",
   "gfhp_20",
   "gfhp_30",
   "summag_10",
   "summag_20",
   "summag_30",
   "call_shop",
   "familiar",
   "haggle",
   "sell_high"
  ],
  "learned": [
   "magic",
   "draw",
   "item",
   "summon",
   "lv_down",
   "lv_up"
  ],
  "summonOnly": false
 },
 "eden": {
  "id": "eden",
  "name": "Eden",
  "element": "Non-elemental",
  "description": "Eden \u2014 canonical FFVIII Guardian Force.",
  "abilities": [
   "j_eva",
   "j_hit",
   "j_spd",
   "darkside",
   "devour",
   "draw",
   "summon",
   "item",
   "mad_rush",
   "magic",
   "expendx3_1",
   "luck50",
   "boost",
   "gfhp_10",
   "gfhp_20",
   "gfhp_30",
   "gfhp_40",
   "summag_10",
   "summag_20",
   "summag_30",
   "summag_40",
   "gfabl_med_rf"
  ],
  "learned": [
   "magic",
   "draw",
   "item",
   "summon",
   "j_spd",
   "j_eva",
   "j_hit",
   "devour"
  ],
  "summonOnly": false
 },
 "odin": {
  "id": "odin",
  "name": "Odin",
  "element": "Non-elemental",
  "description": "Special invocation; does not provide character Junction abilities.",
  "abilities": [],
  "learned": [],
  "summonOnly": true
 },
 "gilgamesh": {
  "id": "gilgamesh",
  "name": "Gilgamesh",
  "element": "Non-elemental",
  "description": "Special invocation; does not provide character Junction abilities.",
  "abilities": [],
  "learned": [],
  "summonOnly": true
 },
 "phoenix": {
  "id": "phoenix",
  "name": "Phoenix",
  "element": "Fire",
  "description": "Special invocation; does not provide character Junction abilities.",
  "abilities": [],
  "learned": [],
  "summonOnly": true
 },
 "boko": {
  "id": "boko",
  "name": "Boko",
  "element": "Fire",
  "description": "Special invocation; does not provide character Junction abilities.",
  "abilities": [],
  "learned": [],
  "summonOnly": true
 },
 "minimog": {
  "id": "minimog",
  "name": "MiniMog",
  "element": "Non-elemental",
  "description": "Special invocation; does not provide character Junction abilities.",
  "abilities": [],
  "learned": [],
  "summonOnly": true
 },
 "moomba": {
  "id": "moomba",
  "name": "Moomba",
  "element": "Non-elemental",
  "description": "Special invocation; does not provide character Junction abilities.",
  "abilities": [],
  "learned": [],
  "summonOnly": true
 },
 "griever": {
  "id": "griever",
  "name": "Griever",
  "element": "Non-elemental",
  "description": "Enemy GF from the final battle.",
  "abilities": [],
  "learned": [],
  "summonOnly": true
 }
};
export const CANON_MAGIC = {
 "aero": {
  "name": "Aero",
  "element": "Wind",
  "bonus": [
   300,
   17,
   10,
   16,
   10,
   20,
   22,
   15,
   7
  ],
  "battleOnly": false
 },
 "apocalypse": {
  "name": "Apocalypse",
  "element": "Non-elemental",
  "bonus": [
   4200,
   80,
   80,
   80,
   90,
   30,
   30,
   30,
   12
  ],
  "battleOnly": true
 },
 "berserk": {
  "name": "Berserk",
  "element": "Status",
  "bonus": [
   300,
   13,
   8,
   14,
   8,
   5,
   4,
   3,
   2
  ],
  "battleOnly": false
 },
 "bio": {
  "name": "Bio",
  "element": "Poison",
  "bonus": [
   700,
   24,
   15,
   24,
   15,
   5,
   4,
   4,
   2
  ],
  "battleOnly": false
 },
 "blind": {
  "name": "Blind",
  "element": "Status",
  "bonus": [
   100,
   6,
   5,
   12,
   10,
   3,
   30,
   2,
   1
  ],
  "battleOnly": false
 },
 "blizzaga": {
  "name": "Blizzaga",
  "element": "Ice",
  "bonus": [
   1400,
   30,
   16,
   30,
   16,
   14,
   20,
   14,
   4
  ],
  "battleOnly": false
 },
 "blizzara": {
  "name": "Blizzara",
  "element": "Ice",
  "bonus": [
   200,
   15,
   8,
   15,
   8,
   12,
   16,
   12,
   3
  ],
  "battleOnly": false
 },
 "blizzard": {
  "name": "Blizzard",
  "element": "Ice",
  "bonus": [
   100,
   10,
   4,
   10,
   4,
   8,
   10,
   8,
   2
  ],
  "battleOnly": false
 },
 "break": {
  "name": "Break",
  "element": "Status",
  "bonus": [
   1000,
   20,
   20,
   34,
   35,
   10,
   10,
   12,
   4
  ],
  "battleOnly": false
 },
 "confuse": {
  "name": "Confuse",
  "element": "Status",
  "bonus": [
   700,
   22,
   18,
   28,
   18,
   18,
   8,
   8,
   3
  ],
  "battleOnly": false
 },
 "death": {
  "name": "Death",
  "element": "Status",
  "bonus": [
   1800,
   22,
   22,
   38,
   58,
   10,
   10,
   38,
   4
  ],
  "battleOnly": false
 },
 "demi": {
  "name": "Demi",
  "element": "Non-elemental",
  "bonus": [
   1600,
   34,
   18,
   36,
   18,
   12,
   14,
   10,
   3
  ],
  "battleOnly": false
 },
 "drain": {
  "name": "Drain",
  "element": "Non-elemental",
  "bonus": [
   400,
   13,
   30,
   20,
   24,
   6,
   5,
   4,
   2
  ],
  "battleOnly": false
 },
 "fira": {
  "name": "Fira",
  "element": "Fire",
  "bonus": [
   200,
   15,
   8,
   15,
   8,
   12,
   16,
   12,
   3
  ],
  "battleOnly": false
 },
 "firaga": {
  "name": "Firaga",
  "element": "Fire",
  "bonus": [
   1400,
   30,
   16,
   30,
   16,
   14,
   20,
   14,
   4
  ],
  "battleOnly": false
 },
 "fire": {
  "name": "Fire",
  "element": "Fire",
  "bonus": [
   100,
   10,
   4,
   10,
   4,
   8,
   10,
   8,
   2
  ],
  "battleOnly": false
 },
 "flare": {
  "name": "Flare",
  "element": "Non-elemental",
  "bonus": [
   3200,
   56,
   26,
   44,
   26,
   12,
   26,
   12,
   4
  ],
  "battleOnly": false
 },
 "holy": {
  "name": "Holy",
  "element": "Holy",
  "bonus": [
   3800,
   55,
   28,
   45,
   48,
   10,
   24,
   14,
   7
  ],
  "battleOnly": false
 },
 "meltdown": {
  "name": "Meltdown",
  "element": "Non-elemental",
  "bonus": [
   1500,
   24,
   80,
   20,
   20,
   3,
   12,
   8,
   2
  ],
  "battleOnly": false
 },
 "meteor": {
  "name": "Meteor",
  "element": "Non-elemental",
  "bonus": [
   4600,
   75,
   34,
   52,
   34,
   30,
   40,
   22,
   12
  ],
  "battleOnly": false
 },
 "pain": {
  "name": "Pain",
  "element": "Status",
  "bonus": [
   2800,
   42,
   38,
   60,
   45,
   4,
   4,
   40,
   2
  ],
  "battleOnly": false
 },
 "quake": {
  "name": "Quake",
  "element": "Earth",
  "bonus": [
   2600,
   40,
   20,
   40,
   20,
   7,
   30,
   12,
   3
  ],
  "battleOnly": false
 },
 "silence": {
  "name": "Silence",
  "element": "Status",
  "bonus": [
   100,
   6,
   5,
   12,
   10,
   3,
   3,
   2,
   1
  ],
  "battleOnly": false
 },
 "sleep": {
  "name": "Sleep",
  "element": "Status",
  "bonus": [
   100,
   6,
   5,
   12,
   10,
   4,
   3,
   2,
   4
  ],
  "battleOnly": false
 },
 "slow": {
  "name": "Slow",
  "element": "Status",
  "bonus": [
   500,
   12,
   16,
   20,
   20,
   40,
   10,
   10,
   8
  ],
  "battleOnly": false
 },
 "stop": {
  "name": "Stop",
  "element": "Status",
  "bonus": [
   800,
   18,
   20,
   30,
   24,
   48,
   20,
   10,
   10
  ],
  "battleOnly": false
 },
 "thundaga": {
  "name": "Thundaga",
  "element": "Thunder",
  "bonus": [
   1400,
   30,
   16,
   30,
   16,
   14,
   20,
   14,
   4
  ],
  "battleOnly": false
 },
 "thundara": {
  "name": "Thundara",
  "element": "Thunder",
  "bonus": [
   200,
   15,
   8,
   15,
   8,
   12,
   16,
   12,
   3
  ],
  "battleOnly": false
 },
 "thunder": {
  "name": "Thunder",
  "element": "Thunder",
  "bonus": [
   100,
   10,
   4,
   10,
   4,
   8,
   10,
   8,
   2
  ],
  "battleOnly": false
 },
 "tornado": {
  "name": "Tornado",
  "element": "Wind",
  "bonus": [
   3000,
   48,
   24,
   42,
   24,
   33,
   38,
   14,
   13
  ],
  "battleOnly": false
 },
 "ultima": {
  "name": "Ultima",
  "element": "Non-elemental",
  "bonus": [
   6000,
   100,
   82,
   100,
   95,
   60,
   60,
   60,
   24
  ],
  "battleOnly": false
 },
 "water": {
  "name": "Water",
  "element": "Water",
  "bonus": [
   300,
   20,
   14,
   18,
   14,
   12,
   18,
   13,
   4
  ],
  "battleOnly": false
 },
 "zombie": {
  "name": "Zombie",
  "element": "Status",
  "bonus": [
   800,
   15,
   24,
   15,
   12,
   2,
   2,
   2,
   1
  ],
  "battleOnly": false
 },
 "cura": {
  "name": "Cura",
  "element": "Recovery",
  "bonus": [
   500,
   8,
   28,
   8,
   28,
   4,
   3,
   3,
   2
  ],
  "battleOnly": false
 },
 "curaga": {
  "name": "Curaga",
  "element": "Recovery",
  "bonus": [
   2200,
   20,
   65,
   20,
   65,
   10,
   10,
   10,
   4
  ],
  "battleOnly": false
 },
 "cure": {
  "name": "Cure",
  "element": "Recovery",
  "bonus": [
   200,
   4,
   15,
   4,
   15,
   3,
   2,
   2,
   2
  ],
  "battleOnly": false
 },
 "esuna": {
  "name": "Esuna",
  "element": "Recovery",
  "bonus": [
   500,
   6,
   36,
   12,
   36,
   3,
   3,
   10,
   1
  ],
  "battleOnly": false
 },
 "full_life": {
  "name": "Full-Life",
  "element": "Recovery",
  "bonus": [
   4800,
   20,
   80,
   20,
   85,
   8,
   8,
   20,
   4
  ],
  "battleOnly": false
 },
 "life": {
  "name": "Life",
  "element": "Recovery",
  "bonus": [
   1200,
   8,
   50,
   10,
   50,
   4,
   3,
   4,
   1
  ],
  "battleOnly": false
 },
 "regen": {
  "name": "Regen",
  "element": "Recovery",
  "bonus": [
   2600,
   18,
   70,
   18,
   60,
   8,
   8,
   8,
   3
  ],
  "battleOnly": false
 },
 "aura": {
  "name": "Aura",
  "element": "Support",
  "bonus": [
   3400,
   70,
   22,
   24,
   24,
   10,
   50,
   40,
   2
  ],
  "battleOnly": false
 },
 "dispel": {
  "name": "Dispel",
  "element": "Support",
  "bonus": [
   1000,
   12,
   38,
   16,
   60,
   8,
   8,
   14,
   3
  ],
  "battleOnly": false
 },
 "double": {
  "name": "Double",
  "element": "Support",
  "bonus": [
   200,
   15,
   6,
   18,
   6,
   10,
   40,
   2,
   4
  ],
  "battleOnly": false
 },
 "float": {
  "name": "Float",
  "element": "Support",
  "bonus": [
   200,
   8,
   15,
   8,
   15,
   16,
   12,
   20,
   3
  ],
  "battleOnly": false
 },
 "haste": {
  "name": "Haste",
  "element": "Support",
  "bonus": [
   500,
   12,
   16,
   20,
   20,
   50,
   10,
   10,
   8
  ],
  "battleOnly": false
 },
 "protect": {
  "name": "Protect",
  "element": "Support",
  "bonus": [
   400,
   6,
   40,
   10,
   18,
   3,
   3,
   14,
   1
  ],
  "battleOnly": false
 },
 "reflect": {
  "name": "Reflect",
  "element": "Support",
  "bonus": [
   2000,
   14,
   46,
   20,
   72,
   10,
   8,
   16,
   4
  ],
  "battleOnly": false
 },
 "scan": {
  "name": "Scan",
  "element": "Support",
  "bonus": [
   100,
   5,
   5,
   5,
   5,
   3,
   3,
   3,
   3
  ],
  "battleOnly": false
 },
 "shell": {
  "name": "Shell",
  "element": "Support",
  "bonus": [
   400,
   6,
   18,
   10,
   40,
   3,
   3,
   14,
   1
  ],
  "battleOnly": false
 },
 "triple": {
  "name": "Triple",
  "element": "Support",
  "bonus": [
   2400,
   70,
   10,
   70,
   10,
   70,
   150,
   30,
   16
  ],
  "battleOnly": false
 }
};
