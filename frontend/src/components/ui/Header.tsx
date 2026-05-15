import { Sun, Moon } from 'lucide-react';
import { tokens } from '../../styles/tokens';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header
      className="flex items-center justify-between px-6 py-4"
      style={{
        backgroundColor: tokens.colors.surface,
        borderBottom: `1px solid ${tokens.colors.border}`,
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg"
          style={{ backgroundColor: tokens.colors.primary }}
        >
          DV
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: tokens.colors.textPrimary }}>
            DistroViz
          </h1>
          <p className="text-sm" style={{ color: tokens.colors.textSecondary }}>
            Dashboard de Despachos
          </p>
        </div>
      </div>
      <button
        onClick={onToggleTheme}
        className="p-2 rounded-lg transition-colors duration-200 hover:bg-opacity-10"
        style={{ backgroundColor: tokens.colors.border }}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun size={20} style={{ color: tokens.colors.textPrimary }} />
        ) : (
          <Moon size={20} style={{ color: tokens.colors.textPrimary }} />
        )}
      </button>
    </header>
  );
}