import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Video, Mic, MicOff, VideoOff, PhoneOff, MessageSquare, Send, Users, UserPlus, Smile, Maximize, Monitor } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

const API_URL = 'https://e-learning-backend-1-r539.onrender.com/api';

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
  const [showFullscreenChat, setShowFullscreenChat] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const streamRef = useRef(null);
  const screenTrackRef = useRef(null);
  const cameraTrackRef = useRef(null);

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

        socket = io('https://e-learning-backend-1-r539.onrender.com');
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
      if (activeSocket) activeSocket.emit('sending-signal', { userToSignal, callerID, signal, user });
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
        console.error("Error sharing screen", err);
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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading Live Class...</div>;
  if (error) return <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white"><p className="text-red-500 mb-4">{error}</p><button onClick={() => navigate(-1)} className="bg-red-500 px-4 py-2 rounded">Go Back</button></div>;

  return (
    <div className="h-screen bg-gray-950 flex overflow-hidden text-gray-100 font-sans">
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col relative">
        <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center space-x-2">
          <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
          <h1 className="font-bold">{liveClass?.title}</h1>
        </div>

        <div className="flex-1 p-4 flex flex-wrap gap-4 items-start justify-center h-full overflow-y-auto content-start custom-scrollbar pt-16">
          {/* Local User Video */}
          <div className={`relative rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 flex items-center justify-center transition-all duration-300 ${streamRef.current || isAdmin ? 'w-full lg:w-[calc(50%-1rem)] aspect-video shadow-lg' : 'w-32 h-24 border-dashed opacity-70'}`}>
            <video muted ref={userVideo} autoPlay playsInline className={`w-full h-full object-cover ${(!streamRef.current && !isAdmin) ? 'hidden' : ''}`} />
            {!streamRef.current && (
              <div className="flex flex-col items-center justify-center text-gray-500">
                {!isAdmin && <p className="text-xs font-semibold px-2 text-center break-words w-full">{user.name}</p>}
                {!isAdmin && <p className="text-[10px] opacity-60">Listening...</p>}
                {isAdmin && <VideoOff className="h-16 w-16 mb-2 opacity-50" />}
                {isAdmin && <p className="text-sm font-semibold">Camera Off</p>}
              </div>
            )}
            <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-lg text-sm">{user.name} (You)</div>
            {(isAdmin || streamRef.current) && (
              <div className="absolute top-4 right-4 bg-black/60 px-2 py-1 rounded-lg flex space-x-2">
                {!micEnabled && <MicOff className="h-4 w-4 text-red-500" />}
                {!videoEnabled && <VideoOff className="h-4 w-4 text-red-500" />}
              </div>
            )}
          </div>

          {/* Remote Peers Video */}
          {Array.from(new Map(peers.filter(p => String(p.user.id) !== String(user._id || user.id)).map(p => [p.user.id, p])).values()).map((peerObj) => (
            <VideoPlayer 
              key={peerObj.user.id} 
              peer={peerObj.peer} 
              user={peerObj.user} 
              isLocalUser={false}
              isGranted={grantedSet.has(peerObj.user.id)}
              chatProps={{
                chatMessages,
                chatInput,
                setChatInput,
                sendMessage,
                showEmojiPicker,
                setShowEmojiPicker,
                currentUser: user
              }}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="h-20 bg-gray-900 border-t border-gray-800 flex items-center justify-center space-x-6 z-10">
          {(isAdmin || streamRef.current) && (
            <>
              <button onClick={toggleMic} className={`h-12 w-12 rounded-full flex items-center justify-center transition ${micEnabled ? 'bg-gray-800 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'}`}>
                {micEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </button>
              <button onClick={toggleVideo} className={`h-12 w-12 rounded-full flex items-center justify-center transition ${videoEnabled ? 'bg-gray-800 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'}`}>
                {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </button>
              <button onClick={toggleScreenShare} className={`h-12 w-12 rounded-full flex items-center justify-center transition ${isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-700'}`} title="Share Screen">
                <Monitor className="h-5 w-5" />
              </button>
            </>
          )}
          <button onClick={() => navigate(-1)} className="h-12 w-12 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-700 transition"><PhoneOff className="h-5 w-5" /></button>
        </div>
      </div>

      {/* Sidebar (Admin Participants & Chat) */}
      <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col z-20">
        {isAdmin && (() => {
          const uniqueStudents = Array.from(new Map(participants.filter(p => p && p.role !== 'admin').map(p => [p.id, p])).values());
          return (
            <div className="flex-1 flex flex-col border-b border-gray-800 h-1/2">
              <div className="p-4 border-b border-gray-800 flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-400" />
                <h2 className="font-bold">Students ({uniqueStudents.length})</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {uniqueStudents.map((p) => (
                  <div key={p.socketId} className="bg-gray-800 p-3 rounded-xl border border-gray-700 flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-semibold text-white line-clamp-1">{p.name}</h4>
                      <p className="text-xs text-gray-400 line-clamp-1">{p.email}</p>
                    </div>
                    {grantedSet.has(p.id) ? (
                      <button onClick={() => handleRevokeMedia(p.socketId, p.id)} title="Remove from Call" className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/40 transition">
                        <PhoneOff className="h-4 w-4" />
                      </button>
                    ) : (
                      <button onClick={() => handleGrantMedia(p.socketId, p.id)} title="Turn on Camera/Mic" className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/40 transition">
                        <UserPlus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        <div className={`flex flex-col ${isAdmin ? 'h-1/2' : 'h-full'}`}>
          <div className="p-4 border-b border-gray-800 flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-green-400" />
            <h2 className="font-bold">Live Chat</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.sender === user.name ? 'items-end' : 'items-start'}`}>
                <span className="text-xs text-gray-500 mb-1">{msg.sender} • {msg.time}</span>
                <div className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${msg.sender === user.name ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="p-4 bg-gray-800 flex items-center space-x-2 relative">
            {showEmojiPicker && (
              <div className="absolute bottom-full right-4 mb-2 z-50 bg-gray-900 border border-gray-700 rounded-lg p-2 shadow-2xl">
                <div className="flex justify-end mb-1">
                  <button type="button" onClick={() => setShowEmojiPicker(false)} className="text-gray-400 hover:text-white">&times;</button>
                </div>
                <EmojiPicker onEmojiClick={(e) => setChatInput(prev => prev + e.emoji)} theme="dark" />
              </div>
            )}
            <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-yellow-500 hover:text-yellow-400 transition">
              <Smile className="h-6 w-6" />
            </button>
            <input 
              type="text" 
              value={chatInput} 
              onChange={e => setChatInput(e.target.value)} 
              className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-white" 
              placeholder="Type message..." 
            />
            <button type="submit" className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Media Request Modal */}
      {mediaRequest && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Media Request</h3>
            <p className="text-gray-400 mb-6">The Host wants you to turn on your camera and microphone. Do you accept?</p>
            <div className="flex justify-end space-x-4">
              <button onClick={() => setMediaRequest(false)} className="px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition">Decline</button>
              <button onClick={acceptMediaRequest} className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition">Accept</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const VideoPlayer = ({ peer, user, isLocalUser, isGranted, chatProps }) => {
  const ref = useRef();
  const containerRef = useRef();
  const [hasStream, setHasStream] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // If the user's media was explicitly revoked by the admin, force hide their stream
  const effectiveHasStream = hasStream && (isGranted === undefined || isGranted === true || user.role === 'admin');

  useEffect(() => {
    if (!peer) return;
    const handleStream = (stream) => {
      ref.current.srcObject = stream;
      setHasStream(true);
      setHasVideo(stream.getVideoTracks().length > 0 && stream.getVideoTracks()[0].enabled);
    };

    peer.on('stream', handleStream);

    peer.on('track', (track, stream) => {
      handleStream(stream);
    });

    return () => {
      peer.off('stream', handleStream);
    };
  }, [peer]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement && document.fullscreenElement === containerRef.current);
      if (!document.fullscreenElement) {
        setShowChat(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const isBig = user.role === 'admin' || effectiveHasStream;
  const showCameraOff = user.role === 'admin' && (!effectiveHasStream || !hasVideo);

  const toggleFullscreen = (e) => {
    e.stopPropagation();
    if (user.role === 'admin' && containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`group relative rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 flex items-center justify-center transition-all duration-300 ${isBig ? 'w-full lg:w-[calc(50%-1rem)] aspect-video shadow-lg' : 'w-32 h-24 border-dashed opacity-70'} ${user.role === 'admin' ? 'hover:ring-2 hover:ring-blue-500' : ''}`}
    >
      <video playsInline autoPlay ref={ref} className={`w-full h-full object-cover ${(showCameraOff || (!effectiveHasStream && user.role !== 'admin')) ? 'hidden' : ''}`} />
      
      {showCameraOff && (
        <div className="flex flex-col items-center justify-center text-gray-500 z-10">
          <VideoOff className="h-16 w-16 mb-2 opacity-50" />
          <p className="text-sm font-semibold">Camera Off</p>
        </div>
      )}

      {!effectiveHasStream && user.role !== 'admin' && (
        <div className="flex flex-col items-center justify-center text-gray-500 z-10">
          <p className="text-xs font-semibold px-2 text-center break-words w-full">{user.name}</p>
          <p className="text-[10px] opacity-60">Listening...</p>
        </div>
      )}

      {(effectiveHasStream || user.role === 'admin') && (
        <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-lg text-sm z-20 flex items-center space-x-2">
          <span>{user.name}</span>
          {user.role === 'admin' && <span className="text-blue-400 font-bold">(Host)</span>}
          {isLocalUser && <span className="text-gray-400">(You)</span>}
        </div>
      )}

      {user.role === 'admin' && (
        <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
          {isFullscreen && (
            <button onClick={(e) => { e.stopPropagation(); setShowChat(!showChat); }} className="p-2 bg-black/60 text-white rounded-lg hover:bg-black/80 transition" title="Toggle Chat">
              <MessageSquare className="h-5 w-5" />
            </button>
          )}
          <button onClick={toggleFullscreen} className="p-2 bg-black/60 text-white rounded-lg hover:bg-black/80 transition" title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
            <Maximize className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Sliding Chat Panel in Fullscreen */}
      {isFullscreen && chatProps && (
        <div className={`absolute top-0 right-0 h-full w-80 bg-gray-900/95 backdrop-blur-md border-l border-gray-800 flex flex-col z-30 transform transition-transform duration-500 ease-in-out ${showChat ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-green-400" />
              <h2 className="font-bold text-white">Live Chat</h2>
            </div>
            <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-white transition">
              <span className="text-xl leading-none">&times;</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {chatProps.chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.sender === chatProps.currentUser.name ? 'items-end' : 'items-start'}`}>
                <span className="text-xs text-gray-400 mb-1">{msg.sender} • {msg.time}</span>
                <div className={`px-3 py-2 rounded-2xl max-w-[85%] text-sm ${msg.sender === chatProps.currentUser.name ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={chatProps.sendMessage} className="p-3 bg-gray-800/80 flex flex-col relative">
            {chatProps.showEmojiPicker && (
              <div className="absolute bottom-full right-0 mb-2 z-50 bg-gray-900 border border-gray-700 rounded-lg p-2 shadow-2xl">
                <div className="flex justify-end mb-1">
                  <button type="button" onClick={() => chatProps.setShowEmojiPicker(false)} className="text-gray-400 hover:text-white">&times;</button>
                </div>
                <EmojiPicker onEmojiClick={(e) => chatProps.setChatInput(prev => prev + e.emoji)} theme="dark" />
              </div>
            )}
            <div className="flex items-center space-x-2">
              <button type="button" onClick={() => chatProps.setShowEmojiPicker(!chatProps.showEmojiPicker)} className="text-yellow-500 hover:text-yellow-400 transition">
                <Smile className="h-6 w-6" />
              </button>
              <input 
                type="text" 
                value={chatProps.chatInput} 
                onChange={e => chatProps.setChatInput(e.target.value)} 
                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-white" 
                placeholder="Type..." 
              />
              <button type="submit" className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default LiveClassRoom;

