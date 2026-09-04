/**
 * communityDataStore.js
 * Centralized, persistent client-side data store for Krishi Sahayak Community module.
 * Grounded in agricultural terminology with realistic multi-lingual mock data for:
 * Rice, Tomato, Chilli, Cotton, and Mango.
 */

const STORAGE_KEYS = {
  POSTS: 'krishi_community_posts_v2',
  GROUPS: 'krishi_community_groups_v2',
  PROBLEMS: 'krishi_community_problems_v2',
  NOTIFICATIONS: 'krishi_farmer_notifications_v2',
  ANNOUNCEMENTS: 'krishi_aeo_announcements_v2',
  USER_INTERACTIONS: 'krishi_user_community_interactions_v2',
};

// =============================================================================
// REALISTIC SEED DATA (Telugu, Hindi, English)
// =============================================================================

export const INITIAL_POSTS = [
  {
    id: 'post-1',
    crop: 'Tomato',
    crop_icon: '🍅',
    author: {
      name: 'Ramesh Reddy',
      village: 'Padamati Sai Guda',
      mandal: 'Ghatkesar',
      district: 'Medchal–Malkajgiri',
      phone: '9876543210',
    },
    title: 'Tomato leaves curling upward and yellowing at leaf margins',
    content: {
      te: 'నా టమాటా తోటలో ఆకులు పైకి ముడుచుకుని పసుపు రంగులోకి మారుతున్నాయి. వర్షాల తర్వాత ఈ సమస్య మొదలైంది. ఎవరైనా దీనిని ఎదుర్కొన్నారా?',
      hi: 'मेरे टमाटर के खेत में पत्तियां ऊपर की ओर मुड़ रही हैं और किनारों से पीली हो रही हैं। बारिश के बाद यह समस्या शुरू हुई। क्या किसी ने इसका समाधान किया है?',
      en: 'In my tomato field, leaves are curling upwards and turning yellow at the margins. This began right after the rains. Has anyone faced this and resolved it?',
    },
    original_language: 'te',
    approximate_location: 'Ghatkesar Mandal (~3.2 km away)',
    severity: 'High',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hrs ago
    photo_url: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80',
    has_voice: true,
    voice_duration: '0:28',
    is_submitted_problem: true,
    related_incident_ref: 'RB-TOM-8921',
    worked_for_me_count: 32,
    has_user_worked_for_me: false,
    comments: [
      {
        id: 'comm-1-1',
        author: {
          name: 'Srinivas Rao',
          role: 'Agricultural Extension Officer',
          is_officer: true,
          badge: '🛡️ Official AEO',
        },
        content: {
          te: 'ఇది టొమాటో లీఫ్ కర్ల్ వైరస్ (వైట్ ఫ్లైస్ ద్వారా వ్యాపిస్తుంది). వెంటనే డైఫెంథియురాన్ లేదా వేప నూనె (5ml/L) పిచికారీ చేయండి. అధిక నత్రజని ఎరువులను ఆపండి.',
          hi: 'यह टमाटर लीफ कर्ल वायरस है (सफेद मक्खी से फैलता है)। तुरंत डाइफेंथियूरॉन या नीम का तेल (5ml/लीटर) छिड़कें। अत्यधिक नाइट्रोजन उर्वरक रोकें।',
          en: 'This is Tomato Leaf Curl Virus transmitted by whiteflies. Immediately spray Diafenthiuron 50% WP (1g/L) or Neem Oil 10,000 ppm (5ml/L). Avoid excess urea.',
        },
        original_language: 'en',
        created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
        has_voice: true,
        voice_duration: '0:35',
        worked_for_me_count: 45,
        has_user_worked_for_me: false,
        is_officer: true,
      },
      {
        id: 'comm-1-2',
        author: {
          name: 'Venkat Narayana',
          village: 'Malkaram',
          mandal: 'Ghatkesar',
          role: 'Farmer',
          is_officer: false,
        },
        content: {
          te: 'నా తోటలో కూడా ఇదే వచ్చింది. పసుపు రంగు జిగురు కార్డులు (Yellow sticky traps) ఎకరానికి 15 పెట్టాను, ఇంకా వేప కషాయం పిచికారీ చేశాను. 4 రోజుల్లో తెల్లదోమ తగ్గింది!',
          hi: 'मेरे खेत में भी यही हुआ था। मैंने प्रति एकड़ 15 पीले चिपचिपे जाल लगाए और नीम का काढ़ा छिड़का। 4 दिनों में सफेद मक्खियाँ कम हो गईं!',
          en: 'I had the exact same issue last season. I installed 15 yellow sticky traps per acre and sprayed neem extract. Whitefly population dropped within 4 days!',
        },
        original_language: 'te',
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        has_voice: false,
        worked_for_me_count: 28,
        has_user_worked_for_me: false,
        is_officer: false,
      },
    ],
  },
  {
    id: 'post-2',
    crop: 'Rice',
    crop_icon: '🌾',
    author: {
      name: 'Balraj Goud',
      village: 'Edulabad',
      mandal: 'Ghatkesar',
      district: 'Medchal–Malkajgiri',
      phone: '9848011223',
    },
    title: 'Spindle-shaped ash-grey lesions on paddy leaves after heavy dew',
    content: {
      te: 'వరి ఆకులపై బూడిద రంగు మచ్చలు కంటి ఆకారంలో కనిపిస్తున్నాయి. మంచు ఎక్కువగా ఉన్న పొలాల్లో ఇది వేగంగా వ్యాపిస్తోంది. అనుభవజ్ఞులైన రైతులు సలహా ఇవ్వగలరు.',
      hi: 'धान की पत्तियों पर राख के रंग के धब्बे आंख के आकार में दिख रहे हैं। ओस वाले खेतों में यह तेजी से फैल रहा है। अनुभवी किसान सलाह दें।',
      en: 'Eye/spindle-shaped ash grey lesions appearing on paddy leaves. Spreading fast across low-lying fields with high morning dew. Seeking advice from fellow paddy farmers.',
    },
    original_language: 'te',
    approximate_location: 'Edulabad (~5.1 km away)',
    severity: 'Severe',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    photo_url: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=600&q=80',
    has_voice: true,
    voice_duration: '0:42',
    is_submitted_problem: true,
    related_incident_ref: 'RB-RIC-4410',
    worked_for_me_count: 19,
    has_user_worked_for_me: false,
    comments: [
      {
        id: 'comm-2-1',
        author: {
          name: 'Mallesh Yadav',
          village: 'Kondapur',
          role: 'Farmer',
          is_officer: false,
        },
        content: {
          te: 'ఇది వరి అగ్గి తెగులు (Blast disease). ట్రైసైక్లాజోల్ (Tricyclazole 75% WP) 0.6 గ్రాములు లీటరు నీటికి కలిపి పిచికారీ చేయండి. యూరియా వేయడం వెంటనే ఆపండి.',
          hi: 'यह धान का झुलसा रोग (ब्लास्ट) है। ट्राईसाइक्लाजोल 75% WP 0.6 ग्राम प्रति लीटर पानी में मिलाकर स्प्रे करें। यूरिया डालना तुरंत बंद करें।',
          en: 'This is Paddy Leaf Blast (Pyricularia oryzae). Spray Tricyclazole 75% WP @ 0.6 g/L of water. Stop applying nitrogen top-dressing immediately.',
        },
        original_language: 'te',
        created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
        has_voice: false,
        worked_for_me_count: 38,
        has_user_worked_for_me: false,
        is_officer: false,
      },
    ],
  },
  {
    id: 'post-3',
    crop: 'Chilli',
    crop_icon: '🌶️',
    author: {
      name: 'Anjaiah Kurma',
      village: 'Pocharam',
      mandal: 'Ghatkesar',
      district: 'Medchal–Malkajgiri',
      phone: '9949123456',
    },
    title: 'Upward boat-shaped curling and flower dropping in Guntur Hope chilli',
    content: {
      te: 'మిరప పైరులో ఆకులు పైకి పడవ ఆకారంలో ముడుచుకుపోయి పూత రాలిపోతోంది. నల్ల తామర పురుగు కనిపిస్తోంది.',
      hi: 'मिर्च में पत्तियां नाव के आकार में ऊपर मुड़ रही हैं और फूल गिर रहे हैं। काली थ्रिप्स दिखाई दे रही है।',
      en: 'Chilli leaves curling upward like an inverted boat with heavy flower drop. Black thrips infestation noticed in tender shoot clusters.',
    },
    original_language: 'te',
    approximate_location: 'Pocharam (~2.8 km away)',
    severity: 'Severe',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    photo_url: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80',
    has_voice: false,
    is_submitted_problem: false,
    worked_for_me_count: 41,
    has_user_worked_for_me: false,
    comments: [
      {
        id: 'comm-3-1',
        author: {
          name: 'Srinivas Rao',
          role: 'Agricultural Extension Officer',
          is_officer: true,
          badge: '🛡️ Official AEO',
        },
        content: {
          te: 'నల్ల తామర పురుగు (Black Thrips) నివారణకు స్పైనెటోరం (Spinetoram 11.7 SC) 1ml/L లేదా ఫిప్రోనిల్ (Fipronil 5 SC) 2ml/L ఉదయం వేళల్లో పిచికారీ చేయండి. నీలి రంగు జిగురు అట్టలు అమర్చండి.',
          hi: 'काली थ्रिप्स के नियंत्रण के लिए स्पाइनेटोरम (Spinetoram 11.7 SC) 1ml/लीटर या फिप्रोनिल (Fipronil 5 SC) 2ml/लीटर सुबह के समय छिड़कें। नीले चिपचिपे कार्ड लगाएं।',
          en: 'For Invasive Black Thrips, spray Spinetoram 11.7 SC @ 1ml/L or Fipronil 5 SC @ 2ml/L during morning hours. Install 20 blue sticky traps per acre.',
        },
        original_language: 'en',
        created_at: new Date(Date.now() - 3600000 * 15).toISOString(),
        has_voice: true,
        voice_duration: '0:32',
        worked_for_me_count: 52,
        has_user_worked_for_me: false,
        is_officer: true,
      },
    ],
  },
  {
    id: 'post-4',
    crop: 'Cotton',
    crop_icon: '🌿',
    author: {
      name: 'Santosh Kumar',
      village: 'Bogaram',
      mandal: 'Keesara',
      district: 'Medchal–Malkajgiri',
      phone: '9701020304',
    },
    title: 'Pink bollworm larvae found inside 60-day old cotton bolls',
    content: {
      te: 'పత్తి కాయలు కోసి చూస్తే లోపల గులాబీ రంగు పురుగులు కనిపించాయి. పువ్వులు రోసెట్ ఆకారంలో మారిపోయాయి.',
      hi: 'कपास के डोडे काटकर देखने पर अंदर गुलाबी सूंडी दिखाई दी। फूल रोसेट जैसे आकार में बंद हो गए हैं।',
      en: 'Found pink bollworm larvae inside split bolls. Rosetted flowers observed in ~15% of plants across my 4-acre field.',
    },
    original_language: 'hi',
    approximate_location: 'Bogaram / Keesara (~8.4 km away)',
    severity: 'High',
    created_at: new Date(Date.now() - 3600000 * 30).toISOString(),
    photo_url: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=600&q=80',
    has_voice: true,
    voice_duration: '0:38',
    is_submitted_problem: true,
    related_incident_ref: 'RB-COT-1290',
    worked_for_me_count: 27,
    has_user_worked_for_me: false,
    comments: [],
  },
  {
    id: 'post-5',
    crop: 'Mango',
    crop_icon: '🥭',
    author: {
      name: 'Venkataiah Goud',
      village: 'Korremula',
      mandal: 'Ghatkesar',
      district: 'Medchal–Malkajgiri',
      phone: '9988776655',
    },
    title: 'White powdery coating on mango flower panicles and hopper secretion',
    content: {
      te: 'మామిడి పూతపై తెల్లటి బూడిద లాంటి పొర కనిపిస్తోంది, పూత ఎండిపోయి రాలిపోతోంది. తేనెమంచు లాంటి జిగురు పువ్వులపై పేరుకుంది.',
      hi: 'आम के बौर पर सफेद चूर्ण जैसी परत दिख रही है, फूल सूखकर गिर रहे हैं। फूलों पर चिपचिपा स्राव जमा हो गया है।',
      en: 'White powdery fungal coating on mango flower panicles causing blossom drop. Leafhoppers also actively feeding and leaving honeydew deposits.',
    },
    original_language: 'te',
    approximate_location: 'Korremula (~4.2 km away)',
    severity: 'Medium',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    photo_url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
    has_voice: false,
    is_submitted_problem: false,
    worked_for_me_count: 14,
    has_user_worked_for_me: false,
    comments: [],
  },
];

