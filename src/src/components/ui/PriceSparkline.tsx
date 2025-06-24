'use client';

import React from 'react';

interface PriceSparklineProps {
  data: number[];
  className?: string;
  width?: number;
  height?: number;
  color?: string;
  fillColor?: string;
}

export function PriceSparkline({ 
  data, 
  className = '',
  width = 200,
  height = 60,
  color = '#dc2626',
  fillColor = 'rgba(220, 38, 38, 0.1)'
}: PriceSparklineProps) {
  if (!data || data.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width, height }}>
        <span className="text-gray-400 text-sm">No data</span>
      </div>
    );
  }

  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const range = maxValue - minValue;
  
  // If all values are the same, show a flat line
  if (range === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width, height }}>
        <svg width={width} height={height} className="w-full h-full">
          <line
            x1="0"
            y1={height / 2}
            x2={width}
            y2={height / 2}
            stroke={color}
            strokeWidth="2"
          />
        </svg>
      </div>
    );
  }

  // Calculate points for the line
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - minValue) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  // Create area fill points (add bottom corners)
  const areaPoints = `0,${height} ${points} ${width},${height}`;

  // Determine if trend is positive or negative
  const isPositive = data[data.length - 1] >= data[0];
  const trendColor = isPositive ? '#059669' : '#dc2626'; // green for up, red for down
  const trendFillColor = isPositive ? 'rgba(5, 150, 105, 0.1)' : 'rgba(220, 38, 38, 0.1)';

  return (
    <div className={`${className}`} style={{ width, height }}>
      <svg width={width} height={height} className="w-full h-full">
        {/* Area fill */}
        <polygon
          points={areaPoints}
          fill={fillColor || trendFillColor}
          strokeWidth="0"
        />
        
        {/* Price line */}
        <polyline
          points={points}
          fill="none"
          stroke={color || trendColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points (optional - only show for small datasets) */}
        {data.length <= 30 && data.map((value, index) => {
          const x = (index / (data.length - 1)) * width;
          const y = height - ((value - minValue) / range) * height;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="2"
              fill={color || trendColor}
              className="opacity-60"
            />
          );
        })}

        {/* Highlight last point */}
        <circle
          cx={((data.length - 1) / (data.length - 1)) * width}
          cy={height - ((data[data.length - 1] - minValue) / range) * height}
          r="3"
          fill={color || trendColor}
          stroke="white"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

// Simplified version for very small spaces
export function MiniSparkline({ 
  data, 
  className = '',
  positive = true 
}: { 
  data: number[]; 
  className?: string; 
  positive?: boolean; 
}) {
  if (!data || data.length === 0) {
    return <span className="text-gray-400">—</span>;
  }

  const color = positive ? '#059669' : '#dc2626';
  
  return (
    <PriceSparkline
      data={data}
      width={40}
      height={16}
      color={color}
      className={className}
    />
  );
}

// Component for displaying price change with sparkline
export function PriceChangeSparkline({
  currentPrice,
  data,
  change,
  className = ''
}: {
  currentPrice: number;
  data: number[];
  change: number;
  className?: string;
}) {
  const isPositive = change >= 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const arrow = isPositive ? '↗' : '↘';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <PriceSparkline
        data={data}
        width={60}
        height={24}
        color={isPositive ? '#059669' : '#dc2626'}
      />
      <div className="flex flex-col">
        <span className="font-semibold">
          ${currentPrice.toLocaleString()}
        </span>
        <span className={`text-sm ${changeColor}`}>
          {arrow} {Math.abs(change).toFixed(2)}%
        </span>
      </div>
    </div>
  );
} 