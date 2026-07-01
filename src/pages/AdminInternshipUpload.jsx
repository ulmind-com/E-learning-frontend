import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Briefcase, Users, Clock, DollarSign, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://e-learning-backend-8avx.onrender.com/api';

const AdminInternshipUpload = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    internshipType: 'free',
    price: 0,
    maxStudents: 50,
    necessaryThings: '',
    thumbnail: '',
    active: true
  });

  useEffect(() => {
    fetchInternships();
  }, []);

  useEffect(() => {
    const navbar = document.querySelector('nav')?.parentElement;
    const footer = document.querySelector('footer');
    if (showModal) {
      document.body.style.overflow = 'hidden';
      if (navbar) navbar.style.display = 'none';
      if (footer) footer.style.display = 'none';
    } else {
      document.body.style.overflow = 'auto';
      if (navbar) navbar.style.display = 'flex';
      if (footer) footer.style.display = 'block';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
      if (navbar) navbar.style.display = 'flex';
      if (footer) footer.style.display = 'block';
    };
  }, [showModal]);

  const fetchInternships = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/internship/list`);
      setInternships(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataToUpload = new FormData();
    formDataToUpload.append('image', file);
    
    setUploadingImage(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      // FIXED: Endpoint changed to /upload/image for image uploads
      const { data } = await axios.post(`${API_URL}/upload/image`, formDataToUpload, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        }
      });
      // FIXED: Using imageUrl instead of url based on backend response
      setFormData(prev => ({ ...prev, thumbnail: data.imageUrl }));
    } catch (err) {
      console.error(err);
      setError('Failed to upload image. Make sure it is an image file.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (editingId) {
        await axios.put(`${API_URL}/internship/manage/${editingId}`, formData, config);
      } else {
        await axios.post(`${API_URL}/internship/manage`, formData, config);
      }
      
      setShowModal(false);
      resetForm();
      fetchInternships();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this internship?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/internship/manage/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchInternships();
      } catch (err) {
        alert('Failed to delete');
      }
    }
  };

  const editInternship = (internship) => {
    setFormData({
      title: internship.title,
      description: internship.description,
      duration: internship.duration,
      internshipType: internship.internshipType,
      price: internship.price || 0,
      maxStudents: internship.maxStudents,
      necessaryThings: internship.necessaryThings,
      thumbnail: internship.thumbnail,
      active: internship.active
    });
    setEditingId(internship._id);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      duration: '',
      internshipType: 'free',
      price: 0,
      maxStudents: 50,
      necessaryThings: '',
      thumbnail: '',
      active: true
    });
    setEditingId(null);
    setError('');
  };

  const openNewModal = () => {
    resetForm();
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020202] text-white relative font-sans">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="max-w-7xl mx-auto py-12 px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 pb-6 border-b border-white/10">
            <div>
              <div className="h-8 w-64 bg-white/10 rounded-lg mb-3 animate-pulse"></div>
              <div className="h-4 w-48 bg-white/5 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-40 bg-white/10 rounded-full mt-6 md:mt-0 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="relative flex flex-col p-6 rounded-2xl border border-white/10 bg-[#0a0a0a]" style={{ minHeight: '440px', animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite ${i * 0.15}s` }}>
                <div className="flex gap-1.5 mb-4">
                  <div className="w-3 h-3 rounded-full bg-white/10"></div>
                  <div className="w-3 h-3 rounded-full bg-white/10"></div>
                  <div className="w-3 h-3 rounded-full bg-white/10"></div>
                </div>
                <div className="w-full aspect-[16/9] rounded-xl bg-white/5 mb-5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full" style={{ animation: 'shimmer 2s infinite' }}></div>
                </div>
                <div className="flex flex-col flex-grow">
                   <div className="flex gap-2 mb-5 mt-2">
                      <div className="h-6 w-20 bg-white/5 rounded-full"></div>
                      <div className="h-6 w-24 bg-white/5 rounded-full"></div>
                   </div>
                   <div className="h-7 w-3/4 bg-white/10 rounded mb-4"></div>
                   
                   <div className="flex justify-between items-end mt-auto mb-8">
                      <div className="h-8 w-24 bg-white/10 rounded"></div>
                   </div>
                   <div className="h-11 w-40 bg-white/10 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white relative font-sans">
      
      {/* Very subtle background grid - No heavy glows */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-6 sm:px-8 lg:px-12 relative z-10 animate-fade-in">
        
        {/* Clean Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
              Manage Internships
            </h1>
            <p className="text-sm font-medium text-gray-500">
              Create and manage internship programs
            </p>
          </div>
          
          <button 
            onClick={openNewModal}
            className="mt-6 md:mt-0 btn-sweep flex items-center rounded-full font-bold transition-all duration-300 hover:-translate-y-0.5 px-6 py-2.5 text-[13px] cursor-pointer"
          >
            <div className="relative z-10 flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>New Internship</span>
            </div>
          </button>
        </div>

        {/* Grid of Internships */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.map((internship, index) => (
            <div
              key={internship._id}
              className="relative flex flex-col p-6 rounded-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,255,255,0.05)] group"
              style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', minHeight: '440px', animationFillMode: 'both', animation: `slideUp 0.4s ease-out ${index * 0.1}s both` }}
            >
              {/* Mac OS Window Controls */}
              <div className="flex items-center gap-1.5 mb-4">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27C93F] cursor-pointer hover:scale-150 transition-transform"></div>
              </div>

              {/* Thumbnail Image Container */}
              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-4">
                {internship.thumbnail ? (
                  <img
                    src={internship.thumbnail?.startsWith('/uploads') ? `${API_URL.replace('/api', '')}${internship.thumbnail}` : internship.thumbnail}
                    alt={internship.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div
                    className="w-full h-full relative"
                    style={{
                      background: 'linear-gradient(135deg, rgba(30,20,15,0.8) 0%, rgba(5,5,5,0.9) 100%)',
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
                    onClick={() => editInternship(internship)}
                    className="p-3 bg-[#E87C41] text-white rounded-full hover:scale-110 transition-transform shadow-[0_0_15px_rgba(232,124,65,0.5)] cursor-pointer"
                    title="Edit Internship"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(internship._id)}
                    className="p-3 bg-red-600 text-white rounded-full hover:scale-110 transition-transform shadow-[0_0_15px_rgba(239,68,68,0.5)] cursor-pointer"
                    title="Delete Internship"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                {!internship.active ? (
                  <div className="absolute top-3 left-3 bg-red-500/10 backdrop-blur-md text-red-500 text-[10px] font-bold px-2.5 py-1 rounded-md border border-red-500/20 uppercase tracking-widest flex items-center gap-1.5 z-20">
                    <AlertCircle className="h-3 w-3" /> Inactive
                  </div>
                ) : (
                  <div className="absolute top-3 left-3 bg-white/5 backdrop-blur-md text-gray-300 text-[10px] font-bold px-2.5 py-1 rounded-md border border-white/10 uppercase tracking-widest flex items-center gap-1.5 z-20">
                    <CheckCircle className="h-3 w-3" /> Active
                  </div>
                )}
              </div>

              {/* Tags and Students Metric Row */}
              <div className="flex justify-between items-start mb-4 mt-2">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3.5 py-1.5 rounded-full border border-white/20 text-white/70 text-[13px] bg-transparent flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> {internship.duration}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[13px] font-bold text-white/80 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 whitespace-nowrap shrink-0">
                  <Users className="h-4 w-4 shrink-0" />
                  <span className="whitespace-nowrap">{internship.maxStudents} Slots</span>
                </div>
              </div>
              
              {/* Title */}
              <h3 className="text-[22px] font-semibold mb-6 line-clamp-2 leading-tight text-white group-hover:text-white/80 transition-colors duration-300 tracking-wide">
                {internship.title}
              </h3>
                
              <div className="mt-auto">
                {/* Price Block */}
                <div className="flex items-end gap-2 mb-8">
                  <span className="text-white text-[22px] mb-0.5">Price</span>
                  {internship.internshipType === 'free' ? (
                    <span className="text-[28px] leading-none text-[#E87C41]">Free</span>
                  ) : (
                    <>
                      <span className="text-[28px] leading-none text-[#E87C41]">
                        ₹{internship.price}
                      </span>
                    </>
                  )}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => editInternship(internship)}
                  className="w-fit px-5 py-2.5 rounded-xl font-bold text-[15px] text-white border border-white/20 bg-transparent cursor-pointer flex items-center gap-2 group/btn btn-sweep-transparent hover:bg-white/5 transition-all"
                >
                  Manage Details <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
            <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-modal">
              
              <div className="flex justify-between items-center px-6 py-5 border-b border-white/10 bg-[#141414]">
                <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Internship' : 'Create Internship'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
                {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg flex items-center gap-2 font-medium"><AlertCircle className="h-4 w-4" /> {error}</div>}
                
                <form id="internship-form" onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Thumbnail Upload */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-300">Thumbnail Image</label>
                    <div className="border border-dashed border-white/20 rounded-xl p-6 text-center transition-all bg-[#111] hover:bg-[#161616]">
                      {formData.thumbnail ? (
                        <div className="relative inline-block w-full max-w-sm mx-auto">
                          <img 
                            src={formData.thumbnail?.startsWith('/uploads') ? `${API_URL.replace('/api', '')}${formData.thumbnail}` : formData.thumbnail} 
                            alt="Thumbnail" 
                            className="w-full h-40 object-cover rounded-lg border border-white/10"
                          />
                          <label className="absolute -top-3 -right-3 p-2 bg-white text-black rounded-full cursor-pointer shadow-md hover:scale-105 transition-transform">
                            <Edit2 className="h-4 w-4" />
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                          </label>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center cursor-pointer py-4">
                          <div className="p-3 rounded-full bg-white/5 mb-3">
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          </div>
                          <span className="font-medium text-sm text-gray-200">Click to upload thumbnail</span>
                          <span className="text-xs mt-1 text-gray-500">JPG, PNG up to 5MB</span>
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                      )}
                      {uploadingImage && (
                        <div className="mt-4 text-xs font-semibold flex items-center justify-center gap-2 text-orange-500">
                          <Loader2 className="h-3 w-3 animate-spin" /> Uploading...
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-300">Title</label>
                      <input type="text" name="title" required value={formData.title} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-white/10 bg-[#111] text-white text-sm outline-none focus:border-white/30 transition-colors" placeholder="e.g. Full Stack Developer Internship" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-300">Duration</label>
                      <input type="text" name="duration" required value={formData.duration} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-white/10 bg-[#111] text-white text-sm outline-none focus:border-white/30 transition-colors" placeholder="e.g. 3 Months, 6 Months" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-300">Description</label>
                    <textarea name="description" required rows="4" value={formData.description} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-white/10 bg-[#111] text-white text-sm outline-none focus:border-white/30 transition-colors resize-none" placeholder="Detailed description of the internship..."></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-300">Type</label>
                      <div className="relative">
                        <select name="internshipType" value={formData.internshipType} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-white/10 bg-[#111] text-white text-sm outline-none focus:border-white/30 transition-colors appearance-none">
                          <option value="free">Free</option>
                          <option value="paid">Paid</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                    </div>
                    {formData.internshipType === 'paid' && (
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-300">Price (₹)</label>
                        <input type="number" name="price" required min="0" value={formData.price} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-white/10 bg-[#111] text-white text-sm outline-none focus:border-white/30 transition-colors" />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-300">Max Students</label>
                      <input type="number" name="maxStudents" required min="1" value={formData.maxStudents} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-white/10 bg-[#111] text-white text-sm outline-none focus:border-white/30 transition-colors" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-300">Requirements / Necessary Things</label>
                    <input type="text" name="necessaryThings" required value={formData.necessaryThings} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-white/10 bg-[#111] text-white text-sm outline-none focus:border-white/30 transition-colors" placeholder="e.g. Basic HTML/CSS, Laptop with 8GB RAM" />
                  </div>

                  <label className="flex items-center space-x-3 cursor-pointer mt-2 w-max">
                    <div className="relative">
                      <input type="checkbox" name="active" checked={formData.active} onChange={handleInputChange} className="peer sr-only" />
                      <div className="w-10 h-5 bg-white/10 rounded-full peer peer-checked:bg-orange-500 transition-colors border border-white/5"></div>
                      <div className="absolute left-1 top-1 w-3 h-3 bg-gray-400 peer-checked:bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-300">Active (Visible to students)</span>
                  </label>
                </form>
              </div>

              <div className="px-6 py-5 border-t border-white/5 flex justify-end space-x-3 bg-[#141414]">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-lg border border-white/10 bg-transparent hover:bg-white/5 transition-colors text-sm font-semibold text-gray-300">Cancel</button>
                <button 
                  type="submit" 
                  form="internship-form" 
                  disabled={!formData.thumbnail || uploadingImage} 
                  className="px-5 py-2.5 rounded-lg text-black text-sm font-semibold transition-all disabled:opacity-50 bg-orange-500 hover:bg-orange-400 disabled:hover:bg-orange-500 shadow-sm"
                >
                  {editingId ? 'Update' : 'Publish'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

       <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.2);
        }
      `}} />
    </div>
  );
};

export default AdminInternshipUpload;
