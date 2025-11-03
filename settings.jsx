// =================================================================
// 5. SETTINGS PAGE COMPONENT
// =================================================================

// ត្រូវប្រាកដថា File នេះ ត្រូវបានហៅ (load) បន្ទាប់ពី setup.jsx
const { 
  IconLanguage, 
  IconPalette, 
  IconTicket, 
  IconTimer, // ថ្មី
  IconToggleLeft, 
  IconToggleRight,
  IconLock,
  IconCheckOut // ថ្មី
} = window.appSetup;

const SettingsPage = ({
  t,
  language,
  setLanguage,
  background,
  setBackground,
  checkInMode,
  onEditCheckInMode,
  onEditPassword,
  passesInUse,
  totalPasses,
  onEditTotalPasses,
  overtimeLimit, // ថ្មី
  onEditOvertimeLimit // ថ្មី
}) => {

  const passesAvailable = totalPasses - passesInUse;

  // --- UI សម្រាប់ General Settings ---
  const renderGeneralSettings = () => (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-5 mb-6">
      <h3 className="text-xl font-bold text-white mb-4">{t.generalSettings}</h3>
      <div className="space-y-4">
        
        {/* Language Setting */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <IconLanguage className="w-6 h-6 text-blue-200 mr-3" />
            <span className="text-lg text-white">{t.language}</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setLanguage('km')}
              className={`px-4 py-2 rounded-full font-semibold ${language === 'km' ? 'bg-white text-blue-800' : 'bg-white/20 text-white'}`}
            >
              ខ្មែរ
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded-full font-semibold ${language === 'en' ? 'bg-white text-blue-800' : 'bg-white/20 text-white'}`}
            >
              Eng
            </button>
          </div>
        </div>
        
        {/* Background Setting */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <IconPalette className="w-6 h-6 text-blue-200 mr-3" />
            <span className="text-lg text-white">{t.background}</span>
          </div>
          <div className="flex space-x-2">
            <button onClick={() => setBackground('style1')} className={`w-8 h-8 rounded-full bg-gradient-to-br from-blue-900 to-indigo-700 border-2 ${background === 'style1' ? 'border-white' : 'border-transparent'}`}></button>
            <button onClick={() => setBackground('style2')} className={`w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-2 ${background === 'style2' ? 'border-white' : 'border-transparent'}`}></button>
            <button onClick={() => setBackground('style3')} className={`w-8 h-8 rounded-full bg-gradient-to-br from-green-800 to-teal-700 border-2 ${background === 'style3' ? 'border-white' : 'border-transparent'}`}></button>
            <button onClick={() => setBackground('style4')} className={`w-8 h-8 rounded-full bg-gradient-to-br from-purple-800 to-pink-700 border-2 ${background === 'style4' ? 'border-white' : 'border-transparent'}`}></button>
          </div>
        </div>
        
      </div>
    </div>
  );

  // --- UI សម្រាប់ Admin Settings ---
  const renderAdminSettings = () => (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-5">
      <h3 className="text-xl font-bold text-white mb-4">{t.adminSettings}</h3>
      <div className="space-y-4">

        {/* Pass Card Management */}
        <div className="p-4 bg-black/10 rounded-lg">
          <h4 className="text-lg font-semibold text-blue-200 mb-3">{t.passCardManagement}</h4>
          <div className="flex justify-around text-white mb-4">
            <div className="text-center">
              <p className="text-4xl font-bold">{passesAvailable}</p>
              <p className="text-sm text-blue-200">{t.passesAvailable}</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-red-300">{passesInUse}</p>
              <p className="text-sm text-blue-200">{t.passesInUse}</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">{totalPasses}</p>
              <p className="text-sm text-blue-200">{t.passTotal}</p>
            </div>
          </div>
          <button
            onClick={onEditTotalPasses}
            className="flex items-center justify-center w-full px-4 py-3 rounded-full text-md text-white font-bold transition-all shadow-lg bg-blue-500 hover:bg-blue-600"
          >
            <IconTicket className="w-5 h-5 mr-2" />
            {t.editPassTotal}
          </button>
        </div>
        
        {/* !! ថ្មី !!: Overtime Settings */}
        <div className="p-4 bg-black/10 rounded-lg">
          <h4 className="text-lg font-semibold text-blue-200 mb-3">{t.overtimeSettings}</h4>
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg text-white">{t.overtimeLimit}:</span>
            <span className="text-3xl font-bold text-white">{overtimeLimit} <span className="text-lg font-normal">{t.minutes}</span></span>
          </div>
          <button
            onClick={onEditOvertimeLimit}
            className="flex items-center justify-center w-full px-4 py-3 rounded-full text-md text-white font-bold transition-all shadow-lg bg-blue-500 hover:bg-blue-600"
          >
            <IconTimer className="w-5 h-5 mr-2" />
            {t.overtimeLimit}
          </button>
        </div>

        {/* Check-in Method */}
        <div className="p-4 bg-black/10 rounded-lg">
          <h4 className="text-lg font-semibold text-blue-200 mb-3">{t.checkInMethod}</h4>
          <button
            onClick={onEditCheckInMode}
            className="flex items-center justify-center w-full px-4 py-3 rounded-full text-md text-white font-bold transition-all shadow-lg bg-blue-500 hover:bg-blue-600"
          >
            {checkInMode === 'scan' ? (
              <>
                <IconQrCode className="w-5 h-5 mr-2" /> {t.checkInMethodScan}
              </>
            ) : (
              <>
                {/* !! កែសម្រួល !!: បន្ថែម mr-2 វិញ សម្រាប់តែទីនេះ */}
                <IconCheckIn className="w-5 h-5 mr-2" /> {t.checkInMethodAuto}
              </>
            )}
          </button>
        </div>

        {/* Security */}
        <div className="p-4 bg-black/10 rounded-lg">
          <h4 className="text-lg font-semibold text-blue-200 mb-3">{t.security}</h4>
          <button
            onClick={onEditPassword}
            className="flex items-center justify-center w-full px-4 py-3 rounded-full text-md text-white font-bold transition-all shadow-lg bg-orange-500 hover:bg-orange-600"
          >
            <IconLock className="w-5 h-5 mr-2" />
            {t.changePassword}
          </button>
        </div>
        
      </div>
    </div>
  );

  return (
    <div className="pb-10">
      <h2 className="text-3xl font-bold text-white text-center mb-6">{t.settingsTitle}</h2>
      
      {/* ផ្នែកទី 1: ការកំណត់ទូទៅ */}
      {renderGeneralSettings()}
      
      {/* ផ្នែកទី 2: ការកំណត់ Admin */}
      {renderAdminSettings()}
    </div>
  );
};

// ភ្ជាប់ទៅ Global Scope
window.SettingsPage = SettingsPage;

