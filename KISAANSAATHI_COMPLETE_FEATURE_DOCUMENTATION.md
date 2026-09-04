# KisaanSaathi (किसान साथी / కిసాన్ సాథి)
## AI-Powered Multilingual Voice & Multimodal Agricultural Intelligence Platform
### Comprehensive System Architecture, Feature Catalogue & Presentation Blueprint

---

## 1. Executive Summary & Problem Statement

### The Problem
- **Literacy & Language Barriers**: 70%+ of Indian smallholder farmers communicate in regional vernaculars (Telugu, Hindi, Tamil, Kannada, Marathi) and struggle with complex text-based government grievance portals.
- **Vague & Incomplete Grievances**: Farmers often submit voice notes or reports missing essential context (e.g., failing to specify the crop name or specific symptoms), leading to immediate rejection or erroneous diagnoses.
- **Suboptimal Image Quality**: Farmers upload blurry photos, photos of the wrong crop, or non-agricultural objects, which traditional chatbots either blindly accept or fail to diagnose.
- **AEO Bottlenecks**: Agricultural Extension Officers (AEOs) are overwhelmed with unstructured, duplicate complaints across villages with no geospatial clustering or severity prioritization.
- **Slow Evaluation Latency**: Traditional AI pipelines that re-transcribe audio and upload raw 15–30 MB camera payloads keep farmers and evaluators waiting for over a minute to register a complaint.

### The KisaanSaathi Solution
**KisaanSaathi** is an end-to-end, voice-first, multimodal agricultural grievance and disease triage ecosystem that:
1. Engages farmers in their native mother tongue with zero typing required.
2. Gates complaints with intelligent conversation prompts if basic details (crop/symptoms) are omitted before photos are captured.
3. Screens photos using a **Dual-Layer Vision Architecture** (YOLO11 Disease Pathology + Qwen-VL Multimodal Semantic Reasoning).
4. Registers and verifies complaints in **under 5 seconds**.
5. Clusters incidents geospatially to detect pest outbreaks and community-confirmed hot-zones.
6. Empowers Agricultural Officers with an interactive triage command center, YOLO bounding-box visualizers, historical case retrieval, field-visit scheduling, and localized official advisories.

---

## 2. End-to-End System Architecture

```
                                  [ FARMER INTERFACE ]
                                            │
               ┌────────────────────────────┼────────────────────────────┐
               ▼                            ▼                            ▼
      [Indic Voice Input]         [1-Tap Crop Selection]       [Multi-Photo Evidence]
  (Telugu, Hindi, Tamil, etc.)   (Paddy, Cotton, Chilli, etc.) (Compressed Client-side)
               │                            │                            │
               └────────────────────────────┼────────────────────────────┘
                                            ▼
                      [ FASTAPI HIGH-PERFORMANCE BACKEND ]
                                            │
       ┌────────────────────────────────────┼────────────────────────────────────┐
       ▼                                    ▼                                    ▼
[Stage 1: Intent & Gating]        [Stage 2: Dual-Layer Vision]          [Geospatial Clustering]
• IndicConformer / WebSpeech       • Layer 1: YOLO11 Plant Pathology    • Haversine / PostGIS 5km
• LLM Intent & Completeness Check  • Layer 2: Qwen-VL Cross-Check       • Outbreak Severity Scoring
• Gated Missing Details Flow       • Relevance & Crop Consistency       • Community "+1 Me Too"
       │                                    │                                    │
       └────────────────────────────────────┼────────────────────────────────────┘
                                            ▼
                           [ SUPABASE POSTGRESQL + STORAGE ]
                                            │
                                            ▼
                        [ AEO COMMAND CENTER (OFFICER PORTAL) ]
  • Prioritized Triage Queue          • YOLO Leaf Inspection Visualizer
  • Historical Similar Cases (Qwen)   • Field Visit Geo-Scheduling
  • AI Dialect Translation            • Official Verified Voice Advisory
```

---

## 3. Detailed Feature Breakdown

