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
            xmlns="http://www.w3.org/2000/svg"
            enableBackground="new 0 0 24 24"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            aria-label="ダークモード"
          >
            <rect fill="none" height="24" width="24" />
            <path d="M11.01,3.05C6.51,3.54,3,7.36,3,12c0,4.97,4.03,9,9,9c4.63,0,8.45-3.5,8.95-8c0.09-0.79-0.78-1.42-1.54-0.95 c-0.84,0.54-1.84,0.85-2.91,0.85c-2.98,0-5.4-2.42-5.4-5.4c0-1.06,0.31-2.06,0.84-2.89C12.39,3.94,11.9,2.98,11.01,3.05z" />
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
            border-radius: 5px;
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
          .header_menu_button {
            cursor: pointer;
            appearance: none;
            background: none;
            border: none;
            outline: none;
            transition-duration: 0.4s;
          }
          .header_menu:hover {
            background: var(--secondary-background-color);
          }
        `}
      </style>
    </header>
  );
}
