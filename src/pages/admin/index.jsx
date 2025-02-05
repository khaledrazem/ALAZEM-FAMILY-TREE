import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import FamilyTree from "./admin-tree";
import styles from '@/styles/tree.module.css';
import FamilyHeader from "@/component/header/header";
import { useRouter } from "next/router";


export default function Home() {
  const router = useRouter()
  return (
    <>
      
   <FamilyHeader></FamilyHeader>
   <div className={styles.container}>
         <FamilyTree/>
         <button onClick={() => router.push("/admin/list-requests")}>View requests</button>

         </div>

    </>
  );
}