### A. Voice-First Farmer AI Assistant
* **Multilingual Indic Speech Recognition**:
  - Full support for **Telugu, Hindi, Tamil, Kannada, Marathi, and English**.
  - Dual-engine speech architecture: AI-driven `IndicConformer` STT with zero-latency browser Web Speech fallback.
  - Interactive audio waveform visualizer showing live voice recording amplitude.
* **Gated Incomplete Details Intelligence**:
  - **The Problem Solved**: Previously, if a farmer said "my leaves are drying" without stating the crop, the system accepted it, guided photos, and then failed because crop matching could not verify the plant.
  - **Gating Mechanism**: Stage 1 LLM analyzes transcript completeness (`is_complete`, `missing_fields`). If `crop` or `symptoms` are omitted, advancing to photos is **strictly locked**.
  - **Clarification & 1-Tap Crop Chips**: The assistant speaks a localized clarification prompt asking for the crop and displays quick-select regional crop chips (🌾 Paddy, 🌿 Cotton, 🌶️ Chilli, 🍅 Tomato, 🌽 Maize, 🥜 Groundnut) alongside custom voice/text input.
  - **Dynamic Unlocking**: As soon as the farmer taps a crop chip, the complaint context updates and the "Continue to Photos" button immediately activates.
* **Localized Audio Playback (TTS)**:
  - Generates clear, localized voice guidance in the farmer's dialect so illiterate farmers can navigate the entire flow purely by listening.

---

### B. Smart Photo Guidance & Dual-Layer Multimodal Vision
* **Contextual Photo Guidance Prompts**:
  - Based on the farmer's voice description, the AI generates 2–3 precise photo instructions (e.g., *"Take a close-up of leaf underside showing whiteflies"*, *"Take a wide-angle shot of the plant canopy"*).
* **Client-Side Image Optimization**:
  - Automatically downscales multi-megabyte camera photos to max 1024px JPEG (~70 KB) before transmission, cutting network payload by 95% and eliminating upload timeouts.
* **Dual-Layer Vision Analysis**:
  - **Layer 1: YOLO11 Pathology Model**:
    - Runs millisecond object detection for localized plant diseases (Leaf Curl, Blast, Rust, Blight, Powdery Mildew, Pest Infestations).
    - Extracts normalized pixel bounding boxes (`[ymin, xmin, ymax, xmax]`) and confidence scores.
  - **Layer 2: Featherless Qwen-VL Multimodal Reasoner**:
    - Evaluates semantic consistency between the farmer's voice complaint, YOLO detections, and photo pixels.
    - Classifies evidence as `RELEVANT`, `IMPERFECT_BUT_USABLE`, or `IRRELEVANT`.
    - Detects non-agricultural photos (vehicles, faces, animals) and prompts farmer for re-take without failing the entire incident.
    - Detects wrong-crop uploads (e.g., farmer reports Paddy but uploads Tomato leaves).
* **Safety & AI Guardrails**:
  - Never claims absolute certainty: outputs tentative observations (`"Observed visual patterns consistent with leaf curl virus"`).
  - Explicitly states that only human Agricultural Extension Officers (AEOs) have prescription authority, preventing unsafe chemical usage.

---

### C. Ultra-Fast Complaint Acceptance (< 5 Seconds)
* **The Problem Solved**: Complaints previously took 50–70 seconds to register because the backend re-transcribed audio on CPU and uploaded massive uncompressed images.
* **Optimization Pillars**:
  1. **CPU STT Bypass**: Frontend passes the verified transcript; backend skips the 25-second CPU IndicConformer model pass and uploads audio directly for officer playback.
  2. **Compressed Multimodal Payloads**: 15–30 MB raw images compressed to ~250 KB total.
  3. **Non-Blocking Similarity Checks**: Historical similar-case matching runs asynchronously with a 3.5s timeout guarantee so complaint submission registers instantaneously.

---

### D. Geospatial Intelligence & Proximity Clustering
* **5km Radius Density Clustering**:
  - Automatically clusters complaints occurring within 5km of each other that share the same crop and suspected pathology.
* **Outbreak Severity Index (1–10)**:
  - Calculates dynamic risk scores based on number of affected farms, rapid spread velocity, and crop economic criticality.
