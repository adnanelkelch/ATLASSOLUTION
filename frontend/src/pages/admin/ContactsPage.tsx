import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageLoading } from '@/components/ui/loading'
import { adminApi } from '@/services/api'
import { formatDate } from '@/lib/utils'
import type { Contact } from '@/types'

export default function ContactsPage() {
  const queryClient = useQueryClient()
  const [selected, setSelected] = useState<Contact | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-contacts'],
    queryFn: () => adminApi.contacts.getAll().then((r) => r.data),
  })

  const viewMutation = useMutation({
    mutationFn: (id: number) => adminApi.contacts.getById(id),
    onSuccess: (res) => {
      setSelected(res.data.data)
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: adminApi.contacts.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] })
      setSelected(null)
    },
  })

  if (isLoading) return <PageLoading />

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Contacts</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          {(data?.data || []).map((contact: Contact) => (
            <Card
              key={contact.id}
              className={`cursor-pointer hover:shadow-md transition-shadow ${selected?.id === contact.id ? 'ring-2 ring-primary-500' : ''}`}
              onClick={() => viewMutation.mutate(contact.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-medium ${!contact.is_read ? 'text-gray-900' : 'text-gray-600'}`}>{contact.name}</span>
                      {!contact.is_read && <Badge variant="warning">New</Badge>}
                    </div>
                    <p className="text-sm text-gray-500">{contact.email}</p>
                    {contact.subject && <p className="text-sm text-gray-700 mt-1">{contact.subject}</p>}
                    <p className="text-xs text-gray-400 mt-1">{formatDate(contact.created_at)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selected && (
          <Card className="h-fit sticky top-24">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{selected.name}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => { if (confirm('Delete this message?')) deleteMutation.mutate(selected.id) }}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-500">Email:</span> <a href={`mailto:${selected.email}`} className="text-primary-600">{selected.email}</a>
                </div>
                {selected.phone && <div><span className="text-gray-500">Phone:</span> {selected.phone}</div>}
                {selected.subject && <div><span className="text-gray-500">Subject:</span> {selected.subject}</div>}
                <div className="pt-3 border-t">
                  <p className="whitespace-pre-wrap text-gray-700">{selected.message}</p>
                </div>
                <p className="text-xs text-gray-400">{formatDate(selected.created_at)}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
