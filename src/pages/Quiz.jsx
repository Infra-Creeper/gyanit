import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight, Award, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import SEOHead from '../components/SEOHead';
import Spinner from '../components/Spinner';
import { useAsync } from '../hooks/useAsync';
import { useAuth } from '../context/AuthContext';
import { fetchQuestions, submitAttempt } from '../lib/api';
import styles from './Quiz.module.css';

const TOTAL_TIME = 15 * 60;
const PASS_PCT   = 60;
const ASSIGNMENT_ID = 'assign-3'; // In production, pass via route state or param

export default function Quiz() {
  const navigate  = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const { data: questions, loading, error } = useAsync(
    () => fetchQuestions(ASSIGNMENT_ID), [ASSIGNMENT_ID]
  );

  const [current,   setCurrent]   = useState(0);
  const [answers,   setAnswers]   = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft,  setTimeLeft]  = useState(TOTAL_TIME);
  const [saving,    setSaving]    = useState(false);

  const submit = useCallback(async (auto = false) => {
    if (auto) toast('Time\'s up! Quiz auto-submitted.', { icon: '⏱️' });
    setSubmitted(true);

    if (!isAuthenticated || !questions) return;
    const score = questions.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0);
    const pct   = Math.round((score / questions.length) * 100);
    setSaving(true);
    const { error } = await submitAttempt(user.id, ASSIGNMENT_ID, pct);
    if (error) toast.error('Score could not be saved. Please contact support.');
    setSaving(false);
  }, [answers, isAuthenticated, questions, user]);

  useEffect(() => {
    if (submitted || loading || !questions) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(interval); submit(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [submitted, loading, questions, submit]);

  if (loading) return <Spinner center />;
  if (error || !questions)  return (
    <div className={styles.layout}>
      <div className={styles.errorCard}>
        <AlertCircle size={32} color="#c0606a" />
        <p>Could not load quiz questions. Please try again.</p>
        <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    </div>
  );

  const minutes  = Math.floor(timeLeft / 60);
  const seconds  = timeLeft % 60;
  const timeStr  = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  const isLow    = timeLeft < 120;

  const score    = questions.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0);
  const pct      = Math.round((score / questions.length) * 100);
  const passed   = pct >= PASS_PCT;
  const q        = questions[current];
  const letters  = ['A', 'B', 'C', 'D'];
  const answered = Object.keys(answers).length;

  if (submitted) {
    return (
      <>
        <SEOHead title="Quiz Result" />
        <div className={styles.layout}>
          <div className={styles.resultCard}>
            <div className={styles.resultIcon}>{passed ? '🎉' : '📚'}</div>
            <div className={`${styles.resultScore} ${passed ? styles.scorePass : styles.scoreFail}`}>
              {pct}%
            </div>
            <p className={styles.resultLabel}>
              You scored <strong>{score}</strong> out of <strong>{questions.length}</strong>
            </p>
            <div className={`${styles.badge} ${!passed ? styles.badgeFail : ''}`}>
              <Award size={16} />
              {passed ? 'Quiz Passed — Certificate Unlocked!' : `Score below ${PASS_PCT}% — review and retry`}
            </div>
            {saving && <p className={styles.savingNote}>Saving your score…</p>}

            <div className={styles.reviewGrid}>
              {questions.map((q, i) => (
                <div key={i} className={`${styles.reviewItem} ${answers[i] === q.correct ? styles.reviewCorrect : styles.reviewWrong}`}>
                  <span className={styles.reviewNum}>Q{i + 1}</span>
                  <span>{answers[i] === q.correct ? '✓' : '✗'}</span>
                </div>
              ))}
            </div>

            <div className={styles.resultBtns}>
              {!passed && (
                <Button variant="outline" onClick={() => { setAnswers({}); setCurrent(0); setSubmitted(false); setTimeLeft(TOTAL_TIME); }}>
                  Retake Quiz
                </Button>
              )}
              <Button onClick={() => navigate('/courses/dbms')}>Back to Course</Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Module 3 Quiz" />
      <div className={styles.layout}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              <ChevronLeft size={14} /> Back
            </Button>
            <span className={styles.chip}>Module 3 Quiz</span>
            <div className={`${styles.timer} ${isLow ? styles.timerLow : ''}`} aria-live="polite" aria-label={`${timeStr} remaining`}>
              <Clock size={14} /> {timeStr}
            </div>
          </div>
          <h1 className={styles.quizTitle}>Relational Model & SQL Basics</h1>
          <p className={styles.quizMeta}>
            Question {current + 1} of {questions.length} · {answered} answered
          </p>
          <div className={styles.pills} role="navigation" aria-label="Question navigation">
            {questions.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to question ${i + 1}${answers[i] !== undefined ? ', answered' : ''}`}
                className={[
                  styles.pill,
                  answers[i] !== undefined ? styles.pillAnswered : '',
                  i === current ? styles.pillCurrent : '',
                  i < current && answers[i] !== undefined ? styles.pillDone : '',
                ].join(' ')}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>
        </div>

        {/* Question */}
        <div className={styles.questionCard} aria-live="polite">
          <p className={styles.qNum}>QUESTION {current + 1} OF {questions.length}</p>
          <p className={styles.qText}>{q.text}</p>
          <div className={styles.options} role="radiogroup" aria-label="Answer options">
            {q.options.map((opt, i) => (
              <button
                key={i}
                role="radio"
                aria-checked={answers[current] === i}
                className={`${styles.option} ${answers[current] === i ? styles.selected : ''}`}
                onClick={() => setAnswers((prev) => ({ ...prev, [current]: i }))}
              >
                <span className={styles.optLetter}>{letters[i]}</span>
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className={styles.nav}>
          <Button variant="outline" onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}>
            <ChevronLeft size={14} /> Previous
          </Button>
          <span className={styles.navHint}>
            {answered < questions.length && `${questions.length - answered} unanswered`}
          </span>
          {current < questions.length - 1 ? (
            <Button onClick={() => setCurrent((c) => c + 1)}>
              Next <ChevronRight size={14} />
            </Button>
          ) : (
            <Button onClick={() => submit(false)}>
              Submit Quiz
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
