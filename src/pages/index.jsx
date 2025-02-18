import FamilyTree from "./tree";
import styles from '@/styles/tree.module.css';
import FamilyHeader from "../component/header/header";
import { useRouter } from "next/router";
import FloatingButtons from "@/component/floating-buttons";



export default function Home() {
  const router = useRouter();
    return (
    <>
      
   <FamilyHeader></FamilyHeader>
   <div className={styles.container}>
         <FamilyTree router={router}/>
         </div>
      <FloatingButtons />

    </>
  );
}
