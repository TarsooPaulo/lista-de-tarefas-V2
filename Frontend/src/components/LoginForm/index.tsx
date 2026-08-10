import { useState, FormEvent, ChangeEvent } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { User, Lock, Type } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

// Compatibilidade segura para Create React App ou Vite
const rawApiUrl = process.env.REACT_APP_API_URL || (import.meta as any).env?.VITE_API_URL || '';
const apiUrl = rawApiUrl.replace(/\/$/, '');

interface LoginFormProps {
  onLoginSuccess: (token: string, userData: { id: string; name: string; username: string }) => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps): JSX.Element {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const filteredValue = value.replace(/[0-9]/g, '');
    setName(filteredValue);
  };

  const safeFetchJson = async (url: string, options: RequestInit) => {
    const response = await fetch(url, options);
    const text = await response.text();
    
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(`Erro no servidor (Status ${response.status}). Resposta inválida.`);
    }

    if (!response.ok) {
      throw new Error(data.error || 'Ocorreu um erro ao processar a solicitação.');
    }

    return data;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!apiUrl) {
      toast.error('URL da API não configurada nas variáveis de ambiente.');
      return;
    }

    if (isRegistering && name.trim().length < 2) {
      toast.error('Por favor, digite um nome válido.');
      return;
    }

    setLoading(true);

    const endpoint = isRegistering 
      ? `${apiUrl}/api/auth/register` 
      : `${apiUrl}/api/auth/login`;

    const payload = isRegistering 
      ? { name: name.trim(), username: username.trim(), password } 
      : { username: username.trim(), password };

    try {
      const data = await safeFetchJson(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (isRegistering) {
        toast.success('Conta criada com sucesso!');
        
        const loginData = await safeFetchJson(`${apiUrl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: username.trim(), password })
        });

        toast.success(`Bem-vindo(a), ${loginData.user.name}!`);
        onLoginSuccess(loginData.token, loginData.user);
      } else {
        toast.success(`Bem-vindo(a), ${data.user?.name || ''}!`);
        onLoginSuccess(data.token, data.user);
      }

    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-black text-white px-6 py-4 flex justify-center items-center">
        <h1 className="text-xl font-medium tracking-wide">
          Lista de Tarefas
        </h1>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="w-full max-w-md border border-gray-300 rounded-xl p-8 bg-white shadow-sm">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isRegistering ? 'Criar uma conta' : 'Entrar na sua conta'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Nome Completo</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-gray-400"><Type size={18} /></span>
                  <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-black transition"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Usuário</label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-400"><User size={18} /></span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-black transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Senha</label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-400"><Lock size={18} /></span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-black transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2.5 rounded-lg transition shadow-sm text-sm disabled:opacity-50"
            >
              {loading ? 'Processando...' : (isRegistering ? 'Cadastrar e Entrar' : 'Entrar')}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-600">
              {isRegistering ? 'Já possui uma conta?' : 'Ainda não tem uma conta?'}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setName('');
                  setUsername('');
                  setPassword('');
                }}
                className="ml-1 font-semibold text-black hover:underline"
              >
                {isRegistering ? 'Entrar' : 'Cadastre-se'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}