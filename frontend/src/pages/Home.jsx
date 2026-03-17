import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const featureCards = [
  {
    title: 'SNTI Assessment',
    copy: 'Discover your cognitive profile through structured, age-aware assessment flows.',
    lottie: 'https://assets1.lottiefiles.com/packages/lf20_jcikwtux.json',
  },
  {
    title: 'AI Psychologist',
    copy: 'Chat with SABA for guided support, reflection, and study-focused mental wellbeing.',
    lottie: 'https://assets9.lottiefiles.com/packages/lf20_ydo1amjm.json',
  },
  {
    title: 'Actionable Reports',
    copy: 'Get clear strengths, growth priorities, and profile-backed recommendations.',
    lottie: 'https://assets3.lottiefiles.com/packages/lf20_ikvz7qhc.json',
  },
  {
    title: 'Study Strategies',
    copy: 'Receive practical learning methods matched to your type and context.',
    lottie: 'https://assets8.lottiefiles.com/packages/lf20_49rdyysj.json',
  },
  {
    title: 'Instant Analysis',
    copy: 'Fast scoring and insight delivery with secure session tracking.',
    lottie: 'https://assets2.lottiefiles.com/packages/lf20_2cwDXD.json',
  },
  {
    title: 'Community Support',
    copy: 'Build growth with supportive peer and educator-centered guidance.',
    lottie: 'https://assets7.lottiefiles.com/packages/lf20_obhph3sh.json',
  },
];

const statCards = [
  {
    value: '16',
    label: 'Personality Types',
    description: 'Complete SNTI mapping across four dichotomies.',
    lottie: 'https://assets8.lottiefiles.com/packages/lf20_49rdyysj.json',
  },
  {
    value: '24/7',
    label: 'AI Support',
    description: 'Always-on psychology and learning guidance.',
    lottie: 'https://assets7.lottiefiles.com/packages/lf20_w51pcehl.json',
  },
  {
    value: '∞',
    label: 'Personalized Tips',
    description: 'Unlimited recommendations tuned to your profile.',
    lottie: 'https://assets2.lottiefiles.com/packages/lf20_2cwDXD.json',
  },
];

function LottieIcon({ src, className = 'h-16 w-16' }) {
  return (
    <lottie-player
      src={src}
      background="transparent"
      speed="1"
      loop
      autoplay
      class={className}
    />
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [videoReady, setVideoReady] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const applyPreference = () => setReduceMotion(mediaQuery.matches);

    applyPreference();
    mediaQuery.addEventListener('change', applyPreference);

    return () => mediaQuery.removeEventListener('change', applyPreference);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
        {!reduceMotion && (
          <video
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            onLoadedData={() => setVideoReady(true)}
          >
            <source src="/banner-video.mp4" type="video/mp4" />
          </video>
        )}
        <div className={`absolute inset-0 ${reduceMotion ? 'bg-slate-950/90' : 'bg-slate-950/65'}`} aria-hidden="true" />
        <div className="absolute -top-24 right-[-8rem] h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-[-9rem] left-[-7rem] h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-20">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium text-sky-100 backdrop-blur">
              PAITECH AI-Powered Psychology Platform
            </div>
            <h1 className="mx-auto mb-6 max-w-5xl text-4xl font-bold text-white md:text-6xl lg:text-7xl">
              Meet <span className="text-cyan-300">SABA</span>
            </h1>
            <p className="mx-auto mb-4 max-w-3xl text-xl text-slate-100 md:text-2xl">
              Personality Type Identification (SNTI AI Guidance)
            </p>
            <p className="mx-auto mb-10 max-w-2xl text-base leading-7 text-slate-200 md:text-lg">
              Transformative learning through SNTI assessments, personalized strategy maps, and continuous AI support.
            </p>
            <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={() => navigate('/app')}
                className="rounded-2xl bg-cyan-400 px-8 py-3 text-lg font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Start Free Assessment
              </button>
              <button
                onClick={() => navigate('/psychology-chat')}
                className="rounded-2xl border border-white/40 bg-white/10 px-8 py-3 text-lg font-semibold text-white transition hover:bg-white/20"
              >
                Chat with AI
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-200">
              <span>100% Free Forever</span>
              <span>Instant Results</span>
              <span>Privacy Guaranteed</span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Core Capabilities</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">Everything You Need To Understand Yourself</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((card) => (
              <article key={card.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg">
                <div className="mb-4 inline-flex rounded-2xl bg-sky-50 p-2">
                  <LottieIcon src={card.lottie} className="h-14 w-14" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900">{card.title}</h3>
                <p className="text-sm leading-7 text-slate-600">{card.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Impact</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">Trusted By Students Worldwide</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {statCards.map((stat) => (
              <article key={stat.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center">
                <div className="mx-auto mb-2 w-fit rounded-2xl bg-white p-2 shadow-sm">
                  <LottieIcon src={stat.lottie} className="h-14 w-14" />
                </div>
                <div className="text-4xl font-bold text-sky-700">{stat.value}</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">{stat.label}</div>
                <p className="mt-2 text-sm text-slate-600">{stat.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="cta-soft-animate mb-6 text-3xl font-bold !text-white md:text-4xl">Ready To Discover Yourself?</h2>
          <p className="mb-10 text-lg text-slate-200">
            Join students improving academic outcomes through personality-aligned learning and continuous support.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={() => navigate('/app')}
              className="rounded-2xl bg-cyan-400 px-8 py-3 text-lg font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Take Free Assessment
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="rounded-2xl border border-slate-500 px-8 py-3 text-lg font-semibold text-slate-100 transition hover:bg-slate-800"
            >
              Open Dashboard
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
