import { Link } from 'react-router-dom';

const leaders = [
  {
    name: 'Ali Tahir Zahoor',
    type: 'INFJ',
    role: 'CEO SULNAQ & Project Lead',
    focus: 'Vision, ethics, and human-centered direction',
  },
  {
    name: 'Shafqat Hussain',
    type: 'ENTP',
    role: 'Director & Lead Trainer',
    focus: 'Innovation, adaptability, and field execution',
  },
  {
    name: 'Jawad Khalid Khan',
    type: 'INTJ',
    role: 'CEO IMJD & Technical Architect',
    focus: 'AI engine, architecture, and data security',
  },
  {
    name: 'Dr. Sharjil Ahmad Khan',
    type: 'INFJ',
    role: 'UN Member & Global Overseer',
    focus: 'Global validity and compliance',
  },
];

function About() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 px-4 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-sky-200">PAITECH Consortium</p>
          <h1 className="max-w-4xl text-4xl font-bold !text-white md:text-5xl">About PAITECH</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-200">
            Pakistan AI Tech Platform for child and youth cognitive development, built to deliver equitable and quality education support at scale.
          </p>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Vision</p>
            <p className="mt-4 text-lg leading-8 text-slate-700">
              To provide equitable, high-quality education that integrates advanced technologies and aligns with UN SDG 4 (Quality Education).
            </p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Mission</p>
            <p className="mt-4 text-lg leading-8 text-slate-700">
              To identify, support, and develop every child&apos;s cognitive potential through AI-powered psychometric assessment so no child is left undiagnosed, unsupported, or unguided.
            </p>
          </article>
        </div>
      </section>

      <section className="px-4 pb-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-3xl font-bold text-slate-900">Leadership</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {leaders.map((leader) => (
              <article key={leader.name} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-2xl font-semibold text-slate-900">{leader.name}</h3>
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold tracking-wide text-sky-700">{leader.type}</span>
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">{leader.role}</p>
                <p className="mt-3 text-slate-700">{leader.focus}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="mx-auto max-w-6xl rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">UN SDG 4 Alignment</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Quality Education With Measurable Support</h2>
          <p className="mt-4 max-w-4xl text-slate-700 leading-8">
            PAITECH supports SDG 4 by improving learning equity, early psychological support, and teacher enablement through data-guided interventions across districts and tehsils.
          </p>
          <Link to="/app" className="mt-6 inline-block rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
            Start SNTI Assessment
          </Link>
        </div>
      </section>
    </div>
  );
}

export default About;
