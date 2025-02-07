import styles from './header.module.css';
import { useRouter } from 'next/router'

export default function FamilyHeader() {
  const router = useRouter()
  
  return (
    <>
    <div className={styles.header}>
      <h2 onClick={() => router.push('/')}>
        ALAZEM        
      </h2>
    </div>
    </>
  );
}
