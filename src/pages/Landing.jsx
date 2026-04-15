import React from 'react';

export default function Landing({ onStart }) {
  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-8xl font-black tracking-tighter text-slate-900 mb-6">
        Travel<span className="text-blue-600">Wise</span>
      </h1>
      <p className="text-slate-500 font-bold uppercase tracking-widest mb-10">
        Plan • Spend • Visualize
      </p>
      
      <button 
        onClick={onStart}
        className="bg-slate-900 text-white px-12 py-5 rounded-[2.5rem] font-black text-xl hover:scale-110 hover:bg-blue-600 transition-all duration-500 shadow-2xl"
      >
        START PLANNING
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mt-24">
        {['Key Features', 'Why Us?', 'Our Team'].map((title) => (
          <div key={title} className="bento-card text-left">
            <h3 className="font-black text-xl mb-2">{title}</h3>
            <p className="text-slate-500 text-sm">Organize your travel budget with ease and elegance.</p>
          </div>
        ))}
      </div>
    </div>
  );
}