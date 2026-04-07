'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo">
          <span className="logo-text">MAIZ</span>
        </Link>
        <div className="navbar-links">
          <Link href="/" className="nav-link">Restaurants</Link>
          {session ? (
            <>
              <Link href="/my-bookings" className="nav-link">My Bookings</Link>
              <span className="nav-user">{session.user?.name}</span>
              <button className="btn-outline" onClick={handleSignOut}>Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="btn-outline">Sign In</Link>
              <Link href="/auth/signup" className="btn-primary-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
