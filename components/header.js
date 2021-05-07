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
        <Link href="/about/">
          <a className="header_menu">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              enableBackground="new 0 0 24 24"
              height="24"
              viewBox="0 0 24 24"
              width="24"
            >
              <g>
                <path d="M0,0h24v24H0V0z" fill="none" />
              </g>
              <g>
                <path d="M10.25,13c0,0.69-0.56,1.25-1.25,1.25S7.75,13.69,7.75,13S8.31,11.75,9,11.75S10.25,12.31,10.25,13z M15,11.75 c-0.69,0-1.25,0.56-1.25,1.25s0.56,1.25,1.25,1.25s1.25-0.56,1.25-1.25S15.69,11.75,15,11.75z M22,12c0,5.52-4.48,10-10,10 S2,17.52,2,12S6.48,2,12,2S22,6.48,22,12z M20,12c0-0.78-0.12-1.53-0.33-2.24C18.97,9.91,18.25,10,17.5,10 c-3.13,0-5.92-1.44-7.76-3.69C8.69,8.87,6.6,10.88,4,11.86C4.01,11.9,4,11.95,4,12c0,4.41,3.59,8,8,8S20,16.41,20,12z" />
              </g>
            </svg>
            <span>About</span>
          </a>
        </Link>
        <Link href="/archives/">
          <a className="header_menu">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              enableBackground="new 0 0 24 24"
              height="24"
              viewBox="0 0 24 24"
              width="24"
            >
              <g>
                <path d="M0,0h24v24H0V0z" fill="none" />
              </g>
              <g>
                <path d="M16,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V8L16,3z M8,7h3c0.55,0,1,0.45,1,1v0c0,0.55-0.45,1-1,1H8 C7.45,9,7,8.55,7,8v0C7,7.45,7.45,7,8,7z M16,17H8c-0.55,0-1-0.45-1-1v0c0-0.55,0.45-1,1-1h8c0.55,0,1,0.45,1,1v0 C17,16.55,16.55,17,16,17z M16,13H8c-0.55,0-1-0.45-1-1v0c0-0.55,0.45-1,1-1h8c0.55,0,1,0.45,1,1v0C17,12.55,16.55,13,16,13z M15,8 V5l4,4h-3C15.45,9,15,8.55,15,8z" />
              </g>
            </svg>
            <span>Archives</span>
          </a>
        </Link>
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
            max-width: var(--max-width);
            margin: 48px auto;
          }
          .header_title {
            display: inline-block;
          }
          .header_title_inner {
            display: inline-block;
            height: 56px;
            padding: 0 16px;
            border-radius: 8px;
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
            padding: 0 16px;
            color: var(--primary-text-color);
            font-size: 16px;
            font-weight: 700;
            text-transform: uppercase;
            line-height: 56px;
            border-radius: 8px;
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
          .header_menu svg {
            margin-bottom: 4px;
          }
          .header_menu span {
            margin-left: 8px;
          }
          @media (min-width: 568px) {
            .header {
              display: flex;
              justify-content: space-between;
            }
          }
        `}
      </style>
    </header>
  );
}
