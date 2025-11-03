// =================================================================
// 4. MAIN UI COMPONENTS
// =================================================================

// ត្រូវប្រាកដថា File នេះ ត្រូវបានហៅ (load) បន្ទាប់ពី setup.jsx
const { 
  React,
  calculateDuration,
  IconCheckOut,
  IconCheckIn,
  IconTrash,
  IconSpecial,
  IconNoSymbol,
  IconQrCode, // ថ្មី
  IconDotsVertical,
  IconAlert,
  IconLock,
  IconCheckCircleFill,
  IconPencilSquare,
  IconClose,
  IconTimer, // ថ្មី
} = window.appSetup;

const { useState, useEffect } = React;


const StudentCard = ({ student, pageKey, passesInUse, attendance, now, handleCheckOut, handleCheckIn, handleOpenQrScanner, onDeleteClick, totalPasses, t, checkInMode, overtimeLimit }) => {
  
  const studentBreaks = attendance[student.id] || [];
  const activeBreak = studentBreaks.find(r => r.checkOutTime && !r.checkInTime);
  const completedBreaks = studentBreaks.filter(r => r.checkOutTime && r.checkInTime);
      
  let statusText = t.statusNotYet;
  let statusClass = 'bg-gray-500 text-white'; 
  let canCheckIn = false; 
  let canCheckOut = true;
  let isSpecialCase = false; 
  
  let passesAvailable = totalPasses - passesInUse;
  
  if (activeBreak) {
    const elapsedMins = calculateDuration(activeBreak.checkOutTime, now.toISOString());
    const isOvertime = elapsedMins > overtimeLimit; // !! កែសម្រួល !!
    
    const passNumberDisplay = activeBreak.passNumber ? ` (${activeBreak.passNumber})` : '';
    statusText = `${t.statusOnBreak}${passNumberDisplay} (${elapsedMins} ${t.minutes})`; 
    
    statusClass = isOvertime 
      ? 'bg-red-600 text-white animate-pulse' 
      : 'bg-yellow-500 text-white animate-pulse';
    canCheckIn = true; 
    canCheckOut = false; 
    if (activeBreak.breakType === 'special') {
        isSpecialCase = true;
    }
    
  } else if (completedBreaks.length > 0) {
    const lastBreak = completedBreaks[completedBreaks.length - 1]; 
    const duration = calculateDuration(lastBreak.checkOutTime, lastBreak.checkInTime);
    const isCompletedOvertime = duration > overtimeLimit; // !! កែសម្រួល !!
    const overtimeMins = isCompletedOvertime ? duration - overtimeLimit : 0;
    
    statusText = isCompletedOvertime
      ? `${t.statusCompleted} (${t.overtime} ${overtimeMins} ${t.minutes})`
      : `${t.statusCompleted} (${duration} ${t.minutes})`; 
    statusClass = isCompletedOvertime
      ? 'bg-red-600 text-white' 
      : 'bg-green-600 text-white';
    canCheckIn = false;
    canCheckOut = true; 
    
    if (studentBreaks.some(r => r.breakType === 'special')) {
      isSpecialCase = true;
    }

  } else {
    // មិនទាន់សម្រាក
    statusText = t.statusNotYet;
    statusClass = 'bg-gray-500 text-white';
    canCheckIn = false;
    canCheckOut = true;
  }
  
  if (passesAvailable <= 0 && canCheckOut) {
    canCheckOut = false; 
    statusText = `${t.statusPassOut} (${passesInUse}/${totalPasses})`;
    statusClass = 'bg-red-600 text-white';
  }
  
  const photoUrl =
    student.photoUrl ||
    `https://placehold.co/128x128/EBF4FF/76A9FA?text=${student.name ? student.name.charAt(0) : 'N'}`;

  // !! កែសម្រួល !!: Logic ប៊ូតុង Check-in
  const renderCheckInButton = () => {
    const action = checkInMode === 'scan' ? handleOpenQrScanner : () => handleCheckIn(student.id);
    const icon = checkInMode === 'scan' ? <IconQrCode /> : <IconCheckIn />;
    
    return (
      <button
        onClick={action}
        disabled={!canCheckIn}
        className="flex items-center justify-center w-full px-4 py-4 rounded-full text-lg text-blue-800 font-bold transition-all transform hover:scale-105 shadow-lg bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
      >
        {icon}
        {t.checkIn}
      </button>
    );
  };
  
  // !! កែសម្រួល !!: Layout ថ្មីសម្រាប់ 'មិនទាន់សម្រាក'
  const renderNotOnBreakLayout = () => (
    <div className="flex items-center justify-between space-x-3">
      {/* Status */}
      <p className={`inline-flex items-center px-5 py-4 rounded-full text-md font-semibold ${statusClass} flex-1 justify-center`}>
        {statusText}
        {isSpecialCase && <IconSpecial />}
      </p>
      
      {/* ប៊ូតុង Check Out (Icon  മാത്ര) */}
      <button
        onClick={() => handleCheckOut(student.id)}
        disabled={!canCheckOut} 
        className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full text-lg text-white font-bold transition-all transform hover:scale-105 shadow-lg bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
      >
        <IconCheckOut />
      </button>
    </div>
  );

  return (
    <div
      key={`${pageKey}-${student.id}`} 
      className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-xl p-6 relative mt-16 max-w-md mx-auto"
    >
      {activeBreak && (
        <button
          onClick={(e) => onDeleteClick(e, student, activeBreak)}
          className="absolute top-4 right-4 text-red-300 bg-red-900/50 p-2 rounded-full transition-all hover:bg-red-500 hover:text-white"
          title={t.deleteTooltip}
        >
          <IconTrash />
        </button>
      )}
      
      <img
        src={photoUrl}
        alt={`${t.photoOf} ${student.name || t.noName}`}
        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
        onError={(e) => {
          e.target.src = `https://placehold.co/128x128/EBF4FF/76A9FA?text=${student.name ? student.name.charAt(0) : 'N'}`;
        }}
      />
      
      <div className="pt-16 text-center">
        <p className="text-3xl font-bold text-white">
          {student.name || t.noName}
        </p>
        <p className="text-lg text-blue-200">
          {t.idNumber}: {student.idNumber || 'N/A'}
        </p>
        <p className="text-lg text-blue-200">
          {t.class}: {student.class || 'N/A'}
        </p>
      </div>
      
      {/* !! កែសម្រួល !!: Logic សម្រាប់បង្ហាញ Layout */}
      <div className="my-6">
        {activeBreak ? (
          // Layout ពេលកំពុងសម្រាក (បង្ហាញ Status និងប៊ូតុង Check-in)
          <>
            <div className="text-center mb-6">
              <p className={`inline-flex items-center px-5 py-2 rounded-full text-md font-semibold ${statusClass}`}>
                {statusText}
                {isSpecialCase && <IconSpecial />}
              </p>
            </div>
            {renderCheckInButton()}
          </>
        ) : (
          // Layout ពេលមិនទាន់សម្រាក (បង្ហាញ Status + ប៊ូតុង Check-out)
          renderNotOnBreakLayout()
        )}
        
        {/* ករណីកាតអស់ */}
        {!canCheckOut && !activeBreak && statusText.startsWith(t.statusPassOut) && (
          <div className="flex items-center justify-center w-full px-4 py-4 rounded-full text-lg text-white font-bold bg-red-600/50 opacity-80 cursor-not-allowed">
            <IconNoSymbol />
            {t.statusPassOut}
          </div>
        )}
      </div>

    </div>
  );
};

