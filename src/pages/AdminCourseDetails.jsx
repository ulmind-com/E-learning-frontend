import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft, Plus, Video, FileText, Brain, Save, Trash2, Edit3, ChevronDown, ChevronUp, Loader2, AlertCircle, CheckCircle, Upload, Clock, X
} from 'lucide-react';

const API_URL = 'https://e-learning-backend-tubf.onrender.com/api';

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
        const uploadRes = await axios.post(`${API_URL}/upload`, formData);
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
        const uploadRes = await axios.post(`${API_URL}/upload/document`, formData);
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fff5f5' }}>
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#800000' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 relative" style={{ backgroundColor: '#fff5f5' }}>
      {/* Premium Maroon Header */}
      <div className="pt-10 pb-20 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #800000 0%, #4a0000 100%)', color: '#fff' }}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_0%,_transparent_100%)]"></div>
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/admin')} className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-md">
                {course?.title}
              </h1>
              <p className="opacity-80 mt-1 font-medium text-red-100">Manage Chapters, Videos, Notes & Mock Tests</p>
            </div>
          </div>
          <button 
            onClick={() => setShowChapterModal(true)}
            className="flex items-center space-x-2 bg-white text-[#800000] px-6 py-3 rounded-xl font-bold shadow-xl hover:scale-105 transition-transform btn-press"
          >
            <Plus className="h-5 w-5" />
            <span>Add Chapter</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-10 relative z-20">
        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-xl mb-6 flex items-center shadow-sm animate-fade-in">
            <AlertCircle className="h-5 w-5 mr-2 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-600 border border-green-200 p-4 rounded-xl mb-6 flex items-center shadow-sm animate-fade-in">
            <CheckCircle className="h-5 w-5 mr-2 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <div className="space-y-6">
          {chapters.map((chapter, cIdx) => (
            <div key={cIdx} className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(128,0,0,0.08)] border border-red-50 overflow-hidden transition-all duration-300 hover:shadow-[0_15px_40px_rgba(128,0,0,0.12)]">
              {/* Chapter Header */}
              <div 
                className="p-5 flex items-center justify-between cursor-pointer"
                style={{ background: expandedChapters[cIdx] ? 'linear-gradient(to right, #fffafa, #ffffff)' : '#fff' }}
                onClick={() => toggleChapter(cIdx)}
              >
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-white shadow-md" style={{ background: 'linear-gradient(135deg, #800000, #b91c1c)' }}>
                    {cIdx + 1}
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">{chapter.title}</h2>
                </div>
                <div className="flex items-center space-x-4">
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteChapter(cIdx); }} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="h-5 w-5" />
                  </button>
                  {expandedChapters[cIdx] ? <ChevronUp className="h-6 w-6 text-gray-400" /> : <ChevronDown className="h-6 w-6 text-gray-400" />}
                </div>
              </div>

              {/* Chapter Content */}
              {expandedChapters[cIdx] && (
                <div className="p-6 border-t border-red-50 bg-gray-50/50 animate-slide-down">
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    <button onClick={() => { setActiveChapterIndex(cIdx); setShowVideoModal(true); }} className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-sm hover:border-[#800000] hover:text-[#800000] transition-colors btn-press">
                      <Video className="h-4 w-4" /><span>Add Video</span>
                    </button>
                    <button onClick={() => { setActiveChapterIndex(cIdx); setShowNoteModal(true); }} className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-sm hover:border-[#800000] hover:text-[#800000] transition-colors btn-press">
                      <FileText className="h-4 w-4" /><span>Add Note</span>
                    </button>
                    <button onClick={() => { setActiveChapterIndex(cIdx); setShowMockTestModal(true); setGeneratedMockTest(null); }} className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-sm hover:border-[#800000] hover:text-[#800000] transition-colors btn-press">
                      <Brain className="h-4 w-4" /><span>Add Mock Test</span>
                    </button>
                    <button onClick={() => { setActiveChapterIndex(cIdx); setShowLiveClassModal(true); }} className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-sm hover:border-[#800000] hover:text-[#800000] transition-colors btn-press">
                      <Clock className="h-4 w-4" /><span>Schedule Live Class</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Videos */}
                    {chapter.videos.map((vid, vIdx) => (
                      <div key={`v-${vIdx}`} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between group relative overflow-hidden transition-all hover:border-red-200">
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#800000] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-red-50 text-[#800000] rounded-lg"><Video className="h-5 w-5" /></div>
                          <div>
                            <h4 className="font-semibold text-gray-800 line-clamp-2">{vid.title}</h4>
                            {vid.duration && <span className="text-xs text-gray-500 mt-1 block">{vid.duration}</span>}
                          </div>
                        </div>
                        <button onClick={() => handleDeleteItem(cIdx, 'videos', vIdx)} className="mt-3 text-xs font-medium text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                          <Trash2 className="h-3 w-3" /><span>Remove</span>
                        </button>
                      </div>
                    ))}
                    
                    {/* Notes */}
                    {chapter.notes.map((note, nIdx) => (
                      <div key={`n-${nIdx}`} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between group relative overflow-hidden transition-all hover:border-blue-200">
                         <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileText className="h-5 w-5" /></div>
                          <div>
                            <h4 className="font-semibold text-gray-800 line-clamp-2">{note.title}</h4>
                            <a href={note.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 mt-1 block hover:underline">View Document</a>
                          </div>
                        </div>
                        <button onClick={() => handleDeleteItem(cIdx, 'notes', nIdx)} className="mt-3 text-xs font-medium text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                          <Trash2 className="h-3 w-3" /><span>Remove</span>
                        </button>
                      </div>
                    ))}

                    {/* Mock Tests */}
                    {chapter.mockTests && chapter.mockTests.map((mt, mtIdx) => (
                      <div key={`mt-${mtIdx}`} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between group relative overflow-hidden transition-all hover:border-purple-200">
                        <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Brain className="h-5 w-5" /></div>
                          <div>
                            <h4 className="font-semibold text-gray-800 line-clamp-2">{mt.title}</h4>
                            <span className="text-xs text-gray-500 mt-1 block">{mt.questions.length} Qs • {mt.timeLimit}m</span>
                          </div>
                        </div>
                        <button onClick={() => handleDeleteItem(cIdx, 'mockTests', mtIdx)} className="mt-3 text-xs font-medium text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                          <Trash2 className="h-3 w-3" /><span>Remove</span>
                        </button>
                      </div>
                    ))}

                    {/* Live Classes */}
                    {chapter.liveClasses && chapter.liveClasses.map((lc, lcIdx) => (
                      <div key={`lc-${lcIdx}`} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between group relative overflow-hidden transition-all hover:border-green-200">
                        <div className="absolute top-0 left-0 w-1 h-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Clock className="h-5 w-5" /></div>
                          <div>
                            <h4 className="font-semibold text-gray-800 line-clamp-2">{lc.title}</h4>
                            <span className="text-xs font-bold text-green-600 mt-1 block">
                              {new Date(lc.date).toLocaleString()}
                            </span>
                            <span className="text-xs uppercase tracking-wide font-bold text-gray-400 mt-1 block">Status: {lc.status}</span>
                          </div>
                        </div>
                        <button onClick={() => handleDeleteItem(cIdx, 'liveClasses', lcIdx)} className="mt-3 text-xs font-medium text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                          <Trash2 className="h-3 w-3" /><span>Remove</span>
                        </button>
                      </div>
                    ))}

                    {chapter.videos.length === 0 && chapter.notes.length === 0 && chapter.mockTests?.length === 0 && (!chapter.liveClasses || chapter.liveClasses.length === 0) && (
                      <div className="col-span-full py-8 text-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                        No content in this chapter yet. Click above buttons to add.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {chapters.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
              <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Plus className="h-10 w-10 text-[#800000]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">No Chapters Yet</h3>
              <p className="text-gray-500 mt-2 mb-6">Create your first chapter to start building the curriculum.</p>
              <button 
                onClick={() => setShowChapterModal(true)}
                className="bg-[#800000] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                Create Chapter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      {/* Chapter Modal */}
      {showChapterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-scale-in border-t-4 border-[#800000]">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Chapter</h2>
            <input 
              type="text" 
              placeholder="Chapter Title" 
              value={newChapterTitle}
              onChange={e => setNewChapterTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#800000] focus:border-transparent outline-none transition-all mb-6 bg-gray-50"
            />
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowChapterModal(false)} className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleAddChapter} className="px-5 py-2 bg-[#800000] text-white font-bold rounded-xl shadow-md hover:bg-[#600000] transition-colors">Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-scale-in border-t-4 border-[#800000]">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><Video className="mr-2 text-[#800000]" /> Add Video</h2>
            <div className="space-y-4 mb-6">
              <input type="text" placeholder="Video Title" value={newVideo.title} onChange={e => setNewVideo({...newVideo, title: e.target.value})} className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent transition-all" />
              <input type="text" placeholder="Duration (e.g. 10:30)" value={newVideo.duration} onChange={e => setNewVideo({...newVideo, duration: e.target.value})} className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent transition-all" />
              <input type="text" placeholder="External Video URL (Optional)" value={newVideo.videoUrl} onChange={e => setNewVideo({...newVideo, videoUrl: e.target.value})} className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent transition-all" />
              <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-red-50 hover:border-[#800000] transition-colors group cursor-pointer">
                <input type="file" accept="video/*" onChange={e => setNewVideo({...newVideo, file: e.target.files[0]})} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="text-sm text-gray-500 flex flex-col items-center">
                  <Upload className="h-8 w-8 mb-2 text-gray-400 group-hover:text-[#800000] transition-colors" />
                  {newVideo.file ? <span className="font-medium text-[#800000]">{newVideo.file.name}</span> : <span>Upload Video File (Instead of URL)</span>}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowVideoModal(false)} className="px-4 py-2 text-gray-600 rounded-xl hover:bg-gray-100 font-medium">Cancel</button>
              <button onClick={handleAddVideo} disabled={uploadingMedia} className="px-5 py-2 bg-[#800000] text-white rounded-xl font-bold flex items-center disabled:opacity-50 hover:bg-[#600000] transition-colors shadow-md">
                {uploadingMedia ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Save Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-scale-in border-t-4 border-blue-600">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><FileText className="mr-2 text-blue-600" /> Add Note / Document</h2>
            <div className="space-y-4 mb-6">
              <input type="text" placeholder="Note Title" value={newNote.title} onChange={e => setNewNote({...newNote, title: e.target.value})} className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
              <input type="text" placeholder="External Document URL (Optional)" value={newNote.fileUrl} onChange={e => setNewNote({...newNote, fileUrl: e.target.value})} className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
              <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-blue-50 hover:border-blue-500 transition-colors group cursor-pointer">
                <input type="file" accept=".pdf,.doc,.docx,.jpg,.png" onChange={e => setNewNote({...newNote, file: e.target.files[0]})} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="text-sm text-gray-500 flex flex-col items-center">
                  <Upload className="h-8 w-8 mb-2 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  {newNote.file ? <span className="font-medium text-blue-600">{newNote.file.name}</span> : <span>Upload PDF or Image</span>}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowNoteModal(false)} className="px-4 py-2 text-gray-600 rounded-xl hover:bg-gray-100 font-medium">Cancel</button>
              <button onClick={handleAddNote} disabled={uploadingMedia} className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold flex items-center disabled:opacity-50 hover:bg-blue-700 transition-colors shadow-md">
                {uploadingMedia ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mock Test Modal */}
      {showMockTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto animate-scale-in border-t-4 border-purple-600">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center"><Brain className="mr-2 text-purple-600" /> AI Mock Test Generator</h2>
            <div className="space-y-4 mb-6">
              <input type="text" placeholder="Topic (e.g. React Basics)" value={mockTestParams.topic} onChange={e => setMockTestParams({...mockTestParams, topic: e.target.value})} className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1 font-medium">Questions</label>
                  <input type="number" value={mockTestParams.numQuestions} onChange={e => setMockTestParams({...mockTestParams, numQuestions: parseInt(e.target.value)})} className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1 font-medium">Time (Mins)</label>
                  <input type="number" value={mockTestParams.timeLimit} onChange={e => setMockTestParams({...mockTestParams, timeLimit: parseInt(e.target.value)})} className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
                </div>
              </div>
            </div>
            
            <button onClick={handleGenerateMockTest} disabled={generatingMockTest} className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold flex justify-center items-center mb-6 disabled:opacity-70 hover:bg-purple-700 transition-all shadow-md hover:shadow-lg">
              {generatingMockTest ? <><Loader2 className="h-6 w-6 animate-spin mr-2"/> Generating AI Questions...</> : 'Generate Questions'}
            </button>

            {generatedMockTest && (
              <div className="bg-purple-50 p-5 rounded-xl border border-purple-100 mb-6 max-h-60 overflow-y-auto custom-scrollbar">
                <h3 className="font-bold text-purple-800 mb-3 text-lg">{generatedMockTest.title}</h3>
                {generatedMockTest.questions.map((q, i) => (
                  <div key={i} className="mb-4 bg-white p-4 rounded-xl shadow-sm border border-purple-50">
                    <p className="font-semibold text-gray-800 text-sm mb-2">{i+1}. {q.questionText}</p>
                    <div className="text-xs text-gray-500">Includes 4 options & explanation.</div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
              <button onClick={() => setShowMockTestModal(false)} className="px-5 py-2.5 text-gray-600 rounded-xl hover:bg-gray-100 font-medium transition-colors">Cancel</button>
              <button onClick={handleSaveMockTest} disabled={!generatedMockTest} className="px-6 py-2.5 bg-purple-600 text-white rounded-xl font-bold disabled:opacity-50 hover:bg-purple-700 transition-colors shadow-md">Save Test to Chapter</button>
            </div>
          </div>
        </div>
      )}

      {/* Live Class Modal */}
      {showLiveClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 md:p-8 shadow-2xl relative animate-scale-in">
            <button onClick={() => setShowLiveClassModal(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><Clock className="mr-2 text-[#800000]" /> Schedule Live Class</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Class Topic</label>
                <input type="text" value={newLiveClass.title} onChange={(e) => setNewLiveClass({...newLiveClass, title: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#800000]/30 transition-all" placeholder="e.g. Q&A Session" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                <input type="date" value={newLiveClass.date} onChange={(e) => setNewLiveClass({...newLiveClass, date: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#800000]/30 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Time</label>
                <input type="time" value={newLiveClass.time} onChange={(e) => setNewLiveClass({...newLiveClass, time: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#800000]/30 transition-all" />
              </div>
            </div>
            <div className="mt-8">
              <button onClick={handleAddLiveClass} className="w-full bg-[#800000] text-white py-3 rounded-xl font-bold hover:bg-[#5a0000] transition-colors flex justify-center items-center">
                Schedule Class
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCourseDetails;

