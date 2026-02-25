import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/services/api'
import { useAuthStore } from '@/stores/auth-store'

export function useLogin() {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (res) => {
      setAuth(res.data.data.user, res.data.data.token)
      const isAdmin = res.data.data.user.role === 'admin'
      navigate(isAdmin ? '/admin' : '/dashboard')
    },
  })
}

export function useRegister() {
  const { setAuth } = useAuthStore()

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (res) => {
      setAuth(res.data.data.user, res.data.data.token)
    },
  })
}

export function useLogout() {
  const { clearAuth } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      clearAuth()
      queryClient.clear()
      navigate('/login')
    },
  })
}

export function useMe() {
  const { isAuthenticated, updateUser } = useAuthStore()

  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await authApi.me()
      updateUser(res.data.data)
      return res.data.data
    },
    enabled: isAuthenticated,
    retry: false,
  })
}
