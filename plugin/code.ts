// museum wall & frame generator — figma generative plugin

// ─── color palette ───────────────────────────────────────────────────────────

const PAL: Record<string, string> = {
  burgundy: '#722F37', oxblood: '#4A0404', forestGreen: '#228B22', navy: '#000080',
  charcoal: '#36454F', cream: '#FFFDD0', ivory: '#FFFFF0', slate: '#708090',
  terracotta: '#E2725B', sage: '#BCB88A', warmGray: '#808069', plum: '#8E4585',
  chocolate: '#7B3F00', bottleGreen: '#006A4E', dustyRose: '#DCAE96',
  gold: '#CFB53B', antiqueGold: '#C9A84C', champagneGold: '#F7E7CE',
  silverLeaf: '#C0C0C0', bronze: '#CD7F32', mahogany: '#C04000',
  walnut: '#5C4033', oak: '#806517', blackLacquer: '#0D0D0D',
  galleryWhite: '#F5F5F5', museumRed: '#8B0000', britishRacingGreen: '#004225',
  oxfordBlue: '#002147', deepTeal: '#003B46', mauve: '#E0B0FF',
};

// ─── color helpers ───────────────────────────────────────────────────────────

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16) / 255,
    g: parseInt(h.substring(2, 4), 16) / 255,
    b: parseInt(h.substring(4, 6), 16) / 255,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const to = (v: number) => Math.max(0, Math.min(255, Math.round(v * 255))).toString(16).padStart(2, '0');
  return '#' + to(r) + to(g) + to(b);
}

function c(hex: string): SolidPaint {
  return { type: 'SOLID', color: hexToRgb(hex) };
}

function sp(hex: string): SolidPaint {
  return { type: 'SOLID', color: hexToRgb(hex) };
}

function lighter(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  return rgbToHex(
    rgb.r + (1 - rgb.r) * amount,
    rgb.g + (1 - rgb.g) * amount,
    rgb.b + (1 - rgb.b) * amount,
  );
}

function darker(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  return rgbToHex(rgb.r * (1 - amount), rgb.g * (1 - amount), rgb.b * (1 - amount));
}

function addRect(
  parent: FrameNode,
  x: number, y: number, w: number, h: number,
  fill: string, opacity = 1, name = 'rect',
): RectangleNode {
  const r = figma.createRectangle();
  r.name = name;
  r.x = x; r.y = y;
  r.resize(Math.max(1, w), Math.max(1, h));
  r.fills = [c(fill)];
  r.opacity = opacity;
  parent.appendChild(r);
  return r;
}

function addEllipse(
  parent: FrameNode,
  cx: number, cy: number, rx: number, ry: number,
  fill: string, rotation = 0, opacity = 1,
): EllipseNode {
  const e = figma.createEllipse();
  e.name = 'ellipse';
  e.resize(Math.max(1, rx * 2), Math.max(1, ry * 2));
  e.x = cx - rx; e.y = cy - ry;
  e.fills = [c(fill)];
  e.rotation = rotation;
  e.opacity = opacity;
  parent.appendChild(e);
  return e;
}

// ─── background generation ───────────────────────────────────────────────────

const BG_W = 1778;
const BG_H = 1000;

interface BgConfig {
  wallCoveringType: 'painted' | 'wood' | 'fabric' | 'wallpaper';
  paintColor?: string;
  woodType?: 'oak' | 'walnut' | 'mahogany';
  fabricType?: 'silk' | 'velvet' | 'linen';
  wallpaperStyle?: 'damask' | 'william morris' | 'stripes' | 'flock' | 'toile' | 'brocade' | 'embossed leather';
  wallpaperColor?: string;
  lowerWallType: 'beadboard' | 'raised panel' | 'flat panel' | 'board and batten' | 'stone' | 'marble' | 'wood planks';
  lowerWallColor?: string;
  dividerType: 'chair rail' | 'molding' | 'picture rail';
  dividerColor?: string;
  baseboardColor?: string;
}

