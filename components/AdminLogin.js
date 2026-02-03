function AdminLogin({ onLogin }) {
  try {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      try {
        const result = await login(username, password);
        if (result.success) {
          onLogin(result.user);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Ошибка входа в систему');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]" data-name="admin-login" data-file="components/AdminLogin.js">
        <div className="w-full max-w-md">
          <div className="card">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[var(--primary-color)] rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="icon-shield text-2xl text-white"></div>
              </div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Админ-панель</h1>
              <p className="text-[var(--text-secondary)]">Вход в систему управления</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Логин</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input"
                  placeholder="Введите логин"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Пароль</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="Введите пароль"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full"
              >
                {isLoading ? 'Вход...' : 'Войти'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-[var(--text-secondary)]">
              <p>Тестовые данные:</p>
              <p>Логин: admin, Пароль: admin123</p>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('AdminLogin component error:', error);
    return null;
  }
}