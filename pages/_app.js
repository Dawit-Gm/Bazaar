import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { StoreProvider } from '../utils/Store';
import Head from 'next/head';
import Script from 'next/script';
import TawkTo from '../components/TawkTo';
import RememberSocialUser from '../components/RememberSocialUser';


function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#16a34a" />
      </Head>

      {/* Google Identity Services for account detection */}
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
      />

      <SessionProvider session={session}>
        <StoreProvider>
          <RememberSocialUser />
          <TawkTo />
          <Component {...pageProps} />
        </StoreProvider>
      </SessionProvider>
    </>
     );
}

export default MyApp;