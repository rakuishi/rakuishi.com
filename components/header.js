import React from "react";
import Link from "next/link";
import { isDarkmode, toggleDarkmode } from "utils/darkmode";

export default function Header() {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    setIsDark(isDarkmode());
  });

  return (
    <header className="header">
      <h1 className="header_title">
        <Link href="/">
          <a className="header_title_inner">
            <img
              src="/assets/images/logo.png"
              width="32"
              height="32"
              className="header_title_logo"
              alt="rakuishi.com"
              loading="lazy"
            />
            <span className="header_title_name">rakuishi.com</span>
          </a>
        </Link>
      </h1>
      <nav className="header_nav">
        <button
          className="header_menu header_menu_button"
          aria-label="Darkmode ⇄ Lightmode"
          onClick={React.useCallback(() => {
            toggleDarkmode();
            setIsDark(!isDark);
          })}
        >
          {isDark ? <DarkmodeSvg /> : <LightmodeSvg />}
        </button>
      </nav>
      <style jsx>
        {`
          .header {
            display: flex;
            justify-content: space-between;
            max-width: var(--max-width);
            margin: 48px auto;
            padding: 0 12px;
          }
          .header_title {
            display: inline-block;
          }
          .header_title_inner {
            display: inline-block;
            height: 56px;
            padding: 0 12px;
            border-radius: 10px;
          }
          .header_title_inner:hover {
            background: var(--secondary-background-color);
          }
          .header_title_logo {
            vertical-align: top;
            margin: 12px 8px 0 0;
          }
          .header_title_name {
            color: var(--primary-text-color);
            font-size: 24px;
            font-weight: 700;
            line-height: 56px;
            text-transform: uppercase;
          }
          .header_menu {
            display: inline-block;
            min-width: 48px;
            padding: 0 12px;
            color: var(--primary-text-color);
            font-size: 16px;
            font-weight: 700;
            text-transform: uppercase;
            line-height: 48px;
            border-radius: 5px;
          }
          .header_menu:hover {
            background: var(--secondary-background-color);
          }
          .header_menu_button {
            padding: 0;
            cursor: pointer;
            appearance: none;
            background: none;
            border-radius: 24px;
          }
        `}
      </style>
    </header>
  );
}

function DarkmodeSvg() {
  return (
    <svg
      fill="none"
      height="48"
      viewBox="0 0 48 48"
      width="48"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Darkmode"
    >
      <path d="m23.01 15.05c-4.5.49-8.01 4.31-8.01 8.95 0 4.97 4.03 9 9 9 4.63 0 8.45-3.5 8.95-8 .09-.79-.78-1.42-1.54-.95-.84.54-1.84.85-2.91.85-2.98 0-5.4-2.42-5.4-5.4 0-1.06.31-2.06.84-2.89.45-.67-.04-1.63-.93-1.56z" />
    </svg>
  );
}

function LightmodeSvg() {
  return (
    <svg
      fill="none"
      height="48"
      viewBox="0 0 48 48"
      width="48"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Lightmode"
    >
      <path
        d="m24 29c-1.3833 0-2.5625-.4875-3.5375-1.4625s-1.4625-2.1542-1.4625-3.5375.4875-2.5625 1.4625-3.5375 2.1542-1.4625 3.5375-1.4625 2.5625.4875 3.5375 1.4625 1.4625 2.1542 1.4625 3.5375-.4875 2.5625-1.4625 3.5375-2.1542 1.4625-3.5375 1.4625zm-10.25-4.25c-.2167 0-.3958-.0708-.5375-.2125s-.2125-.3208-.2125-.5375.0708-.3958.2125-.5375.3208-.2125.5375-.2125h2.5c.2167 0 .3958.0708.5375.2125s.2125.3208.2125.5375-.0708.3958-.2125.5375-.3208.2125-.5375.2125zm18 0c-.2167 0-.3958-.0708-.5375-.2125s-.2125-.3208-.2125-.5375.0708-.3958.2125-.5375.3208-.2125.5375-.2125h2.5c.2167 0 .3958.0708.5375.2125s.2125.3208.2125.5375-.0708.3958-.2125.5375-.3208.2125-.5375.2125zm-7.75-7.75c-.2167 0-.3958-.0708-.5375-.2125s-.2125-.3208-.2125-.5375v-2.5c0-.2167.0708-.3958.2125-.5375s.3208-.2125.5375-.2125.3958.0708.5375.2125.2125.3208.2125.5375v2.5c0 .2167-.0708.3958-.2125.5375s-.3208.2125-.5375.2125zm0 18c-.2167 0-.3958-.0708-.5375-.2125s-.2125-.3208-.2125-.5375v-2.5c0-.2167.0708-.3958.2125-.5375s.3208-.2125.5375-.2125.3958.0708.5375.2125.2125.3208.2125.5375v2.5c0 .2167-.0708.3958-.2125.5375s-.3208.2125-.5375.2125zm-6-15.95-1.425-1.4c-.15-.15-.2208-.3292-.2125-.5375s.0792-.3875.2125-.5375c.15-.15.3292-.225.5375-.225s.3875.075.5375.225l1.4 1.425c.1333.15.2.325.2.525s-.0667.3667-.2.5c-.1333.15-.3042.225-.5125.225s-.3875-.0667-.5375-.2zm12.35 12.375-1.4-1.425c-.1333-.15-.2-.3292-.2-.5375s.075-.3792.225-.5125c.1333-.15.3-.225.5-.225s.375.075.525.225l1.425 1.4c.15.15.2208.3292.2125.5375s-.0792.3875-.2125.5375c-.15.15-.3292.225-.5375.225s-.3875-.075-.5375-.225zm-1.4-12.375c-.15-.15-.225-.325-.225-.525s.075-.375.225-.525l1.4-1.425c.15-.15.3292-.2208.5375-.2125s.3875.0792.5375.2125c.15.15.225.3292.225.5375s-.075.3875-.225.5375l-1.425 1.4c-.1333.1333-.3042.2-.5125.2s-.3875-.0667-.5375-.2zm-12.375 12.375c-.15-.15-.225-.3292-.225-.5375s.075-.3875.225-.5375l1.425-1.4c.15-.15.325-.225.525-.225s.375.075.525.225.225.325.225.525-.075.375-.225.525l-1.4 1.425c-.15.15-.3292.2208-.5375.2125s-.3875-.0792-.5375-.2125z"
        fill="#000"
      />
    </svg>
  );
}