* **Interactive Leaflet/Mapbox Cluster Map**:
  - Visual heatmaps and markers showing village-level infection hot-zones, acreage at risk, and affected farmer counts.
* **Priority Clusters Panel**:
  - Flags high-priority emergency clusters to district administrators for rapid deployment.

---

### E. Community Crowdsourcing & Confirmation
* **Nearby Community Issues Feed**:
  - Farmers can view an anonymized feed of verified crop issues detected within their mandal/village.
* **"+1 Me Too" Community Verification**:
  - Neighboring farmers can tap *"I am facing this same issue"* or *"My crop is healthy"*.
  - Aggregated community confirmations boost case priority on the AEO dashboard, filtering out spam and highlighting true regional epidemics.

---

### F. Agricultural Extension Officer (AEO) Command Center
* **Role-Based Secure Dashboard**:
  - Secure officer authentication with jurisdiction filtering (Mandal/District level).
* **Triage Prioritization Queue**:
  - Incidents ranked by dynamic priority: High Severity Outbreaks > Clustered Cases > Community-Confirmed Issues > Routine Single Inquiries.
* **Evidence Comparison Card**:
  - Side-by-side split screen showing farmer voice transcript, AI preliminary findings, and high-resolution photo evidence.
* **Interactive Annotated Image Viewer**:
  - Toggles YOLO bounding-box overlays over diseased leaf zones with zoom, pan, and detection confidence tags.
* **Similar Previous Cases Search (Semantic RAG)**:
  - Searches past resolved incidents in the district to show how identical diseases were successfully treated previously.
* **Field Visit Scheduler & Tracking**:
  - AEO can schedule on-site inspections, select GPS waypoints, set target dates, and notify the farmer.
* **Official Advisory & AI Dialect Translation**:
  - **Authority Preserved**: The AEO types the official treatment instructions (e.g., *"Spray Mancozeb 2g per liter of water early in the morning. Maintain soil drainage."*).
  - **Faithful Translation**: AI translates the officer's exact advisory into the farmer's regional dialect without inventing or modifying dosages.
  - **Audio Advisory (TTS)**: Automatically creates an audio version of the advisory for illiterate farmers to listen to on their mobile phones.
* **Full Case Lifecycle Management**:
  - Formal workflow states: `SUBMITTED` ➔ `UNDER_REVIEW` ➔ `FIELD_VISIT_SCHEDULED` ➔ `ADVISORY_ISSUED` ➔ `RESOLVED` ➔ `CLOSED`.

---

## 4. Project Directory & File Structure

