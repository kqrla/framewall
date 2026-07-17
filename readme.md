# framewall

museum wall & frame generator — figma plugin + standalone web app

## structure

- `plugin/` — figma plugin source (code.ts, ui.html, manifest.json)
- `web/` — standalone web app (single html file, no dependencies)

## plugin

generates museum-style wall backgrounds and ornate picture frames directly on the figma canvas.

### backgrounds
- wall coverings: painted, wallpaper (damask, william morris, stripes, flock, toile, brocade, embossed leather), wood, fabric
- dividers: chair rail, molding, picture rail
- lower wall: beadboard, raised panel, flat panel, board & batten, stone, marble, wood planks
- baseboard
- picrew-style preview with hover zones, chevron cycling, color swatches, right-click context menus

### frames (museum frame grammar)
- anatomy-first approach: profile stack, ornament zones, corner treatments, finish, liner, aging
- 15 profile primitives: flat, ogee, cushion, scoop, bead, bolection, fillet, astragal, cavetto, scotia, etc.
- 13 ornament types: bead, egg-and-dart, acanthus, scrolls, shell, rope, laurel, greek key, guilloche, floral, vine, etc.
- 6 corner treatments: plain miter, floral burst, shell, cartouche, acanthus cluster, scroll volute
- 10 finishes: gold leaf, antique gold, champagne gold, silver leaf, bronze, black lacquer, white, oak, walnut, mahogany
- 7 historical presets: renaissance, baroque, rococo, neoclassical, victorian, arts & crafts, modern gallery
- presets auto-fill all anatomy parameters; every parameter remains customizable

## web app

open `web/index.html` in a browser. dark sidebar with controls, live canvas preview, png download.
