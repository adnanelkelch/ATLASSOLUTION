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
import { formatPrice } from '@/lib/utils'
import type { Pack } from '@/types'

export default function PacksPage() {
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState<Partial<Pack> & { featuresText?: string } | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-packs'],
    queryFn: () => adminApi.packs.getAll().then((r) => r.data.data),
  })

  const saveMutation = useMutation({
    mutationFn: (pack: Partial<Pack>) =>
      pack.id ? adminApi.packs.update(pack.id, pack) : adminApi.packs.create(pack),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-packs'] })
      setEditing(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: adminApi.packs.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-packs'] }),
  })

  if (isLoading) return <PageLoading />

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    const { featuresText, ...rest } = editing
    const features = featuresText ? featuresText.split('\n').filter(Boolean) : editing.features
    saveMutation.mutate({ ...rest, features })
  }

  const startEdit = (pack?: Pack) => {
    if (pack) {
      setEditing({ ...pack, featuresText: pack.features?.join('\n') || '' })
    } else {
      setEditing({ name: '', slug: '', description: '', price: 0, is_active: true, is_popular: false, sort_order: 0, featuresText: '' })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Packs</h2>
        <Button onClick={() => startEdit()}><Plus className="h-4 w-4" /> Add</Button>
      </div>

      {editing && (
        <Card className="mb-6">
          <CardHeader><CardTitle>{editing.id ? 'Edit' : 'New'} pack</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <Input value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <Input value={editing.slug || ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <Textarea rows={3} value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <Input type="number" step="0.01" value={editing.price || 0} onChange={(e) => setEditing({ ...editing, price: parseFloat(e.target.value) })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Old price</label>
                  <Input type="number" step="0.01" value={editing.original_price || ''} onChange={(e) => setEditing({ ...editing, original_price: e.target.value ? parseFloat(e.target.value) : null })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort order</label>
                  <Input type="number" value={editing.sort_order || 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Features (one per line)</label>
                <Textarea rows={5} value={editing.featuresText || ''} onChange={(e) => setEditing({ ...editing, featuresText: e.target.value })} />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={editing.is_active || false} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} /> Active
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={editing.is_popular || false} onChange={(e) => setEditing({ ...editing, is_popular: e.target.checked })} /> Popular
                </label>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saveMutation.isPending}>{saveMutation.isPending ? 'Saving...' : 'Save'}</Button>
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {data?.map((pack: Pack) => (
          <Card key={pack.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900">{pack.name}</span>
                <span className="text-primary-600 font-semibold">{formatPrice(pack.price)}</span>
                <Badge variant={pack.is_active ? 'success' : 'secondary'}>{pack.is_active ? 'Active' : 'Inactive'}</Badge>
                {pack.is_popular && <Badge>Popular</Badge>}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => startEdit(pack)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => { if (confirm('Delete this pack?')) deleteMutation.mutate(pack.id) }}><Trash2 className="h-4 w-4 text-red-500" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
