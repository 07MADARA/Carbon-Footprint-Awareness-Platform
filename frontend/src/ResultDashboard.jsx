import React from 'react';
import { STRINGS, EMISSION_CATEGORIES } from './constants';

const RefreshCcwIcon = React.memo(() => (
  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21v-5h5"/></svg>
));

const ZapIcon = React.memo(() => (
  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
));

const ResultDashboard = ({ result, resetForm }) => {
  return (
    <div>
      <header className="text-center mb-8">
        <h2 className="text-lg text-gray-400 mb-2">{STRINGS.YOUR_FOOTPRINT}</h2>
        <div className="text-5xl font-bold text-white mb-2" aria-live="polite">
          {result.totalFootprint} <span className="text-2xl text-gray-500">{STRINGS.KG_CO2}</span>
        </div>
        <div className={`text-sm font-semibold py-1 px-3 rounded-full inline-block ${result.totalFootprint < 300 ? 'bg-green-500/20 text-green-400' : result.totalFootprint < 600 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
          {result.totalFootprint < 300 ? STRINGS.EXCELLENT : result.totalFootprint < 600 ? STRINGS.AVERAGE : STRINGS.HIGH}
        </div>
      </header>

      <section className="bg-brand-dark rounded-xl p-5 mb-6" aria-label="Emission Breakdown">
        <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">{STRINGS.EMISSION_BREAKDOWN}</h3>
        <div className="space-y-4">
          {EMISSION_CATEGORIES.map((cat) => (
            <div key={cat} className="flex items-center">
              <div className="w-24 capitalize text-sm">{cat}</div>
              <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden mx-3" role="progressbar" aria-valuenow={(result[cat] / result.totalFootprint) * 100} aria-valuemin="0" aria-valuemax="100">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${cat === result.highestCategory ? 'bg-red-500' : 'bg-brand-accent'}`}
                  style={{ width: `${Math.max(5, (result[cat] / result.totalFootprint) * 100)}%` }}
                ></div>
              </div>
              <div className="w-16 text-right text-sm text-gray-400">{result[cat]} kg</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand-accent/10 border border-brand-accent/20 rounded-xl p-5" aria-label="Actionable Tips">
        <h3 className="text-sm font-semibold text-brand-accent mb-3 flex items-center">
          <ZapIcon /> {STRINGS.ACTIONABLE_TIPS} ({result.highestCategory})
        </h3>
        <ul className="space-y-2 text-sm text-gray-300">
          {result.tips.map((tip, idx) => (
            <li key={idx} className="flex items-start">
              <span className="text-brand-accent mr-2 mt-1" aria-hidden="true">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </section>
      
      <div className="mt-8 text-center">
        <button aria-label="Recalculate footprint" onClick={resetForm} className="flex items-center justify-center w-full py-3 bg-gray-800 hover:bg-gray-700 transition-colors rounded-xl font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent">
          <RefreshCcwIcon /> {STRINGS.RECALCULATE}
        </button>
      </div>
    </div>
  );
};

export default ResultDashboard;