function drawWallCovering(root: FrameNode, cfg: BgConfig): void {
  const baseColor = cfg.paintColor || PAL.cream;
  const { wallCoveringType } = cfg;

  if (wallCoveringType === 'painted') {
    addRect(root, 0, 0, BG_W, BG_H, baseColor, 1, 'wall-paint');
    return;
  }

  if (wallCoveringType === 'wood') {
    const woodColors: Record<string, string> = {
      oak: PAL.oak, walnut: PAL.walnut, mahogany: PAL.mahogany,
    };
    const base = woodColors[cfg.woodType || 'oak'] || PAL.oak;
    addRect(root, 0, 0, BG_W, BG_H, base, 1, 'wood-base');
    const plankH = 60;
    for (let y = 0; y < BG_H; y += plankH) {
      const shift = (y / plankH) % 2 === 0 ? 0.03 : -0.03;
      const col = lighter(base, shift > 0 ? shift : 0);
      const col2 = shift < 0 ? darker(base, -shift) : col;
      addRect(root, 0, y, BG_W, plankH - 1, col2, 0.6, 'plank');
      addRect(root, 0, y + plankH - 2, BG_W, 1, darker(base, 0.15), 0.4, 'grain');
    }
    return;
  }

  if (wallCoveringType === 'fabric') {
    const fabricColors: Record<string, string> = {
      silk: PAL.champagneGold, velvet: PAL.burgundy, linen: PAL.cream,
    };
    const fBase = fabricColors[cfg.fabricType || 'silk'] || PAL.cream;
    addRect(root, 0, 0, BG_W, BG_H, fBase, 1, 'fabric-base');
    if (cfg.fabricType === 'silk') {
      for (let y = 0; y < BG_H; y += 8) {
        addRect(root, 0, y, BG_W, 1, lighter(fBase, 0.08), 0.15, 'sheen');
      }
    } else if (cfg.fabricType === 'linen') {
      for (let y = 0; y < BG_H; y += 6) {
        addRect(root, 0, y, BG_W, 1, darker(fBase, 0.05), 0.12, 'weave-h');
      }
      for (let x = 0; x < BG_W; x += 6) {
        addRect(root, x, 0, 1, BG_H, darker(fBase, 0.05), 0.12, 'weave-v');
      }
    }
    return;
  }

  // wallpaper
  const wpColor = cfg.wallpaperColor || PAL.cream;
  addRect(root, 0, 0, BG_W, BG_H, wpColor, 1, 'wp-base');
  const ornCol = lighter(wpColor, 0.06);
  const ornCol2 = darker(wpColor, 0.06);
  const style = cfg.wallpaperStyle || 'damask';

  if (style === 'damask' || style === 'flock' || style === 'brocade') {
    const spacing = style === 'flock' ? 120 : 100;
    const scale = style === 'flock' ? 1.2 : 1;
    const accent = style === 'brocade' ? PAL.gold : ornCol;
    for (let gx = spacing / 2; gx < BG_W; gx += spacing) {
      for (let gy = spacing / 2; gy < BG_H; gy += spacing) {
        addEllipse(root, gx, gy, 12 * scale, 22 * scale, ornCol2, 0, 0.25);
        addEllipse(root, gx, gy - 20 * scale, 4 * scale, 4 * scale, ornCol2, 0, 0.2);
        addEllipse(root, gx, gy + 20 * scale, 4 * scale, 4 * scale, ornCol2, 0, 0.2);
        addEllipse(root, gx - 14 * scale, gy, 5 * scale, 5 * scale, accent, 0, 0.18);
        addEllipse(root, gx + 14 * scale, gy, 5 * scale, 5 * scale, accent, 0, 0.18);
        addEllipse(root, gx - 10 * scale, gy - 10 * scale, 3 * scale, 6 * scale, ornCol2, 30, 0.15);
        addEllipse(root, gx + 10 * scale, gy - 10 * scale, 3 * scale, 6 * scale, ornCol2, -30, 0.15);
        addEllipse(root, gx - 10 * scale, gy + 10 * scale, 3 * scale, 6 * scale, ornCol2, -30, 0.15);
        addEllipse(root, gx + 10 * scale, gy + 10 * scale, 3 * scale, 6 * scale, ornCol2, 30, 0.15);
        addEllipse(root, gx, gy, 3 * scale, 3 * scale, accent, 45, 0.2);
      }
    }
  } else if (style === 'william morris') {
    for (let gx = 50; gx < BG_W; gx += 90) {
      for (let gy = 40; gy < BG_H; gy += 110) {
        addEllipse(root, gx, gy, 2, 30, ornCol2, 0, 0.2);
        for (let li = 0; li < 4; li++) {
          const ly = gy - 20 + li * 12;
          addEllipse(root, gx - 8, ly, 6, 3, ornCol2, -20, 0.18);
          addEllipse(root, gx + 8, ly, 6, 3, ornCol2, 20, 0.18);
        }
        addEllipse(root, gx, gy - 25, 3, 3, ornCol, 0, 0.25);
      }
    }
  } else if (style === 'stripes') {
    const stripeW = 30;
    for (let x = 0; x < BG_W; x += stripeW * 2) {
      addRect(root, x, 0, stripeW, BG_H, lighter(wpColor, 0.04), 0.3, 'stripe');
    }
  } else if (style === 'toile') {
    for (let gx = 100; gx < BG_W; gx += 200) {
      for (let gy = 100; gy < BG_H; gy += 200) {
        addEllipse(root, gx - 30, gy - 10, 12, 20, ornCol2, 0, 0.15);
        addEllipse(root, gx - 30, gy - 35, 15, 12, ornCol2, 0, 0.15);
        addRect(root, gx + 10, gy - 5, 25, 20, ornCol2, 0.12, 'house');
        addRect(root, gx + 10, gy - 15, 25, 10, ornCol2, 0.1, 'roof');
        addEllipse(root, gx + 50, gy + 5, 5, 10, ornCol2, 0, 0.15);
        addEllipse(root, gx + 50, gy - 5, 4, 4, ornCol2, 0, 0.12);
      }
    }
  } else if (style === 'embossed leather') {
    const tileSize = 80;
    for (let tx = 0; tx < BG_W; tx += tileSize) {
      for (let ty = 0; ty < BG_H; ty += tileSize) {
        addRect(root, tx + 2, ty + 2, tileSize - 4, tileSize - 4, wpColor, 0.3, 'tile');
        addRect(root, tx + 2, ty + 2, tileSize - 4, 2, lighter(wpColor, 0.1), 0.25, 'bevel-t');
        addRect(root, tx + 2, ty + 2, 2, tileSize - 4, lighter(wpColor, 0.1), 0.25, 'bevel-l');
        addRect(root, tx + 2, ty + tileSize - 4, tileSize - 4, 2, darker(wpColor, 0.1), 0.25, 'bevel-b');
        addRect(root, tx + tileSize - 4, ty + 2, 2, tileSize - 4, darker(wpColor, 0.1), 0.25, 'bevel-r');
      }
    }
  }
}