```
KisaanSaathi/
├── backend/
│   ├── app/
│   │   ├── api/v1/
│   │   │   ├── auth.py                  # Officer JWT login & authentication
│   │   │   ├── incidents.py             # Complaint submission, audio upload & gating
│   │   │   ├── community.py             # Community feed & +1 confirmation endpoints
│   │   │   ├── advisory.py              # AEO advisory issuance & status transitions
│   │   │   └── clusters.py              # Geospatial clustering & outbreak analytics
│   │   ├── core/
│   │   │   ├── config.py                # Pydantic settings, API keys, endpoints
│   │   │   └── security.py              # Password hashing & token verification
│   │   ├── database/
│   │   │   └── supabase.py              # Supabase client & table schemas
│   │   ├── models/                      # Pydantic schemas (Incident, Advisory, Cluster)
│   │   ├── services/
│   │   │   ├── llm_service.py           # Stage 1 Intent, Gating, Qwen-VL Multimodal
│   │   │   ├── vision_service.py        # YOLO11 disease detection & bbox extraction
│   │   │   ├── indic_asr_service.py     # IndicConformer speech-to-text pipeline
│   │   │   ├── advisory_service.py      # Featherless translation & gTTS voice generation
│   │   │   ├── similar_issues_service.py# Semantic vector similarity matching
│   │   │   ├── community_service.py     # Community confirmations & vote tallies
│   │   │   └── incident_service.py      # Incident CRUD, workflow status engine
│   │   └── main.py                      # FastAPI application entrypoint & CORS
│   ├── tests/
│   │   ├── test_featherless_qwen3_vl.py # 16 comprehensive multimodal & gating tests
│   │   └── test_multimodal_dual_layer.py# Dual-layer YOLO + Qwen test suite
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FarmerAiAssistant.jsx    # Voice recording, crop chips & gated photo flow
│   │   │   ├── AudioRecorder.jsx        # Waveform visualizer & Indic voice capture
│   │   │   ├── PhotoEvidenceCapture.jsx # Multi-photo camera & preview component
│   │   │   ├── AnnotatedImageViewer.jsx # YOLO bbox overlay with pan/zoom
│   │   │   ├── EvidenceComparisonCard.jsx# Dual-layer evidence & reasoning display
│   │   │   ├── IncidentClusterMap.jsx   # Leaflet geospatial outbreak map
│   │   │   ├── NearbyCommunityIssues.jsx# Village-level crop issue feed & +1 votes
│   │   │   ├── OfficerAdvisorySection.jsx# AEO advisory drafting & voice preview
│   │   │   ├── CaseWorkflowSection.jsx  # Status stepper (Submitted -> Resolved)
│   │   │   ├── SimilarPreviousCasesSection.jsx # Historical case matching
│   │   │   └── FieldVisitModal.jsx      # Inspection scheduling & waypoint setup
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx          # Public portal & feature overview
│   │   │   ├── FarmerPage.jsx           # Farmer reporting & grievance tracking
│   │   │   ├── AeoDashboard.jsx         # Officer triage command center
│   │   │   ├── CommunityPage.jsx        # Regional outbreak intelligence feed
│   │   │   └── OfficerLoginPage.jsx     # Secure authentication portal
│   │   ├── services/                    # Axios API client, Supabase, audio helpers
│   │   ├── __tests__/                   # 15 Vitest suites (101 automated unit tests)
│   │   ├── App.jsx                      # Client router & navigation
│   │   └── index.css                    # Tailwind + Glassmorphic design system
│   └── package.json
```

---

## 5. End-to-End User Workflows

### Workflow 1: Farmer Voice Grievance with Gated Resolution
1. **Language Selection**: Farmer selects Telugu / Hindi / Tamil / etc.
2. **Voice Recording**: Farmer taps mic and describes issue: *"ఆకులన్నీ పసుపు రంగులోకి మారి మచ్చలు వచ్చాయి"* (Leaves are turning yellow with spots).
3. **AI Gating Check**:
   - Backend Stage 1 detects symptoms are present, but **Crop Name** is missing.
   - `is_complete` returns `False`; photo capture is blocked.
   - Assistant speaks: *"దయచేసి మీ పంట పేరు చెప్పండి లేదా ఎంచుకోండి"* (Please state or select your crop).
4. **1-Tap Resolution**: Farmer taps the **🍅 Tomato** crop chip.
5. **Photo Guidance Unlocked**: System updates crop to Tomato, unlocks camera, and suggests: *"Take a close-up of the yellow spots on tomato leaves"*.
6. **Photo Capture & Upload**: Farmer snaps 2 photos. Client compresses photos to 70 KB each.
7. **Instant Acceptance**: Complaint is accepted and registered in **under 3.5 seconds**.

### Workflow 2: AEO Investigation & Localized Advisory
1. **Officer Login**: AEO logs in; dashboard displays new incidents sorted by priority.
2. **Review Evidence**: Officer views the Farmer's incident.
   - Reads transcript translated to English + original Telugu voice note.
   - Inspects photos with YOLO11 bounding boxes identifying *Early Blight (Alternaria solani)* with 89% confidence.
   - Reviews Qwen-VL multimodal consistency score (`CONSISTENT`).
3. **Cluster Correlation**: Map shows 4 other farms within 3.2km reporting Early Blight on Tomato.
4. **Advisory Formulation**: Officer enters official treatment: *"Spray Mancozeb 2g per liter of water early in the morning. Maintain soil drainage."*
5. **Localization & TTS**: AI translates message into natural Telugu script and generates MP3 voice audio.
6. **Delivery**: Farmer receives push notification, reads Telugu instructions, and listens to the officer's voice note.

---

