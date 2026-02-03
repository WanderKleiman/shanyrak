function AdminAccessApp() {
  try {
    const handleAdminAccess = () => {
      window.location.href = 'admin.html';
    };

    const handleBackToMain = () => {
      window.location.href = 'index.html';
    };

    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="card text-center">
            <div className="w-20 h-20 bg-[var(--primary-color)] rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="icon-shield text-3xl text-white"></div>
            </div>
            
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              Административный доступ
            </h1>
            
            <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
              Эта страница предназначена для администраторов фонда "Шанырак". 
              Здесь вы можете управлять подопечными, редактировать информацию 
              о проектах и отслеживать прогресс сборов.
            </p>

            <div className="space-y-4">
              <button
                onClick={handleAdminAccess}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                <div className="icon-settings text-lg"></div>
                <span>Перейти в админ-панель</span>
              </button>
              
              <button
                onClick={handleBackToMain}
                className="btn-secondary w-full flex items-center justify-center space-x-2"
              >
                <div className="icon-arrow-left text-lg"></div>
                <span>Вернуться на главную</span>
              </button>
            </div>

            <div className="mt-8 p-4 bg-[var(--bg-secondary)] rounded-xl">
              <h3 className="font-semibold mb-2">Доступ для администраторов</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Если у вас есть права администратора, используйте свои учетные данные для входа в систему управления.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('AdminAccessApp component error:', error);
    return null;
  }
}

class AdminAccessErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AdminAccess error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Ошибка загрузки</h1>
            <button onClick={() => window.location.reload()} className="btn-primary">
              Перезагрузить
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById('admin-access-root'));
root.render(
  <AdminAccessErrorBoundary>
    <AdminAccessApp />
  </AdminAccessErrorBoundary>
);
