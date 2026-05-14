'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Talent, TalentRole, PlayerPosition } from '@/lib/types';

const ROLES: { value: TalentRole; label: string }[] = [
  { value: 'player', label: 'Player' },
  { value: 'head_coach', label: 'Head Coach' },
  { value: 'assistant_coach', label: 'Assistant Coach' },
  { value: 'athletic_trainer', label: 'Athletic Trainer' },
  { value: 'physiotherapist', label: 'Physiotherapist' },
  { value: 'team_manager', label: 'Team Manager' },
  { value: 'scout', label: 'Scout' },
  { value: 'analyst', label: 'Analyst' },
  { value: 'other_staff', label: 'Other Staff' },
];

const POSITIONS: PlayerPosition[] = ['PG', 'SG', 'SF', 'PF', 'C'];

interface TalentFormProps {
  /** When provided, the form is in Edit mode. */
  initialData?: Partial<Talent>;
  secret: string;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function TalentForm({ initialData, secret }: TalentFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = !!initialData?.id;

  const [form, setForm] = useState({
    full_name: initialData?.full_name ?? '',
    full_name_jp: initialData?.full_name_jp ?? '',
    slug: initialData?.slug ?? '',
    role: initialData?.role ?? ('player' as TalentRole),
    position: initialData?.position ?? ('' as PlayerPosition | ''),
    height_cm: initialData?.height_cm?.toString() ?? '',
    weight_kg: initialData?.weight_kg?.toString() ?? '',
    current_team: initialData?.current_team ?? '',
    nationality: initialData?.nationality ?? 'Brazilian',
    past_teams: (initialData?.past_teams ?? []).join(', '),
    bio: initialData?.bio ?? '',
    bio_jp: initialData?.bio_jp ?? '',
    photo_url: initialData?.photo_url ?? '',
    highlight_urls: (initialData?.highlight_urls ?? []).join('\n'),
    featured_on_home: initialData?.featured_on_home ?? false,
    homepage_order: initialData?.homepage_order?.toString() ?? '',
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData?.photo_url ?? null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      // Auto-generate slug when full_name changes (only in create mode)
      ...(name === 'full_name' && !isEditing ? { slug: slugify(value) } : {}),
    }));
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview
    const objectUrl = URL.createObjectURL(file);
    setPhotoPreview(objectUrl);

