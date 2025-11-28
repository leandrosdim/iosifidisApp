import React from "react";
import styles from "./SilkBackground.module.css";

export default function SilkBackground({ children }) {
  return (
    <div className={styles.wrapper}>
      {/* Blurred gradient “silk” layer */}
      <div className={styles.gradientLayer} />

      {/* Optional highlight overlay */}
      <div className={styles.overlay} />

      {/* Actual page content */}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
