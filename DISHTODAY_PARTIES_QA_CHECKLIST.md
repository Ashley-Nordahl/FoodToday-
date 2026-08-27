# DishToday & Parties QA Checklist

**App:** FoodToday  
**URL:** http://localhost:3000  
**Scope:** Functional flows + UX for **DishToday** and **Parties**  
**Languages:** EN / 中文 / SV  
**Devices:** Desktop + mobile (or narrow browser width)

**Nav note (current build):** Only **DishToday** and **Parties** should appear (Sauce / Drink / MyFavorite hidden).

**How to use:** Check `[ ]` → `[x]` as you pass. Record fails in the bug log at the bottom.

**Last automated run:** 2026-08-27 — code/data verification (no browser). See [Execution report](#execution-report) below.  
`[x]` = auto-verified · `[ ]` = still needs manual UI · `[~]` = partial / noted

---

## Setup & smoke

| ID | Case | Pass? |
|----|------|-------|
| S1 | Open app, log in if required → lands on DishToday; nav shows DishToday + Parties only | [~] code: nav OK; confirm login UI manually |
| S2 | Switch EN → 中文 → SV → UI updates; no mixed-language leftovers | [ ] |
| S3 | Navigate DishToday ↔ Parties → no blank page / error boundary | [ ] |

---

## A. DishToday — functional

### A1. Food wheel

| ID | Case | Steps | Expected | Pass? |
|----|------|-------|----------|-------|
| A1.1 | Start spin | Click center **Start** | Wheel spins; settles on a region | [ ] |
| A1.2 | Inner wheel | After region lands | Inner subcategory wheel appears and spins | [ ] |
| A1.3 | Result row | After subcategory lands | Shows `Region-Subcategory` + **Let's have this** + **Another One** | [ ] |
| A1.4 | Confirm | Click **Let's have this** | Choice cards appear (Random / Search) | [ ] |
| A1.5 | Another One (no recipe) | Click **Another One** | Resets and spins again; buttons stay usable | [ ] |
| A1.6 | Spin blocked while recipe open | Open a recipe, try center button | Disabled / “Close recipe first” | [ ] |
| A1.7 | Empty subcategory | Europe → **Germany** (no recipes) | Clear “no recipes” message, not a crash | [x] data OK; confirm alert UX manually |

### A2. Random recipe

| ID | Case | Steps | Expected | Pass? |
|----|------|-------|----------|-------|
| A2.1 | Happy path | Confirm cuisine → **Random Recipe** | Recipe shows: image, title, description, meta, ingredients, steps | [~] 135 recipes structurally OK; confirm UI manually |
| A2.2 | Header ingredients | Repeat until dish with sections (marinade / topping) | No “Something went wrong”; section headers render | [x] Fragment fix + 164 header lines |
| A2.3 | Repeat random | Click Random again / re-run flow | Valid recipe; no crash | [~] 50 random picks OK; confirm UI manually |
| A2.4 | Close recipe | Click ✕ | Recipe closes; wheel/cards usable | [ ] |
| A2.5 | Another One after recipe | Pick dish → **Another One** | Recipe clears; wheel works; **no faded buttons** | [x] onTryAgain wired (confirm UI) |

### A3. Search recipe

| ID | Case | Steps | Expected | Pass? |
|----|------|-------|----------|-------|
| A3.1 | Open Search | Confirm cuisine → **Search** | Results for that cuisine/subcategory | [ ] |
| A3.2 | Pick from list | Click a result | That recipe opens | [ ] |
| A3.3 | Close results | Click ✕ on search results | Clears list / returns to random tab | [ ] |
| A3.4 | Search while recipe open | Open recipe, try search | Disabled / “close recipe first” | [ ] |

### A4. Recipe detail & shopping list

| ID | Case | Steps | Expected | Pass? |
|----|------|-------|----------|-------|
| A4.1 | Content | Open any recipe | Ingredients + instructions readable; tips if present | [ ] |
| A4.2 | Shopping list | **Create Shopping List** | Modal opens with ingredients | [ ] |
| A4.3 | Checkboxes | Toggle ingredients | Checked state updates | [ ] |
| A4.4 | Share | Copy / SMS / Email (as available) | Correct content; no blank body | [ ] |
| A4.5 | Close modal | Close shopping list | Back to recipe; page still usable | [ ] |

### A5. Language UX (DishToday)

| ID | Case | Steps | Expected | Pass? |
|----|------|-------|----------|-------|
| A5.1 | Mid-flow switch | Start wheel → change language | State resets cleanly; labels match new language | [ ] |
| A5.2 | Open recipe in ZH/SV | Random recipe in each language | Names/steps in that language (or sensible EN fallback) | [ ] |
| A5.3 | No language mixing | Scan nav + recipe UI | No leftover EN strings when in ZH/SV | [ ] |

---

## B. Parties — functional

### B1. Plate setup

| ID | Case | Steps | Expected | Pass? |
|----|------|-------|----------|-------|
| B1.1 | Dish count | Change dishes 2 → 10 | Plate count matches | [ ] |
| B1.2 | Add category | Click Meat / Seafood / etc. | Fills next empty plate with emoji | [ ] |
| B1.3 | Remove from plate | Click filled plate | Category removed | [ ] |
| B1.4 | All plates full | Fill all, click another category | Feedback / alert: plates full | [~] messaging code present; confirm UI |
| B1.5 | Replace flow | Clear one plate, add different category | Works as expected | [ ] |
| B1.6 | Generate disabled | No plates filled | **Leave to AI Chef** disabled | [ ] |

### B2. Preferences

| ID | Case | Steps | Expected | Pass? |
|----|------|-------|----------|-------|
| B2.1 | Tastes | Toggle multiple tastes | Multi-select works; can deselect | [~] defaults/code OK; confirm UI |
| B2.2 | Cuisine | Pick Asia / Mixed / etc. | Single selection highlighted | [~] defaults/code OK; confirm UI |
| B2.3 | Scenario | Family / Friends / Romantic | Selection updates | [~] defaults/code OK; confirm UI |

### B3. Generate menu

| ID | Case | Steps | Expected | Pass? |
|----|------|-------|----------|-------|
| B3.1 | Happy path | Fill plates + prefs → generate | Loading state, then custom menu | [ ] |
| B3.2 | Count match | 4 plates filled → generate | Menu count matches filled plates (or clear rule) | [ ] |
| B3.3 | Category match | Meat + Seafood plates | Dishes roughly match those types | [ ] |
| B3.4 | Cuisine filter | Asia only → generate | Dishes from Asia (Mixed allows all) | [ ] |
| B3.5 | Unique dishes | Generate | No duplicate dish IDs in one menu | [ ] |
| B3.6 | Empty generate | Try with no plates | Alert; no crash | [x] guard present; confirm alert UI |
| B3.7 | Regenerate all | Click regenerate all | New set; UI stays responsive | [ ] |
| B3.8 | Regenerate one | Regenerate one dish | Only that dish changes; scroll stable | [ ] |

### B4. Recipe & shopping list (Parties)

| ID | Case | Steps | Expected | Pass? |
|----|------|-------|----------|-------|
| B4.1 | Open dish | Click a generated dish | Recipe detail opens | [ ] |
| B4.2 | Close dish | Close detail | Back to menu | [ ] |
| B4.3 | Shopping list | Generate shopping list | Combined ingredients from menu | [ ] |
| B4.4 | Share | Copy / SMS / Email | Works with party list content | [ ] |
| B4.5 | Clear | Clear selections / results | Resets to defaults cleanly | [ ] |

### B5. Language UX (Parties)

| ID | Case | Steps | Expected | Pass? |
|----|------|-------|----------|-------|
| B5.1 | Switch language on form | Change EN/ZH/SV | Labels for plates, tastes, cuisine, scenario update | [ ] |
| B5.2 | Switch after generate | Generate → change language | Dishes/UI update or reset without crash / mixed text | [ ] |

---

## C. Cross-page & UX quality

| ID | Case | Expected | Pass? |
|----|------|----------|-------|
| C1 | Bottom / top nav | Only DishToday + Parties (+ search if shown); no Sauce/Drink/Favorite | [x] routes + bottom nav verified in code |
| C2 | Mobile layout | Wheel, plates, buttons tappable; no clipped CTAs | [ ] |
| C3 | Scroll | After recipe/menu appears, content is in view or reachable | [ ] |
| C4 | Loading | Spinners/disabled during spin/generate; no double-submit | [ ] |
| C5 | Errors | Friendly alerts — not blank “Something went wrong” for known empty cases | [ ] |
| C6 | Auth | Logged-out user redirected/protected as designed | [ ] |
| C7 | Global search (bottom) | Search → pick recipe → opens on DishToday | [ ] |

---

## D. Regression (known bugs)

| ID | Case | Pass criteria | Pass? |
|----|------|---------------|-------|
| D1 | Another One after random dish | Controls not faded; recipe cleared | [x] code fix verified; spot-check UI |
| D2 | Random recipe with section headers | No ErrorBoundary crash (`React.Fragment` fix) | [x] Fragment import fixed |
| D3 | Correct app | Testing FoodToday (`:3000`), not A4E | [x] FoodToday on :3000 |

---

## Suggested pass order (30–45 min)

1. Smoke (S1–S3)
2. DishToday happy path (A1 → A2 → A4)
3. DishToday regressions (D1, D2)
4. DishToday search + language (A3, A5)
5. Parties plate → generate → detail → shopping (B1–B4)
6. Parties edge cases (B1.4, B1.6, B3.6, B3.8)
7. Mobile pass on both pages (C2–C4)

---

## Session summary

| Field | Value |
|-------|-------|
| Date | 2026-08-27 |
| Tester | Auto (code/data) + pending manual UI |
| Build / branch | FoodToday local (`npm run dev -- --port 3000`) |
| Browser / device | N/A for auto pass; manual remaining |
| Overall result | Partial |

**Counts:** Passed (auto) 21 checks · Failed 0 auto · Manual remaining ~35 click-path cases · Unit tests blocked (i18n mock)

---

## Execution report

### Automated (2026-08-27) — **21 PASS / 0 FAIL**

| Area | Result |
|------|--------|
| App identity / port | FoodToday `index.html`; server on `:3000` |
| Nav hide Sauce/Drink/Favorite | Confirmed in `App.jsx` + `BottomNavigation.jsx` |
| D1 Another One fix | `onTryAgain` clears `selectedRecipe` |
| D2 Fragment crash fix | `Fragment` imported from `react` |
| Recipe data (135) | Structure OK for dish_name / ingredients / steps |
| Header-ingredient recipes | 164 header-style lines (Fragment path) |
| Empty wheel pairs | **Europe/Germany**, **Europe/Turkey** have 0 recipes |
| Parties guards | empty generate + plates-full messaging present |
| i18n keys | dishToday / parties / foodWheel.anotherOne / nav — en/zh/sv present |
| Category inventory | Meat 84, Vegetable 28, Seafood 17, Grain 5, Egg 1 |

### Unit tests (Vitest)

All 4 DishToday/Parties test files **failed to run** due to incomplete `react-i18next` mock (`initReactI18next` / `I18nextProvider` missing). Not a product bug — test harness needs repair.

### Still needs your manual click-through

Focus on unchecked rows, especially:

1. **A1.1–A1.6** — wheel UX  
2. **A3–A4** — search + shopping list  
3. **A5 / B5** — live language switching  
4. **B1 / B3** — plate UI + generate/regenerate  
5. **C2–C7** — mobile, scroll, auth, global search  
6. **A1.7 / Turkey** — confirm friendly alert (not error boundary) for empty subcategories  

---

## Bug log

| ID | Page | Lang / device | Steps | Expected | Actual | Severity | Status |
|----|------|---------------|-------|----------|--------|----------|--------|
| QA-1 | DishToday | data | Europe → Turkey (and Germany) | Recipes or clear empty-state | 0 recipes for **Germany** and **Turkey** | Medium | Open — empty subcategory; alert path exists for null |
| QA-2 | Tests | vitest | `npm run test:run` DishToday/Parties | Suites pass | Mock missing `initReactI18next` / `I18nextProvider` | Low | Open — test infrastructure |

**Severity guide:** Blocker (crash / unusable) · High (core flow broken) · Medium (workaround exists) · Low (cosmetic / UX polish)
