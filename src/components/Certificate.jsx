import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, Loader2, Award } from 'lucide-react';

const Certificate = ({ userName, issueDate }) => {
  const certificateRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(certificateRef.current, { scale: 3, useCORS: true });
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '500px', margin: '0 auto' }}>
      
      {/* Scaled Certificate Preview Container */}
      <div 
        className="cert-preview-container"
        style={{ 
          position: 'relative', 
          width: '450px', 
          height: '337.5px', // 4:3 aspect ratio
          borderRadius: '16px', 
          overflow: 'hidden', 
          boxShadow: '0 20px 40px rgba(232, 124, 65, 0.15)', 
          border: '1px solid rgba(232, 124, 65, 0.2)',
          background: '#fff',
          marginBottom: '24px'
        }}
      >
        
        {/* Actual Certificate (1200x900 scaled down to 450x337.5) */}
        <div 
          ref={certificateRef}
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '1200px', 
            height: '900px', 
            background: '#ffffff',
            boxSizing: 'border-box', 
            transform: 'scale(0.375)', // 450 / 1200
            transformOrigin: 'top left',
            fontFamily: '"Times New Roman", Times, serif',
            color: '#1a1a1a',
            overflow: 'hidden'
          }}
        >
          {/* Certificate Background Pattern */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(rgba(232, 124, 65, 0.03) 2px, transparent 2px), linear-gradient(90deg, rgba(232, 124, 65, 0.03) 2px, transparent 2px)`,
            backgroundSize: '40px 40px',
            pointerEvents: 'none'
          }} />

          {/* Premium Borders */}
          <div style={{ position: 'absolute', inset: '40px', border: '12px solid #E87C41' }}>
            <div style={{ position: 'absolute', inset: '8px', border: '2px solid #F59E0B' }}></div>
            <div style={{ position: 'absolute', inset: '16px', border: '1px solid rgba(232, 124, 65, 0.3)' }}></div>
          </div>
          
          {/* Corner Accents */}
          <div style={{ position:'absolute', top:'40px', left:'40px', width:'60px', height:'60px', borderRight:'4px solid #fff', borderBottom:'4px solid #fff', background:'#E87C41' }}></div>
          <div style={{ position:'absolute', top:'40px', right:'40px', width:'60px', height:'60px', borderLeft:'4px solid #fff', borderBottom:'4px solid #fff', background:'#E87C41' }}></div>
          <div style={{ position:'absolute', bottom:'40px', left:'40px', width:'60px', height:'60px', borderRight:'4px solid #fff', borderTop:'4px solid #fff', background:'#E87C41' }}></div>
          <div style={{ position:'absolute', bottom:'40px', right:'40px', width:'60px', height:'60px', borderLeft:'4px solid #fff', borderTop:'4px solid #fff', background:'#E87C41' }}></div>

          <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '100px 80px', zIndex: 10 }}>
            
            <div style={{ marginBottom: '30px', color: '#E87C41' }}>
              <Award size={80} strokeWidth={1.5} />
            </div>

            <h1 style={{ fontSize: '72px', fontWeight: 900, color: '#111', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: 'Inter, sans-serif' }}>
              Certificate
            </h1>
            <h2 style={{ fontSize: '32px', fontWeight: 400, color: '#E87C41', margin: '0 0 60px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              of Internship Completion
            </h2>
            
            <p style={{ fontSize: '24px', color: '#555', margin: '0 0 20px', fontStyle: 'italic' }}>
              This is proudly presented to
            </p>
            
            <h3 style={{ fontSize: '64px', fontWeight: 700, color: '#000', margin: '0 0 50px', paddingBottom: '10px', borderBottom: '3px solid #E87C41', display: 'inline-block', padding: '0 60px', fontFamily: 'Inter, sans-serif' }}>
              {userName}
            </h3>
            
            <p style={{ fontSize: '24px', color: '#444', margin: '0 0 80px', maxWidth: '800px', textAlign: 'center', lineHeight: 1.8 }}>
              In recognition of their outstanding performance and successful completion of the internship program. Their dedication, hard work, and valuable contributions to the team are highly appreciated and commended.
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 60px', marginTop: 'auto' }}>
              <div style={{ textAlign: 'center', width: '250px' }}>
                <p style={{ fontSize: '28px', fontWeight: 700, color: '#222', margin: '0 0 10px', borderBottom: '2px solid #ccc', paddingBottom: '10px', fontFamily: 'Inter, sans-serif' }}>{issueDate}</p>
                <p style={{ fontSize: '18px', color: '#777', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Date of Issue</p>
              </div>
              
              {/* Badge/Seal */}
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, #E87C41, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', border: '6px solid #fff', boxShadow: '0 0 0 2px #E87C41', marginTop: '-40px' }}>
                <span style={{ fontSize: '14px', fontWeight: 800, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Inter, sans-serif' }}>Official<br/>Seal</span>
              </div>

              <div style={{ textAlign: 'center', width: '250px' }}>
                <p style={{ fontSize: '36px', fontWeight: 700, color: '#222', margin: '0 0 10px', borderBottom: '2px solid #ccc', paddingBottom: '10px', fontFamily: '"Brush Script MT", cursive, sans-serif' }}>Admin Signature</p>
                <p style={{ fontSize: '18px', color: '#777', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Program Director</p>
              </div>
            </div>

          </div>
        </div>

        {/* Download Overlay */}
        <div 
          className="cert-overlay"
          style={{ 
            position: 'absolute', inset: 0, background: 'rgba(5, 5, 5, 0.6)', backdropFilter: 'blur(3px)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
            opacity: 0, transition: 'opacity 0.3s ease', cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
          onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
        >
          <button 
            onClick={downloadCertificate}
            disabled={downloading}
            style={{
              padding: '14px 28px', background: '#E87C41', color: '#fff', border: 'none', borderRadius: '12px',
              fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(232, 124, 65, 0.4)', transition: 'transform 0.2s ease', fontFamily: 'Inter, sans-serif'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {downloading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Download size={20} />
            )}
            <span>{downloading ? 'Generating High-Res PDF...' : 'Download Certificate'}</span>
          </button>
        </div>
      </div>
      
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', margin: 0 }}>
        Hover over the certificate to download a high-resolution PDF copy.
      </p>

      <style>{`
        .cert-preview-container:hover .cert-overlay { opacity: 1 !important; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default Certificate;
