// src/pages/users/UsersPage.tsx
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { User } from '@/services/user.service'
import { useUsersViewModel } from '@/services/viewmodels/useUsersViewModel'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { UserCreateDialog } from './components/UserCreateDialog'
import { UserDeleteDialog } from './components/UserDeleteDialog'
import { UserTable } from './components/UserTable'
import { UserUpdateDialog } from './components/UserUpdateDialog'

export const UsersPage = () => {
  const {
    users,
    loading,
    error,
    isSubmitting,
    createUser,
    updateUser,
    deleteUser,
  } = useUsersViewModel()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsUpdateDialogOpen(true)
  }

  const handleDelete = (user: User) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando usuários...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <p>Erro ao carregar usuários: {error}</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Card className="bg-card text-card-foreground shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Gerenciamento de Usuários</CardTitle>
              <Button size="sm" className="h-8 gap-1" onClick={() => setIsCreateDialogOpen(true)}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Adicionar Usuário
                </span>
              </Button>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Gerencie os usuários da sua aplicação. Você pode adicionar, editar e excluir usuários.
              </CardDescription>
              <UserTable
                users={users}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isSubmitting={isSubmitting}
              />
            </CardContent>
          </Card>
        </main>
      </div>

      <UserCreateDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreate={createUser}
        isSubmitting={isSubmitting}
      />

      {selectedUser && (
        <>
          <UserUpdateDialog
            isOpen={isUpdateDialogOpen}
            onOpenChange={setIsUpdateDialogOpen}
            user={selectedUser}
            onUpdate={updateUser}
            isSubmitting={isSubmitting}
          />
          <UserDeleteDialog
            isOpen={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            user={selectedUser}
            onDelete={deleteUser}
            isSubmitting={isSubmitting}
          />
        </>
      )}
    </div>
  )
}
