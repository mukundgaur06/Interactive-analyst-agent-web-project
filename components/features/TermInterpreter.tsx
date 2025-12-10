import React, { useState } from 'react';
import { interpretTerm } from '../../services/geminiService';
import { ProcessingState } from '../../types';
import { Button } from '../ui/Button';
import { ResultCard } from '../ui/ResultCard';

const SAMPLE_TERMS = [
  "Scope 3 Emissions",
  "EBITDA Margin",
  "Algorithmic Trading",
  "Green Bonds"
];

const TermInterpreter: React.FC = () => {
  const [term, setTerm] = useState('');
  const [state, setState] = useState<ProcessingState>({
    isLoading: false,
    error: null,
    result: null,
  });

  const handleInterpret = async (e?: React.FormEvent, selectedTerm?: string) => {
    if (e) e.preventDefault();
    const termToProcess = selectedTerm || term;
    
    if (!termToProcess.trim()) return;

    if (selectedTerm) setTerm(selectedTerm);

    setState({ isLoading: true, error: null, result: null });

    try {
      const result = await interpretTerm(termToProcess);
      setState({ isLoading: false, error: null, result });
    } catch (err) {
      setState({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : "An unexpected error occurred", 
        result: null 
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-slide-in-left">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-extrabold text-brand-dark">Plain-Language Interpreter</h2>
        <p className="text-gray-500 text-lg">Break down terms into visual analogies and breakdown charts.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-indigo-50 transition-all hover:shadow-2xl duration-500 relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-secondary via-brand-primary to-brand-accent rounded-t-3xl"></div>
        
        <form onSubmit={(e) => handleInterpret(e)} className="space-y-8 mt-4">
          <div className="space-y-3">
            <label htmlFor="term" className="block text-sm font-semibold text-gray-700">Enter a Complex Term</label>
            <div className="relative rounded-md shadow-sm group">
              <input
                type="text"
                id="term"
                className="focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary block w-full pr-12 text-lg border-gray-200 rounded-xl p-5 transition-all group-hover:border-indigo-300"
                placeholder="e.g., Derivative Trading"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Try a sample:</p>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_TERMS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleInterpret(undefined, t)}
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-50 text-brand-primary hover:bg-brand-primary hover:text-white hover:shadow-md transition-all duration-300"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            variant="accent"
            isLoading={state.isLoading}
            disabled={!term.trim()}
            className="w-full py-4 text-lg bg-gradient-to-r from-brand-secondary to-brand-primary border-none"
          >
            Explain & Visualize
          </Button>
        </form>
      </div>

      {state.result && (
        <ResultCard 
          title={`Explanation for: ${term}`} 
          content={state.result.markdown}
          chartData={state.result.chartData}
          chartType={state.result.chartType}
          chartTitle={state.result.chartTitle}
          type="success" 
        />
      )}
      {state.error && <ResultCard title="Error" content={state.error} type="error" />}
    </div>
  );
};

export default TermInterpreter;