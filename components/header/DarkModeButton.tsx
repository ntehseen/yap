 
import React from 'react';
import { useAtom } from 'jotai';
import atoms from '../../util/atoms';

const STORAGE_KEY = 'darkModeYap';
const LEGACY_STORAGE_KEY = 'darkModeInstagram';

function DarkModeButton() {
  const [darkMode, setDarkMode] = useAtom(atoms.darkMode);

  function handleDarkMode() {
    const next = !darkMode;
    localStorage.setItem(STORAGE_KEY, next ? 'true' : 'false');
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    setDarkMode(next);
  }

  return (
    <button
      className="relative flex w-[50px] cursor-pointer items-center gap-2 rounded-xl bg-primary py-[2px] px-1"
      onClick={() => handleDarkMode()}
      type="button"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div
        className={`${
          darkMode ? 'translate-x-6' : 'translate-x-0'
        } absolute h-[18px] w-[18px] rounded-full bg-primary-foreground transition duration-200 ease-linear`}
      />
      <picture>
        <img className="h-4 w-4 select-none" src="/moon.png" alt="" />
      </picture>
      <picture>
        <img className="h-[18px] w-[18px] select-none" src="/sun.png" alt="" />
      </picture>
    </button>
  );
}

export default DarkModeButton;
