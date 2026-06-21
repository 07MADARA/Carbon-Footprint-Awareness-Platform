import React, { useState, useCallback, useMemo, Suspense } from 'react';
import { API_URL, STRINGS, DIET_OPTIONS } from './constants';
import ErrorBoundary from './ErrorBoundary';

// Lazy load the Dashboard
const ResultDashboard = React.lazy(() => import('./ResultDashboard'));

const LeafIcon = React.memo(() => (
  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
));

const CarIcon = React.memo(() => (
  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
));

const UtensilsIcon = React.memo(() => (
  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
));

const ZapIcon = React.memo(() => (
  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
));

const ArrowRightIcon = React.memo(() => (
  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
));

function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    transportMiles: 100,
    dietType: 'Frequently',
    energyKwh: 300
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleNext = useCallback(() => setStep(prev => Math.min(prev + 1, 3)), []);
  const handleBack = useCallback(() => setStep(prev => Math.max(prev - 1, 1)), []);

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(STRINGS.NETWORK_ERROR);
    } finally {
      setIsLoading(false);
      setStep(4);
    }
  }, [formData]);

  const resetForm = useCallback(() => {
    setResult(null);
    setStep(1);
    setFormData({ transportMiles: 100, dietType: 'Frequently', energyKwh: 300 });
  }, []);

  const stepIndicator = useMemo(() => (
    <nav aria-label="Progress" className="flex justify-center items-center mb-8 space-x-4">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center">
          <div aria-current={step === s ? "step" : undefined} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors duration-300 ${step >= s ? 'bg-brand-accent text-brand-dark' : 'bg-brand-surface text-gray-500'}`}>
            {s}
          </div>
          {s < 3 && <div className={`w-8 h-1 transition-colors duration-300 ${step > s ? 'bg-brand-accent' : 'bg-brand-surface'}`} />}
        </div>
      ))}
    </nav>
  ), [step]);

  return (
    <main className="min-h-screen bg-brand-dark text-white font-sans flex flex-col items-center justify-center p-4">
      <section className="w-full max-w-xl">
        <header className="flex items-center justify-center mb-8 space-x-2">
          <LeafIcon />
          <h1 className="text-2xl font-bold tracking-tight">{STRINGS.TITLE}</h1>
        </header>

        <article className="bg-brand-surface rounded-2xl shadow-2xl p-6 md:p-10 border border-gray-800 transition-opacity duration-500 relative overflow-hidden">
          
          {step < 4 && stepIndicator}

          {step === 1 && (
            <section aria-labelledby="transport-heading" className="space-y-6 animate-fade-in">
              <div className="text-center">
                <CarIcon />
                <h2 id="transport-heading" className="text-xl font-semibold mb-2">{STRINGS.TRANSPORT_HEADING}</h2>
                <p className="text-gray-400 text-sm">{STRINGS.TRANSPORT_DESC}</p>
              </div>
              <input 
                type="range" 
                min="0" max="2000" step="50"
                value={formData.transportMiles}
                onChange={(e) => handleInputChange('transportMiles', Number(e.target.value))}
                className="w-full accent-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded-lg"
                aria-label="Transport miles"
              />
              <div className="text-center text-3xl font-bold text-brand-accent" aria-live="polite">
                {formData.transportMiles} <span className="text-sm text-gray-400 font-normal">{STRINGS.MILES_UNIT}</span>
              </div>
            </section>
          )}

          {step === 2 && (
            <section aria-labelledby="diet-heading" className="space-y-6 animate-fade-in">
              <div className="text-center">
                <UtensilsIcon />
                <h2 id="diet-heading" className="text-xl font-semibold mb-2">{STRINGS.DIET_HEADING}</h2>
                <p className="text-gray-400 text-sm">{STRINGS.DIET_DESC}</p>
              </div>
              <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Diet frequency">
                {DIET_OPTIONS.map((option) => (
                  <button
                    key={option}
                    role="radio"
                    aria-checked={formData.dietType === option}
                    onClick={() => handleInputChange('dietType', option)}
                    className={`p-3 rounded-xl border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${formData.dietType === option ? 'border-brand-accent bg-brand-accent/10 text-brand-accent' : 'border-gray-700 hover:border-gray-500 text-gray-300'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 3 && (
            <section aria-labelledby="energy-heading" className="space-y-6 animate-fade-in">
              <div className="text-center">
                <ZapIcon />
                <h2 id="energy-heading" className="text-xl font-semibold mb-2">{STRINGS.ENERGY_HEADING}</h2>
                <p className="text-gray-400 text-sm">{STRINGS.ENERGY_DESC}</p>
              </div>
              <input 
                type="range" 
                min="50" max="1500" step="10"
                value={formData.energyKwh}
                onChange={(e) => handleInputChange('energyKwh', Number(e.target.value))}
                className="w-full accent-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded-lg"
                aria-label="Energy kWh"
              />
              <div className="text-center text-3xl font-bold text-brand-accent" aria-live="polite">
                {formData.energyKwh} <span className="text-sm text-gray-400 font-normal">{STRINGS.KWH_UNIT}</span>
              </div>
            </section>
          )}

          {step === 4 && (
            <section aria-label="Results Dashboard" className="space-y-8 animate-fade-in">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12" aria-live="assertive">
                  <div className="w-12 h-12 border-4 border-brand-surface border-t-brand-accent rounded-full animate-spin mb-4" role="status" aria-label="Loading"></div>
                  <p className="text-gray-400 animate-pulse">{STRINGS.LOADING_TEXT}</p>
                </div>
              ) : error ? (
                <div className="text-center py-8" role="alert">
                  <div className="text-red-500 mb-4 font-bold text-xl">{STRINGS.OOPS}</div>
                  <p className="text-gray-300">{error}</p>
                  <button aria-label="Try calculation again" onClick={resetForm} className="mt-6 text-brand-accent underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded">{STRINGS.TRY_AGAIN}</button>
                </div>
              ) : result ? (
                <Suspense fallback={<div className="flex justify-center p-8"><div className="w-8 h-8 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div></div>}>
                  <ResultDashboard result={result} resetForm={resetForm} />
                </Suspense>
              ) : null}
            </section>
          )}

          {step < 4 && (
            <nav className="flex justify-between mt-10" aria-label="Form Navigation">
              {step > 1 ? (
                <button aria-label="Go Back" onClick={handleBack} className="px-6 py-3 rounded-xl border border-gray-700 hover:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent">
                  {STRINGS.BACK}
                </button>
              ) : <div></div>}
              <button 
                aria-label={step === 3 ? "Calculate Footprint" : "Next Step"}
                onClick={step === 3 ? handleSubmit : handleNext} 
                className="px-6 py-3 rounded-xl bg-brand-accent text-brand-dark font-bold hover:bg-emerald-400 transition-colors flex items-center shadow-lg shadow-brand-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
              >
                {step === 3 ? STRINGS.CALCULATE : STRINGS.NEXT} <span className="ml-2" aria-hidden="true"><ArrowRightIcon /></span>
              </button>
            </nav>
          )}

        </article>
      </section>
    </main>
  );
}

export default App;
