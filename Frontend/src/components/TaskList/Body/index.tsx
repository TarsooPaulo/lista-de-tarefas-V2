import { useState, useEffect, FormEvent } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Plus } from 'lucide-react'; // Ícone para o botão de adicionar
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
  
  // Novo estado para controlar o input da nova tarefa
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);

  useEffect(() => {
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

  // Função para adicionar uma nova tarefa
  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return; // Evita criar tarefa vazia

    setIsAdding(true);

    try {
      const response = await fetch(`${apiUrl}/api/tasks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: newTaskTitle })
      });

      if (!response.ok) throw new Error('Erro ao criar tarefa.');
      
      const createdTask = await response.json();
      
      // Adiciona a nova tarefa na lista atual sem precisar recarregar a página
      setTasks([...tasks, createdTask]);
      setNewTaskTitle(''); // Limpa o input
      toast.success('Tarefa adicionada com sucesso!');
      
    } catch (err: any) {
      toast.error(err.message || 'Erro ao adicionar a tarefa.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6 mt-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Minhas Tarefas</h2>

        {/* Formulário de Adição de Tarefa */}
        <form onSubmit={handleAddTask} className="flex gap-3 mb-8">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="O que você precisa fazer hoje?"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-black transition"
            disabled={loading || isAdding}
          />
          <button
            type="submit"
            disabled={!newTaskTitle.trim() || isAdding}
            className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition disabled:opacity-50"
          >
            <Plus size={20} />
            {isAdding ? 'Adicionando...' : 'Adicionar'}
          </button>
        </form>

        {/* Lista de Tarefas */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Carregando tarefas...</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {tasks.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">Nenhuma tarefa encontrada. Adicione sua primeira tarefa acima!</p>
              </div>
            ) : (
              tasks.map((task) => (
                <li key={task.id} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm flex items-center justify-between hover:shadow-md transition">
                  <span className="text-gray-800 font-medium">{task.title}</span>
                  {/* Espaço futuro para botões de concluir e excluir */}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </main>
  );
}