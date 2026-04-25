import { useRegisterViewModel } from "@/services/viewmodels/useRegisterViewModel";
import { Label } from "@radix-ui/react-label";
import { motion } from "framer-motion"; // Importe motion
import { UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";



export default function RegisterPage() {
  // Removido 'role' e 'setRole' do destructuring
  const { email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, 
            name, setName, loading, error, handleRegister } = useRegisterViewModel();

  // Variantes para a animação do card principal
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  // Variantes para os itens dentro do formulário (para staggered animation)
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <motion.div
        className="w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <Card className="shadow-2xl rounded-lg border-none bg-white/90 backdrop-blur-sm dark:bg-gray-900/90">
          <CardHeader className="text-center space-y-4 pt-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold"
            >
              <UserPlus className="h-6 w-6" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
            >
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                Crie sua conta!
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Junte-se a nós para explorar o painel.
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="px-6 pb-8">
            <motion.form
              onSubmit={handleRegister}
              className="space-y-6"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.4,
                  },
                },
              }}
            >
              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </motion.div>

              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </motion.div>

              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </motion.div>

              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirmar Senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="h-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </motion.div>

              {/* O campo de role foi removido daqui */}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-destructive bg-destructive/10 p-2 rounded-md border border-destructive/30"
                >
                  {error}
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <Button type="submit" className="w-full h-11 text-lg font-semibold bg-primary hover:bg-primary/90 transition-colors duration-200" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    'Registrar'
                  )}
                </Button>
              </motion.div>
            </motion.form>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.8, ease: "easeOut" }}
              className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400"
            >
              Já tem uma conta?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Entrar
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}