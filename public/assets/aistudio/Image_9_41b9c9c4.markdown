---
name: Saffron & Sprout
colors:
  surface: '#fff8f5'
  surface-dim: '#e0d8d5'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf2ee'
  surface-container: '#f4ece8'
  surface-container-high: '#eee7e3'
  surface-container-highest: '#e9e1dd'
  on-surface: '#1e1b19'
  on-surface-variant: '#5a4139'
  inverse-surface: '#33302d'
  inverse-on-surface: '#f7efeb'
  outline: '#8e7067'
  outline-variant: '#e2bfb4'
  surface-tint: '#ac3400'
  primary: '#a83300'
  on-primary: '#ffffff'
  primary-container: '#d04408'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb59d'
  secondary: '#006d40'
  on-secondary: '#ffffff'
  secondary-container: '#91f4b7'
  on-secondary-container: '#007243'
  tertiary: '#795600'
  on-tertiary: '#ffffff'
  tertiary-container: '#986d00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59d'
  on-primary-fixed: '#390b00'
  on-primary-fixed-variant: '#832600'
  secondary-fixed: '#94f7ba'
  secondary-fixed-dim: '#78da9f'
  on-secondary-fixed: '#002110'
  on-secondary-fixed-variant: '#00522f'
  tertiary-fixed: '#ffdea8'
  tertiary-fixed-dim: '#ffba20'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5e4200'
  background: '#fff8f5'
  on-background: '#1e1b19'
  surface-variant: '#e9e1dd'
typography:
  headline-xl:
    fontFamily: Epilogue
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
  headline-xl-mobile:
    fontFamily: Epilogue
    fontSize: 30px
    fontWeight: '800'
    lineHeight: 36px
  headline-lg:
    fontFamily: Epilogue
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Epilogue
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Epilogue
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  headline-sm:
    fontFamily: Epilogue
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '800'
    lineHeight: 12px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system targets students living in university dorms, shared flats, and Paying Guest (PG) accommodations who demand dependable, nutritious daily mess schedules alongside high-velocity late-night cravings. The emotional tone balances warmth, punctuality, and appetizing energy: reliable enough to trust for recurring monthly meal stipends, yet vibrant enough to excite spontaneous comfort-food orders.

The aesthetic fuses modern utilitarian corporate rigor with tactile food-lifestyle warmth. Clean, elevated surface tiers and generous micro-spacing keep complex nutritional specs and recurring delivery schedules instantly scannable on compact phone viewports. High-contrast typography and vivid culinary accent hues evoke freshly tossed spices, garden greens, and piping-hot tiffin containers without falling into chaotic clutter.

## Colors

The palette establishes an appetizing, high-conversion visual hierarchy grounded in authentic culinary tones:

- **Primary (`#F05A22`)**: A saturated roasted saffron-orange. Represents warmth, appetite stimulation, active dispatch states, and primary transactional triggers (e.g., "Subscribe Now", "Add Cravings").
- **Secondary (`#1B8754`)**: A crisp botanical garden green. Governs pure-vegetarian flags, healthy meal highlights, calorie-balanced tiffin badges, active subscription runs, and confirmed deliveries.
- **Tertiary (`#FFB800`)**: A warm turmeric yellow. Reserved for mealtime alerts, prep countdowns, rating stars, and flash student discounts.
- **Neutral (`#1C1917`)**: Deep charcoal warm-stone. Avoids cold clinical blacks to maintain a culinary, hearth-like feel across all text weights and primary structure lines.

Background canvas tokens use warm porcelain (`#FDFBF7`) and crisp milk-white container tiers (`#FFFFFF`) to maintain optical separation, while subtle warm stone borders (`#E7E5E4`) keep dense dietary grids legible in sunlight.

## Typography

Typography pairs the structural, editorial weight of **Epilogue** for display headings with the approachable geometry and high legibility of **Plus Jakarta Sans** for interfaces, menus, nutritional metrics, and room instructions.

