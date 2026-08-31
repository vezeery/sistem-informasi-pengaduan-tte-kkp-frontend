import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../css/form.css';

const steps = [
    { key: 'identitas', label: 'Data Pegawai', description: 'Informasi identitas sesuai kepegawaian' },
    { key: 'detail-kendala', label: 'Detail Kendala', description: 'Jelaskan permasalahan yang sedang dialami' },
    { key: 'konfirmasi', label: 'Konfirmasi', description: 'Periksa kembali sebelum dikirim ke sistem' },
];

const initialFormData = {
    nik: '',
    name: '',
    email: '',
    eselon: '',
    unitKerja: '',
    kategoriKendala: '',
    detailKendala: '',
    fileBukti: null,
};

export default function Form() {
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState([false, false, false]);
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    const validateStep = (stepIndex) => {
        const nextErrors = {};

        if (stepIndex === 0) {
            if (!formData.nik.trim()) nextErrors.nik = 'NIK wajib diisi';
            if (!formData.name.trim()) nextErrors.name = 'Nama wajib diisi';
            if (!formData.email.trim()) nextErrors.email = 'Email wajib diisi';
            if (!formData.eselon) nextErrors.eselon = 'Eselon wajib dipilih';
            if (!formData.unitKerja) nextErrors.unitKerja = 'Unit kerja wajib dipilih';
        }

        if (stepIndex === 1) {
            if (!formData.kategoriKendala) nextErrors.kategoriKendala = 'Kategori kendala wajib dipilih';
            if (!formData.detailKendala.trim()) nextErrors.detailKendala = 'Detail kendala wajib diisi';
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handlePrevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    // Fungsi submit digabung untuk navigasi 'Next' maupun 'Final Submit'
    const handleSubmit = (event) => {
        event.preventDefault();

        // Validasi form di step saat ini
        if (!validateStep(currentStep)) {
            return;
        }

        // Tandai step ini selesai
        const nextCompleted = [...completedSteps];
        nextCompleted[currentStep] = true;
        setCompletedSteps(nextCompleted);

        // Jika belum di step terakhir, maju ke step berikutnya
        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            // Jika sudah di step terakhir, submit data
            setIsSubmitted(true);
        }
    };

    return (
        <div className="bg-white">
            <Navbar />
            <div className="form-content relative mb-8">
                <h2 className="bg-linear-to-r from-[#042E7C] via-blue-500 to-[#29B6F6] bg-clip-text! text-transparent!">
                    Buat Tiket Bantuan
                </h2>

                <div className="pt-1.5 mb-8">
                    {steps.map((step, index) => {
                        const isActive = currentStep === index;
                        const isDone = completedSteps[index];

                        return (
                            <span
                                key={step.key}
                                className={`inline-flex items-center gap-2 rounded-full px-2 py-1 text-[8px] sm:text-base ${isActive ? 'bg-[#03215C] text-white' : 'bg-[#F3F4F6] text-[#6B7280]'} ${index > 0 ? 'ml-4' : ''}`}
                            >
                                {/* Lingkaran indikator angka di-adjust agar proporsional */}
                                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] sm:h-6 sm:w-6 sm:text-xs ${isDone ? 'bg-[#22C55E] text-white' : isActive ? 'bg-[#31558F] text-white' : 'bg-white text-[#6B7280]'}`}>
                                    {isDone ? '✓' : index + 1}
                                </span>
                                <span className="text-xs mb-0.5">{step.label}</span>
                            </span>
                        );
                    })}
                </div>

                <div className="form-placement flex flex-col items-center justify-start">
                    <form onSubmit={handleSubmit} className="form-box flex w-full max-w-3xl flex-col items-start justify-start rounded-2xl border border-[#D1D5DB] bg-white p-6 text-xl text-black shadow-2xl sm:p-8">
                        {!isSubmitted ? (
                            <>
                                <h4 className="mb-1 text-2xl font-medium">{steps[currentStep].label}</h4>
                                <p className="mb-4 text-xl font-light text-[#374151]">{steps[currentStep].description}</p>

                                {/* STEP 1: DATA PEGAWAI */}
                                {currentStep === 0 && (
                                    <div className="grid w-full grid-cols-1 gap-4 pt-6">
                                        <div className="grid w-full items-start">
                                            <label className="mb-1.5 text-left text-base" htmlFor="nik">NIK</label>
                                            <input
                                                className="w-full rounded-xl border border-[#D1D5DB] p-3 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                type="text"
                                                id="nik"
                                                name="nik"
                                                placeholder="NIK 16 Digit"
                                                value={formData.nik}
                                                onChange={(event) => updateField('nik', event.target.value)}
                                            />
                                            {errors.nik && <span className="mt-1 text-sm text-red-500">{errors.nik}</span>}
                                        </div>

                                        <div className="grid w-full items-start">
                                            <label className="mb-1.5 text-left text-base" htmlFor="name">Nama</label>
                                            <input
                                                className="w-full rounded-xl border border-[#D1D5DB] p-3 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                type="text"
                                                id="name"
                                                name="name"
                                                placeholder="Nama lengkap sesuai SK Pegawai"
                                                value={formData.name}
                                                onChange={(event) => updateField('name', event.target.value)}
                                            />
                                            {errors.name && <span className="mt-1 text-sm text-red-500">{errors.name}</span>}
                                        </div>

                                        <div className="grid w-full items-start">
                                            <label className="mb-1.5 text-left text-base" htmlFor="email">Email</label>
                                            <input
                                                className="w-full rounded-xl border border-[#D1D5DB] p-3 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                type="email"
                                                id="email"
                                                name="email"
                                                placeholder="email@kkp.go.id"
                                                value={formData.email}
                                                onChange={(event) => updateField('email', event.target.value)}
                                            />
                                            {errors.email && <span className="mt-1 text-sm text-red-500">{errors.email}</span>}
                                        </div>

                                        <div className="grid w-full items-start">
                                            <label className="mb-1.5 text-left text-base" htmlFor="eselon">Eselon</label>
                                            <select
                                                name="eselon"
                                                id="eselon"
                                                className="w-full rounded-xl border border-[#D1D5DB] p-3 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={formData.eselon}
                                                onChange={(event) => updateField('eselon', event.target.value)}
                                            >
                                                <option value="">Pilih Eselon</option>
                                                <option value="I">I</option>
                                                <option value="II">II</option>
                                                <option value="III">III</option>
                                                <option value="IV">IV</option>
                                            </select>
                                            {errors.eselon && <span className="mt-1 text-sm text-red-500">{errors.eselon}</span>}
                                        </div>

                                        <div className="grid w-full items-start">
                                            <label className="mb-1.5 text-left text-base" htmlFor="unitKerja">Unit Kerja</label>
                                            <select
                                                name="unitKerja"
                                                id="unitKerja"
                                                className="w-full rounded-xl border border-[#D1D5DB] p-3 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={formData.unitKerja}
                                                onChange={(event) => updateField('unitKerja', event.target.value)}
                                            >
                                                <option value="">Pilih Unit Kerja</option>
                                                <option value="Kantor Pusat">Kantor Pusat</option>
                                                <option value="BBP2B">BBP2B</option>
                                                <option value="Balai Besar">Balai Besar</option>
                                                <option value="Unit Lainnya">Unit Lainnya</option>
                                            </select>
                                            {errors.unitKerja && <span className="mt-1 text-sm text-red-500">{errors.unitKerja}</span>}
                                        </div>
                                    </div>
                                )}

                                {/* STEP 2: DETAIL KENDALA */}
                                {currentStep === 1 && (
                                    <div className="grid w-full grid-cols-1 gap-4 pt-4">
                                        <div className="grid w-full items-start">
                                            <label className="mb-1.5 text-left text-base" htmlFor="kategoriKendala">Kategori Kendala</label>
                                            <select
                                                id="kategoriKendala"
                                                name="kategoriKendala"
                                                className="w-full rounded-xl border border-[#D1D5DB] p-3 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={formData.kategoriKendala}
                                                onChange={(event) => updateField('kategoriKendala', event.target.value)}
                                            >
                                                <option value="">Pilih Kategori Kendala</option>
                                                <option value="Akses Sistem">Akses Sistem</option>
                                                <option value="Kegagalan Proses">Kegagalan Proses</option>
                                                <option value="Error Data">Error Data</option>
                                                <option value="Lainnya">Lainnya</option>
                                            </select>
                                            {errors.kategoriKendala && <span className="mt-1 text-sm text-red-500">{errors.kategoriKendala}</span>}
                                        </div>

                                        <div className="grid w-full items-start">
                                            <label className="mb-1.5 text-left text-base" htmlFor="detailKendala">Detail Kendala</label>
                                            <textarea
                                                id="detailKendala"
                                                name="detailKendala"
                                                rows="5"
                                                className="w-full rounded-xl border border-[#D1D5DB] p-3 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Jelaskan kronologi dan dampak masalah yang Anda alami"
                                                value={formData.detailKendala}
                                                onChange={(event) => updateField('detailKendala', event.target.value)}
                                            />
                                            {errors.detailKendala && <span className="mt-1 text-sm text-red-500">{errors.detailKendala}</span>}
                                        </div>

                                        <div className="grid w-full items-start">
                                            <label className="mb-1.5 text-left text-base" htmlFor="fileBukti">Bukti Pendukung (Opsional)</label>
                                            <input
                                                type="file"
                                                id="fileBukti"
                                                name="fileBukti"
                                                className="w-full rounded-xl border border-[#D1D5DB] p-3 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                onChange={(event) => updateField('fileBukti', event.target.files[0])}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* STEP 3: KONFIRMASI (Tabel Mode) */}
                                {currentStep === 2 && (
                                    <div className="w-full pt-4">
                                        {/* Bagian 1: Data Pegawai */}
                                        <div className="rounded-2xl border border-[#D1D5DB] bg-[#F9FAFB] p-5">
                                            <table className="w-full text-left border-collapse">
                                                <tbody>
                                                    <tr>
                                                        <td className="py-2 text-sm text-[#6B7280] w-[130px] sm:w-[200px] align-top">NIK</td>
                                                        <td className="py-2 text-sm text-[#6B7280] w-4 align-top">:</td>
                                                        <td className="py-2 text-base font-medium align-top">{formData.nik}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-2 text-sm text-[#6B7280] align-top">Nama</td>
                                                        <td className="py-2 text-sm text-[#6B7280] align-top">:</td>
                                                        <td className="py-2 text-base font-medium align-top">{formData.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-2 text-sm text-[#6B7280] align-top">Email</td>
                                                        <td className="py-2 text-sm text-[#6B7280] align-top">:</td>
                                                        <td className="py-2 text-base font-medium align-top">{formData.email}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-2 text-sm text-[#6B7280] align-top">Eselon</td>
                                                        <td className="py-2 text-sm text-[#6B7280] align-top">:</td>
                                                        <td className="py-2 text-base font-medium align-top">{formData.eselon}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-2 text-sm text-[#6B7280] align-top">Unit Kerja</td>
                                                        <td className="py-2 text-sm text-[#6B7280] align-top">:</td>
                                                        <td className="py-2 text-base font-medium align-top">{formData.unitKerja}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Bagian 2: Detail Kendala */}
                                        <div className="mt-4 rounded-2xl border border-[#D1D5DB] bg-[#F9FAFB] p-5">
                                            <table className="w-full text-left border-collapse">
                                                <tbody>
                                                    <tr>
                                                        <td className="py-2 text-sm text-[#6B7280] w-[130px] sm:w-[200px] align-top">Kategori Kendala</td>
                                                        <td className="py-2 text-sm text-[#6B7280] w-4 align-top">:</td>
                                                        <td className="py-2 text-base font-medium align-top">{formData.kategoriKendala}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-2 text-sm text-[#6B7280] align-top">Detail Kendala</td>
                                                        <td className="py-2 text-sm text-[#6B7280] align-top">:</td>
                                                        <td className="py-2 text-base leading-7 align-top">{formData.detailKendala}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-2 text-sm text-[#6B7280] align-top">Bukti Pendukung</td>
                                                        <td className="py-2 text-sm text-[#6B7280] align-top">:</td>
                                                        <td className="py-2 text-base font-medium align-top">
                                                            {formData.fileBukti ? formData.fileBukti.name : 'Tidak ada file yang diunggah'}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* ACTION BUTTONS */}
                                <div className="mt-6 flex w-full items-center justify-between gap-4">
                                    {currentStep > 0 ? (
                                        <button
                                            type="button"
                                            onClick={handlePrevStep}
                                            className="rounded-xl border border-[#D1D5DB] bg-white px-5 py-3 text-sm font-medium text-[#374151] hover:bg-[#F3F4F6]"
                                        >
                                            Kembali
                                        </button>
                                    ) : (
                                        <span />
                                    )}

                                    {/* Satu button submit untuk maju ke next step atau final submit */}
                                    <button
                                        type="submit"
                                        className="ml-auto rounded-xl bg-[#2093D6] px-6 py-3 text-sm font-medium text-white hover:bg-[#1b82be]"
                                    >
                                        {currentStep < steps.length - 1 ? 'Lanjutkan' : 'Kirim ke Sistem'}
                                    </button>
                                </div>
                            </>
                        ) : (
                            // SUCCESS PAGE
                            <div className="flex w-full flex-col items-center justify-center py-10 text-center">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#22C55E] text-3xl text-white">✓</div>
                                <h4 className="mb-1 text-2xl font-medium text-[#03215C]">Terima kasih!</h4>
                                <p className="mb-2 text-xl font-light text-[#374151]">Pengaduan Anda telah berhasil dikirim.</p>
                                <p className="text-base text-[#374151]">Nomor Tiket: <strong>#123456</strong></p>
                                <Link to="/" className="mt-6 inline-block rounded-xl bg-[#2093D6] px-6 py-3 text-sm font-medium text-white hover:bg-[#1b82be]">
                                    Kembali ke Beranda
                                </Link>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}