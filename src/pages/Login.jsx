import { useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Award, Play, TrendingUp, BarChart2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import SEOHead from '../components/SEOHead';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css';

const FEATURES = [
  { icon: <Award size={15} />,      text: 'Verified certificates from expert instructors' },
  { icon: <Play size={15} />,       text: 'Watch video lectures at your own pace' },
  { icon: <TrendingUp size={15} />, text: 'Quizzes with instant feedback' },
  { icon: <BarChart2 size={15} />,  text: 'Track progress across all your courses' },
];

export default function Login() {
  const [params]    = useSearchParams();
  const location    = useLocation();
  const navigate    = useNavigate();
  const { login, signup } = useAuth();

  const [tab,      setTab]      = useState(params.get('tab') === 'signup' ? 'signup' : 'login');
  const [role,     setRole]     = useState('Student');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState({});

  const [form, setForm] = useState({ name: '', email: '', username: '', password: '' });
  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((er) => ({ ...er, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (tab === 'signup') {
      if (!form.name.trim())     e.name     = 'Full name is required.';
      if (!form.username.trim()) e.username = 'Username is required.';
    }
    if (!form.email.trim())    e.email    = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.password)        e.password = 'Password is required.';
    else if (tab === 'signup' && form.password.length < 8) e.password = 'Password must be at least 8 characters.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    const from = location.state?.from?.pathname || '/courses';

    if (tab === 'login') {
      const { error } = await login(form.email, form.password);
      if (error) { toast.error(error.message || 'Invalid credentials.'); setLoading(false); return; }
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } else {
      const { error } = await signup(form.name, form.email, form.username, form.password, role);
      if (error) { toast.error(error.message || 'Signup failed. Please try again.'); setLoading(false); return; }
      toast.success('Account created! Check your email to verify.');
      navigate(from, { replace: true });
    }
    setLoading(false);
  };

  return (
    <>
      <SEOHead title={tab === 'login' ? 'Log In' : 'Sign Up'} path="/login" />
      <div className={styles.layout}>
        {/* Left */}
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

        {/* Right */}
        <div className={styles.right}>
          <div className={styles.formWrap}>
            <h2 className={styles.formTitle}>Welcome to gyan.it</h2>
            <p className={styles.formSub}>
              {tab === 'login' ? 'Log in to continue learning.' : 'Create your free account to get started.'}
            </p>

            <div className={styles.tabs} role="tablist">
              <button role="tab" aria-selected={tab === 'signup'} className={`${styles.tab} ${tab === 'signup' ? styles.tabActive : ''}`} onClick={() => setTab('signup')}>Sign up</button>
              <button role="tab" aria-selected={tab === 'login'}  className={`${styles.tab} ${tab === 'login'  ? styles.tabActive : ''}`} onClick={() => setTab('login')}>Log in</button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {tab === 'signup' && (
                <>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="name">Full name</label>
                    <input id="name" className={`${styles.input} ${errors.name ? styles.inputError : ''}`} type="text" placeholder="e.g. Arjun Nair" value={form.name} onChange={set('name')} autoComplete="name" />
                    {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="username">Username</label>
                    <input id="username" className={`${styles.input} ${errors.username ? styles.inputError : ''}`} type="text" placeholder="arjun_nair" value={form.username} onChange={set('username')} autoComplete="username" />
                    {errors.username && <span className={styles.fieldError}>{errors.username}</span>}
                  </div>
                </>
              )}

              <div className={styles.field}>
                <label className={styles.label} htmlFor="email">Email address</label>
                <input id="email" className={`${styles.input} ${errors.email ? styles.inputError : ''}`} type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} autoComplete="email" />
                {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="password">Password</label>
                <div className={styles.passwordWrap}>
                  <input id="password" className={`${styles.input} ${errors.password ? styles.inputError : ''}`} type={showPw ? 'text' : 'password'} placeholder={tab === 'signup' ? 'At least 8 characters' : 'Your password'} value={form.password} onChange={set('password')} autoComplete={tab === 'signup' ? 'new-password' : 'current-password'} />
                  <button type="button" className={styles.eyeBtn} onClick={() => setShowPw((v) => !v)} aria-label={showPw ? 'Hide password' : 'Show password'}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
                {tab === 'login' && <span className={styles.forgot} role="button" tabIndex={0}>Forgot password?</span>}
              </div>

              {tab === 'signup' && (
                <div className={styles.field}>
                  <label className={styles.label}>I am a...</label>
                  <div className={styles.roleGrid} role="radiogroup" aria-label="Select role">
                    {['Student', 'Instructor'].map((r) => (
                      <button key={r} type="button" role="radio" aria-checked={role === r}
                        className={`${styles.roleOption} ${role === r ? styles.roleSelected : ''}`}
                        onClick={() => setRole(r)}>
                        <span className={styles.roleIcon}>{r === 'Student' ? '🎓' : '👨‍🏫'}</span>
                        <span className={styles.roleLabel}>{r}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button type="submit" fullWidth size="lg" disabled={loading}>
                {loading ? (tab === 'signup' ? 'Creating account…' : 'Logging in…') : (tab === 'signup' ? 'Create Account' : 'Log in')}
              </Button>

              <p className={styles.switchText}>
                {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button type="button" className={styles.switchLink} onClick={() => { setTab(tab === 'login' ? 'signup' : 'login'); setErrors({}); }}>
                  {tab === 'login' ? 'Sign up' : 'Log in'}
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
