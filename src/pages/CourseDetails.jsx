import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  Lock,
  Play,
  ShoppingCart,
  CheckCircle,
  Loader2,
  AlertCircle,
  User as UserIcon,
  Clock,
  BarChart3,
  Tag,
  Star,
  MessageSquare,
  Award,
  X,
  Download,
  ClipboardList,
  Send,
  ChevronDown,
  FileText,
  Brain
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const API_URL = 'https://e-learning-backend-1-r539.onrender.com/api';

const LEVEL_COLORS = {
  beginner: '#22c55e',
  intermediate: '#eab308',
  advanced: '#ef4444',
};

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [completedVideos, setCompletedVideos] = useState([]);
  
  // Review states
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(3);

  // Certificate states
  const [certificateHtml, setCertificateHtml] = useState(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [generatingCertificate, setGeneratingCertificate] = useState(false);
  const [downloadingCertificate, setDownloadingCertificate] = useState(false);

  // Mock Test states
  const [mockTestResults, setMockTestResults] = useState([]);
  const [activeMockTest, setActiveMockTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [mockTestScore, setMockTestScore] = useState(null);
  const [submittingMockTest, setSubmittingMockTest] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Analytics states
  const [videoStartTime, setVideoStartTime] = useState(null);
  const [speedSamples, setSpeedSamples] = useState([]);
  const [skipCount, setSkipCount] = useState(0);
  const [hasSkipped, setHasSkipped] = useState(false);
  const [lastSeekTime, setLastSeekTime] = useState(0);
  const [certificateRequestStatus, setCertificateRequestStatus] = useState(null);

  // Doubt states
  const [doubts, setDoubts] = useState([]);
  const [doubtText, setDoubtText] = useState('');
  const [doubtFile, setDoubtFile] = useState(null);
  const [submittingDoubt, setSubmittingDoubt] = useState(false);
  const [fetchingDoubts, setFetchingDoubts] = useState(false);

  // Accordion state
  const [openChapters, setOpenChapters] = useState({ 0: true });

  const toggleChapter = (idx) => {
    setOpenChapters(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const fetchCourse = async () => {
    try {
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const { data } = await axios.get(`${API_URL}/courses/${id}`, config);
      setCourse(data);

      if (token) {
        try {
          const progRes = await axios.get(`${API_URL}/courses/${id}/progress`, config);
          setCompletedVideos(progRes.data.completedVideos || []);
          setCertificateHtml(progRes.data.certificate || null);
          setCertificateRequestStatus(progRes.data.certificateRequestStatus || null);
          setMockTestResults(progRes.data.mockTestResults || []);
        } catch (e) {
          console.error('Failed to load progress', e);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id, token]);

  useEffect(() => {
    // Reset analytics when changing video
    setVideoStartTime(null);
    setSpeedSamples([]);
    setSkipCount(0);
    setHasSkipped(false);
    setLastSeekTime(0);
  }, [currentVideoIndex]);



  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timerActive && timeLeft === 0) {
      handleMockTestSubmit();
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // â”€â”€â”€ Direct Enroll Handler â”€â”€â”€
  const handleBuyNow = () => {
    if (!user || !token) return;
    setShowEnrollModal(true);
  };

  const executeEnrollment = async () => {
    try {
      setPaymentLoading(true);
      await axios.post(
        `${API_URL}/payment/enroll`,
        { courseId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCourse();
      setShowEnrollModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setPaymentLoading(false);
    }
  };

  // YouTube embed helper
  const getEmbedUrl = (url) => {
    if (!url) return null;
    const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
    if (url.includes('youtube.com/embed/')) return url;
    return url;
  };

  const isPurchased = course?.isPurchased;
  const isFree = course?.courseType === 'free';
  const flatVideos = course?.chapters?.reduce((acc, chap) => [...acc, ...chap.videos], []) || (course?.videos || []);
  const currentVideo = flatVideos.length > 0 ? flatVideos[currentVideoIndex] : null;
  const embedUrl = currentVideo ? getEmbedUrl(currentVideo.videoUrl) : null;
  const isYouTube = embedUrl && embedUrl.includes('youtube.com/embed/');

  const fetchDoubts = async (videoUrl) => {
    try {
      setFetchingDoubts(true);
      const { data } = await axios.get(`${API_URL}/doubts/video`, {
        params: { url: videoUrl },
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoubts(data);
    } catch (e) {
      console.error('Failed to fetch doubts', e);
    } finally {
      setFetchingDoubts(false);
    }
  };

  useEffect(() => {
    if (currentVideo && token && (course?.isPurchased || course?.courseType === 'free')) {
      fetchDoubts(currentVideo.videoUrl);
    }
  }, [currentVideo, token, course]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Loader2 className="h-10 w-10 animate-spin" style={{ color: 'var(--accent)' }} />
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <AlertCircle className="h-16 w-16 mb-4" style={{ color: 'var(--danger)' }} />
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Course Not Found</h2>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>{error}</p>
        <Link to="/" className="flex items-center space-x-1 transition-colors" style={{ color: 'var(--accent)' }}>
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Courses</span>
        </Link>
      </div>
    );
  }

  const handleDoubtSubmit = async (e) => {
    e.preventDefault();
    if (!doubtText.trim()) return;
    
    try {
      setSubmittingDoubt(true);
      let mediaUrl = null;
      
      if (doubtFile) {
        const formData = new FormData();
        if (doubtFile.type.startsWith('video/')) {
          formData.append('video', doubtFile);
          const uploadRes = await axios.post(`${API_URL}/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
          });
          mediaUrl = uploadRes.data.videoUrl;
        } else {
          formData.append('document', doubtFile);
          const uploadRes = await axios.post(`${API_URL}/upload/document`, formData, {
            headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
          });
          mediaUrl = uploadRes.data.documentUrl;
        }
      }

      await axios.post(`${API_URL}/doubts`, {
        courseId: id,
        videoUrl: currentVideo.videoUrl,
        questionText: doubtText,
        questionMedia: mediaUrl
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setDoubtText('');
      setDoubtFile(null);
      fetchDoubts(currentVideo.videoUrl);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit doubt');
    } finally {
      setSubmittingDoubt(false);
    }
  };

  const progressPercentage = flatVideos.length > 0
    ? Math.round((completedVideos.length / flatVideos.length) * 100)
    : 0;

  const handlePlay = () => {
    if (!videoStartTime) setVideoStartTime(Date.now());
  };

  const handleRateChange = (e) => {
    setSpeedSamples(prev => [...prev, e.target.playbackRate]);
  };

  const handleSeeked = (e) => {
    const currentTime = e.target.currentTime;
    if (currentTime > lastSeekTime + 2) {
      setHasSkipped(true);
      setSkipCount(prev => prev + 1);
    }
    setLastSeekTime(currentTime);
  };

  const handleVideoEnded = async () => {
    if (!user || !token || !currentVideo || !currentVideo._id) return;
    
    try {
      const avgSpeed = speedSamples.length > 0 ? (speedSamples.reduce((a, b) => a + b, 0) / speedSamples.length) : 1;
      const watchDuration = videoStartTime ? (Date.now() - videoStartTime) / 1000 : 0;
      
      const analyticsPayload = {
        watchTime: watchDuration,
        averageSpeed: avgSpeed,
        skipped: hasSkipped,
        skipCount: skipCount
      };

      const { data } = await axios.post(
        `${API_URL}/courses/${id}/progress`,
        { videoId: currentVideo._id, analytics: analyticsPayload },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompletedVideos(data.completedVideos);
    } catch (err) {
      console.error('Failed to update progress', err);
    }
    
    // Reset analytics for replay or next video
    setVideoStartTime(null);
    setSpeedSamples([]);
    setSkipCount(0);
    setHasSkipped(false);
    setLastSeekTime(0);
  };

  const handleRequestCertificate = async () => {
    try {
      setGeneratingCertificate(true);
      setError('');
      const { data } = await axios.post(`${API_URL}/courses/${id}/certificate/request`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCertificateRequestStatus('pending');
      // Show success toast or something? We'll just rely on the UI update
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request certificate');
    } finally {
      setGeneratingCertificate(false);
    }
  };

  // â”€â”€â”€ Mock Test Handlers â”€â”€â”€
  const handleStartMockTest = (test) => {
    setActiveMockTest(test);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setMockTestScore(null);
    setTimeLeft(test.timeLimit * 60);
    setTimerActive(true);
  };

  const handleOptionSelect = (optionIndex) => {
    setUserAnswers({ ...userAnswers, [currentQuestionIndex]: optionIndex });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < activeMockTest.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleMockTestSubmit = async () => {
    setTimerActive(false);
    setSubmittingMockTest(true);
    
    // Calculate score
    let score = 0;
    activeMockTest.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswerIndex) {
        score += 1;
      }
    });

    setMockTestScore(score);

    // Save to backend
    try {
      const timeTaken = (activeMockTest.timeLimit * 60) - timeLeft;
      await axios.post(
        `${API_URL}/courses/${id}/mock-test/${activeMockTest._id}/submit`,
        { score, totalQuestions: activeMockTest.questions.length, timeTaken },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh progress to get updated results
      const progRes = await axios.get(`${API_URL}/courses/${id}/progress`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMockTestResults(progRes.data.mockTestResults || []);
    } catch (err) {
      console.error('Failed to submit mock test score', err);
    } finally {
      setSubmittingMockTest(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleDownloadCertificate = async () => {
    try {
      setDownloadingCertificate(true);
      const element = document.getElementById('certificate-content');
      if (!element) return;
      
      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true,
        allowTaint: true
      });
      const imgData = canvas.toDataURL('image/png');
      
      // A4 Landscape: 297mm x 210mm
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${course.title.replace(/\s+/g, '_')}_Certificate.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to download certificate. Please try again.');
    } finally {
      setDownloadingCertificate(false);
    }
  };

  const myReview = course?.reviews?.find(r => r.user === user?._id);

  const openReviewModal = () => {
    if (myReview) {
      setRating(myReview.rating);
      setComment(myReview.comment);
    } else {
      setRating(0);
      setComment('');
    }
    setShowReviewModal(true);
  };

  const handleReviewSubmit = async () => {
    if (rating === 0 || !comment.trim()) {
      setError('Please provide a rating and a comment.');
      setShowReviewModal(false);
      return;
    }
    setReviewLoading(true);
    try {
      await axios.post(
        `${API_URL}/courses/${id}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCourse();
      setShowReviewModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
      setShowReviewModal(false);
    } finally {
      setReviewLoading(false);
    }
  };

  const getFullVideoUrl = (url) => {
    if (url && url.startsWith('/uploads')) {
      return `https://e-learning-backend-1-r539.onrender.com${url}`;
    }
    return url;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-10 px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center space-x-1 text-sm mb-6 transition-colors animate-slide-left"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Courses</span>
        </Link>

        {/* Error alert */}
        {error && (
          <div
            className="flex items-center space-x-2 px-4 py-3 rounded-xl text-sm mb-6 animate-slide-down"
            style={{ backgroundColor: 'var(--danger-bg)', border: '1px solid var(--danger)', color: 'var(--danger)' }}
          >
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Video + Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video / Locked Section */}
            <div className="rounded-xl overflow-hidden animate-scale-in" style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
              {(isPurchased || isFree) && currentVideo ? (
                isYouTube ? (
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      src={embedUrl}
                      title={currentVideo.title || course.title}
                      className="absolute top-0 left-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <video 
                    controls 
                    className="w-full aspect-video bg-black" 
                    src={getFullVideoUrl(currentVideo.videoUrl)}
                    onPlay={handlePlay}
                    onRateChange={handleRateChange}
                    onSeeked={handleSeeked}
                    onEnded={handleVideoEnded}
                  >
                    Your browser does not support the video tag.
                  </video>
                )
              ) : (
                <div className="relative flex flex-col items-center justify-center aspect-video" style={{ background: 'var(--gradient-hero)' }}>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: 'var(--accent-glow-strong)' }}></div>
                  </div>
                  <div className="relative z-10 flex flex-col items-center animate-float">
                    <div className="p-4 rounded-full mb-4" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                      <Lock className="h-10 w-10" style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      Video Locked
                    </h3>
                    <p className="text-sm text-center max-w-sm" style={{ color: 'var(--text-secondary)' }}>
                      Purchase this course to unlock the full video content.
                    </p>
                  </div>
                </div>
              )}
              {/* Current Video Info */}
              {(isPurchased || isFree) && currentVideo && (
                <div className="p-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{currentVideo.title}</h3>
                      {currentVideo.duration && (
                        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Duration: {currentVideo.duration}</p>
                      )}
                    </div>
                    {/* Mark as Completed Button (Useful for YouTube videos that don't auto-trigger) */}
                    {!completedVideos.includes(currentVideo._id) ? (
                      <button 
                        onClick={handleVideoEnded}
                        className="flex items-center space-x-1 text-xs px-3 py-1.5 rounded-full border transition-colors hover:bg-[var(--accent-glow)] btn-press"
                        style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
                      >
                        <CheckCircle className="h-3 w-3" />
                        <span>Mark Completed</span>
                      </button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-gray-400">Watched again?</span>
                        <button 
                          onClick={handleVideoEnded}
                          className="flex items-center space-x-1 text-xs px-3 py-1.5 rounded-full transition-colors hover:bg-green-100 dark:hover:bg-green-900/40 btn-press" 
                          style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span className="font-semibold">Save Analytics</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Solve Your Doubt Section */}
            {(isPurchased || isFree) && currentVideo && token && (
              <div className="rounded-xl p-6 md:p-8 animate-slide-up mt-8" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <div className="flex items-center space-x-2 mb-6">
                  <MessageSquare className="h-6 w-6" style={{ color: 'var(--accent)' }} />
                  <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Solve Your Doubt</h3>
                </div>
                
                <form onSubmit={handleDoubtSubmit} className="mb-8">
                  <textarea
                    value={doubtText}
                    onChange={(e) => setDoubtText(e.target.value)}
                    placeholder="Ask your doubt here..."
                    className="w-full p-4 rounded-xl mb-4 text-sm resize-none focus:outline-none"
                    style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                    rows={4}
                    required
                  ></textarea>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => setDoubtFile(e.target.files[0])}
                      className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20 cursor-pointer"
                    />
                    <button
                      type="submit"
                      disabled={submittingDoubt || !doubtText.trim()}
                      className="px-6 py-2 rounded-xl text-sm font-semibold text-white transition-all shadow-lg flex items-center space-x-2 btn-press disabled:opacity-50"
                      style={{ backgroundImage: 'linear-gradient(to right, var(--accent), var(--accent-hover))' }}
                    >
                      {submittingDoubt ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      <span>Submit Doubt</span>
                    </button>
                  </div>
                </form>

                {fetchingDoubts ? (
                  <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin" style={{ color: 'var(--text-muted)' }} /></div>
                ) : doubts.length > 0 ? (
                  <div className="space-y-4">
                    <h4 className="font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>Previous Doubts</h4>
                    {doubts.map(doubt => (
                      <div key={doubt._id} className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold text-white shadow-sm" style={{ backgroundColor: 'var(--accent)' }}>
                              {doubt.student?.profileImage ? <img src={doubt.student.profileImage} className="w-full h-full object-cover" /> : doubt.student?.name?.charAt(0)}
                            </div>
                            <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{doubt.student?.name}</span>
                          </div>
                          <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${doubt.status === 'solved' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                            {doubt.status === 'solved' ? 'Solved' : 'Pending'}
                          </span>
                        </div>
                        <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{doubt.questionText}</p>
                        {doubt.questionMedia && (
                          <div className="mb-3">
                            {doubt.questionMedia.match(/\.(mp4|webm|ogg)$/i) ? (
                              <video src={`https://e-learning-backend-1-r539.onrender.com${doubt.questionMedia}`} controls className="max-w-sm w-full rounded-lg" style={{ border: '1px solid var(--border-color)' }} />
                            ) : (
                              <img src={`https://e-learning-backend-1-r539.onrender.com${doubt.questionMedia}`} alt="Doubt media" className="max-w-sm w-full rounded-lg object-contain" style={{ border: '1px solid var(--border-color)' }} />
                            )}
                          </div>
                        )}
                        
                        {doubt.status === 'solved' && (
                          <div className="mt-4 p-4 rounded-xl border" style={{ backgroundColor: 'rgba(99,102,241,0.05)', borderColor: 'rgba(99,102,241,0.2)' }}>
                            <div className="flex items-center space-x-2 mb-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <h5 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>Admin Reply</h5>
                            </div>
                            <p className="text-sm mb-3" style={{ color: 'var(--text-primary)' }}>{doubt.adminReplyText}</p>
                            {doubt.adminReplyMedia && (
                              <div>
                                {doubt.adminReplyMedia.match(/\.(mp4|webm|ogg)$/i) ? (
                                  <video src={`https://e-learning-backend-1-r539.onrender.com${doubt.adminReplyMedia}`} controls className="max-w-sm w-full rounded-lg border border-indigo-500/20" />
                                ) : (
                                  <img src={`https://e-learning-backend-1-r539.onrender.com${doubt.adminReplyMedia}`} alt="Admin reply media" className="max-w-sm w-full rounded-lg object-contain border border-indigo-500/20" />
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-center py-6" style={{ color: 'var(--text-muted)' }}>No doubts asked yet. Be the first to ask!</p>
                )}
              </div>
            )}

        {/* Course Info */}
        <div className="rounded-xl p-6 md:p-8 animate-slide-up" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              {/* Badges */}
              <div className="flex items-center flex-wrap gap-2 mb-4">
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-semibold"
                  style={{
                    backgroundColor: isFree ? 'rgba(34,197,94,0.12)' : 'var(--accent-glow)',
                    color: isFree ? '#22c55e' : 'var(--accent)',
                    border: `1px solid ${isFree ? 'rgba(34,197,94,0.3)' : 'rgba(99,102,241,0.3)'}`,
                  }}
                >
                  {isFree ? 'FREE' : 'PAID'}
                </span>
                {course.level && (
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{
                      backgroundColor: `${LEVEL_COLORS[course.level]}15`,
                      color: LEVEL_COLORS[course.level],
                      border: `1px solid ${LEVEL_COLORS[course.level]}30`,
                    }}
                  >
                    {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                  </span>
                )}
                {course.category && course.category !== 'General' && (
                  <span
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--text-secondary)' }}
                  >
                    {course.category}
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                {course.title}
              </h1>

              {/* Progress Bar & Certificate */}
              {(isPurchased || isFree) && token && user?.role !== 'admin' && (
                <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
                  <div className="flex justify-between text-sm mb-2">
                    <span style={{ color: 'var(--text-secondary)' }}>Course Progress</span>
                    <span className="font-bold" style={{ color: 'var(--accent)' }}>{progressPercentage}%</span>
                  </div>
                  <div className="w-full rounded-full h-2.5 overflow-hidden mb-4" style={{ backgroundColor: 'var(--border-color)' }}>
                    <div 
                      className="h-2.5 rounded-full transition-all duration-1000 ease-out" 
                      style={{ 
                        width: `${progressPercentage}%`, 
                        backgroundColor: 'var(--accent)',
                        boxShadow: '0 0 10px var(--accent-glow-strong)' 
                      }}
                    ></div>
                  </div>
                  
                  {progressPercentage === 100 && (
                    <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
                      <div className="flex items-center space-x-2">
                        <Award className="h-6 w-6 text-yellow-500" />
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Congratulations! You've completed the course.</span>
                      </div>
                      {certificateHtml ? (
                        <button
                          onClick={() => setShowCertificateModal(true)}
                          className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all shadow-lg flex items-center space-x-2 btn-press"
                          style={{ backgroundColor: '#22c55e' }}
                        >
                          <Award className="h-4 w-4" />
                          <span>View Certificate</span>
                        </button>
                      ) : certificateRequestStatus === 'pending' ? (
                        <button
                          disabled
                          className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all shadow-lg flex items-center space-x-2 opacity-70 cursor-not-allowed"
                          style={{ backgroundColor: '#eab308' }}
                        >
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Pending Admin Approval</span>
                        </button>
                      ) : (
                        <button
                          onClick={handleRequestCertificate}
                          disabled={generatingCertificate}
                          className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all shadow-lg flex items-center space-x-2 btn-press disabled:opacity-70"
                          style={{ backgroundImage: 'linear-gradient(to right, var(--accent), var(--accent-hover))' }}
                        >
                          {generatingCertificate ? <Loader2 className="h-4 w-4 animate-spin" /> : <Award className="h-4 w-4" />}
                          <span>Request Certificate</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Meta row */}
              <div className="flex items-center flex-wrap gap-4 text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                {course.instructor && (
                  <div className="flex items-center space-x-1.5">
                    <UserIcon className="h-4 w-4" style={{ color: 'var(--accent)' }} />
                    <span>By <span style={{ color: 'var(--text-secondary)' }}>{course.instructor.name}</span></span>
                  </div>
                )}
                {course.duration && (
                  <div className="flex items-center space-x-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1.5">
                  <Star className="h-4 w-4" style={{ color: '#eab308', fill: '#eab308' }} />
                  <span>{course.rating ? course.rating.toFixed(1) : 0} ({course.numReviews || 0} reviews)</span>
                </div>
              </div>

              <p className="leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
                {course.description}
              </p>
            </div>

            {/* Purchase Card */}
            <div className="md:w-72 shrink-0">
              <div className="rounded-xl p-5 sticky top-24" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                <p className="text-3xl font-bold mb-1" style={{ color: isFree ? '#22c55e' : 'var(--text-primary)' }}>
                  {isFree ? 'Free' : `$${course.price}`}
                </p>
                <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
                  {isFree ? 'Free access' : 'One-time payment'}
                </p>

                {isPurchased || isFree ? (
                  <div
                    className="flex items-center space-x-2 px-4 py-3 rounded-lg text-sm"
                    style={{ backgroundColor: 'var(--success-bg)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e' }}
                  >
                    <CheckCircle className="h-5 w-5 shrink-0" />
                    <span>{isFree ? 'Free access' : 'You own this course'}</span>
                  </div>
                ) : user ? (
                  <button
                    onClick={handleBuyNow}
                    disabled={paymentLoading}
                    className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white py-3 px-4 rounded-lg font-medium text-sm transition-all focus:outline-none shadow-lg flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-55 btn-press"
                  >
                    {paymentLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5" />
                        <span>Buy Now</span>
                      </>
                    )}
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white py-3 px-4 rounded-lg font-medium text-sm transition-all shadow-lg flex items-center justify-center space-x-2 no-underline btn-press"
                  >
                    <Play className="h-5 w-5" />
                    <span>Login to Purchase</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="rounded-xl p-6 md:p-8 animate-slide-up" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
              <MessageSquare className="h-6 w-6" style={{ color: 'var(--accent)' }} />
              <span>Student Reviews</span>
            </h2>
            {(isPurchased || isFree) && user && user?.role !== 'admin' && (
              <button
                onClick={openReviewModal}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[var(--accent-glow)] flex items-center space-x-2 btn-press"
                style={{ color: 'var(--accent)', border: '1px solid var(--accent)' }}
              >
                <Star className="h-4 w-4" />
                <span>{myReview ? 'Edit Review' : 'Write Review'}</span>
              </button>
            )}
          </div>

          {(!course.reviews || course.reviews.length === 0) ? (
            <p className="text-center py-8" style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first to review this course!</p>
          ) : (
            <div className="space-y-6">
              {course.reviews.slice(0, visibleReviews).map((review) => (
                <div key={review._id} className="p-4 rounded-xl relative" style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
                  {review.user === user?._id && (
                    <div className="absolute -top-3 -right-3 text-xs px-2 py-1 rounded-full shadow-md bg-[var(--accent)] text-white">Your Review</div>
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg" style={{ background: 'var(--gradient-hero)' }}>
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{review.name}</h4>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4" style={{ color: star <= review.rating ? '#eab308' : 'var(--border-color)', fill: star <= review.rating ? '#eab308' : 'none' }} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{review.comment}</p>
                </div>
              ))}

              {course.reviews.length > visibleReviews && (
                <div className="text-center mt-6">
                  <button
                    onClick={() => setVisibleReviews((prev) => prev + 3)}
                    className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:bg-[var(--bg-input)] btn-press"
                    style={{ border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  >
                    Load More Comments
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        </div>
          
        {/* Sidebar Content */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Chapters Sidebar */}
            {course.chapters && course.chapters.length > 0 ? (
              <div className="sticky top-24 space-y-4 animate-slide-left">
                {course.chapters.map((chapter, cIdx) => (
                  <div key={cIdx} className="rounded-2xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-lg" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: openChapters[cIdx] ? '0 10px 30px rgba(99,102,241,0.1)' : '' }}>
                    <div 
                      className="p-5 cursor-pointer transition-colors relative group" 
                      style={{ 
                        backgroundColor: openChapters[cIdx] ? 'var(--accent-glow)' : 'var(--bg-secondary)',
                        borderBottom: openChapters[cIdx] ? '1px solid var(--border-color)' : 'none'
                      }} 
                      onClick={() => toggleChapter(cIdx)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-lg transition-colors" style={{ color: openChapters[cIdx] ? 'var(--accent)' : 'var(--text-primary)' }}>{chapter.title}</h3>
                          <p className="text-xs mt-1.5 font-medium flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                            <span className="flex items-center gap-1"><Play className="h-3.5 w-3.5" /> {chapter.videos.length} Videos</span>
                            <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                            <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> {chapter.notes.length} Notes</span>
                            <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                            <span className="flex items-center gap-1"><Brain className="h-3.5 w-3.5" /> {chapter.mockTests.length} Tests</span>
                          </p>
                        </div>
                        <div className="flex-shrink-0 ml-4 p-2 rounded-full transition-all duration-300" style={{ backgroundColor: openChapters[cIdx] ? 'var(--accent)' : 'var(--bg-card)', color: openChapters[cIdx] ? '#fff' : 'var(--text-muted)' }}>
                          <ChevronDown className={`h-5 w-5 transition-transform duration-500 ease-in-out ${openChapters[cIdx] ? 'rotate-180' : 'rotate-0'}`} />
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className={`transition-all duration-500 ease-in-out overflow-hidden ${openChapters[cIdx] ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                      <div className="max-h-[50vh] overflow-y-auto custom-scrollbar bg-[var(--bg-card)]">
                      {/* Videos */}
                      {chapter.videos.length > 0 && (
                        <div className="px-4 py-2 border-b border-[var(--border-color)]" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                           <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Videos</span>
                        </div>
                      )}
                      {chapter.videos.map((vid, vIdx) => {
                        let globalIdx = 0;
                        for(let i=0; i<cIdx; i++) globalIdx += course.chapters[i].videos.length;
                        globalIdx += vIdx;
                        return (
                          <button
                            key={`v-${vIdx}`}
                            onClick={() => setCurrentVideoIndex(globalIdx)}
                            disabled={!isPurchased && !isFree}
                            className="w-full flex items-start space-x-4 p-4 text-left transition-all border-b last:border-b-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group hover:bg-[var(--accent-glow)]"
                            style={{
                              backgroundColor: currentVideoIndex === globalIdx ? 'var(--accent-glow)' : 'transparent',
                              borderColor: 'var(--border-color)',
                              borderLeft: currentVideoIndex === globalIdx ? '4px solid var(--accent)' : '4px solid transparent'
                            }}
                          >
                            <div className="mt-1 flex-shrink-0 relative">
                              {(!isPurchased && !isFree) ? (
                                <Lock className="h-4 w-4 text-gray-400" />
                              ) : (
                                <>
                                  <Play className="h-4 w-4 transition-colors" style={{ color: currentVideoIndex === globalIdx ? 'var(--accent)' : 'var(--text-muted)' }} />
                                  {completedVideos.includes(vid._id) && (
                                    <div className="absolute -top-1.5 -right-2 bg-white dark:bg-gray-800 rounded-full p-[2px] shadow-sm">
                                      <CheckCircle className="h-3 w-3 text-green-500" style={{ fill: 'currentColor' }} />
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold group-hover:text-[var(--accent)] transition-colors line-clamp-2" style={{ color: currentVideoIndex === globalIdx ? 'var(--accent)' : 'var(--text-primary)' }}>
                                {vid.title}
                              </h4>
                              {vid.duration && (
                                <div className="flex items-center space-x-1 mt-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                                  <Clock className="h-3 w-3" />
                                  <span>{vid.duration}</span>
                                </div>
                              )}
                            </div>
                          </button>
                        )
                      })}

                      {/* Notes */}
                      {chapter.notes.length > 0 && (
                        <div className="px-4 py-2 border-b border-[var(--border-color)]" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                           <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Notes</span>
                        </div>
                      )}
                      {chapter.notes.map((note, nIdx) => (
                         <a href={note.fileUrl} target="_blank" rel="noreferrer" key={`n-${nIdx}`} className="w-full flex items-start space-x-4 p-4 text-left transition-all border-b last:border-b-0 cursor-pointer group hover:bg-[var(--accent-glow)]" style={{ borderColor: 'var(--border-color)' }}>
                           <div className="mt-1 flex-shrink-0">
                             <FileText className="h-4 w-4 transition-colors" style={{ color: 'var(--accent)' }} />
                           </div>
                           <div>
                             <h4 className="text-sm font-semibold group-hover:text-[var(--accent)] transition-colors line-clamp-2" style={{ color: 'var(--text-primary)' }}>{note.title}</h4>
                             <span className="text-xs mt-1 block font-medium" style={{ color: 'var(--text-muted)' }}>View Document</span>
                           </div>
                         </a>
                      ))}

                      {/* Mock Tests */}
                      {chapter.mockTests.length > 0 && (
                        <div className="px-4 py-2 border-b border-[var(--border-color)]" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                           <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Mock Tests</span>
                        </div>
                      )}
                      {chapter.mockTests.map((test, mtIdx) => {
                        const result = mockTestResults.find(r => r.mockTestId === test._id);
                        return (
                          <div key={`mt-${mtIdx}`} className="p-4 border-b last:border-b-0 transition-all hover:bg-[var(--accent-glow)] group" style={{ borderColor: 'var(--border-color)' }}>
                            <div className="flex items-start space-x-4">
                              <div className="mt-1 flex-shrink-0"><Brain className="h-4 w-4 transition-colors" style={{ color: 'var(--accent)' }} /></div>
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold group-hover:text-[var(--accent)] transition-colors line-clamp-2" style={{ color: 'var(--text-primary)' }}>{test.title}</h4>
                                <div className="flex space-x-3 mt-1.5 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                                  <span>{test.questions.length} Qs</span>
                                  <span>{test.timeLimit}m</span>
                                </div>
                                {result ? (
                                  <div className="mt-3 flex justify-between items-center py-2 px-3 rounded-lg shadow-sm" style={{ backgroundColor: 'var(--success-bg)', border: '1px solid rgba(34,197,94,0.3)' }}>
                                    <span className="text-xs font-bold" style={{ color: '#22c55e' }}>Score: {Math.round((result.score/result.totalQuestions)*100)}%</span>
                                    <button onClick={() => handleStartMockTest(test)} className="text-xs font-bold transition-colors hover:opacity-80" style={{ color: '#22c55e' }}>Retake</button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleStartMockTest(test)}
                                    disabled={!isPurchased && !isFree}
                                    className="mt-3 w-full py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 btn-press"
                                    style={{ backgroundColor: 'var(--accent)' }}
                                  >
                                    {!isPurchased && !isFree ? 'Enroll to take test' : 'Start Test'}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}

                      {/* Live Classes */}
                      {chapter.liveClasses && chapter.liveClasses.length > 0 && (
                        <div className="px-4 py-2 border-b border-[var(--border-color)]" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                           <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Live Classes</span>
                        </div>
                      )}
                      {chapter.liveClasses && chapter.liveClasses.map((lc, lcIdx) => {
                        const isUpcoming = lc.status === 'scheduled';
                        const isLive = lc.status === 'live';
                        return (
                          <div key={`lc-${lcIdx}`} className="p-4 border-b last:border-b-0 transition-all hover:bg-[var(--accent-glow)] group" style={{ borderColor: 'var(--border-color)' }}>
                            <div className="flex items-start space-x-4">
                              <div className="mt-1 flex-shrink-0">
                                {isLive ? (
                                  <div className="h-4 w-4 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]" style={{ backgroundColor: '#ef4444' }} title="Live Now!"></div>
                                ) : (
                                  <Clock className="h-4 w-4 transition-colors" style={{ color: 'var(--accent)' }} />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold group-hover:text-[var(--accent)] transition-colors line-clamp-2" style={{ color: 'var(--text-primary)' }}>{lc.title}</h4>
                                <div className="flex space-x-3 mt-1.5 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                                  <span>{new Date(lc.date).toLocaleString()}</span>
                                </div>
                                <button
                                  onClick={() => navigate(`/live/${course._id}/${chapter._id}/${lc._id}`)}
                                  disabled={(!isPurchased && !isFree) || lc.status === 'ended'}
                                  className={`mt-3 w-full py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 btn-press`}
                                  style={{ backgroundColor: isLive ? '#ef4444' : 'var(--accent)' }}
                                >
                                  {(!isPurchased && !isFree) ? 'Enroll to join' : lc.status === 'ended' ? 'Ended' : isLive ? 'Join Live Class' : 'Enter Waiting Room'}
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
              {/* Legacy Flat Sidebar */}
              {(course.videos && course.videos.length > 0) && (
                <div className="rounded-xl overflow-hidden sticky top-24 animate-slide-left" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                  <div className="p-4" style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                    <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Course Content</h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{course.videos.length} videos</p>
                  </div>
                  <div className="max-h-[50vh] overflow-y-auto">
                    {course.videos.map((vid, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentVideoIndex(idx)}
                        disabled={!isPurchased && !isFree}
                        className="w-full flex items-start space-x-4 p-4 text-left transition-all border-b last:border-b-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group hover:bg-[var(--accent-glow)]"
                        style={{
                          backgroundColor: currentVideoIndex === idx ? 'var(--accent-glow)' : 'transparent',
                          borderColor: 'var(--border-color)',
                          borderLeft: currentVideoIndex === idx ? '4px solid var(--accent)' : '4px solid transparent'
                        }}
                      >
                        <div className="mt-1 flex-shrink-0 relative">
                          {(!isPurchased && !isFree) ? (
                            <Lock className="h-4 w-4 text-gray-400" />
                          ) : (
                            <>
                              <Play className="h-4 w-4 transition-colors" style={{ color: currentVideoIndex === idx ? 'var(--accent)' : 'var(--text-muted)' }} />
                              {completedVideos.includes(vid._id) && (
                                <div className="absolute -top-1.5 -right-2 bg-white dark:bg-gray-800 rounded-full p-[2px] shadow-sm">
                                  <CheckCircle className="h-3 w-3 text-green-500" style={{ fill: 'currentColor' }} />
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold group-hover:text-[var(--accent)] transition-colors line-clamp-2" style={{ color: currentVideoIndex === idx ? 'var(--accent)' : 'var(--text-primary)' }}>
                            {vid.title}
                          </h4>
                          {vid.duration && (
                            <div className="flex items-center space-x-1 mt-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                              <Clock className="h-3 w-3" />
                              <span>{vid.duration}</span>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Legacy Flat Mock Tests Sidebar */}
              {(course.mockTests && course.mockTests.length > 0) && (
                <div className="rounded-xl overflow-hidden animate-slide-left" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                  <div className="p-4" style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                    <h3 className="font-bold text-lg flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                      <ClipboardList className="h-5 w-5 text-purple-500" />
                      <span>Mock Tests</span>
                    </h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{course.mockTests.length} tests available</p>
                  </div>
                  <div className="max-h-[40vh] overflow-y-auto p-4 space-y-3">
                    {course.mockTests.map((test, idx) => {
                      const result = mockTestResults.find(r => r.mockTestId === test._id);
                      return (
                        <div key={idx} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                          <h4 className="font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>{test.title}</h4>
                          <div className="flex justify-between items-center text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                            <span className="flex items-center space-x-1"><ClipboardList className="h-3.5 w-3.5" /> <span>{test.questions.length} Qs</span></span>
                            <span className="flex items-center space-x-1"><Clock className="h-3.5 w-3.5" /> <span>{test.timeLimit}m</span></span>
                          </div>
                          {result ? (
                            <div className="w-full flex justify-between items-center py-2 px-3 rounded-lg bg-green-500/10 border border-green-500/30">
                              <span className="text-xs font-semibold text-green-600 dark:text-green-400">Score: {Math.round((result.score/result.totalQuestions)*100)}%</span>
                              <button onClick={() => handleStartMockTest(test)} className="text-xs font-bold text-green-600 dark:text-green-400 hover:underline">Retake</button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleStartMockTest(test)}
                              disabled={!isPurchased && !isFree}
                              className="w-full py-2 rounded-lg text-xs font-bold transition-all btn-press disabled:opacity-50"
                              style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
                            >
                              {!isPurchased && !isFree ? 'Enroll to take test' : 'Start Test'}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* â”€â”€â”€ Direct Enrollment Modal â”€â”€â”€ */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
          <div className="rounded-2xl w-full max-w-sm p-6 border shadow-2xl relative animate-scale-in" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-full" style={{ backgroundColor: 'var(--accent-glow)' }}>
                <CheckCircle className="h-6 w-6" style={{ color: 'var(--accent)' }} />
              </div>
              <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Confirm Enrollment</h3>
            </div>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Are you sure you want to enroll in <strong>{course.title}</strong>? You will get instant access to all course materials and videos.
            </p>
            
            <div className="p-4 rounded-xl mb-6 space-y-2 relative overflow-hidden group" style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.03), transparent)' }} />
              <div className="flex justify-between text-sm relative z-10">
                <span style={{ color: 'var(--text-secondary)' }}>Access Type</span>
                <span className="font-semibold" style={{ color: 'var(--success)' }}>Lifetime Access</span>
              </div>
              <div className="flex justify-between text-sm pt-2 relative z-10" style={{ borderTop: '1px dashed var(--border-color)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Price</span>
                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                  {course.price > 0 ? `$${course.price}` : 'Free'}
                </span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button 
                className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-[var(--bg-input)]"
                style={{ border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
                onClick={() => setShowEnrollModal(false)}
                disabled={paymentLoading}
              >
                Cancel
              </button>
              <button 
                className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all shadow-lg flex items-center justify-center btn-press hover:-translate-y-0.5"
                style={{ 
                  backgroundColor: 'var(--accent)', 
                  boxShadow: '0 8px 20px -4px var(--accent-glow-strong)',
                  backgroundImage: 'linear-gradient(to right, var(--accent), var(--accent-hover))'
                }}
                onClick={executeEnrollment}
                disabled={paymentLoading}
              >
                {paymentLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Yes, Enroll Me!'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* â”€â”€â”€ Review Modal â”€â”€â”€ */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
          <div className="rounded-2xl w-full max-w-md p-6 border shadow-2xl relative animate-scale-in" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              {myReview ? 'Edit Your Review' : 'Write a Review'}
            </h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Rating</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star className="h-8 w-8" style={{ color: star <= rating ? '#eab308' : 'var(--border-color)', fill: star <= rating ? '#eab308' : 'transparent' }} />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all resize-none"
                style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                rows="4"
                placeholder="What did you think about this course?"
              ></textarea>
            </div>

            <div className="flex space-x-3">
              <button 
                className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-[var(--bg-input)]"
                style={{ border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
                onClick={() => setShowReviewModal(false)}
                disabled={reviewLoading}
              >
                Cancel
              </button>
              <button 
                className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all shadow-lg flex items-center justify-center btn-press hover:-translate-y-0.5"
                style={{ 
                  backgroundColor: 'var(--accent)', 
                  backgroundImage: 'linear-gradient(to right, var(--accent), var(--accent-hover))'
                }}
                onClick={handleReviewSubmit}
                disabled={reviewLoading}
              >
                {reviewLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* â”€â”€â”€ Certificate View Modal â”€â”€â”€ */}
      {showCertificateModal && certificateHtml && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
          <div className="rounded-2xl w-full max-w-5xl p-1 relative animate-scale-in" style={{ background: 'linear-gradient(45deg, #fbbf24, #f59e0b, #d97706)' }}>
            <div className="w-full h-full p-6 md:p-8 rounded-xl relative flex flex-col" style={{ backgroundColor: 'var(--bg-card)' }}>
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                  <Award className="h-6 w-6 text-yellow-500" />
                  <span>Your Certificate of Completion</span>
                </h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleDownloadCertificate}
                    disabled={downloadingCertificate}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium text-sm transition-all disabled:opacity-70 btn-press"
                  >
                    {downloadingCertificate ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={() => setShowCertificateModal(false)}
                    className="p-2 rounded-full transition-colors bg-[var(--bg-input)] hover:bg-black/10"
                  >
                    <X className="h-5 w-5" style={{ color: 'var(--text-primary)' }} />
                  </button>
                </div>
              </div>

              <div 
                className="w-full overflow-x-auto bg-white text-black flex justify-center rounded-xl p-4 shadow-inner"
                style={{ maxHeight: '75vh' }}
              >
                <div 
                  id="certificate-content" 
                  dangerouslySetInnerHTML={{ __html: certificateHtml }} 
                  className="shrink-0"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* â”€â”€â”€ Mock Test Taking Modal â”€â”€â”€ */}
      {activeMockTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'var(--bg-overlay)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-3xl rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col h-[90vh] md:h-auto md:max-h-[90vh]" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <h2 className="text-xl font-bold flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                  <Brain className="h-6 w-6 text-purple-500" />
                  <span>{activeMockTest.title}</span>
                </h2>
              </div>
              <div className="flex items-center space-x-4">
                {!mockTestScore && timerActive && (
                  <div className="flex items-center space-x-2 px-4 py-2 rounded-full font-mono font-bold text-sm shadow-inner" style={{ backgroundColor: timeLeft < 60 ? 'rgba(239,68,68,0.1)' : 'var(--bg-input)', color: timeLeft < 60 ? '#ef4444' : 'var(--text-primary)' }}>
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(timeLeft)}</span>
                  </div>
                )}
                {mockTestScore !== null && (
                  <button onClick={() => setActiveMockTest(null)} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors" style={{ color: 'var(--text-muted)' }}>
                    <X className="h-6 w-6" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {mockTestScore === null ? (
                <div className="animate-fade-in h-full flex flex-col">
                  <div className="mb-4 flex justify-between items-center text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
                    <span>Question {currentQuestionIndex + 1} of {activeMockTest.questions.length}</span>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-lg md:text-xl font-semibold leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                      {activeMockTest.questions[currentQuestionIndex].questionText}
                    </h3>
                  </div>

                  <div className="space-y-3 flex-1">
                    {activeMockTest.questions[currentQuestionIndex].options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(idx)}
                        className={`w-full text-left p-4 rounded-xl border transition-all hover:scale-[1.01] active:scale-[0.99] ${userAnswers[currentQuestionIndex] === idx ? 'ring-2 ring-purple-500' : ''}`}
                        style={{
                          backgroundColor: userAnswers[currentQuestionIndex] === idx ? 'var(--accent-glow)' : 'var(--bg-input)',
                          borderColor: userAnswers[currentQuestionIndex] === idx ? 'var(--accent)' : 'var(--border-color)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${userAnswers[currentQuestionIndex] === idx ? 'border-purple-500 bg-purple-500' : 'border-gray-400'}`}>
                            {userAnswers[currentQuestionIndex] === idx && <div className="h-2 w-2 rounded-full bg-white" />}
                          </div>
                          <span>{opt}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-6 mt-auto border-t" style={{ borderColor: 'var(--border-color)' }}>
                    <button
                      onClick={handlePrevQuestion}
                      disabled={currentQuestionIndex === 0}
                      className="px-5 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
                      style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)' }}
                    >
                      Previous
                    </button>
                    {currentQuestionIndex === activeMockTest.questions.length - 1 ? (
                      <button
                        onClick={handleMockTestSubmit}
                        disabled={Object.keys(userAnswers).length < activeMockTest.questions.length || submittingMockTest}
                        className="px-6 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition-all shadow-md disabled:opacity-50"
                        style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
                      >
                        {submittingMockTest ? <Loader2 className="h-5 w-5 animate-spin" /> : <span>Submit Test</span>}
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        className="px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm"
                        style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="animate-fade-in flex flex-col items-center justify-center py-10 h-full">
                  <div className="relative mb-6">
                    <svg className="w-40 h-40 transform -rotate-90">
                      <circle cx="80" cy="80" r="70" stroke="var(--border-color)" strokeWidth="10" fill="none" />
                      <circle cx="80" cy="80" r="70" stroke={mockTestScore / activeMockTest.questions.length >= 0.7 ? '#22c55e' : '#eab308'} strokeWidth="10" fill="none" strokeDasharray="440" strokeDashoffset={440 - (440 * (mockTestScore / activeMockTest.questions.length))} className="transition-all duration-1000 ease-out" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>{Math.round((mockTestScore / activeMockTest.questions.length) * 100)}%</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {mockTestScore / activeMockTest.questions.length >= 0.7 ? 'Great Job!' : 'Good Effort!'}
                  </h3>
                  <p className="text-lg mb-8" style={{ color: 'var(--text-muted)' }}>
                    You scored {mockTestScore} out of {activeMockTest.questions.length}
                  </p>

                  <div className="w-full space-y-4">
                    <h4 className="font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>Review Answers</h4>
                    {activeMockTest.questions.map((q, idx) => {
                      const isCorrect = userAnswers[idx] === q.correctAnswerIndex;
                      return (
                        <div key={idx} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-input)', borderColor: isCorrect ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)' }}>
                          <p className="font-medium text-sm mb-3" style={{ color: 'var(--text-primary)' }}>{idx + 1}. {q.questionText}</p>
                          <div className="space-y-2 mb-3">
                            {q.options.map((opt, oIdx) => {
                              let styleClass = "px-3 py-2 rounded-lg text-sm ";
                              if (oIdx === q.correctAnswerIndex) {
                                styleClass += "bg-green-500/10 text-green-600 font-bold border border-green-500/30";
                              } else if (userAnswers[idx] === oIdx && !isCorrect) {
                                styleClass += "bg-red-500/10 text-red-600 font-bold border border-red-500/30";
                              } else {
                                styleClass += "bg-transparent text-[var(--text-secondary)] border border-[var(--border-color)]";
                              }
                              return (
                                <div key={oIdx} className={styleClass}>
                                  {String.fromCharCode(65 + oIdx)}. {opt}
                                </div>
                              );
                            })}
                          </div>
                          {!isCorrect && q.explanation && (
                            <div className="p-3 mt-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs leading-relaxed">
                              <strong>Explanation:</strong> {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setActiveMockTest(null)}
                    className="mt-8 px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-lg"
                    style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
                  >
                    Close Result
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CourseDetails;

