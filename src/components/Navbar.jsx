import NavbarImage from '../assets/kkp.svg'
import '../css/home.css'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="../home/index.jsx" className="navbar-logo">
          <img src={NavbarImage} alt="Logo" className="navbar-logo-image" />
          <p>Kementerian Kelautan dan Perikanan</p>
        </a>
        <ul className="navbar-menu">
          <li>
            <a href="/about">About</a>
          </li>
        </ul>
      </div>
    </nav>
  )
}