// =============================================================================
// FARMER GROUPS SEED DATA (Crop-wise + Nearby with distances)
// =============================================================================

export const INITIAL_GROUPS = [
  // Plant / Crop-wise Groups
  {
    id: 'group-crop-rice',
    type: 'CROP',
    crop: 'Rice',
    icon: '🌾',
    name: {
      te: 'వరి సాగుదారుల సమూహం',
      hi: 'धान उत्पादक किसान समूह',
      en: 'Rice Cultivators Circle',
    },
    description: {
      te: 'వరి నాట్లు, అగ్గి తెగులు నివారణ, నీటి యాజమాన్యం మరియు ఎరువుల నిర్వహణపై చర్చ.',
      hi: 'धान की रोपाई, रोग नियंत्रण, जल प्रबंधन और संतुलित खाद उपयोग पर संवाद।',
      en: 'Discussions on paddy transplantation, blast management, SRI techniques, and fertilizer management.',
    },
    member_count: 482,
    aeo_present: true,
    aeo_name: 'Srinivas Rao (AEO Medchal)',
    is_joined: true,
    recent_activity: '12 minutes ago',
    sample_discussions_count: 24,
  },
  {
    id: 'group-crop-tomato',
    type: 'CROP',
    crop: 'Tomato',
    icon: '🍅',
    name: {
      te: 'టమాటా రైతుల సంఘం',
      hi: 'टमाटर उत्पादक किसान संघ',
      en: 'Tomato Growers Forum',
    },
    description: {
      te: 'హైబ్రిడ్ టమాటా రకాలు, తెల్లదోమ, ఆకు ముడుత మరియు మార్కెట్ ధరల విశ్లేషణ.',
      hi: 'टमाटर की संकर किस्में, सफेद मक्खी, लीफ कर्ल और स्थानीय मंडी भाव की चर्चा।',
      en: 'Hybrid varieties, whitefly & leaf curl control, staking, and market price updates.',
    },
    member_count: 326,
    aeo_present: true,
    aeo_name: 'Srinivas Rao (AEO Medchal)',
    is_joined: false,
    recent_activity: '35 minutes ago',
    sample_discussions_count: 19,
  },
  {
    id: 'group-crop-chilli',
    type: 'CROP',
    crop: 'Chilli',
    icon: '🌶️',
    name: {
      te: 'మిరప సాగుదారుల వేదిక',
      hi: 'मिर्च किसान मंच',
      en: 'Chilli Cultivators Hub',
    },
    description: {
      te: 'నల్ల తామర పురుగు నివారణ, డ్రిప్ ఎరువులు, ఆరబెట్టే పద్ధతులపై క్షేత్ర స్థాయి అనుభవాలు.',
      hi: 'काली थ्रिप्स प्रबंधन, ड्रिप फर्टिगेशन और उन्नत तुड़ाई विधियों पर अनुभव साझा।',
      en: 'Black thrips integrated pest management, fertigation, and post-harvest drying.',
    },
    member_count: 298,
    aeo_present: true,
    aeo_name: 'K. Sunitha (AEO Ghatkesar)',
    is_joined: true,
    recent_activity: '1 hour ago',
    sample_discussions_count: 16,
  },
  {
    id: 'group-crop-cotton',
    type: 'CROP',
    crop: 'Cotton',
    icon: '🌿',
    name: {
      te: 'పత్తి రైతుల మండలి',
      hi: 'कपास किसान परिषद',
      en: 'Cotton Farmers Council',
    },
    description: {
      te: 'గులాబీ రంగు కాయ తొలుచు పురుగు, ఎర పంటలు, సీసీఐ కొనుగోలు కేంద్రాల వివరాలు.',
      hi: 'गुलाबी सुंडी नियंत्रण, फेरोमोन ट्रैप और सीसीआई खरीद केंद्रों की जानकारी।',
      en: 'Pink bollworm pheromone trapping, trap cropping, and MSP procurement details.',
    },
    member_count: 415,
    aeo_present: false,
    is_joined: false,
    recent_activity: '3 hours ago',
    sample_discussions_count: 14,
  },
  {
    id: 'group-crop-mango',
    type: 'CROP',
    crop: 'Mango',
    icon: '🥭',
    name: {
      te: 'మామిడి తోటల బృందం',
      hi: 'आम बागवान समूह',
      en: 'Mango Orchard Keepers',
    },
    description: {
      te: 'బేనిషాన్, హిమాయత్ రకాల పూత రక్షణ, సూక్ష్మధాతు లోపాల సవరణ మరియు కాయ సైజు పెంపు.',
      hi: 'आम के बौर की सुरक्षा, तेला कीट नियंत्रण और फल विकास हेतु छिड़काव।',
      en: 'Blossom protection, mango hopper management, micronutrient sprays, and fruit fly traps.',
    },
    member_count: 194,
    aeo_present: true,
    aeo_name: 'Dr. V. Prasad (Horticulture Officer)',
    is_joined: false,
    recent_activity: '5 hours ago',
    sample_discussions_count: 9,
  },

  // Nearby Groups with configurable distance
  {
    id: 'group-nearby-1',
    type: 'NEARBY',
    crop: 'Tomato',
    icon: '🍅',
    name: {
      te: 'ఘట్కేసర్ టమాటా సాగుదారులు',
      hi: 'घटकेसर टमाटर किसान',
      en: 'Ghatkesar Tomato Farmers',
    },
    distance_km: 3.2,
    approximate_locality: 'Padamati Sai Guda & Ghatkesar',
    member_count: 142,
    aeo_present: true,
    aeo_name: 'Srinivas Rao (AEO)',
    is_joined: true,
    recent_activity: '8 mins ago',
  },
  {
    id: 'group-nearby-2',
    type: 'NEARBY',
    crop: 'Rice',
    icon: '🌾',
    name: {
      te: 'ఏదులాబాద్ వరి రైతులు',
      hi: 'एदुलाबाद धान किसान',
      en: 'Edulabad Rice Farmers',
    },
    distance_km: 5.7,
    approximate_locality: 'Edulabad Village Cluster',
    member_count: 218,
    aeo_present: true,
    aeo_name: 'Srinivas Rao (AEO)',
    is_joined: false,
    recent_activity: '45 mins ago',
  },
  {
    id: 'group-nearby-3',
    type: 'NEARBY',
    crop: 'Chilli',
    icon: '🌶️',
    name: {
      te: 'పోచారం మిరప రైతుల క్లస్టర్',
      hi: 'पोचारम मिर्च किसान क्लस्टर',
      en: 'Pocharam Chilli Cluster',
    },
    distance_km: 8.4,
    approximate_locality: 'Pocharam & Korremula',
    member_count: 95,
    aeo_present: false,
    is_joined: false,
    recent_activity: '2 hours ago',
  },
  {
    id: 'group-nearby-4',
    type: 'NEARBY',
    crop: 'Cotton',
    icon: '🌿',
    name: {
      te: 'కీసర పత్తి రైతుల సంఘం',
      hi: 'कीसस कपास किसान संघ',
      en: 'Keesara Cotton Growers',
    },
    distance_km: 14.2,
    approximate_locality: 'Keesara Mandal',
    member_count: 310,
    aeo_present: true,
    aeo_name: 'R. Shekhar (AEO Keesara)',
    is_joined: false,
    recent_activity: '4 hours ago',
  },
  {
    id: 'group-nearby-5',
    type: 'NEARBY',
    crop: 'Mango',
    icon: '🥭',
    name: {
      te: 'మేడ్చల్ మామిడి ఉత్పత్తిదారులు',
      hi: 'मेदचल आम उत्पादक',
      en: 'Medchal Mango Producers',
    },
    distance_km: 22.8,
    approximate_locality: 'Medchal North Cluster',
    member_count: 168,
    aeo_present: true,
    aeo_name: 'Dr. V. Prasad',
    is_joined: false,
    recent_activity: '6 hours ago',
  },
];

