import React from 'react';

// PUBLIC_INTERFACE
export function SkeletonBlock({ className = '', style = {} }) {
  /** Generic skeleton shimmer block for loading states. */
  return <div className={`skeleton ${className}`} style={style} aria-hidden="true" />;
}
