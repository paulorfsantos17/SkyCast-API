// src/pages/LoginPage.tsx (Sem alterações significativas, apenas para referência)
import { Label } from "@radix-ui/react-label";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useLoginViewModel } from "../../services/viewmodels/auth";

export default function LoginPage() {
  const { email, setEmail, password, setPassword, loading, error, handleLogin } = useLoginViewModel();

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

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
              ⚡
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
            >
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                Bem-vindo de volta!
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Entre na sua conta para continuar.
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="px-6 pb-8">
            <motion.form
              onSubmit={handleLogin}
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
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </motion.div>
            </motion.form>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7, ease: "easeOut" }}
              className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400"
            >
              Não tem uma conta?{" "}
              <Link to="/register" className="font-medium text-primary hover:underline">
                Cadastre-se
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}