- Headings demand immediate attention, leveraging `Epilogue`'s distinct cut to communicate daily rotating specials, tiffin cutoff clocks, and subscription tiers.
- Data-heavy labels (such as calories, macro grams, floor/block drop-off fields, and ETA timers) use `Plus Jakarta Sans` at 600 to 800 weight with tight letter-spacing to preserve compact tabular alignment on mobile viewports.

## Layout & Spacing

The layout is built on an adaptive fluid grid optimized for high-speed single-handed mobile navigation:

- **Mobile (<768px)**: 4 columns, `margin: 1rem`, `gutter: 1rem`. Meal cards, subscription carousels, and time toggles span 4 full columns to maximize swipe area.
- **Tablet (768pxâ€“1023px)**: 8 columns, `margin: 1.5rem`, `gutter: 1rem`. Accommodates side-by-side calendar views and menu listings.
- **Desktop (â‰¥1024px)**: 12 columns, max-width `1280px` centered, `margin: 2.5rem`, `gutter: 1.5rem`. Enables a 3-column architecture (Category navigation + Meal catalog + Persistent subscription cart/hostel address drawer).

Vertical rhythm adheres strictly to an 8pt base unit (`space-xs` = 4px, `space-sm` = 8px, `space-md` = 16px, `space-lg` = 24px, `space-xl` = 32px), guaranteeing predictable alignment across complex interactive tiffin configuration widgets.

## Elevation & Depth

Visual hierarchy employs warm tonal surfaces layered with ambient, tinted drop shadows to create a tactile card-stacking environment reminiscent of meal trays:

- **Level 0 (Base Canvas)**: `#FDFBF7`. Flat textured base.
- **Level 1 (Default Cards & Tiles)**: Pure white `#FFFFFF` paired with an ultra-soft ambient shadow: `0 2px 8px -2px rgba(28, 25, 23, 0.05)` and a crisp containment border of `1px solid rgba(28, 25, 23, 0.06)`.
- **Level 2 (Active Meal Plans & Hover States)**: `0 8px 24px -4px rgba(240, 90, 34, 0.12)`, elevating the active tiffin plan or food item above standard elements.
- **Level 3 (Sticky Delivery Floaters & Cart Sliders)**: `0 12px 32px -4px rgba(28, 25, 23, 0.16)`. Applied to sticky bottom mobile summaries (e.g., "3 Meals Added Â· Deliver to Room 304B").
- **Level 4 (Modals & Room Drop-Off Sheets)**: Centered or sheet-bottom overlay surfaces with backdrop blur (`backdrop-filter: blur(8px)`) over an ambient overlay mask (`rgba(28, 25, 23, 0.4)`).

## Shapes

Shape geometry adopts `roundedness: 2` (base border radius of `0.5rem` / 8px, `rounded-lg` of `1rem` / 16px, and `rounded-xl` of `1.5rem` / 24px).

- Standard buttons, nutritional pill tags, and search bars use soft ergonomic curves (`rounded-lg`) for effortless thumb tapping.
- Primary subscription containers, mess schedule modules, and food preview cards leverage `rounded-xl` to impart an appetizing, modern culinary look.
- Strict circular badges (`border-radius: 9999px`) are strictly dedicated to countdown timers, vegetarian/non-vegetarian icons, quantity stepper buttons, and student avatar badges.

## Components

### Buttons
- **Primary CTA**: `#F05A22` solid background, white text (`label-lg`), height `48px`, `rounded-lg`. Micro-active state downscales to `0.98` scale. Used for subscription commitments and checkout.
- **Secondary CTA**: Milk white surface, `#F05A22` border (1.5px), `#F05A22` text. For plan customizers, dish swaps, or skipping meals.
- **Tiffin Quick Add**: Circular / Pill stepper (`- [Qty] +`) with white background, `#E7E5E4` border, and charcoal text.

