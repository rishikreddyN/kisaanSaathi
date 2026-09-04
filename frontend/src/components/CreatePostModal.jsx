import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { createCommunityPost } from '../services/communityDataStore';

export default function CreatePostModal({ isOpen, onClose, onCreated }) {
  const { currentLang, t } = useLanguage();

  const [crop, setCrop] = useState('Tomato');
  const [description, setDescription] = useState('');
  const [approxLocation, setApproxLocation] = useState('Ghatkesar Mandal (~3 km away)');
  const [severity, setSeverity] = useState('Medium');
  const [photoUrl, setPhotoUrl] = useState('');

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioAvailable, setRecordedAudioAvailable] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 6) {
            // Auto stop after 6 seconds of speech
            stopRecording();
            return 6;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  if (!isOpen) return null;

  const startRecording = () => {
    setIsRecording(true);
    setRecordedAudioAvailable(false);
    setRecordingSeconds(0);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setRecordedAudioAvailable(true);

    // Realistic speech-to-text transcript based on crop and language
    if (currentLang === 'te') {
      setDescription(
        `నా ${crop} తోటలో ఆకులు ముడుచుకుపోయి పసుపు రంగులోకి మారుతున్నాయి. వర్షం పడినప్పటి నుండి ఈ సమస్య తీవ్రమైంది. ఎవరైనా దీనికి సరైన మందు లేదా పరిష్కారం సూచించగలరా?`
      );
    } else if (currentLang === 'hi') {
      setDescription(
        `मेरे ${crop} के खेत में पत्तियां मुड़कर पीली पड़ रही हैं। बारिश के बाद से यह प्रकोप बढ़ गया है। क्या कोई किसान भाई इसका प्रभावी उपचार बता सकते हैं?`
      );
    } else {
      setDescription(
        `Noticed severe leaf curling and yellowing across my ${crop} plants right after the monsoon spell. Seeking advice on proven fungicide or bio-spray.`
      );
    }
  };

  const handleDeleteVoice = () => {
    setRecordedAudioAvailable(false);
    setRecordingSeconds(0);
    setIsPlayingPreview(false);
  };

  const handleToggleAudioPlay = () => {
    setIsPlayingPreview(!isPlayingPreview);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    let authorName = 'Farmer';
    try {
      const stored = JSON.parse(localStorage.getItem('kisaansathi_farmer_profile') || 'null');
      if (stored?.name) authorName = stored.name;
    } catch {}

    const newPost = createCommunityPost({
      crop,
      title: `${crop} Field Observation: ${description.slice(0, 50)}...`,
      content: description.trim(),
      contentTe: description.trim(),
      contentHi: description.trim(),
      contentEn: description.trim(),
      originalLanguage: currentLang === 'hi' ? 'hi' : currentLang === 'en' ? 'en' : 'te',
      location: approxLocation,
      severity,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80',
      hasVoice: recordedAudioAvailable,
      voiceDuration: recordedAudioAvailable ? `0:0${recordingSeconds}` : null,
      isSubmittedProblem: false,
      author: {
        name: authorName,
        village: 'Ghatkesar Mandal',
        district: 'Medchal–Malkajgiri',
      },
    });

    if (onCreated) onCreated(newPost);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} data-testid="create-post-modal">
      <div className="modal-card create-post-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-icon-title">
            <span className="modal-icon">🌱</span>
            <div>
              <h2>Share Field Problem / Experience</h2>
              <small>Discuss with nearby farmers and receive AEO guidance</small>
            </div>
          </div>
          <button type="button" className="btn-modal-close" onClick={onClose} data-testid="close-create-post-modal">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-post-form">
          {/* Crop Selection */}
          <div className="form-group">
            <label className="form-label">Select Crop / Plant *</label>
            <select
              className="form-select"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              data-testid="post-crop-select"
            >
              <option value="Tomato">🍅 Tomato (టమాటా / टमाटर)</option>
              <option value="Rice">🌾 Rice / Paddy (వరి / धान)</option>
              <option value="Chilli">🌶️ Chilli (మిరప / मिर्च)</option>
              <option value="Cotton">🌿 Cotton (పత్తి / कपास)</option>
              <option value="Mango">🥭 Mango (మామిడి / आम)</option>
              <option value="Other">🌱 Other Agriculture Crop</option>
            </select>
          </div>

          {/* Voice Input Section (Farmer does not need to type) */}
          <div className="form-group voice-first-box">
            <div className="voice-first-header">
              <label className="form-label" style={{ margin: 0 }}>
                Problem Description *
              </label>
              <span className="voice-first-sublabel">No typing needed — speak in your local language</span>
            </div>

            {/* Voice controls */}
            <div className="voice-action-controls">
              {!isRecording && !recordedAudioAvailable && (
                <button
                  type="button"
                  className="btn btn-voice-record-large"
                  onClick={startRecording}
                  data-testid="speak-post-btn"
                >
                  <span className="mic-pulse-dot">🎙️</span>
                  <span>Speak Instead (Tap to Record)</span>
                </button>
              )}

              {isRecording && (
                <div className="recording-live-panel">
                  <div className="recording-pulse-ring"></div>
                  <div className="recording-live-text">
                    <strong>Listening... ({recordingSeconds}s)</strong>
                    <small>Speak clearly about your crop condition</small>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-stop-recording"
                    onClick={stopRecording}
                    data-testid="stop-recording-btn"
                  >
                    ⏹️ Done / Convert to Text
                  </button>
                </div>
              )}

              {recordedAudioAvailable && (
                <div className="recorded-voice-tray">
                  <div className="recorded-voice-meta">
                    <span className="voice-badge-icon">🎙️</span>
                    <span>Voice Recorded (0:0{recordingSeconds})</span>
                  </div>
                  <div className="recorded-voice-btns">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={handleToggleAudioPlay}
                    >
                      {isPlayingPreview ? '⏸️ Pause' : '▶️ Play'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={handleDeleteVoice}
                    >
                      🗑️ Re-record
                    </button>
                  </div>
                </div>
              )}
            </div>

            <textarea
              className="form-input description-textarea"
              rows="4"
              placeholder="Describe what you see in the field (symptoms, duration, affected acreage)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              data-testid="post-description-input"
            />
            {recordedAudioAvailable && (
              <small className="form-hint success-hint">
                ✓ Converted from your voice! You can review or edit the text above before posting.
              </small>
            )}
          </div>

          {/* Approximate Location & Severity */}
          <div className="form-row-dual">
            <div className="form-group">
              <label className="form-label">Approximate Location</label>
              <input
                type="text"
                className="form-input"
                value={approxLocation}
                onChange={(e) => setApproxLocation(e.target.value)}
              />
              <small className="form-hint">🔒 Exact GPS coordinates remain private.</small>
            </div>

            <div className="form-group">
              <label className="form-label">Observed Severity</label>
              <select
                className="form-select"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
              >
                <option value="Low">Low (Initial Signs)</option>
                <option value="Medium">Medium (Noticeable Spread)</option>
                <option value="High">High (Impacting Yield)</option>
                <option value="Severe">Severe (Critical Outbreak)</option>
              </select>
            </div>
          </div>

          {/* Photo upload toggle */}
          <div className="form-group">
            <label className="form-label">Crop Photo (Optional)</label>
            <div className="sample-photo-picker">
              <button
                type="button"
                className={`btn btn-sm ${photoUrl ? 'btn-outline' : 'btn-primary'}`}
                onClick={() =>
                  setPhotoUrl(
                    'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80'
                  )
                }
              >
                📷 Attach Field Photo
              </button>
              {photoUrl && (
                <span className="photo-attached-chip">
                  ✓ Photo attached{' '}
                  <button type="button" onClick={() => setPhotoUrl('')} className="btn-chip-remove">
                    ✕
                  </button>
                </span>
              )}
            </div>
          </div>

          {/* Submit buttons */}
          <div className="modal-actions-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-submit-post"
              disabled={!description.trim()}
              data-testid="submit-create-post"
            >
              🌱 Post to Community
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
