import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  ClipboardList
} from 'lucide-react';

const API_URL = 'https://e-learning-backend-tubf.onrender.com/api';

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

const AdminDashboard = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseType, setCourseType] = useState('paid');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('General');
  const [customCategory, setCustomCategory] = useState('');
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
      setCourses(data);
    } catch (err) {
      setError('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);
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
              const uploadRes = await axios.post(`${API_URL}/upload`, formData);
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

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      setError('');
      await axios.delete(`${API_URL}/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Course deleted successfully!');
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete course');
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
        const uploadRes = await axios.post(`${API_URL}/upload`, formData);
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
    <div className="flex min-h-screen relative" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar - CodeHelp Style */}
      <aside className="w-64 flex-shrink-0 flex flex-col border-r shadow-sm z-20 sticky top-[72px] h-[calc(100vh-72px)]" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <div className="p-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <h2 className="text-xl font-bold tracking-wide" style={{ color: 'var(--text-primary)' }}>Admin Panel</h2>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {[
            { id: 'courses', icon: BookOpen, label: 'Manage Courses' },
            { id: 'overview', icon: BarChart3, label: 'Activity Overview' },
            { id: 'settings', icon: Settings, label: 'Certificate Settings' },
            { id: 'requests', icon: Award, label: 'Certificate Requests' },
            { id: 'doubts', icon: MessageSquare, label: 'Doubt Requests' }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full relative flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group overflow-hidden ${isActive ? 'bg-[var(--accent)] text-white shadow-md' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-input)] hover:text-[var(--text-primary)] hover:translate-x-1'}`}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-md animate-slide-up"></div>}
                <Icon className={`h-5 w-5 transition-transform duration-300 ${!isActive && 'group-hover:scale-110'}`} />
                <span className="relative z-10">{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 w-full max-w-full overflow-hidden">
        <div className="max-w-6xl mx-auto">
          {/* Header Area */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 border-b pb-6" style={{ borderColor: 'var(--border-color)' }}>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {activeTab === 'courses' ? 'Manage Courses' : activeTab === 'overview' ? 'Activity Overview' : activeTab === 'settings' ? 'Certificate Settings' : activeTab === 'requests' ? 'Certificate Requests' : 'Doubt Requests'}
              </h1>
              <p className="mt-1 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                View and manage your platform's content and student requests.
              </p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
                setError('');
                setSuccess('');
              }}
              className="flex items-center space-x-2 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm cursor-pointer"
              style={{ backgroundColor: 'var(--accent)' }}
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

        {/* â”€â”€â”€ Course Form Modal â”€â”€â”€ */}
        {showForm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-backdrop"
            style={{ backgroundColor: 'var(--bg-overlay)' }}
          >
            <div
              className="w-full max-w-xl rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto animate-modal border"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {editingCourse ? 'Edit Course' : 'Add New Course'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-1 rounded-lg transition-colors cursor-pointer hover:bg-[var(--accent-glow)]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* â”€â”€â”€ Free / Paid Toggle â”€â”€â”€ */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Course Type
                  </label>
                  <div
                    className="flex rounded-xl overflow-hidden"
                    style={{ border: '1px solid var(--border-color)' }}
                  >
                    <button
                      type="button"
                      onClick={() => setCourseType('free')}
                      className="flex-1 py-2.5 text-sm font-semibold transition-all cursor-pointer flex items-center justify-center space-x-2"
                      style={{
                        backgroundColor: courseType === 'free' ? '#22c55e' : 'transparent',
                        color: courseType === 'free' ? '#fff' : 'var(--text-muted)',
                      }}
                    >
                      <Tv className="h-4 w-4" />
                      <span>Free Course</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCourseType('paid')}
                      className="flex-1 py-2.5 text-sm font-semibold transition-all cursor-pointer flex items-center justify-center space-x-2"
                      style={{
                        backgroundColor: courseType === 'paid' ? 'var(--accent)' : 'transparent',
                        color: courseType === 'paid' ? '#fff' : 'var(--text-muted)',
                      }}
                    >
                      <DollarSign className="h-4 w-4" />
                      <span>Paid Course</span>
                    </button>
                  </div>
                  <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
                    {courseType === 'free'
                      ? 'ðŸŽ¥ Free courses use YouTube video links and are accessible to everyone.'
                      : 'ðŸ’° Paid courses use direct video URLs and require purchase.'}
                  </p>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Course Title
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" style={{ color: 'var(--text-muted)' }}>
                      <BookOpen className="h-5 w-5" />
                    </span>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                      style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                      placeholder="e.g. Full Stack Web Development"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Description
                  </label>
                  <div className="relative">
                    <span className="absolute top-3 left-3 pointer-events-none" style={{ color: 'var(--text-muted)' }}>
                      <FileText className="h-5 w-5" />
                    </span>
                    <textarea
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                      style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                      placeholder="Describe what students will learn..."
                    />
                  </div>
                </div>

                {/* Category + Level (side by side) */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Category
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" style={{ color: 'var(--text-muted)' }}>
                        <Tag className="h-4 w-4" />
                      </span>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all appearance-none cursor-pointer"
                        style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Level
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" style={{ color: 'var(--text-muted)' }}>
                        <BarChart3 className="h-4 w-4" />
                      </span>
                      <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all appearance-none cursor-pointer"
                        style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                      >
                        {LEVELS.map((l) => (
                          <option key={l.value} value={l.value}>{l.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {category === 'Other' && (
                  <div className="animate-slide-down">
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Custom Category Name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" style={{ color: 'var(--text-muted)' }}>
                        <Tag className="h-5 w-5" />
                      </span>
                      <input
                        type="text"
                        required
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                        style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                        placeholder="e.g. Photography"
                      />
                    </div>
                  </div>
                )}

                {/* Duration + Price (side by side) */}
                <div className={`grid gap-4 ${courseType === 'free' ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Duration
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" style={{ color: 'var(--text-muted)' }}>
                        <Clock className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                        style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                        placeholder="e.g. 4h 30m"
                      />
                    </div>
                  </div>

                  {courseType === 'paid' && (
                    <div className="animate-scale-in">
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                        Price ($)
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" style={{ color: 'var(--text-muted)' }}>
                          <DollarSign className="h-4 w-4" />
                        </span>
                        <input
                          type="number"
                          min="0"
                          required
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                          style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                          placeholder="499"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Thumbnail Image */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Course Thumbnail <span style={{ color: 'var(--text-muted)' }}>(optional)</span>
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if(e.target.files[0]) {
                          setThumbnailFile(e.target.files[0]);
                          setThumbnail(''); // Clear URL if file selected
                        }
                      }}
                      className="w-full px-3 py-2 border rounded-md text-sm cursor-pointer"
                      style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                    />
                    <div className="flex items-center text-sm" style={{ color: 'var(--text-muted)' }}>
                      <span className="px-2">OR provide a URL:</span>
                    </div>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" style={{ color: 'var(--text-muted)' }}>
                        <Image className="h-5 w-5" />
                      </span>
                      <input
                        type="url"
                        value={thumbnail}
                        onChange={(e) => {
                          setThumbnail(e.target.value);
                          setThumbnailFile(null); // Clear file if URL typed
                        }}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                        style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                        placeholder="https://example.com/thumbnail.jpg"
                        disabled={!!thumbnailFile}
                      />
                    </div>
                    {thumbnailFile && (
                      <p className="text-xs mt-1" style={{ color: 'var(--accent)' }}>
                        Selected file: {thumbnailFile.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Videos Array */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                      Course Videos
                    </label>
                    <button
                      type="button"
                      onClick={handleAddVideo}
                      className="text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer transition-all hover:bg-[var(--accent-glow)]"
                      style={{ color: 'var(--accent)', border: '1px solid var(--accent)' }}
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Video</span>
                    </button>
                  </div>
                  
                  {videos.map((vid, index) => (
                    <div key={index} className="p-4 rounded-xl relative group animate-slide-up" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                      {videos.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveVideo(index)}
                          className="absolute top-2 right-2 p-1 rounded-md text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Video Title</label>
                          <input
                            type="text"
                            required
                            value={vid.title}
                            onChange={(e) => handleVideoChange(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all"
                            style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                            placeholder={`Lesson ${index + 1}`}
                          />
                        </div>
                        <div>
                          <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Duration (optional)</label>
                          <input
                            type="text"
                            value={vid.duration}
                            onChange={(e) => handleVideoChange(index, 'duration', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all"
                            style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                            placeholder="10:30"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                            {courseType === 'free' ? 'YouTube URL' : 'Upload Video File'}
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" style={{ color: 'var(--text-muted)' }}>
                              {courseType === 'free' ? <Tv className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                            </span>
                            {courseType === 'free' ? (
                              <input
                                type="url"
                                required
                                value={vid.videoUrl}
                                onChange={(e) => handleVideoChange(index, 'videoUrl', e.target.value)}
                                className="w-full pl-9 pr-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all"
                                style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                                placeholder="https://www.youtube.com/watch?v=..."
                              />
                            ) : (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="file"
                                  accept="video/*"
                                  required={!vid.videoUrl}
                                  onChange={(e) => handleVideoChange(index, 'videoFile', e.target.files[0])}
                                  className="w-full pl-9 pr-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all cursor-pointer"
                                  style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                                />
                                {vid.videoUrl && !vid.videoFile && (
                                  <span className="text-xs shrink-0 px-2 py-1 rounded-md font-medium" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success)' }}>
                                    âœ“ Video Saved
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

                {/* Submit */}
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white py-2.5 px-4 rounded-xl font-medium text-sm transition-all focus:outline-none shadow-lg flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-55 btn-press"
                >
                  {formLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>{editingCourse ? 'Update Course' : 'Create Course'}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
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
          <div className="animate-fade-in space-y-12">
            {/* Grid View with Search */}
            <div className="space-y-10">
                {/* ─── Formal Executive Analytics Hero ─── */}
                {!overviewLoading && overviewData.length > 0 && (
                  <div className="flex justify-center mb-12 animate-slide-up w-full">
                    <div className="relative overflow-hidden rounded-[1.5rem] bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm hover:shadow-xl transition-all duration-700 w-full max-w-5xl group transform hover:-translate-y-1">
                      <div className="relative h-full p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10 z-10 overflow-hidden">
                        
                        {/* Immersive Formal Ambient Gradient */}
                        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--accent)] opacity-5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 group-hover:scale-105 transition-transform duration-1000"></div>
                        
                        <div className="flex flex-col md:flex-row items-center gap-8 relative z-20">
                          {/* Formal Icon Container */}
                          <div className="relative p-5 rounded-2xl bg-[var(--accent)] shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-500 ease-out">
                            <BarChart3 className="w-9 h-9 text-white relative z-10" />
                          </div>
                          
                          {/* Formal Typography Context */}
                          <div className="text-center md:text-left">
                            <h3 className="text-[var(--text-secondary)] font-bold uppercase tracking-[0.2em] text-xs mb-2 group-hover:text-[var(--accent)] transition-colors duration-500">Total Active Enrollments</h3>
                            <div className="flex items-center justify-center md:justify-start gap-2.5 mt-1">
                              <div className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                              </div>
                              <p className="text-[var(--text-muted)] font-medium text-xs tracking-wide">Real-time platform activity</p>
                            </div>
                          </div>
                        </div>

                        {/* Grand Value Display */}
                        <div className="relative z-20 flex items-baseline gap-3">
                          <span className="text-6xl md:text-7xl font-semibold tracking-tight text-[var(--text-primary)] drop-shadow-sm group-hover:scale-105 transition-transform duration-700">
                            {overviewData.reduce((acc, course) => acc + course.activeCount, 0)}
                          </span>
                          <span className="text-[var(--text-secondary)] font-medium text-base uppercase tracking-wider">Students</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-[1.5rem] bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow duration-500">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--accent)]"></div>
                  <div className="pl-4">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Course Performance Matrix</h2>
                    <p className="text-[var(--text-secondary)] font-medium mt-1.5 text-sm">Comprehensive breakdown of engagement metrics across all active curriculum modules.</p>
                  </div>
                  <div className="relative w-full md:w-[450px] group-focus-within:scale-[1.01] transition-transform duration-500">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      placeholder="Search courses..."
                      value={overviewSearchQuery}
                      onChange={(e) => setOverviewSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 rounded-lg text-sm font-medium transition-all shadow-inner focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                    />
                  </div>
                </div>

                {overviewLoading ? (
                  <div className="flex items-center justify-center py-32">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-[var(--border-color)] border-t-[var(--accent)] rounded-full animate-spin"></div>
                    </div>
                  </div>
                ) : overviewData.length === 0 ? (
                  <div className="text-center py-24 bg-[var(--bg-card)] rounded-[1.5rem] border border-[var(--border-color)] shadow-sm">
                    <ClipboardList className="h-16 w-16 mx-auto mb-6 opacity-30 text-[var(--text-muted)]" />
                    <p className="text-lg font-semibold text-[var(--text-primary)]">No analytical data available.</p>
                    <p className="text-[var(--text-secondary)] mt-2">Activity metrics will appear once courses are populated and active.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {overviewData
                      .filter(c => c.title.toLowerCase().includes(overviewSearchQuery.toLowerCase()))
                      .map((course, idx) => (
                      <div key={course._id} className="rounded-[1rem] overflow-hidden shadow-sm hover:shadow-xl border border-[var(--border-color)] transition-all duration-500 hover:-translate-y-1.5 bg-[var(--bg-card)] flex flex-col group relative animate-slide-up" style={{ animationDelay: `${idx * 0.1}s`, animationFillMode: 'both' }}>
                        
                        {course.thumbnail ? (
                          <div className="h-48 relative overflow-hidden flex-shrink-0 border-b border-[var(--border-color)] bg-[var(--bg-input)]">
                            <img src={course.thumbnail?.startsWith('/uploads') ? `${API_URL.replace('/api', '')}${course.thumbnail}` : course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter group-hover:brightness-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100"></div>
                            
                            <div className="absolute bottom-4 left-4 flex space-x-2">
                              {course.totalVideos > 0 && (
                                <span className="bg-black/40 backdrop-blur-md text-white border border-white/20 px-3 py-1.5 rounded-md text-xs font-medium tracking-wide flex items-center space-x-2">
                                  <Video className="h-3.5 w-3.5" />
                                  <span>{course.totalVideos} Modules</span>
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="h-48 relative overflow-hidden flex-shrink-0 bg-[var(--bg-input)] border-b border-[var(--border-color)] flex items-center justify-center transition-colors duration-500 group-hover:bg-[var(--accent-glow)]">
                             <BookOpen className="w-10 h-10 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors duration-500" />
                             {course.totalVideos > 0 && (
                              <div className="absolute bottom-4 left-4 flex space-x-2 z-10">
                                <span className="bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-color)] px-3 py-1.5 rounded-md text-xs font-medium tracking-wide flex items-center space-x-2 shadow-sm">
                                  <Video className="h-3.5 w-3.5" />
                                  <span>{course.totalVideos} Modules</span>
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="p-6 flex-1 flex flex-col justify-between relative bg-[var(--bg-card)]">
                          <div className="mb-6">
                            <div className="flex items-center space-x-2 mb-3">
                              <span className="bg-[var(--accent-glow)] text-[var(--accent)] px-2.5 py-1 rounded-sm text-[10px] font-bold tracking-widest uppercase border border-[var(--accent)]/10">
                                {course.category || 'General'}
                              </span>
                            </div>
                            <h3 className="font-semibold text-lg line-clamp-2 leading-snug text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-300">{course.title}</h3>
                          </div>

                          {/* Formal Stats Row */}
                          <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="flex flex-col p-4 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] transition-colors duration-300 hover:border-blue-300">
                              <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-1.5 flex items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></div>
                                Active
                              </span>
                              <span className="text-2xl font-light text-[var(--text-primary)]">{course.activeCount}</span>
                            </div>
                            <div className="flex flex-col p-4 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] transition-colors duration-300 hover:border-rose-300">
                              <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-1.5 flex items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2"></div>
                                Inactive
                              </span>
                              <span className="text-2xl font-light text-[var(--text-primary)]">{course.inactiveCount}</span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => navigate('/admin/course/' + course._id + '/analytics', { state: { course } })}
                            className="w-full flex items-center justify-between px-6 py-3.5 rounded-lg text-sm font-medium transition-all duration-300 bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-input)] hover:text-[var(--accent)] hover:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/20 group/btn"
                          >
                            <span>View Detailed Report</span>
                            <ArrowLeft className="h-4 w-4 rotate-180 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {overviewData.filter(c => c.title.toLowerCase().includes(overviewSearchQuery.toLowerCase())).length === 0 && (
                      <div className="col-span-full text-center py-16 bg-[var(--bg-card)] rounded-[1.5rem] border border-[var(--border-color)]">
                        <p className="text-base font-medium text-[var(--text-muted)]">No courses match your search criteria.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
          </div>
        )}

        {/* â”€â”€â”€ Certificate Settings Tab â”€â”€â”€ */}
        {activeTab === 'settings' && (
          <div className="space-y-8 animate-fade-in max-w-5xl mx-auto py-4">
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Certificate Configuration</h2>
              <p className="text-sm mt-2 font-medium" style={{ color: 'var(--text-secondary)' }}>Design your formal certificate templates using AI or upload custom graphics.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Graphic Template Card */}
              <div className="rounded-[1.5rem] border shadow-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                <div className="p-6 md:p-8 border-b" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                  <h3 className="text-xl font-bold flex items-center space-x-3" style={{ color: 'var(--text-primary)' }}>
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--bg-primary)' }}>
                      <Image className="h-5 w-5 text-blue-500" />
                    </div>
                    <span>Graphic Template</span>
                  </h3>
                  <p className="text-sm mt-2 font-medium" style={{ color: 'var(--text-secondary)' }}>Upload a high-quality JPG/PNG. The system overlays student data automatically.</p>
                </div>
                
                <div className="p-6 md:p-8 flex-1 flex flex-col space-y-6">
                  {certificateTemplate && !templateFile && certificateTemplate.startsWith('/') && (
                    <div className="rounded-xl overflow-hidden border shadow-sm" style={{ borderColor: 'var(--border-color)' }}>
                      <img src={`https://e-learning-backend-tubf.onrender.com${certificateTemplate}`} alt="Current" className="w-full h-40 object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                  )}
                  
                  <div className="relative group flex-1">
                    <div className="absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-1000 group-hover:duration-200" style={{ backgroundImage: 'linear-gradient(to right, #3b82f6, #8b5cf6)' }}></div>
                    <div className="relative h-full border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center transition-colors duration-300 group-hover:bg-opacity-50" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-input)' }}>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={(e) => setTemplateFile(e.target.files[0])}
                        className="hidden"
                        id="template-upload"
                      />
                      <label htmlFor="template-upload" className="cursor-pointer flex flex-col items-center w-full">
                        <div className="h-14 w-14 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-inner" style={{ backgroundColor: 'var(--bg-card)' }}>
                          <Image className="h-6 w-6 text-blue-500" />
                        </div>
                        <span className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>Click to upload template</span>
                        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>PNG, JPG up to 5MB</span>
                        {templateFile && (
                          <span className="mt-6 px-4 py-1.5 rounded-full text-xs font-bold border shadow-sm animate-fade-in-up" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
                            {templateFile.name}
                          </span>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Prompt Card */}
              <div className="rounded-[1.5rem] border shadow-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                <div className="p-6 md:p-8 border-b" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                  <h3 className="text-xl font-bold flex items-center space-x-3" style={{ color: 'var(--text-primary)' }}>
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--bg-primary)' }}>
                      <Settings className="h-5 w-5 text-purple-500" />
                    </div>
                    <span>AI Prompt Generator</span>
                  </h3>
                  <p className="text-sm mt-2 font-medium" style={{ color: 'var(--text-secondary)' }}>Write instructions for the AI to generate an HTML certificate.</p>
                </div>
                
                <div className="p-6 md:p-8 flex-1 flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>{`{{name}}`} for Student</span>
                    <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>{`{{category}}`} for Course</span>
                  </div>
                  
                  <textarea
                    value={certificateTemplate}
                    onChange={(e) => setCertificateTemplate(e.target.value)}
                    className="w-full flex-1 px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all custom-scrollbar shadow-inner text-sm font-medium leading-relaxed"
                    style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', minHeight: '180px' }}
                    placeholder="E.g., Create an elegant HTML certificate with a gold border..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Save Action */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="relative inline-flex items-center justify-center space-x-3 px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg focus:outline-none group overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white disabled:opacity-50 hover:shadow-xl hover:-translate-y-0.5"
              >
                <div className="absolute inset-0 w-0 bg-white/20 transition-all duration-500 ease-out group-hover:w-full z-0"></div>
                {savingSettings ? <Loader2 className="h-5 w-5 animate-spin relative z-10" /> : <Save className="h-5 w-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />}
                <span className="relative z-10">Deploy Configuration</span>
              </button>
            </div>
          </div>
        )}

        {/* â”€â”€â”€ Certificate Requests Tab â”€â”€â”€ */}
        {activeTab === 'requests' && (
          <div className="rounded-xl p-6 md:p-8 animate-slide-up" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <h2 className="text-xl font-bold mb-6 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
              <Award className="h-5 w-5" style={{ color: 'var(--accent)' }} />
              <span>Pending Certificate Requests</span>
            </h2>
            
            {requestsLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" /></div>
            ) : certificateRequests.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-30 text-green-500" />
                <p style={{ color: 'var(--text-muted)' }}>No pending certificate requests. You're all caught up!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                      <th className="pb-3 font-semibold text-sm">Student</th>
                      <th className="pb-3 font-semibold text-sm">Course</th>
                      <th className="pb-3 font-semibold text-sm text-center">Score</th>
                      <th className="pb-3 font-semibold text-sm text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificateRequests.map(req => (
                      <tr key={req._id} className="border-b last:border-0 hover:bg-[var(--bg-input)] transition-colors" style={{ borderColor: 'var(--border-color)' }}>
                        <td className="py-4 pr-4">
                          <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{req.student?.name}</div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{req.student?.email}</div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="font-medium text-sm line-clamp-1" style={{ color: 'var(--text-primary)' }}>{req.course?.title}</div>
                          <div className="text-xs" style={{ color: 'var(--accent)' }}>{req.course?.category}</div>
                        </td>
                        <td className="py-4 px-2 text-center">
                          <span className="inline-flex items-center justify-center h-8 px-3 rounded-full font-bold text-xs shadow-sm" style={{ 
                            backgroundColor: req.score >= 80 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                            color: req.score >= 80 ? '#22c55e' : '#eab308',
                            border: `1px solid ${req.score >= 80 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)'}`
                          }}>
                            {req.score}%
                          </span>
                        </td>
                        <td className="py-4 pl-2 text-right">
                          <button
                            onClick={() => handleApproveRequest(req._id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95"
                          >
                            Approve & Generate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'doubts' && (
          <div className="rounded-xl p-6 md:p-8 animate-slide-up" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <h2 className="text-xl font-bold mb-6 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
              <MessageSquare className="h-5 w-5" style={{ color: 'var(--accent)' }} />
              <span>Pending Doubt Requests</span>
            </h2>
            
            {doubtsLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--accent)' }} /></div>
            ) : pendingDoubts.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-30 text-green-500" />
                <p style={{ color: 'var(--text-muted)' }}>No pending doubts. Great job!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {pendingDoubts.map(doubt => (
                  <div key={doubt._id} className="p-5 rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-[var(--bg-card)]" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-sm font-bold text-white shadow-sm" style={{ backgroundColor: 'var(--accent)' }}>
                          {doubt.student?.profileImage ? <img src={doubt.student.profileImage} className="w-full h-full object-cover" /> : doubt.student?.name?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{doubt.student?.name}</div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{doubt.course?.title}</div>
                        </div>
                      </div>
                      <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase">Pending</span>
                    </div>
                    
                    <div className="mb-4 p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)' }}>
                      <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{doubt.questionText}</p>
                      {doubt.questionMedia && (
                        <div className="mt-3">
                          {doubt.questionMedia.match(/\.(mp4|webm|ogg)$/i) ? (
                            <video src={`https://e-learning-backend-tubf.onrender.com${doubt.questionMedia}`} controls className="max-w-xs w-full rounded-lg border" style={{ borderColor: 'var(--border-color)' }} />
                          ) : (
                            <img src={`https://e-learning-backend-tubf.onrender.com${doubt.questionMedia}`} alt="Doubt media" className="max-w-xs w-full rounded-lg object-contain border" style={{ borderColor: 'var(--border-color)' }} />
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
                      <h4 className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Your Reply</h4>
                      <textarea
                        className="w-full p-3 rounded-lg text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-[var(--accent)] resize-none"
                        style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                        rows="3"
                        placeholder="Type your solution here..."
                        value={replyTexts[doubt._id] || ''}
                        onChange={(e) => setReplyTexts({ ...replyTexts, [doubt._id]: e.target.value })}
                      ></textarea>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={(e) => setReplyFiles({ ...replyFiles, [doubt._id]: e.target.files[0] })}
                          className="text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20 cursor-pointer"
                        />
                        <button
                          onClick={() => handleReplyDoubt(doubt._id)}
                          disabled={submittingReply === doubt._id || !(replyTexts[doubt._id] || '').trim()}
                          className="px-5 py-2 rounded-lg text-xs font-bold text-white transition-all shadow-md hover:shadow-lg disabled:opacity-50 btn-press flex items-center space-x-2"
                          style={{ backgroundImage: 'linear-gradient(to right, var(--accent), var(--accent-hover))' }}
                        >
                          {submittingReply === doubt._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                          <span>Submit Solution</span>
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
          <>
            {/* â”€â”€â”€ Today's Live Classes â”€â”€â”€ */}
            {!loading && upcomingLiveClasses.length > 0 && (
              <div className="mb-8 animate-slide-up">
                <h2 className="text-xl font-bold mb-4 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                  <Clock className="h-5 w-5" style={{ color: '#ef4444' }} />
                  <span>Upcoming Live Classes</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingLiveClasses.map(lc => {
                    const isLive = lc.status === 'live';
                    return (
                      <div key={lc._id} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-red-100 dark:border-red-900/30 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-gray-800 dark:text-gray-100 line-clamp-1">{lc.title}</h3>
                          {isLive && <span className="flex h-3 w-3 shrink-0"><span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>}
                        </div>
                        <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">{new Date(lc.date).toLocaleString()}</p>
                        <p className="text-xs text-gray-500 line-clamp-1 mb-4">Course: {lc.courseTitle}</p>
                        <button
                          onClick={() => navigate(`/live/${lc.courseId}/${lc.chapterId}/${lc._id}`)}
                          className={`w-full py-2 rounded-lg text-xs font-bold text-white transition-all ${isLive ? 'bg-red-500 hover:bg-red-600 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse' : 'bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
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
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin" style={{ color: 'var(--accent)' }} />
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
                className="relative flex flex-col p-4 rounded-[24px] transition-all duration-500 hover:-translate-y-2 group"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                }}
              >
                {/* Thumbnail Image Container */}
                <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail?.startsWith('/uploads') ? `${API_URL.replace('/api', '')}${course.thumbnail}` : course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div
                      className="w-full h-full relative"
                      style={{
                        background: course.courseType === 'free'
                            ? 'linear-gradient(135deg, #10b981 0%, #047857 100%)'
                            : 'linear-gradient(135deg, #0a192f 0%, #1e293b 100%)',
                      }}
                    >
                       <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9yZWN0Pgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+Cjwvc3ZnPg==')" }}></div>
                    </div>
                  )}
                  
                  {/* Overlay Gradient for readability of badges */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none"></div>

                  {/* Flipkart Style Rating Pill (Top Left) */}
                  <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1 shadow-lg backdrop-blur-sm z-10">
                    {course.rating && course.rating > 0 ? (
                      <>{course.rating.toFixed(1)} <Star className="h-3 w-3 fill-white text-white" /></>
                    ) : (
                      "No rating"
                    )}
                  </div>

                  {/* Top Right Admin Actions (Floating over image) */}
                  <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                    <button
                      onClick={() => {
                        handleOpenEdit(course);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="p-2 bg-white/90 hover:bg-white text-gray-800 rounded-lg shadow-lg backdrop-blur-sm transition-all hover:scale-110 cursor-pointer"
                      title="Edit Course"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="p-2 bg-white/90 hover:bg-white text-red-600 rounded-lg shadow-lg backdrop-blur-sm transition-all hover:scale-110 cursor-pointer"
                      title="Delete Course"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="flex flex-col flex-grow pt-4">
                  
                  {/* Title */}
                  <h3
                    className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-[var(--accent)] transition-colors duration-300"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {course.title}
                  </h3>
                  
                  {/* Subtitle / Description */}
                  <p
                    className="text-sm line-clamp-1 mb-5"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {course.category || course.description || 'Course Syllabus & Details'}
                  </p>

                  <div className="mt-auto">
                    {/* Metrics Row (Students Clickable & Duration) */}
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => {
                          setSelectedCourseForStudents(course);
                          setShowStudentsModal(true);
                          fetchCourseStudents(course._id);
                        }}
                        className="flex items-center gap-1.5 text-xs font-bold hover:text-[var(--accent)] transition-colors cursor-pointer group/students"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        <div className="p-1.5 rounded-full bg-[var(--accent)]/10 group-hover/students:bg-[var(--accent)]/20 transition-colors">
                          <Users className="h-3.5 w-3.5" style={{ color: 'var(--accent)' }} />
                        </div>
                        <span className="border-b border-transparent group-hover/students:border-[var(--accent)]">
                          {course.students?.length || 0} Students
                        </span>
                      </button>
                      {course.duration && (
                        <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
                          <Clock className="h-4 w-4" style={{ color: 'var(--accent)' }} />
                          <span>{course.duration}</span>
                        </div>
                      )}
                    </div>

                    {/* Price Section - Dynamic, no fake discounts */}
                    <div className="flex items-center gap-2 mb-5">
                      {course.courseType === 'free' ? (
                        <span className="text-2xl font-black text-green-500">Free</span>
                      ) : (
                        <span className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
                          ₹{course.price}
                        </span>
                      )}
                    </div>

                    {/* Action Button - Restored Green Color & Animated */}
                    <button
                      onClick={() => navigate('/admin/course/' + course._id)}
                      className="w-full py-3.5 rounded-xl font-bold text-white transition-all duration-300 cursor-pointer text-center shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-1 flex items-center justify-center gap-2 group/btn"
                      style={{ background: 'var(--accent)' }}
                    >
                      Manage Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
          </>
        )}

        {/* â”€â”€â”€ Certificate Settings Tab â”€â”€â”€ */}
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

      {/* â”€â”€â”€ Students Progress Modal â”€â”€â”€ */}
      {showStudentsModal && selectedCourseForStudents && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="rounded-2xl w-full max-w-3xl p-6 border shadow-2xl relative animate-scale-in flex flex-col max-h-[85vh]" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <button
              onClick={() => {
                setShowStudentsModal(false);
                setSelectedCourseForStudents(null);
                setStudentsList([]);
              }}
              className="absolute top-4 right-4 p-1 rounded-md transition-colors hover:bg-[var(--bg-input)]"
              style={{ color: 'var(--text-muted)' }}
            >
              <X className="h-5 w-5" />
            </button>
            
            <h2 className="text-xl font-bold mb-1 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
              <Users className="h-5 w-5" style={{ color: '#3b82f6' }} />
              <span>Students Enrolled in {selectedCourseForStudents.title}</span>
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              Total Enrolled: <span className="font-bold text-[var(--accent)]">{studentsList.length}</span>
            </p>

            <div className="overflow-y-auto pr-2 space-y-4 flex-1">
              {studentsLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--accent)' }} />
                </div>
              ) : studentsList.length === 0 ? (
                <div className="text-center py-10" style={{ color: 'var(--text-muted)' }}>
                  <Users className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>No students enrolled yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {studentsList.map((student, index) => (
                    <div key={student._id} className="p-4 rounded-xl flex items-center justify-between transition-all hover:bg-[var(--bg-card)]" style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex items-center justify-center w-6 text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
                          #{index + 1}
                        </div>
                        <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-white shrink-0 shadow-md" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{student.name}</h4>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{student.email}</p>
                        </div>
                      </div>
                      <div className="flex-1 max-w-[200px] ml-4">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span style={{ color: 'var(--text-secondary)' }}>Progress</span>
                          <span className="font-bold" style={{ color: student.progressPercentage === 100 ? '#22c55e' : 'var(--accent)' }}>{student.progressPercentage}%</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-color)' }}>
                          <div 
                            className="h-full transition-all duration-1000 ease-out"
                            style={{ 
                              width: `${student.progressPercentage}%`, 
                              backgroundColor: student.progressPercentage === 100 ? '#22c55e' : 'var(--accent)',
                              boxShadow: student.progressPercentage === 100 ? '0 0 8px rgba(34,197,94,0.5)' : 'none'
                            }}
                          ></div>
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

      </main>
    </div>
  );
};

export default AdminDashboard;

