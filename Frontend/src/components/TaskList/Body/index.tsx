import { useState, useEffect, FormEvent } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Plus, SquarePen, Trash2, Check, X } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

interface BodyProps {
  token: string;
}

interface Task {
  _id: string;
  id?: string;
  title: string;
  completed?: boolean;
}

export default function Body({ token }: BodyProps): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState<string>('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/tasks', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao carregar tarefas');
        }

        setTasks(data);
        
        if (data.length >= 10) {
          toast.info('Você possui o limite máximo de 10 tarefas.');
        }
      } catch (err: any) {
        toast.error(err.message || 'Erro de conexão com o servidor');
      }
    };

    fetchTasks();
  }, [token]);

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (tasks.length >= 10) {
      toast.warn('Você atingiu o limite máximo de 10 tarefas.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title })
      });

      const newTask = await response.json();

      if (!response.ok) {
        throw new Error(newTask.error || 'Erro ao criar tarefa');
      }

      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks, newTask];
        
        if (updatedTasks.length === 10) {
          toast.warn('Você atingiu o limite máximo de 10 tarefas.');
        }
        
        return updatedTasks;
      });

      setTitle(''); 
      toast.success('Tarefa inserida com sucesso!');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao criar tarefa');
    }
  };

  const handleUpdateTask = async (id: string) => {
    if (!editTitle.trim()) return;

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: editTitle })
      });

      const updatedTask = await response.json();

      if (!response.ok) {
        throw new Error(updatedTask.error || 'Erro ao atualizar tarefa');
      }

      setTasks((prevTasks) =>
        prevTasks.map((task) => ((task._id || task.id) === id ? updatedTask : task))
      );
      setEditingId(null);
      setEditTitle('');
      toast.success('Tarefa atualizada com sucesso!');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao atualizar tarefa');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!id) {
      toast.error('ID da tarefa não foi encontrado.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao deletar tarefa');
      }

      setTasks((prevTasks) => prevTasks.filter((task) => (task._id || task.id) !== id));
      toast.success('Tarefa excluída com sucesso!');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao deletar tarefa');
    }
  };

  return (
    <main className="flex-1 flex justify-center items-start p-6 bg-gray-50">
      {/* Container de notificações garantido no escopo do Body */}
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full max-w-xl border border-gray-300 rounded-xl p-8 bg-white shadow-sm">
        
        {/* Formulário para Adicionar Tarefa */}
        <form onSubmit={handleAddTask} className="mb-6">
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
            Adicione uma tarefa ({tasks.length}/10)
          </label>
          
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                tasks.length >= 10 
                  ? 'Limite de 10 tarefas atingido' 
                  : 'O que você precisa fazer?'
              }
              disabled={tasks.length >= 10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 outline-none focus:border-black transition disabled:opacity-50 disabled:bg-gray-50"
              required
            />
            <button
              type="submit"
              disabled={tasks.length >= 10}
              className="bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white w-10 h-10 rounded-lg flex items-center justify-center transition shadow-sm shrink-0"
              title="Adicionar"
            >
              <Plus size={18} />
            </button>
          </div>
        </form>

        {/* Tabela de Tarefas */}
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-black text-white px-4 py-2.5 flex justify-between font-semibold text-sm">
            <span>Tarefas ({tasks.length}/10)</span>
            <span>Ações</span>
          </div>

          {tasks.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              Nenhuma tarefa cadastrada.
            </div>
          ) : (
            tasks.map((task) => {
              const taskId = task._id || task.id || '';
              return (
                <div 
                  key={taskId} 
                  className="px-4 py-3 border-t border-gray-200 flex justify-between items-center text-gray-800 hover:bg-gray-50 transition text-sm gap-4"
                >
                  {editingId === taskId ? (
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-full outline-none focus:border-black transition"
                      />
                      <button
                        onClick={() => handleUpdateTask(taskId)}
                        className="bg-black text-white p-1.5 rounded hover:bg-gray-800 transition flex items-center justify-center shrink-0"
                        title="Salvar"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-200 text-gray-700 p-1.5 rounded hover:bg-gray-300 transition flex items-center justify-center shrink-0"
                        title="Cancelar"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <span className="truncate min-w-0 flex-1">{task.title}</span>
                  )}

                  {editingId !== taskId && (
                    <div className="flex items-center space-x-3 shrink-0">
                      <button
                        onClick={() => {
                          setEditingId(taskId);
                          setEditTitle(task.title);
                        }}
                        className="text-gray-500 hover:text-black transition p-1"
                        title="Editar Tarefa"
                      >
                        <SquarePen size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(taskId)}
                        className="text-gray-500 hover:text-red-600 transition p-1"
                        title="Excluir Tarefa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </main>
  );
}