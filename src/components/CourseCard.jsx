import { useNavigate } from 'react-router-dom';
import { Star, Clock, BookOpen } from 'lucide-react';
import styles from './CourseCard.module.css';

export default function CourseCard({ course }) {
  const navigate = useNavigate();

  const badgeClass = {
    mint: styles.badgeMint,
    blossom: styles.badgeBlossom,
    slate: styles.badgeSlate,
  }[course.badgeColor] || styles.badgeMint;

  return (
    <div className={styles.card} onClick={() => navigate(`/courses/${course.id}`)}>
      <div className={styles.thumb} style={{ background: course.thumbBg }}>
        <span className={styles.icon}>{course.icon}</span>
        <span className={`${styles.badge} ${badgeClass}`}>{course.badgeLabel}</span>
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{course.title}</h3>
        <p className={styles.instructor}>{course.instructor} &bull; {course.institute}</p>
        <div className={styles.meta}>
          <span className={styles.rating}><Star size={12} fill="currentColor" /> {course.rating}</span>
          <span><BookOpen size={12} /> {course.modules} modules</span>
          <span><Clock size={12} /> {course.weeks} weeks</span>
        </div>
      </div>
    </div>
  );
}
