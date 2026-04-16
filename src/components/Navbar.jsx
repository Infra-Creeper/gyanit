import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, displayName, logout, isAuthenticated } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setOpen(false);
  };

  const initials = displayName ? displayName[0].toUpperCase() : '?';

  return (
    <header className={styles.nav}>
      <Link to="/" className={styles.logo} onClick={() => setOpen(false)}>
        gyan<span>.it</span>
      </Link>

      {/* Desktop nav */}
      <nav className={styles.desktopLinks} aria-label="Main navigation">
        <Link to="/courses" className={`${styles.link} ${location.pathname === '/courses' ? styles.active : ''}`}>
          Browse Courses
        </Link>
        {isAuthenticated ? (
          <div className={styles.userRow}>
            <div className={styles.avatar} aria-label={`Logged in as ${displayName}`}>{initials}</div>
            <span className={styles.userName}>{displayName}</span>
            <button className={styles.iconBtn} onClick={handleLogout} aria-label="Log out" title="Log out">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <>
            <button className={styles.linkBtn} onClick={() => navigate('/login')}>Log in</button>
            <Button size="sm" onClick={() => navigate('/login?tab=signup')}>Sign up free</Button>
          </>
        )}
      </nav>

      {/* Mobile hamburger */}
      <button className={styles.hamburger} onClick={() => setOpen((v) => !v)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile drawer */}
      {open && (
        <div className={styles.drawer}>
          <Link to="/courses" className={styles.drawerLink} onClick={() => setOpen(false)}>Browse Courses</Link>
          {isAuthenticated ? (
            <>
              <div className={styles.drawerUser}>
                <div className={styles.avatar}>{initials}</div>
                <span>{displayName}</span>
              </div>
              <button className={styles.drawerLogout} onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <button className={styles.drawerLink} onClick={() => { navigate('/login'); setOpen(false); }}>Log in</button>
              <button className={styles.drawerSignup} onClick={() => { navigate('/login?tab=signup'); setOpen(false); }}>Sign up free</button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
