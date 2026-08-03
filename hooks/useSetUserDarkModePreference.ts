/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useAtom } from 'jotai';
import atoms from '../util/atoms';

function useSetUserDarkModePreference() {
  const [, setDarkMode] = useAtom(atoms.darkMode);

  React.useEffect(() => {
    const darkModeStatus =
      localStorage.getItem('darkModeYap') ??
      localStorage.getItem('darkModeInstagram');

    if (darkModeStatus === 'true') {
      setDarkMode(true);
    } else if (darkModeStatus === 'false') {
      setDarkMode(false);
    } else {
      // Dark-first default for Yappers
      setDarkMode(true);
    }
  }, []);
}

export default useSetUserDarkModePreference;
