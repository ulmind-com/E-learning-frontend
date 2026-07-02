import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
import { generateInvoice } from '../utils/generateInvoice';
import { Camera, Save, Loader2, User, Mail, Phone, Building, MapPin, LogOut, X, Edit2, ShoppingBag, Download, CreditCard, Calendar } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'https://e-learning-backend-8avx.onrender.com/api';

const Settings = () => {
  const { user, token, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    college: '',
    state: '',
    profileImage: '',
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isEditing, setIsEditing] = useState(false);

  // Purchases state
  const [purchases, setPurchases] = useState([]);
  const [fetchingPurchases, setFetchingPurchases] = useState(true);

  // Cropper state
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        college: user.college || '',
        state: user.state || '',
        profileImage: user.profileImage || '',
      });
      fetchPurchases();
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchPurchases = async () => {
    try {
      setFetchingPurchases(true);
      const { data } = await axios.get(`${API_URL}/payment/user-purchases`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPurchases(data);
    } catch (err) {
      console.error('Failed to fetch purchases', err);
    } finally {
      setFetchingPurchases(false);
    }
  };

  const handleDownloadInvoice = (purchase) => {
    generateInvoice(purchase, user);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageToCrop(reader.result);
        setShowCropModal(true);
      });
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropAndUpload = async () => {
    try {
      setUploading(true);
      setMessage({ type: '', text: '' });
      
      const croppedImageBlob = await getCroppedImg(
        imageToCrop,
        croppedAreaPixels
      );

      const imgData = new FormData();
      imgData.append('image', croppedImageBlob, 'profile.jpg');

      const { data } = await axios.post(`${API_URL}/upload/image`, imgData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      const newImageUrl = data.imageUrl || data.documentUrl || data.url;

      setFormData((prev) => ({ ...prev, profileImage: newImageUrl }));
      
      const { data: updatedUser } = await axios.put(
        `${API_URL}/users/profile`,
        {
          name: formData.name,
          mobile: formData.mobile,
          college: formData.college,
          state: formData.state,
          profileImage: newImageUrl
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      updateUser(updatedUser);
      setMessage({ type: 'success', text: 'Profile picture updated successfully' });
      setShowCropModal(false);
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Failed to upload profile picture' });
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { data } = await axios.put(
        `${API_URL}/users/profile`,
        {
          name: formData.name,
          mobile: formData.mobile,
          college: formData.college,
          state: formData.state,
          profileImage: formData.profileImage
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      updateUser(data);
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen py-24 px-6 relative" style={{ backgroundColor: '#050505' }}>
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#E87C41] opacity-5 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-2" style={{ color: 'white' }}>Account Settings</h1>
        <p className="text-gray-400 mb-10">Manage your profile, preferences, and purchases.</p>

        {/* Custom Tabs */}
        <div className="flex space-x-2 mb-8 bg-[#111] p-1.5 rounded-2xl w-fit border border-white/5">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-[#E87C41] text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('purchases')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'purchases' ? 'bg-[#E87C41] text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-4 w-4" />
              <span>Purchases</span>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Profile Sidebar */}
          <div className="md:col-span-1">
            <div className="rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden h-full" style={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="relative group cursor-pointer mb-6">
                <div className="w-36 h-36 rounded-full overflow-hidden border-[4px] border-[#E87C41] shadow-[0_0_30px_rgba(232,124,65,0.3)] transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_0_40px_rgba(232,124,65,0.5)]">
                  {formData.profileImage ? (
                    <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center text-5xl font-bold transition-transform duration-500 group-hover:scale-110" style={{ color: '#E87C41' }}>
                      {formData.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                <label className="absolute bottom-2 right-2 bg-[#E87C41] w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform border-2 border-[#111] z-10">
                  {uploading ? (
                    <Loader2 className="h-5 w-5 text-white animate-spin" />
                  ) : (
                    <Camera className="h-5 w-5 text-white" />
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={onFileSelect} disabled={uploading} />
                </label>
              </div>
              <h3 className="text-2xl font-black text-white text-center mb-1">{formData.name}</h3>
              <p className="text-sm text-[#E87C41] mt-1 text-center font-bold tracking-widest uppercase mb-8">{user.role}</p>
              
              <div className="w-full h-px bg-white/10 mb-6"></div>
              
              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white transition-all duration-300 border border-red-500/20 hover:border-red-500">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-2">
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="rounded-3xl p-8" style={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Personal Information</h2>
                  {!isEditing && (
                    <button 
                      onClick={() => setIsEditing(true)} 
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-white/5 hover:bg-[#E87C41] transition-all border border-white/10 hover:border-[#E87C41]"
                    >
                      <Edit2 className="h-4 w-4" /> <span>Edit Profile</span>
                    </button>
                  )}
                </div>

                {message.text && (
                  <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                        <User className="h-4 w-4" /> Full Name
                      </label>
                      {isEditing ? (
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E87C41] transition-all" style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                      ) : (
                        <div className="w-full px-4 py-3 rounded-xl text-white" style={{ backgroundColor: '#1a1a1a', border: '1px solid transparent' }}>{formData.name || '-'}</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                        <Mail className="h-4 w-4" /> Email Address
                      </label>
                      {isEditing ? (
                        <input type="email" name="email" value={formData.email} disabled className="w-full px-4 py-3 rounded-xl focus:outline-none cursor-not-allowed opacity-70" style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af' }} />
                      ) : (
                        <div className="w-full px-4 py-3 rounded-xl text-gray-400" style={{ backgroundColor: '#1a1a1a', border: '1px solid transparent' }}>{formData.email}</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                        <Phone className="h-4 w-4" /> Mobile Number
                      </label>
                      {isEditing ? (
                        <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="+91 9876543210" className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E87C41] transition-all" style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                      ) : (
                        <div className="w-full px-4 py-3 rounded-xl text-white" style={{ backgroundColor: '#1a1a1a', border: '1px solid transparent' }}>{formData.mobile || '-'}</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> State / Region
                      </label>
                      {isEditing ? (
                        <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="West Bengal" className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E87C41] transition-all" style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                      ) : (
                        <div className="w-full px-4 py-3 rounded-xl text-white" style={{ backgroundColor: '#1a1a1a', border: '1px solid transparent' }}>{formData.state || '-'}</div>
                      )}
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                        <Building className="h-4 w-4" /> College / University
                      </label>
                      {isEditing ? (
                        <input type="text" name="college" value={formData.college} onChange={handleChange} placeholder="Where do you study?" className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E87C41] transition-all" style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                      ) : (
                        <div className="w-full px-4 py-3 rounded-xl text-white" style={{ backgroundColor: '#1a1a1a', border: '1px solid transparent' }}>{formData.college || '-'}</div>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="pt-4 flex justify-end space-x-4">
                      <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 rounded-xl font-bold text-white bg-white/5 hover:bg-white/10 transition-colors">Cancel</button>
                      <button type="submit" disabled={loading || uploading} className="flex items-center space-x-2 px-8 py-3 rounded-xl font-bold text-white transition-all duration-300 shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0" style={{ backgroundColor: '#E87C41', backgroundImage: 'linear-gradient(to right, #E87C41, #d26733)' }}>
                        {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> <span>Saving...</span></> : <><Save className="h-5 w-5" /> <span>Save Changes</span></>}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* PURCHASES TAB */}
            {activeTab === 'purchases' && (
              <div className="rounded-3xl p-8" style={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h2 className="text-xl font-bold text-white mb-6">Order History</h2>
                
                {fetchingPurchases ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="w-8 h-8 text-[#E87C41] animate-spin" />
                  </div>
                ) : purchases.length === 0 ? (
                  <div className="text-center py-12 bg-[#1a1a1a] rounded-2xl border border-white/5">
                    <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">No purchases yet</h3>
                    <p className="text-gray-400 text-sm mb-6">You haven't bought any courses.</p>
                    <Link to="/courses" className="inline-flex px-6 py-3 rounded-xl font-bold text-white bg-[#E87C41] hover:bg-[#d66a30] transition-colors">
                      Browse Courses
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {purchases.map((purchase) => (
                      <div key={purchase._id} className="bg-[#1a1a1a] rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all group">
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-[#222]">
                              {purchase.course?.thumbnail && (
                                <img src={purchase.course.thumbnail} alt="Course" className="w-full h-full object-cover" />
                              )}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-white mb-1 leading-tight group-hover:text-[#E87C41] transition-colors">{purchase.course?.title || 'Unknown Course'}</h3>
                              <div className="flex items-center gap-4 text-xs font-medium text-gray-400 mt-2">
                                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(purchase.createdAt).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1"><CreditCard className="w-3.5 h-3.5" /> {purchase.razorpayPaymentId || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between shrink-0 border-t border-white/5 sm:border-0 pt-4 sm:pt-0">
                            <div className="text-xl font-black text-white">₹{purchase.amount}</div>
                            <button 
                              onClick={() => handleDownloadInvoice(purchase)}
                              className="flex items-center gap-1.5 text-sm font-bold text-[#E87C41] hover:text-white bg-[#E87C41]/10 hover:bg-[#E87C41] px-4 py-2 rounded-lg transition-all mt-0 sm:mt-2"
                            >
                              <Download className="w-4 h-4" /> Invoice
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#111] border border-white/10 p-6 rounded-3xl w-full max-w-md relative animate-scale-in shadow-2xl">
            <button onClick={() => setShowCropModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold text-white mb-6">Adjust Profile Picture</h3>
            
            <div className="relative w-full h-72 bg-black rounded-2xl overflow-hidden mb-6 border border-white/5">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            
            <div className="flex flex-col gap-2 mb-8 px-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-400">Zoom</label>
                <span className="text-xs text-[#E87C41] font-bold">{Math.round(zoom * 100)}%</span>
              </div>
              <input 
                type="range" value={zoom} min={1} max={3} step={0.01}
                onChange={(e) => setZoom(e.target.value)} 
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#E87C41]"
              />
            </div>
            
            <div className="flex gap-4">
              <button onClick={() => setShowCropModal(false)} className="flex-1 py-3 rounded-xl text-white font-bold bg-white/5 hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={handleCropAndUpload} disabled={uploading} className="flex-1 py-3 rounded-xl text-white font-bold bg-[#E87C41] hover:bg-[#d66a30] transition-colors flex justify-center items-center gap-2 shadow-[0_4px_14px_rgba(232,124,65,0.4)]">
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Picture'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
