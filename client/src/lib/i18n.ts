// Internationalization (i18n) support for AriseEDU
export type Language = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr' | 'gu' | 'kn' | 'ml' | 'or' | 'pa' | 'as';

export interface LanguageConfig {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', rtl: false },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', rtl: false },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', rtl: false },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', rtl: false },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', rtl: false },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', rtl: false },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', rtl: false },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', rtl: false },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', rtl: false },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳', rtl: false },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', rtl: false },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳', rtl: false }
];

// Translation keys and their translations
export const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.progress': 'Progress',
    'nav.quiz': 'Quiz',
    'nav.profile': 'Profile',
    'nav.syllabus': 'Syllabus',
    'nav.game': 'Game Hub',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.finish': 'Finish',
    'common.start': 'Start',
    'common.continue': 'Continue',
    'common.retry': 'Retry',
    'common.close': 'Close',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.ok': 'OK',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back!',
    'dashboard.progress': 'Your Progress',
    'dashboard.subjects': 'Subjects',
    'dashboard.achievements': 'Achievements',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.gameFeatures': 'Game Features',
    'dashboard.enterGameHub': 'Enter Game Hub',
    'dashboard.gameDescription': 'Village quests, skill trees, farming & more!',
    'dashboard.takeQuiz': 'Take Quiz',
    'dashboard.downloadLessons': 'Download Lessons',
    
    // Progress
    'progress.title': 'Your Progress',
    'progress.subtitle': 'Track your learning journey',
    'progress.level': 'Level',
    'progress.totalPoints': 'Total Points',
    'progress.dayStreak': 'Day Streak',
    'progress.achievements': 'Achievements',
    'progress.studyTime': 'Study Time',
    'progress.lessonsDone': 'Lessons Done',
    'progress.overview': 'Overview',
    'progress.subjects': 'Subjects',
    'progress.achievements': 'Achievements',
    'progress.analytics': 'Analytics',
    'progress.gameFeatures': 'Game Features Progress',
    'progress.villageLevel': 'Village Level',
    'progress.skillsUnlocked': 'Skills Unlocked',
    'progress.cropsHarvested': 'Crops Harvested',
    'progress.recentActivity': 'Recent Activity',
    'progress.levelProgress': 'Level Progress',
    'progress.weeklyActivity': 'Weekly Activity',
    'progress.studyTimeDistribution': 'Study Time Distribution',
    
    // Quiz
    'quiz.title': 'Quiz Hub',
    'quiz.subtitle': 'Choose your learning adventure',
    'quiz.traditional': 'Traditional',
    'quiz.miniGames': 'Mini Games',
    'quiz.festivals': 'Festivals',
    'quiz.community': 'Community',
    'quiz.startQuiz': 'Start Quiz',
    'quiz.playGame': 'Play Game',
    'quiz.questions': 'Questions',
    'quiz.timeLimit': 'Time Limit',
    'quiz.points': 'Points',
    'quiz.score': 'Score',
    'quiz.streak': 'Streak',
    'quiz.timeLeft': 'Time Left',
    'quiz.correct': 'Correct!',
    'quiz.wrong': 'Wrong!',
    'quiz.explanation': 'Explanation',
    'quiz.exitQuiz': 'Exit Quiz',
    'quiz.completed': 'Quiz Completed',
    'quiz.finalScore': 'Final Score',
    'quiz.tryAgain': 'Try Again',
    'quiz.nextQuiz': 'Next Quiz',
    
    // Profile
    'profile.title': 'Profile',
    'profile.subtitle': 'Manage your account and preferences',
    'profile.overview': 'Overview',
    'profile.achievements': 'Achievements',
    'profile.skills': 'Skills',
    'profile.customize': 'Customize',
    'profile.settings': 'Settings',
    'profile.name': 'Name',
    'profile.classLevel': 'Class Level',
    'profile.language': 'Language',
    'profile.avatar': 'Avatar',
    'profile.background': 'Background',
    'profile.accountSettings': 'Account Settings',
    'profile.dataManagement': 'Data Management',
    'profile.downloadData': 'Download Data',
    'profile.syncData': 'Sync Data',
    'profile.chooseAvatar': 'Choose Avatar',
    'profile.chooseBackground': 'Choose Background',
    'profile.recentActivity': 'Recent Activity',
    'profile.gameFeaturesProgress': 'Game Features Progress',
    
    // Syllabus
    'syllabus.title': 'Syllabus',
    'syllabus.subtitle': 'Your complete learning roadmap',
    'syllabus.subjects': 'Subjects',
    'syllabus.topics': 'Topics',
    'syllabus.resources': 'Resources',
    'syllabus.searchSubjects': 'Search subjects...',
    'syllabus.allDifficulties': 'All Difficulties',
    'syllabus.easy': 'Easy',
    'syllabus.medium': 'Medium',
    'syllabus.hard': 'Hard',
    'syllabus.progress': 'Progress',
    'syllabus.lessons': 'Lessons',
    'syllabus.time': 'Time',
    'syllabus.startLearning': 'Start Learning',
    'syllabus.selectSubject': 'Select a Subject',
    'syllabus.selectSubjectDescription': 'Choose a subject from the Subjects tab to view its topics and resources.',
    'syllabus.browseSubjects': 'Browse Subjects',
    'syllabus.videoLessons': 'Video Lessons',
    'syllabus.textResources': 'Text Resources',
    'syllabus.quizzes': 'Quizzes',
    'syllabus.virtualLabs': 'Virtual Labs',
    'syllabus.diagrams': 'Diagrams',
    'syllabus.downloads': 'Downloads',
    'syllabus.totalVideos': 'Total Videos',
    'syllabus.watched': 'Watched',
    'syllabus.totalDocuments': 'Total Documents',
    'syllabus.read': 'Read',
    'syllabus.totalQuizzes': 'Total Quizzes',
    'syllabus.completed': 'Completed',
    'syllabus.totalExperiments': 'Total Experiments',
    'syllabus.totalDiagrams': 'Total Diagrams',
    'syllabus.explored': 'Explored',
    'syllabus.available': 'Available',
    'syllabus.downloaded': 'Downloaded',
    
    // Game Features
    'game.villageQuest': 'Village Quest',
    'game.skillTree': 'Skill Tree',
    'game.knowledgeFarm': 'Knowledge Farm',
    'game.communityChallenges': 'Community Challenges',
    'game.miniGames': 'Mini Games',
    'game.festivalGames': 'Festival Games',
    'game.arModels': 'AR Models',
    'game.rewardsStore': 'Rewards Store',
    'game.aiTutor': 'AI Tutor',
    'game.offlineMode': 'Offline Mode',
    'game.syncData': 'Sync Data',
    'game.downloadContent': 'Download Content',
    
    // Subjects
    'subjects.mathematics': 'Mathematics',
    'subjects.science': 'Science',
    'subjects.english': 'English',
    'subjects.socialScience': 'Social Science',
    'subjects.computerScience': 'Computer Science',
    'subjects.physicalEducation': 'Physical Education',
    
    // Time
    'time.hours': 'hours',
    'time.minutes': 'minutes',
    'time.seconds': 'seconds',
    'time.days': 'days',
    'time.weeks': 'weeks',
    'time.months': 'months',
    
    // Difficulty
    'difficulty.easy': 'Easy',
    'difficulty.medium': 'Medium',
    'difficulty.hard': 'Hard',
    
    // Status
    'status.online': 'Online',
    'status.offline': 'Offline',
    'status.available': 'Available',
    'status.comingSoon': 'Coming Soon',
    'status.completed': 'Completed',
    'status.inProgress': 'In Progress',
    'status.notStarted': 'Not Started',
    
    // Actions
    'actions.play': 'Play',
    'actions.pause': 'Pause',
    'actions.stop': 'Stop',
    'actions.restart': 'Restart',
    'actions.download': 'Download',
    'actions.upload': 'Upload',
    'actions.share': 'Share',
    'actions.copy': 'Copy',
    'actions.paste': 'Paste',
    'actions.cut': 'Cut',
    'actions.undo': 'Undo',
    'actions.redo': 'Redo',
    
    // Notifications
    'notification.success': 'Success!',
    'notification.error': 'Error!',
    'notification.warning': 'Warning!',
    'notification.info': 'Info',
    'notification.quizCompleted': 'Quiz completed successfully!',
    'notification.lessonCompleted': 'Lesson completed successfully!',
    'notification.achievementUnlocked': 'Achievement unlocked!',
    'notification.levelUp': 'Level up!',
    'notification.streakBroken': 'Streak broken!',
    'notification.dataSynced': 'Data synced successfully!',
    'notification.contentDownloaded': 'Content downloaded successfully!',
    
    // Errors
    'error.network': 'Network error. Please check your connection.',
    'error.server': 'Server error. Please try again later.',
    'error.notFound': 'Content not found.',
    'error.unauthorized': 'Unauthorized access.',
    'error.forbidden': 'Access forbidden.',
    'error.validation': 'Please check your input.',
    'error.timeout': 'Request timeout. Please try again.',
    'error.offline': 'You are offline. Some features may not be available.',
    
    // Offline
    'offline.title': 'Offline Mode',
    'offline.description': 'You are currently offline. Some features may not be available.',
    'offline.availableContent': 'Available Content',
    'offline.downloadedLessons': 'Downloaded Lessons',
    'offline.cachedQuizzes': 'Cached Quizzes',
    'offline.syncWhenOnline': 'Sync when online',
    'offline.goOnline': 'Go Online',
    
    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Privacy',
    'settings.about': 'About',
    'settings.version': 'Version',
    'settings.help': 'Help',
    'settings.feedback': 'Feedback',
    'settings.logout': 'Logout',
    
    // Accessibility
    'accessibility.altText': 'Alt text',
    'accessibility.ariaLabel': 'Aria label',
    'accessibility.keyboardNavigation': 'Keyboard navigation',
    'accessibility.screenReader': 'Screen reader support',
    'accessibility.highContrast': 'High contrast mode',
    'accessibility.largeText': 'Large text mode',
    'accessibility.voiceOver': 'Voice over support'
  },
  
  hi: {
    // Navigation
    'nav.dashboard': 'डैशबोर्ड',
    'nav.progress': 'प्रगति',
    'nav.quiz': 'क्विज़',
    'nav.profile': 'प्रोफ़ाइल',
    'nav.syllabus': 'पाठ्यक्रम',
    'nav.game': 'गेम हब',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
    'common.cancel': 'रद्द करें',
    'common.save': 'सहेजें',
    'common.edit': 'संपादित करें',
    'common.delete': 'हटाएं',
    'common.back': 'वापस',
    'common.next': 'अगला',
    'common.previous': 'पिछला',
    'common.finish': 'समाप्त करें',
    'common.start': 'शुरू करें',
    'common.continue': 'जारी रखें',
    'common.retry': 'पुनः प्रयास करें',
    'common.close': 'बंद करें',
    'common.yes': 'हाँ',
    'common.no': 'नहीं',
    'common.ok': 'ठीक है',
    
    // Dashboard
    'dashboard.welcome': 'वापस स्वागत है!',
    'dashboard.progress': 'आपकी प्रगति',
    'dashboard.subjects': 'विषय',
    'dashboard.achievements': 'उपलब्धियां',
    'dashboard.quickActions': 'त्वरित क्रियाएं',
    'dashboard.gameFeatures': 'गेम सुविधाएं',
    'dashboard.enterGameHub': 'गेम हब में प्रवेश करें',
    'dashboard.gameDescription': 'गांव के क्वेस्ट, स्किल ट्री, खेती और बहुत कुछ!',
    'dashboard.takeQuiz': 'क्विज़ लें',
    'dashboard.downloadLessons': 'पाठ डाउनलोड करें',
    
    // Progress
    'progress.title': 'आपकी प्रगति',
    'progress.subtitle': 'अपनी सीखने की यात्रा को ट्रैक करें',
    'progress.level': 'स्तर',
    'progress.totalPoints': 'कुल अंक',
    'progress.dayStreak': 'दिन की लगातार सीख',
    'progress.achievements': 'उपलब्धियां',
    'progress.studyTime': 'अध्ययन समय',
    'progress.lessonsDone': 'पूर्ण पाठ',
    'progress.overview': 'अवलोकन',
    'progress.subjects': 'विषय',
    'progress.achievements': 'उपलब्धियां',
    'progress.analytics': 'विश्लेषण',
    'progress.gameFeatures': 'गेम सुविधाएं प्रगति',
    'progress.villageLevel': 'गांव स्तर',
    'progress.skillsUnlocked': 'अनलॉक कौशल',
    'progress.cropsHarvested': 'कटाई फसलें',
    'progress.recentActivity': 'हाल की गतिविधि',
    'progress.levelProgress': 'स्तर प्रगति',
    'progress.weeklyActivity': 'साप्ताहिक गतिविधि',
    'progress.studyTimeDistribution': 'अध्ययन समय वितरण',
    
    // Quiz
    'quiz.title': 'क्विज़ हब',
    'quiz.subtitle': 'अपना सीखने का रोमांच चुनें',
    'quiz.traditional': 'पारंपरिक',
    'quiz.miniGames': 'मिनी गेम्स',
    'quiz.festivals': 'त्योहार',
    'quiz.community': 'समुदाय',
    'quiz.startQuiz': 'क्विज़ शुरू करें',
    'quiz.playGame': 'गेम खेलें',
    'quiz.questions': 'प्रश्न',
    'quiz.timeLimit': 'समय सीमा',
    'quiz.points': 'अंक',
    'quiz.score': 'स्कोर',
    'quiz.streak': 'लगातार',
    'quiz.timeLeft': 'बचा समय',
    'quiz.correct': 'सही!',
    'quiz.wrong': 'गलत!',
    'quiz.explanation': 'व्याख्या',
    'quiz.exitQuiz': 'क्विज़ से बाहर निकलें',
    'quiz.completed': 'क्विज़ पूर्ण',
    'quiz.finalScore': 'अंतिम स्कोर',
    'quiz.tryAgain': 'पुनः प्रयास करें',
    'quiz.nextQuiz': 'अगली क्विज़',
    
    // Profile
    'profile.title': 'प्रोफ़ाइल',
    'profile.subtitle': 'अपना खाता और प्राथमिकताएं प्रबंधित करें',
    'profile.overview': 'अवलोकन',
    'profile.achievements': 'उपलब्धियां',
    'profile.skills': 'कौशल',
    'profile.customize': 'अनुकूलित करें',
    'profile.settings': 'सेटिंग्स',
    'profile.name': 'नाम',
    'profile.classLevel': 'कक्षा स्तर',
    'profile.language': 'भाषा',
    'profile.avatar': 'अवतार',
    'profile.background': 'पृष्ठभूमि',
    'profile.accountSettings': 'खाता सेटिंग्स',
    'profile.dataManagement': 'डेटा प्रबंधन',
    'profile.downloadData': 'डेटा डाउनलोड करें',
    'profile.syncData': 'डेटा सिंक करें',
    'profile.chooseAvatar': 'अवतार चुनें',
    'profile.chooseBackground': 'पृष्ठभूमि चुनें',
    'profile.recentActivity': 'हाल की गतिविधि',
    'profile.gameFeaturesProgress': 'गेम सुविधाएं प्रगति',
    
    // Syllabus
    'syllabus.title': 'पाठ्यक्रम',
    'syllabus.subtitle': 'आपका पूरा सीखने का रोडमैप',
    'syllabus.subjects': 'विषय',
    'syllabus.topics': 'विषय',
    'syllabus.resources': 'संसाधन',
    'syllabus.searchSubjects': 'विषय खोजें...',
    'syllabus.allDifficulties': 'सभी कठिनाई स्तर',
    'syllabus.easy': 'आसान',
    'syllabus.medium': 'मध्यम',
    'syllabus.hard': 'कठिन',
    'syllabus.progress': 'प्रगति',
    'syllabus.lessons': 'पाठ',
    'syllabus.time': 'समय',
    'syllabus.startLearning': 'सीखना शुरू करें',
    'syllabus.selectSubject': 'एक विषय चुनें',
    'syllabus.selectSubjectDescription': 'इसके विषयों और संसाधनों को देखने के लिए विषय टैब से एक विषय चुनें।',
    'syllabus.browseSubjects': 'विषय ब्राउज़ करें',
    'syllabus.videoLessons': 'वीडियो पाठ',
    'syllabus.textResources': 'टेक्स्ट संसाधन',
    'syllabus.quizzes': 'क्विज़',
    'syllabus.virtualLabs': 'वर्चुअल लैब्स',
    'syllabus.diagrams': 'आरेख',
    'syllabus.downloads': 'डाउनलोड',
    'syllabus.totalVideos': 'कुल वीडियो',
    'syllabus.watched': 'देखा गया',
    'syllabus.totalDocuments': 'कुल दस्तावेज',
    'syllabus.read': 'पढ़ा गया',
    'syllabus.totalQuizzes': 'कुल क्विज़',
    'syllabus.completed': 'पूर्ण',
    'syllabus.totalExperiments': 'कुल प्रयोग',
    'syllabus.totalDiagrams': 'कुल आरेख',
    'syllabus.explored': 'खोजा गया',
    'syllabus.available': 'उपलब्ध',
    'syllabus.downloaded': 'डाउनलोड किया गया',
    
    // Game Features
    'game.villageQuest': 'गांव क्वेस्ट',
    'game.skillTree': 'कौशल वृक्ष',
    'game.knowledgeFarm': 'ज्ञान खेती',
    'game.communityChallenges': 'समुदाय चुनौतियां',
    'game.miniGames': 'मिनी गेम्स',
    'game.festivalGames': 'त्योहार गेम्स',
    'game.arModels': 'AR मॉडल',
    'game.rewardsStore': 'पुरस्कार स्टोर',
    'game.aiTutor': 'AI ट्यूटर',
    'game.offlineMode': 'ऑफलाइन मोड',
    'game.syncData': 'डेटा सिंक करें',
    'game.downloadContent': 'सामग्री डाउनलोड करें',
    
    // Subjects
    'subjects.mathematics': 'गणित',
    'subjects.science': 'विज्ञान',
    'subjects.english': 'अंग्रेजी',
    'subjects.socialScience': 'सामाजिक विज्ञान',
    'subjects.computerScience': 'कंप्यूटर विज्ञान',
    'subjects.physicalEducation': 'शारीरिक शिक्षा',
    
    // Time
    'time.hours': 'घंटे',
    'time.minutes': 'मिनट',
    'time.seconds': 'सेकंड',
    'time.days': 'दिन',
    'time.weeks': 'सप्ताह',
    'time.months': 'महीने',
    
    // Difficulty
    'difficulty.easy': 'आसान',
    'difficulty.medium': 'मध्यम',
    'difficulty.hard': 'कठिन',
    
    // Status
    'status.online': 'ऑनलाइन',
    'status.offline': 'ऑफलाइन',
    'status.available': 'उपलब्ध',
    'status.comingSoon': 'जल्द आ रहा है',
    'status.completed': 'पूर्ण',
    'status.inProgress': 'प्रगति में',
    'status.notStarted': 'शुरू नहीं हुआ',
    
    // Actions
    'actions.play': 'चलाएं',
    'actions.pause': 'रोकें',
    'actions.stop': 'बंद करें',
    'actions.restart': 'पुनः शुरू करें',
    'actions.download': 'डाउनलोड करें',
    'actions.upload': 'अपलोड करें',
    'actions.share': 'साझा करें',
    'actions.copy': 'कॉपी करें',
    'actions.paste': 'पेस्ट करें',
    'actions.cut': 'कट करें',
    'actions.undo': 'पूर्ववत करें',
    'actions.redo': 'पुनः करें',
    
    // Notifications
    'notification.success': 'सफलता!',
    'notification.error': 'त्रुटि!',
    'notification.warning': 'चेतावनी!',
    'notification.info': 'जानकारी',
    'notification.quizCompleted': 'क्विज़ सफलतापूर्वक पूर्ण!',
    'notification.lessonCompleted': 'पाठ सफलतापूर्वक पूर्ण!',
    'notification.achievementUnlocked': 'उपलब्धि अनलॉक!',
    'notification.levelUp': 'स्तर बढ़ा!',
    'notification.streakBroken': 'लगातार सीख टूट गई!',
    'notification.dataSynced': 'डेटा सफलतापूर्वक सिंक!',
    'notification.contentDownloaded': 'सामग्री सफलतापूर्वक डाउनलोड!',
    
    // Errors
    'error.network': 'नेटवर्क त्रुटि। कृपया अपना कनेक्शन जांचें।',
    'error.server': 'सर्वर त्रुटि। कृपया बाद में पुनः प्रयास करें।',
    'error.notFound': 'सामग्री नहीं मिली।',
    'error.unauthorized': 'अनधिकृत पहुंच।',
    'error.forbidden': 'पहुंच निषिद्ध।',
    'error.validation': 'कृपया अपना इनपुट जांचें।',
    'error.timeout': 'अनुरोध समय सीमा समाप्त। कृपया पुनः प्रयास करें।',
    'error.offline': 'आप ऑफलाइन हैं। कुछ सुविधाएं उपलब्ध नहीं हो सकतीं।',
    
    // Offline
    'offline.title': 'ऑफलाइन मोड',
    'offline.description': 'आप वर्तमान में ऑफलाइन हैं। कुछ सुविधाएं उपलब्ध नहीं हो सकतीं।',
    'offline.availableContent': 'उपलब्ध सामग्री',
    'offline.downloadedLessons': 'डाउनलोड किए गए पाठ',
    'offline.cachedQuizzes': 'कैश किए गए क्विज़',
    'offline.syncWhenOnline': 'ऑनलाइन होने पर सिंक करें',
    'offline.goOnline': 'ऑनलाइन जाएं',
    
    // Settings
    'settings.title': 'सेटिंग्स',
    'settings.language': 'भाषा',
    'settings.theme': 'थीम',
    'settings.notifications': 'सूचनाएं',
    'settings.privacy': 'गोपनीयता',
    'settings.about': 'के बारे में',
    'settings.version': 'संस्करण',
    'settings.help': 'सहायता',
    'settings.feedback': 'फीडबैक',
    'settings.logout': 'लॉगआउट',
    
    // Accessibility
    'accessibility.altText': 'वैकल्पिक पाठ',
    'accessibility.ariaLabel': 'एरिया लेबल',
    'accessibility.keyboardNavigation': 'कीबोर्ड नेविगेशन',
    'accessibility.screenReader': 'स्क्रीन रीडर सहायता',
    'accessibility.highContrast': 'उच्च कंट्रास्ट मोड',
    'accessibility.largeText': 'बड़ा पाठ मोड',
    'accessibility.voiceOver': 'वॉइस ओवर सहायता'
  }
};