// =============================================================================
// PROBLEM CLUSTERS SEED DATA (Grounded in ICAR/ANGRAU Diagnostics)
// =============================================================================

export const INITIAL_PROBLEMS = [
  {
    id: 'prob-cluster-1',
    title: {
      te: '🚨 టమాటా ఆకు ముడుత & తెల్లదోమ వ్యాప్తి',
      hi: '🚨 टमाटर लीफ कर्ल और सफेद मक्खी का प्रकोप',
      en: '🚨 Tomato Leaf Curl & Whitefly Outbreak',
    },
    crop: 'Tomato',
    crop_icon: '🍅',
    status: 'AEO Verified', // Farmer Reported | Emerging Problem | Under Observation | Under Investigation | AEO Verified | Resolved
    status_code: 'AEO_VERIFIED',
    affected_farmers_count: 24,
    affected_mandals_count: 3,
    approximate_area: 'Ghatkesar & Keesara Mandals',
    total_reports_count: 31,
    first_reported: '3 days ago',
    latest_activity: '15 mins ago',
    user_facing_this_too: false,
    symptoms: {
      te: 'ఆకులు పైకి దోనెలా ముడుచుకుపోవడం, కణుపుల మధ్య దూరం తగ్గి మొక్క గిడసబారిపోవడం, పసుపు రంగులోకి మారడం.',
      hi: 'पत्तियां ऊपर की ओर मुड़ना, पौधों का बौना होना और किनारों से पीला पड़ना।',
      en: 'Upward curling of leaves, shortened internodes, stunted bushy growth, and severe chlorosis.',
    },
    aeo_verified_response: {
      officer_name: 'Srinivas Rao',
      officer_id: 'AEO-MDCL-014',
      designation: 'Agricultural Extension Officer, Ghatkesar',
      verification_date: 'Yesterday, 04:30 PM',
      summary: {
        te: 'ఫీల్డ్ విజిట్‌లో వైట్ ఫ్లై (Bemisia tabaci) ఉధృతి గమనించబడింది. ఇది టొమాటో లీఫ్ కర్ల్ వైరస్‌ను వేగంగా వ్యాపింపజేస్తోంది. రైతులు సమగ్ర సస్యరక్షణ చర్యలు పాటించాలి.',
        hi: 'खेत निरीक्षण में सफेद मक्खी की अत्यधिक मौजूदगी पाई गई, जो इस वायरस को फैला रही है। तुरंत अनुशंसित एकीकृत कीट प्रबंधन अपनाएं।',
        en: 'Field inspection confirmed high infestation of Whitefly (Bemisia tabaci) acting as vector for Tomato Leaf Curl Begomovirus. Immediate area-wide coordinated spray recommended.',
      },
      recommended_action: {
        te: '1. ఎకరానికి 15-20 పసుపు జిగురు అట్టలు పెట్టండి.\n2. డైఫెంథియురాన్ 50% WP (1.25 గ్రా/లీటర్) లేదా ఇమిడాక్లోప్రిడ్ 17.8% SL (0.3 ml/లీటర్) పిచికారీ చేయండి.\n3. తెగులు సోకిన తీవ్రమైన మొక్కలను పీకి నాశనం చేయండి.',
        hi: '1. प्रति एकड़ 15-20 पीले चिपचिपे कार्ड लगाएं।\n2. डाइफेंथियूरॉन 50% WP (1.25 ग्रा/ली) या इमिडाक्लोप्रिड (0.3 ml/ली) स्प्रे करें।\n3. अत्यधिक रोगग्रस्त पौधों को उखाड़कर नष्ट करें।',
        en: '1. Install 15–20 Yellow Sticky Traps per acre.\n2. Spray Diafenthiuron 50% WP @ 1.25 g/L or Imidacloprid 17.8% SL @ 0.3 ml/L.\n3. Uproot and burn severely infected virus reservoir plants.',
      },
    },
    timeline: [
      { step: '1. Initial farmer reports recorded', date: '3 days ago' },
      { step: '2. Cluster threshold met (10+ reports)', date: '2 days ago' },
      { step: '3. AEO field inspection & crop sampling', date: 'Yesterday' },
      { step: '4. Official AEO Verified Advisory published', date: 'Yesterday 04:30 PM' },
    ],
  },
  {
    id: 'prob-cluster-2',
    title: {
      te: '🚨 వరి ఆకు అగ్గి తెగులు (బ్లాస్ట్ డిసీజ్)',
      hi: '🚨 धान पत्ती झुलसा (लीफ ब्लास्ट)',
      en: '🚨 Paddy Leaf Blast (Pyricularia)',
    },
    crop: 'Rice',
    crop_icon: '🌾',
    status: 'Under Investigation',
    status_code: 'UNDER_INVESTIGATION',
    affected_farmers_count: 18,
    affected_mandals_count: 2,
    approximate_area: 'Edulabad & Padamati Sai Guda',
    total_reports_count: 22,
    first_reported: '2 days ago',
    latest_activity: '1 hour ago',
    user_facing_this_too: false,
    symptoms: {
      te: 'ఆకులపై కంటి ఆకారపు బూడిద రంగు మచ్చలు, చుట్టూ ముదురు గోధుమ రంగు అంచు. మంచు కురిసినప్పుడు వేగంగా వ్యాపిస్తోంది.',
      hi: 'पत्तियों पर स्पिंडल के आकार के धब्बे जिनका केंद्र राख जैसा और किनारा भूरा होता है।',
      en: 'Diamond/spindle-shaped lesions with grey center and reddish-brown borders on leaves.',
    },
    aeo_verified_response: null,
    timeline: [
      { step: '1. First report by Balraj Goud', date: '2 days ago' },
      { step: '2. 18 farmers confirmed facing this issue', date: 'Yesterday' },
      { step: '3. AEO scheduled verification visit', date: 'Today' },
    ],
  },
  {
    id: 'prob-cluster-3',
    title: {
      te: '🚨 మిరప నల్ల తామర పురుగు & పూత రాలడం',
      hi: '🚨 मिर्च काली थ्रिप्स और फूल गिरना',
      en: '🚨 Chilli Invasive Black Thrips Infestation',
    },
    crop: 'Chilli',
    crop_icon: '🌶️',
    status: 'Emerging Problem',
    status_code: 'EMERGING_PROBLEM',
    affected_farmers_count: 12,
    affected_mandals_count: 1,
    approximate_area: 'Pocharam & Korremula',
    total_reports_count: 15,
    first_reported: '4 days ago',
    latest_activity: '3 hours ago',
    user_facing_this_too: false,
    symptoms: {
      te: 'పూలు రాలిపోవడం, లేత చిగుళ్ళు నల్లబడటం, ఆకులు పైకి ముడుచుకుపోయి గిడసబారడం.',
      hi: 'फूलों का गिरना, कलियों का काला होना और पत्तियों का ऊपर मुड़ जाना।',
      en: 'Black thrips feeding inside flower buds causing premature blossom drop and upward curling.',
    },
    aeo_verified_response: null,
    timeline: [
      { step: '1. Initial symptoms reported', date: '4 days ago' },
      { step: '2. 12 farmers flagged "Facing This Too"', date: '2 days ago' },
      { step: '3. Under observation by mandal agriculture office', date: 'Active' },
    ],
  },
  {
    id: 'prob-cluster-4',
    title: {
      te: '🚨 పత్తి గులాబీ రంగు కాయ తొలుచు పురుగు',
      hi: '🚨 कपास गुलाबी सुंडी प्रकोप',
      en: '🚨 Cotton Pink Bollworm Rosetting',
    },
    crop: 'Cotton',
    crop_icon: '🌿',
    status: 'Farmer Reported',
    status_code: 'FARMER_REPORTED',
    affected_farmers_count: 7,
    affected_mandals_count: 2,
    approximate_area: 'Keesara Mandal Border',
    total_reports_count: 9,
    first_reported: '5 days ago',
    latest_activity: '6 hours ago',
    user_facing_this_too: false,
    symptoms: {
      te: 'పువ్వులు రోసెట్ ఆకారంలో ముడుచుకుపోవడం, కాయల లోపల గులాబీ రంగు లార్వాలు కనిపించడం.',
      hi: 'गुलाब के आकार में फूलों का बंद होना और डोडे में गुलाबी सूंडी।',
      en: 'Rosetted flowers and exit/entry holes in developing bolls with pinkish caterpillars inside.',
    },
    aeo_verified_response: null,
    timeline: [
      { step: '1. Farmer observations posted', date: '5 days ago' },
      { step: '2. Pheromone trap alerts requested', date: 'Yesterday' },
    ],
  },
];

