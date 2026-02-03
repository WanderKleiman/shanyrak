function ReportsApp() {
  const [selectedCity, setSelectedCity] = React.useState('Алматы');
  const [reports, setReports] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedReport, setSelectedReport] = React.useState(null);

  React.useEffect(() => {
    localStorage.setItem('activeTab', 'reports');
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setIsLoading(true);
      
      // Check cache first
      const cached = getCachedData('reports');
      if (cached) {
        setReports(cached);
        setIsLoading(false);
        return;
      }

      const result = await trickleListObjects('charity_beneficiary', 50, true);
      const reportedBeneficiaries = result.items
        .filter(item => item.objectData.collection_status === 'reported')
        .map(item => ({
          id: item.objectId,
          title: item.objectData.title,
          description: item.objectData.report_description,
          amount: item.objectData.raised_amount,
          completedDate: item.objectData.completion_date,
          image: item.objectData.report_photos?.[0] || item.objectData.image_url,
          category: getCategoryName(item.objectData.category),
          categoryName: getCategoryName(item.objectData.category),
          reportPhotos: item.objectData.report_photos || [item.objectData.image_url],
          reportVideos: item.objectData.report_videos || [],
          partnerFund: item.objectData.partner_fund
        }));
      
      setCachedData('reports', reportedBeneficiaries);
      setReports(reportedBeneficiaries);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryName = (category) => {
    const categories = {
      children: 'Дети',
      urgent: 'Срочные',
      operations: 'Операции',
      animals: 'Животные',
      social: 'Социальные программы',
      non_material: 'Не материальная помощь'
    };
    return categories[category] || category;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <header className="bg-[var(--bg-primary)] border-b border-[var(--border-color)] p-4">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => window.location.href = 'index.html'}
            className="w-10 h-10 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center"
          >
            <div className="icon-arrow-left text-lg"></div>
          </button>
          <h1 className="text-xl font-bold">Отчеты</h1>
        </div>
      </header>

      <div className="p-4 pb-20">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Успешно завершенные проекты</h2>
          <p className="text-[var(--text-secondary)] text-sm">
            Благодаря вашей поддержке мы смогли помочь многим людям
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="icon-loader text-2xl text-[var(--primary-color)] animate-spin mx-auto mb-2"></div>
            <p className="text-[var(--text-secondary)]">Загрузка отчетов...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-8">
            <div className="icon-file-text text-3xl text-gray-400 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium mb-2">Нет отчетов</h3>
            <p className="text-[var(--text-secondary)]">Пока нет опубликованных отчетов</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map(report => (
              <div 
                key={report.id} 
                className="card cursor-pointer hover:scale-[1.02] transition-transform"
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex space-x-4">
                  <img 
                    src={report.image}
                    alt={report.title}
                    className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-[var(--text-primary)] leading-tight">
                        {report.title}
                      </h3>
                      <span className="bg-[var(--primary-color)] text-white px-2 py-1 rounded-full text-xs">
                        {report.category}
                      </span>
                    </div>
                    
                    <p className="text-[var(--text-secondary)] text-sm mb-3 line-clamp-2">
                      {report.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <span className="text-[var(--text-secondary)]">Собрано: </span>
                        <span className="font-medium text-[var(--primary-color)]">
                          {report.amount.toLocaleString()} ₸
                        </span>
                      </div>
                      <span className="text-xs text-[var(--text-secondary)]">
                        {new Date(report.completedDate).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <BottomNavigation 
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
      />
      
      {selectedReport && (
        <ReportModal 
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}

function ReportModal({ report, onClose }) {
  try {
  const [currentMediaIndex, setCurrentMediaIndex] = React.useState(0);
  
  const media = [];
  if (report.reportPhotos && report.reportPhotos.length > 0) {
    report.reportPhotos.forEach(photo => media.push({ type: 'image', url: photo }));
  }
  if (report.reportVideos && report.reportVideos.length > 0) {
    report.reportVideos.forEach(video => media.push({ type: 'video', url: video }));
  }

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % media.length);
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  const getVideoId = (url) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center md:justify-center z-50 p-0 md:p-4" onClick={onClose}>
      <div 
        className="bg-[var(--bg-primary)] w-full md:w-auto md:max-w-[600px] rounded-t-3xl md:rounded-2xl max-h-[85vh] md:max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center z-20 hover:bg-opacity-100 shadow-lg"
        >
          <div className="icon-x text-sm"></div>
        </button>

        <div className="flex flex-col">
          {media.length > 0 && (
            <div className="relative h-64 md:h-96">
              {media[currentMediaIndex]?.type === 'image' ? (
                <img 
                  src={media[currentMediaIndex].url} 
                  alt="Отчетное фото"
                  className="w-full h-64 md:h-96 object-cover"
                />
              ) : media[currentMediaIndex]?.type === 'video' ? (
                <div className="w-full h-64 md:h-96 bg-black flex items-center justify-center">
                  {getVideoId(media[currentMediaIndex].url) ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${getVideoId(media[currentMediaIndex].url)}`}
                      className="w-full h-full"
                      frameBorder="0"
                      allowFullScreen
                    />
                  ) : (
                    <video 
                      src={media[currentMediaIndex].url}
                      className="w-full h-full object-cover"
                      controls
                    />
                  )}
                </div>
              ) : null}
              
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-[var(--primary-color)] text-white px-3 py-1 rounded-full text-sm font-medium">
                  {report.categoryName}
                </span>
              </div>
              
              {media.length > 1 && (
                <>
                  <button 
                    onClick={prevMedia}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all z-10"
                  >
                    <div className="icon-chevron-left text-lg"></div>
                  </button>
                  <button 
                    onClick={nextMedia}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all z-10"
                  >
                    <div className="icon-chevron-right text-lg"></div>
                  </button>
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                    {media.map((_, index) => (
                      <div 
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentMediaIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">
                  {report.title}
                </h3>
                <div className="text-right">
                  <div className="text-sm text-[var(--text-secondary)]">Собрано</div>
                  <div className="text-lg font-bold text-[var(--primary-color)]">
                    {report.amount.toLocaleString()} ₸
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <div className="icon-shield-check text-lg text-[var(--primary-color)]"></div>
                <a 
                  href={`fund.html?name=${encodeURIComponent(report.partnerFund)}`}
                  className="text-[var(--primary-color)] hover:underline"
                >
                  Фонд "{report.partnerFund}"
                </a>
              </div>

              <div className="bg-[var(--bg-secondary)] p-4 rounded-xl">
                <h4 className="font-semibold mb-2">Отчет об оказанной помощи</h4>
                <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                  {report.description}
                </p>
              </div>

              <div className="text-sm text-[var(--text-secondary)]">
                Отчет опубликован: {new Date(report.completedDate).toLocaleDateString('ru-RU')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  } catch (error) {
    console.error('ReportModal component error:', error);
    return null;
  }
}

function BottomNavigation({ selectedCity, onCityChange }) {
  try {
    const [showCitySelector, setShowCitySelector] = React.useState(false);
    const [showMoreMenu, setShowMoreMenu] = React.useState(false);
    const cities = [
    'Алматы',
    'Астана',
    'Шымкент',
    'Актобе',
    'Караганда',
    'Тараз',
    'Павлодар',
    'Усть-Каменогорск',
    'Семей',
    'Атырау',
    'Кызылорда',
    'Актау',
    'Костанай',
    'Уральск',
    'Туркестан',
    'Петропавловск',
    'Кокшетау',
    'Темиртау',
    'Талдыкорган',
    'Экибастуз'
  ];

    const handleCitySelect = (city) => {
      onCityChange(city);
      setShowCitySelector(false);
    };

    return (
      <>
        <nav className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-90 border-t border-[var(--border-color)] backdrop-blur-md">
          <div className="flex items-center justify-around py-1">
            <button 
              onClick={() => window.location.href = 'index.html'}
              className="flex flex-col items-center space-y-1 py-1 px-3 text-[var(--text-secondary)]"
            >
              <img 
                src="https://app.trickle.so/storage/public/images/usr_140a45f300000001/86eeabeb-ea74-4381-9f41-405f827fda21.png" 
                alt="Главное"
                className="w-5 h-5 object-contain"
              />
              <span className="text-xs">Главное</span>
            </button>
            
            <button 
              onClick={() => setShowCitySelector(true)}
              className="flex flex-col items-center space-y-1 py-1 px-3 text-[var(--text-secondary)]"
            >
              <div className="icon-map-pin text-lg"></div>
              <span className="text-xs">{selectedCity}</span>
            </button>
            
            <button 
              className="flex flex-col items-center space-y-1 py-1 px-3 text-[var(--primary-color)]"
            >
              <div className="icon-file-text text-lg"></div>
              <span className="text-xs">Отчеты</span>
            </button>
            
            <button 
              onClick={() => setShowMoreMenu(true)}
              className="flex flex-col items-center space-y-1 py-1 px-3 text-[var(--text-secondary)]"
            >
              <div className="icon-menu text-lg"></div>
              <span className="text-xs">Еще</span>
            </button>
          </div>
        </nav>

      {showCitySelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50" onClick={() => setShowCitySelector(false)}>
          <div 
            className="bg-[var(--bg-primary)] w-full rounded-t-3xl p-4 max-h-[50vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <h3 className="text-lg font-semibold">Выберите город</h3>
              <button 
                onClick={() => setShowCitySelector(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <div className="icon-x text-sm"></div>
              </button>
            </div>
            
            <div className="overflow-y-auto space-y-2">
              {cities.map(city => (
                <button
                  key={city}
                  onClick={() => handleCitySelect(city)}
                  className={`w-full text-left p-3 rounded-xl transition-colors ${
                    city === selectedCity 
                      ? 'bg-[var(--primary-color)] text-white' 
                      : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-gray-100'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

        {showMoreMenu && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
            <div className="bg-[var(--bg-primary)] w-full rounded-t-3xl p-4 space-y-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Дополнительно</h3>
                <button 
                  onClick={() => setShowMoreMenu(false)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                >
                  <div className="icon-x text-sm"></div>
                </button>
              </div>
              
              <button
                onClick={() => window.location.href = 'about-fund.html'}
                className="w-full text-left p-3 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-gray-100 flex items-center space-x-3"
              >
                <div className="icon-info text-lg text-[var(--primary-color)]"></div>
                <span>О фонде "Шанырак"</span>
              </button>

              <button
                onClick={() => window.location.href = 'partner-funds.html'}
                className="w-full text-left p-3 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-gray-100 flex items-center space-x-3"
              >
                <div className="icon-users text-lg text-[var(--primary-color)]"></div>
                <span>Фонды партнеры</span>
              </button>

              <button
                onClick={() => window.location.href = 'documents.html'}
                className="w-full text-left p-3 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-gray-100 flex items-center space-x-3"
              >
                <div className="icon-file-text text-lg text-[var(--primary-color)]"></div>
                <span>Документы</span>
              </button>

              <button
                onClick={() => window.location.href = 'contacts.html'}
                className="w-full text-left p-3 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-gray-100 flex items-center space-x-3"
              >
                <div className="icon-phone text-lg text-[var(--primary-color)]"></div>
                <span>Контакты</span>
              </button>

              <button
                onClick={() => window.location.href = 'companies.html'}
                className="w-full text-left p-3 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-gray-100 flex items-center space-x-3"
              >
                <div className="icon-building text-lg text-[var(--primary-color)]"></div>
                <span>Спонсоры</span>
              </button>
            </div>
          </div>
        )}
      </>
    );
  } catch (error) {
    console.error('BottomNavigation component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('reports-root'));
root.render(<ReportsApp />);