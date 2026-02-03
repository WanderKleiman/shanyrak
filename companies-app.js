function CompaniesApp() {
  const [companies, setCompanies] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedCity, setSelectedCity] = React.useState('Алматы');

  React.useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const result = await trickleListObjects('company_profile', 100, true);
      setCompanies(result.items);
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompanyClick = (companyId) => {
    window.location.href = `company.html?id=${companyId}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center">
        <div className="text-center">
          <div className="icon-loader text-2xl text-[var(--primary-color)] animate-spin mx-auto mb-2"></div>
          <p>Загрузка спонсоров...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-xl font-bold">Спонсоры</h1>
        </div>
      </header>

      <div className="p-4 pb-20">
        {companies.length === 0 ? (
          <div className="text-center py-8">
            <div className="icon-building text-3xl text-gray-400 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium mb-2">Нет спонсоров</h3>
            <p className="text-[var(--text-secondary)]">Пока нет зарегистрированных спонсоров</p>
          </div>
        ) : (
          <div className="space-y-4">
            {companies.map(company => {
              const data = company.objectData;
              return (
                <div key={company.objectId} className="card cursor-pointer" onClick={() => handleCompanyClick(company.objectId)}>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img 
                        src={data.logo_url}
                        alt={data.name}
                        className="w-16 h-16 object-cover rounded-xl"
                      />
                      {data.is_verified && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-[var(--success-color)] rounded-full flex items-center justify-center">
                          <div className="icon-check text-xs text-white"></div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{data.name}</h3>
                      <p className="text-sm text-[var(--text-secondary)] mb-2">{data.description}</p>
                      <div className="text-sm font-medium text-[var(--primary-color)]">
                        Помогли на сумму: {data.total_donated?.toLocaleString()} ₸
                      </div>
                    </div>
                    
                    <div className="icon-chevron-right text-lg text-[var(--text-secondary)]"></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNavigation 
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
      />
    </div>
  );
}

// Bottom Navigation Component
function BottomNavigation({ selectedCity, onCityChange }) {
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
            onClick={() => window.location.href = 'reports.html'}
            className="flex flex-col items-center space-y-1 py-1 px-3 text-[var(--text-secondary)]"
          >
            <div className="icon-file-text text-lg"></div>
            <span className="text-xs">Отчеты</span>
          </button>
          
          <button 
            onClick={() => setShowMoreMenu(true)}
            className="flex flex-col items-center space-y-1 py-1 px-3 text-[var(--primary-color)]"
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
                  onClick={() => {onCityChange(city); setShowCitySelector(false);}}
                  className={`w-full text-left p-3 rounded-xl ${
                    city === selectedCity ? 'bg-[var(--primary-color)] text-white' : 'bg-[var(--bg-secondary)]'
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
              className="w-full text-left p-3 rounded-xl bg-[var(--primary-color)] text-white flex items-center space-x-3"
            >
              <div className="icon-building text-lg"></div>
              <span>Спонсоры</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('companies-root'));
root.render(<CompaniesApp />);
