import { useParams, useNavigate, Link } from 'react-router-dom';
import { Play, Lock, CheckCircle, Clock, BookOpen, Star, MessageCircle, ChevronRight } from 'lucide-react';
import Button from '../components/Button';
import { COURSES, MODULES } from '../data/mockData';
import styles from './CourseDetail.module.css';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = COURSES.find((c) => c.id === id) || COURSES[0];

  const completed = MODULES.filter((m) => m.status === 'completed').length;
  const progress = Math.round((completed / MODULES.length) * 100);

  const statusIcon = (status) => {
    if (status === 'completed') return <CheckCircle size={15} className={styles.iconDone} />;
    if (status === 'in-progress') return <Play size={15} className={styles.iconActive} />;
    return <Lock size={15} className={styles.iconLocked} />;
  };

  return (
    <div>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroLeft}>
            <nav className={styles.breadcrumb}>
              <Link to="/courses">Courses</Link>
              <ChevronRight size={13} />
              <span>{course.domain}</span>
              <ChevronRight size={13} />
              <span>{course.title}</span>
            </nav>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
            <div className={styles.instructorRow}>
              <div className={styles.avatar}>{course.instructorInitials}</div>
              <span>{course.instructor} · <em>{course.institute}</em></span>
            </div>
            <div className={styles.chips}>
              <span className={styles.chip}><Star size={12} fill="currentColor" /> {course.rating} rating</span>
              <span className={styles.chip}>{course.enrolled.toLocaleString()} enrolled</span>
              <span className={`${styles.chip} ${styles.chipBlossom}`}>Certificate on completion</span>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.videoCard}>
              <div className={styles.videoThumb}>
                <div className={styles.playOverlay}>
                  <div className={styles.playBtn}><Play size={22} fill="currentColor" /></div>
                  <span>Preview: Introduction to {course.title.split(' ')[0]}</span>
                </div>
              </div>
              <div className={styles.videoBody}>
                <p className={styles.videoMeta}>{course.modules} modules · {course.modules * 3} video lectures · {Math.ceil(course.modules / 2)} quizzes</p>
                <Button fullWidth onClick={() => navigate(`/quiz`)}>Enroll for Free</Button>
                <p className={styles.certNote}>Get a certificate upon passing all quizzes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className={styles.body}>
        <div className={styles.bodyLeft}>
          <div className={styles.progressCard}>
            <div className={styles.progressHeader}>
              <span>Your Progress</span>
              <span className={styles.progressPct}>{progress}% complete</span>
            </div>
            <div className={styles.progressBarOuter}>
              <div className={styles.progressBarInner} style={{ width: `${progress}%` }} />
            </div>
            <p className={styles.progressSub}>Module {completed + 1} of {MODULES.length} · Keep going!</p>
          </div>

          <h2 className={styles.modulesTitle}>Course Modules</h2>
          <div className={styles.moduleList}>
            {MODULES.map((m, i) => (
              <div
                key={m.id}
                className={`${styles.moduleItem} ${styles[`status_${m.status}`]}`}
                onClick={() => m.status !== 'locked' && navigate('/quiz')}
              >
                <div className={styles.moduleLeft}>
                  <div className={styles.moduleNum}>MODULE {i + 1}</div>
                  <div className={styles.moduleName}>{m.title}</div>
                  <div className={styles.moduleMeta}>
                    {m.videos} videos ·{' '}
                    {m.status === 'completed' && '✓ Completed'}
                    {m.status === 'in-progress' && `${m.watched}/${m.videos} watched`}
                    {m.status === 'locked' && 'Locked'}
                  </div>
                </div>
                <div className={styles.moduleRight}>
                  {statusIcon(m.status)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.bodySide}>
          <div className={styles.sideCard}>
            <h3>Ask a Doubt</h3>
            <textarea
              className={styles.doubtInput}
              placeholder="Type your question about this course..."
              rows={4}
            />
            <Button fullWidth size="sm">
              <MessageCircle size={14} /> Submit Doubt
            </Button>
          </div>

          <div className={styles.sideCard}>
            <h3>Next Quiz</h3>
            <div className={styles.quizPreview}>
              <div className={styles.quizTitle}>Module 3 Quiz</div>
              <div className={styles.quizMeta}>5 questions · 15 minutes · Pass: 60%</div>
            </div>
            <Button fullWidth onClick={() => navigate('/quiz')}>
              <Play size={14} fill="currentColor" /> Start Quiz
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
