type Props = {
  title?: string;
};

export default function ChartBox({ title = "Price Action" }: Props) {
  return (
    <div className="border border-white/5 bg-charcoal/60 p-6">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-mist">
        <span>{title}</span>
        <span>24H</span>
      </div>
      <div className="mt-4 h-48 bg-gradient-to-r from-royal/10 via-electric/10 to-gold/10">
        <div className="h-full w-full bg-[radial-gradient(circle,rgba(59,130,246,0.15)_1px,transparent_1px)] bg-[length:20px_20px]" />
      </div>
      <p className="mt-4 text-sm text-mist">
        Price history chart coming soon
      </p>
    </div>
  );
}