function drawDivider(root: FrameNode, y: number, cfg: BgConfig): void {
  const col = cfg.dividerColor || PAL.ivory;
  const { dividerType } = cfg;
  if (dividerType === 'chair rail') {
    addRect(root, 0, y, BG_W, 20, col, 1, 'chair-rail');
    addRect(root, 0, y, BG_W, 3, lighter(col, 0.15), 0.6, 'rail-highlight');
  } else if (dividerType === 'molding') {
    addRect(root, 0, y, BG_W, 30, col, 1, 'molding-base');
    addRect(root, 0, y, BG_W, 2, lighter(col, 0.2), 0.5, 'mold-strip-1');
    addRect(root, 0, y + 8, BG_W, 2, lighter(col, 0.12), 0.4, 'mold-strip-2');
    addRect(root, 0, y + 20, BG_W, 2, darker(col, 0.1), 0.4, 'mold-strip-3');
    addRect(root, 0, y + 28, BG_W, 2, darker(col, 0.15), 0.3, 'mold-strip-4');
  } else {
    addRect(root, 0, y, BG_W, 15, col, 1, 'picture-rail');
    addRect(root, 0, y + 12, BG_W, 4, darker(col, 0.1), 0.5, 'rail-lip');
  }
}

function drawWainscoting(root: FrameNode, y: number, h: number, cfg: BgConfig): void {
  const col = cfg.lowerWallColor || PAL.ivory;
  addRect(root, 0, y, BG_W, h, col, 1, 'lower-wall-base');
  const { lowerWallType } = cfg;

  if (lowerWallType === 'beadboard') {
    for (let x = 0; x < BG_W; x += 20) {
      addRect(root, x, y, 1, h, darker(col, 0.12), 0.4, 'bead-groove');
    }
  } else if (lowerWallType === 'raised panel' || lowerWallType === 'flat panel') {
    const panelW = 160, panelH = h - 30, gap = 25, py = y + 15;
    const raised = lowerWallType === 'raised panel';
    for (let px = gap; px + panelW < BG_W; px += panelW + gap) {
      addRect(root, px, py, panelW, panelH, col, 0.5, 'panel-base');
      if (raised) {
        addRect(root, px, py, panelW, 2, lighter(col, 0.15), 0.5, 'panel-hl-t');
        addRect(root, px, py, 2, panelH, lighter(col, 0.15), 0.5, 'panel-hl-l');
        addRect(root, px, py + panelH - 2, panelW, 2, darker(col, 0.12), 0.5, 'panel-sh-b');
        addRect(root, px + panelW - 2, py, 2, panelH, darker(col, 0.12), 0.5, 'panel-sh-r');
        addRect(root, px + 8, py + 8, panelW - 16, panelH - 16, lighter(col, 0.04), 0.4, 'panel-center');
      } else {
        addRect(root, px, py, panelW, 1, darker(col, 0.1), 0.4, 'outline-t');
        addRect(root, px, py + panelH - 1, panelW, 1, darker(col, 0.1), 0.4, 'outline-b');
        addRect(root, px, py, 1, panelH, darker(col, 0.1), 0.4, 'outline-l');
        addRect(root, px + panelW - 1, py, 1, panelH, darker(col, 0.1), 0.4, 'outline-r');
      }
    }
  } else if (lowerWallType === 'board and batten') {
    const boardW = 80, battenW = 6;
    for (let x = 0; x < BG_W; x += boardW) {
      addRect(root, x + boardW - battenW / 2, y, battenW, h, darker(col, 0.08), 0.5, 'batten');
    }
  } else if (lowerWallType === 'stone') {
    const stoneH = 40, stoneW = 100;
    for (let row = 0; row * stoneH < h; row++) {
      const offset = row % 2 === 0 ? 0 : stoneW / 2;
      for (let sx = -stoneW + offset; sx < BG_W; sx += stoneW) {
        addRect(root, sx + 1, y + row * stoneH + 1, stoneW - 2, stoneH - 2, lighter(col, 0.02 * (row % 3)), 0.3, 'stone');
      }
    }
  } else if (lowerWallType === 'marble') {
    for (let v = 0; v < 8; v++) {
      const vx = (v * 230 + 50) % BG_W;
      const vy = y + (v * 37) % h;
      addRect(root, vx, vy, 80, 1, darker(col, 0.08), 0.2, 'vein');
    }
  } else if (lowerWallType === 'wood planks') {
    const plankH = 40;
    for (let py = y; py < y + h; py += plankH) {
      addRect(root, 0, py, BG_W, plankH - 1, lighter(col, ((py - y) / plankH % 2) * 0.04), 0.4, 'plank');
      addRect(root, 0, py + plankH - 2, BG_W, 1, darker(col, 0.1), 0.3, 'grain');
    }
  }
}

function drawBaseboard(root: FrameNode, y: number, cfg: BgConfig): void {
  const col = cfg.baseboardColor || PAL.ivory;
  addRect(root, 0, y, BG_W, 25, col, 1, 'baseboard');
  addRect(root, 0, y, BG_W, 2, lighter(col, 0.15), 0.5, 'baseboard-highlight');
}

