import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { useUserStore } from '@/store';
import { apiClient } from '@/utils/api';
import '@/styles/globals.css';

// Layout wrapper
import Layout from '@/components/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  const setUser = useUserStore((state) => state.setUser);
  const setToken = useUserStore((state) => state.setToken);

  // Initialize user on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setToken(token);
      // Fetch current user
      apiClient
        .get('/auth/me')
        .then((response) => {
          setUser(response.data.data);
        })
        .catch(() => {
          // Token invalid, clear it
          localStorage.removeItem('authToken');
        });
    }
  }, [setUser, setToken]);

  // Pages that don't need layout
  const noLayoutPages = ['/login', '/forgot-password'];

  const isNoLayoutPage = noLayoutPages.includes(Component.displayName || '');

  return (
    <>
      {isNoLayoutPage ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#0F3A6B',
            color: '#fff',
            fontWeight: 'bold',
          },
          success: {
            duration: 2000,
            style: {
              background: '#10B981',
            },
          },
          error: {
            duration: 3000,
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
    </>
  );
}

export default MyApp;
