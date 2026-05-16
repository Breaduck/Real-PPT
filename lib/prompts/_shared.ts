/**
 * 모든 design-system 생성/변환 프롬프트가 공유하는 PPT 전용 토큰 사양.
 * Anthropic prompt caching이 동일 prefix를 그대로 캐싱하도록 설계됨.
 * deck7.html 황금 기준에 맞춤.
 */
export const PPT_TOKEN_APPENDIX = `
## PPT 전용 토큰 사양 (모든 출력에 반드시 포함)

이 디자인 시스템은 "1280×720 발표용 슬라이드"에 적용된다. 일반 웹 디자인 시스템과 다음 토큰이 추가되어야 한다:

### slideContainer (필수)
{ "width": 1280, "height": 720, "aspectRatio": "16:9" }
모든 슬라이드는 absolute positioned 1280×720 캔버스. 좌우 padding 64px 통일.

### componentVariants (필수)
- pageNumberFormat: "NN" (예: "01") | "01/30" | "1" | "none" — 보수적 브랜드는 "NN" 권장
- bulletMarker: "•" | "—" | "›" | "/"  — 브랜드 톤에 맞게 (미니멀 브랜드 = "—")
- coverLayout: "split" | "centered" | "asymmetric-left"

### forbiddenPatterns (필수, 3~7개)
브랜드 톤에서 절대 쓰면 안 되는 AI 클리셰 패턴들. 다음과 같은 항목들을 포함하라:
- "카드 좌측 strip(border-left:3px) 또는 상단 한 줄 강조 금지"
- "이탤릭 텍스트 금지"
- "'01 / 05' 슬래시 페이지 번호 금지"
- "5개 이상 텍스트 블릿 금지 (카드 또는 아이콘 리스트로 대체)"
- "3D 차트, 무거운 그림자 금지"
- (브랜드 톤에 따라 1~2개 추가)

### 타이포 스케일 가이드 (1280×720 기준)
- hero(커버): 96–104px / 800 / -2.5~-4px / 1.02~1.05
- display(섹션 챕터): 72–88px / 700~800
- heading(슬라이드 타이틀): 48–54px / 700 / -2px / 1.12
- subheading(서브 헤드): 24–32px / 600~700
- body(본문): 14–18px / 400 / 1.55
- caption(라벨): 11–13px / 500~700 / .04~.06em
- stat(빅 넘버): 88–172px / 800 / -3~-8px

### 컬러 사용 규칙
- brandPrimary는 강조 모먼트(커버, 핵심 stat, 1개 product card)에만 — 일반 텍스트·기본 surface 사용 금지
- 본문은 text (charcoal 계열), 보조는 textMuted (steel 계열)
- dataPalette는 차트 위계: 가장 강한 색 → 약한 색 순서로 5개

### borderRadius 표준
- 모든 버튼·뱃지·pill tab → pill (9999px)
- 카드 → md (16px) 또는 lg (32px, 강조 1개 카드 한정)
`;

/**
 * design.md 원본 출력 포맷 명세. transform-design / getdesign-to-ppt 양쪽에서 공유.
 */
export const PPT_DESIGN_JSON_SCHEMA = `
## 출력 형식 (JSON 만 출력, 마크다운 펜스 없음)

{
  "name": "string — Brand Presentation Design System",
  "brandName": "string",
  "fontFamilies": {
    "heading": "CSS font-family with fallbacks",
    "body": "CSS font-family with fallbacks",
    "mono": "optional"
  },
  "colors": {
    "brandPrimary": "#hex",
    "brandSecondary": "#hex or null",
    "accent": "#hex",
    "background": "#hex",
    "surface": "#hex",
    "surfaceAlt": "#hex",
    "text": "#hex",
    "textMuted": "#hex",
    "textInverse": "#hex",
    "semantic": { "success": "#hex", "warning": "#hex", "error": "#hex", "info": "#hex" },
    "dataPalette": ["#hex","#hex","#hex","#hex","#hex"]
  },
  "typography": {
    "hero": { "fontSize":"px", "fontWeight":number, "lineHeight":decimal, "letterSpacing":"em|px" },
    "display": { ... },
    "heading": { ... },
    "subheading": { ... },
    "body": { ... },
    "caption": { ... },
    "stat": { ... }
  },
  "spacing": {
    "slideMarginX": "64px",
    "slideMarginY": "32px",
    "sectionGap": "px",
    "itemGap": "px"
  },
  "borderRadius": { "sm":"px", "md":"16px", "lg":"32px", "pill":"9999px" },
  "decorations": {
    "signatureElements": ["1~3개 시그니처 데코 묘사"],
    "darkCover": true|false,
    "sectionDividerStyle": "diagonal|solid|gradient|minimal"
  },
  "designPrinciples": ["3~5개"],
  "doNot": ["3~5개"],
  "slideContainer": { "width":1280, "height":720, "aspectRatio":"16:9" },
  "componentVariants": {
    "pageNumberFormat": "NN|01/30|1|none",
    "bulletMarker": "•|—|›|/",
    "coverLayout": "split|centered|asymmetric-left"
  },
  "forbiddenPatterns": ["3~7개"]
}
`;
