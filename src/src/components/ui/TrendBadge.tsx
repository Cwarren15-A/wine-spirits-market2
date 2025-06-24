'use client';

import React from 'react';

interface TrendBadgeProps {
  pct: number;
  size?: 'sm' | 'md' | 'lg';
  showArrow?: boolean;
  className?: string;
}

export function TrendBadge({ 
  pct, 
  size = 'md', 
  showArrow = true, 
  className = '' 
}: TrendBadgeProps) {
  const isPositive = pct >= 0;
  const isFlat = Math.abs(pct) < 0.01;
  
  // Determine color based on percentage change
  let colorClasses = '';
  let bgColorClasses = '';
  let textColorClasses = '';
  
  if (isFlat) {
    colorClasses = 'bg-gray-100 text-gray-700 border-gray-200';
    bgColorClasses = 'bg-gray-100';
    textColorClasses = 'text-gray-700';
  } else if (isPositive) {
    colorClasses = 'bg-green-100 text-green-800 border-green-200';
    bgColorClasses = 'bg-green-100';
    textColorClasses = 'text-green-800';
  } else {
    colorClasses = 'bg-red-100 text-red-800 border-red-200';
    bgColorClasses = 'bg-red-100';
    textColorClasses = 'text-red-800';
  }
  
  // Size classes
  let sizeClasses = '';
  let textSize = '';
  let iconSize = '';
  
  switch (size) {
    case 'sm':
      sizeClasses = 'px-2 py-1';
      textSize = 'text-xs';
      iconSize = 'text-xs';
      break;
    case 'lg':
      sizeClasses = 'px-4 py-2';
      textSize = 'text-base';
      iconSize = 'text-sm';
      break;
    default: // md
      sizeClasses = 'px-3 py-1.5';
      textSize = 'text-sm';
      iconSize = 'text-xs';
      break;
  }
  
  // Arrow/icon based on trend
  let icon = '';
  if (showArrow && !isFlat) {
    icon = isPositive ? '↗' : '↘';
  } else if (isFlat) {
    icon = '→';
  }
  
  // Format percentage
  const formattedPct = formatPercentage(pct);
  
  return (
    <span className={`
      inline-flex items-center gap-1 rounded-full font-semibold border
      ${sizeClasses} ${colorClasses} ${textSize} ${className}
    `}>
      {showArrow && (
        <span className={iconSize}>{icon}</span>
      )}
      {formattedPct}
    </span>
  );
}

// Utility function to format percentage
function formatPercentage(pct: number): string {
  const sign = pct >= 0 ? '+' : '';
  
  if (Math.abs(pct) >= 1000) {
    return `${sign}${(pct / 1000).toFixed(1)}k%`;
  } else if (Math.abs(pct) >= 100) {
    return `${sign}${pct.toFixed(0)}%`;
  } else if (Math.abs(pct) >= 10) {
    return `${sign}${pct.toFixed(1)}%`;
  } else {
    return `${sign}${pct.toFixed(2)}%`;
  }
}

// Preset trend badges for common use cases
export function PerformanceBadge({ 
  pct, 
  label, 
  className = '' 
}: { 
  pct: number; 
  label?: string; 
  className?: string; 
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && (
        <span className="text-sm text-gray-600">{label}:</span>
      )}
      <TrendBadge pct={pct} size="sm" />
    </div>
  );
}

export function LargeTrendBadge({ 
  pct, 
  title, 
  subtitle, 
  className = '' 
}: { 
  pct: number; 
  title: string; 
  subtitle?: string; 
  className?: string; 
}) {
  const isPositive = pct >= 0;
  const colorClass = isPositive ? 'text-green-600' : 'text-red-600';
  
  return (
    <div className={`text-center ${className}`}>
      <div className="text-sm text-gray-600 mb-1">{title}</div>
      <div className={`text-2xl font-bold ${colorClass} flex items-center justify-center gap-1`}>
        <span>{isPositive ? '↗' : '↘'}</span>
        <span>{formatPercentage(pct)}</span>
      </div>
      {subtitle && (
        <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
      )}
    </div>
  );
}

// Risk assessment badge
export function RiskBadge({ 
  level, 
  className = '' 
}: { 
  level: 'low' | 'medium' | 'high'; 
  className?: string; 
}) {
  let colorClasses = '';
  let icon = '';
  
  switch (level) {
    case 'low':
      colorClasses = 'bg-green-100 text-green-800 border-green-200';
      icon = '🟢';
      break;
    case 'medium':
      colorClasses = 'bg-yellow-100 text-yellow-800 border-yellow-200';
      icon = '🟡';
      break;
    case 'high':
      colorClasses = 'bg-red-100 text-red-800 border-red-200';
      icon = '🔴';
      break;
  }
  
  return (
    <span className={`
      inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-semibold border text-sm
      ${colorClasses} ${className}
    `}>
      <span className="text-xs">{icon}</span>
      {level.toUpperCase()} RISK
    </span>
  );
}

// Investment grade badge
export function InvestmentGradeBadge({ 
  grade, 
  className = '' 
}: { 
  grade: 'A' | 'B' | 'C' | 'D'; 
  className?: string; 
}) {
  let colorClasses = '';
  
  switch (grade) {
    case 'A':
      colorClasses = 'bg-emerald-100 text-emerald-800 border-emerald-200';
      break;
    case 'B':
      colorClasses = 'bg-blue-100 text-blue-800 border-blue-200';
      break;
    case 'C':
      colorClasses = 'bg-yellow-100 text-yellow-800 border-yellow-200';
      break;
    case 'D':
      colorClasses = 'bg-red-100 text-red-800 border-red-200';
      break;
  }
  
  return (
    <span className={`
      inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-bold border text-sm
      ${colorClasses} ${className}
    `}>
      💎 GRADE {grade}
    </span>
  );
} 