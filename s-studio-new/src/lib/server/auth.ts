import { Lucia } from 'lucia';
import { XataAdapter } from '@lucia-auth/adapter-xata';
import { dev } from '$app/environment';
import { xataClient } from './xata';

const adapter = new XataAdapter(xataClient.db.session, xataClient.db.user);

export const auth = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !dev
    }
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      name: attributes.name,
      role: attributes.role
    };
  }
});

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const createUser = async (email: string, password: string, name?: string) => {
  if (!validateEmail(email)) {
    throw new Error('Invalid email');
  }

  if (!validatePassword(password)) {
    throw new Error('Password must be at least 8 characters');
  }

  const existingUser = await xataClient.db.user.filter({ email }).getFirst();

  if (existingUser) {
    throw new Error('Email already in use');
  }

  const user = await xataClient.db.user.create({
    email,
    password: await auth.hashPassword(password),
    name
  });

  return user;
};

export const signIn = async (email: string, password: string) => {
  const user = await xataClient.db.user.filter({ email }).getFirst();

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const validPassword = await auth.validatePassword(password, user.password);

  if (!validPassword) {
    throw new Error('Invalid credentials');
  }

  const session = await auth.createSession(user.id);
  return { user, session };
};

export const signOut = async (sessionId: string) => {
  await auth.invalidateSession(sessionId);
};

export const validateSession = async (sessionId: string) => {
  const { session, user } = await auth.validateSession(sessionId);
  return { session, user };
};

export type Auth = typeof auth;
