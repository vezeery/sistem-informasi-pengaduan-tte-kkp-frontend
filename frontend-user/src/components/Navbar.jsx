import { Link } from 'react-router-dom'
import NavbarImage from '../assets/kkp.svg'
import '../css/home.css'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={NavbarImage} alt="Logo" className="navbar-logo-image" />
          <p>Kementerian Kelautan dan Perikanan</p>
        </Link>
        <ul className="navbar-menu">
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}