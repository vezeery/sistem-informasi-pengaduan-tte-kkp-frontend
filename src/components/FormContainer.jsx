import '../css/home.css';

export default function FormContainer({ children }) {
    return (
        <div className="form-container">
            {children}
            <div className="form-content">
                <h2>Layanan Bantuan Pegawai KKP</h2>
                <p>Terima kasih telah menggunakan layanan kami</p>
                <p>Silahkan sampaikan kendala atau gangguan dengan mengisi form di bawah ini</p>
                <button href="*">Isi Form Pengaduan</button>
            </div>
        </div>
    )
}