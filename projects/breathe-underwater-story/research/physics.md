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
| P09 | Water needed if 25 % extracted | 250 / 5.8 / 0.25 = 172 L/min | calc | Lungs take a seventh to a quarter of inspired O2: arXiv 2005.12362 (arxiv.org/pdf/2005.12362) gives exhaled O2 16-18 % vs 21 % inhaled (drop of 3-5 points); our arithmetic. 25 % is the generous end |
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

## Added for the long version (all from web-search snippets; originals not opened)
| ID | Quantity | Value | Source | Notes |
|---|---|---|---|---|
| L01 | Extraction at the stingy end | 250 / 5.8 / 0.143 = about 301-308 L/min (3 of 21 points) | calc from P04 + arXiv drop | |
| L02 | Fish gill extraction | 70 % (Natural History Museum), about 80 % (school resource), up to 85 % (textbook), 90 % or more (animal-physiology text) | cognito.org, Macmillan Life 11e, asknature, NHM answer; vaia/Hill text | sources differ; script uses 80 % |
| L03 | Water needed at 80 % extraction | 250 / 5.8 / 0.8 = 54 L/min | calc | |
| L04 | Tidal breathing numbers | tidal 500 mL, dead space 150 mL, vital capacity 4.6-4.8 L, total lung capacity about 6 L | Macmillan Life 11e ch48; lecture PDFs; CliffsNotes | |
| L05 | Breaths for 172 L of fresh water, tidal | 172 / 0.35 = 491 per min | calc | |
| L06 | Breaths at full vital capacity | 172 / 4.45 = 39 per min; each about 4.5 kg | calc | vital capacity 4.6 minus 0.15 dead space |
| L07 | Drowning mechanics | laryngospasm in about 10-20 % (another source: under 10-15 %); aspirated 2-4 mL/kg; surfactant disruption; fresh vs salt difference minor | Relias update on drowning; EBSCO; RCEM learning | |
| L08 | Gill flow | continuous one-way flow lowers the energy cost of ventilating | animal-physiology course summary (OUP Hill 4e ch23) | |
| L09 | Kylstra | oxygenated saline, 160 atm, mice died minutes later from CO2 (Gizmodo); other account: rodents and dogs up to about an hour, CO2 the limit (Wikipedia Liquid breathing) | Gizmodo; Wikipedia | accounts differ on time |
| L10 | Clark and Gollan | PFC at normal pressure; rats up to 20 h; cats weeks; colder liquid lowered respiration (older Wikipedia mirror) | Gizmodo; wikipedia2007 mirror | |
| L11 | PFC denser and more viscous than air; raises work of breathing | | Wikipedia Liquid breathing | |
| L12 | CO2 solubility | far more soluble in water than O2 ("one volume dissolves in an equal volume of water") | FAO ac183e06 | no ratio verified |
| L13 | Greenspan 1989 | 3 premature neonates (28, 24, 23 weeks), improved compliance; J Pediatr 1990;117:106-111 | review via search (pmc / pafmj) | partial liquid ventilation |
| L14 | LiquiVent 1996 | 13 infants; PaO2 +138 %, compliance +61 % within an hour; no adverse events clearly attributable; later trials failed to reduce morbidity in acute respiratory failure | NEJM 1996 via search snippets | |
| L15 | Cold water | heat loss "25 times" faster than air (other sources 4, 20, 32); cold shock gasp; limbs numb within minutes; hypothermia about an hour on average | foxweather, aceboater, NY State Parks, Pantaenius | rough guidance |
| L16 | Pressure | about 1 atm per 10 m seawater; N2 uptake; bends on fast ascent; ascent about 10 m/min | taucherpedia, Australian Geographic, DCS whitepaper | |
| L17 | O2 limits | nitrox generally limited to 1.4 ATA (EPA Region 10 dive plan); 1.6 ATA quoted from NOAA manual (forum quote) | archive.epa.gov; scubaboard quote | depth where air hits 1.4-1.6 ATA O2: 57-66 m, our arithmetic |
| L18 | Narcosis | inert-gas narcosis second only to CNS oxygen toxicity in hazard for air divers | TDI/SDI article | |

## Unknowns added
- U04 Whether a human lung can do liquid breathing for hours at adult scale.
- U05 Whether a water breather would absorb nitrogen at depth / get the bends.
- U06 Whether controlled cooling could safely cut human demand while breathing liquid.
- U07 Whether the saline-lung CO2 problem is a flow problem (our reading, not tested in sources).
