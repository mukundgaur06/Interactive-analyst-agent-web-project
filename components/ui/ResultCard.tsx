import React from 'react';
import { ChartDataPoint } from '../../types';
import { Charts } from './Charts';

interface ResultCardProps {
  title: string;
  content: string | null;
  type: 'success' | 'error' | 'neutral';
  chartData?: ChartDataPoint[];
  chartType?: 'bar' | 'line' | 'pie';
  chartTitle?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({ 
  title, 
  content, 
  type,
  chartData,
  chartType = 'bar',
  chartTitle
}) => {
  if (!content) return null;

  const typeStyles = {
    success: "border-brand-accent/30 bg-white shadow-brand-accent/10",
    error: "border-red-200 bg-white text-red-700 shadow-red-100",
    neutral: "border-gray-200 bg-white",
  };

  const iconStyles = {
    success: "text-brand-accent bg-emerald-100",
    error: "text-red-500 bg-red-100",
    neutral: "text-gray-500 bg-gray-100",
  };

  return (
    <div className={`mt-8 rounded-2xl border-2 p-8 shadow-xl ${typeStyles[type]} animate-slide-in-left duration-700`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg ${iconStyles[type]}`}>
          {type === 'success' && (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          )}
          {type === 'error' && (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-900">
          {title}
        </h3>
      </div>
      
      <div className="prose prose-lg prose-indigo max-w-none text-slate-600 whitespace-pre-wrap leading-relaxed font-light mb-8">
        {content}
      </div>

      {chartData && chartData.length > 0 && type === 'success' && (
        <Charts data={chartData} type={chartType} title={chartTitle} />
      )}
    </div>
  );
};