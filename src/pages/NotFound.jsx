import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import styles from './NotFound.module.css';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className={styles.wrap}>
      <div className={styles.code}>404</div>
      <h2>Page not found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <div className={styles.btns}>
        <Button onClick={() => navigate('/')}>Go Home</Button>
        <Button variant="outline" onClick={() => navigate('/courses')}>Browse Courses</Button>
      </div>
    </div>
  );
}
