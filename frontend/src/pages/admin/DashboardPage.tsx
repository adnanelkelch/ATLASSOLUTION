import { useQuery } from '@tanstack/react-query'
import { Users, ShoppingCart, DollarSign, Package, Mail, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageLoading } from '@/components/ui/loading'
import { adminApi } from '@/services/api'
import { formatPrice, formatDate } from '@/lib/utils'

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminApi.dashboard().then((r) => r.data.data),
  })

  if (isLoading) return <PageLoading />
  if (!data) return null

  const stats = [
    { label: 'Users', value: data.users_count, icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'Orders', value: data.orders_count, icon: ShoppingCart, color: 'bg-green-100 text-green-600' },
    { label: 'Pending', value: data.pending_orders, icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Revenue', value: formatPrice(data.revenue), icon: DollarSign, color: 'bg-purple-100 text-purple-600' },
    { label: 'Active packs', value: data.packs_count, icon: Package, color: 'bg-indigo-100 text-indigo-600' },
    { label: 'Unread messages', value: data.unread_contacts, icon: Mail, color: 'bg-red-100 text-red-600' },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-3 font-medium">Reference</th>
                  <th className="pb-3 font-medium">Client</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_orders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{order.reference}</td>
                    <td className="py-3 text-gray-600">{order.user_name}</td>
                    <td className="py-3">
                      <Badge variant={order.status === 'completed' ? 'success' : order.status === 'pending' ? 'warning' : 'default'}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3 font-medium">{formatPrice(order.total)}</td>
                    <td className="py-3 text-gray-500">{formatDate(order.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
