'use client';

import { useRouter } from 'next/navigation';
import styles from './admin.module.css';

export default function LogoutButton({ secret }: { secret: string }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/session', { method: 'DELETE' });
    router.push(`/admin/${secret}/login`);
    router.refresh();
  }

  return (
    <button type="button" className={styles.btnLogout} onClick={handleLogout}>
      Logout
    </button>
  );
}
