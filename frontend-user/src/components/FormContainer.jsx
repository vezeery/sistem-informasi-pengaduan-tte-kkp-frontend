import { Link } from 'react-router-dom';
import '../css/home.css';

export default function FormContainer({ children }) {
    return (
        <div className="form-container">
            {children}
            <div className="form-content">
                <h2>Layanan Bantuan Pegawai KKP</h2>
                <p>Terima kasih telah menggunakan layanan kami</p>
                <p>Silahkan sampaikan kendala atau gangguan dengan mengisi form di bawah ini</p>
                <Link to="/form" className="form-button">Isi Form Pengaduan</Link>
            </div>
        </div>
    )
}