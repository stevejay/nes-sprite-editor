import React from "react";
import styles from "./Header.module.scss";

const Header = React.memo(() => (
  <header className={styles.header}>
    <h1>
      NES Graphics Editor
      <svg
        className={styles.svg}
        viewBox="0 0 350 30"
        xmlns="http://www.w3.org/2000/svg"
        aria-role="presentation"
      >
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="#FFF"
          // fill="url(#gr-simple)"
        >
          NES Graphics Editor
        </text>
        {/* <defs>
          <linearGradient id="gr-simple" x1="0" y1="0" x2="100%" y2="100%">
            <stop stopColor="rgb(0, 0, 221)" offset="20%" />
            <stop stopColor="rgb(255, 0, 170)" offset="60%" />
          </linearGradient>
        </defs> */}
      </svg>
    </h1>
  </header>
));

export default Header;
