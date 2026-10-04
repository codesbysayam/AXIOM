/**
 * AXIOM Runtime Configuration
 * Deterministic local simulation mode: zero external API key requirements.
 */

export const AXIOM_RUNTIME_MODE = 'local' as const;

export interface RuntimeConfig {
  mode: typeof AXIOM_RUNTIME_MODE;
  hasLocalStore: boolean;
  deterministicSeed: string;
}

export const CURRENT_RUNTIME_CONFIG: RuntimeConfig = {
  mode: AXIOM_RUNTIME_MODE,
  hasLocalStore: true,
  deterministicSeed: 'axiom-local-2026.04',
};