function generateBackground(cfg: BgConfig): void {
  const root = figma.createFrame();
  root.resize(BG_W, BG_H);
  root.name = `museum wall — ${cfg.wallCoveringType}`;
  root.fills = [c(PAL.cream)];
  root.clipsContent = true;

  drawWallCovering(root, cfg);

  const bottomPct = 0.35;
  const bottomH = Math.round(BG_H * bottomPct);
  const baseboardH = 25;
  const dividerH = cfg.dividerType === 'molding' ? 30 : cfg.dividerType === 'chair rail' ? 20 : 15;
  const lowerWallH = bottomH - baseboardH - dividerH;
  const dividerY = BG_H - bottomH;
  const lowerWallY = dividerY + dividerH;
  const baseboardY = BG_H - baseboardH;

  if (cfg.dividerType) drawDivider(root, dividerY, cfg);
  if (cfg.lowerWallType) drawWainscoting(root, lowerWallY, lowerWallH, cfg);
  if (cfg.baseboardColor) drawBaseboard(root, baseboardY, cfg);

  figma.currentPage.appendChild(root);
  root.setRelaunchData({ open: 'museum wall & frame generator' });
}

// ─── frame generation ────────────────────────────────────────────────────────

type ProfilePrimitive = 'flat' | 'ogee' | 'cushion' | 'scoop' | 'reverse scoop' |
  'bead' | 'bolection' | 'fillet' | 'astragal' | 'cavetto' | 'scotia' | 'cove';

type OrnamentType = 'none' | 'bead' | 'bead & reel' | 'egg-and-dart' | 'acanthus' |
  'scrolls' | 'shell' | 'rope' | 'laurel' | 'greek key' | 'guilloché' | 'floral' | 'vine';

type CornerType = 'plain miter' | 'floral burst' | 'shell' | 'cartouche' |
  'acanthus cluster' | 'scroll volute';

type FinishType = 'gold leaf' | 'antique gold' | 'champagne gold' | 'silver leaf' |
  'bronze' | 'black lacquer' | 'white' | 'oak' | 'walnut' | 'mahogany';

type LinerType = 'none' | 'linen' | 'velvet' | 'gold liner';
type AgingType = 'none' | 'light' | 'medium' | 'heavy';

interface OrnamentZones {
  A: OrnamentType; B: OrnamentType; C: OrnamentType; D: OrnamentType;
}

interface FrameConfig {
  preset?: string;
  artworkWidth?: number;
  artworkHeight?: number;
  profileStack: ProfilePrimitive[];
  ornamentZones: OrnamentZones;
  cornerType: CornerType;
  cornerAmplification: number;
  finish: FinishType;
  liner: LinerType;
  aging: AgingType;
  railWidthRatio: number;
  carvingCoverage: number;
  reliefDepth: number;
}

const PRESETS: Record<string, Omit<FrameConfig, 'artworkWidth' | 'artworkHeight'>> = {
  renaissance: {
    profileStack: ['flat', 'ogee', 'fillet', 'flat'],
    ornamentZones: { A: 'egg-and-dart', B: 'acanthus', C: 'bead', D: 'none' },
    cornerType: 'cartouche', cornerAmplification: 1.3,
    finish: 'antique gold', liner: 'linen', aging: 'medium',
    railWidthRatio: 0.18, carvingCoverage: 0.45, reliefDepth: 3,
  },
  baroque: {
    profileStack: ['bolection', 'ogee', 'cushion', 'bead', 'fillet', 'scoop'],
    ornamentZones: { A: 'bead & reel', B: 'acanthus', C: 'scrolls', D: 'bead' },
    cornerType: 'acanthus cluster', cornerAmplification: 2.0,
    finish: 'gold leaf', liner: 'velvet', aging: 'light',
    railWidthRatio: 0.22, carvingCoverage: 0.75, reliefDepth: 5,
  },
  rococo: {
    profileStack: ['reverse scoop', 'ogee', 'bead', 'cushion', 'fillet'],
    ornamentZones: { A: 'shell', B: 'floral', C: 'vine', D: 'bead' },
    cornerType: 'shell', cornerAmplification: 1.8,
    finish: 'champagne gold', liner: 'linen', aging: 'light',
    railWidthRatio: 0.20, carvingCoverage: 0.70, reliefDepth: 4,
  },
  neoclassical: {
    profileStack: ['flat', 'ogee', 'fillet', 'bead', 'flat'],
    ornamentZones: { A: 'egg-and-dart', B: 'laurel', C: 'greek key', D: 'none' },
    cornerType: 'floral burst', cornerAmplification: 1.3,
    finish: 'antique gold', liner: 'linen', aging: 'medium',
    railWidthRatio: 0.16, carvingCoverage: 0.40, reliefDepth: 2,
  },
  victorian: {
    profileStack: ['ogee', 'cushion', 'fillet', 'ogee', 'bead', 'flat'],
    ornamentZones: { A: 'rope', B: 'floral', C: 'bead & reel', D: 'none' },
    cornerType: 'floral burst', cornerAmplification: 1.5,
    finish: 'antique gold', liner: 'velvet', aging: 'medium',
    railWidthRatio: 0.19, carvingCoverage: 0.55, reliefDepth: 3,
  },
  artsAndCrafts: {
    profileStack: ['flat', 'fillet', 'flat'],
    ornamentZones: { A: 'none', B: 'none', C: 'none', D: 'none' },
    cornerType: 'plain miter', cornerAmplification: 1.0,
    finish: 'oak', liner: 'none', aging: 'medium',
    railWidthRatio: 0.12, carvingCoverage: 0.0, reliefDepth: 1,
  },
  modernGallery: {
    profileStack: ['flat', 'fillet', 'flat'],
    ornamentZones: { A: 'none', B: 'none', C: 'none', D: 'none' },
    cornerType: 'plain miter', cornerAmplification: 1.0,
    finish: 'black lacquer', liner: 'none', aging: 'none',
    railWidthRatio: 0.06, carvingCoverage: 0.0, reliefDepth: 0,
  },
};

