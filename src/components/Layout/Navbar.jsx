export default function Navbar({ active, setActive }) {
  const menu = ['dashboard', 'trips', 'expenses', 'reports', 'profile'];
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 glass-panel px-6 py-3 rounded-full flex gap-4">
      {menu.map(m => (
        <button 
          key={m} 
          onClick={() => setActive(m)}
          className={`text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all ${active === m ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          {m}
        </button>
      ))}
    </nav>
  );
}