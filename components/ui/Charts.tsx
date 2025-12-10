import React from 'react';
import { ChartDataPoint } from '../../types';

interface ChartProps {
  data: ChartDataPoint[];
  type: 'bar' | 'line' | 'pie';
  title?: string;
}

export const Charts: React.FC<ChartProps> = ({ data, type, title }) => {
  if (!data || data.length === 0) return null;

  // Normalize data for sizing
  const values = data.map(d => d.value);
  const maxVal = Math.max(...values, 1);
  const minVal = Math.min(...values, 0);
  
  const height = 200;
  const width = 500;
  const padding = 40;

  const renderBarChart = () => {
    const barWidth = (width - padding * 2) / data.length;
    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full drop-shadow-lg">
        {data.map((d, i) => {
          const barHeight = (d.value / maxVal) * (height - padding * 2);
          return (
            <g key={i}>
              <rect
                x={padding + i * barWidth + 10}
                y={height - padding - barHeight}
                width={barWidth - 20}
                height={barHeight}
                className="fill-brand-accent/80 hover:fill-brand-accent transition-all duration-300"
                rx="4"
              />
              <text 
                x={padding + i * barWidth + barWidth / 2} 
                y={height - padding + 20} 
                textAnchor="middle" 
                className="text-[10px] fill-slate-500 font-bold"
              >
                {d.label.length > 10 ? d.label.substring(0, 8) + '..' : d.label}
              </text>
              <text 
                x={padding + i * barWidth + barWidth / 2} 
                y={height - padding - barHeight - 10} 
                textAnchor="middle" 
                className="text-[10px] fill-brand-primary font-bold"
              >
                {d.value}
              </text>
            </g>
          );
        })}
        {/* Axes */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#cbd5e1" strokeWidth="2" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#cbd5e1" strokeWidth="2" />
      </svg>
    );
  };

  const renderLineChart = () => {
    const points = data.map((d, i) => {
      const x = padding + (i * ((width - padding * 2) / (data.length - 1)));
      const range = maxVal - minVal || 1;
      const y = height - padding - ((d.value - minVal) / range) * (height - padding * 2);
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full drop-shadow-lg">
        <polyline
          fill="none"
          stroke="#4338ca" 
          strokeWidth="3"
          points={points}
          className="drop-shadow-lg"
        />
        {data.map((d, i) => {
          const x = padding + (i * ((width - padding * 2) / (data.length - 1)));
          const range = maxVal - minVal || 1;
          const y = height - padding - ((d.value - minVal) / range) * (height - padding * 2);
          return (
            <g key={i} className="group">
              <circle cx={x} cy={y} r="5" className="fill-brand-primary stroke-white stroke-2 hover:r-7 transition-all" />
              <text x={x} y={height - 10} textAnchor="middle" className="text-[10px] fill-slate-400">{d.label}</text>
              <text x={x} y={y - 15} textAnchor="middle" className="text-[10px] fill-brand-dark font-bold opacity-0 group-hover:opacity-100 transition-opacity">{d.value}</text>
            </g>
          );
        })}
         {/* Axes */}
         <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#cbd5e1" strokeWidth="2" />
         <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#cbd5e1" strokeWidth="2" />
      </svg>
    );
  };

  const renderPieChart = () => {
    const total = values.reduce((acc, val) => acc + val, 0);
    let cumulativePercent = 0;
    
    // Helper to get coordinates for a slice
    const getCoordinatesForPercent = (percent: number) => {
      const x = Math.cos(2 * Math.PI * percent);
      const y = Math.sin(2 * Math.PI * percent);
      return [x, y];
    };

    return (
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        <svg viewBox="-1 -1 2 2" className="w-48 h-48 -rotate-90 overflow-visible">
          {data.map((d, i) => {
            const startPercent = cumulativePercent;
            const slicePercent = d.value / total;
            cumulativePercent += slicePercent;
            const endPercent = cumulativePercent;

            const [startX, startY] = getCoordinatesForPercent(startPercent);
            const [endX, endY] = getCoordinatesForPercent(endPercent);

            // If it's a full circle
            if (slicePercent >= 0.99) {
              return <circle key={i} cx="0" cy="0" r="1" className="fill-brand-primary" />;
            }

            const largeArcFlag = slicePercent > 0.5 ? 1 : 0;
            const pathData = [
              `M 0 0`,
              `L ${startX} ${startY}`,
              `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              `L 0 0`,
            ].join(' ');

            const colors = ['fill-brand-primary', 'fill-brand-secondary', 'fill-brand-accent', 'fill-indigo-400', 'fill-cyan-400'];

            return (
              <path 
                key={i} 
                d={pathData} 
                className={`${colors[i % colors.length]} hover:opacity-80 transition-opacity cursor-pointer`} 
              />
            );
          })}
        </svg>
        <div className="space-y-2">
            {data.map((d, i) => {
               const colors = ['bg-brand-primary', 'bg-brand-secondary', 'bg-brand-accent', 'bg-indigo-400', 'bg-cyan-400'];
               return (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <span className={`w-3 h-3 rounded-full ${colors[i % colors.length]}`}></span>
                  <span className="font-medium">{d.label}:</span>
                  <span>{d.value}</span>
                </div>
               );
            })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mt-6">
      {title && <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 text-center">{title}</h4>}
      <div className="h-64 flex items-center justify-center w-full">
        {type === 'bar' && renderBarChart()}
        {type === 'line' && renderLineChart()}
        {type === 'pie' && renderPieChart()}
      </div>
    </div>
  );
};