### Chips & Dietary Badges
- **Veg / Non-Veg Indicator**: 14px square outline with center dot. Green (`#1B8754`) for pure veg, crimson (`#DC2626`) for non-veg.
- **Macro Badges (Cal / Protein / Carbs)**: Subdued neutral background (`#F5F5F4`), charcoal text (`label-sm`), displaying values such as `ðŸ”¥ 520 kcal` and `ð”ªˆÈ›ÝZ[˜‚‹H
Š“YX[ÙYÛY[Ú\ÊŠŽˆ[\˜XÝ]™HÙYÛY[Yš[\ˆ
œ™XZÙ˜\Ý[˜ÚÛ˜XÚÜË[›™\‹]HšYÚ
HÚ]ÍœZYÚ[Ú\KÝÚ]Ú[™Èœ›ÛH™]]˜[Ú]HÈÛÛYš[X\žHÜ˜[™ÙHÛˆÙ[XÝ[Û‹‚‚ˆÈÈÈÝXœØÜš\[Ûˆ	ˆYX[Ø\™Â‹H
Š•Y™š[ˆ[ˆØ\™
ŠŽˆ™X]\™\ÈYX[\HX™[Ý]Ù™ˆÛÝ[\ˆ
“Ü™\ˆ™Y›Ü™HÎŒH›Üˆ[›™\ˆŠK\Úœ™XZÙÝÛˆ\Ý[™HÙÙÛH›Üˆ]]Ë\™[™]Ø[œËˆÛ™K][YHšX[ˆ[˜ÛY\ÈšXÙH\ˆYX[œ™XZÙÝÛˆ
K™Ë‹¸ ®MÎHÈYX[ŠK‚‹H
ŠÜ˜]š[™ÜÈÛ‹Q[X[™Ø\™
ŠŽˆÜš^›Û[^[Ý]Ûˆ[Øš[H™X]\š[™ÈHMžM›[HÜ]X\™HYX[[X›˜Z[
›Ý[™Y[Ø
K›Û]KUHÛØÚÈXÛÛˆ
X™[[Y
K[™[YÜ˜]YšXÙHÚ]\™XÝŠÈQˆÝ™\›^H]Û‹‚‚ˆÈÈÈÜÝ[›ÛÛH›ÜSÙ™ˆÙ[XÝÜ‚‹HYXØ]Y›Ü›H[Ù[HYÚYÚYÚ]ÝXHœ˜[™[ˆ™X]\™\È™K\Ø]™Y›ÜÝÛœÈ›Üˆ
Š’ÜÝ[ÔÈ˜[YJŠ‹
Š›ØÚËÕÝÙ\ŠŠ‹
Š‘›ÛÜŠŠ‹[™
Š”›ÛÛH[X™\ŠŠ‹XØÛÛ\[šYYžH›Ü[œÝXÝ[ÛœÈ
“X]™H]ÝX\™\ÚÈˆœËˆ’[™Ý™\ˆ]›ÛÛHÛÜˆŠK‚‚ˆÈÈÈ[œ]È	ˆÚXÚØ›Þ\Â‹H
Š’[œ]šY[ÊŠŽˆZYÚ˜XÚÙÜ›Ý[™Ñ‘‘‘‘‘˜›Ü™\ˆK\ÛÛYÑMÑMQMX™[›Ø][™ÈX›Ý™H[ˆX™[\ÛXˆ›ØÝ\ÙY[œ]ÈÝÚ]ÚÈš[X\žHÑŒPLŒ˜š[™ÈÚ]ÛÙÛÝË‚‹H
ŠÚXÚØ›Þ\È	ˆ˜Y[ÜÊŠŽˆÝ\ÝÛHÚ\˜Ý[\ˆ˜Y[È]ÛœÈÚ][›™\ˆØY™œ›Ûˆ\›ÜˆÙ[XÝ[™ÈYX[[ˆœ™\]Y[˜ÚY\È
K™Ë‹[Û¸ $ÔØ]œËˆ]™\žY^JK