const CompletedStudentListCard = ({ student, record, onClick, isSelected, onSelect, onDeleteClick, isSelectionMode, t, overtimeLimit }) => {
  
  const formatTime = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleTimeString('km-KH', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const duration = calculateDuration(record?.checkOutTime, record?.checkInTime);
  
  const isOvertime = duration > overtimeLimit; // !! កែសម្រួល !!
  const overtimeMins = isOvertime ? duration - overtimeLimit : 0;
  const cardColor = isOvertime 
    ? 'bg-red-800/30 backdrop-blur-lg border border-red-500/30' 
    : 'bg-white/10 backdrop-blur-lg'; 
  const durationColor = isOvertime ? 'text-red-300' : 'text-green-300';

  const photoUrl =
    student.photoUrl ||
    `https://placehold.co/64x64/EBF4FF/76A9FA?text=${student.name ? student.name.charAt(0) : 'N'}`;

  return (
    <div
      className={`w-full max-w-md mx-auto rounded-2xl shadow-lg p-4 mb-3 flex items-center space-x-4 transition-all ${cardColor} ${isSelectionMode ? 'cursor-pointer' : ''} ${isSelected ? 'ring-2 ring-blue-400' : ''}`}
      onClick={() => isSelectionMode ? onSelect() : (onClick ? onClick() : null)}
    >
      {isSelectionMode && (
        <input 
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="form-checkbox h-6 w-6 text-blue-600 bg-gray-700 border-gray-500 rounded focus:ring-blue-500"
          onClick={(e) => e.stopPropagation()} 
        />
      )}
      <img
        src={photoUrl}
        alt={`${t.photoOf} ${student.name || t.noName}`}
        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
        onError={(e) => {
          e.target.src = `https://placehold.co/64x64/EBF4FF/76A9FA?text=${student.name ? student.name.charAt(0) : 'N'}`;
        }}
      />
      <div className="flex-1 text-left">
        <p className="text-xl font-bold text-white">
          {student.name || t.noName}
        </p>
        <p className="text-sm text-blue-200">
          {t.checkOut}: {formatTime(record?.checkOutTime)} | {t.checkIn}: {formatTime(record?.checkInTime)}
        </p>
        
        {record.passNumber && (
          <p className="text-sm font-semibold text-cyan-300">
            ({t.statusPass}: {record.passNumber})
          </p>
        )}
        
        {isOvertime && (
          <p className="text-sm font-semibold text-red-300">
            ({t.overtime} {overtimeMins} {t.minutes}) {/* <--- !! បានកែ !! លុប $ */}
          </p>
        )}
        {record.breakType === 'special' && (
           <p className="text-sm font-semibold text-purple-300">
            ({t.specialCase})
           </p>
        )}
      </div>
      
      <div className="text-center px-2">
        <p className={`text-2xl font-bold ${durationColor}`}>{duration}</p>
        <p className="text-xs text-blue-200">{t.minutes}</p>
      </div>
      
      {!isSelectionMode && (
        <button
          onClick={(e) => onDeleteClick(e)}
          className="p-3 rounded-full text-red-300 bg-white/10 transition-colors hover:bg-red-500 hover:text-white"
          title={t.deleteTooltip}
        >
          <IconTrash />
        </button>
      )}
    </div>
  );
};

const OnBreakStudentListCard = ({ student, record, elapsedMins, isOvertime, onCheckIn, handleOpenQrScanner, onDeleteClick, t, checkInMode }) => {
  
  const cardColor = isOvertime 
    ? 'bg-red-800/30 backdrop-blur-lg border border-red-500/30' 
    : 'bg-yellow-500/20 backdrop-blur-lg border border-yellow-500/30'; 
  
  const textColor = isOvertime ? 'text-red-300' : 'text-yellow-300';

  const photoUrl =
    student.photoUrl ||
    `https://placehold.co/64x64/EBF4FF/76A9FA?text=${student.name ? student.name.charAt(0) : 'N'}`;
    
  // !! កែសម្រួល !!: Logic ប៊ូតុង Check-in
  const action = checkInMode === 'scan' ? handleOpenQrScanner : onCheckIn;
  const icon = checkInMode === 'scan' ? <IconQrCode /> : <IconCheckIn />;

  return (
    <div className={`w-full max-w-md mx-auto rounded-2xl shadow-lg p-4 mb-3 flex items-center space-x-3 ${cardColor}`}>
      <img
        src={photoUrl}
        alt={`${t.photoOf} ${student.name || t.noName}`}
        className="w-16 h-16 rounded-full object-cover border-2 border-white/50 shadow-md"
        onError={(e) => { e.target.src = `https://placehold.co/64x64/EBF4FF/76A9FA?text=${student.name ? student.name.charAt(0) : 'N'}`; }}
      />
      <div className="flex-1 text-left">
        <p className="text-xl font-bold text-white">
          {student.name || t.noName}
        </p>
        <p className={`text-sm font-semibold ${textColor} inline-flex items-center`}>
          {isOvertime ? t.overtime : t.statusOnBreakShort}
          {record.breakType === 'special' && (
            <span className="ml-2 px-2 py-0.5 text-xs text-purple-800 bg-purple-300 rounded-full">
              {t.specialCaseShort}
            </span>
          )}
        </p>
        <p className="text-sm text-blue-200">
          ({t.statusPass}: {record.passNumber || '???'})
        </p>
      </div>
      
      <div className="text-center px-2">
        <p className={`text-2xl font-bold ${textColor}`}>{elapsedMins}</p>
        <p className="text-xs text-blue-200">{t.minutes}</p>
      </div>
      
      <div className="flex flex-col space-y-2">
        <button
          onClick={action}
          className="p-3 rounded-full text-blue-800 bg-white transition-colors hover:bg-gray-200"
          title={t.checkInTooltip}
        >
          {icon}
        </button>
        
        <button
          onClick={(e) => onDeleteClick(e)}
          className="p-3 rounded-full text-red-300 bg-white/10 transition-colors hover:bg-red-500 hover:text-white"
          title={t.deleteTooltip}
        >
          <IconTrash />
        </button>
      </div>
    </div>
  );
};

const PasswordConfirmationModal = ({ prompt, onSubmit, onCancel, t }) => {
  if (!prompt.isOpen) return null;
  
  const [password, setPassword] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(password);
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={onCancel} 
    >
      <div
        className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 text-center"
        onClick={(e) => e.stopPropagation()} 
      >
        <IconLock />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {t.passwordRequired}
        </h3>
        <p className="text-gray-600 mb-4">
          {prompt.message}
        </p>
        <form onSubmit={handleSubmit}>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg"
            placeholder={t.passwordPlaceholder}
            autoFocus
          />
          {prompt.error && (
            <p className="text-red-500 text-sm mt-2">{prompt.error}</p>
          )}
          <div className="flex justify-center space-x-4 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 rounded-full text-gray-700 bg-gray-200 hover:bg-gray-300 font-bold"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-full text-white bg-blue-500 hover:bg-blue-600 font-bold"
            >
              {t.confirm}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminActionModal = ({ isOpen, onClose, onSelectClick, onBulkClick, isBulkLoading, bulkDeleteDate, setBulkDeleteDate, bulkDeleteMonth, setBulkDeleteMonth, t }) => {
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose} 
    >
      <div
        className="w-full max-w-md bg-white rounded-t-2xl shadow-lg p-4"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="w-16 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
          {t.adminTitle}
        </h3>
        
        <div className="space-y-3">
          <button
            onClick={onSelectClick}
            className="w-full px-4 py-3 text-left text-lg font-semibold text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            {t.multiSelect}
          </button>
          
          <div className="p-4 bg-gray-100 rounded-lg">
            <label className="block text-lg font-semibold text-gray-800 mb-2">{t.deleteByDate}</label>
            <input 
              type="date"
              value={bulkDeleteDate}
              onChange={(e) => setBulkDeleteDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg"
            />
            <button
              onClick={() => onBulkClick('day')}
              className="w-full mt-2 px-4 py-3 text-lg font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg disabled:opacity-50"
              disabled={isBulkLoading}
            >
              {isBulkLoading ? t.deleting : t.deleteByDateButton}
            </button>
          </div>
          
          <div className="p-4 bg-gray-100 rounded-lg">
            <label className="block text-lg font-semibold text-gray-800 mb-2">{t.deleteByMonth}</label>
            <input 
              type="month"
              value={bulkDeleteMonth}
              onChange={(e) => setBulkDeleteMonth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg"
            />
            <button
              onClick={() => onBulkClick('month')}
              className="w-full mt-2 px-4 py-3 text-lg font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50"
              disabled={isBulkLoading}
            >
              {isBulkLoading ? t.deleting : t.deleteByMonthButton}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

const CompletedListHeader = ({ onAdminClick, onMultiDeleteClick, onCancelMultiSelect, selectionCount, isSelectionMode, t }) => {
  return (
    <div className="w-full max-w-md mx-auto mb-4 flex justify-between items-center">
      {!isSelectionMode ? (
        <>
          <h2 className="text-2xl font-bold text-white">
            {t.historyToday}
          </h2>
          <button
            onClick={onAdminClick}
            className="p-3 rounded-full text-white bg-white/10 transition-colors hover:bg-white/30"
            title={t.adminTitle}
          >
            <IconDotsVertical />
          </button>
        </>
      ) : (
        <>
          <button
            onClick={onCancelMultiSelect}
            className="px-4 py-2 text-white font-semibold bg-gray-600/50 rounded-full hover:bg-gray-500/50"
          >
            {t.cancel}
          </button>
          <button
            onClick={onMultiDeleteClick}
            disabled={selectionCount === 0}
            className="px-4 py-2 text-white font-bold bg-red-500 rounded-full hover:bg-red-600 disabled:opacity-50"
          >
            {t.delete} ({selectionCount})
          </button>
        </>
      )}
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center mt-10">
    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const DeleteConfirmationModal = ({ recordToDelete, onCancel, onConfirm, t }) => {
    if (!recordToDelete) return null;
    
    const { student } = recordToDelete;
    
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
        onClick={onCancel} 
      >
        <div
          className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 text-center"
          onClick={(e) => e.stopPropagation()} 
        >
          <IconAlert />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {t.deleteTitle}
          </h3>
          <p className="text-gray-600 mb-6">
            {t.deleteConfirmMessage(student.name)}
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={onCancel}
              className="px-6 py-3 rounded-full text-gray-700 bg-gray-200 hover:bg-gray-300 font-bold"
            >
              {t.cancel}
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-3 rounded-full text-white bg-red-500 hover:bg-red-600 font-bold"
            >
              {t.delete}
            </button>
          </div>
        </div>
      </div>
    );
  };


// Component សម្រាប់ QR Scanner Modal (Logic Stop/Start ថ្មី)
const QrScannerModal = ({ isOpen, onClose, onScanSuccess, lastScannedInfo, isScannerBusy, t }) => { 
  const [errorMessage, setErrorMessage] = useState(null);
  
  const html5QrCodeRef = React.useRef(null);
  const scannerId = "qr-reader"; 

  useEffect(() => {
    
    // 1. បើក Modal
    if (isOpen) {
      setErrorMessage(null);
      
      // 2. បើ Scanner មិន Busy (កំពុងរង់ចាំ Scan) -> ចាប់ផ្តើម (Start)
      if (!isScannerBusy) {
        
        const element = document.getElementById(scannerId);
        if (element) {
            const html5QrCode = new Html5Qrcode(scannerId);
            html5QrCodeRef.current = html5QrCode;
            
            const qrCodeSuccessCallback = (decodedText, decodedResult) => {
              onScanSuccess(decodedText);
            };
            
            const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    
            html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback)
              .catch(err => {
                console.error("Unable to start scanner", err);
                setErrorMessage(t.cameraError);
              });
        }
      }
      
    // 3. បិទ Modal (isOpen = false) ឬ Scanner កំពុង Busy (isScannerBusy = true)
    } else {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop()
          .then(res => {
            console.log("QR Scanner stopped (on close or busy).");
          })
          .catch(err => {
            console.warn("QR Scanner stop error (probably already stopped).", err);
          });
        html5QrCodeRef.current = null;
      }
    }
    
    // Cleanup function
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop()
          .catch(err => { /* មិនអីទេ បើ Stop រួចហើយ */ });
        html5QrCodeRef.current = null;
      }
    };
    
  }, [isOpen, isScannerBusy, t.cameraError, onScanSuccess]); 

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
      onClick={onClose} 
    >
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-800 bg-gray-200 p-2 rounded-full z-10"
        >
          <IconClose />
        </button>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          {t.scanToComeBack}
        </h3>
        
        <div id={scannerId} className="w-full"></div> 
        
        <div className="mt-4 text-center h-12">
          {isScannerBusy && (
             <div className="flex justify-center items-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-blue-600 text-xl font-bold ml-3">{t.processing}</p>
             </div>
          )}
          
          {!isScannerBusy && errorMessage && (
            <p className="text-red-500 text-lg font-bold">{errorMessage}</p>
          )}
          
          {!isScannerBusy && lastScannedInfo && lastScannedInfo.status === 'success' && (
            <p className="text-green-600 text-xl font-bold animate-pulse">
              ✔ {t.scanned}: {lastScannedInfo.name}
            </p>
          )}
          
          {!isScannerBusy && lastScannedInfo && lastScannedInfo.status === 'fail' && (
            <p className="text-red-600 text-xl font-bold">
              ✖ {lastScannedInfo.message}
            </p>
          )}
        </div>
        
      </div>
    </div>
  );
};

