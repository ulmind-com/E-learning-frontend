import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Video, Mic, MicOff, VideoOff, PhoneOff, MessageSquare, Send, Users, UserPlus, Smile, Maximize, Monitor, Minimize } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://e-learning-backend-1-r539.onrender.com/api';

const LiveClassRoom = () => {
  const { courseId, chapterId, liveClassId } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [peers, setPeers] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liveClass, setLiveClass] = useState(null);
  
  const [participants, setParticipants] = useState([]);
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [mediaRequest, setMediaRequest] = useState(false);
  const [grantedSet, setGrantedSet] = useState(new Set());
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // New UI states
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [showStudentsPanel, setShowStudentsPanel] = useState(false);

  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const streamRef = useRef(null);
  const screenTrackRef = useRef(null);
  const cameraTrackRef = useRef(null);
  const mainVideoContainerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    let socket = null;

    const initRoom = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const chapter = data.chapters.find(c => c._id === chapterId);
        if (!chapter) throw new Error('Chapter not found');
        const lClass = chapter.liveClasses.find(lc => lc._id === liveClassId);
        if (!lClass) throw new Error('Live class not found');
        
        setLiveClass(lClass);

        socket = io(API_URL.replace('/api', ''));
        socketRef.current = socket;
        
        if (isAdmin) {
          try {
            let localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            streamRef.current = localStream;
            if (userVideo.current) userVideo.current.srcObject = localStream;
          } catch(err) {
            console.error("Camera access denied or not found", err);
            try {
              let localStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
              streamRef.current = localStream;
              if (userVideo.current) userVideo.current.srcObject = localStream;
              setVideoEnabled(false);
            } catch (audioErr) {
              console.error("Microphone access denied too", audioErr);
            }
          }
        }

        socket.emit('join-room', liveClassId, { id: user._id || user.id, name: user.name, email: user.email, role: user.role });

        socket.on('force-disconnect', (msg) => {
          alert(msg);
          navigate('/');
        });

        socket.on('all-users', (users) => {
          setParticipants(users.filter(u => u != null));
          const peers = [];
          users.forEach(u => {
            if (u && u.socketId !== socket.id) {
              const peer = createPeer(u.socketId, socket.id, streamRef.current, socket);
              peersRef.current.push({
                peerID: u.socketId,
                peer,
                user: u
              });
              peers.push({
                peerID: u.socketId,
                peer,
                user: u
              });
            }
          });
          setPeers(peers);
        });

        socket.on('user-joined', (payload) => {
          const { signal, callerID, user: newUser } = payload;
          if (!newUser) return;
          // FIX: explicitly assign socketId so requests hit the right socket!
          newUser.socketId = callerID;
          setParticipants(prev => {
            const validPrev = prev.filter(p => p && p.socketId !== newUser.socketId);
            return [...validPrev, newUser];
          });
          const peer = addPeer(signal, callerID, streamRef.current, socket);
          peersRef.current.push({
            peerID: callerID,
            peer,
            user: newUser
          });
          setPeers(prev => [...prev, { peerID: callerID, peer, user: newUser }]);
        });

        socket.on('receiving-returned-signal', payload => {
          const item = peersRef.current.find(p => p.peerID === payload.id);
          if (item && !item.peer.destroyed) {
            try {
              item.peer.signal(payload.signal);
            } catch (err) {
              console.error("Error signaling peer:", err);
            }
          }
        });

        socket.on('user-disconnected', socketId => {
          setParticipants(prev => prev.filter(p => p && p.socketId !== socketId));
          const peerObj = peersRef.current.find(p => p.peerID === socketId);
          if (peerObj && !peerObj.peer.destroyed) {
            try { peerObj.peer.destroy(); } catch (e) {}
          }
          const peers = peersRef.current.filter(p => p.peerID !== socketId);
          peersRef.current = peers;
          setPeers(peers);
        });

        socket.on('chat-message', (msg) => {
          setChatMessages(prev => {
            if (prev.some(m => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
        });

        socket.on('grant-media', () => {
          if (!isAdmin) {
            setMediaRequest(true);
          }
        });

        socket.on('media-status-changed', (arr) => {
          setGrantedSet(new Set(arr));
        });

        socket.on('revoke-media', () => {
          if (!isAdmin) {
            if (streamRef.current) {
              streamRef.current.getTracks().forEach(track => track.stop());
              peersRef.current.forEach(p => {
                if (!p.peer.destroyed) {
                  try { p.peer.removeStream(streamRef.current); } catch(e) {}
                }
              });
              streamRef.current = null;
              if (userVideo.current) userVideo.current.srcObject = null;
            }
            setMicEnabled(false);
            setVideoEnabled(false);
          }
        });

        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to initialize live class');
        setLoading(false);
      }
    };

    initRoom();

    return () => {
      if (socket) socket.disconnect();
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
      peersRef.current = [];
    };
  }, [courseId, chapterId, liveClassId, isAdmin, token, user, navigate]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleGrantMedia = (socketId, userId) => {
    socketRef.current.emit('grant-media', socketId, userId, liveClassId);
  };

  const handleRevokeMedia = (socketId, userId) => {
    socketRef.current.emit('revoke-media', socketId, userId, liveClassId);
  };

  const acceptMediaRequest = async () => {
    setMediaRequest(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (userVideo.current) userVideo.current.srcObject = stream;
      setMicEnabled(true);
      setVideoEnabled(true);
      peersRef.current.forEach(p => {
        if (!p.peer.destroyed) {
          try { p.peer.addStream(stream); } catch(err) {}
        }
      });
    } catch(err) {
      console.error("Camera access denied", err);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
        streamRef.current = stream;
        if (userVideo.current) userVideo.current.srcObject = stream;
        setMicEnabled(true);
        setVideoEnabled(false);
        peersRef.current.forEach(p => {
          if (!p.peer.destroyed) {
            try { p.peer.addStream(stream); } catch(err2) {}
          }
        });
      } catch(audioErr) {
        alert("Could not access camera or microphone");
      }
    }
  };

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setMicEnabled(audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const createPeer = (userToSignal, callerID, stream, activeSocket) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
      offerOptions: {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      }
    });

    peer.on('signal', signal => {
      // FIX: ensure we send our own socketId so others can identify us
      if (activeSocket) activeSocket.emit('sending-signal', { userToSignal, callerID, signal, user: { ...user, socketId: activeSocket.id } });
    });

    return peer;
  };

  const addPeer = (incomingSignal, callerID, stream, activeSocket) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', signal => {
      if (activeSocket) activeSocket.emit('returning-signal', { signal, callerID });
    });

    peer.signal(incomingSignal);
    return peer;
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      stopScreenShare();
    } else {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        alert("Screen sharing is not supported on this browser or device.");
        return;
      }
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: "monitor" }, audio: false });
        const screenTrack = screenStream.getVideoTracks()[0];
        
        const currentVideoTrack = streamRef.current?.getVideoTracks()[0];
        cameraTrackRef.current = currentVideoTrack;
        
        peersRef.current.forEach(p => {
          if (!p.peer.destroyed) {
            if (currentVideoTrack) {
              try { p.peer.replaceTrack(currentVideoTrack, screenTrack, streamRef.current); } catch(err) { console.error(err); }
            } else {
              try { p.peer.addTrack(screenTrack, streamRef.current); } catch(err) { console.error(err); }
            }
          }
        });

        if (streamRef.current) {
            if (currentVideoTrack) {
               streamRef.current.removeTrack(currentVideoTrack);
            }
            streamRef.current.addTrack(screenTrack);
            if (userVideo.current) userVideo.current.srcObject = streamRef.current;
        }

        screenTrackRef.current = screenTrack;
        setIsScreenSharing(true);

        screenTrack.onended = () => {
          stopScreenShare();
        };
      } catch (err) {
        if (err.name !== 'NotAllowedError') {
          console.error("Error sharing screen", err);
          alert("Screen sharing failed: " + err.message);
        }
      }
    }
  };

  const stopScreenShare = () => {
    if (!isScreenSharing) return;

    const screenTrack = screenTrackRef.current;
    if (screenTrack) {
      screenTrack.stop();
    }

    const cameraTrack = cameraTrackRef.current;
    
    peersRef.current.forEach(p => {
      if (!p.peer.destroyed) {
        if (cameraTrack) {
          try { p.peer.replaceTrack(screenTrack, cameraTrack, streamRef.current); } catch(err) { console.error(err); }
        } else {
          try { p.peer.removeTrack(screenTrack, streamRef.current); } catch(err) { console.error(err); }
        }
      }
    });

    if (streamRef.current) {
        streamRef.current.removeTrack(screenTrack);
        if (cameraTrack) {
          streamRef.current.addTrack(cameraTrack);
        }
        if (userVideo.current) userVideo.current.srcObject = streamRef.current;
    }

    setIsScreenSharing(false);
    screenTrackRef.current = null;
    cameraTrackRef.current = null;
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = { id: Date.now() + Math.random().toString(36).substr(2, 9), text: chatInput, sender: user.name, time: new Date().toLocaleTimeString() };
    socketRef.current.emit('chat-message', liveClassId, msg);
    setChatInput('');
  };

  const toggleMainFullscreen = async (e) => {
    e.stopPropagation();
    if (!document.fullscreenElement) {
      if (mainVideoContainerRef.current) {
        try {
          await mainVideoContainerRef.current.requestFullscreen();
        } catch (err) {
          console.error(err);
        }
      }
    } else {
      document.exitFullscreen();
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">Loading Live Class...</div>;
  if (error) return <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white"><p className="text-red-500 mb-4">{error}</p><button onClick={() => navigate(-1)} className="bg-red-500 px-4 py-2 rounded">Go Back</button></div>;

  // Find the host peer
  const hostPeerObj = peers.find(p => p.user.role === 'admin');
  // Identify all students who have their media granted/active
  const studentPeersObj = peers.filter(p => p.user.role !== 'admin');

  return (
    <div className="h-[100dvh] bg-[#050505] flex flex-col overflow-hidden text-gray-100 font-sans relative">
      
      {/* Top Bar overlay */}
      <div className="absolute top-6 left-6 z-40 bg-black/50 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 flex items-center space-x-3 shadow-lg">
        <div className="h-2.5 w-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
        <h1 className="font-bold text-sm tracking-wide">{liveClass?.title}</h1>
      </div>

      {/* Main Big Video Area (Host) */}
      <div 
        ref={mainVideoContainerRef}
        className="flex-1 w-full h-full relative flex items-center justify-center overflow-hidden"
      >
        {isAdmin ? (
          // If local user is admin, their video is the main one
          <div className="w-full h-full relative group" onClick={toggleMainFullscreen}>
            <video muted ref={userVideo} autoPlay playsInline className={`w-full h-full object-cover transition-all duration-500 ${!videoEnabled ? 'hidden' : ''}`} />
            {!videoEnabled && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a]">
                <VideoOff className="h-20 w-20 mb-4 opacity-50" />
                <p className="text-lg font-semibold opacity-70">Camera is Off</p>
              </div>
            )}
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity z-50">
              <button className="p-3 bg-black/60 rounded-xl text-white hover:bg-black/80 transition-colors backdrop-blur-sm">
                {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </button>
            </div>
            <div className="absolute bottom-24 left-6 bg-black/60 px-4 py-2 rounded-xl text-sm font-bold tracking-wide backdrop-blur-sm z-30 flex items-center gap-2">
              <span>{user.name}</span> <span className="text-[#E87C41]">(Host - You)</span>
            </div>
          </div>
        ) : hostPeerObj ? (
          // If remote user is host, their video is the main one
          <div className="w-full h-full relative group cursor-pointer" onClick={toggleMainFullscreen}>
            <VideoPlayerCore peer={hostPeerObj.peer} user={hostPeerObj.user} isFullscreen={isFullscreen} />
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity z-50">
              <button className="p-3 bg-black/60 rounded-xl text-white hover:bg-black/80 transition-colors backdrop-blur-sm">
                {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </button>
            </div>
          </div>
        ) : (
          // Host hasn't joined yet
          <div className="flex flex-col items-center justify-center text-gray-500 w-full h-full">
            <Users className="h-20 w-20 mb-4 opacity-30" />
            <p className="text-lg font-semibold tracking-wide">Waiting for Host to join...</p>
          </div>
        )}

        {/* Small Videos Strip (Students) placed just above the controls inside the main area */}
        <div className="absolute bottom-6 right-6 left-6 z-20 flex justify-end">
          <div className="flex space-x-4 overflow-x-auto custom-scrollbar pb-2 items-end">
            {!isAdmin && (
              <div className="relative w-40 h-28 shrink-0 rounded-2xl overflow-hidden bg-gray-900 border border-white/20 shadow-2xl transition-all">
                <video muted ref={userVideo} autoPlay playsInline className={`w-full h-full object-cover ${!videoEnabled ? 'hidden' : ''}`} />
                {!videoEnabled && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
                     <p className="text-xs font-semibold px-2 text-center break-words w-full">{user.name}</p>
                     <p className="text-[10px] opacity-60">{!streamRef.current ? 'Listening...' : 'Camera Off'}</p>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] text-white">You</div>
                {streamRef.current && (
                   <div className="absolute top-2 right-2 flex space-x-1">
                     {!micEnabled && <div className="p-1 bg-red-500/80 rounded-full"><MicOff className="h-3 w-3 text-white" /></div>}
                     {!videoEnabled && <div className="p-1 bg-red-500/80 rounded-full"><VideoOff className="h-3 w-3 text-white" /></div>}
                   </div>
                )}
              </div>
            )}
            
            {studentPeersObj.map(pObj => (
              <div key={pObj.user.id} className="relative w-40 h-28 shrink-0 rounded-2xl overflow-hidden bg-gray-900 border border-white/10 shadow-xl">
                 <VideoPlayerCore peer={pObj.peer} user={pObj.user} isStudent={true} isGranted={grantedSet.has(pObj.user.id)} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="h-20 bg-[#050505] border-t border-white/10 flex items-center justify-between px-8 z-50 shrink-0 relative">
        <div className="w-1/3 flex items-center">
           <span className="text-xs text-gray-400 font-medium">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} | {liveClass?.title}</span>
        </div>

        <div className="w-1/3 flex items-center justify-center space-x-4">
          {(isAdmin || streamRef.current) && (
            <>
              <button onClick={toggleMic} className={`h-12 w-12 rounded-full flex items-center justify-center transition-all shadow-lg ${micEnabled ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`} title={micEnabled ? "Mute" : "Unmute"}>
                {micEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </button>
              <button onClick={toggleVideo} className={`h-12 w-12 rounded-full flex items-center justify-center transition-all shadow-lg ${videoEnabled ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`} title={videoEnabled ? "Stop Video" : "Start Video"}>
                {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </button>
              <button onClick={toggleScreenShare} className={`hidden md:flex h-12 w-12 rounded-full items-center justify-center transition-all shadow-lg ${isScreenSharing ? 'bg-[#E87C41] hover:bg-[#d57039] text-black' : 'bg-white/10 hover:bg-white/20 text-white'}`} title="Share Screen">
                <Monitor className="h-5 w-5" />
              </button>
            </>
          )}
          <button onClick={() => navigate(-1)} className="h-12 w-16 rounded-[16px] bg-red-500 flex items-center justify-center hover:bg-red-600 transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)]" title="Leave">
            <PhoneOff className="h-5 w-5 text-white" />
          </button>
        </div>

        <div className="w-1/3 flex items-center justify-end space-x-3">
           {isAdmin && (
             <button 
                onClick={() => setShowStudentsPanel(!showStudentsPanel)} 
                className={`h-11 px-4 rounded-xl flex items-center space-x-2 transition-all font-semibold text-sm ${showStudentsPanel ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
              >
                <Users className="h-4 w-4" />
                <span>Participants ({participants.length})</span>
             </button>
           )}
           <button 
              onClick={() => setShowChatPanel(!showChatPanel)} 
              className={`h-11 w-11 rounded-xl flex items-center justify-center transition-all relative ${showChatPanel ? 'bg-[#E87C41] text-black shadow-[0_0_15px_rgba(232,124,65,0.4)]' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
              title="Chat"
            >
              <MessageSquare className="h-5 w-5" />
           </button>
        </div>
      </div>

      {/* Slide-in Chat Panel */}
      <div className={`absolute top-0 right-0 h-[calc(100dvh-80px)] w-80 sm:w-96 bg-[#0a0a0a]/95 backdrop-blur-xl border-l border-white/10 flex flex-col z-40 transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-2xl ${showChatPanel ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#E87C41]/20 rounded-lg">
              <MessageSquare className="h-4 w-4 text-[#E87C41]" />
            </div>
            <h2 className="font-bold text-white tracking-wide">Live Chat</h2>
          </div>
          <button onClick={() => setShowChatPanel(false)} className="text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-lg">
             <span className="text-lg leading-none block">&times;</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.sender === user.name ? 'items-end' : 'items-start'}`}>
              <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest mb-1.5">{msg.sender} • {msg.time}</span>
              <div className={`px-4 py-3 rounded-2xl max-w-[85%] text-[13px] leading-relaxed shadow-sm ${msg.sender === user.name ? 'bg-gradient-to-br from-[#E87C41] to-[#d26b34] text-black rounded-br-sm' : 'bg-white/10 text-gray-200 rounded-bl-sm border border-white/5'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="p-4 border-t border-white/5 bg-[#050505] flex items-center space-x-3 relative">
          {showEmojiPicker && (
            <div className="absolute bottom-full right-4 mb-2 z-50 bg-[#111] border border-white/10 rounded-xl p-2 shadow-2xl">
              <div className="flex justify-end mb-1">
                <button type="button" onClick={() => setShowEmojiPicker(false)} className="text-gray-400 hover:text-white text-lg">&times;</button>
              </div>
              <EmojiPicker onEmojiClick={(e) => setChatInput(prev => prev + e.emoji)} theme="dark" />
            </div>
          )}
          <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-gray-400 hover:text-yellow-500 transition-colors bg-white/5 p-2.5 rounded-xl">
            <Smile className="h-5 w-5" />
          </button>
          <input 
            type="text" 
            value={chatInput} 
            onChange={e => setChatInput(e.target.value)} 
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E87C41]/50 focus:ring-1 focus:ring-[#E87C41]/50 text-white placeholder-gray-500 transition-all" 
            placeholder="Type a message..." 
          />
          <button type="submit" className="p-2.5 bg-[#E87C41] text-black rounded-xl hover:bg-[#d57039] transition-colors shadow-lg">
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>

      {/* Slide-in Students Panel (Admin Only) */}
      {isAdmin && (
        <div className={`absolute top-0 right-0 h-[calc(100dvh-80px)] w-80 sm:w-96 bg-[#0a0a0a]/95 backdrop-blur-xl border-l border-white/10 flex flex-col z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-2xl ${showStudentsPanel ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Users className="h-4 w-4 text-blue-400" />
              </div>
              <h2 className="font-bold text-white tracking-wide">Manage Students</h2>
            </div>
            <button onClick={() => setShowStudentsPanel(false)} className="text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-lg">
               <span className="text-lg leading-none block">&times;</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {Array.from(new Map(participants.filter(p => p && p.role !== 'admin').map(p => [p.id, p])).values()).map((p) => (
              <div key={p.socketId} className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center group hover:bg-white/10 transition-colors">
                <div>
                  <h4 className="text-sm font-bold text-white line-clamp-1 tracking-wide">{p.name}</h4>
                  <p className="text-[11px] text-gray-500 line-clamp-1">{p.email}</p>
                </div>
                {grantedSet.has(p.id) ? (
                  <button onClick={() => handleRevokeMedia(p.socketId, p.id)} title="Revoke Camera/Mic" className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors border border-red-500/20">
                    <PhoneOff className="h-4 w-4" />
                  </button>
                ) : (
                  <button onClick={() => handleGrantMedia(p.socketId, p.id)} title="Ask to Turn on Camera/Mic" className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-colors border border-blue-500/20">
                    <UserPlus className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            {participants.filter(p => p && p.role !== 'admin').length === 0 && (
              <div className="text-center text-gray-500 text-sm py-10">No students have joined yet.</div>
            )}
          </div>
        </div>
      )}

      {/* Media Request Modal */}
      {mediaRequest && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-[#111] border border-white/10 p-8 rounded-[24px] max-w-md w-full shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                 <Video className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 text-center">Media Request</h3>
            <p className="text-gray-400 mb-8 text-center text-sm leading-relaxed">The Host has invited you to turn on your camera and microphone. Would you like to accept?</p>
            <div className="flex justify-center space-x-4">
              <button onClick={() => setMediaRequest(false)} className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/5">Decline</button>
              <button onClick={acceptMediaRequest} className="flex-1 px-4 py-3 rounded-xl font-bold bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.4)]">Accept</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const VideoPlayerCore = ({ peer, user, isFullscreen, isStudent, isGranted }) => {
  const ref = useRef();
  const [hasStream, setHasStream] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);

  const effectiveHasStream = hasStream && (isGranted === undefined || isGranted === true || user.role === 'admin');

  useEffect(() => {
    if (!peer) return;
    const handleStream = (stream) => {
      ref.current.srcObject = stream;
      setHasStream(true);
      setHasVideo(stream.getVideoTracks().length > 0 && stream.getVideoTracks()[0].enabled);
    };
    peer.on('stream', handleStream);
    peer.on('track', (track, stream) => handleStream(stream));
    return () => peer.off('stream', handleStream);
  }, [peer]);

  const showCameraOff = user.role === 'admin' && (!effectiveHasStream || !hasVideo);

  return (
    <>
      <video playsInline autoPlay ref={ref} className={`w-full h-full object-cover ${(showCameraOff || (!effectiveHasStream && user.role !== 'admin')) ? 'hidden' : ''}`} />
      
      {showCameraOff && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] z-10">
          <VideoOff className="h-16 w-16 mb-4 opacity-40" />
          <p className="text-lg font-semibold opacity-60 tracking-wide">Host Camera Off</p>
        </div>
      )}

      {!effectiveHasStream && user.role !== 'admin' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10">
          <p className="text-xs font-semibold px-2 text-center break-words w-full text-white">{user.name}</p>
          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">Listening...</p>
        </div>
      )}

      {(effectiveHasStream || user.role === 'admin') && (
        <div className={`absolute ${isStudent ? 'bottom-2 left-2 px-2 py-0.5 text-[10px]' : 'bottom-6 left-6 px-4 py-2 text-sm'} bg-black/60 rounded-xl font-bold tracking-wide backdrop-blur-sm z-30 flex items-center gap-2 text-white`}>
          <span>{user.name}</span>
          {user.role === 'admin' && <span className="text-[#E87C41]">(Host)</span>}
        </div>
      )}
    </>
  );
};

export default LiveClassRoom;