## 6. Slide-by-Slide PPT Presentation Blueprint (Ready for Gamma / SlidesAI / ChatGPT)

* **Slide 1: Title Slide**
  - **Heading**: KisaanSaathi (किसान साथी / కిసాన్ సాథి)
  - **Subheading**: AI-Powered Multilingual Voice & Multimodal Agricultural Intelligence Platform
  - **Presenter Note**: Connecting 100M+ smallholder farmers directly to Agricultural Officers using voice and vision AI.

* **Slide 2: The Core Problem**
  - **Points**:
    - 70%+ farmers cannot type complex grievance portals.
    - Missing details in voice notes lead to wrong diagnoses or rejected claims.
    - Blurry / irrelevant photos overwhelm officers.
    - Traditional systems take 1+ minute just to submit an issue.

* **Slide 3: Our Solution – KisaanSaathi Ecosystem**
  - **Points**:
    - Zero-typing voice conversational interface in 6 Indic languages.
    - Intelligent Gating: Prompts farmer when crop name or symptoms are missing.
    - Dual-Layer Vision AI: YOLO11 pixel inspection + Qwen-VL semantic verification.
    - Acceptance in < 5 seconds.
    - Geospatial clustering for village-wide epidemic prevention.

* **Slide 4: Feature Spotlight 1 – Voice-First Assistant & Missing Details Gating**
  - **Points**:
    - Native speech recognition with live audio waveform.
    - Intelligent completeness check: Blocks photo mode if crop is unknown.
    - 1-tap regional crop chips (Paddy, Cotton, Chilli, Tomato, Maize, Groundnut) to resolve missing information in seconds.

* **Slide 5: Feature Spotlight 2 – Dual-Layer Multimodal Vision**
  - **Points**:
    - Contextual camera guidance based on voice description.
    - Layer 1 (YOLO11): Bounding boxes on diseased leaf spots, pests, leaf curl.
    - Layer 2 (Qwen-VL): Cross-checks photos against voice complaint; weeds out non-agricultural photos and wrong crops.
    - Safe AI guardrail: Preliminary assessment only; human officer retains prescription authority.

* **Slide 6: Feature Spotlight 3 – 10x Performance Optimization (< 5s Latency)**
  - **Points**:
    - Previously: 60-second delay due to CPU speech re-transcription and 30MB photo uploads.
    - Now: CPU STT bypass + client-side JPEG compression (95% payload reduction) + asynchronous similarity matching.
    - Result: Instant verification and acceptance in < 5 seconds.

* **Slide 7: Feature Spotlight 4 – Geospatial Outbreak Clusters & Community Voting**
  - **Points**:
    - Automatic 5km radius density grouping of identical crop diseases.
    - Outbreak Severity Score (1–10) based on farm density and velocity.
    - "+1 Me Too" community confirmation by neighboring farmers.
    - Interactive Leaflet heatmap map for district agricultural authorities.

* **Slide 8: Feature Spotlight 5 – AEO Command Center & Official Advisories**
  - **Points**:
    - Prioritized triage queue highlighting high-risk clusters.
    - Interactive visualizer with toggleable YOLO disease bounding boxes.
    - Historical case retrieval: shows past successful remedies for similar cases.
    - Official advisory with AI dialect translation and voice note generation.
    - Full case lifecycle tracking (Submitted ➔ Visited ➔ Resolved).

* **Slide 9: Technical Architecture & Rigorous Testing**
  - **Frontend**: React 18, Vite, TailwindCSS, Glassmorphism, Leaflet.
  - **Backend**: FastAPI, Python 3.14, YOLO11, Featherless Qwen-VL, IndicConformer.
  - **Database**: Supabase PostgreSQL + PostGIS, Supabase Storage.
  - **Test Coverage**: 101 automated Vitest frontend tests + 16 backend integration tests (100% passing).

* **Slide 10: Conclusion & Future Roadmap**
  - **Summary**: High-speed, high-accuracy agricultural intelligence protecting farmer livelihoods.
  - **Next Steps**: Drone & satellite NDVI imagery integration, automated weather risk alerts, and direct government compensation disbursement.