const InfoAlertModal = ({ alertInfo, onClose, t }) => {
  if (!alertInfo.isOpen) return null;
  
  const isError = alertInfo.type === 'error';
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={onClose} 
    >
      <div
        className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 text-center"
        onClick={(e) => e.stopPropagation()} 
      >
        {isError ? <IconAlert /> : <IconCheckCircleFill />}
        
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {isError ? t.alertErrorTitle : t.alertSuccessTitle}
        </h3>
        
        <p className="text-gray-600 mb-6" style={{ whiteSpace: 'pre-line' }}>
          {alertInfo.message}
        </p>
        
        <button
          onClick={onClose}
          className="w-full px-8 py-3 rounded-full text-white bg-blue-500 hover:bg-blue-600 font-bold"
        >
          {t.ok}
        </button>
      </div>
    </div>
  );
};

const InputPromptModal = ({ promptInfo, onSubmit, onCancel, t }) => {
  if (!promptInfo.isOpen) return null;
  
  const [value, setValue] = useState(promptInfo.defaultValue || "");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <IconPencilSquare />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {promptInfo.title}
        </h3>
        <p className="text-gray-600 mb-4">{promptInfo.message}</p>
        
        <form onSubmit={handleSubmit}>
          <input 
            type={promptInfo.type || 'text'} // ប្រើ 'number' ឬ 'text'
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg"
            autoFocus
          />
          <div className="flex justify-center space-x-4 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 rounded-full text-gray-700 bg-gray-200 hover:bg-gray-300 font-bold"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-full text-white bg-blue-500 hover:bg-blue-600 font-bold"
            >
              {t.ok}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// ភ្ជាប់ទៅ Global Scope
window.StudentCard = StudentCard;
window.CompletedStudentListCard = CompletedStudentListCard;
window.OnBreakStudentListCard = OnBreakStudentListCard;
window.PasswordConfirmationModal = PasswordConfirmationModal;
window.AdminActionModal = AdminActionModal;
window.CompletedListHeader = CompletedListHeader;
window.LoadingSpinner = LoadingSpinner;
window.DeleteConfirmationModal = DeleteConfirmationModal;
window.QrScannerModal = QrScannerModal;
window.InfoAlertModal = InfoAlertModal;
window.InputPromptModal = InputPromptModal;

