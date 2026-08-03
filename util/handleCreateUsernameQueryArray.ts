function handleCreateUsernameQueryArray(username: string) {
  const normalized = username.toLowerCase();
  const usernameArray = normalized.split('');
  const usernameQueryArray = [''];

  usernameArray.forEach((character: string, index: number) => {
    const mergerExtract = usernameQueryArray[index];
    const mergerResult = mergerExtract.concat(character);

    usernameQueryArray.push(mergerResult);
  });
  usernameQueryArray.shift();

  return usernameQueryArray;
}

export default handleCreateUsernameQueryArray;