// =============================================================================
// GLOBAL NOTIFICATIONS SEED DATA (For Main Farmer Home)
// =============================================================================

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    category: 'AEO_UPDATE', // AEO_UPDATE | AEO_ANNOUNCEMENT | COMMUNITY
    title: {
      te: '🛡️ AEO మీ సమస్యను పరిశీలించారు',
      hi: '🛡️ AEO ने आपकी समस्या की समीक्षा की',
      en: '🛡️ AEO Reviewed Your Field Problem',
    },
    message: {
      te: 'అధికారి శ్రీనివాస్ రావు మీ టమాటా ఆకు ముడుత సమస్యపై అధికారిక సిఫార్సును జారీ చేశారు.',
      hi: 'कृषि अधिकारी श्रीनिवास राव ने आपके टमाटर लीफ कर्ल पर आधिकारिक सलाह जारी की।',
      en: 'AEO Srinivas Rao issued verified management advice for your Tomato Leaf Curl complaint.',
    },
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    is_read: false,
    action_type: 'PROBLEM_DETAIL',
    target_id: 'prob-cluster-1',
  },
  {
    id: 'notif-2',
    category: 'AEO_ANNOUNCEMENT',
    title: {
      te: '📢 అధికారిక వ్యవసాయ హెచ్చరిక (వర్షపాతం & తెగుళ్లు)',
      hi: '📢 आधिकारिक कृषि परामर्श (भारी वर्षा और कीट चेतावनी)',
      en: '📢 Official Agricultural Advisory (Rainfall & Pest Warning)',
    },
    message: {
      te: 'రాగల 48 గంటల్లో భారీ వర్షాలు కురిసే అవకాశం ఉంది. వరి, మిరప పొలాల్లో నీరు నిలవకుండా మురుగు కాల్వలు సిద్ధం చేయండి.',
      hi: 'अगले 48 घंटों में भारी बारिश की संभावना। धान और मिर्च के खेतों से जल निकासी सुनिश्चित करें।',
      en: 'Heavy showers expected over next 48 hours. Ensure proper drainage trenches in paddy and chilli fields.',
    },
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    is_read: false,
    action_type: 'ANNOUNCEMENT',
    target_id: 'ann-1',
  },
  {
    id: 'notif-3',
    category: 'COMMUNITY',
    title: {
      te: '👍 మీ సలహా 24 మంది రైతులకు ఉపయోగపడింది',
      hi: '👍 आपकी सलाह 24 किसानों के काम आई',
      en: '👍 24 Farmers Marked "Worked for Me" on Your Advice',
    },
    message: {
      te: 'మీరు పసుపు జిగురు అట్టల గురించి పోస్ట్ చేసిన కామెంట్‌ను 24 మంది రైతులు ఉపయోగపడిందని నిర్ధారించారు.',
      hi: 'पीले स्टिकी ट्रैप पर आपकी टिप्पणी को 24 साथी किसानों ने "Worked for Me" से सराहा।',
      en: 'Farmers confirmed your yellow sticky trap suggestion helped resolve their whitefly issue.',
    },
    timestamp: new Date(Date.now() - 3600000 * 9).toISOString(),
    is_read: true,
    action_type: 'COMMUNITY_POST',
    target_id: 'post-1',
  },
];