const FINISH_COLORS: Record<FinishType, string> = {
  'gold leaf': PAL.gold, 'antique gold': PAL.antiqueGold,
  'champagne gold': PAL.champagneGold, 'silver leaf': PAL.silverLeaf,
  'bronze': PAL.bronze, 'black lacquer': PAL.blackLacquer,
  'white': PAL.galleryWhite, 'oak': PAL.oak,
  'walnut': PAL.walnut, 'mahogany': PAL.mahogany,
};

const PROFILE_WIDTHS: Record<ProfilePrimitive, number> = {
  flat: 14, ogee: 16, cushion: 18, scoop: 14, 'reverse scoop': 14,
  bead: 6, bolection: 22, fillet: 4, astragal: 10, cavetto: 12, scotia: 14, cove: 14,
};

interface ProfileShading {
  outerShift: number; innerShift: number; midShift: number;
}

const PROFILE_SHADING: Record<ProfilePrimitive, ProfileShading> = {
  flat:            { outerShift: 0,     innerShift: 0,     midShift: 0 },
  ogee:            { outerShift: 0.12,  innerShift: -0.12, midShift: 0 },
  cushion:         { outerShift: -0.06, innerShift: -0.06, midShift: 0.1 },
  scoop:           { outerShift: 0.06,  innerShift: 0.06,  midShift: -0.1 },
  'reverse scoop': { outerShift: -0.06, innerShift: -0.06, midShift: 0.08 },
  bead:            { outerShift: 0.08,  innerShift: -0.04, midShift: 0.15 },
  bolection:       { outerShift: 0.08,  innerShift: -0.18, midShift: 0.04 },
  fillet:          { outerShift: -0.02, innerShift: -0.02, midShift: 0 },
  astragal:        { outerShift: 0.05,  innerShift: -0.05, midShift: 0.1 },
  cavetto:         { outerShift: 0.04,  innerShift: -0.08, midShift: -0.06 },
  scotia:          { outerShift: 0.02,  innerShift: -0.02, midShift: -0.12 },
  cove:            { outerShift: 0.06,  innerShift: 0.06,  midShift: -0.1 },
};

function applyShading(base: string, shift: number): string {
  return shift > 0 ? lighter(base, shift) : shift < 0 ? darker(base, -shift) : base;
}

function drawProfileBands(
  root: FrameNode, totalW: number, totalH: number,
  stack: ProfilePrimitive[], finishColor: string, reliefDepth: number,
): { bandOffsets: number[]; railWidth: number } {
  const bandOffsets: number[] = [];
  let offset = 0;

  for (const prim of stack) {
    const w = PROFILE_WIDTHS[prim];
    const shading = PROFILE_SHADING[prim];
    bandOffsets.push(offset);

    const outerCol = applyShading(finishColor, shading.outerShift);
    const innerCol = applyShading(finishColor, shading.innerShift);
    const midCol = applyShading(finishColor, shading.midShift);

    const innerOffset = offset + w;
    const stripW = Math.max(1, Math.floor(w / 3));
    const strips = [
      { off: 0, col: outerCol },
      { off: stripW, col: midCol },
      { off: stripW * 2, col: innerCol },
    ];

    for (const strip of strips) {
      const so = offset + strip.off;
      const sw = so === offset + stripW * 2 ? w - stripW * 2 : stripW;
      addRect(root, so, so, totalW - 2 * so, sw, strip.col, 1, `${prim}-top`);
      addRect(root, so, totalH - so - sw, totalW - 2 * so, sw, strip.col, 1, `${prim}-bot`);
      addRect(root, so, so + sw, sw, totalH - 2 * (so + sw), strip.col, 1, `${prim}-left`);
      addRect(root, totalW - so - sw, so + sw, sw, totalH - 2 * (so + sw), strip.col, 1, `${prim}-right`);
    }

    if (reliefDepth > 0) {
      const shadowCol = darker(finishColor, 0.15 * Math.min(reliefDepth, 5) / 5);
      addRect(root, innerOffset - 1, innerOffset - 1, totalW - 2 * (innerOffset - 1), 1, shadowCol, 0.3, 'relief');
      addRect(root, innerOffset - 1, totalH - innerOffset, totalW - 2 * (innerOffset - 1), 1, shadowCol, 0.3, 'relief');
      addRect(root, innerOffset - 1, innerOffset, 1, totalH - 2 * innerOffset, shadowCol, 0.3, 'relief');
      addRect(root, totalW - innerOffset, innerOffset, 1, totalH - 2 * innerOffset, shadowCol, 0.3, 'relief');
    }

    offset += w;
  }

  return { bandOffsets, railWidth: offset };
}

type OrnamentDrawFn = (
  parent: FrameNode, x: number, y: number, size: number, col: string, rotation?: number,
) => void;

