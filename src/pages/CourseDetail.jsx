import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Play, Lock, CheckCircle, Star, MessageCircle, ChevronRight, BookOpen, Clock, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import SEOHead from '../components/SEOHead';
import Spinner from '../components/Spinner';
import { useAsync } from '../hooks/useAsync';
import { useAuth } from '../context/AuthContext';
import { fetchCourse, fetchModules, enrollStudent, fetchEnrollment, submitDoubt } from '../lib/api';
import styles from './CourseDetail.module.css';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [doubtText, setDoubtText] = useState('');
  const [submittingDoubt, setSubmittingDoubt] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  const { data: course, loading: courseLoading, error: courseError } = useAsync(
    () => fetchCourse(id), [id]
  );
  console.log(course)
  const { data: modules, loading: modulesLoading } = useAsync(
    () => fetchModules(id), [id]
  );
  console.log(modules)
  const { data: enrollment, refetch: refetchEnrollment } = useAsync(
    () => isAuthenticated && user ? fetchEnrollment(user.id, id) : Promise.resolve({ data: null, error: null }),
    [id, user?.id, isAuthenticated]
  );

  const isEnrolled = !!enrollment;
  const completed = (modules || []).filter((m) => m.status === 'completed').length;
  const progress = modules?.length ? Math.round((completed / modules.length) * 100) : 0;

  
  const handleEnroll = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setEnrolling(true);
    const { error } = await enrollStudent(user.id, id);
    if (error) toast.error('Could not enroll. Please try again.');
    else { toast.success('Enrolled successfully!'); refetchEnrollment(); }
    setEnrolling(false);
  };

  const handleDoubt = async (e) => {
    e.preventDefault();
    if (!doubtText.trim()) return;
    if (!isAuthenticated) { navigate('/login'); return; }
    setSubmittingDoubt(true);
    const { error } = await submitDoubt(user.id, id, doubtText.trim());
    if (error) toast.error('Could not submit doubt. Please try again.');
    else { toast.success('Doubt submitted! Instructor will reply soon.'); setDoubtText(''); }
    setSubmittingDoubt(false);
  };

  const statusIcon = (status) => {
    if (status === 'completed') return <CheckCircle size={16} className={styles.iconDone} />;
    if (status === 'in-progress') return <Play size={16} className={styles.iconActive} />;
    return <Lock size={16} className={styles.iconLocked} />;
  };

  if (courseLoading) return <Spinner center />;
  if (courseError || !course) return (
    <div className={styles.errorWrap}>
      <p>Course not found.</p>
      <Button variant="outline" onClick={() => navigate('/courses')}>Back to Courses</Button>
    </div>
  );

  return (
    <>
      <SEOHead
        title={course.Title}
        description={course.description}
        path={`/courses/${id}`}
      />

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroLeft}>
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <Link to="/courses">Courses</Link>
              <ChevronRight size={13} />
              <span>{course.Domain}</span>
              <ChevronRight size={13} />
              <span>{course.Title}</span>
            </nav>
            <h1>{course.Title}</h1>
            <p>{course.description}</p>
            <div className={styles.instructorRow}>
              <div className={styles.avatar}>{course.instructorInitials}</div>
              <span>{course.Instructor} · <em>{course.institute}</em></span>
            </div>
            <div className={styles.metaRow}>
              <span><Star size={13} fill="currentColor" className={styles.starIcon} /> {course.rating}</span>
              <span><Users size={13} /> {course.enrolled?.toLocaleString()} enrolled</span>
              <span><BookOpen size={13} /> {course.modules} modules</span>
              <span><Clock size={13} /> {course.weeks} weeks</span>
            </div>
            <div className={styles.chips}>
              <span className={styles.chip}>Certificate on completion</span>
              <span className={`${styles.chip} ${styles.chipSlate}`}>{course.Domain}</span>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.videoCard}>
              <div className={styles.videoThumb} role="img" aria-label="Course preview thumbnail">
                <div className={styles.playOverlay}>
                  <div className={styles.playBtn} aria-hidden="true"><Play size={22} fill="currentColor" /></div>
                  <span>Preview: Intro to {course.Title?.split(' ')[0]}</span>
                </div>
              </div>
              <div className={styles.videoBody}>
                <p className={styles.videoMeta}>{course.modules} modules · {course.modules * 3} lectures · {Math.ceil(course.modules / 2)} quizzes</p>
                {isEnrolled ? (
                  <Button fullWidth onClick={() => navigate('/quiz')}>
                    <Play size={14} fill="currentColor" /> Continue Learning
                  </Button>
                ) : (
                  <Button fullWidth onClick={handleEnroll} disabled={enrolling}>
                    {enrolling ? 'Enrolling…' : 'Enroll for Free'}
                  </Button>
                )}
                <p className={styles.certNote}>Free certificate upon passing all quizzes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className={styles.body}>
        <div className={styles.bodyLeft}>
          {isEnrolled && (
            <div className={styles.progressCard}>
              <div className={styles.progressHeader}>
                <span>Your Progress</span>
                <span className={styles.progressPct}>{progress}% complete</span>
              </div>
              <div className={styles.progressBarOuter} role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                <div className={styles.progressBarInner} style={{ width: `${progress}%` }} />
              </div>
              <p className={styles.progressSub}>Module {completed + 1} of {modules?.length} · Keep going!</p>
            </div>
          )}

          <h2 className={styles.modulesTitle}>Course Modules</h2>

          {modulesLoading ? <Spinner /> : (
            <div className={styles.moduleList}>
              {(modules || []).map((m, i) => (
                <div
                  key={m.id}
                  className={`${styles.moduleItem} ${styles[`status_${m.status}`]}`}
                  onClick={() => m.status !== 'locked' && navigate('/quiz')}
                  role={m.status !== 'locked' ? 'button' : undefined}
                  tabIndex={m.status !== 'locked' ? 0 : undefined}
                  onKeyDown={(e) => e.key === 'Enter' && m.status !== 'locked' && navigate('/quiz')}
                >
                  <div className={styles.moduleLeft}>
                    <div className={styles.moduleNum}>MODULE {i + 1}
                      {m.status === 'completed' && <span className={styles.doneTag}> · COMPLETED</span>}
                      {m.status === 'in-progress' && <span className={styles.activeTag}> · IN PROGRESS</span>}
                    </div>
                    <div className={styles.moduleName}>{m.title}</div>
                    <div className={styles.moduleMeta}>
                      {m.videos} videos ·{' '}
                      {m.status === 'completed' && '✓ Done'}
                      {m.status === 'in-progress' && `${m.watched}/${m.videos} watched`}
                      {m.status === 'locked' && '🔒 Complete previous modules to unlock'}
                    </div>
                  </div>
                  <div className={styles.moduleRight}>{statusIcon(m.status)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className={styles.bodySide}>
          {/* Next Quiz */}
          <div className={styles.sideCard}>
            <h3>Next Quiz</h3>
            <div className={styles.quizPreview}>
              <div className={styles.quizTitle}>Module 3 Quiz</div>
              <div className={styles.quizMeta}>5 questions · 15 min · Pass: 60%</div>
            </div>
            <Button fullWidth onClick={() => isAuthenticated ? navigate('/quiz') : navigate('/login')}>
              <Play size={14} fill="currentColor" /> Start Quiz
            </Button>
          </div>

          {/* Ask a Doubt */}
          <div className={styles.sideCard}>
            <h3>Ask a Doubt</h3>
            <form onSubmit={handleDoubt} noValidate>
              <textarea
                className={styles.doubtInput}
                placeholder="Type your question about this course..."
                value={doubtText}
                onChange={(e) => setDoubtText(e.target.value)}
                rows={4}
                aria-label="Your doubt or question"
                maxLength={300}
              />
              <div className={styles.doubtMeta}>
                <span className={styles.charCount}>{doubtText.length}/300</span>
              </div>
              <Button type="submit" fullWidth size="sm" disabled={!doubtText.trim() || submittingDoubt}>
                <MessageCircle size={14} /> {submittingDoubt ? 'Submitting…' : 'Submit Doubt'}
              </Button>
            </form>
          </div>
        </aside>
      </div>
    </>
  );
}
