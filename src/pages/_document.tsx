import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#0F3A6B" />
        <meta name="description" content="Premium Jaipur bedsheets with traditional craftsmanship and modern comfort" />
        <meta name="keywords" content="bedsheets, jaipur, cotton, hand-block print, sanganeri" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Jaipur Bedsheets - Premium Quality" />
        <meta property="og:description" content="Experience luxury with authentic Jaipur heritage bedsheets" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1540932239986-a128078d0e21?w=1200" />
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Manifest for PWA */}
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body>
        <Main />
        <NextScript />
        
        {/* Analytics */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || ''}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID || ''}');
            `,
          }}
        />
      </body>
    </Html>
  );
}
