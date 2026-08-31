import { useState } from 'react';
import '../css/home.css';

export default function Faq({ children }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      question: "How do I submit a complaint?",
      answer: "Anda dapat mengajukan pengaduan langsung melalui sistem live chat ini dengan mengisi formulir pengaduan yang tersedia di panel chat."
    },
    {
      question: "What is the response time for complaints?",
      answer: "Tim kami biasanya merespons setiap pengaduan dalam waktu 10 hingga 30 menit pada jam kerja operasional."
    },
    {
      question: "How can I track my complaint status?",
      answer: "Setiap pengaduan akan mendapatkan nomor tiket unik. Anda bisa mengetikkan nomor tiket tersebut di kolom chat untuk melihat status terbaru."
    }
  ];

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      {children}
      <div className="faq-content">
        <h2>Pertanyaan yang Sering Diajukan</h2>
        
        {/* Kolom pencarian dengan class spesifik agar tidak merusak tombol FAQ */}
        <div className="faq-search-box">
          <input 
            type="search" 
            placeholder="Cari pertanyaan..." 
            className="faq-search-input" 
          />
          <button className="faq-search-btn">Cari</button>
        </div>
        
        <ul className="faq-list">
          {faqData.map((item, index) => {
            const isOpen = activeIndex === index;
            return (
              <li key={index} className="faq-item">
                <button className="faq-question" onClick={() => toggleFaq(index)}>
                  <span>{item.question}</span>
                  <span className="faq-icon">{isOpen ? '−' : '+'}</span>
                </button>
                <div className={`faq-answer ${isOpen ? 'show' : ''}`}>
                  <p>{item.answer}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
