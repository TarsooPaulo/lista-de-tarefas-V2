import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const rawApiUrl = process.env.REACT_APP_API_URL || (import.meta as any).env?.VITE_API_URL || '';
const apiUrl = rawApiUrl.replace(/\/$/, '');

interface BodyProps {
  token: string;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export default function Body({ token }: BodyProps): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Exemplo de busca de dados usando o token
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Erro ao carregar tarefas.');
        const data = await response.json();
        setTasks(data);
      } catch (err: any) {
        toast.error(err.message || 'Erro ao conectar ao servidor.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchTasks();
    }
  }, [token]);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <h2 className="text-2xl font-bold mb-4">Minhas Tarefas</h2>

      {loading ? (
        <p className="text-gray-500">Carregando tarefas...</p>
      ) : (
        <ul className="space-y-2">
          {tasks.length === 0 ? (
            <p className="text-gray-500">Nenhuma tarefa encontrada.</p>
          ) : (
            tasks.map((task) => (
              <li key={task.id} className="p-3 border rounded-lg bg-white shadow-sm flex items-center justify-between">
                <span>{task.title}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </main>
  );
}