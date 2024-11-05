'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    const cookies = parseCookies();
    const userToken = cookies['user.token'];
    if (!userToken) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div>
      {children}
    </div>
  );
}
