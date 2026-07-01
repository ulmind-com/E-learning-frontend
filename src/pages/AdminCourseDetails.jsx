import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft, Plus, Video, FileText, Brain, Save, Trash2, Edit3, ChevronDown, ChevronUp, Loader2, AlertCircle, CheckCircle, Upload, Clock, X, BookOpen, PlayCircle, FileSearch, HelpCircle
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://e-learning-backend-8avx.onrender.com/api';

const AdminCourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [chapters, setChapters] = useState([]);
  const [expandedChapters, setExpandedChapters] = useState({});
  const [activeTabs, setActiveTabs] = useState({}); // Stores the active tab for each chapter { cIdx: 'videos' }
  const [deleteConfig, setDeleteConfig] = useState({ show: false, chapterIdx: null, type: null, itemIdx: null, title: '' });

  // Modals state
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activeChapterIndex, setActiveChapterIndex] = useState(null);
  const [newVideo, setNewVideo] = useState({ title: '', duration: '', videoUrl: '', file: null });
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', fileUrl: '', file: null });

  const [showMockTestModal, setShowMockTestModal] = useState(false);
  const [mockTestParams, setMockTestParams] = useState({ topic: '', numQuestions: 10, timeLimit: 15 });
  const [generatingMockTest, setGeneratingMockTest] = useState(false);
  const [generatedMockTest, setGeneratedMockTest] = useState(null);

  const [showLiveClassModal, setShowLiveClassModal] = useState(false);
  const [newLiveClass, setNewLiveClass] = useState({ title: '', date: '', time: '' });

  useEffect(() => {
    fetchCourse();
  }, [id, token]);

  const fetchCourse = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourse(data);
      setChapters(data.chapters || []);
      
      // Auto-expand first chapter if it exists
      if(data.chapters && data.chapters.length > 0) {
        setExpandedChapters({ 0: true });
        setActiveTabs({ 0: 'videos' });
      }
    } catch (err) {
      setError('Failed to fetch course details.');
    } finally {
      setLoading(false);
    }
  };

  const saveCourse = async (updatedChapters) => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await axios.put(`${API_URL}/courses/${id}`, { chapters: updatedChapters }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Curriculum updated successfully.');
      setChapters(updatedChapters);
      
      // Auto-hide success after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const toggleChapter = (index) => {
    setExpandedChapters(prev => {
      const isExpanding = !prev[index];
      if (isExpanding && !activeTabs[index]) {
        setActiveTabs(t => ({ ...t, [index]: 'videos' }));
      }
      return { ...prev, [index]: isExpanding };
    });
  };

  const setChapterTab = (cIdx, tab) => {
    setActiveTabs(prev => ({ ...prev, [cIdx]: tab }));
  };

  const handleAddChapter = () => {
    if (!newChapterTitle.trim()) return;
    const updated = [...chapters, { title: newChapterTitle, videos: [], notes: [], mockTests: [], liveClasses: [] }];
    setChapters(updated);
    setShowChapterModal(false);
    setNewChapterTitle('');
    saveCourse(updated);
  };

  const handleDeleteChapter = (idx) => {
    setDeleteConfig({ show: true, chapterIdx: idx, type: 'chapter', itemIdx: null, title: 'this chapter' });
  };

  // Video
  const handleAddVideo = async () => {
    if (!newVideo.title) return setError('Title is required');
    let finalUrl = newVideo.videoUrl;

    if (newVideo.file) {
      setUploadingMedia(true);
      const formData = new FormData();
      formData.append('video', newVideo.file);
      try {
        const uploadRes = await axios.post(`${API_URL}/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
        });
        finalUrl = uploadRes.data.videoUrl;
      } catch (err) {
        setUploadingMedia(false);
        return setError('Failed to upload video');
      }
      setUploadingMedia(false);
    }

    if (!finalUrl) return setError('Video URL or File is required');

    const updated = [...chapters];
    updated[activeChapterIndex].videos.push({ title: newVideo.title, duration: newVideo.duration, videoUrl: finalUrl });
    setChapters(updated);
    setShowVideoModal(false);
    setNewVideo({ title: '', duration: '', videoUrl: '', file: null });
    saveCourse(updated);
  };

  // Note
  const handleAddNote = async () => {
    if (!newNote.title) return setError('Title is required');
    let finalUrl = newNote.fileUrl;

    if (newNote.file) {
      setUploadingMedia(true);
      const formData = new FormData();
      formData.append('document', newNote.file);
      try {
        const uploadRes = await axios.post(`${API_URL}/upload/document`, formData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
        });
        finalUrl = uploadRes.data.documentUrl;
      } catch (err) {
        setUploadingMedia(false);
        return setError('Failed to upload document');
      }
      setUploadingMedia(false);
    }

    if (!finalUrl) return setError('Document URL or File is required');

    const updated = [...chapters];
    updated[activeChapterIndex].notes.push({ title: newNote.title, fileUrl: finalUrl });
    setChapters(updated);
    setShowNoteModal(false);
    setNewNote({ title: '', fileUrl: '', file: null });
    saveCourse(updated);
  };

  // Mock Test
  const handleGenerateMockTest = async () => {
    if (!mockTestParams.topic.trim()) return setError('Topic is required.');
    setGeneratingMockTest(true);
    setError('');
    try {
      const { data } = await axios.post(`${API_URL}/courses/admin/generate-mock-test`, 
        { topic: mockTestParams.topic, numQuestions: mockTestParams.numQuestions },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGeneratedMockTest(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate mock test.');
    } finally {
      setGeneratingMockTest(false);
    }
  };

  const handleSaveMockTest = () => {
    if (!generatedMockTest) return;
    const updated = [...chapters];
    updated[activeChapterIndex].mockTests.push({
      title: generatedMockTest.title,
      timeLimit: mockTestParams.timeLimit,
      questions: generatedMockTest.questions
    });
    setChapters(updated);
    setShowMockTestModal(false);
    setGeneratedMockTest(null);
    setMockTestParams({ topic: '', numQuestions: 10, timeLimit: 15 });
    saveCourse(updated);
  };

  // Live Class
  const handleAddLiveClass = () => {
    if (!newLiveClass.title || !newLiveClass.date || !newLiveClass.time) {
      return setError('Title, Date and Time are required.');
    }
    const combinedDate = new Date(`${newLiveClass.date}T${newLiveClass.time}`);
    const updated = [...chapters];
    if (!updated[activeChapterIndex].liveClasses) updated[activeChapterIndex].liveClasses = [];
    updated[activeChapterIndex].liveClasses.push({
      title: newLiveClass.title,
      date: combinedDate.toISOString(),
      status: 'scheduled'
    });
    setChapters(updated);
    setShowLiveClassModal(false);
    setNewLiveClass({ title: '', date: '', time: '' });
    saveCourse(updated);
  };

  const handleDeleteItem = (chapterIdx, type, itemIdx) => {
    setDeleteConfig({ show: true, chapterIdx, type, itemIdx, title: `this ${type.slice(0,-1)}` });
  };

  const confirmDelete = () => {
    const { chapterIdx, type, itemIdx } = deleteConfig;
    if (type === 'chapter') {
      const updated = chapters.filter((_, i) => i !== chapterIdx);
      setChapters(updated);
      saveCourse(updated);
    } else {
      const updated = [...chapters];
      updated[chapterIdx][type] = updated[chapterIdx][type].filter((_, i) => i !== itemIdx);
      setChapters(updated);
      saveCourse(updated);
    }
    setDeleteConfig({ show: false, chapterIdx: null, type: null, itemIdx: null, title: '' });
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-[#050505]">
        <div className="grid grid-cols-3 gap-1.5 mb-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-3 h-3 bg-[#E87C41] rounded-sm" style={{ animation: `pulse 1.5s infinite cubic-bezier(0.4, 0, 0.6, 1)`, animationDelay: `${i * 0.15}s` }}></div>
          ))}
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E87C41] animate-pulse">Loading Details...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-[#050505] min-h-screen text-white">
      <div className="w-full px-6 md:px-12 py-10 animate-fade-in">
        {/* Header Section */}
        <div className="mb-10">
          <button
            onClick={() => navigate('/admin')}
            className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Executive Dashboard</span>
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-2">
                {course?.title || 'Course Details'}
              </h1>
              <p className="font-medium text-sm text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E87C41]"></span> 
                Curriculum Management
              </p>
            </div>
            
            <button 
              onClick={() => setShowChapterModal(true)}
              className="flex items-center justify-center space-x-2 px-8 py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all bg-[#E87C41] text-white hover:bg-[#d66b35] shadow-[0_0_20px_rgba(232,124,65,0.3)] hover:shadow-[0_0_30px_rgba(232,124,65,0.5)]"
            >
              <Plus className="h-4 w-4" />
              <span>Create Chapter</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        {error && (
          <div className="p-4 rounded-xl mb-8 flex items-center bg-red-500/10 border border-red-500/20 text-red-500 w-full">
            <AlertCircle className="h-5 w-5 mr-3 shrink-0" />
            <span className="font-bold text-sm tracking-wide">{error}</span>
          </div>
        )}
        {success && (
          <div className="p-4 rounded-xl mb-8 flex items-center bg-[#E87C41]/10 border border-[#E87C41]/20 text-[#E87C41] w-full">
            <CheckCircle className="h-5 w-5 mr-3 shrink-0" />
            <span className="font-bold text-sm tracking-wide">{success}</span>
          </div>
        )}

        {/* Chapters Accordion */}
        <div className="space-y-6 w-full">
          {chapters.map((chapter, cIdx) => {
            const currentTab = activeTabs[cIdx] || 'videos';
            
            return (
              <div key={cIdx} className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/20 w-full">
                {/* Chapter Header */}
                <div 
                  className={`p-6 flex items-center justify-between cursor-pointer transition-colors ${expandedChapters[cIdx] ? 'bg-[#111]' : 'hover:bg-[#111]'}`}
                  onClick={() => toggleChapter(cIdx)}
                >
                  <div className="flex items-center space-x-5">
                    <div className="h-12 w-12 rounded-xl bg-[#050505] border border-white/10 flex items-center justify-center font-black text-xl text-[#E87C41] shadow-inner">
                      {String(cIdx + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white tracking-tight">{chapter.title}</h2>
                      <div className="flex gap-4 mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                        <span>{chapter.videos?.length || 0} Videos</span>
                        <span>{chapter.notes?.length || 0} Docs</span>
                        <span>{chapter.mockTests?.length || 0} Tests</span>
                        <span>{chapter.liveClasses?.length || 0} Live</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteChapter(cIdx); }} 
                      className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors border border-transparent hover:border-red-500/20"
                      title="Delete Chapter"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="p-3 rounded-xl bg-[#050505] text-[#E87C41] border border-white/5">
                      {expandedChapters[cIdx] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                </div>

                {/* Chapter Content Area - TABBED VIEW */}
                {expandedChapters[cIdx] && (
                  <div className="border-t border-white/10 bg-[#050505]">
                    
                    {/* Tabs Navigation */}
                    <div className="flex overflow-x-auto custom-scrollbar border-b border-white/5 px-6">
                      <button 
                        onClick={() => setChapterTab(cIdx, 'videos')} 
                        className={`flex items-center space-x-2 px-6 py-5 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 whitespace-nowrap ${currentTab === 'videos' ? 'border-[#E87C41] text-[#E87C41]' : 'border-transparent text-gray-600 hover:text-white'}`}
                      >
                        <PlayCircle className="h-4 w-4" />
                        <span>Videos</span>
                      </button>
                      <button 
                        onClick={() => setChapterTab(cIdx, 'notes')} 
                        className={`flex items-center space-x-2 px-6 py-5 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 whitespace-nowrap ${currentTab === 'notes' ? 'border-[#E87C41] text-[#E87C41]' : 'border-transparent text-gray-600 hover:text-white'}`}
                      >
                        <FileSearch className="h-4 w-4" />
                        <span>Documents</span>
                      </button>
                      <button 
                        onClick={() => setChapterTab(cIdx, 'mockTests')} 
                        className={`flex items-center space-x-2 px-6 py-5 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 whitespace-nowrap ${currentTab === 'mockTests' ? 'border-[#E87C41] text-[#E87C41]' : 'border-transparent text-gray-600 hover:text-white'}`}
                      >
                        <Brain className="h-4 w-4" />
                        <span>Mock Tests</span>
                      </button>
                      <button 
                        onClick={() => setChapterTab(cIdx, 'liveClasses')} 
                        className={`flex items-center space-x-2 px-6 py-5 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 whitespace-nowrap ${currentTab === 'liveClasses' ? 'border-[#E87C41] text-[#E87C41]' : 'border-transparent text-gray-600 hover:text-white'}`}
                      >
                        <Clock className="h-4 w-4" />
                        <span>Live Classes</span>
                      </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-8">
                      {/* VIDEOS TAB */}
                      {currentTab === 'videos' && (
                        <div className="animate-fade-in">
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Video Lessons</h3>
                            <button 
                              onClick={() => { setActiveChapterIndex(cIdx); setShowVideoModal(true); }} 
                              className="flex items-center space-x-2 px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-[#E87C41]/30 bg-[#E87C41]/10 text-[#E87C41] hover:bg-[#E87C41] hover:text-white"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Add Video</span>
                            </button>
                          </div>
                          
                          {(!chapter.videos || chapter.videos.length === 0) ? (
                            <div className="py-12 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-white/10 bg-[#0a0a0a]">
                              <PlayCircle className="h-8 w-8 text-gray-700 mb-3" />
                              <p className="font-black text-xs text-white mb-1 uppercase tracking-widest">No Videos Added</p>
                              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Click Add Video to create one.</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                              {chapter.videos.map((vid, vIdx) => (
                                <div key={`v-${vIdx}`} className="bg-[#111] border border-white/5 rounded-2xl p-5 relative group hover:border-[#E87C41]/50 transition-colors">
                                  <div className="absolute top-0 left-0 w-1 h-full bg-[#E87C41] rounded-l-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4">
                                      <div className="p-2.5 bg-white/5 rounded-lg text-[#E87C41] shrink-0 border border-white/5">
                                        <PlayCircle className="h-4 w-4" />
                                      </div>
                                      <div>
                                        <h4 className="font-black text-xs text-white tracking-wide mb-1.5 leading-snug">{vid.title}</h4>
                                        {vid.duration && <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">{vid.duration}</span>}
                                      </div>
                                    </div>
                                    <button onClick={() => handleDeleteItem(cIdx, 'videos', vIdx)} className="text-gray-600 hover:text-red-500 transition-colors p-1 bg-white/5 rounded-md hover:bg-red-500/10">
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* NOTES TAB */}
                      {currentTab === 'notes' && (
                        <div className="animate-fade-in">
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Documents & Notes</h3>
                            <button 
                              onClick={() => { setActiveChapterIndex(cIdx); setShowNoteModal(true); }} 
                              className="flex items-center space-x-2 px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-[#E87C41]/30 bg-[#E87C41]/10 text-[#E87C41] hover:bg-[#E87C41] hover:text-white"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Add Document</span>
                            </button>
                          </div>
                          
                          {(!chapter.notes || chapter.notes.length === 0) ? (
                            <div className="py-12 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-white/10 bg-[#0a0a0a]">
                              <FileSearch className="h-8 w-8 text-gray-700 mb-3" />
                              <p className="font-black text-xs text-white mb-1 uppercase tracking-widest">No Documents</p>
                              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Click Add Document to attach files.</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                              {chapter.notes.map((note, nIdx) => (
                                <div key={`n-${nIdx}`} className="bg-[#111] border border-white/5 rounded-2xl p-5 relative group hover:border-[#E87C41]/50 transition-colors">
                                  <div className="absolute top-0 left-0 w-1 h-full bg-[#E87C41] rounded-l-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4">
                                      <div className="p-2.5 bg-white/5 rounded-lg text-[#E87C41] shrink-0 border border-white/5">
                                        <FileSearch className="h-4 w-4" />
                                      </div>
                                      <div>
                                        <h4 className="font-black text-xs text-white tracking-wide mb-1.5 leading-snug">{note.title}</h4>
                                        <a href={note.fileUrl} target="_blank" rel="noreferrer" className="text-[9px] font-black text-[#E87C41] uppercase tracking-[0.2em] hover:underline bg-[#E87C41]/10 px-2 py-1 rounded">Open Doc</a>
                                      </div>
                                    </div>
                                    <button onClick={() => handleDeleteItem(cIdx, 'notes', nIdx)} className="text-gray-600 hover:text-red-500 transition-colors p-1 bg-white/5 rounded-md hover:bg-red-500/10">
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* MOCK TESTS TAB */}
                      {currentTab === 'mockTests' && (
                        <div className="animate-fade-in">
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">AI Mock Tests</h3>
                            <button 
                              onClick={() => { setActiveChapterIndex(cIdx); setShowMockTestModal(true); setGeneratedMockTest(null); }} 
                              className="flex items-center space-x-2 px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-[#E87C41]/30 bg-[#E87C41]/10 text-[#E87C41] hover:bg-[#E87C41] hover:text-white"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Add Test</span>
                            </button>
                          </div>
                          
                          {(!chapter.mockTests || chapter.mockTests.length === 0) ? (
                            <div className="py-12 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-white/10 bg-[#0a0a0a]">
                              <Brain className="h-8 w-8 text-gray-700 mb-3" />
                              <p className="font-black text-xs text-white mb-1 uppercase tracking-widest">No Tests Generated</p>
                              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Use AI to generate a mock test.</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                              {chapter.mockTests.map((mt, mtIdx) => (
                                <div key={`mt-${mtIdx}`} className="bg-[#111] border border-white/5 rounded-2xl p-5 relative group hover:border-[#E87C41]/50 transition-colors">
                                  <div className="absolute top-0 left-0 w-1 h-full bg-[#E87C41] rounded-l-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4">
                                      <div className="p-2.5 bg-white/5 rounded-lg text-[#E87C41] shrink-0 border border-white/5">
                                        <HelpCircle className="h-4 w-4" />
                                      </div>
                                      <div>
                                        <h4 className="font-black text-xs text-white tracking-wide mb-1.5 leading-snug">{mt.title}</h4>
                                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] block">{mt.questions.length} Qs • {mt.timeLimit} Mins</span>
                                      </div>
                                    </div>
                                    <button onClick={() => handleDeleteItem(cIdx, 'mockTests', mtIdx)} className="text-gray-600 hover:text-red-500 transition-colors p-1 bg-white/5 rounded-md hover:bg-red-500/10">
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* LIVE CLASSES TAB */}
                      {currentTab === 'liveClasses' && (
                        <div className="animate-fade-in">
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Scheduled Live Classes</h3>
                            <button 
                              onClick={() => { setActiveChapterIndex(cIdx); setShowLiveClassModal(true); }} 
                              className="flex items-center space-x-2 px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-[#E87C41]/30 bg-[#E87C41]/10 text-[#E87C41] hover:bg-[#E87C41] hover:text-white"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Schedule Live</span>
                            </button>
                          </div>
                          
                          {(!chapter.liveClasses || chapter.liveClasses.length === 0) ? (
                            <div className="py-12 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-white/10 bg-[#0a0a0a]">
                              <Clock className="h-8 w-8 text-gray-700 mb-3" />
                              <p className="font-black text-xs text-white mb-1 uppercase tracking-widest">No Live Classes</p>
                              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Schedule an upcoming live session.</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                              {chapter.liveClasses.map((lc, lcIdx) => (
                                <div key={`lc-${lcIdx}`} className="bg-[#111] border border-white/5 rounded-2xl p-5 relative group hover:border-[#E87C41]/50 transition-colors">
                                  <div className="absolute top-0 left-0 w-1 h-full bg-[#E87C41] rounded-l-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4">
                                      <div className="p-2.5 bg-white/5 rounded-lg text-[#E87C41] shrink-0 border border-white/5">
                                        <Clock className="h-4 w-4" />
                                      </div>
                                      <div>
                                        <h4 className="font-black text-xs text-white tracking-wide mb-1.5 leading-snug">{lc.title}</h4>
                                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-1.5">
                                          {new Date(lc.date).toLocaleString()}
                                        </span>
                                        <span className="text-[8px] uppercase tracking-[0.2em] font-black px-2 py-0.5 rounded bg-[#E87C41]/10 text-[#E87C41] border border-[#E87C41]/20">{lc.status}</span>
                                      </div>
                                    </div>
                                    <button onClick={() => handleDeleteItem(cIdx, 'liveClasses', lcIdx)} className="text-gray-600 hover:text-red-500 transition-colors p-1 bg-white/5 rounded-md hover:bg-red-500/10">
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {chapters.length === 0 && (
            <div className="text-center py-32 rounded-3xl border border-white/5 bg-[#0a0a0a] w-full">
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-8 bg-[#111] border border-white/5 shadow-inner">
                <BookOpen className="h-10 w-10 text-[#E87C41] opacity-50" />
              </div>
              <h3 className="text-3xl font-black tracking-tight text-white mb-3">Curriculum is Empty</h3>
              <p className="font-bold text-sm text-gray-500 mb-8 uppercase tracking-widest">Build the structural foundation first.</p>
              <button 
                onClick={() => setShowChapterModal(true)}
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] bg-[#E87C41] text-white hover:bg-[#d66b35] transition-all shadow-[0_0_20px_rgba(232,124,65,0.2)]"
              >
                <Plus className="h-4 w-4" />
                <span>Create First Chapter</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODALS - EXTREME FORMAL THEME */}

      {/* Chapter Modal */}
      {showChapterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="rounded-3xl w-full max-w-md p-8 border border-white/10 bg-[#0a0a0a] shadow-2xl relative">
            <h2 className="text-xl font-black uppercase tracking-widest text-white mb-8 border-b border-white/5 pb-4">Create Chapter</h2>
            <div className="mb-8">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Chapter Title</label>
              <input 
                type="text" 
                placeholder="E.g., Module 1: Introduction" 
                value={newChapterTitle}
                onChange={e => setNewChapterTitle(e.target.value)}
                className="w-full px-5 py-4 rounded-xl focus:outline-none focus:border-[#E87C41] transition-all bg-[#111] border border-white/10 text-white font-bold text-sm"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button onClick={() => setShowChapterModal(false)} className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Cancel</button>
              <button onClick={handleAddChapter} className="px-8 py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] bg-[#E87C41] text-white hover:bg-[#d66b35] transition-colors">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="rounded-3xl w-full max-w-md p-8 border border-white/10 bg-[#0a0a0a] shadow-2xl relative">
            <h2 className="text-xl font-black uppercase tracking-widest text-white mb-8 border-b border-white/5 pb-4 flex items-center gap-3">
              <PlayCircle className="h-5 w-5 text-[#E87C41]" />
              Add Video
            </h2>
            <div className="space-y-5 mb-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Video Title</label>
                <input type="text" value={newVideo.title} onChange={e => setNewVideo({...newVideo, title: e.target.value})} className="w-full px-5 py-4 rounded-xl focus:outline-none focus:border-[#E87C41] transition-all bg-[#111] border border-white/10 text-white font-bold text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Duration (e.g. 10:30)</label>
                <input type="text" value={newVideo.duration} onChange={e => setNewVideo({...newVideo, duration: e.target.value})} className="w-full px-5 py-4 rounded-xl focus:outline-none focus:border-[#E87C41] transition-all bg-[#111] border border-white/10 text-white font-bold text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">External URL (Optional)</label>
                <input type="text" value={newVideo.videoUrl} onChange={e => setNewVideo({...newVideo, videoUrl: e.target.value})} className="w-full px-5 py-4 rounded-xl focus:outline-none focus:border-[#E87C41] transition-all bg-[#111] border border-white/10 text-white font-bold text-sm" />
              </div>
              
              <div className="relative border-2 border-dashed border-white/10 rounded-xl p-6 text-center transition-colors bg-[#111] hover:border-[#E87C41]/50 cursor-pointer">
                <input type="file" accept="video/*" onChange={e => setNewVideo({...newVideo, file: e.target.files[0]})} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3 text-gray-400">
                    <Upload className="h-5 w-5" />
                  </div>
                  {newVideo.file ? <span className="font-bold text-sm text-[#E87C41]">{newVideo.file.name}</span> : <span className="font-black text-xs uppercase tracking-widest text-gray-500">Upload Video File</span>}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4 border-t border-white/5 pt-6">
              <button onClick={() => setShowVideoModal(false)} className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Cancel</button>
              <button onClick={handleAddVideo} disabled={uploadingMedia} className="px-8 py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] bg-[#E87C41] text-white hover:bg-[#d66b35] transition-colors disabled:opacity-50 flex items-center">
                {uploadingMedia && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="rounded-3xl w-full max-w-md p-8 border border-white/10 bg-[#0a0a0a] shadow-2xl relative">
            <h2 className="text-xl font-black uppercase tracking-widest text-white mb-8 border-b border-white/5 pb-4 flex items-center gap-3">
              <FileSearch className="h-5 w-5 text-[#E87C41]" />
              Add Document
            </h2>
            <div className="space-y-5 mb-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Title</label>
                <input type="text" value={newNote.title} onChange={e => setNewNote({...newNote, title: e.target.value})} className="w-full px-5 py-4 rounded-xl focus:outline-none focus:border-[#E87C41] transition-all bg-[#111] border border-white/10 text-white font-bold text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">External URL (Optional)</label>
                <input type="text" value={newNote.fileUrl} onChange={e => setNewNote({...newNote, fileUrl: e.target.value})} className="w-full px-5 py-4 rounded-xl focus:outline-none focus:border-[#E87C41] transition-all bg-[#111] border border-white/10 text-white font-bold text-sm" />
              </div>
              <div className="relative border-2 border-dashed border-white/10 rounded-xl p-6 text-center transition-colors bg-[#111] hover:border-[#E87C41]/50 cursor-pointer">
                <input type="file" accept=".pdf,.doc,.docx,.jpg,.png" onChange={e => setNewNote({...newNote, file: e.target.files[0]})} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3 text-gray-400">
                    <Upload className="h-5 w-5" />
                  </div>
                  {newNote.file ? <span className="font-bold text-sm text-[#E87C41]">{newNote.file.name}</span> : <span className="font-black text-xs uppercase tracking-widest text-gray-500">Upload PDF / File</span>}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4 border-t border-white/5 pt-6">
              <button onClick={() => setShowNoteModal(false)} className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Cancel</button>
              <button onClick={handleAddNote} disabled={uploadingMedia} className="px-8 py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] bg-[#E87C41] text-white hover:bg-[#d66b35] transition-colors disabled:opacity-50 flex items-center">
                {uploadingMedia && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mock Test Modal */}
      {showMockTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="rounded-3xl w-full max-w-2xl p-8 border border-white/10 bg-[#0a0a0a] shadow-2xl relative flex flex-col max-h-[90vh]">
            <h2 className="text-xl font-black uppercase tracking-widest text-white mb-6 border-b border-white/5 pb-4 flex items-center gap-3 shrink-0">
              <Brain className="h-5 w-5 text-[#E87C41]" />
              AI Mock Test Generator
            </h2>
            
            <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 space-y-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Topic</label>
                  <input type="text" placeholder="e.g. React Basics" value={mockTestParams.topic} onChange={e => setMockTestParams({...mockTestParams, topic: e.target.value})} className="w-full px-5 py-4 rounded-xl focus:outline-none focus:border-[#E87C41] transition-all bg-[#111] border border-white/10 text-white font-bold text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Questions</label>
                    <input type="number" value={mockTestParams.numQuestions} onChange={e => setMockTestParams({...mockTestParams, numQuestions: parseInt(e.target.value)})} className="w-full px-5 py-4 rounded-xl focus:outline-none focus:border-[#E87C41] transition-all bg-[#111] border border-white/10 text-white font-bold text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Time (Mins)</label>
                    <input type="number" value={mockTestParams.timeLimit} onChange={e => setMockTestParams({...mockTestParams, timeLimit: parseInt(e.target.value)})} className="w-full px-5 py-4 rounded-xl focus:outline-none focus:border-[#E87C41] transition-all bg-[#111] border border-white/10 text-white font-bold text-sm" />
                  </div>
                </div>
              </div>
              
              <button onClick={handleGenerateMockTest} disabled={generatingMockTest} className="w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors disabled:opacity-50">
                {generatingMockTest ? <Loader2 className="h-4 w-4 animate-spin"/> : <Brain className="h-4 w-4"/>}
                <span>{generatingMockTest ? 'Synthesizing...' : 'Generate Questions'}</span>
              </button>

              {generatedMockTest && (
                <div className="p-6 rounded-2xl bg-[#111] border border-[#E87C41]/30">
                  <h3 className="font-black text-sm text-white mb-4 uppercase tracking-widest">{generatedMockTest.title}</h3>
                  <div className="space-y-4">
                    {generatedMockTest.questions.map((q, i) => (
                      <div key={i} className="p-4 rounded-xl border border-white/5 bg-[#050505]">
                        <p className="font-bold text-sm text-gray-300 mb-2">{i+1}. {q.questionText}</p>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 inline-block rounded bg-white/5 text-gray-500">Includes 4 options & explanation</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-6 mt-4 border-t border-white/5 shrink-0">
              <button onClick={() => setShowMockTestModal(false)} className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Cancel</button>
              <button onClick={handleSaveMockTest} disabled={!generatedMockTest} className="px-8 py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] bg-[#E87C41] text-white hover:bg-[#d66b35] transition-colors disabled:opacity-50">
                Save to Chapter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Class Modal */}
      {showLiveClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="rounded-3xl w-full max-w-md p-8 border border-white/10 bg-[#0a0a0a] shadow-2xl relative">
            <h2 className="text-xl font-black uppercase tracking-widest text-white mb-8 border-b border-white/5 pb-4 flex items-center gap-3">
              <Clock className="h-5 w-5 text-[#E87C41]" />
              Schedule Live Class
            </h2>
            <div className="space-y-5 mb-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Class Topic</label>
                <input type="text" value={newLiveClass.title} onChange={(e) => setNewLiveClass({...newLiveClass, title: e.target.value})} className="w-full px-5 py-4 rounded-xl focus:outline-none focus:border-[#E87C41] transition-all bg-[#111] border border-white/10 text-white font-bold text-sm" placeholder="e.g. Q&A Session" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Date</label>
                <input type="date" value={newLiveClass.date} onChange={(e) => setNewLiveClass({...newLiveClass, date: e.target.value})} className="w-full px-5 py-4 rounded-xl focus:outline-none focus:border-[#E87C41] transition-all bg-[#111] border border-white/10 text-white font-bold text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Time</label>
                <input type="time" value={newLiveClass.time} onChange={(e) => setNewLiveClass({...newLiveClass, time: e.target.value})} className="w-full px-5 py-4 rounded-xl focus:outline-none focus:border-[#E87C41] transition-all bg-[#111] border border-white/10 text-white font-bold text-sm" />
              </div>
            </div>
            <div className="flex justify-end space-x-4 border-t border-white/5 pt-6">
              <button onClick={() => setShowLiveClassModal(false)} className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Cancel</button>
              <button onClick={handleAddLiveClass} className="px-8 py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] bg-[#E87C41] text-white hover:bg-[#d66b35] transition-colors">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfig.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="rounded-3xl w-full max-w-sm p-8 border border-white/10 bg-[#0a0a0a] shadow-2xl relative text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-widest text-white mb-2">Confirm Delete</h2>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-8">
              Are you sure you want to delete {deleteConfig.title}? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button onClick={() => setDeleteConfig({ show: false, chapterIdx: null, type: null, itemIdx: null, title: '' })} className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors bg-[#111] border border-white/10">Cancel</button>
              <button onClick={confirmDelete} className="px-8 py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] bg-red-500 text-white hover:bg-red-600 transition-colors shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCourseDetails;