const ORNAMENT_DRAW: Record<string, OrnamentDrawFn> = {
  'bead': (p, x, y, s, col) => {
    addEllipse(p, x, y, s * 0.4, s * 0.4, col, 0, 0.7);
  },
  'bead & reel': (p, x, y, s, col) => {
    addEllipse(p, x, y, s * 0.35, s * 0.35, col, 0, 0.7);
    addRect(p, x + s * 0.5, y - s * 0.15, s * 0.25, s * 0.3, col, 0.5, 'reel');
  },
  'egg-and-dart': (p, x, y, s, col) => {
    addEllipse(p, x, y, s * 0.35, s * 0.5, col, 0, 0.7);
    addRect(p, x + s * 0.55, y - s * 0.05, s * 0.08, s * 0.4, darker(col, 0.15), 0.6, 'dart');
  },
  'acanthus': (p, x, y, s, col) => {
    addEllipse(p, x, y, s * 0.3, s * 0.6, col, 0, 0.6);
    addEllipse(p, x - s * 0.2, y - s * 0.1, s * 0.15, s * 0.3, col, 15, 0.4);
    addEllipse(p, x + s * 0.2, y - s * 0.1, s * 0.15, s * 0.3, col, -15, 0.4);
  },
  'scrolls': (p, x, y, s, col) => {
    for (let i = 0; i < 5; i++) {
      const angle = i * 60;
      const rad = (angle * Math.PI) / 180;
      addEllipse(p, x + Math.cos(rad) * s * 0.3, y + Math.sin(rad) * s * 0.3, s * 0.12, s * 0.12, col, 0, 0.5);
    }
  },
  'shell': (p, x, y, s, col) => {
    addEllipse(p, x, y + s * 0.1, s * 0.5, s * 0.35, col, 0, 0.6);
    for (let i = -2; i <= 2; i++) {
      addRect(p, x + i * s * 0.12, y - s * 0.2, 1, s * 0.4, lighter(col, 0.1), 0.4, 'ray');
    }
  },
  'rope': (p, x, y, s, col) => {
    addEllipse(p, x, y, s * 0.3, s * 0.15, col, 30, 0.6);
    addEllipse(p, x + s * 0.3, y, s * 0.3, s * 0.15, col, -30, 0.6);
  },
  'laurel': (p, x, y, s, col) => {
    addEllipse(p, x - s * 0.15, y, s * 0.15, s * 0.35, col, 20, 0.6);
    addEllipse(p, x + s * 0.15, y, s * 0.15, s * 0.35, col, -20, 0.6);
  },
  'greek key': (p, x, y, s, col) => {
    const u = s * 0.12;
    addRect(p, x, y - u * 2, u * 4, u, col, 0.6, 'gk');
    addRect(p, x + u * 3, y - u * 2, u, u * 3, col, 0.6, 'gk');
    addRect(p, x + u, y, u * 3, u, col, 0.6, 'gk');
    addRect(p, x + u, y - u, u, u, col, 0.6, 'gk');
  },
  'guilloché': (p, x, y, s, col) => {
    addEllipse(p, x, y, s * 0.4, s * 0.4, col, 0, 0.3);
    addEllipse(p, x + s * 0.3, y, s * 0.4, s * 0.4, col, 0, 0.3);
  },
  'floral': (p, x, y, s, col) => {
    addEllipse(p, x, y, s * 0.15, s * 0.15, lighter(col, 0.1), 0, 0.7);
    for (let i = 0; i < 5; i++) {
      const a = (i * 72 * Math.PI) / 180;
      addEllipse(p, x + Math.cos(a) * s * 0.25, y + Math.sin(a) * s * 0.25, s * 0.12, s * 0.2, col, i * 72, 0.5);
    }
  },
  'vine': (p, x, y, s, col) => {
    addRect(p, x - s * 0.3, y, s * 0.6, 1, col, 0.4, 'stem');
    addEllipse(p, x - s * 0.15, y - s * 0.12, s * 0.1, s * 0.18, col, 15, 0.5);
    addEllipse(p, x + s * 0.15, y + s * 0.08, s * 0.1, s * 0.18, col, -15, 0.5);
  },
};

function drawOrnamentRail(
  parent: FrameNode, ornType: OrnamentType, railWidth: number,
  totalW: number, totalH: number,
  bandOffset: number, bandWidth: number,
  finishColor: string, coverage: number,
): void {
  if (ornType === 'none' || !ORNAMENT_DRAW[ornType]) return;
  const drawFn = ORNAMENT_DRAW[ornType];
  const col = lighter(finishColor, 0.08);
  const spacing = Math.max(12, bandWidth * 1.8);
  const mid = bandOffset + bandWidth / 2;

  for (let x = railWidth + spacing; x < totalW - railWidth - spacing; x += spacing) {
    if (Math.random() > coverage + 0.3) continue;
    drawFn(parent, x, mid, bandWidth * 0.9, col);
  }
  for (let x = railWidth + spacing; x < totalW - railWidth - spacing; x += spacing) {
    if (Math.random() > coverage + 0.3) continue;
    drawFn(parent, x, totalH - mid, bandWidth * 0.9, col);
  }
  for (let y = railWidth + spacing; y < totalH - railWidth - spacing; y += spacing) {
    if (Math.random() > coverage + 0.3) continue;
    drawFn(parent, mid, y, bandWidth * 0.9, col);
  }
  for (let y = railWidth + spacing; y < totalH - railWidth - spacing; y += spacing) {
    if (Math.random() > coverage + 0.3) continue;
    drawFn(parent, totalW - mid, y, bandWidth * 0.9, col);
  }
}

