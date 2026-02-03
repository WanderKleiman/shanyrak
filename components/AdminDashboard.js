function AdminDashboard({ user, onLogout }) {
  try {
    const [activeTab, setActiveTab] = React.useState('beneficiaries');
    const [selectedCity, setSelectedCity] = React.useState(user.role === 'city_admin' ? user.assigned_city : 'Алматы');
    const [showForm, setShowForm] = React.useState(false);
    const [editingBeneficiary, setEditingBeneficiary] = React.useState(null);
    const [showFundForm, setShowFundForm] = React.useState(false);
    const [editingFund, setEditingFund] = React.useState(null);
    const [showReportForm, setShowReportForm] = React.useState(false);
    const [reportingBeneficiary, setReportingBeneficiary] = React.useState(null);

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

    const handleEditBeneficiary = (beneficiary) => {
      setEditingBeneficiary(beneficiary);
      setShowForm(true);
    };

    const handleFormClose = () => {
      setShowForm(false);
      setEditingBeneficiary(null);
    };

    const handleEditFund = (fund) => {
      setEditingFund(fund);
      setShowFundForm(true);
    };

    const handleFundFormClose = () => {
      setShowFundForm(false);
      setEditingFund(null);
    };

    const handleAddReport = (beneficiary) => {
      setReportingBeneficiary(beneficiary);
      setShowReportForm(true);
    };

    const handleReportFormClose = () => {
      setShowReportForm(false);
      setReportingBeneficiary(null);
    };

    return (
      <div className="min-h-screen bg-[var(--bg-secondary)]" data-name="admin-dashboard" data-file="components/AdminDashboard.js">
        <header className="bg-[var(--bg-primary)] border-b border-[var(--border-color)] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[var(--primary-color)] rounded-full flex items-center justify-center">
                <div className="icon-shield text-lg text-white"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold">Админ-панель</h1>
                <p className="text-sm text-[var(--text-secondary)]">{user.username} - {user.role === 'super_admin' ? 'Супер администратор' : 'Администратор города'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {user.role === 'super_admin' && (
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="form-select text-sm"
                >
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              )}
              
              <button onClick={onLogout} className="btn-secondary">
                <div className="icon-log-out text-lg"></div>
              </button>
            </div>
          </div>
        </header>

        <nav className="bg-[var(--bg-primary)] border-b border-[var(--border-color)] px-4">
          <div className="flex space-x-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('beneficiaries')}
              className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'beneficiaries'
                  ? 'border-[var(--primary-color)] text-[var(--primary-color)]'
                  : 'border-transparent text-[var(--text-secondary)]'
              }`}
            >
              Подопечные
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'completed'
                  ? 'border-[var(--primary-color)] text-[var(--primary-color)]'
                  : 'border-transparent text-[var(--text-secondary)]'
              }`}
            >
              Завершенные сборы
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'reports'
                  ? 'border-[var(--primary-color)] text-[var(--primary-color)]'
                  : 'border-transparent text-[var(--text-secondary)]'
              }`}
            >
              Отчеты
            </button>
            <button
              onClick={() => setActiveTab('funds')}
              className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'funds'
                  ? 'border-[var(--primary-color)] text-[var(--primary-color)]'
                  : 'border-transparent text-[var(--text-secondary)]'
              }`}
            >
              Фонды
            </button>
            <button
              onClick={() => setActiveTab('sponsors')}
              className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'sponsors'
                  ? 'border-[var(--primary-color)] text-[var(--primary-color)]'
                  : 'border-transparent text-[var(--text-secondary)]'
              }`}
            >
              Спонсоры
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'statistics'
                  ? 'border-[var(--primary-color)] text-[var(--primary-color)]'
                  : 'border-transparent text-[var(--text-secondary)]'
              }`}
            >
              Статистика
            </button>
          </div>
        </nav>

        <main className="p-4">
          {activeTab === 'beneficiaries' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Управление подопечными - {selectedCity}</h2>
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <div className="icon-plus text-lg"></div>
                  <span>Добавить подопечного</span>
                </button>
              </div>
              
              <BeneficiaryList
                city={selectedCity}
                onEdit={handleEditBeneficiary}
              />
            </div>
          )}

          {activeTab === 'completed' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Завершенные сборы - {selectedCity}</h2>
              </div>
              
              <BeneficiaryList
                city={selectedCity}
                onEdit={handleEditBeneficiary}
                onAddReport={handleAddReport}
                statusFilter="completed"
              />
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Опубликованные отчеты - {selectedCity}</h2>
              </div>
              
              <BeneficiaryList
                city={selectedCity}
                onEdit={handleEditBeneficiary}
                statusFilter="reported"
              />
            </div>
          )}

          {activeTab === 'funds' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Управление фондами</h2>
                <button
                  onClick={() => setShowFundForm(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <div className="icon-plus text-lg"></div>
                  <span>Добавить фонд</span>
                </button>
              </div>
              
              <FundList onEdit={handleEditFund} />
            </div>
          )}

          {activeTab === 'sponsors' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Управление спонсорами</h2>
                <button
                  onClick={() => alert('Функция добавления спонсоров будет добавлена')}
                  className="btn-primary flex items-center space-x-2"
                >
                  <div className="icon-plus text-lg"></div>
                  <span>Добавить спонсора</span>
                </button>
              </div>
              <div className="card">
                <p className="text-[var(--text-secondary)]">Здесь будет список спонсоров</p>
              </div>
            </div>
          )}

          {activeTab === 'statistics' && (
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Статистика по городам</h2>
              <p className="text-[var(--text-secondary)]">Здесь будет отображаться статистика по сборам и проектам</p>
            </div>
          )}
        </main>

        {showForm && (
          <BeneficiaryForm
            city={selectedCity}
            beneficiary={editingBeneficiary}
            onClose={handleFormClose}
          />
        )}

        {showFundForm && (
          <FundForm
            fund={editingFund}
            onClose={handleFundFormClose}
          />
        )}

        {showReportForm && (
          <ReportForm
            beneficiary={reportingBeneficiary}
            onClose={handleReportFormClose}
          />
        )}
      </div>
    );
  } catch (error) {
    console.error('AdminDashboard component error:', error);
    return null;
  }
}