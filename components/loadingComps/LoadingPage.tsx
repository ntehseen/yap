import Head from 'next/head';
import AppShell from '../layout/AppShell';
import YappersLogo from '../brand/YappersLogo';

function LoadingPage({ checkingUserRoute }: { checkingUserRoute: boolean }) {
  if (checkingUserRoute) {
    return (
      <AppShell page="Profile">
        <Head>
          <title>Yap</title>
          <meta
            name="description"
            content="Yap — where the X-Clash community comes to yap."
          />
          <link rel="icon" href="/instagram.png" />
        </Head>
        <div className="flex h-[50vh] w-full items-center justify-center">
          <YappersLogo />
        </div>
      </AppShell>
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
      <Head>
        <title>Yap</title>
        <meta
          name="description"
          content="Yap — where the X-Clash community comes to yap."
        />
        <link rel="icon" href="/instagram.png" />
      </Head>
      <YappersLogo />
    </div>
  );
}

export default LoadingPage;
