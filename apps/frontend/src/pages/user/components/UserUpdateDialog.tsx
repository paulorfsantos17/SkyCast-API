// src/pages/users/components/UserUpdateDialog.tsx
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UpdateUserPayload, User } from '@/services/user.service'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface UserUpdateDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  user: User
  onUpdate: (id: string, payload: UpdateUserPayload) => Promise<boolean>
  isSubmitting: boolean
}

export const UserUpdateDialog = ({ isOpen, onOpenChange, user, onUpdate, isSubmitting }: UserUpdateDialogProps) => {
  const [email, setEmail] = useState(user.email)
  const [name, setName] = useState(user.name)
  const [role, setRole] = useState<'admin' | 'user'>(user.role)
  const [password, setPassword] = useState('') // Senha opcional para atualização

  useEffect(() => {
    if (user) {
      setEmail(user.email)
      setName(user.name)
      setRole(user.role)
      setPassword('') // Resetar senha ao mudar de usuário
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload: UpdateUserPayload = {
      email,
      name,
      role,
    }
    if (password) { // Apenas adiciona a senha se ela foi preenchida
      payload.password = password
    }
    const success = await onUpdate(user.id, payload)
    if (success) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Edite os dados do usuário.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">Nova Senha (opcional)</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-3"
                minLength={6}
                disabled={isSubmitting}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">Função</Label>
              <Select
                value={role}
                onValueChange={(value: 'admin' | 'user') => setRole(value)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="role" className="col-span-3">
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