// =============================================================================
// AEO ANNOUNCEMENTS SEED DATA
// =============================================================================

export const INITIAL_ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    title: 'Urgent: Heavy Rainfall Alert & Post-Rain Pest Management',
    crop: 'All Crops (Paddy, Chilli, Tomato Focus)',
    priority: 'Urgent',
    issued_by: 'Srinivas Rao (Agricultural Extension Officer)',
    officer_id: 'AEO-MDCL-014',
    department: 'Department of Agriculture, Telangana',
    target_area: 'Ghatkesar & Keesara Mandals',
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    content: {
      te: 'రాగల 48 గంటల్లో మేడ్చల్ పరిసర ప్రాంతాల్లో 60-80mm భారీ వర్షపాతం నమోదయ్యే అవకాశం ఉంది.\n1. వరి నారుమడులు మరియు ప్రధాన పొలాలలో నీరు నిల్వ ఉండకుండా వెంటనే డ్రైనేజీ కాలువలను శుభ్రం చేయండి.\n2. వర్షం ఆగిన వెంటనే మిరప మరియు టమాటా తోటల్లో కాపర్ ఆక్సిక్లోరైడ్ (3 గ్రా/లీ) పిచికారీ చేయడం ద్వారా కొమ్మ ఎండు, బాక్టీరియల్ మచ్చల నుండి రక్షణ పొందవచ్చు.\n3. వర్షాల సమయంలో ఎట్టి పరిస్థితుల్లోనూ యూరియా లేదా నత్రజని ఎరువులు వేయరాదు.',
      hi: 'आगामी 48 घंटों में 60-80mm तक भारी बारिश की संभावना है।\n1. धान और सब्जी के खेतों में तुरंत जल निकासी नालियां साफ करें।\n2. बारिश रुकते ही मिर्च और टमाटर में कॉपर ऑक्सीक्लोराइड (3g/L) का छिड़काव करें।\n3. वर्षा के दौरान यूरिया का छिड़काव बिल्कुल न करें।',
      en: 'High rainfall (60-80mm) forecasted in Medchal–Malkajgiri over the next 48 hours.\n1. Ensure immediate drainage of stagnant water from paddy and vegetable fields.\n2. Post-rain, apply preventive spray of Copper Oxychloride 50% WP @ 3g/L against bacterial rot in tomato & chilli.\n3. Suspend all urea top-dressing until soils reach optimum field capacity.',
    },
  },
  {
    id: 'ann-2',
    title: 'Subsidy on Pheromone Traps & Bio-Pesticides for Cotton & Chilli Farmers',
    crop: 'Cotton & Chilli',
    priority: 'High',
    issued_by: 'Department of Agriculture, Medchal',
    officer_id: 'AEO-HQ-002',
    department: 'State Agriculture Extension Network',
    target_area: 'Entire District',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    content: {
      te: 'రైతు భరోసా కేంద్రాల్లో పత్తి కోసం పింక్ బోల్‌వార్మ్ ఫెరమోన్ ట్రాప్‌లు 75% సబ్సిడీతో పంపిణీ చేయబడుతున్నాయి. పట్టాదారు పాస్‌బుక్‌తో మండల వ్యవసాయ అధికారిని సంప్రదించండి.',
      hi: 'कपास किसानों हेतु गुलाबी सुंडी फेरोमोन ट्रैप 75% सब्सिडी पर कृषि केंद्रों पर उपलब्ध हैं। पासबुक के साथ तुरंत संपर्क करें।',
      en: 'Pheromone traps for pink bollworm monitoring in cotton now available at 75% subsidy at Rythu Seva Kendrams. Carry farmer passbook.',
    },
  },
];

