import React from "react";
import Link from "next/link";
import { toggleDarkmode } from "utils/darkmode";

export default function Header() {
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
          onClick={React.useCallback(() => {
            toggleDarkmode();
          })}
        >
          <svg
            fill="none"
            height="48"
            viewBox="0 0 48 48"
            width="48"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="ダークモード"
          >
            <path d="m23.01 15.05c-4.5.49-8.01 4.31-8.01 8.95 0 4.97 4.03 9 9 9 4.63 0 8.45-3.5 8.95-8 .09-.79-.78-1.42-1.54-.95-.84.54-1.84.85-2.91.85-2.98 0-5.4-2.42-5.4-5.4 0-1.06.31-2.06.84-2.89.45-.67-.04-1.63-.93-1.56z" />
          </svg>
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
            outline: none;
          }
        `}
      </style>
    </header>
  );
}