    // Upload to Supabase Storage
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-admin-secret': secret },
        body: formData,
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? 'Upload failed');
      }
      const { url } = await res.json();
      setForm((prev) => ({ ...prev, photo_url: url }));
    } catch (err) {
      setError(`Photo upload error: ${(err as Error).message}`);
      setPhotoPreview(initialData?.photo_url ?? null);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // Build payload — strip empty optional fields
    const payload: Record<string, unknown> = {
      full_name: form.full_name,
      slug: form.slug,
      role: form.role,
      nationality: form.nationality,
      past_teams: form.past_teams
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      highlight_urls: form.highlight_urls
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean),
      featured_on_home: form.featured_on_home,
      homepage_order: form.homepage_order ? parseInt(form.homepage_order, 10) : null,
    };

    if (form.full_name_jp) payload.full_name_jp = form.full_name_jp;
    if (form.position) payload.position = form.position;
    if (form.height_cm) payload.height_cm = parseInt(form.height_cm, 10);
    if (form.weight_kg) payload.weight_kg = parseInt(form.weight_kg, 10);
    if (form.current_team) payload.current_team = form.current_team;
    if (form.bio) payload.bio = form.bio;
    if (form.bio_jp) payload.bio_jp = form.bio_jp;
    if (form.photo_url) payload.photo_url = form.photo_url;

    try {
      const url = isEditing ? `/api/talents/${initialData!.id}` : '/api/talents';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': secret,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? 'Failed to save');
      }

      setSuccess(true);
      setTimeout(() => router.push(`/admin/${secret}`), 1200);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!isEditing) return;
    if (!confirm('Delete this talent permanently? This cannot be undone.')) return;

    try {
      const res = await fetch(`/api/talents/${initialData!.id}`, {
        method: 'DELETE',
        headers: { 'x-admin-secret': secret },
      });
      if (!res.ok) throw new Error('Delete failed');
      router.push(`/admin/${secret}`);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  const isPlayer = form.role === 'player';

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Feedback banners */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          ✓ Saved! Redirecting…
        </div>
      )}

      {/* === SECTION: Identity === */}
      <fieldset className="border border-border rounded-xl p-6 space-y-5">
        <legend className="text-sm font-semibold px-2 text-muted-foreground uppercase tracking-wide">
          Identity
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Full Name *" htmlFor="full_name">
            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              value={form.full_name}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. Carlos Silva"
            />
          </FormField>

          <FormField label="Full Name (Japanese)" htmlFor="full_name_jp">
            <input
              id="full_name_jp"
              name="full_name_jp"
              type="text"
              value={form.full_name_jp}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. カルロス・シルバ"
            />
          </FormField>
        </div>

        <FormField label="URL Slug *" htmlFor="slug" hint="Auto-generated from name. Must be unique.">
          <input
            id="slug"
            name="slug"
            type="text"
            required
            value={form.slug}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. carlos-silva"
          />
        </FormField>
      </fieldset>

      {/* === SECTION: Role === */}
      <fieldset className="border border-border rounded-xl p-6 space-y-5">
        <legend className="text-sm font-semibold px-2 text-muted-foreground uppercase tracking-wide">
          Role
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Role *" htmlFor="role">
            <select
              id="role"
              name="role"
              required
              value={form.role}
              onChange={handleChange}
              className={inputClass}
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </FormField>

          {isPlayer && (
            <FormField label="Position" htmlFor="position">
              <select
                id="position"
                name="position"
                value={form.position}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">— Select position —</option>
                {POSITIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </FormField>
          )}
        </div>

        {isPlayer && (
          <div className="grid grid-cols-2 gap-5">
            <FormField label="Height (cm)" htmlFor="height_cm">
              <input
                id="height_cm"
                name="height_cm"
                type="number"
                min={100}
                max={250}
                value={form.height_cm}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. 185"
              />
            </FormField>
            <FormField label="Weight (kg)" htmlFor="weight_kg">
              <input
                id="weight_kg"
                name="weight_kg"
                type="number"
                min={40}
                max={200}
                value={form.weight_kg}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. 82"
              />
            </FormField>
          </div>
        )}
      </fieldset>

      {/* === SECTION: Professional === */}
      <fieldset className="border border-border rounded-xl p-6 space-y-5">
        <legend className="text-sm font-semibold px-2 text-muted-foreground uppercase tracking-wide">
          Professional
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Current Team" htmlFor="current_team">
            <input
              id="current_team"
              name="current_team"
              type="text"
              value={form.current_team}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. São Paulo BC"
            />
          </FormField>
          <FormField label="Nationality *" htmlFor="nationality">
            <input
              id="nationality"
              name="nationality"
              type="text"
              required
              value={form.nationality}
              onChange={handleChange}
              className={inputClass}
            />
          </FormField>
        </div>

        <FormField
          label="Past Teams"
          htmlFor="past_teams"
          hint="Comma-separated list"
        >
          <input
            id="past_teams"
            name="past_teams"
            type="text"
            value={form.past_teams}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. Rio All-Stars, Minas HC"
          />
        </FormField>
      </fieldset>

      {/* === SECTION: Bio === */}
      <fieldset className="border border-border rounded-xl p-6 space-y-5">
        <legend className="text-sm font-semibold px-2 text-muted-foreground uppercase tracking-wide">
          Biography
        </legend>

        <FormField label="Bio (English)" htmlFor="bio">
          <textarea
            id="bio"
            name="bio"
            rows={4}
            value={form.bio}
            onChange={handleChange}
            className={inputClass}
            placeholder="Professional biography…"
          />
        </FormField>

        <FormField label="Bio (Japanese)" htmlFor="bio_jp">
          <textarea
            id="bio_jp"
            name="bio_jp"
            rows={4}
            value={form.bio_jp}
            onChange={handleChange}
            className={inputClass}
            placeholder="プロフィール…"
          />
        </FormField>
      </fieldset>

      {/* === SECTION: Highlights === */}
      <fieldset className="border border-border rounded-xl p-6 space-y-5">
        <legend className="text-sm font-semibold px-2 text-muted-foreground uppercase tracking-wide">
          Highlights
        </legend>

        <FormField
          label="YouTube Highlight Links"
          htmlFor="highlight_urls"
          hint="Add one YouTube URL per line. These will be embedded on the public profile."
        >
          <textarea
            id="highlight_urls"
            name="highlight_urls"
            rows={4}
            value={form.highlight_urls}
            onChange={handleChange}
            className={inputClass}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </FormField>
      </fieldset>

      {/* === SECTION: Homepage Feature === */}
      <fieldset className="border border-border rounded-xl p-6 space-y-5">
        <legend className="text-sm font-semibold px-2 text-muted-foreground uppercase tracking-wide">
          Homepage Feature
        </legend>

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            name="featured_on_home"
            type="checkbox"
            checked={form.featured_on_home}
            onChange={handleChange}
            className="w-4 h-4 accent-orange-500"
          />
          <span className="text-sm font-medium">Feature this talent on the homepage</span>
        </label>

        <FormField
          label="Homepage Order"
          htmlFor="homepage_order"
          hint="Lower numbers appear first. The homepage shows up to 3 featured talents."
        >
          <input
            id="homepage_order"
            name="homepage_order"
            type="number"
            min={1}
            max={99}
            value={form.homepage_order}
            onChange={handleChange}
            className={inputClass}
            placeholder="1"
          />
        </FormField>
      </fieldset>

      {/* === SECTION: Photo === */}
      <fieldset className="border border-border rounded-xl p-6 space-y-5">
        <legend className="text-sm font-semibold px-2 text-muted-foreground uppercase tracking-wide">
          Photo
        </legend>

        <div className="flex items-start gap-6">
          {/* Preview */}
          <div className="w-28 h-36 rounded-xl overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center border border-border">
            {photoPreview ? (
              <Image
                src={photoPreview}
                alt="Preview"
                width={112}
                height={144}
                unoptimized
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-muted-foreground"
              >
                <path d="M18 20a6 6 0 0 0-12 0" />
                <circle cx="12" cy="10" r="4" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted transition text-sm font-medium disabled:opacity-50"
            >
              {uploading ? 'Uploading…' : photoPreview ? 'Change Photo' : 'Upload Photo'}
            </button>
            {form.photo_url && (
              <p className="text-xs text-muted-foreground break-all max-w-sm">{form.photo_url}</p>
            )}
          </div>
        </div>
      </fieldset>

      {/* === Actions === */}
      <div className="flex items-center justify-between pt-2">
        {isEditing ? (
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition border border-red-200"
          >
            Delete talent
          </button>
        ) : (
          <div />
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push(`/admin/${secret}`)}
            className="px-5 py-2 rounded-lg border border-border bg-background hover:bg-muted transition text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-6 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition disabled:opacity-50 shadow-sm"
          >
            {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Talent'}
          </button>
        </div>
      </div>
    </form>
  );
}

/* ─── Sub-components ─────────────────────────────────────────── */

const inputClass =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition';

function FormField({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
