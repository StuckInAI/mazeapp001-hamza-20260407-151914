import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? 'google-client-id-placeholder',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? 'google-client-secret-placeholder',
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID ?? 'facebook-client-id-placeholder',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? 'facebook-client-secret-placeholder',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const demoAccounts = [
          { id: 'consumer-1', email: 'consumer@maiz.com', password: 'password123', name: 'Demo Consumer', role: 'consumer' },
          { id: 'restaurant-1', email: 'restaurant@maiz.com', password: 'password123', name: 'Casa Verde Manager', role: 'restaurant', restaurantId: '1' },
          { id: 'restaurant-2', email: 'sakura@maiz.com', password: 'password123', name: 'Sakura Garden Manager', role: 'restaurant', restaurantId: '2' },
        ];

        const user = demoAccounts.find(
          (acc) => acc.email === credentials.email && acc.password === credentials.password
        );

        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            restaurantId: 'restaurantId' in user ? user.restaurantId : undefined,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as { id: string; role?: string; restaurantId?: string };
        token.role = u.role ?? 'consumer';
        token.restaurantId = u.restaurantId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string; restaurantId?: string }).role = token.role as string;
        (session.user as { role?: string; restaurantId?: string }).restaurantId = token.restaurantId as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET ?? 'maiz-secret-key-change-in-production',
};
