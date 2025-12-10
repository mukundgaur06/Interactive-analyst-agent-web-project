import React, { useState, useCallback } from 'react';
import { summarizeDocument } from '../../services/geminiService';
import { FileInputData, ProcessingState } from '../../types';
import { Button } from '../ui/Button';
import { ResultCard } from '../ui/ResultCard';

const SAMPLE_FILE = {
  name: "Acme_Corp_Sustainability_Report_Q3_2024.txt",
  mimeType: "text/plain",
  base64: "Q09ORklERU5USUFMOiBBQ01FIFNVU1RBSU5BQkxFIFNPTFVUSU9OUyAtIFEzIDIwMjQgUkVQT1JUCgpFWEVDVVRJVkUgU1VNTUFSWQpBY21lIFN1c3RhaW5hYmxlIFNvbHV0aW9ucyBpcyBwbGVhc2VkIHRvIHJlcG9ydCBhIHJlY29yZC1icmVha2luZyBRdWFydGVyIDMsIGRyaXZlbiBieSB0aGUgc3VjY2Vzc2Z1bCBsYXVuY2ggb2Ygb3VyICJHcmVlbkdyaWQiIHNtYXJ0IGVuZXJneSBwbGF0Zm9ybS4KCkZJTkFOQ0lBTCBISUdITElHSFRTCi0gTmV0IEluY29tZTogJDQyLjUgTWlsbGlvbiAodXAgMTUlIFlvWSkKLSBSZXZlbnVlOiAkMTI4IE1pbGxpb24KLSBFYXJuaW5ncyBQZXIgU2hhcmUgKEVQUyk6ICQzLjQ1Ci0gUiZEIEV4cGVuZGl0dXJlOiAkMTIgTWlsbGlvbiAoZm9jdXNlZCBvbiBjYXJib24gY2FwdHVyZSB0ZWNoKQoKU1VTVEFJTkFCSUxJVFkgR09BTFMgJiBQUk9HUkVTUwoxLiBDYXJib24gTmV1dHJhbGl0eTogV2UgaGF2ZSByZWR1Y2VkIFNjb3BlIDEgYW5kIDIgZW1pc3Npb25zIGJ5IDE4JSB0aGlzIHllYXIsIHB1dHRpbmcgdXMgb24gdHJhY2sgZm9yIE5ldCBaZXJvIGJ5IDIwMzAuCjIuIFdhdGVyIENvbnNlcnZhdGlvbjogTmV3IGNsb3NlZC1sb29wIGNvb2xpbmcgc3lzdGVtcyBpbiBvdXIgTmV2YWRhIHBsYW50IHNhdmVkIDQgbWlsbGlvbiBnYWxsb25zIG9mIHdhdGVyIGluIFEzLgozLiBXYXN0ZSBSZWR1Y3Rpb246IEFjaGlldmVkIDk1JSBsYW5kZmlsbCBkaXZlcnNpb24gcmF0ZSBhY3Jvc3MgYWxsIG1hbnVmYWN0dXJpbmcgaHVicy4KCk9VVExPT0sKV2UgYW50aWNpcGF0ZSBRNCByZXZlbnVlIHRvIGdyb3cgYnkgYW4gYWRkaXRpb25hbCA1JSBhcyByZWd1bGF0b3J5IGNyZWRpdHMgZm9yIGdyZWVuIG1hbnVmYWN0dXJpbmcgY29tZSBpbnRvIGVmZmVjdC4="
};

const DocumentSummarizer: React.FC = () => {
  const [file, setFile] = useState<FileInputData | null>(null);
  const [prompt, setPrompt] = useState<string>('');
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
          mimeType: selectedFile.type,
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
      base64: SAMPLE_FILE.base64,
      mimeType: SAMPLE_FILE.mimeType,
      name: SAMPLE_FILE.name
    });
    setState(prev => ({ ...prev, error: null, result: null }));
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setState({ isLoading: true, error: null, result: null });

    try {
      const result = await summarizeDocument(file.base64, file.mimeType, prompt);
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
        <h2 className="text-3xl font-extrabold text-brand-dark">Document Summarizer</h2>
        <p className="text-gray-500 text-lg">Upload a corporate PDF and get a summary with a Key Metrics chart.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-indigo-50 space-y-6 relative overflow-hidden">
        {/* File Input Area */}
        <div className="space-y-3">
          <div className="flex justify-between items-center mb-1">
             <label className="block text-sm font-semibold text-gray-700">Upload Document</label>
             <button 
               onClick={handleLoadSample}
               className="text-xs font-bold text-brand-primary hover:text-brand-secondary hover:underline transition-colors uppercase tracking-wide"
             >
               Load sample report
             </button>
          </div>
          
          <div className="group mt-1 flex justify-center px-6 pt-10 pb-10 border-2 border-indigo-100 border-dashed rounded-2xl hover:bg-indigo-50/50 hover:border-brand-primary transition-all duration-300 cursor-pointer relative z-10">
            <div className="space-y-2 text-center">
              <div className="mx-auto h-14 w-14 text-indigo-200 group-hover:text-brand-primary transition-colors duration-300">
                  <svg stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
              </div>
              <div className="flex text-sm text-gray-600 justify-center">
                <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-semibold text-brand-primary hover:text-indigo-900 focus-within:outline-none">
                  <span>Upload a file</span>
                  <input 
                    id="file-upload" 
                    name="file-upload" 
                    type="file" 
                    className="sr-only" 
                    accept=".pdf,application/pdf,.txt,text/plain" 
                    onChange={handleFileChange} 
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
            </div>
          </div>
          {file && (
            <div className="flex items-center justify-between text-sm text-green-700 bg-green-50 p-4 rounded-xl border border-green-200 animate-fade-in-up">
              <div className="flex items-center gap-3">
                <span className="font-semibold">{file.name}</span>
              </div>
              <button onClick={() => setFile(null)} className="text-gray-500 hover:text-red-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          )}
        </div>

        {/* Prompt Input */}
        <div className="space-y-2">
          <label htmlFor="prompt" className="block text-sm font-semibold text-gray-700">Instructions (Optional)</label>
          <textarea
            id="prompt"
            rows={2}
            className="shadow-sm block w-full focus:ring-brand-primary focus:border-brand-primary sm:text-sm border border-gray-200 rounded-xl p-4 resize-none transition-all"
            placeholder="e.g., 'Extract the Q3 net income figure'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <div className="pt-2">
          <Button 
            onClick={handleAnalyze} 
            disabled={!file} 
            isLoading={state.isLoading}
            className="w-full py-4 text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Analyze Document
          </Button>
        </div>
      </div>

      <ResultCard 
        title="Analysis Result" 
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

export default DocumentSummarizer;