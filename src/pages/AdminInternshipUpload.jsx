import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Briefcase, Users, Clock, DollarSign, List, CheckCircle, AlertCircle } from 'lucide-react';
import PremiumBg from '../components/PremiumBg';

const API_URL = 'https://e-learning-backend-1-r539.onrender.com/api';

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
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`${API_URL}/upload`, formDataToUpload, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        }
      });
      setFormData(prev => ({ ...prev, thumbnail: data.url }));
    } catch (err) {
      setError('Failed to upload image');
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

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10">
      <PremiumBg />
      <div className="flex justify-between items-center mb-8 relative z-10">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Manage Internships</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>Create and manage internship programs</p>
        </div>
        <button 
          onClick={openNewModal}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-white font-bold transition-transform hover:-translate-y-1 shadow-lg"
          style={{ backgroundColor: 'var(--accent)', boxShadow: '0 4px 15px var(--accent-glow)' }}
        >
          <Plus className="h-5 w-5" />
          <span>New Internship</span>
        </button>
      </div>

      {/* Grid of Internships */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {internships.map(internship => (
          <div key={internship._id} className="rounded-2xl border overflow-hidden flex flex-col transition-shadow hover:shadow-xl group" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <div className="h-48 overflow-hidden relative border-b" style={{ borderColor: 'var(--border-color)' }}>
              <img 
                src={internship.thumbnail?.startsWith('/uploads') ? `${API_URL.replace('/api', '')}${internship.thumbnail}` : internship.thumbnail} 
                alt={internship.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              {!internship.active && (
                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">INACTIVE</div>
              )}
            </div>
            
            <div className="p-5 flex-grow flex flex-col">
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{internship.title}</h3>
              <p className="text-sm line-clamp-2 mb-4" style={{ color: 'var(--text-muted)' }}>{internship.description}</p>
              
              <div className="grid grid-cols-2 gap-3 text-sm mt-auto mb-5" style={{ color: 'var(--text-secondary)' }}>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" style={{ color: 'var(--accent)' }}/> <span>{internship.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" style={{ color: 'var(--accent)' }}/> <span>{internship.maxStudents} Slots</span>
                </div>
                <div className="flex items-center space-x-2 col-span-2">
                  <DollarSign className="h-4 w-4" style={{ color: 'var(--accent)' }}/> 
                  <span className="font-bold text-white">{internship.internshipType === 'free' ? 'Free' : `Rs.${internship.price}`}</span>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <button 
                  onClick={() => editInternship(internship)}
                  className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg border font-medium hover:bg-[var(--bg-input)] transition-colors"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                >
                  <Edit2 className="h-4 w-4" /> <span>Edit</span>
                </button>
                <button 
                  onClick={() => handleDelete(internship._id)}
                  className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="h-4 w-4" /> <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border" style={{ borderColor: 'var(--border-color)' }}>
            
            <div className="flex justify-between items-center p-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <h2 className="text-2xl font-bold">{editingId ? 'Edit Internship' : 'Create Internship'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[var(--bg-input)] rounded-full transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
              {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-500 rounded-lg flex items-center gap-2"><AlertCircle className="h-5 w-5" /> {error}</div>}
              
              <form id="internship-form" onSubmit={handleSubmit} className="space-y-6">
                
                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Thumbnail Image</label>
                  <div className="border-2 border-dashed rounded-xl p-6 text-center transition-colors hover:border-[var(--accent)]" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-input)' }}>
                    {formData.thumbnail ? (
                      <div className="relative inline-block w-full max-w-sm">
                        <img 
                          src={formData.thumbnail?.startsWith('/uploads') ? `${API_URL.replace('/api', '')}${formData.thumbnail}` : formData.thumbnail} 
                          alt="Thumbnail" 
                          className="w-full h-40 object-cover rounded-lg shadow-md"
                        />
                        <label className="absolute -top-3 -right-3 p-2 bg-[var(--accent)] text-white rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform">
                          <Edit2 className="h-4 w-4" />
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center cursor-pointer">
                        <div className="p-4 rounded-full bg-[var(--bg-primary)] mb-3">
                          <ImageIcon className="h-8 w-8 text-[var(--accent)]" />
                        </div>
                        <span className="font-medium">Click to upload thumbnail</span>
                        <span className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>JPG, PNG up to 5MB</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                      </label>
                    )}
                    {uploadingImage && <div className="mt-4 text-sm font-medium flex items-center justify-center gap-2" style={{ color: 'var(--accent)' }}><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</div>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input type="text" name="title" required value={formData.title} onChange={handleInputChange} className="w-full p-3 rounded-xl border bg-[var(--bg-input)] outline-none focus:border-[var(--accent)] transition-colors" style={{ borderColor: 'var(--border-color)' }} placeholder="e.g. Full Stack Developer Internship" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Duration</label>
                    <input type="text" name="duration" required value={formData.duration} onChange={handleInputChange} className="w-full p-3 rounded-xl border bg-[var(--bg-input)] outline-none focus:border-[var(--accent)] transition-colors" style={{ borderColor: 'var(--border-color)' }} placeholder="e.g. 3 Months, 6 Months" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea name="description" required rows="4" value={formData.description} onChange={handleInputChange} className="w-full p-3 rounded-xl border bg-[var(--bg-input)] outline-none focus:border-[var(--accent)] transition-colors" style={{ borderColor: 'var(--border-color)' }} placeholder="Detailed description of the internship..."></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <select name="internshipType" value={formData.internshipType} onChange={handleInputChange} className="w-full p-3 rounded-xl border bg-[var(--bg-input)] outline-none focus:border-[var(--accent)] transition-colors" style={{ borderColor: 'var(--border-color)' }}>
                      <option value="free">Free</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>
                  {formData.internshipType === 'paid' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Price (Rs)</label>
                      <input type="number" name="price" required min="0" value={formData.price} onChange={handleInputChange} className="w-full p-3 rounded-xl border bg-[var(--bg-input)] outline-none focus:border-[var(--accent)] transition-colors" style={{ borderColor: 'var(--border-color)' }} />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Students</label>
                    <input type="number" name="maxStudents" required min="1" value={formData.maxStudents} onChange={handleInputChange} className="w-full p-3 rounded-xl border bg-[var(--bg-input)] outline-none focus:border-[var(--accent)] transition-colors" style={{ borderColor: 'var(--border-color)' }} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Requirements / Necessary Things</label>
                  <input type="text" name="necessaryThings" required value={formData.necessaryThings} onChange={handleInputChange} className="w-full p-3 rounded-xl border bg-[var(--bg-input)] outline-none focus:border-[var(--accent)] transition-colors" style={{ borderColor: 'var(--border-color)' }} placeholder="e.g. Basic HTML/CSS, Laptop with 8GB RAM" />
                </div>

                <label className="flex items-center space-x-3 cursor-pointer mt-4">
                  <div className="relative">
                    <input type="checkbox" name="active" checked={formData.active} onChange={handleInputChange} className="peer sr-only" />
                    <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-[var(--accent)] transition-colors"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </div>
                  <span className="font-medium">Active (Visible to students)</span>
                </label>
              </form>
            </div>

            <div className="p-6 border-t flex justify-end space-x-4 bg-[var(--bg-secondary)]" style={{ borderColor: 'var(--border-color)' }}>
              <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 rounded-xl border hover:bg-[var(--bg-input)] transition-colors font-medium" style={{ borderColor: 'var(--border-color)' }}>Cancel</button>
              <button type="submit" form="internship-form" disabled={!formData.thumbnail || uploadingImage} className="px-6 py-2.5 rounded-xl text-white font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: 'var(--accent)' }}>
                {editingId ? 'Update Internship' : 'Publish Internship'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInternshipUpload;