// =============================================================================
// STORAGE HELPERS & DATA ACCESS
// =============================================================================

function getStored(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(data);
  } catch {
    return fallback;
  }
}

function setStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('krishi_community_storage_updated'));
  } catch (err) {
    console.warn('Storage write failed', err);
  }
}

// 1. POSTS API
export function getAllPosts() {
  return getStored(STORAGE_KEYS.POSTS, INITIAL_POSTS);
}

export function createCommunityPost(postData) {
  const posts = getAllPosts();
  const newPost = {
    id: `post-${Date.now()}`,
    crop: postData.crop || 'Crop',
    crop_icon: getCropIcon(postData.crop),
    author: postData.author || {
      name: 'Farmer',
      village: 'Local Village',
      mandal: 'Ghatkesar',
    },
    title: postData.title || (postData.content ? postData.content.slice(0, 60) + '...' : 'Farmer Experience'),
    content: {
      te: postData.contentTe || postData.content,
      hi: postData.contentHi || postData.content,
      en: postData.contentEn || postData.content,
    },
    original_language: postData.originalLanguage || 'te',
    approximate_location: postData.location || 'Ghatkesar Mandal (~2.5 km away)',
    severity: postData.severity || 'Medium',
    created_at: new Date().toISOString(),
    photo_url: postData.photoUrl || null,
    has_voice: Boolean(postData.hasVoice),
    voice_duration: postData.voiceDuration || '0:24',
    is_submitted_problem: Boolean(postData.isSubmittedProblem),
    related_incident_ref: postData.relatedIncidentRef || null,
    worked_for_me_count: 0,
    has_user_worked_for_me: false,
    comments: [],
  };

  const updated = [newPost, ...posts];
  setStored(STORAGE_KEYS.POSTS, updated);
  return newPost;
}

