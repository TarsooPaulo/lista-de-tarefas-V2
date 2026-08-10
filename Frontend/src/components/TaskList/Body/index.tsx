import { useState, useEffect, FormEvent } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Plus, FilePenLine, Trash2 } from 'lucide-react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import 'react-toastify/dist/ReactToastify.css';

const rawApiUrl = process.env.REACT_APP_API_URL || (import.meta as any).env?.VITE_API_URL || '';
const apiUrl = rawApiUrl.replace(/\/$/, '');

const MAX_TASKS = 10;

interface BodyProps {
  token: string;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

// O MongoDB/Mongoose retorna `_id` no JSON, mas o frontend usa `id`.
// Esta função normaliza o objeto para garantir que `id` esteja sempre presente.
function normalizeTask(raw: any): Task {
  return {
    id: raw._id || raw.id,
    title: raw.title,
    completed: raw.completed ?? false,
  };
}

// ── Styled MUI Components (cabeçalho preto, linhas limpas) ──────────────

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontWeight: 600,
    fontSize: 14,
    letterSpacing: '0.02em',
    padding: '12px 16px',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: '14px 16px',
    color: '#374151',
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '& td, & th': {
    borderBottom: '1px solid #e5e7eb',
  },
}));

// ── Component ───────────────────────────────────────────────────────────

export default function Body({ token }: BodyProps): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // Estado para edição inline
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Erro ao carregar tarefas.');
        const data = await response.json();
        setTasks(data.map(normalizeTask));
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

  // ── Adicionar tarefa ────────────────────────────────────────────────

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    if (tasks.length >= MAX_TASKS) {
      toast.warn(`Limite de ${MAX_TASKS} tarefas atingido!`);
      return;
    }

    setIsAdding(true);

    try {
      const response = await fetch(`${apiUrl}/api/tasks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTaskTitle }),
      });

      if (!response.ok) throw new Error('Erro ao criar tarefa.');

      const createdTask = normalizeTask(await response.json());
      setTasks([...tasks, createdTask]);
      setNewTaskTitle('');
      toast.success('Tarefa adicionada com sucesso!');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao adicionar a tarefa.');
    } finally {
      setIsAdding(false);
    }
  };

  // ── Excluir tarefa ──────────────────────────────────────────────────

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`${apiUrl}/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Erro ao excluir tarefa.');

      setTasks(tasks.filter((t) => t.id !== taskId));
      toast.success('Tarefa excluída com sucesso!');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao excluir a tarefa.');
    }
  };

  // ── Editar tarefa ───────────────────────────────────────────────────

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
  };

  const handleEditTask = async () => {
    if (!editingTaskId || !editingTitle.trim()) return;

    try {
      const response = await fetch(`${apiUrl}/api/tasks/${editingTaskId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: editingTitle }),
      });

      if (!response.ok) throw new Error('Erro ao editar tarefa.');

      const updatedTask = normalizeTask(await response.json());
      setTasks(tasks.map((t) => (t.id === editingTaskId ? updatedTask : t)));
      setEditingTaskId(null);
      setEditingTitle('');
      toast.success('Tarefa editada com sucesso!');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao editar a tarefa.');
    }
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditingTitle('');
  };

  // ── Render ──────────────────────────────────────────────────────────

  const taskCount = tasks.length;

  return (
    <main className="max-w-3xl mx-auto p-6 mt-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        {/* Label com contador */}
        <p
          style={{
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#1f2937',
            marginBottom: '8px',
          }}
        >
          Adicione uma tarefa ({taskCount}/{MAX_TASKS})
        </p>

        {/* Formulário de Adição */}
        <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="O que você precisa fazer?"
            disabled={loading || isAdding || taskCount >= MAX_TASKS}
            style={{
              flex: 1,
              padding: '10px 14px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#111827')}
            onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
          />
          <button
            type="submit"
            disabled={!newTaskTitle.trim() || isAdding || taskCount >= MAX_TASKS}
            style={{
              backgroundColor: '#111827',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              width: '42px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              opacity: !newTaskTitle.trim() || isAdding ? 0.5 : 1,
              transition: 'opacity 0.2s, background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#374151')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#111827')}
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        </form>

        {/* Tabela de Tarefas */}
        {loading ? (
          <div className="text-center py-8">
            <p style={{ color: '#9ca3af' }}>Carregando tarefas...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '32px 16px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              border: '1px dashed #d1d5db',
            }}
          >
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>
              Nenhuma tarefa encontrada. Adicione sua primeira tarefa acima!
            </p>
          </div>
        ) : (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
            }}
          >
            <Table sx={{ minWidth: 500 }} aria-label="tabela de tarefas">
              <TableHead>
                <TableRow>
                  <StyledTableCell>
                    Tarefas ({taskCount}/{MAX_TASKS})
                  </StyledTableCell>
                  <StyledTableCell align="right">Ações</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <StyledTableRow key={task.id}>
                    <StyledTableCell component="th" scope="row">
                      {editingTaskId === task.id ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleEditTask();
                              if (e.key === 'Escape') cancelEditing();
                            }}
                            autoFocus
                            style={{
                              flex: 1,
                              padding: '6px 10px',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              fontSize: '14px',
                              outline: 'none',
                            }}
                          />
                          <button
                            onClick={handleEditTask}
                            style={{
                              backgroundColor: '#111827',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '6px 12px',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            Salvar
                          </button>
                          <button
                            onClick={cancelEditing}
                            style={{
                              backgroundColor: 'transparent',
                              color: '#6b7280',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              padding: '6px 12px',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontWeight: 400, color: '#1f2937' }}>
                          {task.title}
                        </span>
                      )}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {editingTaskId !== task.id && (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <button
                            onClick={() => startEditing(task)}
                            title="Editar tarefa"
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              borderRadius: '4px',
                              transition: 'background-color 0.15s',
                              color: '#374151',
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor = '#f3f4f6')
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor = 'transparent')
                            }
                          >
                            <FilePenLine size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            title="Excluir tarefa"
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              borderRadius: '4px',
                              transition: 'background-color 0.15s',
                              color: '#374151',
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor = '#fef2f2')
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor = 'transparent')
                            }
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </main>
  );
}