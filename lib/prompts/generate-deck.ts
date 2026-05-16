/**
 * @deprecated 2단계 파이프라인으로 이전됨.
 *   - Stage 1: `select-patterns.ts` (Haiku)
 *   - Stage 2: `synthesize-deck.ts` (Opus)
 * 이 파일은 import 호환을 위해 re-export만 유지.
 */
export { SYNTHESIZE_DECK_SYSTEM as GENERATE_DECK_SYSTEM } from "./synthesize-deck";
export { buildSynthesizeDeckUserMessage as buildGenerateDeckUserMessage } from "./synthesize-deck";
