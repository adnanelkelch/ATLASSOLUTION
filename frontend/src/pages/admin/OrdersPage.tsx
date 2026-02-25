import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageLoading } from '@/components/ui/loading'
import { adminApi } from '@/services/api'
import { formatPrice, formatDate } from '@/lib/utils'
import type { Order } from '@/types'

const statuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'] as const
const statusLabels: Record<string, string> = {
  pending: 'Pending', confirmed: 'Confirmed', in_progress: 'In progress', completed: 'Completed', cancelled: 'Cancelled',
}
const statusVariants: Record<string, 'warning' | 'default' | 'success' | 'destructive'> = {
  pending: 'warning', confirmed: 'default', in_progress: 'default', completed: 'success', cancelled: 'destructive',
}

export default function OrdersPage() {
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState<string>('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', filter],
    queryFn: () => adminApi.orders.getAll(1, filter || undefined).then((r) => r.data),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => adminApi.orders.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orders'] }),
  })

  if (isLoading) return <PageLoading />

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Orders</h2>

      <div className="flex gap-2 mb-6 flex-wrap">
        <Button variant={filter === '' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('')}>All</Button>
        {statuses.map((s) => (
          <Button key={s} variant={filter === s ? 'default' : 'outline'} size="sm" onClick={() => setFilter(s)}>
            {statusLabels[s]}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {(data?.data || []).map((order: Order) => (
          <Card key={order.id}>
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold">{order.reference}</span>
                    <Badge variant={statusVariants[order.status]}>{statusLabels[order.status]}</Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    {order.user?.name} &middot; {formatDate(order.created_at)}
                  </p>
                </div>
                <span className="text-lg font-bold text-primary-600">{formatPrice(order.total)}</span>
              </div>

              {order.items && (
                <div className="mb-3 text-sm text-gray-600">
                  {order.items.map((item) => (
                    <span key={item.id} className="mr-3">{item.pack_name} x{item.quantity}</span>
                  ))}
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                {statuses.filter((s) => s !== order.status).map((s) => (
                  <Button
                    key={s}
                    variant="outline"
                    size="sm"
                    disabled={updateMutation.isPending}
                    onClick={() => updateMutation.mutate({ id: order.id, status: s })}
                  >
                    {statusLabels[s]}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
