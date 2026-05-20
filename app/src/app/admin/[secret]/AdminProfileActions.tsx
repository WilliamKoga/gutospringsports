'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';

interface AdminProfileActionsProps {
  secret: string;
  talentId: string;
  slug: string;
}

export default function AdminProfileActions({
  secret,
  talentId,
  slug,
}: AdminProfileActionsProps) {
  const [copied, setCopied] = useState(false);
  const profilePath = `/en/catalog/${slug}`;

  const profileUrl = useMemo(() => {
    if (typeof window === 'undefined') {
      return profilePath;
    }

    return `${window.location.origin}${profilePath}`;
  }, [profilePath]);

  async function copyProfileLink() {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex justify-end gap-2">
      <Link href={profilePath} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" size="sm">
          Open Profile
        </Button>
      </Link>
      <Button variant="outline" size="sm" type="button" onClick={copyProfileLink}>
        {copied ? 'Copied' : 'Copy Link'}
      </Button>
      <Link href={`/admin/${secret}/edit/${talentId}`}>
        <Button variant="ghost" size="sm">
          Edit
        </Button>
      </Link>
    </div>
  );
}
