export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-100 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-slate-700 dark:text-neutral-300 lg:flex-row lg:items-center lg:justify-between">
        <p className="uppercase tracking-[0.35em] text-xs text-slate-600 dark:text-neutral-400">
          AfricaPredicts — Pan-African Prediction Exchange
        </p>
        <div className="flex gap-6 text-xs uppercase tracking-[0.25em]">
          <span>© {new Date().getFullYear()}</span>
          <a href="mailto:hello@africapredicts.xyz" className="hover:text-slate-900 dark:hover:text-white">
            Contact
          </a>
          <a
            href="https://rainbowkit.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-900 dark:hover:text-white"
          >
            Wallet Support
          </a>
        </div>
      </div>
    </footer>
  );
}
