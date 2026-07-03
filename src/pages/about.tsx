import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-96 bg-gradient-luxury flex items-center justify-center text-white">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1488229297570-58a25fb6cb20?w=1600&h=800&fit=crop"
            alt="About"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
          <h1 className="text-5xl font-display font-bold mb-4">Our Story</h1>
          <p className="text-xl text-gray-100">
            A legacy of craftsmanship from the heart of Jaipur
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Story Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold text-primary mb-6">
                Who We Are
              </h2>
              <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                We are passionate purveyors of authentic Jaipur bedsheets, deeply rooted in the
                rich heritage of textile craftsmanship. Our mission is to bring the warmth,
                comfort, and artistry of traditional Jaipur weaving to homes across India and
                beyond.
              </p>
              <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                Each piece in our collection is carefully selected or commissioned from master
                weavers who have perfected their craft over generations. We believe that sleeping
                on quality bedsheets is not a luxury—it's a necessity for well-being.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Our commitment goes beyond offering beautiful products. We're dedicated to
                supporting artisan communities, promoting sustainable practices, and preserving
                the art of traditional textile weaving for future generations.
              </p>
            </div>
            <div className="relative h-96">
              <Image
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=600&fit=crop"
                alt="Jaipur Bedsheets"
                fill
                className="object-cover rounded-xl"
              />
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-20 bg-cream p-12 rounded-xl">
          <h2 className="text-4xl font-display font-bold text-primary mb-12 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: '🌱',
                title: 'Sustainability',
                description: 'Eco-friendly production and ethical sourcing',
              },
              {
                icon: '👥',
                title: 'Community',
                description: 'Supporting artisans and their families',
              },
              {
                icon: '✨',
                title: 'Quality',
                description: 'Premium materials and meticulous craftsmanship',
              },
              {
                icon: '💎',
                title: 'Heritage',
                description: 'Preserving traditional weaving techniques',
              },
            ].map((value, idx) => (
              <div key={idx} className="text-center">
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-primary mb-2">{value.title}</h3>
                <p className="text-gray-700">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Impact Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-display font-bold text-primary mb-12 text-center">
            Our Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: '10,000+', label: 'Happy Customers' },
              { number: '500+', label: 'Artisans Supported' },
              { number: '50,000+', label: 'Bedsheets Sold' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center p-8 bg-gradient-soft rounded-xl">
                <div className="text-5xl font-display font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <p className="text-gray-700 text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Process Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-display font-bold text-primary mb-12 text-center">
            Our Process
          </h2>
          <div className="space-y-8">
            {[
              {
                step: '1',
                title: 'Source',
                description:
                  'We work directly with master weavers and textile craftspeople from Jaipur.',
              },
              {
                step: '2',
                title: 'Create',
                description:
                  'Traditional techniques are used to create unique, high-quality bedsheets.',
              },
              {
                step: '3',
                title: 'Test',
                description: 'Every piece is tested for quality, durability, and comfort.',
              },
              {
                step: '4',
                title: 'Deliver',
                description:
                  'Your bedsheets are carefully packaged and delivered to your doorstep.',
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6 items-center">
                <div className="w-16 h-16 flex-shrink-0 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-2">{item.title}</h3>
                  <p className="text-gray-700 text-lg">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-white rounded-xl p-12 text-center">
          <h2 className="text-4xl font-display font-bold mb-6">Join Our Community</h2>
          <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
            Experience the difference that authentic Jaipur craftsmanship brings to your home.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-accent text-primary px-10 py-4 rounded-lg font-bold text-lg hover:bg-accent-dark transition-colors"
          >
            Explore Our Collection
          </Link>
        </section>
      </div>
    </div>
  );
}