export function togglePostWorkedForMe(postId) {
  const posts = getAllPosts();
  const updated = posts.map((p) => {
    if (p.id === postId) {
      const nowActive = !p.has_user_worked_for_me;
      return {
        ...p,
        has_user_worked_for_me: nowActive,
        worked_for_me_count: nowActive ? p.worked_for_me_count + 1 : Math.max(0, p.worked_for_me_count - 1),
      };
    }
    return p;
  });
  setStored(STORAGE_KEYS.POSTS, updated);
  return updated;
}

export function addCommentToPost(postId, commentData) {
  const posts = getAllPosts();
  let addedComment = null;
  const updated = posts.map((p) => {
    if (p.id === postId) {
      addedComment = {
        id: `comm-${Date.now()}`,
        author: commentData.author || {
          name: 'Farmer',
          village: 'Ghatkesar',
          role: 'Farmer',
          is_officer: false,
        },
        content: {
          te: commentData.contentTe || commentData.content,
          hi: commentData.contentHi || commentData.content,
          en: commentData.contentEn || commentData.content,
        },
        original_language: commentData.originalLanguage || 'te',
        created_at: new Date().toISOString(),
        has_voice: Boolean(commentData.hasVoice),
        voice_duration: commentData.voiceDuration || '0:20',
        worked_for_me_count: 0,
        has_user_worked_for_me: false,
        is_officer: Boolean(commentData.isOfficer),
      };
      return {
        ...p,
        comments: [...(p.comments || []), addedComment],
      };
    }
    return p;
  });
  setStored(STORAGE_KEYS.POSTS, updated);
  return addedComment;
}

