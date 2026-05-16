import type { ChartPattern } from "./types";

/**
 * 차트·다이어그램 35종. 각 패턴은 1280×720 좌표계 SVG 템플릿을 갖고,
 * LLM이 placeholder만 값으로 치환해 슬라이드에 inline SVG로 주입.
 *
 * 템플릿은 골격만 — 데이터 값/라벨/높이/너비/색은 모두 LLM이 채움.
 * 모든 색은 var(--*) CSS 변수를 통해 디자인 시스템 토큰에 자동 매핑됨.
 */

const COL = {
  brand: "var(--colors-brandPrimary, #ff5530)",
  accent: "var(--colors-accent, #0a0a0a)",
  text: "var(--colors-text, #2c2c2c)",
  muted: "var(--colors-textMuted, #757575)",
  hairline: "var(--colors-hairline, #e5e5e5)",
  hairlineSoft: "var(--colors-hairline-soft, #f0f0f0)",
  surface: "var(--colors-surface, #f5f5f5)",
} as const;

export const CHARTS: ChartPattern[] = [
  // ── Bar / Column ─────────────────────────────────────────
  {
    id: "ch-bar-horizontal-ranked",
    category: "chart",
    name: "Horizontal Bar (Ranked)",
    purpose: "카테고리 간 값 비교 — 가장 범용. 1위만 brand color",
    inputSignature: "5~7 categories with numeric value (ranked desc)",
    placeholders: ["LABEL_1..N", "VALUE_1..N", "MAX_VALUE"],
    visualSketch: "Company A ▓▓▓▓▓▓▓▓▓▓ 87%\nCompany B ▓▓▓▓▓▓▓     65%\nCompany C ▓▓▓▓▓       42%",
    tokenHints: ["colors.brandPrimary", "colors.text"],
    svgTemplate: `<svg viewBox="0 0 1152 480" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
  <!-- LLM: replicate this <g> per row, vary y by 60 -->
  <g font-family="Pretendard, sans-serif" font-size="16" fill="${COL.text}">
    <text x="0" y="30">{{LABEL_1}}</text>
    <rect x="200" y="14" width="{{WIDTH_1}}" height="22" rx="4" fill="${COL.brand}"/>
    <text x="{{WIDTH_1_END}}" y="30" font-weight="600">{{VALUE_1}}</text>
  </g>
</svg>`,
  },
  {
    id: "ch-bar-vertical-grouped",
    category: "chart",
    name: "Vertical Grouped Bars",
    purpose: "여러 시리즈를 묶어서 비교 — 분기별 매출 등",
    inputSignature: "3~5 groups × 2~3 series",
    placeholders: ["GROUP_LABEL_*", "SERIES_LABEL_*", "VALUE_*", "MAX_VALUE"],
    visualSketch: "│  ▓▓ ░░\n│  ▓▓ ░░ ▓▓ ░░\n└──────────────",
    tokenHints: ["colors.dataPalette"],
    svgTemplate: `<svg viewBox="0 0 1152 480" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
  <line x1="0" y1="440" x2="1152" y2="440" stroke="${COL.hairline}"/>
  <g font-family="Pretendard, sans-serif" font-size="12" fill="${COL.muted}">
    <!-- repeat groups; each group has 2~3 rect bars side-by-side -->
    <rect x="40" y="{{Y_S1_G1}}" width="36" height="{{H_S1_G1}}" fill="${COL.brand}"/>
    <rect x="80" y="{{Y_S2_G1}}" width="36" height="{{H_S2_G1}}" fill="${COL.muted}"/>
    <text x="78" y="460" text-anchor="middle">{{GROUP_LABEL_1}}</text>
  </g>
</svg>`,
  },
  {
    id: "ch-bar-stacked",
    category: "chart",
    name: "Stacked Bar",
    purpose: "구성 비율 + 총량 동시 표현",
    inputSignature: "categories with multi-segment values that sum to whole",
    placeholders: ["CATEGORY_*", "SEGMENT_VALUE_*", "SEGMENT_LABEL_*"],
    visualSketch: "A ▓▓▓░░░██\nB ▓▓░░░░░░\nC ▓▓▓▓▓▓░░",
    tokenHints: ["colors.dataPalette"],
    svgTemplate: `<svg viewBox="0 0 1152 320" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
  <!-- repeat rows; each row contains stacked rects -->
  <g font-family="Pretendard, sans-serif" font-size="14" fill="${COL.text}">
    <text x="0" y="30">{{CATEGORY_1}}</text>
    <rect x="120" y="14" width="{{SEG_W_1A}}" height="24" fill="${COL.brand}"/>
    <rect x="{{SEG_X_1B}}" y="14" width="{{SEG_W_1B}}" height="24" fill="${COL.accent}"/>
    <rect x="{{SEG_X_1C}}" y="14" width="{{SEG_W_1C}}" height="24" fill="${COL.muted}"/>
  </g>
</svg>`,
  },
  {
    id: "ch-bullet-target",
    category: "chart",
    name: "Bullet Chart (Target vs Actual)",
    purpose: "목표 대비 실적 — McKinsey 스타일",
    inputSignature: "2~4 metrics each with target + actual",
    placeholders: ["METRIC_LABEL_*", "TARGET_*", "ACTUAL_*"],
    visualSketch: "Revenue  ░░░░░░░│░░░ ▓▓▓\nUsers    ░░░░░░░░░│ ▓▓▓▓▓\n          target  ↑ actual",
    tokenHints: ["colors.brandPrimary", "colors.hairline"],
    svgTemplate: `<svg viewBox="0 0 1152 360" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
  <g font-family="Pretendard, sans-serif" font-size="14" fill="${COL.text}">
    <text x="0" y="30">{{METRIC_LABEL_1}}</text>
    <rect x="160" y="20" width="800" height="14" fill="${COL.hairline}"/>
    <rect x="160" y="20" width="{{ACTUAL_W_1}}" height="14" fill="${COL.brand}"/>
    <line x1="{{TARGET_X_1}}" y1="14" x2="{{TARGET_X_1}}" y2="40" stroke="${COL.text}" stroke-width="2"/>
  </g>
</svg>`,
  },

  // ── Line / Area / Trend ──────────────────────────────────
  {
    id: "ch-line-trend",
    category: "chart",
    name: "Line Chart (Trend)",
    purpose: "시간에 따른 변화 추적 — 매출/사용자 추이",
    inputSignature: "5~12 timestamped data points",
    placeholders: ["POINTS (x,y space-separated)", "X_LABELS", "MAX_Y"],
    visualSketch: "      ●\n   ●     ●\n●           ●\n────────────",
    tokenHints: ["colors.brandPrimary"],
    svgTemplate: `<svg viewBox="0 0 1152 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
  <g stroke="${COL.hairlineSoft}" stroke-dasharray="3 3"><line x1="0" y1="100" x2="1152" y2="100"/><line x1="0" y1="200" x2="1152" y2="200"/><line x1="0" y1="300" x2="1152" y2="300"/></g>
  <polyline fill="none" stroke="${COL.brand}" stroke-width="2.5" stroke-linejoin="round" points="{{POINTS}}"/>
  <!-- LLM: add <circle> at each point; last point r=6 -->
</svg>`,
  },
  {
    id: "ch-area-gradient",
    category: "chart",
    name: "Area Chart (Gradient Fill)",
    purpose: "라인 아래 채움 — 누적 볼륨 강조",
    inputSignature: "5~12 timestamped data points",
    placeholders: ["LINE_POINTS", "AREA_PATH", "X_LABELS"],
    visualSketch: "      ╱╲\n     ╱  ╲\n____╱____╲___\nfill below",
    tokenHints: ["colors.brandPrimary"],
    svgTemplate: `<svg viewBox="0 0 1152 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
  <defs><linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="${COL.brand}" stop-opacity="0.35"/><stop offset="100%" stop-color="${COL.brand}" stop-opacity="0"/></linearGradient></defs>
  <path d="{{AREA_PATH}}" fill="url(#areaGrad)"/>
  <polyline fill="none" stroke="${COL.brand}" stroke-width="2.5" points="{{LINE_POINTS}}"/>
</svg>`,
  },
  {
    id: "ch-line-multi-series",
    category: "chart",
    name: "Multi-line Comparison",
    purpose: "2~4 시리즈 동시 비교 — 경쟁사 추이",
    inputSignature: "shared x axis + 2~4 series of y values",
    placeholders: ["SERIES_*_POINTS", "SERIES_*_LABEL"],
    visualSketch: "── line A\n── line B\n── line C",
    tokenHints: ["colors.dataPalette"],
    svgTemplate: `<svg viewBox="0 0 1152 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
  <polyline fill="none" stroke="${COL.brand}" stroke-width="2.5" points="{{SERIES_1_POINTS}}"/>
  <polyline fill="none" stroke="${COL.accent}" stroke-width="2.5" points="{{SERIES_2_POINTS}}"/>
  <polyline fill="none" stroke="${COL.muted}" stroke-width="2.5" stroke-dasharray="4 4" points="{{SERIES_3_POINTS}}"/>
</svg>`,
  },
  {
    id: "ch-sparkline-tile",
    category: "chart",
    name: "Sparkline Tiles",
    purpose: "각 KPI 카드 안 작은 트렌드 라인",
    inputSignature: "3~4 KPIs each with trend points",
    placeholders: ["KPI_LABEL_*", "KPI_VALUE_*", "SPARKLINE_*"],
    visualSketch: "[ 87% ╱╲╱ ] [ 4.2B ╲╱╲ ] [ 3.4× ───╱ ]",
    tokenHints: ["colors.brandPrimary", "borderRadius.md"],
    svgTemplate: `<svg viewBox="0 0 1152 240" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
  <g font-family="Pretendard, sans-serif">
    <rect x="0" y="0" width="360" height="200" rx="16" fill="${COL.surface}"/>
    <text x="24" y="60" font-size="56" font-weight="800" fill="${COL.text}">{{KPI_VALUE_1}}</text>
    <text x="24" y="90" font-size="13" fill="${COL.muted}">{{KPI_LABEL_1}}</text>
    <polyline fill="none" stroke="${COL.brand}" stroke-width="2" points="{{SPARKLINE_1}}"/>
  </g>
</svg>`,
  },
  {
    id: "ch-waterfall",
    category: "chart",
    name: "Waterfall Chart",
    purpose: "증감 단계 시각화 — 재무 분석 필수",
    inputSignature: "starting value + 3~6 deltas + ending value",
    placeholders: ["BAR_LABEL_*", "BAR_VALUE_*", "BAR_SIGN_*"],
    visualSketch: "▓▓▓\n  +↓\n     ▓▓\n       -↓\n          ▓",
    tokenHints: ["colors.brandPrimary", "colors.semantic"],
    svgTemplate: `<svg viewBox="0 0 1152 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
  <line x1="0" y1="380" x2="1152" y2="380" stroke="${COL.hairline}"/>
  <!-- LLM: draw rects positioned so each starts where previous ended -->
  <rect x="40" y="{{Y_1}}" width="120" height="{{H_1}}" fill="${COL.text}"/>
  <rect x="200" y="{{Y_2}}" width="120" height="{{H_2}}" fill="${COL.brand}"/>
</svg>`,
  },

  // ── Pie / Donut / Composition ────────────────────────────
  {
    id: "ch-donut-single",
    category: "chart",
    name: "Donut Chart (single highlight)",
    purpose: "전체 대비 한 부분 강조 — 시장 점유율",
    inputSignature: "primary % + remaining % + label",
    placeholders: ["PERCENT", "LABEL", "DASHARRAY"],
    visualSketch: "  ╭───╮\n ⓪87%│\n  ╰───╯",
    tokenHints: ["colors.brandPrimary", "colors.hairline"],
    svgTemplate: `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style="width:auto;height:100%;max-height:400px">
  <circle cx="200" cy="200" r="140" fill="none" stroke="${COL.hairline}" stroke-width="36"/>
  <circle cx="200" cy="200" r="140" fill="none" stroke="${COL.brand}" stroke-width="36" stroke-dasharray="{{DASHARRAY}}" stroke-dashoffset="0" transform="rotate(-90 200 200)"/>
  <text x="200" y="195" text-anchor="middle" font-family="Pretendard, sans-serif" font-size="56" font-weight="800" fill="${COL.text}">{{PERCENT}}%</text>
  <text x="200" y="230" text-anchor="middle" font-family="Pretendard, sans-serif" font-size="14" fill="${COL.muted}">{{LABEL}}</text>
</svg>`,
  },
  {
    id: "ch-donut-multi",
    category: "chart",
    name: "Donut Chart (multi-segment)",
    purpose: "3~5개 세그먼트 구성 — 매출 채널별",
    inputSignature: "3~5 segments with name + percentage",
    placeholders: ["SEG_*_PERCENT", "SEG_*_LABEL", "SEG_*_DASH", "SEG_*_OFFSET"],
    visualSketch: "  ╭───╮\n ⓪ 4 │\n  ╰───╯",
    tokenHints: ["colors.dataPalette"],
    svgTemplate: `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style="width:auto;height:100%;max-height:400px">
  <circle cx="200" cy="200" r="140" fill="none" stroke="${COL.brand}" stroke-width="36" stroke-dasharray="{{SEG_1_DASH}}" stroke-dashoffset="0" transform="rotate(-90 200 200)"/>
  <circle cx="200" cy="200" r="140" fill="none" stroke="${COL.accent}" stroke-width="36" stroke-dasharray="{{SEG_2_DASH}}" stroke-dashoffset="{{SEG_2_OFFSET}}" transform="rotate(-90 200 200)"/>
  <circle cx="200" cy="200" r="140" fill="none" stroke="${COL.muted}" stroke-width="36" stroke-dasharray="{{SEG_3_DASH}}" stroke-dashoffset="{{SEG_3_OFFSET}}" transform="rotate(-90 200 200)"/>
</svg>`,
  },
  {
    id: "ch-treemap",
    category: "chart",
    name: "Treemap",
    purpose: "계층적 면적 비교 — 포트폴리오/시장 구성",
    inputSignature: "5~10 items with relative size",
    placeholders: ["TILE_X_*", "TILE_Y_*", "TILE_W_*", "TILE_H_*", "TILE_LABEL_*", "TILE_VALUE_*"],
    visualSketch: "┌────────┬───┐\n│   A    │ B │\n│        ├───┤\n├──┬─────┤ C │\n│D │  E  │   │\n└──┴─────┴───┘",
    tokenHints: ["colors.dataPalette"],
    svgTemplate: `<svg viewBox="0 0 1152 480" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
  <rect x="{{TILE_X_1}}" y="{{TILE_Y_1}}" width="{{TILE_W_1}}" height="{{TILE_H_1}}" fill="${COL.brand}"/>
  <text x="{{TILE_LX_1}}" y="{{TILE_LY_1}}" font-family="Pretendard, sans-serif" font-size="16" font-weight="700" fill="${COL.text}">{{TILE_LABEL_1}}</text>
</svg>`,
  },

  // ── Relationship / Distribution ──────────────────────────
  {
    id: "ch-scatter-plot",
    category: "chart",
    name: "Scatter Plot",
    purpose: "두 변수 간 상관관계",
    inputSignature: "10~30 (x, y) points + axis labels",
    placeholders: ["X_LABEL", "Y_LABEL", "POINTS"],
    visualSketch: "     ●●  ●\n  ● ● ● ●\n●●● ●\n────────",
    tokenHints: ["colors.brandPrimary", "colors.hairline"],
    svgTemplate: `<svg viewBox="0 0 1152 480" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
  <g stroke="${COL.hairlineSoft}"><line x1="60" y1="60" x2="60" y2="420"/><line x1="60" y1="420" x2="1100" y2="420"/></g>
  <!-- LLM: <circle cx cy r="5" fill="brand"/> per point -->
  <circle cx="{{X_1}}" cy="{{Y_1}}" r="5" fill="${COL.brand}"/>
</svg>`,
  },
  {
    id: "ch-bubble",
    category: "chart",
    name: "Bubble Chart (3-var)",
    purpose: "3 변수 관계 — x, y, 크기",
    inputSignature: "5~12 bubbles with (x, y, size, label)",
    placeholders: ["BUBBLE_*_X", "BUBBLE_*_Y", "BUBBLE_*_R", "BUBBLE_*_LABEL"],
    visualSketch: "   ◯ ⓪\n ⓪    ⓞ\n   ◯",
    tokenHints: ["colors.brandPrimary"],
    svgTemplate: `<svg viewBox="0 0 1152 480" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
  <circle cx="{{BUBBLE_1_X}}" cy="{{BUBBLE_1_Y}}" r="{{BUBBLE_1_R}}" fill="${COL.brand}" fill-opacity="0.4" stroke="${COL.brand}"/>
  <text x="{{BUBBLE_1_X}}" y="{{BUBBLE_1_Y}}" text-anchor="middle" font-family="Pretendard, sans-serif" font-size="12" fill="${COL.text}">{{BUBBLE_1_LABEL}}</text>
</svg>`,
  },
  {
    id: "ch-venn-2",
    category: "chart",
    name: "Venn Diagram (2 sets)",
    purpose: "두 집합의 교집합 표시",
    inputSignature: "label A + label B + overlap label",
    placeholders: ["LABEL_A", "LABEL_B", "OVERLAP_LABEL"],
    visualSketch: "  (A)( ∩ )(B)",
    tokenHints: ["colors.brandPrimary", "colors.accent"],
    svgTemplate: `<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;max-height:400px">
  <circle cx="220" cy="200" r="140" fill="${COL.brand}" fill-opacity="0.35"/>
  <circle cx="380" cy="200" r="140" fill="${COL.accent}" fill-opacity="0.35"/>
  <g font-family="Pretendard, sans-serif" font-size="16" font-weight="600" fill="${COL.text}">
    <text x="140" y="200" text-anchor="middle">{{LABEL_A}}</text>
    <text x="460" y="200" text-anchor="middle">{{LABEL_B}}</text>
    <text x="300" y="205" text-anchor="middle">{{OVERLAP_LABEL}}</text>
  </g>
</svg>`,
  },

  // ── Process / Flow ───────────────────────────────────────
  {
    id: "ch-funnel",
    category: "chart",
    name: "Funnel",
    purpose: "전환 단계별 감소 — 영업/마케팅 파이프라인",
    inputSignature: "4~6 stages with name + value",
    placeholders: ["STAGE_*_LABEL", "STAGE_*_VALUE", "STAGE_*_WIDTH"],
    visualSketch: "▓▓▓▓▓▓▓▓▓▓\n ▓▓▓▓▓▓▓▓\n  ▓▓▓▓▓▓\n   ▓▓▓▓\n    ▓▓",
    tokenHints: ["colors.brandPrimary"],
    svgTemplate: `<svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
  <!-- LLM: each stage is a trapezoid; widths decrease -->
  <polygon points="0,0 800,0 720,72 80,72" fill="${COL.brand}"/>
  <text x="400" y="48" text-anchor="middle" font-family="Pretendard, sans-serif" font-size="18" font-weight="700" fill="#fff">{{STAGE_1_LABEL}} · {{STAGE_1_VALUE}}</text>
</svg>`,
  },
  {
    id: "ch-flow-chart-simple",
    category: "chart",
    name: "Flow Chart (linear)",
    purpose: "단순한 단계 흐름 — 화살표로 연결",
    inputSignature: "3~5 nodes with label + (optional) decision diamond",
    placeholders: ["NODE_*_LABEL"],
    visualSketch: "[A] → [B] → [C] → [D]",
    tokenHints: ["colors.text", "borderRadius.md"],
    svgTemplate: `<svg viewBox="0 0 1152 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
  <g font-family="Pretendard, sans-serif" font-size="14" fill="${COL.text}">
    <rect x="40" y="60" width="180" height="80" rx="16" fill="${COL.surface}" stroke="${COL.hairline}"/>
    <text x="130" y="105" text-anchor="middle">{{NODE_1_LABEL}}</text>
    <path d="M 220 100 L 280 100" stroke="${COL.text}" marker-end="url(#arr)"/>
    <defs><marker id="arr" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${COL.text}"/></marker></defs>
  </g>
</svg>`,
  },
  {
    id: "ch-sankey-2col",
    category: "chart",
    name: "Sankey (2-column)",
    purpose: "흐름의 양과 방향 동시 표현",
    inputSignature: "2~3 source nodes + 2~3 target nodes + flow weights",
    placeholders: ["SRC_*_LABEL", "TGT_*_LABEL", "FLOW_*"],
    visualSketch: "A ────╲\nB ─────╳───→ X\n       ╲───→ Y",
    tokenHints: ["colors.brandPrimary", "colors.accent"],
    svgTemplate: `<svg viewBox="0 0 1152 480" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
  <rect x="40" y="60" width="40" height="120" fill="${COL.brand}"/>
  <rect x="40" y="200" width="40" height="80" fill="${COL.accent}"/>
  <rect x="1072" y="80" width="40" height="200" fill="${COL.text}"/>
  <path d="M 80 120 C 500 120, 600 180, 1072 180" stroke="${COL.brand}" stroke-width="60" stroke-opacity="0.4" fill="none"/>
</svg>`,
  },

  // ── Strategic frameworks ─────────────────────────────────
  {
    id: "ch-2x2-matrix",
    category: "chart",
    name: "2×2 Matrix / Quadrant",
    purpose: "두 축 기준 포지셔닝 — BCG, 우선순위",
    inputSignature: "x-axis label + y-axis label + items with (x,y,label)",
    placeholders: ["X_AXIS", "Y_AXIS", "Q1_LABEL..Q4_LABEL", "ITEMS"],
    visualSketch: "│ Q2 │ Q1\n├────┼─────\n│ Q3 │ Q4",
    tokenHints: ["colors.brandPrimary", "colors.hairline"],
    svgTemplate: `<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" style="width:auto;height:100%;max-height:600px">
  <line x1="300" y1="40" x2="300" y2="560" stroke="${COL.text}" stroke-width="1.5"/>
  <line x1="40" y1="300" x2="560" y2="300" stroke="${COL.text}" stroke-width="1.5"/>
  <g font-family="Pretendard, sans-serif" font-size="13" fill="${COL.muted}">
    <text x="320" y="50">{{Q1_LABEL}}</text>
    <text x="60" y="50">{{Q2_LABEL}}</text>
    <text x="60" y="555">{{Q3_LABEL}}</text>
    <text x="320" y="555">{{Q4_LABEL}}</text>
  </g>
  <!-- LLM: scatter items as <circle> + <text> -->
</svg>`,
  },
  {
    id: "ch-swot",
    category: "chart",
    name: "SWOT 4-quadrant",
    purpose: "강점/약점/기회/위협 4분할",
    inputSignature: "4 sets of 2~3 bullet items",
    placeholders: ["S_ITEMS", "W_ITEMS", "O_ITEMS", "T_ITEMS"],
    visualSketch: "│ STRENGTHS │ WEAKNESSES\n├───────────┼──────────\n│ OPPORTS   │ THREATS",
    tokenHints: ["colors.dataPalette", "borderRadius.md"],
    svgTemplate: `<svg viewBox="0 0 1152 480" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
  <g>
    <rect x="40"   y="20"  width="540" height="200" rx="16" fill="#10b98115" stroke="${COL.hairline}"/>
    <rect x="600"  y="20"  width="540" height="200" rx="16" fill="#f59e0b15" stroke="${COL.hairline}"/>
    <rect x="40"   y="240" width="540" height="200" rx="16" fill="#3b82f615" stroke="${COL.hairline}"/>
    <rect x="600"  y="240" width="540" height="200" rx="16" fill="#ef444415" stroke="${COL.hairline}"/>
    <g font-family="Pretendard, sans-serif" font-size="11" font-weight="700" fill="${COL.muted}" letter-spacing="2">
      <text x="60"  y="50">STRENGTHS</text>
      <text x="620" y="50">WEAKNESSES</text>
      <text x="60"  y="270">OPPORTUNITIES</text>
      <text x="620" y="270">THREATS</text>
    </g>
  </g>
</svg>`,
  },
  {
    id: "ch-pyramid-3-tier",
    category: "chart",
    name: "Pyramid (3-tier)",
    purpose: "계층 구조 — Maslow, 전략 우선순위",
    inputSignature: "3 tiers with label from bottom to top",
    placeholders: ["TIER_TOP", "TIER_MID", "TIER_BOTTOM"],
    visualSketch: "    ▲\n   ▲ ▲\n  ▲   ▲\n ▲     ▲",
    tokenHints: ["colors.brandPrimary"],
    svgTemplate: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" style="width:auto;height:100%;max-height:600px">
  <polygon points="400,40 540,200 260,200" fill="${COL.brand}"/>
  <polygon points="260,200 540,200 620,360 180,360" fill="${COL.accent}"/>
  <polygon points="180,360 620,360 700,520 100,520" fill="${COL.muted}"/>
  <g text-anchor="middle" font-family="Pretendard, sans-serif" font-size="20" font-weight="700" fill="#fff">
    <text x="400" y="150">{{TIER_TOP}}</text>
    <text x="400" y="290">{{TIER_MID}}</text>
    <text x="400" y="450">{{TIER_BOTTOM}}</text>
  </g>
</svg>`,
  },
  {
    id: "ch-value-chain",
    category: "chart",
    name: "Value Chain",
    purpose: "활동 단계별 가치 흐름 — Porter",
    inputSignature: "4~6 primary activities + support activities",
    placeholders: ["ACTIVITY_*"],
    visualSketch: "[A] [B] [C] [D] [E] ▶",
    tokenHints: ["colors.brand", "colors.hairline"],
    svgTemplate: `<svg viewBox="0 0 1152 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
  <!-- arrow-shape series of pentagonal blocks -->
  <polygon points="0,0 180,0 220,50 180,100 0,100" fill="${COL.surface}" stroke="${COL.hairline}"/>
  <text x="100" y="60" text-anchor="middle" font-family="Pretendard, sans-serif" font-size="14" fill="${COL.text}">{{ACTIVITY_1}}</text>
</svg>`,
  },

  // ── Org / Network ────────────────────────────────────────
  {
    id: "ch-org-chart-3lvl",
    category: "chart",
    name: "Org Chart (3 levels)",
    purpose: "보고 체계 계층도",
    inputSignature: "1 root + 2~4 mid + 3~6 leaf nodes",
    placeholders: ["ROOT_LABEL", "MID_*_LABEL", "LEAF_*_LABEL"],
    visualSketch: "    [Root]\n   /  |   \\\n [A] [B] [C]",
    tokenHints: ["colors.hairline", "borderRadius.md"],
    svgTemplate: `<svg viewBox="0 0 1152 360" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
  <rect x="476" y="20" width="200" height="60" rx="12" fill="${COL.text}"/>
  <text x="576" y="58" text-anchor="middle" font-family="Pretendard, sans-serif" font-size="14" font-weight="700" fill="#fff">{{ROOT_LABEL}}</text>
  <!-- branches + 2nd level -->
  <line x1="576" y1="80" x2="576" y2="120" stroke="${COL.hairline}"/>
  <line x1="200" y1="120" x2="952" y2="120" stroke="${COL.hairline}"/>
</svg>`,
  },
  {
    id: "ch-hub-spoke",
    category: "chart",
    name: "Hub and Spoke",
    purpose: "중심 + 연결 요소들",
    inputSignature: "1 center + 4~7 spokes with label",
    placeholders: ["HUB_LABEL", "SPOKE_*_LABEL"],
    visualSketch: "   ○\n ○ ◉ ○\n   ○",
    tokenHints: ["colors.brandPrimary"],
    svgTemplate: `<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" style="width:auto;height:100%;max-height:600px">
  <circle cx="300" cy="300" r="80" fill="${COL.brand}"/>
  <text x="300" y="305" text-anchor="middle" font-family="Pretendard, sans-serif" font-size="18" font-weight="700" fill="#fff">{{HUB_LABEL}}</text>
  <g stroke="${COL.hairline}">
    <line x1="300" y1="220" x2="300" y2="100"/>
    <line x1="380" y1="300" x2="500" y2="300"/>
    <line x1="300" y1="380" x2="300" y2="500"/>
    <line x1="220" y1="300" x2="100" y2="300"/>
  </g>
</svg>`,
  },
  {
    id: "ch-mindmap-radial",
    category: "chart",
    name: "Radial Mind Map",
    purpose: "중심 아이디어에서 방사형 확장",
    inputSignature: "center idea + 5~8 branches each with 0~3 sub-items",
    placeholders: ["CENTER", "BRANCH_*", "SUB_*_*"],
    visualSketch: "branch ─ center ─ branch\n          │\n        branch",
    tokenHints: ["colors.accent"],
    svgTemplate: `<svg viewBox="0 0 1152 600" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
  <ellipse cx="576" cy="300" rx="110" ry="60" fill="${COL.text}"/>
  <text x="576" y="305" text-anchor="middle" font-family="Pretendard, sans-serif" font-size="16" font-weight="700" fill="#fff">{{CENTER}}</text>
</svg>`,
  },

  // ── Time / Plan ──────────────────────────────────────────
  {
    id: "ch-timeline-events",
    category: "chart",
    name: "Event Timeline (horizontal)",
    purpose: "회사 연혁, 로드맵",
    inputSignature: "5~10 dates with event label",
    placeholders: ["DATE_*", "EVENT_*"],
    visualSketch: "● ───● ─────●────● ─────●\n2018  2020   2022 2024  2026",
    tokenHints: ["colors.brandPrimary", "colors.hairline"],
    svgTemplate: `<svg viewBox="0 0 1152 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
  <line x1="40" y1="100" x2="1112" y2="100" stroke="${COL.hairline}" stroke-width="2"/>
  <g fill="${COL.brand}"><circle cx="80" cy="100" r="8"/><circle cx="280" cy="100" r="8"/><circle cx="540" cy="100" r="8"/></g>
  <g font-family="Pretendard, sans-serif" font-size="12" fill="${COL.muted}" text-anchor="middle">
    <text x="80" y="140">{{DATE_1}}</text><text x="80" y="158" fill="${COL.text}" font-weight="600">{{EVENT_1}}</text>
  </g>
</svg>`,
  },
  {
    id: "ch-gantt-mini",
    category: "chart",
    name: "Mini Gantt",
    purpose: "프로젝트 단계별 기간",
    inputSignature: "3~6 tasks with start week + duration",
    placeholders: ["TASK_*_LABEL", "TASK_*_X", "TASK_*_W"],
    visualSketch: "T1 ▓▓▓▓\nT2     ▓▓▓▓\nT3        ▓▓▓▓▓▓",
    tokenHints: ["colors.brandPrimary"],
    svgTemplate: `<svg viewBox="0 0 1152 320" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
  <g font-family="Pretendard, sans-serif" font-size="14" fill="${COL.text}">
    <text x="0" y="40">{{TASK_1_LABEL}}</text>
    <rect x="{{TASK_1_X}}" y="22" width="{{TASK_1_W}}" height="24" rx="4" fill="${COL.brand}"/>
  </g>
</svg>`,
  },
  {
    id: "ch-roadmap-quarters",
    category: "chart",
    name: "Quarterly Roadmap",
    purpose: "분기별 전략 계획",
    inputSignature: "4 quarters × 2~3 initiatives each",
    placeholders: ["Q_*_LABEL", "INIT_*"],
    visualSketch: "Q1│Q2│Q3│Q4\n──┼──┼──┼──\nA │B │C │D",
    tokenHints: ["colors.dataPalette", "borderRadius.md"],
    svgTemplate: `<svg viewBox="0 0 1152 320" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
  <g><line x1="288" y1="0" x2="288" y2="320" stroke="${COL.hairline}"/><line x1="576" y1="0" x2="576" y2="320" stroke="${COL.hairline}"/><line x1="864" y1="0" x2="864" y2="320" stroke="${COL.hairline}"/></g>
  <g font-family="Pretendard, sans-serif" font-size="13" font-weight="700" letter-spacing="2" fill="${COL.muted}">
    <text x="20" y="30">Q1</text><text x="308" y="30">Q2</text><text x="596" y="30">Q3</text><text x="884" y="30">Q4</text>
  </g>
</svg>`,
  },
  {
    id: "ch-kanban-3col",
    category: "chart",
    name: "Kanban (3 columns)",
    purpose: "To-do / In-progress / Done",
    inputSignature: "items per column",
    placeholders: ["COL_*_TITLE", "CARD_*"],
    visualSketch: "TODO  │ DOING │ DONE\n┌──┐  │ ┌──┐  │ ┌──┐\n└──┘  │ └──┘  │ └──┘",
    tokenHints: ["colors.surface", "borderRadius.md"],
    svgTemplate: `<svg viewBox="0 0 1152 480" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
  <g font-family="Pretendard, sans-serif" font-size="11" font-weight="700" letter-spacing="2" fill="${COL.muted}">
    <text x="40" y="30">TO DO</text><text x="424" y="30">IN PROGRESS</text><text x="808" y="30">DONE</text>
  </g>
  <rect x="40" y="60" width="320" height="60" rx="8" fill="${COL.surface}"/>
  <text x="60" y="95" font-family="Pretendard, sans-serif" font-size="14" fill="${COL.text}">{{CARD_1}}</text>
</svg>`,
  },

  // ── Compare table ────────────────────────────────────────
  {
    id: "ch-compare-table-3col",
    category: "chart",
    name: "Comparison Table (3 columns)",
    purpose: "옵션 A vs B vs C 비교",
    inputSignature: "rows of features × 3 options (✓/✗/value)",
    placeholders: ["FEATURE_*", "VAL_A_*", "VAL_B_*", "VAL_C_*"],
    visualSketch: "         A    B    C\nspeed   ✓    ✓    ✓\nsize    ✗    ✓    ✓\nprice   $    $$   $$$",
    tokenHints: ["colors.hairline", "colors.brandPrimary"],
    svgTemplate: `<svg viewBox="0 0 1152 480" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
  <g font-family="Pretendard, sans-serif" font-size="14" fill="${COL.text}">
    <line x1="0" y1="60" x2="1152" y2="60" stroke="${COL.hairline}"/>
    <text x="0" y="40">Feature</text><text x="480" y="40" font-weight="700">{{COL_A}}</text><text x="720" y="40" font-weight="700">{{COL_B}}</text><text x="960" y="40" font-weight="700">{{COL_C}}</text>
  </g>
</svg>`,
  },
  {
    id: "ch-pricing-table",
    category: "chart",
    name: "Pricing Table",
    purpose: "플랜별 기능 비교 — middle plan highlight",
    inputSignature: "3 plans with price + 4~6 features",
    placeholders: ["PLAN_*_NAME", "PLAN_*_PRICE", "FEATURE_*"],
    visualSketch: "Free   PRO ▓   Team\n  $0    $19    $99",
    tokenHints: ["colors.brandPrimary", "borderRadius.lg"],
    svgTemplate: `<svg viewBox="0 0 1152 480" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
  <rect x="40" y="60" width="320" height="380" rx="16" fill="${COL.surface}"/>
  <rect x="416" y="20" width="320" height="440" rx="16" fill="${COL.brand}"/>
  <rect x="792" y="60" width="320" height="380" rx="16" fill="${COL.surface}"/>
</svg>`,
  },

  // ── Misc / Spatial ───────────────────────────────────────
  {
    id: "ch-heatmap-grid",
    category: "chart",
    name: "Heatmap Grid",
    purpose: "2축 값의 강도 색으로 표현",
    inputSignature: "rows × cols of values (0~1 normalized)",
    placeholders: ["ROW_LABEL_*", "COL_LABEL_*", "CELL_*"],
    visualSketch: "  M T W T F\n1 ░ ▓ █ ▓ ░\n2 ▓ █ █ ▓ ▓\n3 ░ ░ ▓ █ █",
    tokenHints: ["colors.brandPrimary"],
    svgTemplate: `<svg viewBox="0 0 1152 480" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
  <!-- LLM: 5x7 grid of rects, opacity = value -->
  <rect x="80" y="40" width="60" height="60" fill="${COL.brand}" fill-opacity="0.3"/>
  <rect x="160" y="40" width="60" height="60" fill="${COL.brand}" fill-opacity="0.7"/>
</svg>`,
  },
  {
    id: "ch-progress-bar-stack",
    category: "chart",
    name: "Progress Bar Stack",
    purpose: "여러 메트릭의 완료율 — 단순 stat list 대체",
    inputSignature: "3~5 metrics with label + percent",
    placeholders: ["METRIC_*", "PERCENT_*"],
    visualSketch: "A ▓▓▓▓▓▓░░░ 60%\nB ▓▓▓▓▓▓▓▓░ 87%\nC ▓▓▓░░░░░░ 30%",
    tokenHints: ["colors.brandPrimary", "colors.hairline-soft"],
    svgTemplate: `<svg viewBox="0 0 1152 320" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
  <g font-family="Pretendard, sans-serif" font-size="14" fill="${COL.text}">
    <text x="0" y="30">{{METRIC_1}}</text>
    <rect x="160" y="14" width="800" height="14" rx="7" fill="${COL.hairlineSoft}"/>
    <rect x="160" y="14" width="{{BAR_W_1}}" height="14" rx="7" fill="${COL.brand}"/>
    <text x="980" y="30" font-weight="600">{{PERCENT_1}}%</text>
  </g>
</svg>`,
  },
  {
    id: "ch-circular-progress-stack",
    category: "chart",
    name: "Circular Progress Stack",
    purpose: "3개 진행률을 원형 게이지로",
    inputSignature: "3 metrics with label + percent",
    placeholders: ["METRIC_*", "PERCENT_*", "DASH_*"],
    visualSketch: "(87%)  (42%)  (95%)",
    tokenHints: ["colors.brandPrimary", "colors.hairline"],
    svgTemplate: `<svg viewBox="0 0 1152 320" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto">
  <g transform="translate(120 30)">
    <circle cx="100" cy="100" r="80" fill="none" stroke="${COL.hairline}" stroke-width="14"/>
    <circle cx="100" cy="100" r="80" fill="none" stroke="${COL.brand}" stroke-width="14" stroke-dasharray="{{DASH_1}}" transform="rotate(-90 100 100)"/>
    <text x="100" y="108" text-anchor="middle" font-family="Pretendard, sans-serif" font-size="32" font-weight="800" fill="${COL.text}">{{PERCENT_1}}%</text>
  </g>
</svg>`,
  },
  {
    id: "ch-radar-3axis",
    category: "chart",
    name: "Radar Chart (3-5 axes)",
    purpose: "다차원 점수 비교",
    inputSignature: "3~6 axes + 1~2 series of values",
    placeholders: ["AXIS_*_LABEL", "POINTS_*"],
    visualSketch: "    ◇\n   /│\\\n  ▼─┼─▼\n   \\│/\n    ◇",
    tokenHints: ["colors.brandPrimary"],
    svgTemplate: `<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" style="width:auto;height:100%;max-height:600px">
  <g stroke="${COL.hairline}" fill="none">
    <polygon points="300,80 480,200 420,440 180,440 120,200"/>
  </g>
  <polygon points="{{POINTS_1}}" fill="${COL.brand}" fill-opacity="0.35" stroke="${COL.brand}"/>
</svg>`,
  },
];
