# roadmap

## current state (v1)

- [x] museum wall background generator (painted, wallpaper, wood, fabric)
- [x] 7 wallpaper patterns (damask, william morris, stripes, flock, toile, brocade, embossed leather)
- [x] 7 wainscoting types (beadboard, raised panel, flat panel, board & batten, stone, marble, wood planks)
- [x] 3 divider types (chair rail, molding, picture rail)
- [x] anatomy-first frame generator with profile stacks
- [x] 12 ornament types across 4 zones
- [x] 6 corner treatments
- [x] 10 finishes, 4 liner options, 4 aging levels
- [x] 7 historical presets
- [x] figma plugin with step wizard ui
- [x] standalone web app with live preview
- [x] multi-format export (png, jpeg, svg, html/css)

---

## near-term

### wall improvements
- [ ] ceiling / crown molding zone (top of wall)
- [ ] floor / hardwood / tile / carpet zone (bottom)
- [ ] lighting effects (wall sconces, picture lights, spotlights)
- [ ] dado rail as separate element from chair rail
- [ ] more wallpaper patterns: chinoiserie, geometric art deco, regency stripe
- [ ] gradient paint (subtle top-to-bottom value shift for realism)
- [ ] shadow casting from picture rail

### frame improvements
- [ ] more profile primitives: torus, quirk, chamfer, bevel, stepped
- [ ] asymmetric frames (different ornament per rail)
- [ ] frame within frame (double framing)
- [ ] plein air / impressionist style preset
- [ ] floating frame preset (gap between artwork and frame)
- [ ] shadow box preset (deep box with object shelf)
- [ ] mat/mount options (single, double, stepped mats with color choices)
- [ ] dentil and fluting ornament types

### export improvements
- [ ] svg export with grouped elements (wall, divider, lower wall as groups)
- [ ] css custom properties in html export for easy theming
- [ ] webp export option
- [ ] pdf export for print
- [ ] configurable export resolution (1x, 2x, 3x)

---

## mid-term

### composition mode
- [ ] place multiple frames on a wall background
- [ ] gallery hang patterns: salon hang, grid, single row, stacked pairs
- [ ] frame spacing and alignment tools
- [ ] artwork placeholder sizing (landscape, portrait, square presets)

### scene generation
- [ ] full room view with perspective
- [ ] bench / seating element
- [ ] stanchion / rope barrier
- [ ] museum label / placard
- [ ] spotlight cones

### interactivity (web app)
- [ ] drag-and-drop artwork images into frames
- [ ] pan and zoom on canvas
- [ ] undo/redo
- [ ] save/load presets as json
- [ ] shareable urls with state encoded in hash

### figma plugin improvements
- [ ] batch generation (generate N walls/frames at once)
- [ ] style extraction (analyze existing figma frame nodes and reverse-engineer parameters)
- [ ] component output option (generate as figma components with variants)
- [ ] auto-layout integration

---

## long-term

### 3d preview
- [ ] webgl preview with perspective and lighting
- [ ] orbit camera around generated room
- [ ] ambient occlusion for frame depth
- [ ] real-time material preview (gold reflection, velvet texture, wood grain)

### ai integration
- [ ] "generate a wall that matches this museum photo" (image → parameters)
- [ ] "suggest a frame for this painting" (artwork analysis → style recommendation)
- [ ] period detection from reference images

### community
- [ ] preset sharing / community library
- [ ] featured combinations gallery
- [ ] embed widget for museum websites

### additional platforms
- [ ] react component library
- [ ] web component / custom element
- [ ] blender add-on for 3d museum scenes
- [ ] unity/unreal plugin for game environments
