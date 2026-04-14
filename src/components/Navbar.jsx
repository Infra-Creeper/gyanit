import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        gyan<span>.it</span>
      </Link>

      <div className={styles.links}>
        <Link to="/courses" className={`${styles.link} ${location.pathname === '/courses' ? styles.active : ''}`}>
          Browse Courses
        </Link>

        {user ? (
          <div className={styles.userRow}>
            <div className={styles.avatar}>{user.name?.[0]}</div>
            <span className={styles.userName}>{user.name}</span>
            <button className={styles.iconBtn} onClick={handleLogout} title="Log out">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <>
            <button className={styles.linkBtn} onClick={() => navigate('/login')}>Log in</button>
            <Button size="sm" onClick={() => navigate('/login?tab=signup')}>Sign up free</Button>
          </>
        )}
      </div>
    </nav>
  );
}
