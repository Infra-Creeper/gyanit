import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Award, Play, TrendingUp, BarChart2, Eye, EyeOff, Loader } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import styles from './Login.module.css';

const FEATURES = [
  { icon: <Award size={15} />, text: 'Verified certificates from expert instructors' },
  { icon: <Play size={15} />, text: 'Watch video lectures at your own pace' },
  { icon: <TrendingUp size={15} />, text: 'Quizzes with instant feedback' },
  { icon: <BarChart2 size={15} />, text: 'Track progress across all your courses' },
];

export default function Login() {
  const [params] = useSearchParams();
  const [tab, setTab] = useState(params.get('tab') === 'signup' ? 'signup' : 'login');
  const [role, setRole] = useState('Student');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ name: '', email: '', username: '', password: '' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'login') {
        if (!form.email || !form.password) {
          setError('Please fill in all fields.');
          return;
        }
        await login(form.email, form.password);
        navigate('/courses');
      } else {
        if (!form.name || !form.email || !form.username || !form.password) {
          setError('Please fill in all fields.');
          return;
        }
        if (form.password.length < 8) {
          setError('Password must be at least 8 characters.');
          return;
        }
        await signup(form.name, form.email, form.username, form.password, role);
        navigate('/courses');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.layout}>
      {/* Left panel */}
      <div className={styles.left}>
        <div className={styles.leftLogo}>gyan<span>.it</span></div>
        <h2>Learn anything.<br />Grow everywhere.</h2>
        <p>India's free platform for structured learning. Watch, quiz, and earn certificates that matter.</p>
        <div className={styles.features}>
          {FEATURES.map((f, i) => (
            <div key={i} className={styles.feature}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className={styles.right}>
        <div className={styles.formWrap}>
          <h2 className={styles.formTitle}>Welcome to gyan.it</h2>
          <p className={styles.formSub}>
            {tab === 'login' ? 'Log in to continue learning.' : 'Create your free account to get started.'}
          </p>

          <div className={styles.tabs}>
            <button className={`${styles.tab} ${tab === 'signup' ? styles.tabActive : ''}`} onClick={() => setTab('signup')}>Sign up</button>
            <button className={`${styles.tab} ${tab === 'login' ? styles.tabActive : ''}`} onClick={() => setTab('login')}>Log in</button>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {tab === 'signup' && (
              <>
                <div className={styles.field}>
                  <label className={styles.label}>Full name</label>
                  <input className={styles.input} type="text" placeholder="e.g. Arjun Nair" value={form.name} onChange={set('name')} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Username</label>
                  <input className={styles.input} type="text" placeholder="arjun_nair" value={form.username} onChange={set('username')} />
                </div>
              </>
            )}

            <div className={styles.field}>
              <label className={styles.label}>Email address</label>
              <input className={styles.input} type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <div className={styles.passwordWrap}>
                <input
                  className={styles.input}
                  type={showPw ? 'text' : 'password'}
                  placeholder={tab === 'signup' ? 'At least 8 characters' : 'Your password'}
                  value={form.password}
                  onChange={set('password')}
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPw((v) => !v)}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {tab === 'login' && (
                <span className={styles.forgot}>Forgot password?</span>
              )}
            </div>

            {tab === 'signup' && (
              <div className={styles.field}>
                <label className={styles.label}>I am a...</label>
                <div className={styles.roleGrid}>
                  {['Student', 'Instructor'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      className={`${styles.roleOption} ${role === r ? styles.roleSelected : ''}`}
                      onClick={() => setRole(r)}
                    >
                      <span className={styles.roleIcon}>{r === 'Student' ? '🎓' : '👨‍🏫'}</span>
                      <span className={styles.roleLabel}>{r}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && <p className={styles.error}>{error}</p>}

            <Button type="submit" fullWidth size="lg" disabled={loading}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                  <Loader size={18} className={styles.spin} />
                  {tab === 'signup' ? 'Creating Account...' : 'Logging in...'}
                </span>
              ) : (
                tab === 'signup' ? 'Create Account' : 'Log in'
              )}
            </Button>

            <p className={styles.switchText}>
              {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button type="button" className={styles.switchLink} onClick={() => setTab(tab === 'login' ? 'signup' : 'login')}>
                {tab === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
