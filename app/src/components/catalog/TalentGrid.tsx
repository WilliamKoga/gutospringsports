'use client';

import React, { useState, useEffect } from 'react';
import { TalentCard, Talent } from './TalentCard';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';

const ROLES = [
  'player',
  'head_coach',
  'assistant_coach',
  'athletic_trainer',
  'physiotherapist',
  'team_manager',
  'scout',
  'analyst',
  'other_staff',
] as const;

const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C'] as const;

export function TalentGrid() {
  const t = useTranslations('catalog');
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [role, setRole] = useState('');
  const [position, setPosition] = useState('');
  const [error, setError] = useState(false);
  
  useEffect(() => {
    async function fetchTalents() {
      try {
        setLoading(true);
        setError(false);
        const url = new URL('/api/talents', window.location.origin);
        if (searchTerm) {
          url.searchParams.append('search', searchTerm);
        }
        if (role) {
          url.searchParams.append('role', role);
        }
        if (position) {
          url.searchParams.append('position', position);
        }
        
        const res = await fetch(url.toString());
        if (!res.ok) throw new Error('Failed to fetch');
        
        const data = await res.json();
        setTalents(data);
      } catch (err) {
        console.error('Error fetching catalog:', err);
        setError(true);
        setTalents([]);
      } finally {
        setLoading(false);
      }
    }
    
    // Debounce search slightly
    const timer = setTimeout(() => {
      fetchTalents();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm, role, position]);

  return (
    <div className="flex w-full flex-col gap-8">
      {/* Search and Filters */}
      <div className="grid grid-cols-1 items-end gap-5 border border-border bg-card p-5 md:grid-cols-[minmax(0,1fr)_220px_180px]">
        <label className="flex w-full flex-col gap-2 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
          {t('filter_search')}
          <span className="relative block w-full sm:max-w-md">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
              <svg
                className="h-4 w-4 shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </span>
            <Input
              type="text"
              placeholder={t('search_placeholder')}
              className="h-11 bg-background pl-9 text-sm font-normal normal-case tracking-normal"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </span>
        </label>
        <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
          {t('filter_role')}
          <select
            value={role}
            onChange={(e) => {
              const nextRole = e.target.value;
              setRole(nextRole);
              if (nextRole && nextRole !== 'player') {
                setPosition('');
              }
            }}
            className="h-11 rounded border border-input bg-background px-3 text-sm font-normal normal-case tracking-normal text-foreground shadow-none focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">{t('filter_all')}</option>
            {ROLES.map((roleValue) => (
              <option key={roleValue} value={roleValue}>
                {t(`role_${roleValue}`)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
          {t('filter_position')}
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            disabled={!!role && role !== 'player'}
            className="h-11 rounded border border-input bg-background px-3 text-sm font-normal normal-case tracking-normal text-foreground shadow-none focus:outline-none focus:ring-1 focus:ring-ring disabled:bg-muted disabled:text-muted-foreground"
          >
            <option value="">{t('filter_all')}</option>
            {POSITIONS.map((positionValue) => (
              <option key={positionValue} value={positionValue}>
                {positionValue}
              </option>
            ))}
          </select>
        </label>
      </div>
      
      {/* Grid */}
      {error ? (
        <div className="flex flex-col items-center justify-center border border-dashed bg-card py-20 text-center">
          <p className="text-muted-foreground max-w-sm">{t('error_message')}</p>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-muted animate-pulse"></div>
          ))}
        </div>
      ) : talents.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {talents.map(talent => (
            <TalentCard key={talent.id} talent={talent} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center border border-dashed bg-card py-20 text-center">
          <p className="text-muted-foreground max-w-sm">{t('no_results')}</p>
        </div>
      )}
    </div>
  );
}
