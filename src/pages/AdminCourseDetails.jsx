import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft, Plus, Video, FileText, Brain, Save, Trash2, Edit3, ChevronDown, ChevronUp, Loader2, AlertCircle, CheckCircle, Upload, Clock, X, BookOpen
} from 'lucide-react';

const API_URL = 'https://e-learning-backend-1-r539.onrender.com/api';

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
      setSuccess('Course content updated successfully!');
      setChapters(updatedChapters);
    } catch (err) {
      setError('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const toggleChapter = (index) => {
    setExpandedChapters(prev => ({ ...prev, [index]: !prev[index] }));
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
    if (!window.confirm('Are you sure you want to delete this chapter?')) return;
    const updated = chapters.filter((_, i) => i !== idx);
    setChapters(updated);
    saveCourse(updated);
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
    if (!window.confirm(`Delete this ${type}?`)) return;
    const updated = [...chapters];
    updated[chapterIdx][type] = updated[chapterIdx][type].filter((_, i) => i !== itemIdx);
    setChapters(updated);
    saveCourse(updated);
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin" style={{ color: 'var(--accent)' }} />
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 md:p-10 animate-fade-in max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <button
            onClick={() => navigate('/admin')}
            className="inline-flex items-center space-x-2 text-sm font-medium hover:-translate-x-1.5 transition-transform duration-300 group mb-4"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>Back to Executive Dashboard</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {course?.title}
          </h1>
          <p className="mt-2 font-medium text-sm" style={{ color: 'var(--text-secondary)' }}>Manage Chapters, Videos, Notes & Mock Tests</p>
        </div>
        <button 
          onClick={() => setShowChapterModal(true)}
          className="relative inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg focus:outline-none group overflow-hidden"
          style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' }}
        >
          <div className="absolute inset-0 w-0 transition-all duration-500 ease-out group-hover:w-full z-0" style={{ backgroundColor: 'var(--accent)' }}></div>
          <Plus className="h-5 w-5 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
          <span className="relative z-10">Add Chapter</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl mb-6 flex items-center shadow-sm animate-fade-in border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
          <AlertCircle className="h-5 w-5 mr-3 shrink-0" />
          <span className="font-medium text-sm">{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 rounded-xl mb-6 flex items-center shadow-sm animate-fade-in border" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
          <CheckCircle className="h-5 w-5 mr-3 shrink-0" />
          <span className="font-medium text-sm">{success}</span>
        </div>
      )}

      <div className="space-y-6 animate-slide-up">
        {chapters.map((chapter, cIdx) => (
          <div key={cIdx} className="rounded-[1.5rem] border shadow-sm overflow-hidden transition-all duration-500 hover:shadow-lg group" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            {/* Chapter Header */}
            <div 
              className="p-5 md:p-6 flex items-center justify-between cursor-pointer transition-colors duration-300"
              style={{ backgroundColor: expandedChapters[cIdx] ? 'var(--bg-input)' : 'transparent' }}
              onClick={() => toggleChapter(cIdx)}
            >
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full flex items-center justify-center font-bold text-white shadow-md text-lg bg-gradient-to-br from-indigo-500 to-purple-600 transition-transform duration-500 group-hover:scale-110">
                  {cIdx + 1}
                </div>
                <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>{chapter.title}</h2>
              </div>
              <div className="flex items-center space-x-3">
                <button onClick={(e) => { e.stopPropagation(); handleDeleteChapter(cIdx); }} className="p-2.5 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all shadow-sm opacity-0 group-hover:opacity-100 border border-transparent hover:border-red-200">
                  <Trash2 className="h-5 w-5" />
                </button>
                <div className="p-2.5 rounded-xl transition-colors" style={{ backgroundColor: 'var(--bg-primary)' }}>
                  {expandedChapters[cIdx] ? <ChevronUp className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} /> : <ChevronDown className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} />}
                </div>
              </div>
            </div>

            {/* Chapter Content */}
            {expandedChapters[cIdx] && (
              <div className="p-6 md:p-8 border-t animate-slide-down" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-8">
                  <button onClick={() => { setActiveChapterIndex(cIdx); setShowVideoModal(true); }} className="relative inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm border focus:outline-none overflow-hidden hover:border-transparent group/action" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                    <div className="absolute inset-0 w-0 bg-blue-500 transition-all duration-500 ease-out group-hover/action:w-full z-0"></div>
                    <Video className="h-4 w-4 relative z-10 group-hover/action:text-white transition-colors" />
                    <span className="relative z-10 group-hover/action:text-white transition-colors">Add Video</span>
                  </button>
                  <button onClick={() => { setActiveChapterIndex(cIdx); setShowNoteModal(true); }} className="relative inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm border focus:outline-none overflow-hidden hover:border-transparent group/action" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                    <div className="absolute inset-0 w-0 bg-emerald-500 transition-all duration-500 ease-out group-hover/action:w-full z-0"></div>
                    <FileText className="h-4 w-4 relative z-10 group-hover/action:text-white transition-colors" />
                    <span className="relative z-10 group-hover/action:text-white transition-colors">Add Note</span>
                  </button>
                  <button onClick={() => { setActiveChapterIndex(cIdx); setShowMockTestModal(true); setGeneratedMockTest(null); }} className="relative inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm border focus:outline-none overflow-hidden hover:border-transparent group/action" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                    <div className="absolute inset-0 w-0 bg-purple-500 transition-all duration-500 ease-out group-hover/action:w-full z-0"></div>
                    <Brain className="h-4 w-4 relative z-10 group-hover/action:text-white transition-colors" />
                    <span className="relative z-10 group-hover/action:text-white transition-colors">Add Mock Test</span>
                  </button>
                  <button onClick={() => { setActiveChapterIndex(cIdx); setShowLiveClassModal(true); }} className="relative inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm border focus:outline-none overflow-hidden hover:border-transparent group/action" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                    <div className="absolute inset-0 w-0 bg-amber-500 transition-all duration-500 ease-out group-hover/action:w-full z-0"></div>
                    <Clock className="h-4 w-4 relative z-10 group-hover/action:text-white transition-colors" />
                    <span className="relative z-10 group-hover/action:text-white transition-colors">Schedule Live Class</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* Videos */}
                  {chapter.videos.map((vid, vIdx) => (
                    <div key={`v-${vIdx}`} className="p-5 rounded-xl border shadow-sm flex flex-col justify-between group/item relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500 transform -translate-x-full group-hover/item:translate-x-0 transition-transform duration-300"></div>
                      <div className="flex items-start space-x-4">
                        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 shadow-inner shrink-0"><Video className="h-6 w-6" /></div>
                        <div>
                          <h4 className="font-bold tracking-tight line-clamp-2" style={{ color: 'var(--text-primary)' }}>{vid.title}</h4>
                          {vid.duration && <span className="text-xs font-semibold mt-1.5 block" style={{ color: 'var(--text-secondary)' }}>{vid.duration}</span>}
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t flex justify-end opacity-0 group-hover/item:opacity-100 transition-opacity" style={{ borderColor: 'var(--border-color)' }}>
                        <button onClick={() => handleDeleteItem(cIdx, 'videos', vIdx)} className="text-xs font-bold text-red-500 flex items-center space-x-1.5 hover:text-red-700">
                          <Trash2 className="h-3.5 w-3.5" /><span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Notes */}
                  {chapter.notes.map((note, nIdx) => (
                    <div key={`n-${nIdx}`} className="p-5 rounded-xl border shadow-sm flex flex-col justify-between group/item relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 transform -translate-x-full group-hover/item:translate-x-0 transition-transform duration-300"></div>
                      <div className="flex items-start space-x-4">
                        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 shadow-inner shrink-0"><FileText className="h-6 w-6" /></div>
                        <div>
                          <h4 className="font-bold tracking-tight line-clamp-2" style={{ color: 'var(--text-primary)' }}>{note.title}</h4>
                          <a href={note.fileUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-emerald-500 mt-1.5 block hover:underline">View Document</a>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t flex justify-end opacity-0 group-hover/item:opacity-100 transition-opacity" style={{ borderColor: 'var(--border-color)' }}>
                        <button onClick={() => handleDeleteItem(cIdx, 'notes', nIdx)} className="text-xs font-bold text-red-500 flex items-center space-x-1.5 hover:text-red-700">
                          <Trash2 className="h-3.5 w-3.5" /><span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Mock Tests */}
                  {chapter.mockTests && chapter.mockTests.map((mt, mtIdx) => (
                    <div key={`mt-${mtIdx}`} className="p-5 rounded-xl border shadow-sm flex flex-col justify-between group/item relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500 transform -translate-x-full group-hover/item:translate-x-0 transition-transform duration-300"></div>
                      <div className="flex items-start space-x-4">
                        <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 shadow-inner shrink-0"><Brain className="h-6 w-6" /></div>
                        <div>
                          <h4 className="font-bold tracking-tight line-clamp-2" style={{ color: 'var(--text-primary)' }}>{mt.title}</h4>
                          <span className="text-xs font-bold mt-1.5 block" style={{ color: 'var(--text-secondary)' }}>{mt.questions.length} Qs • {mt.timeLimit}m</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t flex justify-end opacity-0 group-hover/item:opacity-100 transition-opacity" style={{ borderColor: 'var(--border-color)' }}>
                        <button onClick={() => handleDeleteItem(cIdx, 'mockTests', mtIdx)} className="text-xs font-bold text-red-500 flex items-center space-x-1.5 hover:text-red-700">
                          <Trash2 className="h-3.5 w-3.5" /><span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Live Classes */}
                  {chapter.liveClasses && chapter.liveClasses.map((lc, lcIdx) => (
                    <div key={`lc-${lcIdx}`} className="p-5 rounded-xl border shadow-sm flex flex-col justify-between group/item relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500 transform -translate-x-full group-hover/item:translate-x-0 transition-transform duration-300"></div>
                      <div className="flex items-start space-x-4">
                        <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 shadow-inner shrink-0"><Clock className="h-6 w-6" /></div>
                        <div>
                          <h4 className="font-bold tracking-tight line-clamp-2" style={{ color: 'var(--text-primary)' }}>{lc.title}</h4>
                          <span className="text-xs font-bold text-amber-500 mt-1 block">
                            {new Date(lc.date).toLocaleString()}
                          </span>
                          <span className="text-[10px] uppercase tracking-widest font-bold mt-1.5 border px-2 py-0.5 rounded inline-block" style={{ color: 'var(--text-muted)', borderColor: 'var(--border-color)' }}>{lc.status}</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t flex justify-end opacity-0 group-hover/item:opacity-100 transition-opacity" style={{ borderColor: 'var(--border-color)' }}>
                        <button onClick={() => handleDeleteItem(cIdx, 'liveClasses', lcIdx)} className="text-xs font-bold text-red-500 flex items-center space-x-1.5 hover:text-red-700">
                          <Trash2 className="h-3.5 w-3.5" /><span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {chapter.videos.length === 0 && chapter.notes.length === 0 && chapter.mockTests?.length === 0 && (!chapter.liveClasses || chapter.liveClasses.length === 0) && (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-center rounded-2xl border-2 border-dashed" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-input)' }}>
                      <Plus className="h-10 w-10 mb-3 opacity-20" style={{ color: 'var(--text-muted)' }} />
                      <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>No content yet</p>
                      <p className="text-xs font-medium mt-1" style={{ color: 'var(--text-secondary)' }}>Use the actions above to populate this chapter.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {chapters.length === 0 && (
          <div className="text-center py-20 rounded-[2rem] border shadow-sm animate-scale-in" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border animate-pulse" style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)' }}>
              <BookOpen className="h-10 w-10 opacity-40" style={{ color: 'var(--accent)' }} />
            </div>
            <h3 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Curriculum is Empty</h3>
            <p className="font-medium text-sm mt-2 mb-8" style={{ color: 'var(--text-secondary)' }}>Create your first chapter to start building out the course structure.</p>
            <button 
              onClick={() => setShowChapterModal(true)}
              className="relative inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg focus:outline-none group overflow-hidden"
              style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
            >
              <div className="absolute inset-0 w-0 bg-black/20 transition-all duration-500 ease-out group-hover:w-full z-0"></div>
              <Plus className="h-5 w-5 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
              <span className="relative z-10">Create First Chapter</span>
            </button>
          </div>
        )}
      </div>

      {/* MODALS WITH FORMAL STYLING */}
      {/* Chapter Modal */}
      {showChapterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="rounded-[1.5rem] w-full max-w-md p-8 shadow-2xl relative animate-scale-in border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h2 className="text-2xl font-bold tracking-tight mb-6" style={{ color: 'var(--text-primary)' }}>Create Chapter</h2>
            <input 
              type="text" 
              placeholder="E.g., Module 1: Introduction" 
              value={newChapterTitle}
              onChange={e => setNewChapterTitle(e.target.value)}
              className="w-full px-5 py-4 rounded-xl focus:outline-none focus:ring-2 transition-all mb-8 shadow-inner text-sm font-medium"
              style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', '--tw-ring-color': 'var(--accent)' }}
            />
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowChapterModal(false)} className="px-6 py-2.5 rounded-xl font-bold text-sm transition-colors" style={{ color: 'var(--text-secondary)' }}>Cancel</button>
              <button onClick={handleAddChapter} className="relative inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md focus:outline-none group overflow-hidden" style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' }}>
                <div className="absolute inset-0 w-0 transition-all duration-500 ease-out group-hover:w-full z-0" style={{ backgroundColor: 'var(--accent)' }}></div>
                <span className="relative z-10">Confirm</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="rounded-[1.5rem] w-full max-w-md p-8 shadow-2xl relative animate-scale-in border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center space-x-3" style={{ color: 'var(--text-primary)' }}>
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500"><Video className="h-5 w-5" /></div>
              <span>Add Video</span>
            </h2>
            <div className="space-y-4 mb-8">
              <input type="text" placeholder="Video Title" value={newVideo.title} onChange={e => setNewVideo({...newVideo, title: e.target.value})} className="w-full px-5 py-3.5 rounded-xl focus:outline-none focus:ring-2 transition-all shadow-inner text-sm font-medium" style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', '--tw-ring-color': 'var(--accent)' }} />
              <input type="text" placeholder="Duration (e.g. 10:30)" value={newVideo.duration} onChange={e => setNewVideo({...newVideo, duration: e.target.value})} className="w-full px-5 py-3.5 rounded-xl focus:outline-none focus:ring-2 transition-all shadow-inner text-sm font-medium" style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', '--tw-ring-color': 'var(--accent)' }} />
              <input type="text" placeholder="External Video URL (Optional)" value={newVideo.videoUrl} onChange={e => setNewVideo({...newVideo, videoUrl: e.target.value})} className="w-full px-5 py-3.5 rounded-xl focus:outline-none focus:ring-2 transition-all shadow-inner text-sm font-medium" style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', '--tw-ring-color': 'var(--accent)' }} />
              <div className="relative border-2 border-dashed rounded-xl p-6 text-center transition-colors group cursor-pointer hover:bg-blue-500/5 hover:border-blue-500" style={{ borderColor: 'var(--border-color)' }}>
                <input type="file" accept="video/*" onChange={e => setNewVideo({...newVideo, file: e.target.files[0]})} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="text-sm flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center mb-3 shadow-sm border group-hover:scale-110 transition-transform" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                    <Upload className="h-5 w-5 text-blue-500" />
                  </div>
                  {newVideo.file ? <span className="font-bold text-blue-500">{newVideo.file.name}</span> : <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Upload Video File Instead</span>}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowVideoModal(false)} className="px-6 py-2.5 rounded-xl font-bold text-sm transition-colors" style={{ color: 'var(--text-secondary)' }}>Cancel</button>
              <button onClick={handleAddVideo} disabled={uploadingMedia} className="relative inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md focus:outline-none group overflow-hidden bg-blue-600 text-white disabled:opacity-50">
                <div className="absolute inset-0 w-0 bg-black/20 transition-all duration-500 ease-out group-hover:w-full z-0"></div>
                {uploadingMedia && <Loader2 className="h-4 w-4 animate-spin relative z-10" />}
                <span className="relative z-10">Save Media</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="rounded-[1.5rem] w-full max-w-md p-8 shadow-2xl relative animate-scale-in border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center space-x-3" style={{ color: 'var(--text-primary)' }}>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500"><FileText className="h-5 w-5" /></div>
              <span>Add Document</span>
            </h2>
            <div className="space-y-4 mb-8">
              <input type="text" placeholder="Note Title" value={newNote.title} onChange={e => setNewNote({...newNote, title: e.target.value})} className="w-full px-5 py-3.5 rounded-xl focus:outline-none focus:ring-2 transition-all shadow-inner text-sm font-medium" style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', '--tw-ring-color': 'var(--accent)' }} />
              <input type="text" placeholder="External Document URL (Optional)" value={newNote.fileUrl} onChange={e => setNewNote({...newNote, fileUrl: e.target.value})} className="w-full px-5 py-3.5 rounded-xl focus:outline-none focus:ring-2 transition-all shadow-inner text-sm font-medium" style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', '--tw-ring-color': 'var(--accent)' }} />
              <div className="relative border-2 border-dashed rounded-xl p-6 text-center transition-colors group cursor-pointer hover:bg-emerald-500/5 hover:border-emerald-500" style={{ borderColor: 'var(--border-color)' }}>
                <input type="file" accept=".pdf,.doc,.docx,.jpg,.png" onChange={e => setNewNote({...newNote, file: e.target.files[0]})} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="text-sm flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center mb-3 shadow-sm border group-hover:scale-110 transition-transform" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                    <Upload className="h-5 w-5 text-emerald-500" />
                  </div>
                  {newNote.file ? <span className="font-bold text-emerald-500">{newNote.file.name}</span> : <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Upload PDF or Image Instead</span>}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowNoteModal(false)} className="px-6 py-2.5 rounded-xl font-bold text-sm transition-colors" style={{ color: 'var(--text-secondary)' }}>Cancel</button>
              <button onClick={handleAddNote} disabled={uploadingMedia} className="relative inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md focus:outline-none group overflow-hidden bg-emerald-600 text-white disabled:opacity-50">
                <div className="absolute inset-0 w-0 bg-black/20 transition-all duration-500 ease-out group-hover:w-full z-0"></div>
                {uploadingMedia && <Loader2 className="h-4 w-4 animate-spin relative z-10" />}
                <span className="relative z-10">Save Document</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mock Test Modal */}
      {showMockTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="rounded-[1.5rem] w-full max-w-2xl p-8 shadow-2xl relative animate-scale-in border max-h-[90vh] flex flex-col" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center space-x-3 shrink-0" style={{ color: 'var(--text-primary)' }}>
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500"><Brain className="h-5 w-5" /></div>
              <span>AI Mock Test Generator</span>
            </h2>
            
            <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 space-y-6">
              <div className="space-y-4">
                <input type="text" placeholder="Topic (e.g. React Basics)" value={mockTestParams.topic} onChange={e => setMockTestParams({...mockTestParams, topic: e.target.value})} className="w-full px-5 py-3.5 rounded-xl focus:outline-none focus:ring-2 transition-all shadow-inner text-sm font-medium" style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', '--tw-ring-color': 'var(--accent)' }} />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: 'var(--text-muted)' }}>Questions</label>
                    <input type="number" value={mockTestParams.numQuestions} onChange={e => setMockTestParams({...mockTestParams, numQuestions: parseInt(e.target.value)})} className="w-full px-5 py-3.5 rounded-xl focus:outline-none focus:ring-2 transition-all shadow-inner text-sm font-medium" style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', '--tw-ring-color': 'var(--accent)' }} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: 'var(--text-muted)' }}>Time (Mins)</label>
                    <input type="number" value={mockTestParams.timeLimit} onChange={e => setMockTestParams({...mockTestParams, timeLimit: parseInt(e.target.value)})} className="w-full px-5 py-3.5 rounded-xl focus:outline-none focus:ring-2 transition-all shadow-inner text-sm font-medium" style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', '--tw-ring-color': 'var(--accent)' }} />
                  </div>
                </div>
              </div>
              
              <button onClick={handleGenerateMockTest} disabled={generatingMockTest} className="relative inline-flex w-full items-center justify-center space-x-2 px-6 py-4 rounded-xl text-sm font-bold transition-all shadow-md focus:outline-none group overflow-hidden bg-purple-600 text-white disabled:opacity-50 hover:shadow-lg">
                <div className="absolute inset-0 w-0 bg-black/20 transition-all duration-500 ease-out group-hover:w-full z-0"></div>
                {generatingMockTest ? <Loader2 className="h-5 w-5 animate-spin relative z-10"/> : <Brain className="h-5 w-5 relative z-10 group-hover:scale-110 transition-transform"/>}
                <span className="relative z-10">{generatingMockTest ? 'Synthesizing...' : 'Generate Questions'}</span>
              </button>

              {generatedMockTest && (
                <div className="p-6 rounded-xl border shadow-inner animate-fade-in-up" style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)' }}>
                  <h3 className="font-bold tracking-tight mb-4 text-lg" style={{ color: 'var(--text-primary)' }}>{generatedMockTest.title}</h3>
                  <div className="space-y-4">
                    {generatedMockTest.questions.map((q, i) => (
                      <div key={i} className="p-4 rounded-xl border shadow-sm" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                        <p className="font-bold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>{i+1}. {q.questionText}</p>
                        <div className="text-xs font-medium px-2 py-1 inline-block rounded border" style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)' }}>Includes 4 options & explanation.</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-6 mt-2 border-t shrink-0" style={{ borderColor: 'var(--border-color)' }}>
              <button onClick={() => setShowMockTestModal(false)} className="px-6 py-2.5 rounded-xl font-bold text-sm transition-colors" style={{ color: 'var(--text-secondary)' }}>Cancel</button>
              <button onClick={handleSaveMockTest} disabled={!generatedMockTest} className="relative inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md focus:outline-none group overflow-hidden bg-purple-600 text-white disabled:opacity-50">
                <div className="absolute inset-0 w-0 bg-black/20 transition-all duration-500 ease-out group-hover:w-full z-0"></div>
                <span className="relative z-10">Save to Chapter</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Class Modal */}
      {showLiveClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="rounded-[1.5rem] w-full max-w-md p-8 shadow-2xl relative animate-scale-in border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <button onClick={() => setShowLiveClassModal(false)} className="absolute top-6 right-6 p-2 rounded-full transition-colors opacity-60 hover:opacity-100" style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}>
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center space-x-3" style={{ color: 'var(--text-primary)' }}>
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600"><Clock className="h-5 w-5" /></div>
              <span>Schedule Live Class</span>
            </h2>
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: 'var(--text-muted)' }}>Class Topic</label>
                <input type="text" value={newLiveClass.title} onChange={(e) => setNewLiveClass({...newLiveClass, title: e.target.value})} className="w-full px-5 py-3.5 rounded-xl focus:outline-none focus:ring-2 transition-all shadow-inner text-sm font-medium" style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', '--tw-ring-color': 'var(--accent)' }} placeholder="e.g. Q&A Session" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: 'var(--text-muted)' }}>Date</label>
                <input type="date" value={newLiveClass.date} onChange={(e) => setNewLiveClass({...newLiveClass, date: e.target.value})} className="w-full px-5 py-3.5 rounded-xl focus:outline-none focus:ring-2 transition-all shadow-inner text-sm font-medium" style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', '--tw-ring-color': 'var(--accent)' }} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 ml-1" style={{ color: 'var(--text-muted)' }}>Time</label>
                <input type="time" value={newLiveClass.time} onChange={(e) => setNewLiveClass({...newLiveClass, time: e.target.value})} className="w-full px-5 py-3.5 rounded-xl focus:outline-none focus:ring-2 transition-all shadow-inner text-sm font-medium" style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', '--tw-ring-color': 'var(--accent)' }} />
              </div>
            </div>
            <div>
              <button onClick={handleAddLiveClass} className="relative inline-flex w-full items-center justify-center space-x-2 px-6 py-4 rounded-xl text-sm font-bold transition-all shadow-md focus:outline-none group overflow-hidden bg-amber-600 text-white hover:shadow-lg">
                <div className="absolute inset-0 w-0 bg-black/20 transition-all duration-500 ease-out group-hover:w-full z-0"></div>
                <span className="relative z-10">Confirm Schedule</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCourseDetails;

