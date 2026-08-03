const guestAccess = () => {
  const email = process.env.NEXT_PUBLIC_GUEST_EMAIL || '';
  const password = process.env.NEXT_PUBLIC_GUEST_PASSWORD || '';

  return { email, password };
};

export default guestAccess;
