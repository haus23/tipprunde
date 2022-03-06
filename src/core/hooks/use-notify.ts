export const useNotify = () => {
  const notify = (promise: Promise<unknown>, msg: string) => {
    console.log('Speichern ...');
    promise
      .then(() => console.log(msg))
      .catch(() => console.log('Ups, da lief etwas schief!'));
    return promise;
  };
  return notify;
};