function drawCorner(
  parent: FrameNode, cx: number, cy: number,
  cornerType: CornerType, amp: number, size: number, col: string,
): void {
  const s = size * amp;
  if (cornerType === 'plain miter') return;

  if (cornerType === 'floral burst') {
    addEllipse(parent, cx, cy, s * 0.15, s * 0.15, lighter(col, 0.1), 0, 0.8);
    for (let i = 0; i < 6; i++) {
      const a = (i * 60 * Math.PI) / 180;
      addEllipse(parent, cx + Math.cos(a) * s * 0.3, cy + Math.sin(a) * s * 0.3, s * 0.12, s * 0.22, col, i * 60, 0.6);
    }
  } else if (cornerType === 'shell') {
    addEllipse(parent, cx, cy, s * 0.45, s * 0.35, col, 0, 0.6);
    for (let i = -3; i <= 3; i++) {
      addRect(parent, cx + i * s * 0.08, cy - s * 0.3, 1, s * 0.4, lighter(col, 0.08), 0.35, 'ray');
    }
  } else if (cornerType === 'cartouche') {
    addEllipse(parent, cx, cy, s * 0.35, s * 0.45, col, 0, 0.55);
    addEllipse(parent, cx - s * 0.3, cy, s * 0.12, s * 0.2, col, 30, 0.4);
    addEllipse(parent, cx + s * 0.3, cy, s * 0.12, s * 0.2, col, -30, 0.4);
  } else if (cornerType === 'acanthus cluster') {
    for (let i = 0; i < 5; i++) {
      const a = (i * 72 * Math.PI) / 180;
      addEllipse(parent, cx + Math.cos(a) * s * 0.2, cy + Math.sin(a) * s * 0.2, s * 0.15, s * 0.35, col, i * 72 + 15, 0.5);
    }
    addEllipse(parent, cx, cy, s * 0.12, s * 0.12, lighter(col, 0.1), 0, 0.7);
  } else if (cornerType === 'scroll volute') {
    for (let i = 0; i < 8; i++) {
      const a = (i * 45 * Math.PI) / 180;
      const r = s * 0.1 + i * s * 0.03;
      addEllipse(parent, cx + Math.cos(a) * r, cy + Math.sin(a) * r, s * 0.06, s * 0.06, col, 0, 0.5);
    }
  }
}

function drawLiner(
  parent: FrameNode, railW: number, totalW: number, totalH: number,
  linerType: LinerType,
): void {
  if (linerType === 'none') return;
  const linerW = 10;
  const colorMap: Record<string, string> = {
    linen: PAL.cream, velvet: PAL.burgundy, 'gold liner': PAL.gold,
  };
  const col = colorMap[linerType] || PAL.cream;
  const ix = railW, iy = railW;
  const iw = totalW - 2 * railW, ih = totalH - 2 * railW;
  addRect(parent, ix, iy, iw, linerW, col, 0.9, 'liner-top');
  addRect(parent, ix, iy + ih - linerW, iw, linerW, col, 0.9, 'liner-bot');
  addRect(parent, ix, iy + linerW, linerW, ih - 2 * linerW, col, 0.9, 'liner-left');
  addRect(parent, ix + iw - linerW, iy + linerW, linerW, ih - 2 * linerW, col, 0.9, 'liner-right');
}

function applyAging(
  parent: FrameNode, totalW: number, totalH: number,
  agingType: AgingType, railW: number,
): void {
  if (agingType === 'none') return;
  const opacityMap: Record<string, number> = { light: 0.06, medium: 0.12, heavy: 0.22 };
  const op = opacityMap[agingType] || 0;
  addRect(parent, 0, 0, totalW, totalH, '#1a1000', op, 'patina');
  const cs = railW * 0.7;
  const cornerOp = op * 1.5;
  addRect(parent, 0, 0, cs, cs, '#0d0800', cornerOp, 'age-corner');
  addRect(parent, totalW - cs, 0, cs, cs, '#0d0800', cornerOp, 'age-corner');
  addRect(parent, 0, totalH - cs, cs, cs, '#0d0800', cornerOp, 'age-corner');
  addRect(parent, totalW - cs, totalH - cs, cs, cs, '#0d0800', cornerOp, 'age-corner');
  if (agingType === 'heavy') {
    addRect(parent, railW * 0.3, railW * 0.3, totalW * 0.15, 2, '#e8d8b0', 0.08, 'wear');
    addRect(parent, totalW - railW * 0.5, totalH * 0.4, 2, totalH * 0.15, '#e8d8b0', 0.08, 'wear');
  }
}

