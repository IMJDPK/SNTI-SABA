import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AGE_GROUPS,
  DEFAULT_FREQUENCY_SCALE,
  JUNIOR_SCALE,
  COGNITIVE_HARMONY_INTRO,
  PERSONALITY_SCALE,
  calculateRiskTier,
  calculateSNTIType,
  getAssessmentTrack,
  getQuestionSet,
} from '../data/sntiQuestionBank.js';
import GoogleSignInButton from '../components/GoogleSignInButton.jsx';
import { isPreviewAuthEnabled } from '../utils/previewAuth.js';

const RISK_STYLES = {
  GREEN: {
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    panel: 'border-emerald-200 bg-emerald-50',
    summary: 'No immediate screening alert was triggered.',
  },
  AMBER: {
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    panel: 'border-amber-200 bg-amber-50',
    summary: 'Follow-up is recommended within 24 hours based on the screening responses.',
  },
  RED: {
    badge: 'bg-rose-100 text-rose-700 border-rose-200',
    panel: 'border-rose-200 bg-rose-50',
    summary: 'Immediate counsellor review is required based on the screening responses.',
  },
};

const DIMENSION_LABELS = {
  EI: ['Extraversion', 'Introversion'],
  SN: ['Sensing', 'Intuition'],
  TF: ['Thinking', 'Feeling'],
  JP: ['Judging', 'Perceiving'],
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const getSessionId = () => `SNTI-${Date.now().toString(36).toUpperCase()}`;

const getScaleOptions = (question, track) => {
  if (question.scale_override) {
    return Object.entries(question.scale_override)
      .map(([value, label]) => ({ value: Number(value), label }))
      .sort((left, right) => left.value - right.value);
  }

  if (track === 'junior' && question.pole_a_trait) {
    return JUNIOR_SCALE;
  }

  if (!question.pole_a_trait) {
    return DEFAULT_FREQUENCY_SCALE;
  }

  return PERSONALITY_SCALE;
};

function MBTIAssessment() {
  const navigate = useNavigate();
  const previewAuthEnabled = isPreviewAuthEnabled();
  const [ageInput, setAgeInput] = useState('');
  const [track, setTrack] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [googleError, setGoogleError] = useState('');
  const [isSavingResult, setIsSavingResult] = useState(false);
  const [isGoogleLinked, setIsGoogleLinked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const userData = localStorage.getItem('snti_user');
    if (!token || !userData) {
      navigate('/login', { replace: true });
      return;
    }

    const refreshGoogleState = () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('snti_user') || '{}');
        setIsGoogleLinked(storedUser.provider === 'google' && Boolean(localStorage.getItem('userToken')));
      } catch {
        setIsGoogleLinked(false);
      }
    };

    refreshGoogleState();
    window.addEventListener('storage', refreshGoogleState);

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      window.removeEventListener('storage', refreshGoogleState);
    };
  }, [navigate]);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('snti_user') || '{}');
    } catch {
      return {};
    }
  }, []);

  const { personalityQuestions, harmonyScreeningQuestions, allQuestions } = useMemo(
    () => (track ? getQuestionSet(track) : { personalityQuestions: [], harmonyScreeningQuestions: [], allQuestions: [] }),
    [track]
  );

  const currentQuestion = allQuestions[currentQuestionIndex];
  const isHarmonySection = currentQuestionIndex >= personalityQuestions.length;
  const progressPercentage = allQuestions.length
    ? Math.round(((currentQuestionIndex + 1) / allQuestions.length) * 100)
    : 0;
  const activeAgeGroup = AGE_GROUPS.find((group) => group.key === track);
  const canContinue = currentQuestion ? answers[currentQuestion.id] !== undefined : false;

  const handleStartAssessment = () => {
    const parsedAge = Number(ageInput);
    const nextTrack = getAssessmentTrack(parsedAge);

    if (!Number.isInteger(parsedAge) || parsedAge < 8) {
      setErrorMessage('This SNTI flow is currently configured for ages 8 and above.');
      return;
    }

    if (!nextTrack) {
      setErrorMessage('Unable to determine the correct assessment bank for this age.');
      return;
    }

    setErrorMessage('');
    setTrack(nextTrack);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResults(null);
  };

  const handleAnswer = (questionId, value) => {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: value,
    }));
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((index) => index - 1);
    }
  };

  const finishAssessment = () => {
    const typeResult = calculateSNTIType(answers, personalityQuestions);
    const riskResult = calculateRiskTier(answers);
    const sessionId = getSessionId();
    const timestamp = new Date().toISOString();

    const sessionRecord = {
      sessionId,
      userName: user.name || 'Guest User',
      userInfo: user,
      mbtiType: typeResult.type,
      personalityType: typeResult.type,
      type: typeResult.type,
      age: Number(ageInput),
      track,
      riskTier: riskResult.tier,
      borderlines: typeResult.borderlines,
      dimensionScores: typeResult.dimensionScores,
      traitScores: typeResult.traitScores,
      mentalHealth: riskResult,
      answers,
      date: timestamp,
      testType: 'SNTI Assessment',
    };

    localStorage.setItem('snti_test_session', JSON.stringify(sessionRecord));

    const sessions = JSON.parse(localStorage.getItem('snti_test_sessions') || '[]');
    sessions.push(sessionRecord);
    localStorage.setItem('snti_test_sessions', JSON.stringify(sessions));

    setResults(sessionRecord);
  };

  const handleNext = () => {
    if (currentQuestionIndex === allQuestions.length - 1) {
      finishAssessment();
      return;
    }

    setCurrentQuestionIndex((index) => index + 1);
  };

  const handleRetake = () => {
    setTrack(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResults(null);
    setErrorMessage('');
    setIsSpeaking(false);
  };

  const readQuestionAloud = () => {
    if (!currentQuestion || track !== 'junior' || !('speechSynthesis' in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentQuestion.tts_prompt || currentQuestion.question);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const persistAssessmentToBackend = async (assessmentRecord) => {
    if (previewAuthEnabled) {
      return null;
    }

    const token = localStorage.getItem('userToken');
    if (!token) throw new Error('Google sign-in is required to save this result.');

    const response = await fetch(`${API_URL}/api/assessment/result`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        mbtiType: assessmentRecord.mbtiType,
        track: assessmentRecord.track,
        age: assessmentRecord.age,
        riskTier: assessmentRecord.riskTier,
        dimensionScores: assessmentRecord.dimensionScores,
        traitScores: assessmentRecord.traitScores,
        borderlines: assessmentRecord.borderlines,
        mentalHealth: assessmentRecord.mentalHealth,
        source: 'SNTI Assessment',
      }),
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Failed to save assessment result');
    return data.assessment;
  };

  const handleContinueToGuidanceChat = async () => {
    if (previewAuthEnabled) {
      navigate('/personality-chat');
      return;
    }

    try {
      setGoogleError('');
      setIsSavingResult(true);
      await persistAssessmentToBackend(results);
      navigate('/personality-chat');
    } catch (err) {
      setGoogleError(err.message || 'Unable to continue. Please try again.');
    } finally {
      setIsSavingResult(false);
    }
  };

  const handleGoogleSuccess = async () => {
    try {
      setGoogleError('');
      setIsGoogleLinked(true);
      setIsSavingResult(true);
      await persistAssessmentToBackend(results);
      navigate('/personality-chat');
    } catch (err) {
      setGoogleError(err.message || 'Google sign-in succeeded but saving failed. Please retry.');
    } finally {
      setIsSavingResult(false);
    }
  };

  if (results) {
    const riskStyle = RISK_STYLES[results.riskTier] || RISK_STYLES.GREEN;

    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 px-8 py-10 text-white shadow-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-sky-200">PAITECH SNTI Result</p>
            <h1 className="mb-2 text-4xl font-bold text-white">{results.mbtiType}</h1>
            <p className="max-w-2xl text-lg text-slate-200">
              Assessment complete for the {activeAgeGroup?.label || 'selected'} track. The full SNTI personality profile is ready.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-sky-100">Age {results.age}</span>
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-sky-100">{personalityQuestions.length} personality items</span>
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-sky-100">{harmonyScreeningQuestions.length} wellbeing items</span>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="mb-1 text-2xl font-semibold text-slate-900">Dimension summary</h2>
                  <p className="text-sm text-slate-600">Borderline dimensions are flagged where the score difference stays within +/-3.</p>
                </div>
                <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">Session {results.sessionId}</span>
              </div>

              <div className="space-y-4">
                {Object.entries(results.dimensionScores).map(([dimension, score]) => {
                  const [leftLabel, rightLabel] = DIMENSION_LABELS[dimension];
                  const isBorderline = results.borderlines.includes(dimension);
                  const selectedLabel = score >= 0 ? leftLabel : rightLabel;

                  return (
                    <div key={dimension} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{dimension}</span>
                        {isBorderline && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-amber-700">Borderline</span>}
                      </div>
                      <div className="flex items-center justify-between gap-4 text-sm font-medium text-slate-700">
                        <span>{leftLabel}</span>
                        <span>{rightLabel}</span>
                      </div>
                      <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400"
                          style={{ width: `${Math.min(100, Math.max(8, ((Math.abs(score) + 3) / 23) * 100))}%` }}
                        />
                      </div>
                      <p className="mt-3 text-sm text-slate-600">
                        Preference: <span className="font-semibold text-slate-900">{selectedLabel}</span> ({score > 0 ? '+' : ''}{score})
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6">
              <div className={`rounded-[1.75rem] border p-6 ${riskStyle.panel}`}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold text-slate-900">Wellbeing Screen</h2>
                  <span className={`rounded-full border px-3 py-1 text-sm font-semibold ${riskStyle.badge}`}>{results.riskTier}</span>
                </div>
                <p className="text-sm text-slate-700">{riskStyle.summary}</p>
                <p className="mt-3 text-sm text-slate-700">
                  Weighted score: <span className="font-semibold text-slate-900">{results.mentalHealth.totalWeightedScore}</span>
                </p>
                {results.mentalHealth.triggers.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {results.mentalHealth.triggers.slice(0, 4).map((trigger) => (
                      <div key={trigger.questionId} className="rounded-xl bg-white/70 px-3 py-2 text-sm text-slate-700">
                        {trigger.questionId}: {trigger.severity.toLowerCase()} threshold met
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-3 text-xl font-semibold text-slate-900">Next step</h2>
                <p className="mb-5 text-sm leading-6 text-slate-600">
                  The personality report is available now. If you want to review the assessment again, you can restart from the age gateway.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate(`/personality/${results.mbtiType.toLowerCase()}`)}
                    className="w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Open Personality Profile
                  </button>

                  {previewAuthEnabled || isGoogleLinked ? (
                    <div className="space-y-3">
                      {previewAuthEnabled && (
                        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                          Testing mode is active. Google sign-in and backend result sync are temporarily bypassed.
                        </p>
                      )}
                      <button
                        onClick={handleContinueToGuidanceChat}
                        disabled={isSavingResult}
                        className="w-full rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSavingResult ? 'Saving and opening chat...' : 'Continue to AI Guidance Chat'}
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="mb-3 text-sm text-slate-700">
                        Google sign-in is required before post-assessment AI guidance chat. Once signed in, your MBTI result is saved and loaded automatically.
                      </p>
                      <GoogleSignInButton
                        onSuccess={handleGoogleSuccess}
                        onError={(message) => setGoogleError(message)}
                        text="signin_with"
                      />
                    </div>
                  )}

                  {googleError && (
                    <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{googleError}</p>
                  )}

                  <button
                    onClick={handleRetake}
                    className="w-full rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    Retake Assessment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.15),_transparent_45%),linear-gradient(180deg,#f8fbff_0%,#eef5fb_100%)] px-4 py-10">
        <div className="mx-auto max-w-6xl space-y-8">
          <section className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl">
            <div className="grid gap-8 px-8 py-10 md:grid-cols-[1.3fr_0.7fr] md:px-10 md:py-12">
              <div>
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-sky-200">Pakistan AI Tech Platform</p>
                <h1 className="mb-5 max-w-3xl text-4xl font-bold text-white md:text-5xl">SNTI Assessment Gateway</h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-200">
                  The full PAITECH assessment now routes by age, uses the corrected 5-point SNTI scoring model, and ends with the 20-question wellbeing screen for all users.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">Current user</p>
                <h2 className="text-2xl font-semibold text-white">{user.name || 'Guest User'}</h2>
                <p className="mt-2 text-sm text-slate-300">Enter the participant age to load the correct question bank.</p>
                <label className="mt-6 block text-sm font-medium text-slate-200" htmlFor="age-input">Age</label>
                <input
                  id="age-input"
                  type="number"
                  min="8"
                  value={ageInput}
                  onChange={(event) => setAgeInput(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-lg text-white outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white/15"
                  placeholder="Enter age"
                />
                {errorMessage && <p className="mt-3 text-sm font-medium text-rose-300">{errorMessage}</p>}
                <button
                  onClick={handleStartAssessment}
                  className="mt-5 w-full rounded-2xl bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
                >
                  Start SNTI Assessment
                </button>
              </div>
            </div>
          </section>

          <section className="grid gap-5 md:grid-cols-3">
            {AGE_GROUPS.map((group) => (
              <div key={group.key} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Ages {group.ageRange}</p>
                <h2 className="mb-3 text-2xl font-semibold text-slate-900">{group.label}</h2>
                <p className="mb-5 text-sm leading-6 text-slate-600">{group.description}</p>
                <div className="space-y-2 text-sm text-slate-700">
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
                    <span>Personality questions</span>
                    <span className="font-semibold">{group.personalityQuestionCount}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
                    <span>Wellbeing questions</span>
                    <span className="font-semibold">20</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
                    <span>Estimated time</span>
                    <span className="font-semibold">{group.estimatedTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  const scaleOptions = getScaleOptions(currentQuestion, track);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl">
          <div className="grid gap-6 px-8 py-8 md:grid-cols-[1.1fr_0.9fr] md:px-10">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-sky-200">
                {activeAgeGroup?.label} · Question {currentQuestionIndex + 1} of {allQuestions.length}
              </p>
              <h1 className="mb-3 text-3xl font-bold text-white md:text-4xl">
                {isHarmonySection ? 'Wellbeing screening' : 'SNTI personality assessment'}
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-200">
                {isHarmonySection
                  ? COGNITIVE_HARMONY_INTRO
                  : 'Choose the point on the scale that best reflects which side fits you more strongly.'}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="mb-3 flex items-center justify-between text-sm text-slate-200">
                <span>Progress</span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 transition-all" style={{ width: `${progressPercentage}%` }} />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-200">
                <div className="rounded-2xl bg-white/5 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Track</p>
                  <p className="mt-1 font-semibold text-white">{activeAgeGroup?.ageRange}</p>
                </div>
                <div className="rounded-2xl bg-white/5 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Section</p>
                  <p className="mt-1 font-semibold text-white">{isHarmonySection ? 'Wellbeing' : 'Personality'}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">{currentQuestion.id}</p>
              <h2 className="mb-0 max-w-3xl text-2xl font-semibold text-slate-900 md:text-3xl">{currentQuestion.question}</h2>
            </div>
            {track === 'junior' && !isHarmonySection && (
              <button
                onClick={readQuestionAloud}
                className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                {isSpeaking ? 'Reading aloud...' : 'Read aloud'}
              </button>
            )}
          </div>

          {!isHarmonySection && (
            <div className="mb-8 grid gap-4 rounded-[1.5rem] bg-slate-50 p-5 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Left option</p>
                <p className="mt-2 text-lg font-medium text-slate-900">{currentQuestion.pole_a_label}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Right option</p>
                <p className="mt-2 text-lg font-medium text-slate-900">{currentQuestion.pole_b_label}</p>
              </div>
            </div>
          )}

          <div className={`grid gap-3 ${scaleOptions.length === 5 ? 'md:grid-cols-5' : 'md:grid-cols-3'}`}>
            {scaleOptions.map((option) => {
              const isSelected = answers[currentQuestion.id] === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleAnswer(currentQuestion.id, option.value)}
                  className={`rounded-[1.5rem] border px-4 py-5 text-left transition ${
                    isSelected
                      ? 'border-slate-950 bg-slate-950 text-white shadow-lg'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50'
                  }`}
                >
                  <div className="mb-2 text-sm font-semibold uppercase tracking-[0.18em]">
                    {option.face ? option.face : `Option ${option.value}`}
                  </div>
                  <div className="text-sm leading-6">{option.label}</div>
                </button>
              );
            })}
          </div>

          {isHarmonySection && (
            <p className="mt-5 text-sm leading-6 text-slate-600">
              Answer based on how you have been feeling recently. Your responses are stored with the assessment session.
            </p>
          )}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={!canContinue}
              className="rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {currentQuestionIndex === allQuestions.length - 1 ? 'Finish Assessment' : 'Next Question'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default MBTIAssessment;