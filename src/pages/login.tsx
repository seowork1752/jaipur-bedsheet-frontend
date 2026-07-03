import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { apiClient } from '@/utils/api';
import { useUserStore } from '@/store';
import toast from 'react-hot-toast';

export default function Login() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: '',
  });

  const setUser = useUserStore((state) => state.setUser);
  const setToken = useUserStore((state) => state.setToken);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const response = await apiClient.post('/auth/login', {
          email: formData.email,
          password: formData.password,
        });

        if (response.data.success) {
          const { user, token } = response.data.data;
          setUser(user);
          setToken(token);
          localStorage.setItem('authToken', token);
          toast.success('Login successful!');
          router.push('/');
        }
      } else {
        // Register
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          setLoading(false);
          return;
        }

        const response = await apiClient.post('/auth/register', {
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          firstName: formData.firstName,
          lastName: formData.lastName,
        });

        if (response.data.success) {
          const { user, token } = response.data.data;
          setUser(user);
          setToken(token);
          localStorage.setItem('authToken', token);
          toast.success('Registration successful!');
          router.push('/');
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-luxury flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-white mb-2">
            Jaipur Bedsheets
          </h1>
          <p className="text-cream text-lg">
            {isLogin ? 'Welcome Back' : 'Join Our Community'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-luxury p-8">
          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b-2 border-gray-200">
            <button
              onClick={() => {
                setIsLogin(true);
                setFormData({
                  email: '',
                  password: '',
                  firstName: '',
                  lastName: '',
                  confirmPassword: '',
                });
              }}
              className={`flex-1 pb-4 font-bold text-lg transition-colors ${
                isLogin
                  ? 'text-primary border-b-2 border-primary -mb-2'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setFormData({
                  email: '',
                  password: '',
                  firstName: '',
                  lastName: '',
                  confirmPassword: '',
                });
              }}
              className={`flex-1 pb-4 font-bold text-lg transition-colors ${
                !isLogin
                  ? 'text-primary border-b-2 border-primary -mb-2'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required={!isLogin}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required={!isLogin}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
              </>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />

            {!isLogin && (
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required={!isLogin}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            )}

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-primary"
                    defaultChecked
                  />
                  <span className="ml-2 text-gray-700">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-primary hover:text-accent">
                  Forgot Password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-bold text-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-500 text-sm">Or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button className="px-4 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <span>🔵</span> Google
            </button>
            <button className="px-4 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <span>📘</span> Facebook
            </button>
          </div>

          {/* Switch Mode */}
          <p className="text-center text-gray-600 mt-6">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({
                  email: '',
                  password: '',
                  firstName: '',
                  lastName: '',
                  confirmPassword: '',
                });
              }}
              className="text-primary font-bold hover:text-accent"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>

        {/* Footer Links */}
        <div className="text-center mt-8 text-white text-sm">
          <p>
            By continuing, you agree to our{' '}
            <Link href="/terms" className="underline hover:no-underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline hover:no-underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
