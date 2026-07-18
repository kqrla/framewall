# framewall

museum wall & frame generator — a tool for creating historically accurate museum wall backgrounds and ornate picture frames.

available as a figma plugin and a standalone web app.

## what it does

framewall generates two types of museum-quality design assets:

**museum walls** — composable wall backgrounds (1778x1000) built from layered architectural elements:
- wall coverings (painted, wallpaper, wood paneling, fabric)
- dividers (chair rail, molding, picture rail)
- lower wall / wainscoting (beadboard, raised panel, flat panel, board & batten, stone, marble, wood planks)
- baseboard

**ornate picture frames** — anatomy-first frame generation based on a 5-part "museum frame grammar":
- profile stacks (ogee, cushion, bolection, fillet, bead, and more)
- ornament zones (acanthus, egg-and-dart, shell, scrolls, greek key, etc.)
- corner treatments (floral burst, cartouche, acanthus cluster, scroll volute)
- finishes (gold leaf, antique gold, champagne gold, silver leaf, bronze, wood, lacquer)
- liners & aging effects

7 historical presets auto-fill anatomy parameters: renaissance, baroque, rococo, neoclassical, victorian, arts & crafts, modern gallery.

## project structure

```
framewall/
├── plugin/          figma generative plugin
│   ├── manifest.json
│   ├── code.ts      plugin logic (figma api)
│   └── ui.html      plugin ui (step wizard)
│
├── web/             standalone web app
│   └── index.html   full app, no dependencies
│
├── readme.md
├── features.md
├── underthehood.md
├── usecases.md
└── roadmap.md
```

## getting started

### web app
open `web/index.html` in any browser. no build step, no dependencies.

### figma plugin
the plugin is published to figma. search for "museum wall & frame generator" in the figma plugin directory, or install it directly from the community page.

## export formats

the web app supports exporting in 4 formats:
- **png** — raster, transparent-ready
- **jpeg** — compressed raster, smaller file size
- **svg** — vector, scalable to any size
- **html/css** — standalone page with css-drawn elements

## philosophy

> "i don't want to teach the generator styles first. teach it the anatomy of a frame, then define styles as combinations of anatomical choices."

historical frame styles are presets, not primitives. the generator understands frame *anatomy* — profiles, ornaments, corners, finishes, liners, aging — and historical styles emerge from specific combinations of those anatomical parameters.

## docs

- [features.md](features.md) — full feature list
- [underthehood.md](underthehood.md) — technical architecture, rendering pipeline, mermaid diagrams
- [usecases.md](usecases.md) — who this is for and how they use it
- [roadmap.md](roadmap.md) — what's next
