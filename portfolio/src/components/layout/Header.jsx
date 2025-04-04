import React from "react";
import Navigation from "@/components/ui/Navigation";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <Navigation />
    </header>
  );
}