export function toggleCommentWorkedForMe(postId, commentId) {
  const posts = getAllPosts();
  const updated = posts.map((p) => {
    if (p.id === postId) {
      const updatedComments = (p.comments || []).map((c) => {
        if (c.id === commentId) {
          const nowActive = !c.has_user_worked_for_me;
          return {
            ...c,
            has_user_worked_for_me: nowActive,
            worked_for_me_count: nowActive ? c.worked_for_me_count + 1 : Math.max(0, c.worked_for_me_count - 1),
          };
        }
        return c;
      });
      // Sort comments so that highest "Worked for Me" appears on top!
      updatedComments.sort((a, b) => (b.worked_for_me_count || 0) - (a.worked_for_me_count || 0));
      return {
        ...p,
        comments: updatedComments,
      };
    }
    return p;
  });
  setStored(STORAGE_KEYS.POSTS, updated);
  return updated;
}

// 2. GROUPS API
export function getAllGroups() {
  return getStored(STORAGE_KEYS.GROUPS, INITIAL_GROUPS);
}

export function toggleGroupMembership(groupId) {
  const groups = getAllGroups();
  const updated = groups.map((g) => {
    if (g.id === groupId) {
      const isNowJoined = !g.is_joined;
      return {
        ...g,
        is_joined: isNowJoined,
        member_count: isNowJoined ? g.member_count + 1 : Math.max(0, g.member_count - 1),
      };
    }
    return g;
  });
  setStored(STORAGE_KEYS.GROUPS, updated);
  return updated;
}

// 3. PROBLEMS API
export function getAllProblems() {
  return getStored(STORAGE_KEYS.PROBLEMS, INITIAL_PROBLEMS);
}

export function toggleProblemFacingToo(problemId) {
  const problems = getAllProblems();
  let isNowFacing = false;
  const updated = problems.map((prob) => {
    if (prob.id === problemId) {
      isNowFacing = !prob.user_facing_this_too;
      return {
        ...prob,
        user_facing_this_too: isNowFacing,
        affected_farmers_count: isNowFacing ? prob.affected_farmers_count + 1 : Math.max(1, prob.affected_farmers_count - 1),
        total_reports_count: isNowFacing ? prob.total_reports_count + 1 : prob.total_reports_count,
      };
    }
    return prob;
  });
  setStored(STORAGE_KEYS.PROBLEMS, updated);
  return { updated, isNowFacing };
}

// 4. NOTIFICATIONS API
export function getAllNotifications() {
  return getStored(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
}

export function markNotificationAsRead(notifId) {
  const notifs = getAllNotifications();
  const updated = notifs.map((n) => (n.id === notifId ? { ...n, is_read: true } : n));
  setStored(STORAGE_KEYS.NOTIFICATIONS, updated);
  return updated;
}

export function markAllNotificationsAsRead() {
  const notifs = getAllNotifications();
  const updated = notifs.map((n) => ({ ...n, is_read: true }));
  setStored(STORAGE_KEYS.NOTIFICATIONS, updated);
  return updated;
}

export function getUnreadNotificationsCount() {
  const notifs = getAllNotifications();
  return notifs.filter((n) => !n.is_read).length;
}

// 5. ANNOUNCEMENTS API
export function getAllAnnouncements() {
  return getStored(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
}

export function createAeoAnnouncement(data) {
  const announcements = getAllAnnouncements();
  const newAnn = {
    id: `ann-${Date.now()}`,
    title: data.title,
    crop: data.crop || 'All Crops',
    priority: data.priority || 'Normal',
    issued_by: data.officer_name || 'Agriculture Extension Officer',
    officer_id: data.officer_id || 'AEO-001',
    department: 'Department of Agriculture, Telangana',
    target_area: data.target_area || 'District Wide',
    created_at: new Date().toISOString(),
    content: {
      te: data.messageTe || data.message,
      hi: data.messageHi || data.message,
      en: data.messageEn || data.message,
    },
  };

  const updatedAnn = [newAnn, ...announcements];
  setStored(STORAGE_KEYS.ANNOUNCEMENTS, updatedAnn);

  // Automatically trigger a Farmer Notification for this announcement!
  const notifs = getAllNotifications();
  const newNotif = {
    id: `notif-ann-${Date.now()}`,
    category: 'AEO_ANNOUNCEMENT',
    title: {
      te: `📢 కొత్త AEO ప్రకటన: ${data.title}`,
      hi: `📢 नई AEO घोषणा: ${data.title}`,
      en: `📢 New Official AEO Announcement: ${data.title}`,
    },
    message: {
      te: data.messageTe || data.message,
      hi: data.messageHi || data.message,
      en: data.messageEn || data.message,
    },
    timestamp: new Date().toISOString(),
    is_read: false,
    action_type: 'ANNOUNCEMENT',
    target_id: newAnn.id,
  };
  setStored(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...notifs]);

  return newAnn;
}

// =============================================================================
// SPEECH SYNTHESIS & VOICE UTILITIES
// =============================================================================

export function speakText(text, lang = 'te', onEnd = null) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.warn('SpeechSynthesis not supported');
    if (onEnd) onEnd();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  // Configure appropriate voice code
  if (lang === 'te') {
    utterance.lang = 'te-IN';
  } else if (lang === 'hi') {
    utterance.lang = 'hi-IN';
  } else {
    utterance.lang = 'en-IN';
  }

  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

// Helper to get crop icon
export function getCropIcon(cropName) {
  if (!cropName) return '🌱';
  const c = cropName.toLowerCase();
  if (c.includes('rice') || c.includes('వరి') || c.includes('धान') || c.includes('paddy')) return '🌾';
  if (c.includes('tomato') || c.includes('టమాటా') || c.includes('టమోటా') || c.includes('टमाटर')) return '🍅';
  if (c.includes('chilli') || c.includes('chili') || c.includes('మిరప') || c.includes('मिर्च')) return '🌶️';
  if (c.includes('cotton') || c.includes('పత్తి') || c.includes('कपास')) return '🌿';
  if (c.includes('mango') || c.includes('మామిడి') || c.includes('आम')) return '🥭';
  return '🌱';
}
