import React, { useState } from 'react';
import { Feature } from './types';
import DocumentSummarizer from './components/features/DocumentSummarizer';
import TermInterpreter from './components/features/TermInterpreter';
import DataStoryteller from './components/features/DataStoryteller';
import { NeonMonkey } from './components/ui/NeonMonkey';

const App: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<Feature>(Feature.SUMMARIZER);

  const renderFeature = () => {
    switch (activeFeature) {
      case Feature.SUMMARIZER:
        return <DocumentSummarizer />;
      case Feature.INTERPRETER:
        return <TermInterpreter />;
      case Feature.STORYTELLER:
        return <DataStoryteller />;
      default:
        return <DocumentSummarizer />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-brand-primary selection:text-white flex flex-col overflow-x-hidden">
      
      {/* Background Animation */}
      <NeonMonkey />

      {/* Header */}
      <header className="bg-white/90 border-b border-indigo-100 sticky top-0 z-30 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setActiveFeature(Feature.SUMMARIZER)}>
              <div className="bg-gradient-to-br from-brand-primary to-brand-secondary p-2 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-dark">Interactive Analyst</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm font-semibold text-brand-primary bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
              <span className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse"></span>
              Gemini 2.5
            </div>
          </div>
        </div>
      </header>

      {/* Hero / Navigation */}
      <div className="bg-gradient-to-br from-indigo-900 via-brand-primary to-brand-secondary pt-20 pb-36 shadow-2xl relative overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-7xl font-extrabold mb-6 tracking-tight text-white opacity-0 animate-slide-in-left">
            Data Insights, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-emerald-300">Reimagined.</span>
          </h1>
          <p className="text-lg md:text-2xl text-indigo-100 max-w-2xl mx-auto mb-12 leading-relaxed opacity-0 animate-slide-in-left-delay-1 font-light">
            Summarize reports, decode jargon, and spin stories from raw numbers using advanced AI.
          </p>
          
          <div className="inline-flex p-2 bg-white/10 backdrop-blur-md rounded-2xl space-x-2 border border-white/20 shadow-xl opacity-0 animate-slide-in-left-delay-2">
            <button
              onClick={() => setActiveFeature(Feature.SUMMARIZER)}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeFeature === Feature.SUMMARIZER 
                ? 'bg-white text-brand-primary shadow-lg scale-100' 
                : 'text-indigo-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              Doc Summarizer
            </button>
            <button
              onClick={() => setActiveFeature(Feature.INTERPRETER)}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeFeature === Feature.INTERPRETER 
                ? 'bg-white text-brand-primary shadow-lg scale-100' 
                : 'text-indigo-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              Term Interpreter
            </button>
            <button
              onClick={() => setActiveFeature(Feature.STORYTELLER)}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeFeature === Feature.STORYTELLER 
                ? 'bg-white text-brand-primary shadow-lg scale-100' 
                : 'text-indigo-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              Data Storyteller
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20 flex-grow w-full">
        {renderFeature()}
      </main>

      {/* Info / About Section */}
      <section className="py-24 bg-white/80 backdrop-blur border-t border-slate-100 mt-20 relative overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 opacity-0 animate-slide-in-left">
             <h2 className="text-3xl font-extrabold text-brand-dark mb-4">Why Interactive Data Analyst?</h2>
             <p className="text-slate-500 text-lg max-w-2xl mx-auto font-light">Precision tools designed for the modern financial landscape.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Card 1 */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-brand-primary/30 hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-500 group opacity-0 animate-slide-in-left-delay-1">
              <h3 className="text-xl font-bold text-brand-dark mb-3 group-hover:text-brand-primary transition-colors">Large Document Analysis</h3>
              <p className="text-slate-600 leading-relaxed">
                Utilize Gemini's massive context window to process annual reports and sustainability filings in seconds.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-brand-secondary/30 hover:shadow-2xl hover:shadow-brand-secondary/10 transition-all duration-500 group opacity-0 animate-slide-in-left-delay-1">
              <h3 className="text-xl font-bold text-brand-dark mb-3 group-hover:text-brand-secondary transition-colors">Instant Simplification</h3>
              <p className="text-slate-600 leading-relaxed">
                Our plain-language interpreter turns financial jargon into easy-to-grasp visual analogies.
              </p>
            </div>

             {/* Card 3 */}
             <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-brand-accent/30 hover:shadow-2xl hover:shadow-brand-accent/10 transition-all duration-500 group opacity-0 animate-slide-in-left-delay-2">
              <h3 className="text-xl font-bold text-brand-dark mb-3 group-hover:text-brand-accent transition-colors">Automated Storytelling</h3>
              <p className="text-slate-600 leading-relaxed">
                We automatically generate news-style narratives from your datasets, highlighting trends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 border-t border-slate-100 py-10 relative z-10">
         <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
           <div className="mb-4 md:mb-0">
             <p className="font-bold text-slate-700">The Interactive Data Analyst</p>
             <p className="mt-1">Empowering decisions with AI.</p>
           </div>
           <p>&copy; {new Date().getFullYear()} Built with Gemini API.</p>
         </div>
      </footer>
    </div>
  );
};

export default App;