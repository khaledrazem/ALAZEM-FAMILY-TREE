import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import FamilyTree from "./admin-tree";
import styles from '@/styles/tree.module.css';
import FamilyHeader from "@/component/header/header";
import FloatingButtons from "@/component/floating-buttons";

export default function Home() {
  return (
    <>
      <FamilyHeader></FamilyHeader>
      <div className={styles.container}>
        <FamilyTree/>
      </div>
      <FloatingButtons />
    </>
  );
}
