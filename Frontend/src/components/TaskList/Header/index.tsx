import { LogOut } from 'lucide-react';

interface HeaderProps {
  onLogout: () => void;
  userName?: string;
}

export default function Header({ onLogout, userName }: HeaderProps): JSX.Element {
  return (
    <header 
      className="bg-black text-white px-4 sm:px-6 py-4 grid items-center gap-2 sm:gap-4"
      style={{ gridTemplateColumns: '1fr auto 1fr' }}
    >
      <div className="flex justify-start min-w-0">
        <span className="text-sm sm:text-base font-medium tracking-wide truncate text-gray-300">
          Olá, <span className="font-semibold text-white">{userName || 'Usuário'}</span>
        </span>
      </div>
      
      <div className="flex justify-center">
        <h1 className="text-xl font-medium tracking-wide whitespace-nowrap">
          Lista de Tarefas
        </h1>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={onLogout}
          className="text-gray-300 hover:text-white hover:bg-gray-800 transition p-2 rounded-lg flex items-center justify-center"
          title="Sair da conta"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}