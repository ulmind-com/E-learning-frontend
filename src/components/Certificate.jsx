import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, Loader2 } from 'lucide-react';

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
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Scaled Certificate Preview Container */}
      <div className="relative w-[400px] h-[300px] rounded-2xl overflow-hidden shadow-2xl border border-[var(--border-color)] group premium-card-hover bg-white mb-6">
        
        {/* Actual Certificate (800x600 scaled down to 400x300) */}
        <div 
          ref={certificateRef}
          className="absolute top-0 left-0 bg-white text-gray-800"
          style={{ 
            width: '800px', 
            height: '600px', 
            padding: '40px', 
            border: '10px solid #4f46e5', 
            boxSizing: 'border-box', 
            transform: 'scale(0.5)',
            transformOrigin: 'top left'
          }}
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

        {/* Download Overlay */}
        <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-10">
          <button 
            onClick={downloadCertificate}
            disabled={downloading}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transform hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center gap-2 border border-indigo-400/30"
          >
            {downloading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5 animate-bounce-subtle" />
            )}
            <span>{downloading ? 'Generating PDF...' : 'Download Certificate'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Certificate;

