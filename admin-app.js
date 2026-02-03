class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Admin ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Ошибка в админ-панели</h1>
            <p className="text-gray-600 mb-4">Произошла неожиданная ошибка.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Перезагрузить страницу
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function AdminApp() {
  try {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [currentUser, setCurrentUser] = React.useState(null);

    React.useEffect(() => {
      const authData = checkAuth();
      if (authData) {
        setIsAuthenticated(true);
        setCurrentUser(authData);
      }
    }, []);

    const handleLogin = (userData) => {
      setIsAuthenticated(true);
      setCurrentUser(userData);
    };

    const handleLogout = () => {
      logout();
      setIsAuthenticated(false);
      setCurrentUser(null);
    };

    if (!isAuthenticated) {
      return <AdminLogin onLogin={handleLogin} />;
    }

    return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
  } catch (error) {
    console.error('AdminApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('admin-root'));
root.render(
  <AdminErrorBoundary>
    <AdminApp />
  </AdminErrorBoundary>
);