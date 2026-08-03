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
      <div className="flex min-h-[100vh] w-full items-center justify-center bg-background">
        <div>
          <div className="relative hidden h-[590px] overflow-hidden lg:block">
            <Image
              priority
              src="/loginFrame.png"
              alt="Yap"
              height={635}
              width={465}
            />
            <picture>
              <img src="/loginFrame.png" alt="" />
            </picture>
            <div className="absolute top-[26px] right-14 h-full w-full">
              <div className="relative ">
                <div className="absolute top-0 right-0 h-[541px] w-[250px] animate-loginImage1 opacity-0">
                  <Image
                    priority
                    src="/loginImg1.png"
                    alt=""
                    fill
                    className="object-contain"
                    sizes="250px"
                  />
                </div>
                <div className="absolute top-0 right-0 h-[541px] w-[250px] animate-loginImage2 opacity-0">
                  <Image
                    src="/loginImg2.png"
                    alt=""
                    fill
                    className="object-contain"
                    sizes="250px"
                  />
                </div>
                <div className="absolute top-0 right-0 h-[541px] w-[250px] animate-loginImage3 opacity-0">
                  <Image
                    src="/loginImg3.png"
                    alt=""
                    fill
                    className="object-contain"
                    sizes="250px"
                  />
                </div>

                <div className="absolute top-0 right-0 h-[541px] w-[250px] animate-loginImage4 opacity-0">
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
          </div>
        </div>
        <div>
          <div className="flex max-w-[350px] flex-col items-center justify-center border border-border bg-card">
            <div className="flex h-auto w-full justify-center py-10">
              <YappersLogo href="/Login" />
            </div>
            <div className="w-full px-5 sm:px-10">
              <GoogleSignInButton
                listeners={listeners}
                setIsSubmit={setIsSubmit}
                setError={setAuthError}
                setLoading={setGoogleLoading}
                loading={googleLoading}
              />
              <div className="mb-5 flex h-0 items-center justify-center">
                <div className="w-full border-b border-border" />
                <p className="mx-2 text-sm font-semibold text-muted-foreground">
                  OR
                </p>
                <div className="w-full border-b border-border" />
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
                <label htmlFor="signInPageEmail">
                  {' '}
                  <input
                    className=" w-full border border-border bg-muted px-2 py-[7px] text-sm focus:outline-none"
                    type="email"
                    id="signInPageEmail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                  />
                </label>
                <p className="h-[20px] max-w-[220px] pb-2 text-[10px] text-red-600">
                  {emailFormErrors}
                </p>
                <label htmlFor="signInPagePassword">
                  {' '}
                  <input
                    className="w-full border border-border bg-muted px-2 py-[7px] text-sm focus:outline-none"
                    type="password"
                    id="signInPagePassword"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                  />
                </label>
                <p className="h-[20px] max-w-[220px] text-[10px] text-red-600">
                  {passwordFormErrors || authError}
                </p>
                <button
                  className={`${
                    emailFormErrors === '' && passwordFormErrors === ''
                      ? 'bg-primary text-primary-foreground'
                      : 'pointer-events-none cursor-default bg-primary/40 text-primary-foreground'
                  } my-5 w-full rounded-[4px]  px-2 py-1 text-sm font-semibold`}
                  type="submit"
                >
                  Log In
                </button>
                <button
                  className="mb-10 w-full rounded-[4px] border border-border bg-transparent px-2 py-1 text-sm font-semibold text-foreground hover:bg-muted"
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
          </div>
          <div className="mt-2 flex max-w-[350px] justify-center border border-border bg-card py-5 text-[14px]">
            <p>Do not have an account?</p>
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
