import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Certificate = ({ userName, issueDate }) => {
  const certificateRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(certificateRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${userName.replace(/\s+/g, '_')}_Certificate.pdf`);
    } catch (error) {
      console.error('Error generating PDF', error);
      alert('Could not download certificate. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Certificate Preview (Hidden from layout but used for capture) */}
      <div className="overflow-x-auto w-full flex justify-center mb-6">
        <div 
          ref={certificateRef}
          className="relative bg-white text-gray-800"
          style={{ width: '800px', height: '600px', padding: '40px', border: '10px solid #4f46e5', boxSizing: 'border-box', position: 'relative' }}
        >
          {/* Inner Border */}
          <div className="absolute inset-4 border-4 border-indigo-200" style={{ pointerEvents: 'none' }}></div>
          
          <div className="text-center h-full flex flex-col justify-center items-center">
            <h1 className="text-5xl font-serif font-bold text-indigo-700 mb-2 tracking-widest uppercase">Certificate</h1>
            <h2 className="text-2xl font-serif text-indigo-500 mb-10 uppercase tracking-widest">of Internship Completion</h2>
            
            <p className="text-gray-500 text-lg mb-4 italic">This is proudly presented to</p>
            <h3 className="text-4xl font-bold text-gray-800 mb-8 pb-2 border-b-2 border-indigo-400 inline-block px-10">
              {userName}
            </h3>
            
            <p className="text-gray-600 text-lg mb-12 max-w-lg leading-relaxed">
              In recognition of their outstanding performance and successful completion of the internship program. Their dedication, hard work, and valuable contributions are highly appreciated.
            </p>
            
            <div className="flex justify-between w-full px-12 mt-auto">
              <div className="text-center border-t-2 border-gray-300 pt-2 w-48">
                <p className="font-bold text-gray-700">{issueDate}</p>
                <p className="text-sm text-gray-500">Date of Issue</p>
              </div>
              <div className="text-center border-t-2 border-gray-300 pt-2 w-48">
                <p className="font-bold text-gray-700" style={{ fontFamily: 'cursive' }}>Admin</p>
                <p className="text-sm text-gray-500">Program Director</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={downloadCertificate}
        disabled={downloading}
        className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
        </svg>
        <span>{downloading ? 'Generating PDF...' : 'Download Certificate PDF'}</span>
      </button>
    </div>
  );
};

export default Certificate;
