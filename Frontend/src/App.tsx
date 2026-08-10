import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import Header from './components/TaskList/Header';
import Body from './components/TaskList/Body';
import LoginForm from './components/LoginForm';
import 'react-toastify/dist/ReactToastify.css';

interface UserData {
  id: string;
  name: string;
  username: string;
}

export default function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<UserData | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLoginSuccess = (newToken: string, userData: UserData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Container global de toasts para toda a aplicação */}
      <ToastContainer position="top-right" autoClose={3000} />

      {!token ? (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          <Header onLogout={handleLogout} userName={user?.name} />
          <Body token={token} />
        </>
      )}
    </div>
  );
}