
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

    <button onClick={() => router.push('/request-new')}>Request to add family member</button>
 </div>

    </>
  );
}
