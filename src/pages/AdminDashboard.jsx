import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PremiumBg from '../components/PremiumBg';
import {
  Plus,
  Trash2,
  Edit3,
  BookOpen,
  DollarSign,
  Video,
  FileText,
  X,
  Save,
  AlertCircle,
  CheckCircle,
  Loader2,
  Tag,
  Clock,
  BarChart3,
  Image,
  Tv,
  Link as LinkIcon,
  Star,
  MessageSquare,
  Settings,
  Users,
  Sparkles,
  AlertTriangle,
  Search,
  ArrowLeft,
  Award,
  Brain,
  ClipboardList,
  Layers,
  Type
} from 'lucide-react';

const API_URL = 'https://e-learning-backend-1-r539.onrender.com/api';

const CATEGORIES = [
  'General',
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'DevOps',
  'Design',
  'Business',
  'Marketing',
  'Other',
];

const LEVELS = [
  { value: 'beginner', label: 'Beginner', color: '#22c55e' },
  { value: 'intermediate', label: 'Intermediate', color: '#eab308' },
  { value: 'advanced', label: 'Advanced', color: '#ef4444' },
];

/* ═══════════════ INLINE STYLES ═══════════════ */
const styles = `
  @keyframes ma-orb-1 {
    0% { transform: translate(0,0) scale(1); }
    25% { transform: translate(80px,-50px) scale(1.15); }
    50% { transform: translate(20px,40px) scale(0.9); }
    75% { transform: translate(-60px,-10px) scale(1.05); }
    100% { transform: translate(0,0) scale(1); }
  }
  @keyframes ma-orb-2 {
    0% { transform: translate(0,0) scale(1); }
    25% { transform: translate(-70px,60px) scale(1.2); }
    50% { transform: translate(50px,-30px) scale(0.85); }
    75% { transform: translate(-20px,50px) scale(1.1); }
    100% { transform: translate(0,0) scale(1); }
  }
  @keyframes ma-orb-3 {
    0% { transform: translate(0,0) scale(1); opacity:0.06; }
    33% { transform: translate(40px,70px) scale(1.3); opacity:0.1; }
    66% { transform: translate(-60px,-40px) scale(0.8); opacity:0.04; }
    100% { transform: translate(0,0) scale(1); opacity:0.06; }
  }
  @keyframes ma-aurora {
    0% { background-position: 0% 50%; opacity:0.03; }
    25% { opacity:0.06; }
    50% { background-position: 100% 50%; opacity:0.04; }
    75% { opacity:0.07; }
    100% { background-position: 0% 50%; opacity:0.03; }
  }
  @keyframes ma-grid-pulse {
    0%,100% { opacity:0.02; }
    50% { opacity:0.04; }
  }
  @keyframes ma-streak {
    0% { transform: translateX(-100%) skewX(-15deg); opacity:0; }
    15% { opacity:1; }
    85% { opacity:1; }
    100% { transform: translateX(200vw) skewX(-15deg); opacity:0; }
  }
  @keyframes ma-glow-dot {
    0%,100% { opacity:0.15; transform:scale(1); box-shadow: 0 0 8px 2px rgba(232,124,65,0.15); }
    50% { opacity:0.5; transform:scale(1.5); box-shadow: 0 0 20px 6px rgba(232,124,65,0.25); }
  }
  @keyframes ma-grain {
    0%,100% { transform: translate(0,0); }
    10% { transform: translate(-2%,-2%); }
    20% { transform: translate(1%,3%); }
    30% { transform: translate(-3%,1%); }
    40% { transform: translate(3%,-1%); }
    50% { transform: translate(-1%,2%); }
    60% { transform: translate(2%,-3%); }
    70% { transform: translate(-2%,1%); }
    80% { transform: translate(1%,-2%); }
    90% { transform: translate(3%,2%); }
  }
  @keyframes admin-skeleton-pulse {
    0%, 100% { opacity: 0.6; background-color: rgba(255,255,255,0.05); }
    50% { opacity: 0.3; background-color: rgba(232,124,65,0.08); }
  }
  @keyframes ma-card-in {
    0% { opacity:0; transform:translateY(50px) scale(0.94); filter:blur(6px); }
    100% { opacity:1; transform:translateY(0) scale(1); filter:blur(0); }
  }
  
  .admin-page { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
  .admin-page * { box-sizing: border-box; }

  .glass-panel {
    background: linear-gradient(180deg, rgba(30,20,15,0.6) 0%, #050505 100%);
    border: 1px solid rgba(232,124,65,0.15);
    backdrop-filter: blur(12px);
  }
  .admin-sidebar {
    background: rgba(10, 5, 5, 0.85);
    backdrop-filter: blur(20px);
    border-right: 1px solid rgba(232,124,65,0.15);
  }
`;



