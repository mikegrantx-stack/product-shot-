import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-6 md:px-12 flex items-center justify-between border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          ProShoot <span className="text-indigo-400">AI</span>
        </h1>
      </div>
      <div>
          <a 
            href="https://ai.google.dev/" 
            target="_blank" 
            rel="noreferrer" 
            className="text-xs font-medium text-slate-500 hover:text-indigo-400 transition-colors uppercase tracking-wider"
          >
            Powered by Gemini
          </a>
      </div>
    </header>
  );
};

export default Header;
