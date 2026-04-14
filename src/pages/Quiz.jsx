import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight, Award } from 'lucide-react';
import Button from '../components/Button';
import { QUIZ_QUESTIONS } from '../data/mockData';
import styles from './Quiz.module.css';

const TOTAL_TIME = 15 * 60; // 15 minutes

export default function Quiz() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);

  const submit = useCallback(() => setSubmitted(true), []);

  useEffect(() => {
    if (submitted) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(interval); submit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [submitted, submit]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  const isLow = timeLeft < 120;

  const select = (optIdx) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [current]: optIdx }));
  };

  const score = QUIZ_QUESTIONS.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0);
  const pct = Math.round((score / QUIZ_QUESTIONS.length) * 100);
  const passed = pct >= 60;

  const q = QUIZ_QUESTIONS[current];
  const letters = ['A', 'B', 'C', 'D'];

  if (submitted) {
    return (
      <div className={styles.layout}>
        <div className={styles.resultCard}>
          <div className={styles.resultIcon}>{passed ? '🎉' : '📚'}</div>
          <div className={`${styles.resultScore} ${passed ? styles.scorePass : styles.scoreFail}`}>
            {pct}%
          </div>
          <p className={styles.resultLabel}>
            You scored <strong>{score}</strong> out of <strong>{QUIZ_QUESTIONS.length}</strong> questions correctly
          </p>
          {passed ? (
            <div className={styles.badge}>
              <Award size={16} /> Quiz Passed — Certificate Unlocked!
            </div>
          ) : (
            <div className={`${styles.badge} ${styles.badgeFail}`}>
              Score below 60% — review and retry
            </div>
          )}

          <div className={styles.reviewGrid}>
            {QUIZ_QUESTIONS.map((q, i) => (
              <div key={i} className={`${styles.reviewItem} ${answers[i] === q.correct ? styles.reviewCorrect : styles.reviewWrong}`}>
                <span className={styles.reviewNum}>Q{i + 1}</span>
                <span>{answers[i] === q.correct ? '✓' : '✗'}</span>
              </div>
            ))}
          </div>

          <div className={styles.resultBtns}>
            <Button variant="outline" onClick={() => { setAnswers({}); setCurrent(0); setSubmitted(false); setTimeLeft(TOTAL_TIME); }}>
              Retake Quiz
            </Button>
            <Button onClick={() => navigate('/courses/dbms')}>Back to Course</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <Button variant="outline" size="sm" onClick={() => navigate('/courses/dbms')}>
            <ChevronLeft size={14} /> Back
          </Button>
          <span className={styles.chip}>Module 3 Quiz</span>
          <div className={`${styles.timer} ${isLow ? styles.timerLow : ''}`}>
            <Clock size={14} /> {timeStr}
          </div>
        </div>
        <h2 className={styles.quizTitle}>Relational Model & SQL Basics</h2>
        <p className={styles.quizMeta}>
          Question {current + 1} of {QUIZ_QUESTIONS.length} ·{' '}
          {Object.keys(answers).length} answered
        </p>
        <div className={styles.pills}>
          {QUIZ_QUESTIONS.map((_, i) => (
            <button
              key={i}
              className={`${styles.pill} ${i < current ? styles.pillDone : ''} ${i === current ? styles.pillCurrent : ''} ${answers[i] !== undefined ? styles.pillAnswered : ''}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <div className={styles.questionCard}>
        <p className={styles.qNum}>QUESTION {current + 1} OF {QUIZ_QUESTIONS.length}</p>
        <p className={styles.qText}>{q.text}</p>
        <div className={styles.options}>
          {q.options.map((opt, i) => (
            <button
              key={i}
              className={`${styles.option} ${answers[current] === i ? styles.selected : ''}`}
              onClick={() => select(i)}
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
        {current < QUIZ_QUESTIONS.length - 1 ? (
          <Button onClick={() => setCurrent((c) => c + 1)}>
            Next <ChevronRight size={14} />
          </Button>
        ) : (
          <Button onClick={submit}>Submit Quiz</Button>
        )}
      </div>
    </div>
  );
}
