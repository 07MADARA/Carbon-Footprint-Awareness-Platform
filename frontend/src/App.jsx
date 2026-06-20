import { useState } from 'react';

// Replace with your live Google Cloud Run Service URL in .env.production
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/calculate';

// SVG Icons
const LeafIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
);

const CarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
);

const UtensilsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
);

const ZapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

const RefreshCcwIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21v-5h5"/></svg>
);


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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, 3));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
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
      setError("Failed to calculate footprint. Is the backend running?");
    } finally {
      setIsLoading(false);
      setStep(4); // Move to dashboard
    }
  };

  const resetForm = () => {
    setResult(null);
    setStep(1);
    setFormData({ transportMiles: 100, dietType: 'Frequently', energyKwh: 300 });
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center items-center mb-8 space-x-4">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors duration-300 ${step >= s ? 'bg-brand-accent text-brand-dark' : 'bg-brand-surface text-gray-500'}`}>
            {s}
          </div>
          {s < 3 && <div className={`w-8 h-1 transition-colors duration-300 ${step > s ? 'bg-brand-accent' : 'bg-brand-surface'}`} />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-dark text-white font-sans flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="flex items-center justify-center mb-8 space-x-2">
          <LeafIcon />
          <h1 className="text-2xl font-bold tracking-tight">EcoScore</h1>
        </div>

        {/* Card */}
        <div className="bg-brand-surface rounded-2xl shadow-2xl p-6 md:p-10 border border-gray-800 transition-opacity duration-500 relative overflow-hidden">
          
          {step < 4 && renderStepIndicator()}

          {/* Form Steps */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <CarIcon />
                <h2 className="text-xl font-semibold mb-2">Transport</h2>
                <p className="text-gray-400 text-sm">How many miles do you drive or fly in a typical month?</p>
              </div>
              <input 
                type="range" 
                min="0" max="2000" step="50"
                value={formData.transportMiles}
                onChange={(e) => handleInputChange('transportMiles', Number(e.target.value))}
                className="w-full accent-brand-accent"
              />
              <div className="text-center text-3xl font-bold text-brand-accent">
                {formData.transportMiles} <span className="text-sm text-gray-400 font-normal">miles</span>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <UtensilsIcon />
                <h2 className="text-xl font-semibold mb-2">Diet</h2>
                <p className="text-gray-400 text-sm">How often do you consume meat or animal products?</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {['Daily', 'Frequently', 'Occasionally', 'Rarely', 'Never'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleInputChange('dietType', option)}
                    className={`p-3 rounded-xl border transition-all duration-300 ${formData.dietType === option ? 'border-brand-accent bg-brand-accent/10 text-brand-accent' : 'border-gray-700 hover:border-gray-500 text-gray-300'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <ZapIcon />
                <h2 className="text-xl font-semibold mb-2">Energy</h2>
                <p className="text-gray-400 text-sm">What is your average monthly electricity usage (kWh)?</p>
              </div>
              <input 
                type="range" 
                min="50" max="1500" step="10"
                value={formData.energyKwh}
                onChange={(e) => handleInputChange('energyKwh', Number(e.target.value))}
                className="w-full accent-brand-accent"
              />
              <div className="text-center text-3xl font-bold text-brand-accent">
                {formData.energyKwh} <span className="text-sm text-gray-400 font-normal">kWh</span>
              </div>
            </div>
          )}

          {/* Result Dashboard */}
          {step === 4 && (
            <div className="space-y-8 animate-fade-in">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-brand-surface border-t-brand-accent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-400 animate-pulse">Analyzing footprint...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <div className="text-red-500 mb-4 font-bold text-xl">Oops!</div>
                  <p className="text-gray-300">{error}</p>
                  <button onClick={resetForm} className="mt-6 text-brand-accent underline">Try Again</button>
                </div>
              ) : result ? (
                <div>
                  <div className="text-center mb-8">
                    <h2 className="text-lg text-gray-400 mb-2">Your Monthly Carbon Footprint</h2>
                    <div className="text-5xl font-bold text-white mb-2">
                      {result.totalFootprint} <span className="text-2xl text-gray-500">kg CO₂</span>
                    </div>
                    {/* Visual Indicator compared to global average ~400kg monthly */}
                    <div className={`text-sm font-semibold py-1 px-3 rounded-full inline-block ${result.totalFootprint < 300 ? 'bg-green-500/20 text-green-400' : result.totalFootprint < 600 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                      {result.totalFootprint < 300 ? 'Excellent - Below Average' : result.totalFootprint < 600 ? 'Average - Room to Improve' : 'High - Action Needed'}
                    </div>
                  </div>

                  <div className="bg-brand-dark rounded-xl p-5 mb-6">
                    <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Emission Breakdown</h3>
                    <div className="space-y-4">
                      {['transport', 'diet', 'energy'].map(cat => (
                        <div key={cat} className="flex items-center">
                          <div className="w-24 capitalize text-sm">{cat}</div>
                          <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden mx-3">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ${cat === result.highestCategory ? 'bg-red-500' : 'bg-brand-accent'}`}
                              style={{ width: `${Math.max(5, (result[cat] / result.totalFootprint) * 100)}%` }}
                            ></div>
                          </div>
                          <div className="w-16 text-right text-sm text-gray-400">{result[cat]} kg</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-brand-accent/10 border border-brand-accent/20 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-brand-accent mb-3 flex items-center">
                      <ZapIcon /> Actionable Tips ({result.highestCategory})
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      {result.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-brand-accent mr-2 mt-1">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-8 text-center">
                    <button onClick={resetForm} className="flex items-center justify-center w-full py-3 bg-gray-800 hover:bg-gray-700 transition-colors rounded-xl font-medium">
                      <RefreshCcwIcon /> Recalculate
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* Navigation Buttons */}
          {step < 4 && (
            <div className="flex justify-between mt-10">
              {step > 1 ? (
                <button onClick={handleBack} className="px-6 py-3 rounded-xl border border-gray-700 hover:bg-gray-800 transition-colors">
                  Back
                </button>
              ) : <div></div>}
              <button 
                onClick={step === 3 ? handleSubmit : handleNext} 
                className="px-6 py-3 rounded-xl bg-brand-accent text-brand-dark font-bold hover:bg-emerald-400 transition-colors flex items-center shadow-lg shadow-brand-accent/20"
              >
                {step === 3 ? 'Calculate' : 'Next'} <span className="ml-2"><ArrowRightIcon /></span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;
