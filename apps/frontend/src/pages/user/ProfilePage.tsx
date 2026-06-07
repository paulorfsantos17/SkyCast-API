import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Importe o componente Label
import { useProfileViewModel } from "@/services/viewmodels/useUsersViewModel";
import { motion, type Transition } from "framer-motion";
import { Loader2, UserCircle2 } from "lucide-react";

export default function ProfilePage() {
  const {
    name,
    setName,
    password,
    setPassword,
    loading,
    saving,
    error,
    successMessage,
    handleSubmit,
  } = useProfileViewModel();

  // Variantes para animação do card principal
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as Transition["ease"] } },
  };

  // Variantes para animação dos itens dentro do formulário
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as Transition["ease"] } },
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
          <CardHeader className="text-center space-y-2 pt-8">
            <motion.div initial="hidden" animate="visible" variants={itemVariants}>
              <UserCircle2 className="mx-auto h-16 w-16 text-primary mb-4" />
            </motion.div>
            <motion.div initial="hidden" animate="visible" variants={itemVariants}>
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">Meu Perfil</CardTitle>
            </motion.div>
            <motion.div initial="hidden" animate="visible" variants={itemVariants}>
              <CardDescription className="text-muted-foreground text-lg">
                Gerencie suas informações pessoais e senha.
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="px-6 pb-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mb-2" />
                Carregando seu perfil...
              </div>
            ) : (
              <motion.form
                onSubmit={handleSubmit}
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
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nome
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </motion.div>

        

                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nova senha (opcional)
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Deixe em branco para manter a atual"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-md border border-emerald-500/40"
                  >
                    {successMessage}
                  </motion.div>
                )}

                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    className="w-full h-11 text-lg font-semibold bg-primary hover:bg-primary/90 transition-colors duration-200"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      "Salvar alterações"
                    )}
                  </Button>
                </motion.div>
              </motion.form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}