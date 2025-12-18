import React from 'react';

// PUBLIC_INTERFACE
export default function Footer() {
  /** Footer with simple links and branding. */
  return (
    <footer className="siteFooter">
      <div className="container footerInner">
        <div className="footerLeft">
          <div className="footerBrand">Kavia Commerce</div>
          <div className="footerNote">Light theme • Accents: #3b82f6 & #06b6d4</div>
        </div>
        <div className="footerRight">
          <a className="footerLink" href="https://react.dev" target="_blank" rel="noreferrer">
            React
          </a>
          <a className="footerLink" href="https://developer.mozilla.org" target="_blank" rel="noreferrer">
            MDN
          </a>
        </div>
      </div>
    </footer>
  );
}
