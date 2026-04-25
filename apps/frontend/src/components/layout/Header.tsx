import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { CloudSun } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  const headerContainerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  return (
    <motion.header
      className="sticky top-0 z-40 w-full border-b bg-background px-8"
      initial="hidden"
      animate="visible"
      variants={headerContainerVariants}
    >
      <div className="container flex h-16 items-center justify-between py-4">
        {/* Logo ou Título */}
        <motion.div className="flex items-center space-x-2" variants={itemVariants}>
          <CloudSun className="h-6 w-6 text-primary" />
          <Link to="/" className="text-lg font-bold text-foreground">
            Weather Dashboard
          </Link>
        </motion.div>

        {/* Links de Navegação */}
        <motion.nav className="flex items-center space-x-4" variants={itemVariants}>
          <Link
            to="/dashboard"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            to="/profile"
            className="text-foreground transition-colors hover:text-foreground"
          >
            Perfil
          </Link>
        </motion.nav>

        {/* Botões de Autenticação */}
        <motion.div className="flex items-center space-x-4" variants={itemVariants}>
          {isAuthenticated ? (
            <Button
              variant="ghost"
              onClick={logout}
              // Adicionando classes Tailwind para um hover mais forte e visível
              className="hover:bg-red-500 hover:text-white transition-colors duration-200"
            >
              Sair
            </Button>
          ) : (
            <Link to="/login">
              <Button
                variant="ghost"
                // Adicionando classes Tailwind para um hover mais forte e visível
                className="hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
              >
                Entrar
              </Button>
            </Link>
          )}
        </motion.div>
      </div>
    </motion.header>
  );
};