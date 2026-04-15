export default function GlassButton({ children, onClick, variant = 'primary' }) {
  const styles = {
    primary: 'bg-blue-600 text-white shadow-blue-500/30 hover:bg-blue-700',
    secondary: 'bg-white/20 text-slate-900 border border-white/40 hover:bg-white/40',
    danger: 'bg-red-500 text-white shadow-red-500/20 hover:bg-red-600'
  };

  return (
    <button 
      onClick={onClick}
      className={`${styles[variant]} px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-lg`}
    >
      {children}
    </button>
  );
}