function generateFrame(cfg: FrameConfig): void {
  let finalCfg = { ...cfg };
  if (cfg.preset && PRESETS[cfg.preset]) {
    finalCfg = { ...PRESETS[cfg.preset], ...cfg, profileStack: cfg.profileStack || PRESETS[cfg.preset].profileStack };
  }

  const artW = finalCfg.artworkWidth || 400;
  const artH = finalCfg.artworkHeight || 500;

  let railW = 0;
  for (const p of finalCfg.profileStack) {
    railW += PROFILE_WIDTHS[p] || 12;
  }

  const totalW = artW + 2 * railW;
  const totalH = artH + 2 * railW;
  const finishColor = FINISH_COLORS[finalCfg.finish] || PAL.antiqueGold;

  const root = figma.createFrame();
  root.resize(totalW, totalH);
  root.name = `frame — ${finalCfg.preset || 'custom'} — ${totalW}×${totalH}`;
  root.fills = [];
  root.clipsContent = true;

  const { bandOffsets } = drawProfileBands(
    root, totalW, totalH, finalCfg.profileStack, finishColor, finalCfg.reliefDepth,
  );

  const zones: (keyof OrnamentZones)[] = ['A', 'B', 'C', 'D'];
  const bandCount = finalCfg.profileStack.length;
  for (let zi = 0; zi < zones.length; zi++) {
    const zone = zones[zi];
    const ornType = finalCfg.ornamentZones[zone];
    if (ornType === 'none') continue;
    const bi = Math.min(Math.floor((zi / zones.length) * bandCount), bandCount - 1);
    const bandOff = bandOffsets[bi] || 0;
    const bandW = PROFILE_WIDTHS[finalCfg.profileStack[bi]] || 12;
    drawOrnamentRail(
      root, ornType, railW, totalW, totalH,
      bandOff, bandW, finishColor, finalCfg.carvingCoverage,
    );
  }

  const cornerSize = railW * 0.6;
  const cMid = railW / 2;
  drawCorner(root, cMid, cMid, finalCfg.cornerType, finalCfg.cornerAmplification, cornerSize, finishColor);
  drawCorner(root, totalW - cMid, cMid, finalCfg.cornerType, finalCfg.cornerAmplification, cornerSize, finishColor);
  drawCorner(root, cMid, totalH - cMid, finalCfg.cornerType, finalCfg.cornerAmplification, cornerSize, finishColor);
  drawCorner(root, totalW - cMid, totalH - cMid, finalCfg.cornerType, finalCfg.cornerAmplification, cornerSize, finishColor);

  drawLiner(root, railW, totalW, totalH, finalCfg.liner);

  const linerW = finalCfg.liner !== 'none' ? 10 : 0;
  const placeholderX = railW + linerW;
  const placeholderY = railW + linerW;
  const placeholderW = artW - 2 * linerW;
  const placeholderH = artH - 2 * linerW;
  addRect(root, placeholderX, placeholderY, placeholderW, placeholderH, PAL.galleryWhite, 0.85, 'artwork-placeholder');

  applyAging(root, totalW, totalH, finalCfg.aging, railW);

  figma.currentPage.appendChild(root);
  root.setRelaunchData({ open: 'museum wall & frame generator' });
}

// ─── plugin message handler ──────────────────────────────────────────────────

figma.showUI(__html__, { width: 340, height: 600 });

figma.ui.onmessage = (msg: { type: string; config?: any; height?: number }) => {
  if (msg.type === 'resize' && msg.height) {
    figma.ui.resize(340, Math.min(800, Math.max(400, msg.height)));
    return;
  }
  try {
    if (msg.type === 'generate-background' && msg.config) {
      const raw = msg.config;
      const bgCfg: BgConfig = {
        wallCoveringType: raw.wcType || 'painted',
        paintColor: raw.paintColor ? (PAL[raw.paintColor] || raw.paintColor) : PAL.cream,
        woodType: raw.woodType || 'oak',
        fabricType: raw.fabricType || 'silk',
        wallpaperStyle: raw.wpStyle ? raw.wpStyle.replace(/_/g, ' ') : 'damask',
        wallpaperColor: raw.wpColor ? (PAL[raw.wpColor] || raw.wpColor) : PAL.burgundy,
        lowerWallType: raw.lowerWall || 'beadboard',
        lowerWallColor: raw.lowerWallColor || PAL.ivory,
        dividerType: raw.divider || 'chair rail',
        dividerColor: raw.dividerColor || PAL.ivory,
        baseboardColor: raw.baseboardColor || PAL.ivory,
      };
      generateBackground(bgCfg);
      figma.closePlugin('background generated');
    } else if (msg.type === 'generate-frame' && msg.config) {
      const raw = msg.config;
      const frameCfg: FrameConfig = {
        preset: raw.preset || undefined,
        artworkWidth: raw.artW || 400,
        artworkHeight: raw.artH || 500,
        profileStack: raw.profiles || ['flat', 'ogee', 'fillet'],
        ornamentZones: {
          A: raw.ornaments?.[0] || 'none',
          B: raw.ornaments?.[1] || 'none',
          C: raw.ornaments?.[2] || 'none',
          D: raw.ornaments?.[3] || 'none',
        },
        cornerType: raw.corner || 'plain miter',
        cornerAmplification: raw.cornerAmplification || 1.5,
        finish: raw.finish || 'antique gold',
        liner: raw.liner || 'none',
        aging: raw.aging || 'none',
        railWidthRatio: raw.railWidthRatio || 0.18,
        carvingCoverage: raw.carvingCoverage || 0.5,
        reliefDepth: raw.reliefDepth || 3,
      };
      generateFrame(frameCfg);
      figma.closePlugin('frame generated');
    } else if (msg.type === 'cancel') {
      figma.closePlugin();
    }
  } catch (err: any) {
    figma.notify(`error: ${err.message || err}`, { error: true });
    figma.closePlugin();
  }
};