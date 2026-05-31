'use client';

import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer className="public-footer">
      <div className="public-footer-content">
        <div className="public-footer-branding">FitConnect Ads</div>
        <div className="public-footer-social">
          <a
            href="#"
            className="public-footer-social-icon"
            aria-label="Facebook"
          >
            <FaFacebook />
          </a>
          <a
            href="#"
            className="public-footer-social-icon"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="#"
            className="public-footer-social-icon"
            aria-label="X (Twitter)"
          >
            <FaXTwitter />
          </a>
        </div>
      </div>
    </footer>
  );
}




