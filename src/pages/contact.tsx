import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      // In production, connect to your backend email service
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success('Message sent! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-soft py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-display font-bold text-primary mb-2">Contact Us</h1>
          <p className="text-gray-600">We'd love to hear from you. Get in touch with us today.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            {/* Address */}
            <div>
              <h3 className="text-lg font-bold text-primary mb-3">📍 Address</h3>
              <p className="text-gray-700">
                123 Artisan Street<br />
                Jaipur, Rajasthan 302001<br />
                India
              </p>
            </div>

            {/* Phone */}
            <div>
              <h3 className="text-lg font-bold text-primary mb-3">📞 Phone</h3>
              <p className="text-gray-700">
                <a href="tel:+919876543210" className="hover:text-primary">
                  +91 98765 43210
                </a>
              </p>
              <p className="text-gray-700 text-sm mt-1">
                Monday - Saturday, 9AM - 6PM IST
              </p>
            </div>

            {/* Email */}
            <div>
              <h3 className="text-lg font-bold text-primary mb-3">✉️ Email</h3>
              <p className="text-gray-700">
                <a href="mailto:hello@jaipur-bedsheets.com" className="hover:text-primary">
                  hello@jaipur-bedsheets.com
                </a>
              </p>
            </div>

            {/* Social */}
            <div>
              <h3 className="text-lg font-bold text-primary mb-3">Follow Us</h3>
              <div className="flex gap-4 text-2xl">
                <a href="#" className="hover:opacity-75 transition-opacity">
                  📘
                </a>
                <a href="#" className="hover:opacity-75 transition-opacity">
                  📷
                </a>
                <a href="#" className="hover:opacity-75 transition-opacity">
                  𝕏
                </a>
                <a href="#" className="hover:opacity-75 transition-opacity">
                  📌
                </a>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-cream p-6 rounded-lg">
              <h3 className="font-bold text-primary mb-3">Business Hours</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>
                  <span className="font-semibold">Mon - Sat:</span> 9:00 AM - 6:00 PM
                </li>
                <li>
                  <span className="font-semibold">Sun:</span> 10:00 AM - 4:00 PM
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-cream p-8 rounded-xl">
              <h2 className="text-3xl font-bold text-primary mb-6">Send us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    placeholder="Your name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  >
                    <option value="">Select a subject</option>
                    <option value="inquiry">Product Inquiry</option>
                    <option value="feedback">Feedback</option>
                    <option value="issue">Issues/Complaints</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 rounded-lg font-bold text-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>

              <p className="text-sm text-gray-600 text-center mt-6">
                We typically respond within 24 hours
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: 'What is your return policy?',
                a: '30-day money-back guarantee. No questions asked.',
              },
              {
                q: 'Do you ship internationally?',
                a: 'Yes, we ship to USA, Canada, UK, UAE, and more.',
              },
              {
                q: 'How can I track my order?',
                a: 'Track it from your account dashboard or check your email.',
              },
              {
                q: 'Are your products eco-friendly?',
                a: 'Yes, we use sustainable materials and ethical production.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-cream p-6 rounded-lg">
                <h3 className="font-bold text-primary mb-2">{faq.q}</h3>
                <p className="text-gray-700 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
