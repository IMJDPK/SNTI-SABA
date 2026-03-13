const groups = [
  {
    title: 'For Students',
    points: [
      'AI-personalized learning path',
      'Career guidance aligned to cognitive type',
      'Mental health crisis prevention and early intervention',
      'Clear understanding of strengths, challenges, and learning style',
    ],
  },
  {
    title: 'For Teachers',
    points: [
      'Empowerment as 21st-century coaches',
      'PECTAA certification pathway',
      'Type-aligned behavior and learning plans per student',
      'Reduced guesswork in classroom management',
    ],
  },
  {
    title: 'For Policymakers',
    points: [
      'Real-time predictive dashboards',
      'Data-driven education governance',
      'District and tehsil-level visibility',
      'Evidence base for resource allocation',
    ],
  },
];

function Beneficiaries() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8 rounded-3xl bg-slate-950 px-8 py-12 text-white">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-sky-200">Who Benefits</p>
          <h1 className="text-4xl font-bold !text-white md:text-5xl">Beneficiaries</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">
            PAITECH is built to improve outcomes for students, teachers, and policymakers through one integrated SNTI system.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {groups.map((group) => (
            <article key={group.title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">{group.title}</h2>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
                {group.points.map((point) => (
                  <li key={point} className="rounded-xl bg-slate-50 px-3 py-2">
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}

export default Beneficiaries;
