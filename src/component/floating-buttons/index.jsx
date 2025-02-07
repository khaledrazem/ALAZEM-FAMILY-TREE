import { useRouter } from 'next/router';
import styles from './floating-buttons.module.css';

export default function FloatingButtons() {
  const router = useRouter();
  const isAdminPath = router.pathname.startsWith('/admin');

  return (
    <div className={styles.floatingContainer}>
      {!isAdminPath && (
        <button 
          className={styles.floatingButton}
          onClick={() => router.push('/request-new')}
        >
          Request to add family member
        </button>
      )}
      {isAdminPath && (
        <button 
          className={styles.floatingButton}
          onClick={() => router.push('/admin/list-requests')}
        >
          View requests
        </button>
      )}
    </div>
  );
}