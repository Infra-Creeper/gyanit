import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}>gyan<span>.it</span></div>
          <p>India's free platform for structured learning. Watch, quiz, earn.</p>
        </div>
        <div className={styles.links}>
          <div className={styles.col}>
            <h4>Platform</h4>
            <Link to="/courses">Browse Courses</Link>
            <Link to="/login?tab=signup">Sign Up</Link>
            <Link to="/login">Log In</Link>
          </div>
          <div className={styles.col}>
            <h4>Domains</h4>
            <Link to="/courses?domain=cs">Computer Science</Link>
            <Link to="/courses?domain=ai">AI & ML</Link>
            <Link to="/courses?domain=ds">Data Science</Link>
          </div>
          <div className={styles.col}>
            <h4>Info</h4>
            <a href="#">About</a>
            <a href="#">For Instructors</a>
            <a href="#">Privacy Policy</a>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>© 2025 gyan.it — Free education for everyone.</span>
        <span>Built with ❤️ in India</span>
      </div>
    </footer>
  );
}