const AdminDashboard = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseType, setCourseType] = useState('paid');
  const [price, setPrice] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [category, setCategory] = useState('General');
  const [customCategory, setCustomCategory] = useState('');
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [level, setLevel] = useState('beginner');
  const [duration, setDuration] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videos, setVideos] = useState([{ title: '', videoUrl: '', videoFile: null, duration: '' }]);
  const [formLoading, setFormLoading] = useState(false);
  const [addingVideoToCourse, setAddingVideoToCourse] = useState(null);
  const [newVideoState, setNewVideoState] = useState({ title: '', duration: '', videoUrl: '', videoFile: null });
  const [quickAddLoading, setQuickAddLoading] = useState(false);

  // Reviews Modal State
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [selectedCourseForReviews, setSelectedCourseForReviews] = useState(null);

  // Settings State
  const activeTab = searchParams.get('tab') || 'courses';
  const setActiveTab = (tab) => setSearchParams({ tab });
  const [certificateTemplate, setCertificateTemplate] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const [templateFile, setTemplateFile] = useState(null);
  
  // Requests State
  const [certificateRequests, setCertificateRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  // Doubts State
  const [pendingDoubts, setPendingDoubts] = useState([]);
  const [doubtsLoading, setDoubtsLoading] = useState(false);
  const [replyTexts, setReplyTexts] = useState({});
  const [replyFiles, setReplyFiles] = useState({});
  const [submittingReply, setSubmittingReply] = useState(null);

  // Landing Page State
  const [landingVideo, setLandingVideo] = useState({ url: '', poster: '' });
  const [landingStats, setLandingStats] = useState({ stat1Label: '', stat1Value: '', stat2Label: '', stat2Value: '' });
  const [landingImpact, setLandingImpact] = useState([]);
  const [landingComparison, setLandingComparison] = useState({ usPoints: [], othersPoints: [] });
  const [landingLoading, setLandingLoading] = useState(false);
  const [impactForm, setImpactForm] = useState({ imageUrl: '', title: '', description: '', tag: '' });
  const [impactUploading, setImpactUploading] = useState(false);
  const [newUsPoint, setNewUsPoint] = useState('');
  const [newOthersPoint, setNewOthersPoint] = useState('');
  const [landingVideoUploading, setLandingVideoUploading] = useState(false);

  const fetchPendingDoubts = async () => {
    try {
      setDoubtsLoading(true);
      const { data } = await axios.get(`${API_URL}/doubts/admin/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingDoubts(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch pending doubts');
    } finally {
      setDoubtsLoading(false);
    }
  };

  const handleReplyDoubt = async (doubtId) => {
    const text = replyTexts[doubtId];
    const file = replyFiles[doubtId];
    if (!text?.trim()) return;

    try {
      setSubmittingReply(doubtId);
      let mediaUrl = null;

      if (file) {
        const formData = new FormData();
        if (file.type.startsWith('video/')) {
          formData.append('video', file);
          const uploadRes = await axios.post(`${API_URL}/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
          });
          mediaUrl = uploadRes.data.videoUrl;
        } else {
          formData.append('document', file);
          const uploadRes = await axios.post(`${API_URL}/upload/document`, formData, {
            headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
          });
          mediaUrl = uploadRes.data.documentUrl;
        }
      }

      await axios.post(`${API_URL}/doubts/admin/solve/${doubtId}`, {
        adminReplyText: text,
        adminReplyMedia: mediaUrl
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Doubt solved successfully!');
      fetchPendingDoubts();
      setReplyTexts(prev => ({ ...prev, [doubtId]: '' }));
      setReplyFiles(prev => ({ ...prev, [doubtId]: null }));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to solve doubt');
      setTimeout(() => setError(''), 3000);
    } finally {
      setSubmittingReply(null);
    }
  };

  // Overview State
  const [overviewData, setOverviewData] = useState([]);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [showOverviewModal, setShowOverviewModal] = useState(false);
  const [selectedOverviewCourse, setSelectedOverviewCourse] = useState(null);
  const [overviewModalTab, setOverviewModalTab] = useState('active'); // 'active' | 'inactive'
  const [overviewSearchQuery, setOverviewSearchQuery] = useState('');
  const [viewingCourseId, setViewingCourseId] = useState(null);

  // AI Analysis State
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiReport, setAiReport] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedAIStudent, setSelectedAIStudent] = useState(null);

  const fetchAIReport = async (studentId, courseId, studentName) => {
    setSelectedAIStudent(studentName);
    setShowAIModal(true);
    setAiLoading(true);
    setAiReport(null);
    try {
      const { data } = await axios.get(`${API_URL}/courses/admin/${courseId}/students/${studentId}/performance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAiReport(data.report);
    } catch (err) {
      setAiReport({ error: "Failed to fetch AI analysis. Check backend logs or OpenRouter API key." });
    } finally {
      setAiLoading(false);
    }
  };

  // Students Progress State
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [selectedCourseForStudents, setSelectedCourseForStudents] = useState(null);
  const [studentsList, setStudentsList] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  const fetchCourseStudents = async (courseId) => {
    try {
      setStudentsLoading(true);
      const { data } = await axios.get(`${API_URL}/courses/admin/${courseId}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudentsList(data);
    } catch (error) {
      console.error(error);
    } finally {
      setStudentsLoading(false);
    }
  };

  // Mock Test State
  const [showMockTestModal, setShowMockTestModal] = useState(false);
  const [mockTestCourse, setMockTestCourse] = useState(null);
  const [mockTestParams, setMockTestParams] = useState({ topic: '', numQuestions: 10, timeLimit: 15 });
  const [generatingMockTest, setGeneratingMockTest] = useState(false);
  const [generatedMockTest, setGeneratedMockTest] = useState(null);
  const [savingMockTest, setSavingMockTest] = useState(false);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/courses/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Fetch overview data to compute student counts locally (fixes count=0 issue for remote backend)
      try {
        const overviewRes = await axios.get(`${API_URL}/courses/admin/overview/activity`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const overview = overviewRes.data;
        const enrichedData = data.map(course => {
          const courseOverview = overview.find(o => o._id === course._id);
          const active = courseOverview ? courseOverview.activeCount : 0;
          const inactive = courseOverview ? courseOverview.inactiveCount : 0;
          return { ...course, enrolledCount: active + inactive };
        });
        setCourses(enrichedData);
      } catch (err) {
        setCourses(data);
      }
    } catch (err) {
      setError('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);
  const fetchLandingData = async () => {
    setLandingLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/settings/landing`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLandingVideo(data.video || { url: '', poster: '' });
      setLandingStats(data.stats || { stat1Label: '', stat1Value: '', stat2Label: '', stat2Value: '' });
      setLandingImpact(data.impact || []);
      setLandingComparison(data.comparison || { usPoints: [], othersPoints: [] });
    } catch (err) { console.error(err); }
    finally { setLandingLoading(false); }
  };

  useEffect(() => {
    if (activeTab === 'settings') {
      fetchSettings();
    }
    if (activeTab === 'requests') {
      fetchCertificateRequests();
    }
    if (activeTab === 'overview') {
      fetchOverviewData();
    }
    if (activeTab === 'doubts') {
      fetchPendingDoubts();
    }
    if (activeTab === 'landing') {
      fetchLandingData();
    }
  }, [token, activeTab]);

  const fetchCertificateRequests = async () => {
    try {
      setRequestsLoading(true);
      const { data } = await axios.get(`${API_URL}/courses/admin/certificate-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCertificateRequests(data);
    } catch (err) {
      setError('Failed to fetch certificate requests');
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      setRequestsLoading(true);
      await axios.post(`${API_URL}/courses/admin/certificate-requests/${requestId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Certificate generated and approved successfully!');
      fetchCertificateRequests(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve request');
      setRequestsLoading(false);
    }
  };

  const fetchOverviewData = async () => {
    try {
      setOverviewLoading(true);
      const { data } = await axios.get(`${API_URL}/courses/admin/overview/activity`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOverviewData(data);
    } catch (err) {
      setError('Failed to fetch overview data');
    } finally {
      setOverviewLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/settings/certificate`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCertificateTemplate(data.value || '');
    } catch (err) {
      setError('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSavingSettings(true);
      setError('');
      setSuccess('');
      
      let finalTemplateUrl = certificateTemplate;
      
      // Upload image if selected
      if (templateFile) {
        const formData = new FormData();
        formData.append('image', templateFile);
        
        const uploadRes = await axios.post(`${API_URL}/upload/image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
        finalTemplateUrl = uploadRes.data.imageUrl;
        setCertificateTemplate(finalTemplateUrl);
      }
      
      await axios.put(`${API_URL}/settings/certificate`, { template: finalTemplateUrl }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Certificate graphic template saved successfully!');
      setTemplateFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCourseType('paid');
    setPrice('');
    setDiscountPercentage('');
    setCategory('General');
    setCustomCategory('');
    setLevel('beginner');
    setDuration('');
    setThumbnail('');
    setThumbnailFile(null);
    setVideos([{ title: '', videoUrl: '', videoFile: null, duration: '' }]);
    setEditingCourse(null);
    setShowForm(false);
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setTitle(course.title);
    setDescription(course.description);
    setCourseType(course.courseType || 'paid');
    setPrice(course.price?.toString() || '0');
    setDiscountPercentage(course.discountPercentage?.toString() || '0');
    if (course.category && !CATEGORIES.includes(course.category)) {
      setCategory('Other');
      setCustomCategory(course.category);
    } else {
      setCategory(course.category || 'General');
      setCustomCategory('');
    }
    setLevel(course.level || 'beginner');
    setDuration(course.duration || '');
    setThumbnail(course.thumbnail || '');
    setThumbnailFile(null);
    
    // Map existing videos and ensure videoFile is null
    setVideos(course.videos && course.videos.length > 0 
      ? course.videos.map(v => ({ ...v, videoFile: null })) 
      : [{ title: '', videoUrl: '', videoFile: null, duration: '' }]);
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFormLoading(true);

    if (!title || !description || videos.length === 0) {
      setError('Please fill in title, description, and at least one video');
      setFormLoading(false);
      return;
    }

    if (courseType === 'paid' && (!price || Number(price) <= 0)) {
      setError('Paid courses must have a price greater than $0');
      setFormLoading(false);
      return;
    }

    try {
      const finalCategory = category === 'Other' && customCategory.trim() ? customCategory : category;
      
      let finalThumbnailUrl = thumbnail;
      if (thumbnailFile) {
        const formData = new FormData();
        formData.append('image', thumbnailFile);
        try {
          const uploadRes = await axios.post(`${API_URL}/upload/image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
          });
          finalThumbnailUrl = uploadRes.data.imageUrl;
        } catch (err) {
          setError('Failed to upload thumbnail image');
          setFormLoading(false);
          return;
        }
      }

      // Upload local video files for Paid courses
      if (courseType === 'paid') {
        for (let i = 0; i < videos.length; i++) {
          if (videos[i].videoFile) {
            const formData = new FormData();
            formData.append('video', videos[i].videoFile);
            try {
              // Upload to backend
              const uploadRes = await axios.post(`${API_URL}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
              });
              videos[i].videoUrl = uploadRes.data.videoUrl;
            } catch (err) {
              setError(`Failed to upload video for Lesson ${i+1}`);
              setFormLoading(false);
              return;
            }
          }
          if (!videos[i].videoUrl) {
            setError(`Please upload a video file for Lesson ${i+1}`);
            setFormLoading(false);
            return;
          }
        }
      } else {
        // Free courses: ensure they have youtube URL
        for (let i = 0; i < videos.length; i++) {
          if (!videos[i].videoUrl) {
            setError(`Please provide a YouTube URL for Lesson ${i+1}`);
            setFormLoading(false);
            return;
          }
        }
      }

      const courseData = {
        title,
        description,
        courseType,
        price: courseType === 'free' ? 0 : Number(price),
        discountPercentage: courseType === 'free' ? 0 : Number(discountPercentage),
        category: finalCategory,
        level,
        duration,
        thumbnail: finalThumbnailUrl,
        videos: videos.map(v => ({ title: v.title, videoUrl: v.videoUrl, duration: v.duration })),
      };

      if (editingCourse) {
        await axios.put(`${API_URL}/courses/${editingCourse._id}`, courseData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess('Course updated successfully!');
      } else {
        await axios.post(`${API_URL}/courses`, courseData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess('Course created successfully!');
      }

      resetForm();
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
  };

  const confirmDelete = async () => {
    if (!courseToDelete) return;
    try {
      setError('');
      await axios.delete(`${API_URL}/courses/${courseToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Course deleted successfully!');
      setCourseToDelete(null);
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete course');
      setCourseToDelete(null);
    }
  };

  const getLevelBadge = (lvl) => {
    const found = LEVELS.find((l) => l.value === lvl);
    if (!found) return null;
    return (
      <span
        className="text-xs px-2 py-0.5 rounded-full font-medium"
        style={{
          backgroundColor: `${found.color}15`,
          color: found.color,
          border: `1px solid ${found.color}30`,
        }}
      >
        {found.label}
      </span>
    );
  };

  const handleAddVideo = () => {
    setVideos([...videos, { title: '', videoUrl: '', duration: '' }]);
  };

  const handleRemoveVideo = (index) => {
    const newVideos = videos.filter((_, i) => i !== index);
    setVideos(newVideos);
  };

  const handleVideoChange = (index, field, value) => {
    const newVideos = [...videos];
    newVideos[index][field] = value;
    setVideos(newVideos);
  };

  const handleQuickAddSubmit = async (e) => {
    e.preventDefault();
    if (!newVideoState.title || (addingVideoToCourse.courseType === 'free' && !newVideoState.videoUrl) || (addingVideoToCourse.courseType === 'paid' && !newVideoState.videoFile)) {
      setError('Please fill all required fields');
      return;
    }
    
    setQuickAddLoading(true);
    setError('');
    
    try {
      let finalVideoUrl = newVideoState.videoUrl;
      
      if (addingVideoToCourse.courseType === 'paid' && newVideoState.videoFile) {
        const formData = new FormData();
        formData.append('video', newVideoState.videoFile);
        const uploadRes = await axios.post(`${API_URL}/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
        });
        finalVideoUrl = uploadRes.data.videoUrl;
      }
      
      const updatedVideos = [
        ...addingVideoToCourse.videos,
        { title: newVideoState.title, duration: newVideoState.duration, videoUrl: finalVideoUrl }
      ];
      
      await axios.put(`${API_URL}/courses/${addingVideoToCourse._id}`, { videos: updatedVideos }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setSuccess('Video added successfully!');
      setAddingVideoToCourse(null);
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add video');
    } finally {
      setQuickAddLoading(false);
    }
  };

  const handleGenerateMockTest = async () => {
    if (!mockTestParams.topic.trim()) {
      setError('Please enter a topic for the mock test.');
      return;
    }
    setGeneratingMockTest(true);
    setError('');
    try {
      const { data } = await axios.post(
        `${API_URL}/courses/admin/generate-mock-test`,
        { topic: mockTestParams.topic, numQuestions: mockTestParams.numQuestions },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGeneratedMockTest(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate mock test. Please try again.');
    } finally {
      setGeneratingMockTest(false);
    }
  };

  const handleSaveMockTest = async () => {
    if (!generatedMockTest) return;
    setSavingMockTest(true);
    setError('');
    try {
      await axios.post(
        `${API_URL}/courses/admin/${mockTestCourse._id}/mock-test`,
        {
          title: generatedMockTest.title,
          timeLimit: mockTestParams.timeLimit,
          questions: generatedMockTest.questions
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Mock test added successfully!');
      setShowMockTestModal(false);
      setMockTestCourse(null);
      setGeneratedMockTest(null);
      setMockTestParams({ topic: '', numQuestions: 10, timeLimit: 15 });
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save mock test.');
    } finally {
      setSavingMockTest(false);
    }
  };

  const upcomingLiveClasses = courses.reduce((acc, course) => {
    if (course.chapters) {
      course.chapters.forEach(chapter => {
        if (chapter.liveClasses) {
          chapter.liveClasses.forEach(lc => {
            if (lc.status === 'scheduled' || lc.status === 'live') {
              acc.push({ ...lc, courseId: course._id, courseTitle: course.title, chapterId: chapter._id });
            }
          });
        }
      });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="admin-page flex h-[calc(100vh-72px)] relative text-white overflow-hidden" style={{ backgroundColor: '#050505' }}>
      <style>{styles}</style>
      <PremiumBg scrollY={scrollY} />
      
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile Drawer */}
      <aside 
        className={`admin-sidebar w-64 flex-shrink-0 flex flex-col shadow-2xl lg:shadow-sm z-50 fixed inset-y-0 left-0 lg:static lg:h-full transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`} 
      >
        <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <h2 className="text-xl font-bold tracking-wide text-white">Admin Panel</h2>
          <button className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-white/60" onClick={() => setMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-3">
          {[
            { id: 'courses', icon: BookOpen, label: 'Manage Courses' },
            { id: 'overview', icon: BarChart3, label: 'Activity Overview' },
            { id: 'settings', icon: Settings, label: 'Certificate Settings' },
            { id: 'requests', icon: Award, label: 'Certificate Requests' },
            { id: 'doubts', icon: MessageSquare, label: 'Doubt Requests' },
            { id: 'landing', icon: Layers, label: 'Landing Page' }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                className={`w-full relative flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group overflow-hidden cursor-pointer ${isActive ? 'bg-[#E87C41] text-white shadow-[0_4px_14px_rgba(232,124,65,0.4)]' : 'text-white/60 hover:text-white btn-sweep-white'}`}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-md z-20"></div>}
                <Icon className={`h-5 w-5 transition-transform duration-300 ${!isActive && 'group-hover:scale-110'}`} />
                <span className="relative z-10">{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 w-full max-w-full overflow-y-auto overflow-x-hidden relative z-10 custom-scrollbar">
        <div className="max-w-6xl mx-auto">
          {/* Header Area */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 border-b pb-6" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden p-2 rounded-lg transition-colors hover:bg-white/10 cursor-pointer text-white"
                onClick={() => setMobileMenuOpen(true)}
              >
                <div className="space-y-1.5">
                  <span className="block w-6 h-0.5 rounded-full bg-white"></span>
                  <span className="block w-6 h-0.5 rounded-full bg-white"></span>
                  <span className="block w-4 h-0.5 rounded-full bg-white"></span>
                </div>
              </button>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white">
                  {activeTab === 'courses' ? 'Manage Courses' : activeTab === 'overview' ? 'Activity Overview' : activeTab === 'settings' ? 'Certificate Settings' : activeTab === 'requests' ? 'Certificate Requests' : activeTab === 'landing' ? 'Landing Page' : 'Doubt Requests'}
                </h1>
                <p className="mt-1 text-sm font-medium text-white/50">
                  View and manage your platform's content and student requests.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
                setError('');
                setSuccess('');
              }}
              className="flex items-center space-x-2 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-[0_4px_14px_rgba(232,124,65,0.3)] hover:shadow-[0_6px_20px_rgba(232,124,65,0.5)] cursor-pointer hover:-translate-y-0.5 bg-[#E87C41]"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Course</span>
            </button>
          </div>

        {/* Alerts */}
        {error && (
          <div
            className="flex items-center space-x-2 px-4 py-3 rounded-xl text-sm mb-6 animate-slide-down"
            style={{ backgroundColor: 'var(--danger-bg)', border: '1px solid var(--danger)', color: 'var(--danger)' }}
          >
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-auto cursor-pointer opacity-70 hover:opacity-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        {success && (
          <div
            className="flex items-center space-x-2 px-4 py-3 rounded-xl text-sm mb-6 animate-slide-down"
            style={{ backgroundColor: 'var(--success-bg)', border: '1px solid var(--success)', color: 'var(--success)' }}
          >
            <CheckCircle className="h-5 w-5 shrink-0" />
            <span>{success}</span>
            <button onClick={() => setSuccess('')} className="ml-auto cursor-pointer opacity-70 hover:opacity-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ─── Premium Course Form Modal ─── */}
        {showForm && createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 backdrop-blur-md animate-fade-in"
            style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
          >
            <div
              className="w-full max-w-5xl rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-[#E87C41]/20 relative"
              style={{ background: '#0a0a0a' }}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E87C41] to-transparent opacity-50"></div>

              {/* Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-[#050505]">
                <h2 className="text-2xl font-bold text-white flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#E87C41]/10 flex items-center justify-center border border-[#E87C41]/20 shadow-[0_0_15px_rgba(232,124,65,0.15)]">
                    {editingCourse ? <Edit3 className="w-6 h-6 text-[#E87C41]" /> : <Sparkles className="w-6 h-6 text-[#E87C41]" />}
                  </div>
                  <span className="tracking-wide">{editingCourse ? 'Edit Course Details' : 'Create New Course'}</span>
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2.5 rounded-xl transition-all cursor-pointer hover:bg-white/5 text-gray-500 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Body */}
              <div className="overflow-y-auto p-8 custom-scrollbar flex-1 bg-[#0a0a0a]">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  
                  {/* Left Column (Main Info) */}
                  <div className="lg:col-span-7 space-y-8">
                    
                    {/* Course Type Toggle */}
                    <div className="p-5 rounded-2xl bg-[#111] border border-white/5">
                      <label className="block text-xs uppercase tracking-wider font-bold mb-3 text-gray-400">
                        Course Type
                      </label>
                      <div className="flex rounded-xl overflow-hidden p-1 bg-black border border-white/10">
                        <button
                          type="button"
                          onClick={() => setCourseType('free')}
                          className={`flex-1 py-3 text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 rounded-lg ${
                            courseType === 'free' 
                              ? 'bg-[#E87C41] text-black shadow-[0_0_20px_rgba(232,124,65,0.4)]' 
                              : 'bg-transparent text-gray-500 hover:text-white'
                          }`}
                        >
                          <Tv className="h-4 w-4" />
                          <span>Free Course</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCourseType('paid')}
                          className={`flex-1 py-3 text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 rounded-lg ${
                            courseType === 'paid' 
                              ? 'bg-[#E87C41] text-black shadow-[0_0_20px_rgba(232,124,65,0.4)]' 
                              : 'bg-transparent text-gray-500 hover:text-white'
                          }`}
                        >
                          <DollarSign className="h-4 w-4" />
                          <span>Premium Course</span>
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold mb-2 text-gray-400">
                        Course Title
                      </label>
                      <div className="relative group">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-600 group-focus-within:text-[#E87C41] transition-colors">
                          <BookOpen className="h-5 w-5" />
                        </span>
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 bg-[#111] border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#E87C41]/50 focus:ring-1 focus:ring-[#E87C41]/50 text-white placeholder-gray-600 transition-all shadow-inner"
                          placeholder="e.g. Master React in 30 Days"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold mb-2 text-gray-400">
                        Description
                      </label>
                      <div className="relative group">
                        <span className="absolute top-4 left-4 pointer-events-none text-gray-600 group-focus-within:text-[#E87C41] transition-colors">
                          <FileText className="h-5 w-5" />
                        </span>
                        <textarea
                          required
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={4}
                          className="w-full pl-12 pr-4 py-3.5 bg-[#111] border border-white/10 rounded-xl text-sm resize-none focus:outline-none focus:border-[#E87C41]/50 focus:ring-1 focus:ring-[#E87C41]/50 text-white placeholder-gray-600 transition-all shadow-inner"
                          placeholder="Describe what students will learn..."
                        />
                      </div>
                    </div>

                    {/* Grid: Category & Level */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-bold mb-2 text-gray-400">
                          Category
                        </label>
                        <div className="relative group">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-600 group-focus-within:text-[#E87C41] transition-colors">
                            <Layers className="h-5 w-5" />
                          </span>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-[#111] border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#E87C41]/50 focus:ring-1 focus:ring-[#E87C41]/50 text-white appearance-none cursor-pointer transition-all shadow-inner"
                          >
                            {CATEGORIES.map((cat) => (
                              <option key={cat} value={cat} className="bg-[#111]">{cat}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider font-bold mb-2 text-gray-400">
                          Level
                        </label>
                        <div className="relative group">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-600 group-focus-within:text-[#E87C41] transition-colors">
                            <BarChart3 className="h-5 w-5" />
                          </span>
                          <select
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-[#111] border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#E87C41]/50 focus:ring-1 focus:ring-[#E87C41]/50 text-white appearance-none cursor-pointer transition-all shadow-inner"
                          >
                            {LEVELS.map((l) => (
                              <option key={l.value} value={l.value} className="bg-[#111]">{l.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {category === 'Other' && (
                      <div className="animate-slide-down">
                        <label className="block text-xs uppercase tracking-wider font-bold mb-2 text-gray-400">
                          Custom Category
                        </label>
                        <div className="relative group">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-600 group-focus-within:text-[#E87C41] transition-colors">
                            <Tag className="h-5 w-5" />
                          </span>
                          <input
                            type="text"
                            required
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-[#111] border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#E87C41]/50 focus:ring-1 focus:ring-[#E87C41]/50 text-white placeholder-gray-600 transition-all shadow-inner"
                            placeholder="e.g. Photography"
                          />
                        </div>
                      </div>
                    )}

                    {/* Pricing & Duration */}
                    <div className={`grid gap-6 ${courseType === 'free' ? 'grid-cols-1' : 'grid-cols-3'}`}>
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-bold mb-2 text-gray-400">
                          Duration
                        </label>
                        <div className="relative group">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-600 group-focus-within:text-[#E87C41] transition-colors">
                            <Clock className="h-5 w-5" />
                          </span>
                          <input
                            type="text"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-[#111] border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#E87C41]/50 focus:ring-1 focus:ring-[#E87C41]/50 text-white placeholder-gray-600 transition-all shadow-inner"
                            placeholder="e.g. 4h 30m"
                          />
                        </div>
                      </div>

                      {courseType === 'paid' && (
                        <div className="animate-scale-in">
                          <label className="block text-xs uppercase tracking-wider font-bold mb-2 text-gray-400">
                            Price ($)
                          </label>
                          <div className="relative group">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-600 group-focus-within:text-[#E87C41] transition-colors">
                              <DollarSign className="h-5 w-5" />
                            </span>
                            <input
                              type="number"
                              min="0"
                              required
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              className="w-full pl-12 pr-4 py-3.5 bg-[#111] border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#E87C41]/50 focus:ring-1 focus:ring-[#E87C41]/50 text-white placeholder-gray-600 transition-all shadow-inner"
                              placeholder="499"
                            />
                          </div>
                        </div>
                      )}

                      {courseType === 'paid' && (
                        <div className="animate-scale-in">
                          <label className="block text-xs uppercase tracking-wider font-bold mb-2 text-gray-400">
                            Discount (%)
                          </label>
                          <div className="relative group">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-600 group-focus-within:text-[#E87C41] transition-colors">
                              <DollarSign className="h-5 w-5" />
                            </span>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={discountPercentage}
                              onChange={(e) => setDiscountPercentage(e.target.value)}
                              className="w-full pl-12 pr-4 py-3.5 bg-[#111] border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#E87C41]/50 focus:ring-1 focus:ring-[#E87C41]/50 text-white placeholder-gray-600 transition-all shadow-inner"
                              placeholder="20"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column (Media) */}
                  <div className="lg:col-span-5 space-y-8">
                    
                    {/* Thumbnail Upload with Preview */}
                    <div className="p-6 rounded-2xl bg-[#111] border border-white/5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#E87C41] blur-[100px] opacity-10 pointer-events-none"></div>
                      <label className="block text-xs uppercase tracking-wider font-bold mb-4 text-gray-400">
                        Course Thumbnail <span className="font-normal opacity-50">(optional)</span>
                      </label>
                      
                      {/* Image Preview Area */}
                      <div className="mb-5 w-full h-44 rounded-xl overflow-hidden bg-[#050505] border border-white/5 flex items-center justify-center relative group shadow-inner">
                        {(thumbnail || thumbnailFile) ? (
                          <img 
                            src={thumbnailFile ? URL.createObjectURL(thumbnailFile) : (thumbnail.startsWith('http') ? thumbnail : `${API_URL.replace('/api', '')}${thumbnail}`)} 
                            alt="Preview" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-gray-600">
                            <Image className="w-10 h-10 mb-3 opacity-30" />
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">No Image</span>
                          </div>
                        )}
                        
                        {/* Overlay for replacing */}
                        {(thumbnail || thumbnailFile) && (
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <span className="text-white text-xs font-bold tracking-wider uppercase bg-black/50 px-4 py-2 rounded-lg border border-white/10">Replace Image</span>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if(e.target.files[0]) {
                              setThumbnailFile(e.target.files[0]);
                              setThumbnail('');
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                      </div>

                      <div className="flex items-center gap-4 mb-5">
                        <div className="h-px bg-white/5 flex-1"></div>
                        <span className="text-[10px] uppercase font-bold text-gray-600 tracking-widest">OR USE URL</span>
                        <div className="h-px bg-white/5 flex-1"></div>
                      </div>
                      
                      <div className="relative group">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-600 group-focus-within:text-[#E87C41] transition-colors">
                          <LinkIcon className="h-4 w-4" />
                        </span>
                        <input
                          type="text"
                          value={thumbnail}
                          onChange={(e) => {
                            setThumbnail(e.target.value);
                            setThumbnailFile(null);
                          }}
                          className="w-full pl-11 pr-4 py-3 bg-[#050505] rounded-xl text-sm focus:outline-none focus:border-[#E87C41]/50 focus:ring-1 focus:ring-[#E87C41]/50 border border-white/10 text-white placeholder-gray-600 transition-all shadow-inner"
                          placeholder="Paste image URL here..."
                          disabled={!!thumbnailFile}
                        />
                      </div>
                    </div>

                    {/* Videos Array */}
                    <div className="p-6 rounded-2xl bg-[#111] border border-white/5 relative overflow-hidden">
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#E87C41] blur-[100px] opacity-10 pointer-events-none"></div>
                      <div className="flex items-center justify-between mb-4 relative z-10">
                        <label className="block text-xs uppercase tracking-wider font-bold text-gray-400">
                          Course Videos
                        </label>
                        <button
                          type="button"
                          onClick={handleAddVideo}
                          className="text-xs px-4 py-2 rounded-lg flex items-center space-x-2 cursor-pointer transition-all bg-[#E87C41]/10 text-[#E87C41] hover:bg-[#E87C41]/20 font-bold border border-[#E87C41]/20"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Add Lesson</span>
                        </button>
                      </div>
                      
                      <div className="max-h-[350px] overflow-y-auto custom-scrollbar pr-2 space-y-4 relative z-10">
                        {videos.map((vid, index) => (
                          <div key={index} className="p-5 rounded-xl relative group animate-slide-up bg-[#050505] border border-white/5 hover:border-[#E87C41]/30 transition-colors">
                            {videos.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveVideo(index)}
                                className="absolute top-3 right-3 p-1.5 rounded-lg text-red-400 hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                            
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-6 h-6 rounded-md bg-[#E87C41]/20 flex items-center justify-center text-[#E87C41] text-[10px] font-black">
                                {index + 1}
                              </div>
                              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Lesson</span>
                            </div>

                            <div className="grid gap-4">
                              <div>
                                <input
                                  type="text"
                                  required
                                  value={vid.title}
                                  onChange={(e) => handleVideoChange(index, 'title', e.target.value)}
                                  className="w-full px-4 py-2.5 bg-[#111] border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#E87C41]/50 text-white placeholder-gray-600 transition-all"
                                  placeholder="Lesson Title"
                                />
                              </div>
                              <div>
                                <input
                                  type="text"
                                  value={vid.duration}
                                  onChange={(e) => handleVideoChange(index, 'duration', e.target.value)}
                                  className="w-full px-4 py-2.5 bg-[#111] border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#E87C41]/50 text-white placeholder-gray-600 transition-all"
                                  placeholder="Duration (e.g. 10:30)"
                                />
                              </div>
                              <div>
                                <div className="relative group">
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-600 group-focus-within:text-[#E87C41]">
                                    {courseType === 'free' ? <Tv className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                                  </span>
                                  {courseType === 'free' ? (
                                    <input
                                      type="url"
                                      required
                                      value={vid.videoUrl}
                                      onChange={(e) => handleVideoChange(index, 'videoUrl', e.target.value)}
                                      className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#E87C41]/50 text-white placeholder-gray-600 transition-all"
                                      placeholder="YouTube URL"
                                    />
                                  ) : (
                                    <div className="flex flex-col space-y-2">
                                      <input
                                        type="file"
                                        accept="video/*"
                                        required={!vid.videoUrl}
                                        onChange={(e) => handleVideoChange(index, 'videoFile', e.target.files[0])}
                                        className="w-full pl-10 pr-4 py-2 bg-[#111] border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#E87C41]/50 text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-[#E87C41]/20 file:text-[#E87C41] cursor-pointer"
                                      />
                                      {vid.videoUrl && !vid.videoFile && (
                                        <span className="text-[10px] uppercase font-bold px-3 py-1.5 rounded-md inline-block w-fit bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30 shadow-inner">
                                          âœ“ Video Uploaded
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Submit Footer */}
                  <div className="lg:col-span-12 pt-8 mt-2 border-t border-white/5 flex justify-end">
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="bg-gradient-to-r from-[#E87C41] to-[#ff945b] text-black py-3.5 px-10 rounded-xl font-bold text-sm transition-all focus:outline-none shadow-[0_0_20px_rgba(232,124,65,0.4)] hover:shadow-[0_0_30px_rgba(232,124,65,0.6)] flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {formLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Saving Changes...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5" />
                          <span>{editingCourse ? 'Save Course Changes' : 'Publish Course'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* â”€â”€â”€ Quick Add Video Modal â”€â”€â”€ */}
        {addingVideoToCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" style={{ backgroundColor: 'var(--bg-overlay)' }}>
            <div className="rounded-2xl w-full max-w-md p-6 border shadow-xl relative animate-scale-in" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <button
                onClick={() => setAddingVideoToCourse(null)}
                className="absolute top-4 right-4 p-1 rounded-md transition-colors hover:bg-[var(--bg-input)]"
                style={{ color: 'var(--text-muted)' }}
              >
                <X className="h-5 w-5" />
              </button>
              
              <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Add New Video</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>To course: <span className="font-medium text-[var(--accent)]">{addingVideoToCourse.title}</span></p>

              {error && (
                <div className="mb-4 p-3 rounded-xl flex items-center space-x-2 text-sm" style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', border: '1px solid var(--danger)' }}>
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleQuickAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Video Title</label>
                  <input
                    type="text"
                    required
                    value={newVideoState.title}
                    onChange={(e) => setNewVideoState({...newVideoState, title: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                    style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                    placeholder="e.g. Introduction to React"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Duration <span style={{ color: 'var(--text-muted)' }}>(optional)</span></label>
                  <input
                    type="text"
                    value={newVideoState.duration}
                    onChange={(e) => setNewVideoState({...newVideoState, duration: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                    style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                    placeholder="e.g. 10:30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                    {addingVideoToCourse.courseType === 'free' ? 'YouTube URL' : 'Upload Video File'}
                  </label>
                  {addingVideoToCourse.courseType === 'free' ? (
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" style={{ color: 'var(--text-muted)' }}>
                        <Tv className="h-4 w-4" />
                      </span>
                      <input
                        type="url"
                        required
                        value={newVideoState.videoUrl}
                        onChange={(e) => setNewVideoState({...newVideoState, videoUrl: e.target.value})}
                        className="w-full pl-9 pr-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                        style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" style={{ color: 'var(--text-muted)' }}>
                        <Video className="h-4 w-4" />
                      </span>
                      <input
                        type="file"
                        accept="video/*"
                        required
                        onChange={(e) => setNewVideoState({...newVideoState, videoFile: e.target.files[0]})}
                        className="w-full pl-9 pr-3 py-1.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all cursor-pointer"
                        style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={quickAddLoading}
                  className="w-full mt-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white py-2.5 px-4 rounded-xl font-medium text-sm transition-all focus:outline-none shadow-lg flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-55 btn-press"
                >
                  {quickAddLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      <span>Upload & Add Video</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Content specific to Active Tab */}

        {/* ─── Activity Overview Tab ─── */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in space-y-8">
            
            {/* Elegant Modern Hero */}
            {!overviewLoading && overviewData.length > 0 && (
              <div className="bg-gradient-to-br from-[#1a1310] to-[#050505] border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden group shadow-lg">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#E87C41]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-[#111] border border-white/5 rounded-2xl flex items-center justify-center text-[#E87C41] shadow-inner group-hover:scale-105 transition-transform duration-500">
                      <BarChart3 className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-gray-400 font-semibold uppercase tracking-wider text-xs mb-1.5">Total Active Enrollments</h3>
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <p className="text-emerald-400 font-medium text-[11px] uppercase tracking-widest">Live Platform Activity</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl md:text-7xl font-bold tracking-tight text-white drop-shadow-sm">
                      {overviewData.reduce((acc, course) => acc + course.activeCount, 0)}
                    </span>
                    <span className="text-gray-500 font-semibold text-sm uppercase tracking-wider">Students</span>
                  </div>
                </div>
              </div>
            )}

            {/* Search Matrix */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-[#0a0a0a] border border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Performance Matrix</h2>
                <p className="text-gray-400 font-medium mt-1 text-xs">Engagement metrics across curriculum modules</p>
              </div>
              <div className="relative w-full md:w-[350px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={overviewSearchQuery}
                  onChange={(e) => setOverviewSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 text-sm font-medium transition-all bg-[#111] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#E87C41] focus:ring-1 focus:ring-[#E87C41]/30 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Matrix Grid */}
            {overviewLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-3xl border border-white/5 bg-[#0a0a0a] overflow-hidden flex flex-col" style={{ animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`, animationDelay: `${i * 0.15}s` }}>
                    <div className="h-44 bg-[#111] w-full"></div>
                    <div className="p-6 flex-1 flex flex-col gap-4">
                      <div className="w-1/3 h-3 bg-white/5 rounded-full"></div>
                      <div className="w-3/4 h-5 bg-white/10 rounded-full"></div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="h-20 bg-[#111] rounded-2xl border border-white/5"></div>
                        <div className="h-20 bg-[#111] rounded-2xl border border-white/5"></div>
                      </div>
                      <div className="w-full h-12 bg-white/5 rounded-xl mt-2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : overviewData.length === 0 ? (
              <div className="text-center py-20 bg-[#0a0a0a] rounded-3xl border border-white/5">
                <ClipboardList className="h-10 w-10 mx-auto mb-4 opacity-30 text-[#E87C41]" />
                <p className="text-sm font-bold text-white uppercase tracking-widest">No Analytical Data</p>
                <p className="text-xs font-medium text-gray-500 mt-2">Metrics will appear once courses are populated.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {overviewData
                  .filter(c => c.title.toLowerCase().includes(overviewSearchQuery.toLowerCase()))
                  .map((course, idx) => (
                  <div key={course._id} className="rounded-3xl border border-white/10 bg-[#0a0a0a] hover:border-[#E87C41]/30 transition-all duration-300 flex flex-col group hover:-translate-y-1 hover:shadow-xl overflow-hidden" style={{ animation: `ma-card-in 0.5s ease-out ${idx * 0.1}s both` }}>
                    
                    {/* Thumbnail Area */}
                    <div className="h-44 relative overflow-hidden bg-[#111]">
                      {course.thumbnail ? (
                        <>
                          <img src={course.thumbnail?.startsWith('/uploads') ? `${API_URL.replace('/api', '')}${course.thumbnail}` : course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-80"></div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                           <BookOpen className="w-10 h-10 text-white/10 group-hover:text-[#E87C41]/30 transition-colors" />
                        </div>
                      )}
                      
                      <div className="absolute bottom-4 left-4 flex items-center gap-2">
                        <span className="bg-[#E87C41] text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm">
                          {course.category || 'General'}
                        </span>
                        {course.totalVideos > 0 && (
                          <span className="bg-black/60 backdrop-blur-md border border-white/10 text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                            {course.totalVideos} Modules
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Card Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div className="mb-6">
                        <h3 className="font-bold text-lg line-clamp-2 text-white group-hover:text-[#E87C41] transition-colors leading-snug">{course.title}</h3>
                      </div>

                      {/* Stats Row */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex flex-col p-4 rounded-2xl bg-[#111] border border-white/5 transition-colors group-hover:border-emerald-500/20">
                          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>Active</span>
                          <span className="text-2xl font-bold text-white">{course.activeCount}</span>
                        </div>
                        <div className="flex flex-col p-4 rounded-2xl bg-[#111] border border-white/5 transition-colors group-hover:border-rose-500/20">
                          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>Inactive</span>
                          <span className="text-2xl font-bold text-white">{course.inactiveCount}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => navigate('/admin/course/' + course._id + '/analytics', { state: { course } })}
                        className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all bg-[#111] border border-white/10 text-white hover:bg-[#E87C41] hover:border-[#E87C41] group/btn"
                      >
                        <span>View Analytics</span>
                        <ArrowLeft className="h-4 w-4 rotate-180 transform group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── Certificate Configuration Tab ─── */}
        {activeTab === 'settings' && (
          <div className="animate-fade-in space-y-8">
            {/* Elegant Header */}
            <div className="bg-gradient-to-br from-[#1a1310] to-[#0a0a0a] border border-white/10 rounded-[2rem] p-10 relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E87C41]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-[#111] border border-white/10 shadow-inner group-hover:border-[#E87C41]/30 transition-colors">
                    <Award className="h-7 w-7 text-[#E87C41]" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white group-hover:text-[#E87C41] transition-colors">Certificate Configuration</h2>
                    <p className="text-sm mt-1 text-gray-400 tracking-wider">Design formal certificate templates for automatic generation.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 max-w-4xl mx-auto gap-8">
              {/* Graphic Template Card */}
              <div className="rounded-[2rem] border border-white/10 bg-[#0a0a0a] shadow-2xl overflow-hidden flex flex-col transition-all duration-300">
                <div className="p-8 border-b border-white/5 bg-[#111] flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center space-x-3">
                      <Image className="h-5 w-5 text-[#E87C41]" />
                      <span>Graphic Background</span>
                    </h3>
                    <p className="text-sm mt-2 text-gray-400">Upload a high-quality JPG/PNG background. The system overlays details automatically.</p>
                  </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col">
                  {/* Logic: Only show ONE thing. Either the uploaded preview, the selected file preview, or the upload zone. */}
                  {(certificateTemplate || templateFile) ? (
                    <div className="relative group rounded-2xl overflow-hidden border border-white/10 bg-[#111] p-4 animate-scale-in">
                      {/* Image Preview */}
                      <div className="relative rounded-xl overflow-hidden shadow-2xl bg-black flex items-center justify-center min-h-[300px]">
                        {templateFile ? (
                          <img src={URL.createObjectURL(templateFile)} alt="Selected Template" className="w-full h-auto max-h-[400px] object-contain opacity-90 group-hover:opacity-100 transition-opacity" />
                        ) : (
                          <img src={certificateTemplate.startsWith('http') ? certificateTemplate : `https://e-learning-backend-1-r539.onrender.com${certificateTemplate}`} alt="Current Template" className="w-full h-auto max-h-[400px] object-contain opacity-90 group-hover:opacity-100 transition-opacity" onError={(e) => { e.target.style.display = 'none'; }} />
                        )}
                        
                        {/* Overlay to enforce removal */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center backdrop-blur-sm">
                          <p className="text-white font-bold mb-4 tracking-widest uppercase text-sm">Active Template</p>
                          <button 
                            onClick={(e) => { e.preventDefault(); setCertificateTemplate(''); setTemplateFile(null); }}
                            className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-xl font-bold text-sm tracking-wide flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-[0_0_20px_rgba(244,63,94,0.4)]"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove to Upload New
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between px-2">
                         <div className="flex items-center space-x-2">
                           <CheckCircle className="h-4 w-4 text-emerald-500" />
                           <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Ready for Deployment</span>
                         </div>
                         <span className="text-xs text-gray-500 font-medium">{templateFile ? templateFile.name : 'Current Server Template'}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative group flex-1 animate-fade-in">
                      <div className="absolute -inset-0.5 rounded-[2rem] blur opacity-0 group-hover:opacity-20 transition duration-1000 bg-[#E87C41]"></div>
                      <div className="relative h-[300px] border-2 border-dashed border-white/10 rounded-[1.5rem] bg-[#111] p-8 text-center flex flex-col items-center justify-center transition-colors duration-300 group-hover:bg-[#1a1a1a] group-hover:border-[#E87C41]/30">
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/webp"
                          onChange={(e) => setTemplateFile(e.target.files[0])}
                          className="hidden"
                          id="template-upload"
                        />
                        <label htmlFor="template-upload" className="cursor-pointer flex flex-col items-center w-full h-full justify-center">
                          <div className="h-20 w-20 rounded-full flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 shadow-lg bg-[#0a0a0a] border border-[#E87C41]/20 group-hover:border-[#E87C41]">
                            <Image className="h-8 w-8 text-[#E87C41]" />
                          </div>
                          <span className="font-bold text-lg mb-2 text-white">Upload New Template</span>
                          <span className="text-xs font-medium text-gray-400 mb-6">Drag & drop or click to browse</span>
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 px-4 py-1.5 rounded-full bg-white/5 border border-white/5">PNG, JPG (Max 5MB)</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Save Action */}
            <div className="flex justify-end pt-4 pb-10 max-w-4xl mx-auto">
              <button
                onClick={handleSaveSettings}
                disabled={savingSettings || (!templateFile && certificateTemplate === '')}
                className="relative inline-flex items-center justify-center space-x-3 px-10 py-4 rounded-xl font-bold text-sm transition-all duration-300 shadow-[0_0_20px_rgba(232,124,65,0.2)] hover:shadow-[0_0_30px_rgba(232,124,65,0.4)] focus:outline-none group overflow-hidden bg-[#E87C41] text-white disabled:opacity-50 hover:-translate-y-1"
              >
                <div className="absolute inset-0 w-0 bg-white/20 transition-all duration-500 ease-out group-hover:w-full z-0"></div>
                {savingSettings ? <Loader2 className="h-5 w-5 animate-spin relative z-10" /> : <Save className="h-5 w-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />}
                <span className="relative z-10 uppercase tracking-widest">Deploy Configuration</span>
              </button>
            </div>
          </div>
        )}

        {/* ─── Certificate Requests Tab ─── */}
        {activeTab === 'requests' && (
          <div className="animate-fade-in space-y-8">
            {/* Elegant Header */}
            <div className="bg-gradient-to-br from-[#1a1310] to-[#0a0a0a] border border-white/10 rounded-[2rem] p-10 relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-[#111] border border-white/10 shadow-inner group-hover:border-emerald-500/30 transition-colors">
                    <Award className="h-7 w-7 text-emerald-500" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white group-hover:text-emerald-500 transition-colors">Pending Certificate Requests</h2>
                    <p className="text-sm mt-1 text-gray-400 tracking-wider">Review student scores and approve certificates for generation.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-[2rem] border border-white/10 bg-[#0a0a0a] shadow-2xl overflow-hidden flex flex-col">
              <div className="p-8 border-b border-white/5 bg-[#111] flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center space-x-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"></span>
                  <span>Action Required</span>
                </h3>
              </div>
              
              <div className="p-8">
                {requestsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="bg-[#111] border border-white/5 p-5 rounded-2xl flex items-center justify-between overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                        <div className="flex items-center gap-5 relative z-10">
                          <div className="w-12 h-12 rounded-xl bg-white/10"></div>
                          <div className="space-y-3">
                            <div className="w-40 h-5 bg-white/10 rounded-md"></div>
                            <div className="w-24 h-3 bg-white/5 rounded-md"></div>
                          </div>
                        </div>
                        <div className="w-32 h-10 rounded-xl bg-white/10 relative z-10"></div>
                      </div>
                    ))}
                  </div>
                ) : certificateRequests.length === 0 ? (
                  <div className="text-center py-20 bg-[#111] rounded-2xl border border-white/5">
                    <CheckCircle className="h-16 w-16 mx-auto mb-6 text-emerald-500/20" />
                    <h3 className="text-xl font-bold text-white tracking-tight mb-2">You're all caught up!</h3>
                    <p className="text-sm text-gray-400 font-medium tracking-wide">No pending certificate requests at the moment.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#111]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 bg-[#050505]">
                          <th className="py-5 px-8 font-bold text-[10px] uppercase tracking-[0.2em] text-gray-500">Student Profile</th>
                          <th className="py-5 px-4 font-bold text-[10px] uppercase tracking-[0.2em] text-gray-500">Course</th>
                          <th className="py-5 px-4 font-bold text-[10px] text-center uppercase tracking-[0.2em] text-gray-500">Score</th>
                          <th className="py-5 px-8 font-bold text-[10px] text-right uppercase tracking-[0.2em] text-gray-500">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {certificateRequests.map((req, idx) => (
                          <tr key={req._id} className="border-b border-white/5 last:border-0 hover:bg-[#1a1a1a] transition-colors duration-300 group" style={{ animationDelay: `${idx * 0.05}s` }}>
                            <td className="py-5 px-8">
                              <div className="flex items-center space-x-4">
                                <div className="h-10 w-10 rounded-xl flex items-center justify-center text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 group-hover:scale-105 transition-transform font-bold shadow-inner">
                                  {req.student?.name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                  <div className="font-bold text-sm text-white">{req.student?.name}</div>
                                  <div className="text-xs mt-0.5 text-gray-500">{req.student?.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-5 px-4">
                              <div className="font-bold text-sm text-gray-300 group-hover:text-white transition-colors line-clamp-1">{req.course?.title}</div>
                              <div className="text-[10px] uppercase tracking-widest mt-1 text-[#E87C41] font-bold">{req.course?.category || 'General'}</div>
                            </td>
                            <td className="py-5 px-4 text-center">
                              <div className="inline-flex items-center justify-center h-8 px-4 rounded-lg font-bold text-xs border transition-colors duration-300" style={{ 
                                backgroundColor: req.score >= 80 ? 'rgba(16, 185, 129, 0.05)' : 'rgba(234, 179, 8, 0.05)',
                                color: req.score >= 80 ? '#10b981' : '#eab308',
                                borderColor: req.score >= 80 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(234, 179, 8, 0.2)'
                              }}>
                                {req.score} <span className="opacity-40 ml-1.5 font-medium text-[10px]">/ 100</span>
                              </div>
                            </td>
                            <td className="py-5 px-8 text-right">
                              <button
                                onClick={() => handleApproveRequest(req._id)}
                                className="relative inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] focus:outline-none overflow-hidden bg-emerald-500 text-white hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] active:scale-95"
                              >
                                <div className="absolute inset-0 w-0 bg-white/20 transition-all duration-500 ease-out hover:w-full z-0"></div>
                                <span className="relative z-10 uppercase tracking-wider">Approve & Generate</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── Pending Doubt Requests Tab ─── */}
        {activeTab === 'doubts' && (
          <div className="animate-fade-in space-y-8">
            {/* Elegant Header */}
            <div className="bg-gradient-to-br from-[#1a1310] to-[#0a0a0a] border border-white/10 rounded-[2rem] p-10 relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E87C41]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-[#111] border border-white/10 shadow-inner group-hover:border-[#E87C41]/30 transition-colors">
                    <MessageSquare className="h-7 w-7 text-[#E87C41]" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white group-hover:text-[#E87C41] transition-colors">Pending Doubt Requests</h2>
                    <p className="text-sm mt-1 text-gray-400 tracking-wider">Review and resolve student queries effectively.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {doubtsLoading ? (
              <div className="space-y-6">
                {[1, 2].map(i => (
                  <div key={i} className="bg-[#0a0a0a] border border-white/10 p-6 rounded-[2rem] flex flex-col gap-5 overflow-hidden relative shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/10"></div>
                        <div className="space-y-2">
                          <div className="w-40 h-4 bg-white/10 rounded"></div>
                          <div className="w-24 h-3 bg-white/5 rounded"></div>
                        </div>
                      </div>
                      <div className="w-20 h-6 bg-white/5 rounded-full"></div>
                    </div>
                    <div className="w-full h-24 bg-[#111] rounded-xl relative z-10"></div>
                    <div className="flex justify-end mt-2 relative z-10"><div className="w-40 h-12 rounded-xl bg-white/10"></div></div>
                  </div>
                ))}
              </div>
            ) : pendingDoubts.length === 0 ? (
              <div className="text-center py-20 bg-[#0a0a0a] rounded-[2rem] border border-white/10 shadow-lg">
                <CheckCircle className="h-16 w-16 mx-auto mb-6 text-[#E87C41]/20" />
                <h3 className="text-xl font-bold text-white tracking-tight mb-2">Inbox is clear!</h3>
                <p className="text-sm text-gray-400 font-medium tracking-wide">No pending doubts to resolve at this time.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {pendingDoubts.map((doubt, idx) => (
                  <div key={doubt._id} className="p-6 md:p-8 rounded-[2rem] border border-white/10 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(232,124,65,0.05)] bg-[#0a0a0a] group" style={{ animationDelay: `${idx * 0.05}s` }}>
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center text-sm font-bold text-[#E87C41] bg-[#1a1310] border border-[#E87C41]/20 shadow-inner">
                          {doubt.student?.profileImage ? <img src={doubt.student.profileImage} className="w-full h-full object-cover" /> : doubt.student?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="font-bold text-base text-white">{doubt.student?.name}</div>
                          <div className="text-xs uppercase tracking-widest text-gray-500 mt-1">{doubt.course?.title}</div>
                        </div>
                      </div>
                      <span className="bg-[#E87C41]/10 text-[#E87C41] border border-[#E87C41]/20 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E87C41] animate-pulse"></span>
                        Pending
                      </span>
                    </div>
                    
                    <div className="mb-6 p-5 rounded-2xl border border-white/5 bg-[#111] relative">
                      <div className="absolute top-0 left-0 w-1 h-full bg-[#E87C41] rounded-l-2xl opacity-50"></div>
                      <p className="text-sm text-gray-300 leading-relaxed pl-2">{doubt.questionText}</p>
                      {doubt.questionMedia && (
                        <div className="mt-4 pl-2">
                          {doubt.questionMedia.match(/\.(mp4|webm|ogg)$/i) ? (
                            <video src={`https://e-learning-backend-1-r539.onrender.com${doubt.questionMedia}`} controls className="max-w-xs w-full rounded-xl border border-white/10 shadow-md" />
                          ) : (
                            <img src={`https://e-learning-backend-1-r539.onrender.com${doubt.questionMedia}`} alt="Doubt media" className="max-w-xs w-full rounded-xl object-contain border border-white/10 shadow-md" />
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="rounded-2xl overflow-hidden bg-[#111] border border-white/5 p-5 transition-colors group-hover:border-[#E87C41]/20">
                      <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-500 flex items-center gap-2">
                        <MessageSquare className="h-3 w-3" /> Provide Resolution
                      </h4>
                      <textarea
                        className="w-full p-4 rounded-xl text-sm mb-4 focus:outline-none focus:ring-1 focus:ring-[#E87C41] resize-none bg-[#0a0a0a] border border-white/10 text-white placeholder-gray-600 transition-shadow"
                        rows="3"
                        placeholder="Type your comprehensive solution here..."
                        value={replyTexts[doubt._id] || ''}
                        onChange={(e) => setReplyTexts({ ...replyTexts, [doubt._id]: e.target.value })}
                      ></textarea>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="relative overflow-hidden">
                          <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={(e) => setReplyFiles({ ...replyFiles, [doubt._id]: e.target.files[0] })}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            id={`reply-file-${doubt._id}`}
                          />
                          <div className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-white/10 bg-[#1a1a1a] text-xs font-bold text-gray-400 group-hover:bg-[#1a1310] transition-colors">
                             <Image className="h-4 w-4 text-[#E87C41]" />
                             <span>{replyFiles[doubt._id] ? replyFiles[doubt._id].name.substring(0,20)+'...' : 'Attach Reference'}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleReplyDoubt(doubt._id)}
                          disabled={submittingReply === doubt._id || !(replyTexts[doubt._id] || '').trim()}
                          className="px-8 py-3 rounded-xl text-xs font-bold text-white transition-all duration-300 shadow-[0_0_15px_rgba(232,124,65,0.15)] hover:shadow-[0_0_25px_rgba(232,124,65,0.3)] disabled:opacity-50 focus:outline-none bg-[#E87C41] flex items-center space-x-2 hover:-translate-y-0.5"
                        >
                          {submittingReply === doubt._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                          <span className="uppercase tracking-widest">Submit Solution</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="relative">
            {/* Edge Glow Effects */}
            <div className="absolute -left-20 top-1/4 w-40 h-96 bg-[#E87C41]/10 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute -right-20 top-1/3 w-40 h-96 bg-[#E87C41]/10 blur-[100px] rounded-full pointer-events-none"></div>

            {/* --- Today's Live Classes --- */}
            {!loading && upcomingLiveClasses.length > 0 && (
              <div className="mb-10 animate-slide-up relative z-10">
                <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3 text-white tracking-wide">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#E87C41]/10 border border-[#E87C41]/20 text-[#E87C41] shadow-inner">
                    <Clock className="h-5 w-5" />
                  </span>
                  <span>Upcoming Live Classes</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {upcomingLiveClasses.map(lc => {
                    const isLive = lc.status === 'live';
                    return (
                      <div key={lc._id} className="glass-panel border border-white/10 p-6 rounded-[24px] relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#E87C41]"></div>
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-white text-[17px] line-clamp-1 group-hover:text-[#E87C41] transition-colors pr-4">{lc.title}</h3>
                          {isLive && <span className="flex h-3.5 w-3.5 shrink-0"><span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-[#E87C41] opacity-75"></span><span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#E87C41]"></span></span>}
                        </div>
                        <div className="inline-block bg-[#E87C41]/10 border border-[#E87C41]/20 text-[#E87C41] text-[13px] font-semibold px-3 py-1.5 rounded-lg mb-4">
                          {new Date(lc.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </div>
                        <div className="pt-4 border-t border-white/5 mb-4">
                          <p className="text-[13px] text-white/50 font-medium">Course</p>
                          <p className="text-[14px] text-white/90 line-clamp-1 font-semibold">{lc.courseTitle}</p>
                        </div>
                        <button
                          onClick={() => navigate(`/live/${lc.courseId}/${lc.chapterId}/${lc._id}`)}
                          className={`w-full py-3 rounded-[12px] text-sm font-bold text-white transition-all ${isLive ? 'bg-[#E87C41] hover:bg-[#ff8f54] shadow-[0_0_15px_rgba(232,124,65,0.4)] animate-pulse' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
                        >
                          {isLive ? 'Join Live Now' : 'Enter Waiting Room'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* â”€â”€â”€ Course List â”€â”€â”€ */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="glass-panel rounded-2xl overflow-hidden flex flex-col h-[380px]" style={{ animation: `admin-skeleton-pulse 1.5s infinite ease-in-out ${i * 0.1}s` }}>
                    <div className="h-[180px] bg-white/5 w-full"></div>
                    <div className="p-5 flex flex-col flex-1 gap-3">
                      <div className="w-20 h-5 rounded-full bg-white/10"></div>
                      <div className="w-3/4 h-6 rounded bg-white/10"></div>
                      <div className="w-full h-4 rounded bg-white/5 mt-auto"></div>
                      <div className="flex gap-2 mt-4">
                        <div className="flex-1 h-10 rounded-lg bg-white/10"></div>
                        <div className="flex-1 h-10 rounded-lg bg-white/10"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 px-6 animate-fade-in glass rounded-3xl border shadow-xl max-w-xl mx-auto mt-10" style={{ borderColor: 'var(--border-color)' }}>
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-[var(--accent)] to-[#ec4899] mb-6 shadow-lg shadow-[var(--accent-glow)] animate-float">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-muted)]">
              No courses yet
            </h3>
            <p className="text-sm mt-3 max-w-xs mx-auto font-medium" style={{ color: 'var(--text-muted)' }}>
              Get started by clicking the "Add New Course" button above to create your first educational content.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {courses.map((course) => (
              <div
                key={course._id}
                className="relative flex flex-col p-6 rounded-[28px] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,255,255,0.05)] group"
                style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', minHeight: '440px' }}
              >
                {/* Mac OS Window Controls */}
                <div className="flex items-center gap-1.5 mb-4">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                  <div 
                    onClick={() => {
                      navigate('/admin/course/' + course._id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-3 h-3 rounded-full bg-[#27C93F] cursor-pointer hover:scale-150 transition-transform"
                    title="Open Course Details"
                  ></div>
                </div>

                {/* Thumbnail Image Container */}
                <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-4">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail?.startsWith('/uploads') ? `${API_URL.replace('/api', '')}${course.thumbnail}` : course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="w-full h-full relative"
                      style={{
                        background: course.courseType === 'free'
                            ? 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(4,120,87,0.4) 100%)'
                            : 'linear-gradient(135deg, rgba(30,20,15,0.8) 0%, rgba(5,5,5,0.9) 100%)',
                      }}
                    >
                       <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9yZWN0Pgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+Cjwvc3ZnPg==')" }}></div>
                    </div>
                  )}

                  {/* Image Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>

                  {/* Admin Actions (Floating over image on hover) */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px] z-20">
                    <button
                      onClick={() => {
                        handleOpenEdit(course);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="p-3 bg-[#E87C41] text-white rounded-full hover:scale-110 transition-transform shadow-[0_0_15px_rgba(232,124,65,0.5)]"
                      title="Edit Course"
                    >
                      <Edit3 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(course)}
                      className="p-3 bg-red-600 text-white rounded-full hover:scale-110 transition-transform shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                      title="Delete Course"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Tags and Students Metric Row */}
                <div className="flex justify-between items-start mb-4 mt-2">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3.5 py-1.5 rounded-full border border-white/20 text-white/70 text-[13px] bg-transparent">
                      Placement Focused
                    </span>
                    <span className="px-3.5 py-1.5 rounded-full border border-white/20 text-white/70 text-[13px] bg-transparent">
                      {course.category || 'Aptitude'}
                    </span>
                  </div>

                  <div 
                    onClick={() => {
                      navigate(`/admin/course/${course._id}/students`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-1.5 text-[13px] font-bold text-white/80 hover:text-[#E87C41] transition-all cursor-pointer group/students bg-white/5 hover:bg-[#E87C41]/10 px-3.5 py-1.5 rounded-full border border-white/10 hover:border-[#E87C41]/30 shadow-sm whitespace-nowrap shrink-0"
                  >
                    <Users className="h-4 w-4 group-hover/students:scale-110 transition-transform shrink-0" />
                    <span className="whitespace-nowrap">{course.enrolledCount || 0} Students</span>
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="text-[22px] font-semibold mb-6 line-clamp-2 leading-tight text-white group-hover:text-white/80 transition-colors duration-300 tracking-wide">
                  {course.title}
                </h3>
                  
                <div className="mt-auto">
                  {/* Price Block */}
                  <div className="flex items-end gap-2 mb-8">
                    <span className="text-white text-[22px] mb-0.5">Price</span>
                    {course.courseType === 'free' ? (
                      <span className="text-[28px] leading-none text-[#E87C41]">Free</span>
                    ) : (
                      <>
                        <span className="text-[28px] leading-none text-[#E87C41]">
                          Rs.{course.price}
                        </span>
                        <span className="text-[13px] text-white/40 line-through mb-1">
                          Rs.{Math.round(course.price * 2.1)}
                        </span>
                        <div className="ml-auto bg-white text-black text-[11px] font-medium px-2 py-1 rounded-sm">
                          53.4% OFF
                        </div>
                      </>
                    )}
                  </div>

                  {/* Action Button */}
                  {/* Action Button */}
                  <button
                    onClick={() => {
                      navigate('/admin/course/' + course._id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-fit px-5 py-2.5 rounded-[14px] font-bold text-[15px] text-white border border-white/20 bg-transparent cursor-pointer flex items-center gap-2 group/btn btn-sweep-transparent"
                  >
                    Manage Details <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )}
        
    {/* ─── Landing Page Management Tab ─── */}
        {activeTab === 'landing' && (
          <div className="animate-fade-in space-y-8">
            <div className="bg-gradient-to-br from-[#1a1310] to-[#0a0a0a] border border-white/10 rounded-[2rem] p-10 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E87C41]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-[#111] border border-white/10 shadow-inner">
                    <Layers className="h-7 w-7 text-[#E87C41]" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Landing Page</h2>
                    <p className="text-sm mt-1 text-gray-400">Manage hero video, homepage stats, and dynamic content.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* A. Hero Video */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Video className="w-5 h-5 text-[#E87C41]"/> Hero Video</h3>
              {landingVideo.url ? (
                <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black aspect-video max-w-2xl">
                  <video src={landingVideo.url} controls className="w-full h-full object-cover" />
                  <button onClick={async () => {
                    const token = localStorage.getItem('token');
                    await axios.put(`${API_URL}/settings/landing/video`, { url: '' }, { headers: { Authorization: `Bearer ${token}` } });
                    setLandingVideo({ url: '', poster: '' });
                  }} className="absolute top-4 right-4 bg-red-600/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold backdrop-blur-sm transition-colors">
                    Remove Video
                  </button>
                </div>
              ) : (
                <div className="max-w-2xl">
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-[#E87C41]/50 hover:bg-white/5 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Video className="w-8 h-8 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-400 font-semibold">{landingVideoUploading ? 'Uploading Video...' : 'Click to upload promo video'}</p>
                      <p className="text-xs text-gray-500">MP4, WebM up to 50MB</p>
                    </div>
                    <input type="file" className="hidden" accept="video/*" onChange={async (e) => {
                      if (!e.target.files?.[0]) return;
                      setLandingVideoUploading(true);
                      const formData = new FormData();
                      formData.append('video', e.target.files[0]);
                      try {
                        const token = localStorage.getItem('token');
                        const res = await axios.post(`${API_URL}/upload`, formData, { headers: { Authorization: `Bearer ${token}` } });
                        const vUrl = res.data.videoUrl;
                        await axios.put(`${API_URL}/settings/landing/video`, { url: vUrl }, { headers: { Authorization: `Bearer ${token}` } });
                        setLandingVideo({ url: vUrl, poster: '' });
                      } catch(err) { alert('Video upload failed'); }
                      finally { setLandingVideoUploading(false); }
                    }} disabled={landingVideoUploading} />
                  </label>
                </div>
              )}
            </div>

            {/* B. Stats Section */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-[#E87C41]"/> Homepage Stats</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Stat 1 Label (e.g., YouTube Subscribers)</label>
                  <input type="text" value={landingStats.stat1Label} onChange={e => setLandingStats({...landingStats, stat1Label: e.target.value})} className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#E87C41]/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Stat 1 Value (e.g., 600k)</label>
                  <input type="text" value={landingStats.stat1Value} onChange={e => setLandingStats({...landingStats, stat1Value: e.target.value})} className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#E87C41]/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Stat 2 Label (e.g., Career-Driven Learners)</label>
                  <input type="text" value={landingStats.stat2Label} onChange={e => setLandingStats({...landingStats, stat2Label: e.target.value})} className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#E87C41]/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Stat 2 Value (e.g., 01 Million)</label>
                  <input type="text" value={landingStats.stat2Value} onChange={e => setLandingStats({...landingStats, stat2Value: e.target.value})} className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#E87C41]/50" />
                </div>
              </div>
              <button onClick={async () => {
                try {
                  const token = localStorage.getItem('token');
                  await axios.put(`${API_URL}/settings/landing/stats`, landingStats, { headers: { Authorization: `Bearer ${token}` } });
                  alert('Stats saved successfully');
                } catch(err) { console.error(err); }
              }} className="bg-[#E87C41] hover:bg-[#d06b36] text-white px-6 py-2.5 rounded-xl font-bold transition-colors">
                Save Stats
              </button>
            </div>

            {/* C. Impact Memories */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Image className="w-5 h-5 text-[#E87C41]"/> Impact Memories Gallery</h3>
              
              {/* Existing Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                {landingImpact.map((item, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden border border-white/10 group aspect-[4/3] bg-black">
                    <img src={item.imageUrl.startsWith('/uploads') ? `${API_URL.replace('/api', '')}${item.imageUrl}` : item.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                    <div className="absolute inset-0 p-4 flex flex-col justify-end">
                      {item.tag && <span className="bg-[#E87C41] text-white text-[10px] font-bold px-2 py-1 rounded w-max mb-2">{item.tag}</span>}
                      <h4 className="text-white font-bold">{item.title}</h4>
                      <p className="text-gray-300 text-xs line-clamp-2">{item.description}</p>
                    </div>
                    <button onClick={async () => {
                      const token = localStorage.getItem('token');
                      await axios.delete(`${API_URL}/settings/landing/impact/${idx}`, { headers: { Authorization: `Bearer ${token}` } });
                      setLandingImpact(landingImpact.filter((_, i) => i !== idx));
                    }} className="absolute top-2 right-2 bg-red-600/80 p-2 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Form */}
              <div className="bg-[#0a0a0a] p-6 rounded-xl border border-white/5">
                <h4 className="text-white font-bold mb-4">Add New Memory</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Image Upload</label>
                    <input type="file" accept="image/*" onChange={async (e) => {
                      if (!e.target.files?.[0]) return;
                      setImpactUploading(true);
                      const formData = new FormData();
                      formData.append('image', e.target.files[0]);
                      try {
                        const token = localStorage.getItem('token');
                        const res = await axios.post(`${API_URL}/upload/image`, formData, { headers: { Authorization: `Bearer ${token}` } });
                        setImpactForm({...impactForm, imageUrl: res.data.imageUrl});
                      } catch(err) { alert('Upload failed'); }
                      finally { setImpactUploading(false); }
                    }} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer" />
                    {impactUploading && <p className="text-gray-400 text-xs mt-2 animate-pulse">Uploading...</p>}
                    {impactForm.imageUrl && (
                      <div className="mt-3 relative w-32 h-20 rounded-lg overflow-hidden border border-white/20">
                        <img src={impactForm.imageUrl} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <span className="text-white text-xs font-bold">Uploaded</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Title</label>
                    <input type="text" value={impactForm.title} onChange={e => setImpactForm({...impactForm, title: e.target.value})} className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#E87C41]/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Description</label>
                    <input type="text" value={impactForm.description} onChange={e => setImpactForm({...impactForm, description: e.target.value})} className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#E87C41]/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Tag (e.g. Meet-ups)</label>
                    <input type="text" value={impactForm.tag} onChange={e => setImpactForm({...impactForm, tag: e.target.value})} className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#E87C41]/50" />
                  </div>
                </div>
                <button onClick={async () => {
                  if (!impactForm.imageUrl) return alert('Please upload an image first');
                  const token = localStorage.getItem('token');
                  try {
                    const res = await axios.post(`${API_URL}/settings/landing/impact`, impactForm, { headers: { Authorization: `Bearer ${token}` } });
                    setLandingImpact(res.data);
                    setImpactForm({ imageUrl: '', title: '', description: '', tag: '' });
                  } catch(err) { console.error(err); }
                }} className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl font-bold transition-colors">
                  Add Memory
                </button>
              </div>
            </div>

            {/* D. Comparison */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2"><Type className="w-5 h-5 text-[#E87C41]"/> Us vs Others Comparison</h3>
                <button onClick={async () => {
                  try {
                    const token = localStorage.getItem('token');
                    await axios.put(`${API_URL}/settings/landing/comparison`, landingComparison, { headers: { Authorization: `Bearer ${token}` } });
                    alert('Comparison points saved');
                  } catch(err) { console.error(err); }
                }} className="bg-[#E87C41] hover:bg-[#d06b36] text-white px-5 py-2 rounded-xl font-bold text-sm transition-colors">
                  Save Changes
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Our Points */}
                <div className="bg-[#0a0a0a] p-6 rounded-xl border border-green-500/20">
                  <h4 className="text-green-500 font-bold mb-4 flex items-center gap-2">✓ Our Platform (Pros)</h4>
                  <div className="flex gap-2 mb-4">
                    <input type="text" value={newUsPoint} onChange={e => setNewUsPoint(e.target.value)} placeholder="Add point..." className="flex-1 px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-green-500/50" onKeyDown={e => {
                      if (e.key === 'Enter' && newUsPoint) {
                        setLandingComparison({...landingComparison, usPoints: [...landingComparison.usPoints, newUsPoint]});
                        setNewUsPoint('');
                      }
                    }}/>
                    <button onClick={() => {
                      if(newUsPoint) {
                        setLandingComparison({...landingComparison, usPoints: [...landingComparison.usPoints, newUsPoint]});
                        setNewUsPoint('');
                      }
                    }} className="px-4 py-2 bg-green-500/20 text-green-500 rounded-lg font-bold hover:bg-green-500/30">Add</button>
                  </div>
                  <ul className="space-y-2">
                    {landingComparison.usPoints.map((pt, i) => (
                      <li key={i} className="flex items-center justify-between bg-[#111] p-3 rounded-lg text-sm text-gray-300 border border-white/5">
                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></div>{pt}</span>
                        <button onClick={() => {
                          const newPts = [...landingComparison.usPoints];
                          newPts.splice(i, 1);
                          setLandingComparison({...landingComparison, usPoints: newPts});
                        }} className="text-gray-500 hover:text-red-500"><X className="w-4 h-4"/></button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Others Points */}
                <div className="bg-[#0a0a0a] p-6 rounded-xl border border-red-500/20">
                  <h4 className="text-red-500 font-bold mb-4 flex items-center gap-2">✕ Others (Cons)</h4>
                  <div className="flex gap-2 mb-4">
                    <input type="text" value={newOthersPoint} onChange={e => setNewOthersPoint(e.target.value)} placeholder="Add point..." className="flex-1 px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-red-500/50" onKeyDown={e => {
                      if (e.key === 'Enter' && newOthersPoint) {
                        setLandingComparison({...landingComparison, othersPoints: [...landingComparison.othersPoints, newOthersPoint]});
                        setNewOthersPoint('');
                      }
                    }}/>
                    <button onClick={() => {
                      if(newOthersPoint) {
                        setLandingComparison({...landingComparison, othersPoints: [...landingComparison.othersPoints, newOthersPoint]});
                        setNewOthersPoint('');
                      }
                    }} className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg font-bold hover:bg-red-500/30">Add</button>
                  </div>
                  <ul className="space-y-2">
                    {landingComparison.othersPoints.map((pt, i) => (
                      <li key={i} className="flex items-center justify-between bg-[#111] p-3 rounded-lg text-sm text-gray-300 border border-white/5">
                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div>{pt}</span>
                        <button onClick={() => {
                          const newPts = [...landingComparison.othersPoints];
                          newPts.splice(i, 1);
                          setLandingComparison({...landingComparison, othersPoints: newPts});
                        }} className="text-gray-500 hover:text-red-500"><X className="w-4 h-4"/></button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Certificate Settings Tab ─── */}
        {/* Second Settings Block Consolidated */}
      </div>


      {/* â”€â”€â”€ Overview Details Modal â”€â”€â”€ */}
      {showOverviewModal && selectedOverviewCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="rounded-2xl w-full max-w-md p-6 border shadow-2xl relative animate-scale-in flex flex-col max-h-[85vh]" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <button
              onClick={() => {
                setShowOverviewModal(false);
                setSelectedOverviewCourse(null);
              }}
              className="absolute top-4 right-4 p-1 rounded-md transition-colors hover:bg-[var(--bg-input)]"
              style={{ color: 'var(--text-muted)' }}
            >
              <X className="h-5 w-5" />
            </button>
            
            <h2 className="text-xl font-bold mb-4 line-clamp-1 pr-8" style={{ color: 'var(--text-primary)' }}>
              Activity Details: {selectedOverviewCourse.title}
            </h2>

            <div className="flex space-x-2 mb-6 p-1 rounded-lg" style={{ backgroundColor: 'var(--bg-input)' }}>
              <button
                onClick={() => setOverviewModalTab('active')}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${overviewModalTab === 'active' ? 'bg-white text-green-600 shadow-sm dark:bg-gray-800 dark:text-green-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
              >
                ðŸŸ¢ Active ({selectedOverviewCourse.activeCount})
              </button>
              <button
                onClick={() => setOverviewModalTab('inactive')}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${overviewModalTab === 'inactive' ? 'bg-white text-red-600 shadow-sm dark:bg-gray-800 dark:text-red-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
              >
                ðŸ”´ Inactive ({selectedOverviewCourse.inactiveCount})
              </button>
            </div>

            <div className="overflow-y-auto pr-2 space-y-3 flex-1">
              {(overviewModalTab === 'active' ? selectedOverviewCourse.activeStudents : selectedOverviewCourse.inactiveStudents).length === 0 ? (
                <div className="text-center py-10" style={{ color: 'var(--text-muted)' }}>
                  <Users className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p>No students found.</p>
                </div>
              ) : (
                (overviewModalTab === 'active' ? selectedOverviewCourse.activeStudents : selectedOverviewCourse.inactiveStudents).map(student => (
                  <div key={student._id} className="p-4 rounded-xl flex items-center justify-between shadow-sm transition-all hover:shadow-md" style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-white shrink-0 shadow-sm" style={overviewModalTab === 'active' ? { background: 'linear-gradient(135deg, #22c55e, #10b981)' } : { background: 'linear-gradient(135deg, #ef4444, #f43f5e)' }}>
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{student.name}</h4>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{student.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => fetchAIReport(student._id, selectedOverviewCourse._id, student.name)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all shadow-md btn-press hover:scale-105"
                      style={{ background: 'linear-gradient(135deg, #8b5cf6, #d946ef)' }}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>AI Analysis</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* â”€â”€â”€ Reviews Modal â”€â”€â”€ */}
      {showReviewsModal && selectedCourseForReviews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="rounded-2xl w-full max-w-2xl p-6 border shadow-2xl relative animate-scale-in flex flex-col max-h-[85vh]" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <button
              onClick={() => {
                setShowReviewsModal(false);
                setSelectedCourseForReviews(null);
              }}
              className="absolute top-4 right-4 p-1 rounded-md transition-colors hover:bg-[var(--bg-input)]"
              style={{ color: 'var(--text-muted)' }}
            >
              <X className="h-5 w-5" />
            </button>
            
            <h2 className="text-xl font-bold mb-1 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
              <MessageSquare className="h-5 w-5" style={{ color: 'var(--accent)' }} />
              <span>Reviews for {selectedCourseForReviews.title}</span>
            </h2>
            <div className="flex items-center space-x-2 mb-6 text-sm" style={{ color: 'var(--text-muted)' }}>
              <Star className="h-4 w-4" style={{ color: '#eab308', fill: '#eab308' }} />
              <span>{selectedCourseForReviews.rating ? selectedCourseForReviews.rating.toFixed(1) : 0} Average Rating</span>
              <span>â€¢</span>
              <span>{selectedCourseForReviews.numReviews || 0} Total Reviews</span>
            </div>

            <div className="overflow-y-auto pr-2 space-y-4 flex-1">
              {(!selectedCourseForReviews.reviews || selectedCourseForReviews.reviews.length === 0) ? (
                <div className="text-center py-10" style={{ color: 'var(--text-muted)' }}>
                  <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>No reviews yet.</p>
                </div>
              ) : (
                selectedCourseForReviews.reviews.map(review => (
                  <div key={review._id} className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{review.name}</h4>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-3.5 w-3.5" style={{ color: star <= review.rating ? '#eab308' : 'var(--border-color)', fill: star <= review.rating ? '#eab308' : 'none' }} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Students Progress Modal ─── */}
      {showStudentsModal && selectedCourseForStudents && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in relative" style={{ backgroundColor: 'rgba(11,11,12,0.85)', backdropFilter: 'blur(15px)' }}>
          {/* Background ambient glow for modal */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#E87C41] opacity-[0.08] blur-[120px] rounded-full pointer-events-none"></div>

          <div className="rounded-[28px] w-full max-w-3xl p-8 shadow-[0_20px_60px_rgba(232,124,65,0.15)] relative animate-scale-in flex flex-col max-h-[85vh] glass-panel border border-white/10">
            <button
              onClick={() => {
                setShowStudentsModal(false);
                setSelectedCourseForStudents(null);
                setStudentsList([]);
              }}
              className="absolute top-6 right-6 p-2 rounded-full transition-all hover:bg-white/10 hover:rotate-90 bg-white/5 text-white/60 hover:text-white border border-white/10"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-4 mb-2">
              <div className="p-3 rounded-2xl bg-[#E87C41]/10 border border-[#E87C41]/20 shadow-inner">
                <Users className="h-7 w-7 text-[#E87C41]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-wide">
                  Enrolled Students
                </h2>
                <p className="text-sm font-medium text-white/50 mt-1">
                  Course: <span className="text-[#E87C41]">{selectedCourseForStudents.title}</span>
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 flex items-center justify-between mb-6 mt-4">
              <span className="text-white/70 font-semibold uppercase tracking-wider text-[13px]">Total Students Enrolled</span>
              <span className="text-2xl font-bold text-white">{studentsList.length}</span>
            </div>

            <div className="overflow-y-auto pr-2 space-y-4 flex-1 custom-scrollbar">
              {studentsLoading ? (
                <div className="space-y-4 py-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="glass-panel p-4 rounded-[20px] flex items-center justify-between border border-white/5" style={{ animation: `admin-skeleton-pulse 1.5s infinite ease-in-out ${i*0.1}s` }}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/10"></div>
                        <div className="w-32 h-5 rounded bg-white/10"></div>
                      </div>
                      <div className="w-32 h-8 rounded-full bg-white/5"></div>
                    </div>
                  ))}
                </div>
              ) : studentsList.length === 0 ? (
                <div className="text-center py-16 flex flex-col items-center justify-center bg-white/5 rounded-[20px] border border-white/5">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Users className="h-10 w-10 text-white/30" />
                  </div>
                  <p className="text-lg font-bold text-white/80">No students found</p>
                  <p className="text-sm text-white/40 mt-2">There are currently no students enrolled in this course.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {studentsList.map((student, index) => (
                    <div key={student._id} className="p-5 rounded-[20px] flex items-center justify-between transition-all hover:-translate-y-1 hover:bg-white/10 bg-white/5 border border-white/10 group shadow-sm">
                      <div className="flex items-center space-x-5 flex-1">
                        <div className="flex items-center justify-center w-6 text-sm font-bold text-white/30 group-hover:text-[#E87C41] transition-colors">
                          #{index + 1}
                        </div>
                        <div className="h-12 w-12 rounded-full flex items-center justify-center font-bold text-white text-lg shrink-0 shadow-lg" style={{ background: 'linear-gradient(135deg, #E87C41, #ff9c6a)' }}>
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-[16px] text-white tracking-wide">{student.name}</h4>
                          <p className="text-[13px] text-white/50 font-medium">{student.email}</p>
                        </div>
                      </div>
                      <div className="flex-1 max-w-[220px] ml-4 bg-black/20 p-3 rounded-xl border border-white/5">
                        <div className="flex justify-between text-[13px] mb-2 font-semibold">
                          <span className="text-white/60 uppercase tracking-wide">Progress</span>
                          <span className={`${student.progressPercentage === 100 ? 'text-[#22c55e]' : 'text-[#E87C41]'}`}>{student.progressPercentage}%</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full overflow-hidden bg-white/10">
                          <div 
                            className="h-full transition-all duration-1000 ease-out relative"
                            style={{ 
                              width: `${student.progressPercentage}%`, 
                              backgroundColor: student.progressPercentage === 100 ? '#22c55e' : '#E87C41',
                              boxShadow: student.progressPercentage === 100 ? '0 0 10px rgba(34,197,94,0.6)' : '0 0 10px rgba(232,124,65,0.6)'
                            }}
                          >
                            <div className="absolute inset-0 bg-white/20 w-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* â”€â”€â”€ AI Analysis Modal â”€â”€â”€ */}
      {showAIModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in" style={{ backgroundColor: 'var(--bg-overlay)' }}>
          <div className="rounded-2xl w-full max-w-2xl p-6 md:p-8 shadow-xl relative animate-scale-in flex flex-col max-h-[90vh]" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setShowAIModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-md transition-colors hover:bg-[var(--bg-input)]"
              style={{ color: 'var(--text-muted)' }}
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-3 mb-6 shrink-0">
              <div className="p-2.5 rounded-xl shadow-lg" style={{ background: 'linear-gradient(135deg, #8b5cf6, #d946ef)' }}>
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  AI Performance Analysis
                </h2>
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Student: <span style={{ color: 'var(--accent)' }}>{selectedAIStudent}</span></p>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 pr-2 pb-2 custom-scrollbar">
              {aiLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full blur-md animate-pulse" style={{ backgroundColor: '#c084fc' }}></div>
                    <Loader2 className="h-10 w-10 animate-spin relative z-10" style={{ color: '#a855f7' }} />
                  </div>
                  <p className="font-medium animate-pulse" style={{ color: 'var(--text-secondary)' }}>Generating Visual AI Report...</p>
                </div>
              ) : aiReport?.error ? (
                <div className="p-6 rounded-xl bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 text-center border border-red-200 dark:border-red-900/50">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                  <p>{aiReport.error}</p>
                </div>
              ) : aiReport ? (
                <div className="space-y-6">
                  {/* Top Metrics Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Radial Score Chart */}
                    <div className="col-span-1 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden" style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent)] opacity-5 blur-2xl rounded-full"></div>
                      <h3 className="text-sm font-semibold mb-4 z-10" style={{ color: 'var(--text-secondary)' }}>Performance Score</h3>
                      <div className="relative w-24 h-24 flex items-center justify-center z-10">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-gray-200 dark:text-gray-700"
                            strokeWidth="3"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="transition-all duration-1000 ease-out"
                            strokeWidth="3"
                            strokeDasharray={`${aiReport.score || 0}, 100`}
                            stroke={aiReport.score >= 80 ? '#22c55e' : aiReport.score >= 50 ? '#eab308' : '#ef4444'}
                            strokeLinecap="round"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{aiReport.score || 0}</span>
                        </div>
                      </div>
                      <div className="mt-3 text-xs font-bold px-3 py-1 rounded-full z-10" style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent)' }}>
                        {aiReport.engagementLevel || 'Unknown'} Engagement
                      </div>
                    </div>

                    {/* Linear Stats */}
                    <div className="col-span-1 md:col-span-2 rounded-2xl p-6 flex flex-col justify-center space-y-6 shadow-sm" style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
                      <div>
                        <div className="flex justify-between text-sm mb-2 font-medium" style={{ color: 'var(--text-secondary)' }}>
                          <span>Average Playback Speed</span>
                          <span style={{ color: 'var(--text-primary)' }}>{aiReport.avgSpeed || 1}x</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                          <div 
                            className="h-full rounded-full bg-blue-500 transition-all duration-1000 ease-out relative"
                            style={{ width: `${Math.min(((aiReport.avgSpeed || 1) / 2) * 100, 100)}%` }}
                          >
                            <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-r from-transparent to-white opacity-20"></div>
                          </div>
                        </div>
                        <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>Normal pace is 1.0x</p>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2 font-medium" style={{ color: 'var(--text-secondary)' }}>
                          <span>Total Video Skips</span>
                          <span style={{ color: 'var(--text-primary)' }}>{aiReport.totalSkips || 0}</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                          <div 
                            className="h-full rounded-full bg-orange-500 transition-all duration-1000 ease-out relative"
                            style={{ width: `${Math.min(((aiReport.totalSkips || 0) / 10) * 100, 100)}%` }}
                          >
                            <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-r from-transparent to-white opacity-20"></div>
                          </div>
                        </div>
                        <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>Fewer skips indicate better focus</p>
                      </div>
                    </div>
                  </div>

                  {/* Strengths and Weaknesses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                      <h3 className="text-sm font-bold flex items-center space-x-2 mb-3 text-green-600 dark:text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        <span>Strengths</span>
                      </h3>
                      <ul className="space-y-2">
                        {aiReport.strengths && aiReport.strengths.length > 0 ? aiReport.strengths.map((str, idx) => (
                          <li key={idx} className="text-sm flex items-start space-x-2" style={{ color: 'var(--text-secondary)' }}>
                            <span className="text-green-500 mt-0.5 shrink-0">â€¢</span>
                            <span>{str}</span>
                          </li>
                        )) : <li className="text-sm text-gray-500 dark:text-gray-400">None identified.</li>}
                      </ul>
                    </div>

                    <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                      <h3 className="text-sm font-bold flex items-center space-x-2 mb-3 text-red-600 dark:text-red-400">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Areas for Improvement</span>
                      </h3>
                      <ul className="space-y-2">
                        {aiReport.weaknesses && aiReport.weaknesses.length > 0 ? aiReport.weaknesses.map((wk, idx) => (
                          <li key={idx} className="text-sm flex items-start space-x-2" style={{ color: 'var(--text-secondary)' }}>
                            <span className="text-red-500 mt-0.5 shrink-0">â€¢</span>
                            <span>{wk}</span>
                          </li>
                        )) : <li className="text-sm text-gray-500 dark:text-gray-400">None identified.</li>}
                      </ul>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
                    <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>AI Summary & Recommendations</h3>
                    <div 
                      className="text-sm leading-relaxed" 
                      style={{ color: 'var(--text-secondary)' }}
                      dangerouslySetInnerHTML={{ __html: aiReport.summary || '<p>No summary provided.</p>' }} 
                    />
                  </div>
                </div>
              ) : null}
            </div>
            
            {!aiLoading && (
              <div className="mt-6 flex justify-end shrink-0">
                <button
                  onClick={() => setShowAIModal(false)}
                  className="px-6 py-2.5 rounded-xl font-semibold text-white shadow-lg transition-all btn-press hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))' }}
                >
                  Close Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* â”€â”€â”€ Mock Test Modal â”€â”€â”€ */}
      {showMockTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-backdrop" style={{ backgroundColor: 'var(--bg-overlay)' }}>
          <div className="w-full max-w-2xl rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto animate-modal border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                <Brain className="h-6 w-6 text-purple-500" />
                <span>AI Mock Test Generator</span>
              </h2>
              <button
                onClick={() => setShowMockTestModal(false)}
                className="p-1 rounded-lg transition-colors cursor-pointer hover:bg-[var(--accent-glow)]"
                style={{ color: 'var(--text-muted)' }}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Topic</label>
                <input
                  type="text"
                  value={mockTestParams.topic}
                  onChange={(e) => setMockTestParams({ ...mockTestParams, topic: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  placeholder="e.g. React Hooks, Node.js Basics"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Number of Questions</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={mockTestParams.numQuestions}
                    onChange={(e) => setMockTestParams({ ...mockTestParams, numQuestions: parseInt(e.target.value) || 10 })}
                    className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Time Limit (Minutes)</label>
                  <input
                    type="number"
                    min="1"
                    value={mockTestParams.timeLimit}
                    onChange={(e) => setMockTestParams({ ...mockTestParams, timeLimit: parseInt(e.target.value) || 15 })}
                    className="w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerateMockTest}
              disabled={generatingMockTest}
              className="w-full py-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-lg mb-6 hover:scale-[1.01] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #d946ef)', color: '#fff' }}
            >
              {generatingMockTest ? (
                <><Loader2 className="h-5 w-5 animate-spin" /><span>Generating AI Questions...</span></>
              ) : (
                <><Sparkles className="h-5 w-5" /><span>Generate with AI</span></>
              )}
            </button>

            {generatedMockTest && (
              <div className="rounded-xl p-4 border mb-6 animate-slide-up" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
                <h3 className="font-bold text-lg mb-1 text-purple-500">{generatedMockTest.title}</h3>
                <p className="text-sm mb-4 font-medium" style={{ color: 'var(--text-muted)' }}>{generatedMockTest.questions.length} questions â€¢ {mockTestParams.timeLimit} mins</p>
                <div className="max-h-60 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                  {generatedMockTest.questions.map((q, i) => (
                    <div key={i} className="p-4 rounded-xl border shadow-sm" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                      <p className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>{i + 1}. {q.questionText}</p>
                      <ul className="text-sm space-y-2">
                        {q.options.map((opt, j) => (
                          <li 
                            key={j} 
                            className={`px-3 py-2 rounded-lg border ${j === q.correctAnswerIndex ? 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400 font-semibold' : 'border-transparent'}`}
                            style={j !== q.correctAnswerIndex ? { backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)' } : {}}
                          >
                            {String.fromCharCode(65 + j)}. {opt}
                          </li>
                        ))}
                      </ul>
                      {q.explanation && (
                        <p className="text-xs mt-3 p-2 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          <strong>Explanation:</strong> {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <button
                type="button"
                onClick={() => setShowMockTestModal(false)}
                className="px-5 py-2.5 rounded-xl font-medium transition-colors hover:bg-gray-200 dark:hover:bg-gray-800"
                style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMockTest}
                disabled={!generatedMockTest || savingMockTest}
                className="px-5 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
              >
                {savingMockTest ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                <span>Save to Course</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Custom Delete Confirmation Modal ─── */}
      {courseToDelete && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="glass-panel w-full max-w-sm rounded-[24px] shadow-2xl p-6 relative flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Delete Course?</h3>
            <p className="text-sm text-gray-400 mb-6">
              Are you sure you want to delete <span className="text-white font-semibold">"{courseToDelete.title}"</span>? This action cannot be undone.
            </p>
            <div className="flex items-center w-full space-x-3">
              <button
                onClick={() => setCourseToDelete(null)}
                className="flex-1 py-3 rounded-xl font-bold text-sm text-white bg-white/10 hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 rounded-xl font-bold text-sm text-white bg-red-600 hover:bg-red-700 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      </main>
    </div>
  );
};

export default AdminDashboard;

