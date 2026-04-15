import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function BentoStat({ title, value, change, isPositive }) {
  return (
    <div className="bento-card relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        {isPositive ? <ArrowUpRight size={48} /> : <ArrowDownRight size={48} />}
      </div>
      <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-3xl font-black text-slate-900">{value}</h3>
      <p className={`text-xs mt-2 font-bold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
        {change} <span className="text-slate-400 font-medium">vs last trip</span>
      </p>
    </div>
  );
}