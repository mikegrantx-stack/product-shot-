import React, { useState } from 'react';
import UploadBox from './components/UploadBox';
import { generateProductShot } from './services/gemini';
import { UploadedImage, GenerationStatus } from './types';

const ASPECT_RATIOS = [
  { label: 'Square', value: '1:1', icon: 'M4 4h16v16H4z' },
  { label: 'Landscape', value: '16:9', icon: 'M2 5h20v14H2z' },
  { label: 'Portrait', value: '9:16', icon: 'M5 2h14v20H5z' },
  { label: 'Standard', value: '4:3', icon: 'M3 4h18v16H3z' },
  { label: 'Tall', value: '3:4', icon: 'M4 3h16v18H4z' },
];

const App: React.FC = () => {
  const [productImage, setProductImage] = useState<UploadedImage | null>(null);
  const [refImage, setRefImage] = useState<UploadedImage | null>(null);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isFormValid = productImage && refImage && status !== GenerationStatus.LOADING;

  const handleGenerate = async () => {
    if (!productImage || !refImage) return;

    setStatus(GenerationStatus.LOADING);
    setErrorMsg(null);
    setResultUrl(null);

    try {
      const url = await generateProductShot({
        productImage,
        referenceImage: refImage,
        userPrompt: prompt,
        aspectRatio,
      });
      setResultUrl(url);
      setStatus(GenerationStatus.SUCCESS);
    } catch (err: any) {
      console.error("Generation error", err);
      setStatus(GenerationStatus.ERROR);
      setErrorMsg(err.message || "An unexpected error occurred while generating the image.");
    }
  };

  const handleDownload = () => {
    if (resultUrl) {
      const link = document.createElement('a');
      link.href = resultUrl;
      link.download = `up-in-smoke-shot-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark text-brand-cream selection:bg-brand-accent selection:text-brand-dark relative overflow-x-hidden font-body">
      
      {/* Background Logo Layer */}
      <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        {/* 
          NOTE: Replace the src below with your actual logo file path (e.g., "/logo.png" or a URL).
          I am using a text placeholder here since I cannot access your uploaded file directly in the code.
        */}
        <img 
          src="https://placehold.co/1200x1200/021814/062c24?text=Up+In+Smoke" 
          alt="Background Branding" 
          className="w-[120%] max-w-[1000px] object-contain opacity-5 grayscale rotate-[-10deg]"
        />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Panel: Inputs */}
          <div className="w-full lg:w-1/2 flex flex-col gap-8">
            <div className="space-y-2">
              <h2 className="text-5xl font-display uppercase tracking-wider text-white drop-shadow-lg">Up In Smoke <span className="text-brand-accent">Product Shot</span></h2>
              <p className="text-brand-primary font-medium text-lg">Upload your stash and a vibe reference. We'll bake it into a masterpiece.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UploadBox 
                label="1. Product Image" 
                subLabel="Clear shot of your product"
                image={productImage} 
                onImageChange={setProductImage} 
              />
              <UploadBox 
                label="2. Style Reference" 
                subLabel="Mood, lighting, background"
                image={refImage} 
                onImageChange={setRefImage} 
              />
            </div>

            {/* Aspect Ratio Selection */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-brand-accent uppercase tracking-widest font-display">
                3. Aspect Ratio
              </label>
              <div className="grid grid-cols-5 gap-2">
                {ASPECT_RATIOS.map((ratio) => (
                  <button
                    key={ratio.value}
                    onClick={() => setAspectRatio(ratio.value)}
                    className={`
                      flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 gap-2
                      ${aspectRatio === ratio.value 
                        ? 'bg-brand-primary border-brand-accent text-white shadow-lg shadow-brand-accent/20' 
                        : 'bg-brand-panel border-brand-primary/30 text-slate-400 hover:bg-brand-primary/50 hover:border-brand-primary'}
                    `}
                    title={ratio.label}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 opacity-80">
                      <path d={ratio.icon} />
                    </svg>
                    <span className="text-xs font-bold font-display tracking-wider">{ratio.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="prompt" className="text-sm font-bold text-brand-accent uppercase tracking-widest font-display">
                4. Alterations & Details (Optional)
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., 'Make the smoke thicker', 'Add a neon green glow', 'Place it on a moody dark table'..."
                className="w-full h-32 bg-brand-panel border-2 border-brand-primary/30 rounded-xl p-4 text-brand-cream placeholder-slate-500 focus:outline-none focus:border-brand-accent transition-all resize-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!isFormValid}
              className={`
                w-full py-4 rounded-xl font-display uppercase tracking-widest text-xl shadow-xl transition-all duration-300
                flex items-center justify-center gap-3 border-2
                ${isFormValid 
                  ? 'bg-brand-accent border-brand-accent text-brand-dark hover:bg-brand-leaf hover:border-brand-leaf hover:text-brand-dark cursor-pointer transform hover:-translate-y-1' 
                  : 'bg-brand-panel border-brand-panel text-slate-500 cursor-not-allowed'}
              `}
            >
              {status === GenerationStatus.LOADING ? (
                <>
                  <svg className="animate-spin h-6 w-6 text-brand-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3V21M3 12H21m-9-9 9 9-9 9"/>
                  </svg>
                  Generate Shot
                </>
              )}
            </button>
            
            {status === GenerationStatus.ERROR && (
               <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-300 text-sm backdrop-blur-sm">
                 <strong>Error:</strong> {errorMsg}
               </div>
            )}
          </div>

          {/* Right Panel: Result */}
          <div className="w-full lg:w-1/2">
             <div className="h-full flex flex-col gap-2">
                <label className="text-sm font-bold text-brand-accent uppercase tracking-widest font-display">
                  Result
                </label>
                <div className={`
                  flex-1 min-h-[500px] rounded-2xl border-2 border-dashed 
                  flex items-center justify-center relative overflow-hidden
                  transition-all duration-500 backdrop-blur-sm
                  ${resultUrl ? 'border-brand-accent bg-black' : 'border-brand-primary/30 bg-brand-panel/30'}
                `}>
                  
                  {/* Empty State */}
                  {!resultUrl && status !== GenerationStatus.LOADING && (
                    <div className="text-center p-8">
                       <div className="w-20 h-20 mx-auto bg-brand-panel rounded-full flex items-center justify-center mb-4 border border-brand-primary/30">
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary">
                             <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                          </svg>
                       </div>
                       <h3 className="text-xl font-display uppercase tracking-wide text-brand-primary">No image generated yet</h3>
                       <p className="text-slate-400 mt-2 max-w-xs mx-auto">
                         Upload your images and hit generate to see the magic.
                       </p>
                    </div>
                  )}

                  {/* Loading State */}
                  {status === GenerationStatus.LOADING && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-dark/80 backdrop-blur-sm z-10">
                        <div className="w-16 h-16 border-4 border-brand-accent/30 border-t-brand-accent rounded-full animate-spin mb-4"></div>
                        <p className="text-brand-accent font-display uppercase tracking-widest animate-pulse">Processing visuals...</p>
                        <p className="text-xs text-brand-primary mt-2">Analyzing product & reference...</p>
                     </div>
                  )}

                  {/* Result Image */}
                  {resultUrl && (
                    <div className="relative w-full h-full group flex items-center justify-center">
                      <img 
                        src={resultUrl} 
                        alt="Generated Product Shot" 
                        className="max-w-full max-h-full object-contain"
                        style={{ aspectRatio: aspectRatio.replace(':', '/') }}
                      />
                      {/* Overlay actions */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center">
                         <button 
                           onClick={handleDownload}
                           className="bg-brand-accent text-brand-dark hover:bg-white px-8 py-3 rounded-full font-bold shadow-lg transform hover:scale-105 transition-all flex items-center gap-2 font-display uppercase tracking-wide"
                         >
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                             <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>
                           </svg>
                           Download Image
                         </button>
                      </div>
                    </div>
                  )}
                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;