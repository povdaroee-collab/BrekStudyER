// ហៅ Global Firebase functions
const {
  initializeApp,
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  getDatabase,
  ref,
  onValue,
  set,
  push,
  update,
  query: rtdbQuery, 
  orderByChild,
  equalTo,
  remove,
  get
} = window.firebase;

const { useState, useEffect, useCallback, useMemo, useRef } = React;

// =================================================================
// 1. CONSTANTS & CONFIGS
// =================================================================
const USER_PASSWORD = '4545ak0'; // Default, នឹងត្រូវបាន überschrieben ដោយ Firebase
const OVERTIME_LIMIT_MINUTES = 15;

const firebaseConfigRead = {
  apiKey: "AIzaSyAc2g-t9A7du3K_nI2fJnw_OGxhmLfpP6s",
  authDomain: "dilistname.firebaseapp.com",
  databaseURL: "https://dilistname-default-rtdb.firebaseio.com",
  projectId: "dilistname",
  storageBucket: "dilistname.firebasestorage.app",
  messagingSenderId: "897983357871",
  appId: "1:897983357871:web:42a046bc9fb3e0543dc55a",
  measurementId: "G-NQ798D9J6K"
};

const firebaseConfigWrite = {
  apiKey: "AIzaSyA1YBg1h5PAxu3vB7yKkpcirHRmLVl_VMI",
  authDomain: "brakelist-5f07f.firebaseapp.com",
  databaseURL: "https://brakelist-5f07f-default-rtdb.firebaseio.com",
  projectId: "brakelist-5f07f",
  storageBucket: "brakelist-5f07f.firebasestorage.app",
  messagingSenderId: "1032751366057",
  appId: "1:1032751366057:web:b23f1e7f3a093a496a4eb8",
  measurementId: "G-51RMC51XZW"
};


// =================================================================
// 2. HELPER FUNCTIONS
// =================================================================
const today = new Date();
const todayString = today.toISOString().split('T')[0]; // 'YYYY-MM-DD'
const displayDate = today.toLocaleString('km-KH', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

const getTodayLocalDateString = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().split('T')[0];
};

const getTodayLocalMonthString = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().substring(0, 7); // 'YYYY-MM'
};

const calculateDuration = (startTimeIso, endTimeIso) => {
  if (!startTimeIso || !endTimeIso) {
    return 0;
  }
  try {
    const start = new Date(startTimeIso);
    const end = new Date(endTimeIso);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    return diffMins;
  } catch (e) {
    console.error("Error calculating duration:", e);
    return 0;
  }
};

