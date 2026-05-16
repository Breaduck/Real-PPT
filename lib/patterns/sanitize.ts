/**
 * Inline SVG 안전 검증. LLM이 반환한 SVG 문자열에 위험 패턴이 있는지 정규식 검사.
 *
 * 신뢰 모델: 사용자 본인 API 키로 본인 Anthropic/Gemini 계정에서 받은 응답이라
 * 외부 사용자 입력 표면 없음. 그래도 모델 오작동/프롬프트 인젝션 케이스 대비 미니멀 가드.
 */

const DANGEROUS_PATTERNS = [
  /<script\b/i,
  /<iframe\b/i,
  /<object\b/i,
  /<embed\b/i,
  /\bon[a-z]+\s*=/i,   // onerror, onclick, onload 등 모든 이벤트 핸들러
  /\bjavascript:/i,
  /<link\b/i,
  /<meta\b/i,
];

/**
 * 안전하면 입력 문자열 반환, 위험하면 null.
 * <svg ...> 로 시작하지 않으면 null.
 */
export function sanitizeInlineSvg(raw: string | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed.startsWith("<svg")) return null;
  for (const re of DANGEROUS_PATTERNS) {
    if (re.test(trimmed)) return null;
  }
  return trimmed;
}
