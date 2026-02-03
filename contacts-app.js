function ContactsApp() {
  const [selectedCity, setSelectedCity] = React.useState('Алматы');

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
          <h1 className="text-xl font-bold">Контакты</h1>
        </div>
      </header>

      <div className="p-4 pb-20">
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-lg font-bold mb-2">Если вам нужна помощь</h3>
            <p className="text-sm italic text-[var(--text-secondary)] mb-3">
              Для подопечных, семей в трудной ситуации или тех, кто ищет поддержку
            </p>
            <a 
              href="https://forms.gle/NeCsKxrgffVim3SM9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 bg-[var(--primary-color)] text-white px-6 py-3 rounded-[var(--button-radius)] font-medium transition-all duration-200 hover:opacity-90 active:scale-95 no-underline"
            >
              <div className="icon-file-edit text-lg"></div>
              <span>Заполните форму</span>
            </a>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold mb-2">Для волонтёров</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-3">
              Хотите присоединиться к нашей команде и помогать большому делу?
            </p>
            <a 
              href="https://wa.me/77471504545"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 bg-[var(--primary-color)] text-white px-6 py-3 rounded-[var(--button-radius)] font-medium transition-all duration-200 hover:opacity-90 active:scale-95 no-underline"
            >
              <div className="icon-users text-lg"></div>
              <span>Волонтерам</span>
            </a>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold mb-2">Для партнёров и других фондов</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-3">
              Создаем вместе благие дела и совместные проекты
            </p>
            <div className="space-y-2">
              <a 
                href="https://wa.me/77471504545"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-[var(--primary-color)] hover:underline"
              >
                <div className="icon-message-circle text-lg"></div>
                <span>Связаться в WhatsApp</span>
                <div className="icon-external-link text-sm"></div>
              </a>
              <a 
                href="mailto:info@shanyraq.ru"
                className="flex items-center space-x-2 text-[var(--primary-color)] hover:underline"
              >
                <div className="icon-mail text-lg"></div>
                <span>Написать на почту info@shanyraq.ru</span>
              </a>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold mb-4">Общая информация</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="icon-mail text-lg text-[var(--primary-color)]"></div>
                <a href="mailto:info@shanyraq.ru" className="text-[var(--primary-color)] hover:underline">
                  info@shanyraq.ru
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <div className="icon-instagram text-lg text-[var(--primary-color)]"></div>
                <span className="text-[var(--text-secondary)]">Скоро появится</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold mb-3">Реквизиты организации</h3>
            <div className="space-y-2 text-sm">
              <p className="font-medium">Частный благотворительный фонд "Шанырак комек"</p>
              <p className="text-[var(--text-secondary)]">БИК: 230440020759</p>
            </div>
          </div>
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
              className="w-full text-left p-3 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-gray-100 flex items-center space-x-3"
            >
              <div className="icon-file-text text-lg text-[var(--primary-color)]"></div>
              <span>Документы</span>
            </button>

            <button
              onClick={() => window.location.href = 'contacts.html'}
              className="w-full text-left p-3 rounded-xl bg-[var(--primary-color)] text-white flex items-center space-x-3"
            >
              <div className="icon-phone text-lg"></div>
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

const root = ReactDOM.createRoot(document.getElementById('contacts-root'));
root.render(<ContactsApp />);