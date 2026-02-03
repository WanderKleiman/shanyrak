function DocumentsApp() {
  const [selectedCity, setSelectedCity] = React.useState('Алматы');

  const documents = [
    {
      id: 1,
      name: "Справка о государственной регистрации",
      icon: "file-badge",
      url: "https://drive.google.com/file/d/1Yjmb3JT3hedfmooYP9mgJkXITljzrkeh/view?usp=sharing"
    },
    {
      id: 2,
      name: "Устав фонда",
      icon: "scroll-text",
      url: "https://drive.google.com/file/d/1SMoij-2LdXEo95coR9x1Dpd0fXIt3gZT/view?usp=sharing"
    },
    {
      id: 3,
      name: "Политика конфиденциальности",
      icon: "shield-check",
      url: "https://doc.shanyrak.world/policy"
    },
    {
      id: 4,
      name: "Публичная оферта",
      icon: "file-check",
      url: "https://doc.shanyrak.world/soglashenie"
    },
    {
      id: 5,
      name: "Пользовательское соглашение",
      icon: "file-text",
      url: "https://doc.shanyrak.world/soglashenie"
    },
    {
      id: 6,
      name: "Политика обработки персональных данных",
      icon: "database",
      url: "https://doc.shanyrak.world/obrabotka"
    }
  ];

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
          <h1 className="text-xl font-bold">Документы</h1>
        </div>
      </header>

      <div className="p-4 pb-20">
        <div className="mb-6">
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Официальные документы и отчетность благотворительного фонда "Шанырак"
          </p>
        </div>

        <div className="space-y-4">
          {documents.map(doc => (
            <a 
              key={doc.id} 
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card cursor-pointer hover:bg-gray-50 block no-underline"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <div className={`icon-${doc.icon} text-xl text-[var(--primary-color)]`}></div>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1 text-[var(--text-primary)]">{doc.name}</h3>
                  <div className="text-sm text-[var(--text-secondary)]">
                    Открыть в новой вкладке
                  </div>
                </div>
                
                <div className="icon-external-link text-lg text-[var(--text-secondary)]"></div>
              </div>
            </a>
          ))}
        </div>
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
              className="w-full text-left p-3 rounded-xl bg-[var(--primary-color)] text-white flex items-center space-x-3"
            >
              <div className="icon-file-text text-lg"></div>
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
}

const root = ReactDOM.createRoot(document.getElementById('documents-root'));
root.render(<DocumentsApp />);