# Physics ledger: What if you could breathe underwater? (short, 9:16)

Premise (fiction, said once in the script): a person can move water through their lungs and extract oxygen from it.
Status: DRAFT for user review. Inputs come from web search snippets (secondary sources); originals not opened. Recheck before voicing.

| ID | Quantity | Value | Source | Notes |
|---|---|---|---|---|
| P01 | O2 fraction of dry air | 20.946 % -> about 209 mL O2 per litre | FAO (fao.org/3/ac183e/ac183e04.htm) | 0.20946 x 1000 mL |
| P02 | O2 in air-saturated water, 25 C, sea level | 8.3 mg/L | wateronline.com white paper (dissolved-oxygen sensors) | |
| P03 | O2 gas density (assumed, standard value) | 1.429 g/L at 0 C, 1 atm | textbook constant, not from search | used only to convert P02 |
| P04 | O2 in water, converted | 8.3 mg / 1.429 mg per mL = about 5.8 mL per litre | calc from P02, P03 | rounds to "about six" |
| P05 | Air vs water | 209 / 5.8 = about 36 times more O2 per litre in air | calc | colder water holds more: ratio is smaller (about 26 at 10 C, not sourced here) |
| P06 | Resting O2 consumption | about 250 mL/min (3.5 mL/kg/min x 70 kg = 245) | brainscape respiratory physiology cards; iatrox | adult, rest |
| P07 | Resting minute ventilation (air) | about 5-8 L/min; use 6 | Wikipedia "Minute ventilation" | |
| P08 | Water needed if 100 % of O2 extracted | 250 / 5.8 = 43 L/min | calc P06, P04 | physical floor |
| P09 | Water needed if 25 % extracted | 250 / 5.8 / 0.25 = 172 L/min | calc | ASSUMPTION: lungs take about a quarter of inspired O2 (exhaled air is about 16 % O2). Not sourced here: verify before voicing |
| P10 | Maximal voluntary ventilation | about 140 L/min young men (range 100-180); about 100 L/min women (70-120) | Monash physiology module (ilearn.med.monash.edu.au/physiology/experiments/lung-function/exercise-ventilation) | a short effort test, not sustainable |
| P11 | Density water / air | about 800-830 times | brainscape gas laws cards; MSU Denver course page | |
| P12 | Mass moved | 172 L of water = about 172 kg per minute | calc (1 kg/L) | |
| P13 | Viscosity water / air | about 55 times (1.0e-3 vs 1.8e-5 Pa s) | air value from PMC table; water value is a standard constant (not from search) | NOT used in script |
| P14 | Kylstra (Duke, 1962) | mice breathing oxygenated saline at 160 atm; died minutes later from CO2 build-up | Gizmodo "can humans breathe liquid" (secondary) | an older mirror says animals lived up to 18 h: sources differ |
| P15 | Clark and Gollan (mid-1960s) | mice breathed fluorocarbon liquid at normal pressure; rats up to 20 h | Gizmodo (secondary) | dates and hours vary across sources |

## Unknowns (the script says so)
- U01 Whether a healthy adult could breathe liquid for hours: not established in the sources read.
- U02 The true extraction fraction a human lung could reach in water (P09 is an assumption).
- U03 Original papers for Kylstra and Clark/Gollan not read; numbers come from a popular article.

## Not covered (checks before a long version)
Pressure, nitrogen and decompression at depth; surfactant and lung damage from water; cold; salt vs fresh water.
