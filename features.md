# features

## museum wall backgrounds

### wall coverings
| type | options |
|------|--------|
| painted | 30 museum colors — burgundy, oxblood, forest green, navy, charcoal, cream, ivory, slate, terracotta, sage, warm gray, plum, chocolate, bottle green, dusty rose, gold, museum red, british racing green, oxford blue, deep teal, mauve, and more |
| wallpaper | damask, william morris, stripes, flock, toile, brocade, embossed leather |
| wood | oak, walnut, mahogany — with plank grain pattern |
| fabric | silk (sheen effect), velvet, linen (crosshatch weave) |

### wallpaper patterns
- **damask** — repeating floral medallions with scrollwork, low-contrast tone-on-tone
- **william morris** — dense botanical stems with paired leaves and flower dots
- **stripes** — alternating matte/gloss vertical bands
- **flock** — velvet-textured raised patterns, larger medallions
- **toile** — illustrated pastoral scenes (figures, houses, trees)
- **brocade** — like damask but with gold accent threading
- **embossed leather** — tiled squares with beveled edges

### dividers
- **chair rail** — simple horizontal trim with highlight
- **molding** — multi-strip detailed molding (4 shading strips)
- **picture rail** — narrow rail with lip for hanging hardware

### lower wall / wainscoting
- **beadboard** — narrow vertical grooves
- **raised panel** — thick frames with recessed raised centers, beveled highlights and shadows
- **flat panel** — same layout as raised panel, perfectly flat with outline
- **board and batten** — vertical boards with wider batten strips
- **stone** — staggered masonry block pattern
- **marble** — subtle veining on light base
- **wood planks** — horizontal planks with grain lines

### baseboard
- solid band with top highlight strip

### dimensions
- default: 1778 x 1000 (16:9)
- configurable from 100 to 4000 in either dimension

---

## ornate picture frames

### museum frame grammar

the frame generator is based on a 5-part anatomy system. historical styles are *presets* — specific combinations of anatomical choices.

#### 1. profile stack
the cross-section shape of the frame rail. profiles stack from outside to inside.

| profile | width | character |
|---------|-------|-----------|
| flat | 14px | modern, shaker, arts & crafts |
| ogee | 16px | elegant s-curve, the most common classical profile |
| cushion | 18px | slightly rounded outward, traditional museum frames |
| scoop | 14px | curves inward, often paired with gilding |
| reverse scoop | 14px | bulges outward, common on baroque |
| bead | 6px | small rounded molding |
| bolection | 22px | projects outward dramatically, gives depth |
| fillet | 4px | thin flat separator between other profiles |
| astragal | 10px | semi-circular molding |
| cavetto | 12px | concave quarter-circle |
| scotia | 14px | deep concave with asymmetric curve |
| cove | 14px | like scoop but more gradual |

each profile band gets 3 sub-strips simulating shading (outer, mid, inner) based on a per-profile shading table.

#### 2. ornament zones (a, b, c, d)
four zones mapped proportionally across the profile bands:

- bead, bead & reel, egg-and-dart, acanthus, scrolls, shell, rope, laurel, greek key, guilloche, floral, vine

ornaments are drawn along all four rails (top, bottom, left, right) with coverage controlled by `carvingCoverage`.

#### 3. corner treatments
- plain miter (no ornament)
- floral burst (6-petal radial flower)
- shell (fan with radiating rays)
- cartouche (oval with flanking scrolls)
- acanthus cluster (5 overlapping leaves)
- scroll volute (spiral curl)

corner amplification scales the ornament relative to the rail width.

#### 4. finishes
| finish | color |
|--------|-------|
| gold leaf | bright gold |
| antique gold | warm aged gold |
| champagne gold | pale warm gold |
| silver leaf | cool metallic |
| bronze | warm brown-gold |
| black lacquer | near-black |
| white | gallery white |
| oak | warm wood |
| walnut | dark wood |
| mahogany | reddish wood |

#### 5. liner
- none
- linen (cream, subtle texture)
- velvet (deep burgundy)
- gold liner (bright gold strip)

#### 6. aging
- none, light, medium, heavy
- applies patina overlay + corner darkening + edge wear (heavy only)

### presets
| preset | profile stack | ornaments | corners | finish | liner | aging |
|--------|--------------|-----------|---------|--------|-------|-------|
| renaissance | flat, ogee, fillet, flat | egg-and-dart, acanthus, bead | cartouche | antique gold | linen | medium |
| baroque | bolection, ogee, cushion, bead, fillet, scoop | bead & reel, acanthus, scrolls, bead | acanthus cluster | gold leaf | velvet | light |
| rococo | reverse scoop, ogee, bead, cushion, fillet | shell, floral, vine, bead | shell | champagne gold | linen | light |
| neoclassical | flat, ogee, fillet, bead, flat | egg-and-dart, laurel, greek key | floral burst | antique gold | linen | medium |
| victorian | ogee, cushion, fillet, ogee, bead, flat | rope, floral, bead & reel | floral burst | antique gold | velvet | medium |
| arts & crafts | flat, fillet, flat | none | plain miter | oak | none | medium |
| modern gallery | flat, fillet, flat | none | plain miter | black lacquer | none | none |

---

## export formats (web app)

- **png** — full-resolution raster with alpha channel support
- **jpeg** — white-backed compressed raster at 92% quality
- **svg** — vector recreation using rect/ellipse/circle/line elements
- **html/css** — standalone html page with absolutely-positioned divs

---

## ui features

### figma plugin
- step-based wizard with breadcrumb navigation
- picrew-style preview with hover zones
- chevron cycling for pattern/preset switching
- mini swatch rows for quick color changes
- right-click context menus with nested submenus
- live canvas preview
- dark mode compatible (border-only card selection)
- poppins font, all lowercase text
- auto-resizing panel

### web app
- dark sidebar (340px) with collapsible sections
- mode toggle (background / frames)
- swatch grid color pickers with hex input
- profile stack with add/remove pills
- 7 preset buttons for frames
- live canvas preview via requestAnimationFrame
- export dropdown with 4 format options
