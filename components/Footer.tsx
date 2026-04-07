export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <span className="logo-text">MAIZ</span>
          <p>Reserve your perfect table</p>
        </div>
        <div className="footer-links">
          <a href="#">About</a>
          <a href="#">Contact</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
        <p className="footer-copy">&copy; {new Date().getFullYear()} MAIZ. All rights reserved.</p>
      </div>
    </footer>
  );
}