// =================================================================
// 3. TRANSLATIONS (Object ភាសា)
// =================================================================
const translations = {
  km: {
    appTitle: "កត់ត្រាម៉ោងសម្រាក",
    searchPlaceholder: "ស្វែងរកអត្តលេខ/ឈ្មោះ",
    studentNotFound: "រកមិនឃើញនិស្សិត...",
    idNumber: "អត្តលេខ",
    class: "ថ្នាក់",
    photoOf: "រូបថតរបស់",
    noName: "គ្មានឈ្មោះ",
    checkOut: "ចេញសម្រាក",
    checkIn: "ចូលវិញ",
    statusNotYet: "មិនទាន់សម្រាក",
    statusOnBreak: "កំពុងសម្រាក",
    statusOnBreakShort: "កំពុងសម្រាក...",
    statusCompleted: "សម្រាករួច",
    statusPassOut: "កាតអស់!",
    statusPass: "កាត",
    overtime: "លើស",
    minutes: "នាទី",
    specialCase: "ករណីពិសេស",
    specialCaseShort: "ពិសេស",
    deleteTooltip: "លុបទិន្នន័យនេះ",
    checkInTooltip: "ចុចចូលវិញ",
    noStudentsOnBreak: "មិនមាននិស្សិតកំពុងសម្រាកទេ",
    historyToday: "ប្រវត្តិ (ថ្ងៃនេះ)",
    adminTitle: "មុខងារ Admin",
    multiSelect: "ជ្រើសរើស (Multi-Select)",
    deleteByDate: "លុបតាមថ្ងៃ",
    deleteByDateButton: "លុបប្រចាំថ្ងៃ",
    deleteByMonth: "លុបតាមខែ",
    deleteByMonthButton: "លុបប្រចាំខែ",
    deleting: "កំពុងលុប...",
    deleteNotFound: "រកមិនឃើញទិន្នន័យសម្រាប់លុបទេ។",
    deleteSuccess: (count) => `លុប ${count} record បានជោគជ័យ!`,
    deleteConfirmMessage: (name) => `តើអ្នកប្រាកដទេថាចង់លុបទិន្នន័យសម្រាករបស់ ${name}?`,
    deleteSelectedTitle: (count) => `តើអ្នកប្រាកដទេថាចង់លុប ${count} record ដែលបានជ្រើសរើស?`,
    deleteByDateTitle: (date) => `លុបទិន្នន័យតាមថ្ងៃ (${date})?`,
    deleteByMonthTitle: (month) => `លុបទិន្នន័យតាមខែ (${month})?`,
    deleteTitle: "លុបទិន្នន័យ?",
    cancel: "បោះបង់",
    confirm: "បញ្ជាក់",
    delete: "លុប",
    passwordRequired: "ទាមទារ Password",
    passwordPlaceholder: "Password...",
    passwordError: "Password មិនត្រឹមត្រូវ!",
    scanToComeBack: "ស្កេនកាតចូលវិញ",
    cameraError: "មិនអាចបើកកាមេរ៉ាបាន។",
    processing: "កំពុងដំណើរការ...",
    scanned: "ស្កេនបាន",
    scanPassNotFound: (passNumber) => `កាត ${passNumber} បានចូលវិញហើយ`,
    alertErrorTitle: "មានបញ្ហា",
    alertSuccessTitle: "បានជោគជ័យ",
    ok: "យល់ព្រម (OK)",
    invalidNumber: "សូមបញ្ចូលតែตัวเลขប៉ុណ្ណោះ។",
    footer: "អភិវឌ្ឍន៍កម្មវិធី : IT SUPPORT",
    // Settings Page
    settingsTitle: "ការកំណត់",
    passManagement: "គ្រប់គ្រងកាត",
    passTotal: "កាតសរុប",
    passInUse: "កំពុងប្រើ",
    passAvailable: "នៅសល់",
    editPassTotal: "កែសម្រួលចំនួនកាតសរុប",
    editPassTotalPrompt: "សូមបញ្ចូលចំនួនកាតសរុបថ្មី:",
    passTotalSuccess: "ចំនួនកាតសរុបបានកែប្រែ!",
    security: "សុវត្ថិភាព",
    changePassword: "ផ្លាស់ប្ដូរ Password",
    changePasswordPrompt: "សូមបញ្ចូល Password ថ្មី (យ៉ាងតិច 6 តួអក្សរ):",
    changePasswordSuccess: "Password បានផ្លាស់ប្ដូរដោយជោគជ័យ!",
    checkInMethod: "របៀប Check-in",
    checkInMethodScan: "ស្កេន QR Code",
    checkInMethodAuto: "ចុច (Auto)",
    checkInMethodPrompt: "តើអ្នកប្រាកដទេថាចង់ប្តូររបៀប Check-in?",
    checkInMethodSuccess: "របៀប Check-in បានផ្លាស់ប្ដូរ!",
    language: "ភាសា",
    background: "ផ្ទៃខាងក្រោយ",
  },
  en: {
    appTitle: "Break Time Tracker",
    searchPlaceholder: "Search ID/Name",
    studentNotFound: "Student not found...",
    idNumber: "ID Number",
    class: "Class",
    photoOf: "Photo of",
    noName: "No Name",
    checkOut: "Check Out",
    checkIn: "Check In",
    statusNotYet: "Not on break",
    statusOnBreak: "On Break",
    statusOnBreakShort: "On Break...",
    statusCompleted: "Completed",
    statusPassOut: "Passes Full!",
    statusPass: "Pass",
    overtime: "Overtime",
    minutes: "min",
    specialCase: "Special Case",
    specialCaseShort: "Special",
    deleteTooltip: "Delete this record",
    checkInTooltip: "Check In",
    noStudentsOnBreak: "No students are currently on break.",
    historyToday: "History (Today)",
    adminTitle: "Admin Functions",
    multiSelect: "Multi-Select",
    deleteByDate: "Delete by Date",
    deleteByDateButton: "Delete Date",
    deleteByMonth: "Delete by Month",
    deleteByMonthButton: "Delete Month",
    deleting: "Deleting...",
    deleteNotFound: "No records found to delete.",
    deleteSuccess: (count) => `Successfully deleted ${count} records!`,
    deleteConfirmMessage: (name) => `Are you sure you want to delete ${name}'s break record?`,
    deleteSelectedTitle: (count) => `Are you sure you want to delete ${count} selected records?`,
    deleteByDateTitle: (date) => `Delete data for date (${date})?`,
    deleteByMonthTitle: (month) => `Delete data for month (${month})?`,
    deleteTitle: "Delete Data?",
    cancel: "Cancel",
    confirm: "Confirm",
    delete: "Delete",
    passwordRequired: "Password Required",
    passwordPlaceholder: "Password...",
    passwordError: "Incorrect Password!",
    scanToComeBack: "Scan Pass to Check In",
    cameraError: "Unable to start camera.",
    processing: "Processing...",
    scanned: "Scanned",
    scanPassNotFound: (passNumber) => `Pass ${passNumber} already checked in.`,
    alertErrorTitle: "Error",
    alertSuccessTitle: "Success",
    ok: "OK",
    invalidNumber: "Please enter a valid number.",
    footer: "Developed by: IT SUPPORT",
    // Settings Page
    settingsTitle: "Settings",
    passManagement: "Pass Management",
    passTotal: "Total Passes",
    passInUse: "In Use",
    passAvailable: "Available",
    editPassTotal: "Edit Total Passes",
    editPassTotalPrompt: "Enter new total number of passes:",
    passTotalSuccess: "Total passes updated!",
    security: "Security",
    changePassword: "Change Password",
    changePasswordPrompt: "Enter new password (min 6 chars):",
    changePasswordSuccess: "Password changed successfully!",
    checkInMethod: "Check-in Method",
    checkInMethodScan: "Scan QR Code",
    checkInMethodAuto: "Click (Auto)",
    checkInMethodPrompt: "Are you sure you want to change the check-in method?",
    checkInModeSuccess: "Check-in method updated!",
    language: "Language",
    background: "Background",
  }
};

