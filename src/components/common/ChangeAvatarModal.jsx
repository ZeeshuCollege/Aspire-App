import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Camera, Image, Check, AlertCircle, RefreshCw, Sparkles, Upload, Trash2, UserX } from 'lucide-react';
import { DEFAULT_GREY_AVATAR } from '../../lib/mockData';

export default function ChangeAvatarModal({ isOpen, onClose, currentAvatar, onSaveAvatar }) {
  const [isClosing, setIsClosing] = useState(false);
  const [viewMode, setViewMode] = useState('select'); // 'select' | 'camera' | 'preview'
  const [stream, setStream] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [cameraError, setCameraError] = useState('');
  const [facingMode, setFacingMode] = useState('user'); // 'user' (front) | 'environment' (back)

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // Stop camera stream on unmount or close
  const stopCameraStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  // Attach stream to video element whenever video element is mounted in camera view
  useEffect(() => {
    if (isOpen && viewMode === 'camera' && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(err => console.log('Video autoplay error:', err));
    }
  }, [isOpen, viewMode, stream]);

  if (!isOpen) return null;

  const handleClose = () => {
    stopCameraStream();
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setViewMode('select');
      setPreviewImage(null);
      setCameraError('');
    }, 380);
  };

  // 1. Start Camera and Request Native Camera Access
  const handleStartCamera = async (facing = facingMode) => {
    setCameraError('');
    stopCameraStream();
    setViewMode('camera');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser or environment.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 720 },
          height: { ideal: 720 }
        },
        audio: false
      });

      setStream(mediaStream);
    } catch (err) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera access was denied. Please allow camera permissions in your browser settings to take a photo.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera device found on this system. Please upload a photo from your gallery/media.');
      } else {
        setCameraError(err.message || 'Unable to access camera. Please choose an image from media library.');
      }
    }
  };

  // Switch between front and back camera
  const handleToggleFacingMode = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    handleStartCamera(nextMode);
  };

  // Capture Photo from live camera stream
  const handleCapturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const vWidth = video.videoWidth || 640;
    const vHeight = video.videoHeight || 640;
    const size = Math.min(vWidth, vHeight);
    
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    const startX = (vWidth - size) / 2;
    const startY = (vHeight - size) / 2;

    if (facingMode === 'user') {
      // Mirror horizontal axis so captured photo matches mirror preview
      ctx.translate(size, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    stopCameraStream();
    setPreviewImage(dataUrl);
    setViewMode('preview');
  };

  // 2. Open Device Media / Gallery Picker
  const handleTriggerMediaPicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle selected image file from device storage (Strictly JPG/PNG only; no MP4, GIF, or WebP)
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileType = (file.type || '').toLowerCase();
    const fileName = (file.name || '').toLowerCase();

    // Explicitly reject video/mp4, gif, webp, or any animated/unsupported formats
    const isForbidden = 
      fileType.includes('mp4') || 
      fileType.includes('video') || 
      fileType.includes('gif') || 
      fileType.includes('webp') ||
      fileName.endsWith('.mp4') || 
      fileName.endsWith('.gif') || 
      fileName.endsWith('.webp');

    const isAllowed = 
      !isForbidden && 
      (fileType === 'image/jpeg' || fileType === 'image/jpg' || fileType === 'image/png' ||
       fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png'));

    if (isForbidden || !isAllowed) {
      setCameraError('Only images (JPG or PNG) are supported. MP4 videos, GIFs, and WebP files cannot be used as profile pictures.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
      setViewMode('preview');
      setCameraError('');
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be reselected if needed
    e.target.value = '';
  };

  // 3. Confirm and Save New Profile Picture
  const handleConfirmSave = () => {
    if (previewImage && onSaveAvatar) {
      onSaveAvatar(previewImage);
    }
    handleClose();
  };

  const isDefaultAvatar = !currentAvatar || currentAvatar === DEFAULT_GREY_AVATAR;

  // 4. Remove Profile Picture (revert to default grey avatar)
  const handleRemoveAvatar = () => {
    stopCameraStream();
    if (onSaveAvatar) {
      onSaveAvatar(DEFAULT_GREY_AVATAR);
    }
    handleClose();
  };

  const modalContent = (
    <div
      className={`modal-backdrop-05s ${isClosing ? 'closing' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        className={`modal-sheet-05s ${isClosing ? 'closing' : ''}`}
        style={{
          maxHeight: '90vh',
          height: 'auto',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--canvas)'
        }}
      >
        {/* Hidden Native Media Picker Input - Strictly JPEG and PNG only */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,.jpg,.jpeg,.png"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {/* Drag Handle */}
        <div className="sheet-drag-handle" />

        {/* Top Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px 14px 20px',
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--brand-800) 0%, var(--accent-500) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(30, 58, 138, 0.2)'
            }}>
              <Camera size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--brand-900)', margin: 0, lineHeight: 1.2 }}>
                Change Profile Picture
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                Camera & Media Access
              </span>
            </div>
          </div>

          <button
            onClick={handleClose}
            style={{
              background: 'var(--surface-alt)',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div style={{ overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cameraError && (
            <div style={{
              padding: '12px 14px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 'var(--radius-md)',
              color: '#b91c1c',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px'
            }}>
              <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', marginBottom: '2px' }}>Permission Required</strong>
                <span>{cameraError}</span>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 1: SELECTION OPTIONS */}
          {/* ======================================================== */}
          {viewMode === 'select' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
              {/* Current Profile Picture Preview */}
              <div style={{ position: 'relative' }}>
                <img
                  src={currentAvatar}
                  alt="Current Avatar"
                  style={{
                    width: '96px',
                    height: '96px',
                    borderRadius: '20px',
                    objectFit: 'cover',
                    border: '3px solid var(--surface)',
                    boxShadow: '0 8px 24px rgba(30, 58, 138, 0.16), 0 0 0 2px var(--border)'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '-6px',
                  right: '-6px',
                  background: 'var(--brand-800)',
                  color: '#ffffff',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #ffffff'
                }}>
                  <Camera size={14} />
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--brand-900)', margin: '0 0 4px 0' }}>
                  Choose Photo Source
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, maxWidth: '280px' }}>
                  Capture a photo or upload an image (JPG or PNG only • No MP4, GIF, or WebP).
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
                {/* 1. Camera Access Button */}
                <button
                  onClick={() => handleStartCamera()}
                  className="card card-hover"
                  style={{
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: 'var(--surface)',
                    border: '1.5px solid var(--border)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Camera size={22} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <strong style={{ fontSize: '14px', color: 'var(--text-primary)', display: 'block' }}>
                        Take Photo
                      </strong>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Opens camera with live shutter (JPG)
                      </span>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--brand-600)',
                    background: 'var(--brand-50)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    Camera
                  </span>
                </button>

                {/* 2. Media / Gallery Access Button */}
                <button
                  onClick={handleTriggerMediaPicker}
                  className="card card-hover"
                  style={{
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: 'var(--surface)',
                    border: '1.5px solid var(--border)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Image size={22} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <strong style={{ fontSize: '14px', color: 'var(--text-primary)', display: 'block' }}>
                        Choose from Media / Gallery
                      </strong>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        JPG or PNG photos (no MP4, GIF, WebP)
                      </span>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--accent-500)',
                    background: 'var(--accent-50)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    Gallery
                  </span>
                </button>

                {/* 3. Remove Profile Picture (Revert to Default Grey Avatar) */}
                {!isDefaultAvatar ? (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="card card-hover"
                    style={{
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      background: 'var(--surface)',
                      border: '1.5px solid #fee2e2'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
                      }}>
                        <Trash2 size={20} />
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <strong style={{ fontSize: '14px', color: '#b91c1c', display: 'block' }}>
                          Remove Profile Picture
                        </strong>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          Reset to default grey profile photo
                        </span>
                      </div>
                    </div>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#b91c1c',
                      background: '#fef2f2',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)'
                    }}>
                      Remove
                    </span>
                  </button>
                ) : (
                  <div
                    style={{
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      background: 'var(--surface-alt)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px dashed var(--border)',
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      fontWeight: 600
                    }}
                  >
                    <UserX size={15} />
                    <span>Default grey avatar is currently in use</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 2: LIVE CAMERA VIEWFINDER */}
          {/* ======================================================== */}
          {viewMode === 'camera' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{
                position: 'relative',
                width: '260px',
                height: '260px',
                borderRadius: '24px',
                overflow: 'hidden',
                background: '#000000',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.3)'
              }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  onLoadedMetadata={() => videoRef.current?.play()}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: facingMode === 'user' ? 'scaleX(-1)' : 'none'
                  }}
                />

                {/* Subtle Square Focus Target */}
                <div style={{
                  position: 'absolute',
                  inset: '20px',
                  border: '2px dashed rgba(255, 255, 255, 0.6)',
                  borderRadius: '16px',
                  pointerEvents: 'none'
                }} />

                {/* Flip Camera Button */}
                <button
                  onClick={handleToggleFacingMode}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(4px)',
                    border: 'none',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title="Switch Camera"
                >
                  <RefreshCw size={16} />
                </button>
              </div>

              <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', margin: 0 }}>
                Position your face inside the square and tap Capture.
              </p>

              {/* Shutter Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '6px' }}>
                <button
                  onClick={() => { stopCameraStream(); setViewMode('select'); }}
                  style={{
                    background: 'var(--surface-alt)',
                    border: '1px solid var(--border)',
                    padding: '10px 18px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: 'var(--text-secondary)'
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={handleCapturePhoto}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--brand-800) 0%, var(--accent-500) 100%)',
                    border: '4px solid #ffffff',
                    boxShadow: '0 4px 18px rgba(30, 58, 138, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                  title="Capture Photo"
                >
                  <Camera size={26} />
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 3: PREVIEW & CONFIRMATION */}
          {/* ======================================================== */}
          {viewMode === 'preview' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--brand-900)', margin: '0 0 4px 0' }}>
                  Preview Profile Picture
                </h4>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  How your photo will appear across your student profile
                </span>
              </div>

              {/* Square Crop Preview */}
              <div style={{ position: 'relative' }}>
                <img
                  src={previewImage}
                  alt="New Profile Picture Preview"
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '22px',
                    objectFit: 'cover',
                    border: '4px solid #ffffff',
                    boxShadow: '0 10px 30px rgba(30, 58, 138, 0.2), 0 0 0 2px var(--border)'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  background: 'var(--success)',
                  color: '#ffffff',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #ffffff'
                }}>
                  <Check size={14} />
                </div>
              </div>

              {/* Confirm Buttons */}
              <div style={{ width: '100%', display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => { setViewMode('select'); setPreviewImage(null); }}
                  style={{
                    flex: 1,
                    background: 'var(--surface-alt)',
                    border: '1px solid var(--border)',
                    padding: '12px',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  Retake / Change
                </button>

                <button
                  type="button"
                  onClick={handleConfirmSave}
                  className="btn-primary"
                  style={{
                    flex: 1.5,
                    padding: '12px',
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Check size={16} />
                  <span>Save Profile Picture</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
