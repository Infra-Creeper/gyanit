import { useNavigate } from 'react-router-dom';
import { ArrowRight, Award, Play, TrendingUp } from 'lucide-react';
import Button from '../components/Button';
import CourseCard from '../components/CourseCard';
import SEOHead from '../components/SEOHead';
import Spinner from '../components/Spinner';
import { useAsync } from '../hooks/useAsync';
import { fetchCourses } from '../lib/api';
import { DOMAINS, STATS } from '../data/mockData';
import styles from './Landing.module.css';

export default function Landing() {
  const navigate = useNavigate();
  const { data: courses, loading } = useAsync(fetchCourses);

  return (
    <>
      <SEOHead path="/" />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.badge}>🇮🇳 India's free learning platform</span>
          <h1>Learn, Attempt, Earn.<br /><em>Grow with Gyan.</em></h1>
          <p>Structured courses by expert instructors. Watch videos, attempt quizzes, and earn verified certificates — just like NPTEL, but free for everyone.</p>
          <div className={styles.heroBtns}>
            <Button size="lg" onClick={() => navigate('/courses')}>
              Explore Courses <ArrowRight size={16} />
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate('/login?tab=signup')}>
              Get Started Free
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className={styles.stats}>
        {STATS.map((s) => (
          <div key={s.label} className={styles.stat}>
            <div className={styles.statNum}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Domains */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Browse by Domain</h2>
        <p className={styles.sectionSub}>Choose a field and start learning today</p>
        <div className={styles.domainGrid}>
          {DOMAINS.map((d) => (
            <div key={d.id} className={styles.domainCard} onClick={() => navigate(`/courses?domain=${d.id}`)}>
              <div className={styles.domainIcon}>{d.icon}</div>
              <div className={styles.domainName}>{d.name}</div>
              <div className={styles.domainCount}>{d.count} courses</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className={styles.featuredSection}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Featured Courses</h2>
          <p className={styles.sectionSub}>Handpicked by our instructors</p>
          {loading ? (
            <Spinner center />
          ) : (
            <div className={styles.coursesGrid}>
              {(courses || []).slice(0, 3).map((c) => <CourseCard key={c.id} course={c} />)}
            </div>
          )}
          <div className={styles.viewAll}>
            <Button variant="outline" onClick={() => navigate('/courses')}>
              View all courses <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>How gyan.it works</h2>
        <p className={styles.sectionSub}>Three simple steps to your certificate</p>
        <div className={styles.stepsGrid}>
          {[
            { icon: <Play size={22} />, step: '01', title: 'Watch Lectures', desc: 'Learn from expert instructors through structured video modules at your own pace.' },
            { icon: <TrendingUp size={22} />, step: '02', title: 'Attempt Quizzes', desc: 'Test your understanding with module-end quizzes and get instant feedback.' },
            { icon: <Award size={22} />, step: '03', title: 'Earn Certificate', desc: 'Pass all quizzes with 60%+ to earn a verified certificate you can share on LinkedIn.' },
          ].map((s) => (
            <div key={s.step} className={styles.step}>
              <div className={styles.stepIcon}>{s.icon}</div>
              <div className={styles.stepNum}>{s.step}</div>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>Ready to start learning?</h2>
        <p>Join 4,200+ students learning on gyan.it — completely free.</p>
        <Button size="lg" onClick={() => navigate('/login?tab=signup')}>
          Create Free Account <ArrowRight size={16} />
        </Button>
      </section>
    </>
  );
}
