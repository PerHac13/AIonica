import { FeatureFlagName, FEATURE_FLAGS } from '@/lib/feature-flags';
import { ReactNode } from 'react';

export default function FeatureEnabled({
  feature,
  children
}: {
  feature: FeatureFlagName;
  children: ReactNode;
}) {
  return FEATURE_FLAGS[feature] ? children : null;
}

export function FeatureEnabledWithFallback({
  feature,
  children,
  fallback
}: {
  feature: FeatureFlagName;
  children: ReactNode;
  fallback: ReactNode;
}) {
  return FEATURE_FLAGS[feature] ? children : fallback;
}

export function FeatureEnabledWithFallbackAndClassName({
  feature,
  children,
  fallback,
  className
}: {
  feature: FeatureFlagName;
  children: ReactNode;
  fallback: ReactNode;
  className?: string;
}) {
  return FEATURE_FLAGS[feature] ? (
    <div className={className}>{children}</div>
  ) : (
    <div className={className}>{fallback}</div>
  );
}

export function FeaturePreviewWrapper({
  feature,
  children,
  className = '',
  tooltipText = 'Coming Soon'
}: {
  feature: FeatureFlagName;
  children: ReactNode;
  className?: string;
  tooltipText?: string;
}) {
  const enabled = FEATURE_FLAGS[feature];

  if (enabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={`${className} group relative cursor-not-allowed`}
      title={tooltipText}
    >
      <div className='pointer-events-none opacity-50'>{children}</div>
      <div className='absolute bottom-full z-10 mb-1 hidden rounded bg-black px-2 py-1 text-xs whitespace-nowrap text-white group-hover:block'>
        {tooltipText}
      </div>
    </div>
  );
}
