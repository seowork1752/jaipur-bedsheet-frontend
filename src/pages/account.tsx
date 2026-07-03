import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { apiClient } from '@/utils/api';
import { useUserStore } from '@/store';
import toast from 'react-hot-toast';

export default function Account() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    isDefault: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as any;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as any;
    setNewAddress({
      ...newAddress,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      const response = await apiClient.put('/auth/profile', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      });

      if (response.data.success) {
        setUser(response.data.data);
        toast.success('Profile updated successfully');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await apiClient.post('/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      toast.success('Password changed successfully');
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async () => {
    try {
      setLoading(true);
      const response = await apiClient.post('/auth/addresses', newAddress);

      if (response.data.success) {
        setAddresses([...addresses, response.data.data]);
        setNewAddress({
          fullName: '',
          phone: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          pincode: '',
          country: 'India',
          isDefault: false,
        });
        toast.success('Address added successfully');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (addressId: string) => {
    try {
      setLoading(true);
      await apiClient.delete(`/auth/addresses/${addressId}`);

      setAddresses(addresses.filter((addr: any) => addr._id !== addressId));
      toast.success('Address deleted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete address');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-soft py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-display font-bold text-primary">My Account</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-cream p-6 rounded-lg sticky top-20">
              <h3 className="text-lg font-bold text-primary mb-4">Account Menu</h3>
              <nav className="space-y-2">
                {[
                  { id: 'profile', label: '👤 Profile', icon: '👤' },
                  { id: 'addresses', label: '📍 Addresses', icon: '📍' },
                  { id: 'password', label: '🔐 Password', icon: '🔐' },
                  { id: 'orders', label: '📦 Orders', icon: '📦' },
                  { id: 'wishlist', label: '❤️ Wishlist', icon: '❤️' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'orders') {
                        window.location.href = '/orders';
                        return;
                      }
                      if (item.id === 'wishlist') {
                        window.location.href = '/wishlist';
                        return;
                      }
                      setActiveTab(item.id);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition-colors ${
                      activeTab === item.id
                        ? 'bg-primary text-white'
                        : 'text-primary hover:bg-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-cream p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-primary mb-6">Profile Information</h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <button
                    onClick={updateProfile}
                    disabled={loading}
                    className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="space-y-8">
                {/* Add New Address */}
                <div className="bg-cream p-6 rounded-lg">
                  <h2 className="text-2xl font-bold text-primary mb-6">Add New Address</h2>

                  <div className="space-y-4">
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={newAddress.fullName}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={newAddress.phone}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      name="addressLine1"
                      placeholder="Address Line 1"
                      value={newAddress.addressLine1}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      name="addressLine2"
                      placeholder="Address Line 2 (Optional)"
                      value={newAddress.addressLine2}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={newAddress.city}
                        onChange={handleAddressChange}
                        className="px-4 py-3 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={newAddress.state}
                        onChange={handleAddressChange}
                        className="px-4 py-3 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <input
                      type="text"
                      name="pincode"
                      placeholder="Pincode"
                      value={newAddress.pincode}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isDefault"
                        checked={newAddress.isDefault}
                        onChange={handleAddressChange}
                        className="w-4 h-4"
                      />
                      <span className="ml-2 text-gray-700">Set as default address</span>
                    </label>

                    <button
                      onClick={addAddress}
                      disabled={loading}
                      className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark disabled:opacity-50"
                    >
                      {loading ? 'Adding...' : 'Add Address'}
                    </button>
                  </div>
                </div>

                {/* Saved Addresses */}
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-6">Saved Addresses</h2>

                  {addresses.length === 0 ? (
                    <div className="bg-cream p-6 rounded-lg text-center text-gray-600">
                      No addresses saved yet
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {addresses.map((address: any) => (
                        <div key={address._id} className="bg-cream p-6 rounded-lg">
                          <p className="font-bold text-primary mb-2">{address.fullName}</p>
                          <p className="text-sm text-gray-700 mb-1">{address.addressLine1}</p>
                          {address.addressLine2 && (
                            <p className="text-sm text-gray-700 mb-1">{address.addressLine2}</p>
                          )}
                          <p className="text-sm text-gray-700 mb-1">
                            {address.city}, {address.state} {address.pincode}
                          </p>
                          <p className="text-sm text-gray-700 mb-4">{address.phone}</p>

                          <button
                            onClick={() => deleteAddress(address._id)}
                            disabled={loading}
                            className="text-red-500 hover:text-red-700 font-semibold text-sm"
                          >
                            Delete Address
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div className="bg-cream p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-primary mb-6">Change Password</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <button
                    onClick={changePassword}
                    disabled={loading}
                    className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Change Password'}
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