// Get current language from localStorage or default to English
export const getCurrentLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';
  return (localStorage.getItem('arise-language') as Language) || 'en';
};

// Set current language
export const setCurrentLanguage = (language: Language): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('arise-language', language);
  document.documentElement.lang = language;
  document.documentElement.dir = SUPPORTED_LANGUAGES.find(l => l.code === language)?.rtl ? 'rtl' : 'ltr';
};

// Get translation for current language
export const t = (key: string, language?: Language): string => {
  const currentLang = language || getCurrentLanguage();
  const translation = translations[currentLang]?.[key];
  
  if (!translation) {
    console.warn(`Translation missing for key: ${key} in language: ${currentLang}`);
    return translations.en[key] || key;
  }
  
  return translation;
};

// Initialize language on app start
export const initializeLanguage = (): void => {
  const currentLang = getCurrentLanguage();
  setCurrentLanguage(currentLang);
};

// Language context for React components
export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguageState] = React.useState<Language>(getCurrentLanguage());
  
  const changeLanguage = (language: Language) => {
    setCurrentLanguage(language);
    setCurrentLanguageState(language);
  };
  
  return {
    currentLanguage,
    changeLanguage,
    t: (key: string) => t(key, currentLanguage),
    supportedLanguages: SUPPORTED_LANGUAGES
  };
};

// Language selector component props
export interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
  className?: string;
}

// Utility function to format numbers based on language
export const formatNumber = (num: number, language: Language = getCurrentLanguage()): string => {
  const locale = language === 'hi' ? 'hi-IN' : 'en-US';
  return new Intl.NumberFormat(locale).format(num);
};

// Utility function to format dates based on language
export const formatDate = (date: Date, language: Language = getCurrentLanguage()): string => {
  const locale = language === 'hi' ? 'hi-IN' : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

// Utility function to format time based on language
export const formatTime = (date: Date, language: Language = getCurrentLanguage()): string => {
  const locale = language === 'hi' ? 'hi-IN' : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

