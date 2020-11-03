import Link from "next/link";

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
      <Link href="/about/">
        <a className="header_menu">About</a>
      </Link>
      <Link href="/archives/">
        <a className="header_menu">Archives</a>
      </Link>
      <style jsx>
        {`
          .header {
            max-width: var(--max-width);
            height: 48px;
            margin: 0 auto 48px;
            padding: 8px;
          }
          .header_title {
            display: inline-block;
          }
          .header_title_inner {
            display: inline-block;
            height: 48px;
            padding: 0 8px;
            border-radius: 4px;
          }
          .header_title_inner:hover {
            background: var(--secondary-background-color);
          }
          .header_title_logo {
            vertical-align: top;
            margin: 8px 8px 0 0;
          }
          .header_title_name {
            color: var(--primary-text-color);
            font-size: 16px;
            font-weight: 700;
            line-height: 48px;
            text-transform: uppercase;
          }
          .header_menu {
            display: inline-block;
            margin-left: 4px;
            padding: 0 8px;
            color: var(--secondary-text-color);
            font-size: 14px;
            font-weight: 700;
            line-height: 48px;
            border-radius: 4px;
          }
          .header_menu:hover {
            background: var(--secondary-background-color);
          }
          @media (min-width: 480px) {
            .header_title_name {
              font-size: 20px;
            }
            .header_menu {
              font-size: 16px;
              margin-left: 8px;
            }
          }
        `}
      </style>
    </header>
  );
}
