type Props = {
  title?: string;
};

export default function ChartBox({ title = "Price Action" }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-600">
        <span>{title}</span>
        <span>24H</span>
      </div>
      <div className="mt-4 h-48 rounded-xl bg-gradient-to-r from-emerald-50 via-sky-50 to-amber-50">
        <div className="h-full w-full rounded-xl bg-[radial-gradient(circle,rgba(15,118,110,0.15)_1px,transparent_1px)] bg-[length:20px_20px]" />
      </div>
      <p className="mt-4 text-sm text-slate-600">
        Placeholder chart. Integrate oracle feeds or historical data to draw real curves.
      </p>
    </div>
  );
}
