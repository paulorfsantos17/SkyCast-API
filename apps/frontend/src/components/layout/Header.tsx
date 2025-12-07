import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { CloudSun } from 'lucide-react'; // Ícone para o logo
import { Link } from 'react-router-dom'; // Assumindo que você usa react-router-dom para navegação

export const Header = () => {
  const { isAuthenticated, logout } = useAuth() // Exemplo de uso de um hook de autenticação

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background px-8">
      <div className="container flex h-16 items-center justify-between py-4">
        {/* Logo ou Título */}
        <div className="flex items-center space-x-2">
          <CloudSun className="h-6 w-6 text-primary" />
          <Link to="/" className="text-lg font-bold text-foreground">
            Weather Dashboard
          </Link>
        </div>

        <nav className="flex items-center space-x-4">
        </nav>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <Button variant="ghost" onClick={logout}>
              Sair
            </Button>
          ) : (
            <Link to="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