// =================================================================
// 4. BACKGROUND STYLES
// =================================================================
const backgroundStyles = {
  style1: "bg-gradient-to-br from-blue-900 to-indigo-700",
  style2: "bg-gradient-to-br from-gray-800 to-gray-900",
  style3: "bg-gradient-to-br from-green-800 to-teal-700",
  style4: "bg-gradient-to-br from-purple-800 to-pink-700",
};


// =================================================================
// 5. SVG ICONS
// =================================================================
const IconCheckOut = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> {/* <--- បានលុប mr-2 */}
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
  </svg>
);
const IconCheckIn = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 003 3h1a3 3 0 003-3V7a3 3 0 00-3-3h-1a3 3 0 00-3 3v1"></path>
  </svg>
);
const IconSearch = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
  </svg>
);
const IconClock = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);
const IconCheckCircle = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);
const IconTicket = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
  </svg>
);
const IconClose = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
  </svg>
);
const IconTrash = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
  </svg>
);
const IconNoSymbol = () => (
  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
  </svg>
);
const IconAlert = () => (
  <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
  </svg>
);
const IconSpecial = () => (
  <svg className="w-4 h-4 ml-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
  </svg>
);
const IconDotsVertical = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
  </svg>
);
const IconLock = () => (
  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
  </svg>
);
const IconQrCode = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h4v4H4zM4 16h4v4H4zM16 4h4v4h-4zM16 16h4v4h-4zM10 4h4v4h-4zM10 16h4v4h-4zM4 10h4v4H4zM16 10h4v4h-4zM10 10h4v4h-4z"></path>
  </svg>
);
const IconPencil = () => (
  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"></path>
  </svg>
);

// --- Icons សម្រាប់ Settings Page ---
const IconSettings = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
);
const IconLanguage = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m0 16V5m0 0L6 8m3-3l3 3m5 0h6M21 3v2m0 16V5m0 0L18 8m3-3l3 3M3 17h6m0 0l3 3m-3-3l-3 3"></path></svg>
);
const IconPalette = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
);
const IconToggleOn = () => (
  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
);
const IconToggleOff = () => (
  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path></svg>
);
const IconSave = () => (
  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V3"></path></svg>
);

// --- Icons សម្រាប់ Modals ស្អាតៗ ---
const IconInfo = () => (
  <svg className="w-12 h-12 text-blue-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);
const IconCheckCircleFill = () => (
  <svg className="w-12 h-12 text-green-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
);
const IconPencilSquare = () => (
  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
);


// =================================================================
// 6. ភ្ជាប់ទៅ Global Scope
// =================================================================
window.appSetup = {
  // Helpers
  getTodayLocalDateString,
  getTodayLocalMonthString,
  calculateDuration,
  todayString,
  displayDate,
  
  // Configs
  firebaseConfigRead,
  firebaseConfigWrite,
  OVERTIME_LIMIT_MINUTES,
  
  // Data
  translations,
  backgroundStyles,
  
  // Icons
  IconCheckOut,
  IconCheckIn,
  IconSearch,
  IconClock,
  IconCheckCircle,
  IconTicket,
  IconClose,
  IconTrash,
  IconNoSymbol,
  IconAlert,
  IconSpecial,
  IconDotsVertical,
  IconLock,
  IconQrCode,
  IconPencil,
  IconSettings,
  IconLanguage,
  IconPalette,
  IconToggleOn,
  IconToggleOff,
  IconSave,
  IconInfo,
  IconCheckCircleFill,
  IconPencilSquare
};
