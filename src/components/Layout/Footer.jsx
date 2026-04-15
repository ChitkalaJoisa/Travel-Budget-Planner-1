export default function Footer() {
  return (
    <footer className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center border-t border-slate-200 mt-20 gap-4">
      <div className="flex items-center gap-2 grayscale opacity-50">
        <div className="w-8 h-8 bg-slate-900 rounded-lg" />
        <span className="font-black text-sm tracking-tighter uppercase">TravelWise</span>
      </div>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
        @2026 Travel Budget Planner — UI Wireframe Design
      </p>
      <div className="flex gap-6 text-slate-400 text-xs font-bold uppercase">
        <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
        <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
      </div>
    </footer>
  );
}