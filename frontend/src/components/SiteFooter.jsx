import IMJDLogo from '../assets/imjd-logo.png';

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 md:flex-row">
        <div className="text-center md:text-left">
          <div className="text-lg font-bold text-slate-900">PAITECH BY SNTI</div>
          <div className="text-sm text-slate-600">© 2026 Student Academic & Behavioral Assistant</div>
        </div>
        <a
          href="https://imjd.asia"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-sky-700"
        >
          Developed by <img src={IMJDLogo} alt="IMJD" className="h-7 w-auto" />
        </a>
      </div>
    </footer>
  );
}
