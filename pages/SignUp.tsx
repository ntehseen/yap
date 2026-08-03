import React from 'react';
import Router from 'next/router';
import Head from 'next/head';
import { useAtom } from 'jotai';
import { NextPage } from 'next';
import atoms from '../util/atoms';
import useHandleSignIn from '../hooks/useHandleSignIn';
import useSetFormErrors from '../hooks/useSetFormErrors';
import handleCreateUser from '../util/handleCreateUser';
import YappersLogo from '../components/brand/YappersLogo';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';

const SignUp: NextPage = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [emailFormErrors, setEmailFormErrors] = React.useState('');
  const [passwordFormErrors, setPasswordFormErrors] = React.useState('');
  const [usernameFormErrors, setUsernameFormErrors] = React.useState('');
  const [isSubmit, setIsSubmit] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [authError, setAuthError] = React.useState('');

  const [listeners] = useAtom(atoms.listeners);

  useSetFormErrors({
    email,
    password,
    username,
    setEmailFormErrors,
    setPasswordFormErrors,
    setUsernameFormErrors,
  });

  useHandleSignIn({ isSubmit });

  if (loading) {
    return (
      <div className="flex min-h-dvh w-full items-center justify-center bg-background">
        <YappersLogo />
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Sign up • Yap</title>
        <meta
          name="description"
          content="Join Yap — where the X-Clash community comes to yap."
        />
        <link rel="icon" href="/instagram.png" />
      </Head>
      <div className="flex min-h-dvh w-full items-center justify-center bg-background px-4 py-10">
        <div className="w-full max-w-[420px]">
          <div className="rounded-2xl border border-border bg-card px-6 py-8 sm:px-10">
            <div className="mb-4 flex justify-center">
              <YappersLogo href="/SignUp" className="scale-110" />
            </div>
            <p className="mb-6 text-center text-sm font-medium text-muted-foreground">
              Sign up to yap with the X-Clash community.
            </p>
            <GoogleSignInButton
              listeners={listeners}
              setIsSubmit={setIsSubmit}
              setError={setAuthError}
              setLoading={setGoogleLoading}
              loading={googleLoading}
            />
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Or
              </p>
              <div className="h-px flex-1 bg-border" />
            </div>
            <form
              action=""
              className="signInPageFormContainer"
              onSubmit={(e: any) =>
                handleCreateUser({
                  e,
                  listeners,
                  username,
                  email,
                  password,
                  passwordFormErrors,
                  emailFormErrors,
                  usernameFormErrors,
                  setIsSubmit,
                  setLoading,
                  setPasswordFormErrors,
                })
              }
            >
              <label htmlFor="signInPageUserName" className="block">
                <input
                  className="w-full rounded-md border border-border bg-muted px-3 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  type="text"
                  id="signInPageUserName"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  autoComplete="username"
                />
              </label>
              <p className="min-h-[20px] pt-1 text-xs text-destructive">
                {usernameFormErrors}
              </p>
              <label htmlFor="signInPageEmail" className="mt-1 block">
                <input
                  className="w-full rounded-md border border-border bg-muted px-3 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  type="email"
                  id="signInPageEmail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  autoComplete="email"
                />
              </label>
              <p className="min-h-[20px] pt-1 text-xs text-destructive">
                {emailFormErrors}
              </p>
              <label htmlFor="signInPagePassword" className="mt-1 block">
                <input
                  className="w-full rounded-md border border-border bg-muted px-3 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  type="password"
                  id="signInPagePassword"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  autoComplete="new-password"
                />
              </label>
              <p className="min-h-[20px] pt-1 text-xs text-destructive">
                {passwordFormErrors || authError}
              </p>
              <button
                className={`${
                  emailFormErrors === '' &&
                  passwordFormErrors === '' &&
                  usernameFormErrors === ''
                    ? 'bg-primary text-primary-foreground hover:opacity-90'
                    : 'pointer-events-none cursor-default bg-primary/40 text-primary-foreground'
                } mt-4 w-full rounded-md px-3 py-3 text-sm font-semibold`}
                type="submit"
              >
                Sign Up
              </button>
            </form>
          </div>
          <div className="mt-3 flex justify-center rounded-2xl border border-border bg-card py-5 text-sm">
            <p className="text-muted-foreground">Have an account?</p>
            <button
              className="ml-1 font-semibold text-primary"
              type="button"
              onClick={() => Router.push('/Login')}
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
