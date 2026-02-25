import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageLoading } from '@/components/ui/loading'
import { adminApi } from '@/services/api'
import type { Service } from '@/types'

export default function ServicesPage() {
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState<Partial<Service> | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: () => adminApi.services.getAll().then((r) => r.data.data),
  })

  const saveMutation = useMutation({
    mutationFn: (data: Partial<Service>) =>
      data.id ? adminApi.services.update(data.id, data) : adminApi.services.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] })
      setEditing(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: adminApi.services.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-services'] }),
  })

  if (isLoading) return <PageLoading />

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) saveMutation.mutate(editing)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Services</h2>
        <Button onClick={() => setEditing({ title: '', slug: '', description: '', excerpt: '', icon: '', is_active: true, is_featured: false, sort_order: 0 })}>
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      {editing && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editing.id ? 'Edit' : 'New'} service</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <Input value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <Input value={editing.slug || ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} required />
                </div>
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <Input value={editing.excerpt || ''} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <Textarea rows={4} value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Lucide)</label>
                  <Input value={editing.icon || ''} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort order</label>
                  <Input type="number" value={editing.sort_order || 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) })} />
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={editing.is_active || false} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} />
                  Active
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={editing.is_featured || false} onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })} />
                  Featured
                </label>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? 'Saving...' : 'Save'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {data?.map((service: Service) => (
          <Card key={service.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900">{service.title}</span>
                <Badge variant={service.is_active ? 'success' : 'secondary'}>{service.is_active ? 'Active' : 'Inactive'}</Badge>
                {service.is_featured && <Badge>Featured</Badge>}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => setEditing(service)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => { if (confirm('Delete this service?')) deleteMutation.mutate(service.id) }}><Trash2 className="h-4 w-4 text-red-500" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
