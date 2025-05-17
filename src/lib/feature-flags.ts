export type FeatureFlagName = keyof typeof FEATURE_FLAGS;

export const FEATURE_FLAGS = {
  USER_DEVELOPER_MODE: false
} as const;
