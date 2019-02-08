import React from "react";
import styles from "./Header.module.scss";

type Props = {};

const Header = (props: Props) => (
  <header className={styles.header}>
    <h1>
      NES Graphics Editor
      <svg
        className={styles.svg}
        viewBox="0 0 350 30"
        xmlns="http://www.w3.org/2000/svg"
        aria-role="presentation"
      >
        {/* <symbol id="s-text">
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">
            NES Graphics Editor
          </text>
        </symbol>
        <use className="text" xlinkHref="#s-text" />
        <use className="text" xlinkHref="#s-text" />
        <use className="text" xlinkHref="#s-text" />
        <use className="text" xlinkHref="#s-text" />
        <use className="text" xlinkHref="#s-text" /> */}

        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="url(#gr-simple)"
        >
          NES Graphics Editor
        </text>
        <defs>
          <linearGradient id="gr-simple" x1="0" y1="0" x2="100%" y2="100%">
            <stop stopColor="rgb(0, 0, 221)" offset="10%" />
            <stop stopColor="rgb(255, 0, 170)" offset="90%" />
          </linearGradient>
        </defs>
      </svg>
    </h1>
  </header>
);

export default Header;

{
  /* <svg viewBox="0 0 240 80" xmlns="http://www.w3.org/2000/svg">
  <style>
    .small { font: italic 13px sans-serif; }
    .heavy { font: bold 30px sans-serif; }
    .Rrrrr { font: italic 40px serif; fill: red; }
  </style>

  <text x="20" y="35" class="small">My</text>
  <text x="40" y="35" class="heavy">cat</text>
  <text x="55" y="55" class="small">is</text>
  <text x="65" y="55" class="Rrrrr">Grumpy!</text>
</svg> */
}
