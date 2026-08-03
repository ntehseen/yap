import Head from 'next/head';
import AppShell from '../layout/AppShell';

export default function UserDoesNotExist({
  search,
}: {
  search: string | string[] | undefined;
}) {
  return (
    <AppShell page="Profile" title="Profile">
      <Head>
        <title>Profile • Yap</title>
        <meta name="description" content="User not found on Yap." />
        <link rel="icon" href="/instagram.png" />
      </Head>
      <div className="flex w-full justify-center px-4 pt-10">
        <p className="text-center text-xl font-semibold">
          Sorry, this user {search} was not found.
        </p>
      </div>
    </AppShell>
  );
}
