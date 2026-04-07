'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RestaurantNavbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <nav className="navbar restaurant-navbar">
      <div className="navbar-container">
        <Link href="/restaurant/dashboard" className="navbar-logo">
          <span className="logo-text">MAIZ</span>
          <span className="navbar-badge">Restaurant</span>
        </Link>
        <div className="navbar-links">
          <Link href="/restaurant/dashboard" className="nav-link">Dashboard</Link>
          {session && (
            <>
              <span className="nav-user">{session.user?.name}</span>
              <button className="btn-outline" onClick={handleSignOut}>Sign Out</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
