// src/pages/users/components/UserDeleteDialog.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { User } from '@/services/user.service'
import { Loader2 } from 'lucide-react'

interface UserDeleteDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  user: User
  onDelete: (id: string) => Promise<boolean>
  isSubmitting: boolean
}

export const UserDeleteDialog = ({ isOpen, onOpenChange, user, onDelete, isSubmitting }: UserDeleteDialogProps) => {
  const handleDeleteConfirm = async () => {
    const success = await onDelete(user.id)
    if (success) {
      onOpenChange(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card text-card-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente o usuário{' '}
            <span className="font-semibold text-primary">{user.name} ({user.email})</span>{' '}
            e removerá seus dados de nossos servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
