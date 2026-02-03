// Простая система аутентификации для админ-панели
const AUTH_KEY = 'shanyraq_admin_auth';

async function login(username, password) {
  try {
    // Проверяем пользователя в базе данных
    const users = await trickleListObjects('admin_user', 100, true);
    const user = users.items.find(u => 
      u.objectData.username === username && 
      u.objectData.password_hash === password
    );

    if (user) {
      const authData = {
        objectId: user.objectId,
        username: user.objectData.username,
        role: user.objectData.role,
        assigned_city: user.objectData.assigned_city
      };
      
      localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
      
      return {
        success: true,
        user: authData
      };
    } else {
      return {
        success: false,
        error: 'Неверный логин или пароль'
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Ошибка подключения к серверу'
    };
  }
}

function checkAuth() {
  try {
    const authData = localStorage.getItem(AUTH_KEY);
    return authData ? JSON.parse(authData) : null;
  } catch (error) {
    return null;
  }
}

function logout() {
  localStorage.removeItem(AUTH_KEY);
}
