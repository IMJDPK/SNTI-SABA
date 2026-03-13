import { Link } from 'react-router-dom';

const dimensions = [
  {
    code: 'E-I',
    title: 'Social Energy',
    description: 'Extraversion and Introversion indicate where a learner restores and spends social energy.',
  },
  {
    code: 'S-N',
    title: 'Information Processing',
    description: 'Sensing and Intuition describe how learners observe facts, patterns, and possibilities.',
  },
  {
    code: 'T-F',
    title: 'Decision Profile',
    description: 'Thinking and Feeling show whether a student prioritizes objective analysis or human context first.',
  },
  {
    code: 'J-P',
    title: 'Structure and Adaptability',
    description: 'Judging and Perceiving reveal preference for planned structure or flexible exploration.',
  },
];

const types = [
  'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
  'ISTP', 'ISFP', 'INFP', 'INTP',
  'ESTP', 'ESFP', 'ENFP', 'ENTP',
  'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ',
];

function SNTIFramework() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 px-4 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-sky-200">The Science</p>
          <h1 className="max-w-4xl text-4xl font-bold !text-white md:text-5xl">SNTI Framework</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-200">
            Self-Neuro Typology Indicator is a locally developed AI-powered psychometric framework based on Jungian typology and neuroscience.
          </p>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-3xl font-bold text-slate-900">The 4 Dichotomies</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {dimensions.map((item) => (
              <article key={item.code} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">{item.code}</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-3 leading-7 text-slate-700">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-12">
        <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-slate-900">The 16 Profiles</h2>
          <p className="mt-3 max-w-4xl leading-7 text-slate-700">
            Each profile combines all four dichotomies. Type reports include strengths, challenges, learning style, career alignment, and teacher guidance notes.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {types.map((type) => (
              <Link
                key={type}
                to={`/personality/${type.toLowerCase()}`}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-semibold text-slate-800 hover:border-sky-300 hover:bg-sky-50"
              >
                {type}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="mx-auto max-w-6xl rounded-3xl border border-amber-200 bg-amber-50 p-8">
          <h2 className="text-3xl font-bold text-slate-900">Methodology</h2>
          <p className="mt-4 max-w-4xl leading-8 text-slate-700">
            Questions are scenario-based, age-appropriate, culturally localized to Pakistani daily life, and bilingual. The framework avoids abstract hypotheticals and focuses on recognizable school, family, and social contexts.
          </p>
        </div>
      </section>
    </div>
  );
}

export default SNTIFramework;
