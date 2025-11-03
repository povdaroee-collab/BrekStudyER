// !! ថ្មី !!: ទាញអថេរ និង Icons ពី Global Scope
const {
  IconTicket, IconPencil, IconLockKey, IconQrCode, IconChevronRight,
  IconLanguage, IconPalette, IconToggleLeft, IconToggleRight,
  backgroundStyles
} = window.appSetup;

// =================================================================
// 6. SETTINGS PAGE COMPONENTS
// =================================================================

// Component ជំនួយ សម្រាប់បង្ហាញមួយแถវ
const SettingsRow = ({ icon, title, children, onClick }) => (
  <div 
    className={`bg-white/5 backdrop-blur-sm p-4 rounded-xl flex items-center ${onClick ? 'cursor-pointer hover:bg-white/10' : ''}`}
    onClick={onClick}
  >
    <div className="mr-4 text-blue-200">
      {icon}
    </div>
    <div className="flex-1">
      <h4 className="text-lg font-semibold text-white">{title}</h4>
    </div>
    <div className="text-right text-gray-300">
      {children}
    </div>
  </div>
);

// Component ជំនួយ សម្រាប់ប៊ូតុង Toggle
const ToggleButton = ({ isEnabled, onToggle }) => (
  <button onClick={onToggle} className={`p-1 rounded-full ${isEnabled ? 'bg-blue-600' : 'bg-gray-600'}`}>
    {isEnabled ? (
      <span className="flex items-center text-white text-xs pr-2">
        <IconToggleRight />
      </span>
    ) : (
      <span className="flex items-center text-gray-300 text-xs pl-2">
        <IconToggleLeft />
      </span>
    )}
  </button>
);

// Component សម្រាប់គ្រប់គ្រងកាត
const PassesSettingsCard = ({ passesInUse, totalPasses, onEditTotal, t }) => {
    const passesAvailable = totalPasses - passesInUse;
    
    return (
      <div className="w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 text-center">
        <div className="flex justify-around text-white">
          <div className="text-center">
            <p className="text-4xl font-bold text-red-300">{passesInUse}</p>
            <p className="text-lg text-blue-200">{t.passInUse}</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold">{passesAvailable}</p>
            <p className="text-lg text-blue-200">{t.passAvailable}</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold">{totalPasses}</p>
            <p className="text-lg text-blue-200">{t.passTotal}</p>
          </div>
        </div>
        
        <div className="mt-6 border-t border-white/20 pt-5">
          <button
            onClick={onEditTotal}
            className="flex items-center justify-center w-full px-4 py-3 rounded-full text-lg text-white font-bold transition-all shadow-lg bg-blue-500 hover:bg-blue-600"
          >
            <IconPencil />
            {t.editPassTotal}
          </button>
        </div>
      </div>
    );
};

// !! ថ្មី !!: ភ្ជាប់ Page ទៅ Global Scope
window.SettingsPage = ({
  t,
  language, setLanguage,
  background, setBackground,
  checkInMode, onEditCheckInMode,
  onEditPassword,
  passesInUse, totalPasses, onEditTotalPasses
}) => {
  
  return (
    <div key="settings-page" className="pb-10 max-w-md mx-auto space-y-6">
      
      {/* 1. គ្រប់គ្រងកាត */}
      <div>
        <h3 className="text-xl font-bold text-white mb-2 ml-2">{t.passManagement}</h3>
        <PassesSettingsCard 
          passesInUse={passesInUse}
          totalPasses={totalPasses}
          onEditTotal={onEditTotalPasses}
          t={t}
        />
      </div>

      {/* 2. សុវត្ថិភាព (Public) */}
      <div>
        <h3 className="text-xl font-bold text-white mb-2 ml-2">{t.security}</h3>
        <div className="space-y-2">
          {/* ផ្លាស់ប្តូរ Password */}
          <SettingsRow icon={<IconLockKey />} title={t.changePassword} onClick={onEditPassword}>
            <IconChevronRight />
          </SettingsRow>
          
          {/* របៀប Check-in */}
          <SettingsRow icon={<IconQrCode />} title={t.checkInMethod} onClick={onEditCheckInMode}>
            <span className="text-sm font-semibold mr-2">
              {checkInMode === 'scan' ? t.checkInScan : t.checkInAuto}
            </span>
            <IconChevronRight />
          </SettingsRow>
        </div>
      </div>
      
      {/* 3. រូបរាង (Local) */}
      <div>
        <h3 className="text-xl font-bold text-white mb-2 ml-2">{t.appearance}</h3>
        <div className="space-y-2">
          
          {/* ផ្លាស់ប្តូរភាសា */}
          <SettingsRow icon={<IconLanguage />} title={t.language}>
            <div className="flex space-x-2">
              <button 
                onClick={() => setLanguage('km')}
                className={`px-3 py-1 rounded-full text-sm font-bold ${language === 'km' ? 'bg-white text-blue-800' : 'bg-white/10 text-white'}`}
              >
                ខ្មែរ
              </button>
              <button 
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-full text-sm font-bold ${language === 'en' ? 'bg-white text-blue-800' : 'bg-white/10 text-white'}`}
              >
                English
              </button>
            </div>
          </SettingsRow>
          
          {/* ផ្លាស់ប្តូរ Background */}
          <SettingsRow icon={<IconPalette />} title={t.background}>
            <div className="flex space-x-2">
              {Object.keys(backgroundStyles).map((styleKey, index) => (
                <button
                  key={styleKey}
                  onClick={() => setBackground(styleKey)}
                  title={`${t.style} ${index + 1}`}
                  className={`w-8 h-8 rounded-full ${backgroundStyles[styleKey]} ${background === styleKey ? 'ring-2 ring-white ring-offset-2 ring-offset-blue-900' : 'opacity-70'}`}
                />
              ))}
            </div>
          </SettingsRow>
          
        </div>
      </div>
      
    </div>
  );
};

