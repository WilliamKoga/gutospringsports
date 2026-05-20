'use client';

import Image from 'next/image';
import Link from 'next/link';
import { DragEvent, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AdminProfileActions from './AdminProfileActions';

interface AdminTalent {
  id: string;
  full_name: string;
  slug: string;
  role: string;
  position: string | null;
  current_team: string | null;
  photo_url: string | null;
  featured_on_home: boolean;
  homepage_order: number | null;
  catalog_order: number | null;
}

interface AdminTalentOrderTableProps {
  initialTalents: AdminTalent[];
  secret: string;
}

function moveItem<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  const nextItems = [...items];
  const [item] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, item);
  return nextItems;
}

export default function AdminTalentOrderTable({
  initialTalents,
  secret,
}: AdminTalentOrderTableProps) {
  const [talents, setTalents] = useState(initialTalents);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageTone, setMessageTone] = useState<'neutral' | 'error'>('neutral');

  async function saveOrder(nextTalents: AdminTalent[], previousTalents: AdminTalent[]) {
    setSaving(true);
    setMessageTone('neutral');
    setMessage('Saving catalog order...');

    try {
      const res = await fetch('/api/admin/talents/order', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': secret,
        },
        body: JSON.stringify({ ids: nextTalents.map((talent) => talent.id) }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? 'Failed to save catalog order');
      }

      setMessage('Catalog order saved');
      window.setTimeout(() => setMessage(null), 1800);
    } catch (error) {
      setTalents(previousTalents);
      setMessageTone('error');
      setMessage((error as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDrop(targetId: string) {
    if (!draggedId || draggedId === targetId || saving) {
      setDraggedId(null);
      return;
    }

    const fromIndex = talents.findIndex((talent) => talent.id === draggedId);
    const toIndex = talents.findIndex((talent) => talent.id === targetId);

    if (fromIndex < 0 || toIndex < 0) {
      setDraggedId(null);
      return;
    }

    const previousTalents = talents;
    const nextTalents = moveItem(talents, fromIndex, toIndex);
    setTalents(nextTalents);
    setDraggedId(null);
    await saveOrder(nextTalents, previousTalents);
  }

  function allowDrop(event: DragEvent<HTMLTableRowElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex min-h-12 items-center justify-between gap-4 border-b px-6 py-3 text-xs text-muted-foreground">
          <span>Drag rows to set the default public catalog order.</span>
          {message && (
            <span className={messageTone === 'error' ? 'text-red-600' : ''}>{message}</span>
          )}
        </div>
        <div className="w-full overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="w-16 px-6 py-4 font-medium">Order</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Position</th>
                <th className="px-6 py-4 font-medium">Current Team</th>
                <th className="px-6 py-4 font-medium">Home</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {talents.length > 0 ? (
                talents.map((talent, index) => (
                  <tr
                    key={talent.id}
                    draggable={!saving}
                    onDragStart={(event) => {
                      setDraggedId(talent.id);
                      event.dataTransfer.effectAllowed = 'move';
                      event.dataTransfer.setData('text/plain', talent.id);
                    }}
                    onDragOver={allowDrop}
                    onDrop={() => handleDrop(talent.id)}
                    onDragEnd={() => setDraggedId(null)}
                    className={`transition-colors hover:bg-muted/30 ${
                      draggedId === talent.id ? 'bg-muted/60 opacity-70' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        disabled={saving}
                        className="flex h-9 w-9 cursor-grab items-center justify-center rounded border border-border bg-background text-xs font-bold text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label={`Drag ${talent.full_name}`}
                      >
                        {index + 1}
                      </button>
                    </td>
                    <td className="flex items-center gap-3 px-6 py-4 font-medium text-foreground">
                      {talent.photo_url ? (
                        <Image
                          src={talent.photo_url}
                          alt={talent.full_name}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                          {talent.full_name.charAt(0)}
                        </div>
                      )}
                      <span>{talent.full_name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="capitalize">
                        {talent.role.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{talent.position ?? '-'}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {talent.current_team ?? '-'}
                    </td>
                    <td className="px-6 py-4">
                      {talent.featured_on_home ? (
                        <Badge className="bg-orange-500 text-white hover:bg-orange-500">
                          Featured #{talent.homepage_order ?? '-'}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <AdminProfileActions
                        secret={secret}
                        talentId={talent.id}
                        slug={talent.slug}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                    <p>No talent profiles yet.</p>
                    <Link href={`/admin/${secret}/new`} className="mt-4 inline-block">
                      <Button variant="outline">Add your first talent</Button>
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
