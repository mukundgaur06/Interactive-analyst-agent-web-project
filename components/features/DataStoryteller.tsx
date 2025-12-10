import React, { useState, useCallback } from 'react';
import { generateDataStory } from '../../services/geminiService';
import { FileInputData, ProcessingState, Tone } from '../../types';
import { Button } from '../ui/Button';
import { ResultCard } from '../ui/ResultCard';

const SAMPLE_CSV = {
  name: "GreenTech_Sales_Q3_2024.csv",
  mimeType: "text/csv",
  base64: "TW9udGgsUmV2ZW51ZV9VU0QsQ2FyYm9uX09mZnNldHNfVG9ucyxTdWJzY3JpcHRpb25fR3Jvd3RoX1BlcmNlbnQKSnVseSwxNTAwMDAsMjAwLDQ1CkF1Z3VzdCwxNDIwMDAsMTg1LDQyClNlcHRlbWJlciwxODkwMDAsMjUwLDYw",
};

const DataStoryteller: React.FC = () => {
  const [file, setFile] = useState<FileInputData | null>(null);
  const [tone, setTone] = useState<Tone>(Tone.NEUTRAL);
  const [state, setState] = useState<ProcessingState>({
    isLoading: false,
    error: null,
    result: null,
  });

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        setFile({
          base64: base64String,
          mimeType: 'text/csv',
          name: selectedFile.name
        });
        setState(prev => ({ ...prev, error: null, result: null }));
      };
      
      reader.onerror = () => {
        setState(prev => ({ ...prev, error: "Failed to read file." }));
      };

      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const handleLoadSample = () => {
    setFile({
      base64: SAMPLE_CSV.base64,
      mimeType: SAMPLE_CSV.mimeType,
      name: SAMPLE_CSV.name
    });
    setState(prev => ({ ...prev, error: null, result: null }));
  };

  const handleGenerate = async () => {
    if (!file) return;

    setState({ isLoading: true, error: null, result: null });

    try {
      const result = await generateDataStory(file.base64, tone);
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
    <div className="max-w-3xl mx-auto space-y-8 animate-slide-in-left">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-extrabold text-brand-dark">Data Storyteller</h2>
        <p className="text-gray-500 text-lg">Convert raw CSV data into a narrative and trend graph.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-indigo-50 space-y-8 transition-all hover:shadow-2xl duration-300 relative">
        {/* Step 1: Upload */}
        <div className="space-y-4 relative z-10">
          <div className="flex justify-between items-center">
             <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">1. Upload CSV Data</label>
             <button 
               onClick={handleLoadSample}
               className="text-xs font-bold text-brand-primary hover:underline transition-colors uppercase tracking-wide"
             >
               Load sample sales data
             </button>
          </div>
          
           <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-white hover:border-brand-secondary transition-all duration-300 group ${file ? 'border-brand-accent bg-emerald-50/30' : 'border-gray-200'}`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {file ? (
                      <>
                        <div className="p-3 bg-emerald-100 rounded-full mb-3">
                           <svg className="w-8 h-8 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <p className="text-sm text-emerald-700 font-bold">{file.name}</p>
                      </>
                    ) : (
                      <>
                        <div className="p-3 bg-indigo-100 rounded-full mb-3 group-hover:bg-brand-secondary group-hover:text-white transition-colors duration-300">
                           <svg className="w-8 h-8 text-brand-primary group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        </div>
                        <p className="text-sm text-slate-500 font-medium"><span className="text-brand-primary font-bold">Click to upload</span> or drag and drop</p>
                      </>
                    )}
                </div>
                <input id="dropzone-file" type="file" className="hidden" accept=".csv" onChange={handleFileChange} />
            </label>
           </div> 
        </div>

        {/* Step 2: Select Tone */}
        <div className="space-y-4 relative z-10">
          <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">2. Select Narrative Tone</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.values(Tone).map((t) => (
              <div 
                key={t}
                onClick={() => setTone(t)}
                className={`cursor-pointer rounded-xl border p-5 text-center transition-all transform duration-200 ${
                  tone === t 
                  ? 'border-brand-primary bg-indigo-50 ring-2 ring-brand-primary shadow-lg -translate-y-1' 
                  : 'border-gray-200 hover:border-indigo-200 hover:bg-slate-50 hover:-translate-y-0.5'
                }`}
              >
                <div className={`font-bold text-lg ${tone === t ? 'text-brand-primary' : 'text-slate-700'}`}>{t}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 relative z-10">
          <Button 
            onClick={handleGenerate} 
            disabled={!file} 
            isLoading={state.isLoading}
            className="w-full py-4 text-lg bg-gradient-to-r from-brand-primary to-brand-secondary border-none"
          >
            Generate Story & Graph
          </Button>
        </div>
      </div>

      <ResultCard 
        title={`${tone} Analysis`} 
        content={state.result?.markdown || null}
        chartData={state.result?.chartData}
        chartType={state.result?.chartType}
        chartTitle={state.result?.chartTitle}
        type="success" 
      />
      {state.error && <ResultCard title="Error" content={state.error} type="error" />}
    </div>
  );
};

export default DataStoryteller;