import React from 'react';
import Router from 'next/router';
import Image from 'next/image';
import Head from 'next/head';
import { useAtom } from 'jotai';
import { NextPage } from 'next';
import useSetFormErrors from '../hooks/useSetFormErrors';
import atoms from '../util/atoms';
import useHandleSignIn from '../hooks/useHandleSignIn';
import handleSignIn from '../util/handleSignIn';
import YappersLogo from '../components/brand/YappersLogo';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';

const Login: NextPage = () => {
  const [listeners] = useAtom(atoms.listeners);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [emailFormErrors, setEmailFormErrors] = React.useState('');
  const [passwordFormErrors, setPasswordFormErrors] = React.useState('');
  const [, setUsernameFormErrors] = React.useState('');
  const [isSubmit, setIsSubmit] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [authError, setAuthError] = React.useState('');

  useSetFormErrors({
    email,
    password,
    setEmailFormErrors,
    setPasswordFormErrors,
    setUsernameFormErrors,
  });

  useHandleSignIn({ isSubmit });

  return (
    <div>
      <Head>
        <title>Log in • Yap</title>
        <meta
          name="description"
          content="Log in to Yap — where the X-Clash community comes to yap."
        />
        <link rel="icon" href="/instagram.png" />
      </Head>
      <div className="flex min-h-dvh w-full items-center justify-center gap-10 bg-background px-4 py-10">
        <div className="relative hidden h-[590px] w-[380px] shrink-0 overflow-hidden lg:block">
          <Image
            priority
            src="/loginFrame.png"
            alt=""
            height={635}
            width={465}
            className="h-full w-auto"
          />
          <div className="absolute top-[26px] right-[56px] h-[541px] w-[250px]">
            <div className="absolute inset-0 animate-loginImage1 opacity-0">
              <Image
                priority
                src="/loginImg1.png"
                alt=""
                fill
                className="object-contain"
                sizes="250px"
              />
            </div>
            <div className="absolute inset-0 animate-loginImage2 opacity-0">
              <Image
                src="/loginImg2.png"
                alt=""
                fill
                className="object-contain"
                sizes="250px"
              />
            </div>
            <div className="absolute inset-0 animate-loginImage3 opacity-0">
              <Image
                src="/loginImg3.png"
                alt=""
                fill
                className="object-contain"
                sizes="250px"
              />
            </div>
            <div className="absolute inset-0 animate-loginImage4 opacity-0">
              <Image
                src="/loginImg4.png"
                alt=""
                fill
                className="object-contain"
                sizes="250px"
              />
            </div>
          </div>
        </div>

        <div className="w-full max-w-[420px]">
          <div className="rounded-2xl border border-border bg-card px-6 py-8 sm:px-10">
            <div className="mb-8 flex justify-center">
              <YappersLogo href="/Login" className="scale-110" />
            </div>
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
                handleSignIn({
                  e,
                  listeners,
                  passwordFormErrors,
                  emailFormErrors,
                  email,
                  password,
                  guest: false,
                  setIsSubmit,
                  setPasswordFormErrors,
                })
              }
            >
              <label htmlFor="signInPageEmail" className="block">
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
                  autoComplete="current-password"
                />
              </label>
              <p className="min-h-[20px] pt-1 text-xs text-destructive">
                {passwordFormErrors || authError}
              </p>
              <button
                className={`${
                  emailFormErrors === '' && passwordFormErrors === ''
                    ? 'bg-primary text-primary-foreground hover:opacity-90'
                    : 'pointer-events-none cursor-default bg-primary/40 text-primary-foreground'
                } mt-4 w-full rounded-md px-3 py-3 text-sm font-semibold`}
                type="submit"
              >
                Log In
              </button>
              <button
                className="mt-3 mb-2 w-full rounded-md border border-border bg-transparent px-3 py-3 text-sm font-semibold text-foreground hover:bg-muted"
                type="button"
                onClick={(e: any) =>
                  handleSignIn({
                    e,
                    listeners,
                    passwordFormErrors,
                    emailFormErrors,
                    email,
                    password,
                    guest: true,
                    setIsSubmit,
                    setPasswordFormErrors,
                  })
                }
              >
                Guest Account
              </button>
            </form>
          </div>
          <div className="mt-3 flex justify-center rounded-2xl border border-border bg-card py-5 text-sm">
            <p className="text-muted-foreground">Do not have an account?</p>
            <button
              className="ml-1 font-semibold text-primary"
              type="button"
              onClick={() => Router.push('/SignUp')}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
