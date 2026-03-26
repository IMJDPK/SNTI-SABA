const roleRows = [
  {
    role: 'SNTI Facilitator',
    count: 156,
    description: 'One per tehsil. Delivers assessments in schools.',
  },
  {
    role: 'PAITECH Counsellor',
    count: 100,
    description: 'Handles flagged cases, parent contact, and follow-up.',
  },
  {
    role: 'Education Coordinator',
    count: 44,
    description: 'Liaison between PAITECH and school administration.',
  },
];

const requirements = [
  'Pakistani national',
  'Minimum bachelor degree (personality type science, education, or social sciences preferred)',
  'PECTAA training provided upon hiring',
  'Proficiency in the local language of assigned tehsil',
];

function Careers() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-3xl bg-slate-950 px-8 py-12 text-white">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-sky-200">SNTI Response Team</p>
          <h1 className="text-4xl font-bold !text-white md:text-5xl">Careers</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">
            PAITECH is hiring approximately 300 positions for local youth across all 156 tehsils.
          </p>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="mb-5 text-2xl font-semibold text-slate-900">Open Roles</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Count</th>
                  <th className="px-4 py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                {roleRows.map((row) => (
                  <tr key={row.role} className="border-b border-slate-100">
                    <td className="px-4 py-4 font-semibold text-slate-900">{row.role}</td>
                    <td className="px-4 py-4 text-slate-700">{row.count}</td>
                    <td className="px-4 py-4 text-slate-700">{row.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Requirements</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
              {requirements.map((requirement) => (
                <li key={requirement} className="rounded-xl bg-slate-50 px-3 py-2">{requirement}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Application Form</h2>
            <p className="mt-4 text-sm leading-7 text-slate-700">
              Submit the following details: name, CNIC, district, tehsil, role applied for, education details, resume (PDF), and credentials.
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Submissions are processed through secure PAITECH HR channels.
            </p>
            <button
              type="button"
              className="mt-6 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Apply Through HR Portal
            </button>
          </article>
        </section>
      </div>
    </div>
  );
}

export default Careers;
