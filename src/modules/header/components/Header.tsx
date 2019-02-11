import React from "react";
import styles from "./Header.module.scss";

const Header = React.memo(() => (
  <header className={styles.header}>
    <h1>NES Graphics Editor</h1>
  </header>
));

export default Header;
