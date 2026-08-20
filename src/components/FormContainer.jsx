import '../css/home.css';

export default function FormContainer({ children }) {
    return (
        <div className="form-container">
            {children}
            <div className="form-content">
                <h2>Layanan Bantuan Pegawai KKP</h2>
                <p>Terima kasih telah menggunakan layanan kami</p>
                <p>Silahkan sampaikan kendala atau gangguan dengan mengisi form di bawah ini</p>
                <button type="button" className="form-button">
                    <a href="/form/index.jsx">Isi Form Pengaduan</a>
                </button>
            </div>
        </div>
    )
}