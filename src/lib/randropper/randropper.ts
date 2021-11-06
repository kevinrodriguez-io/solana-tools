export const cryptoRand = () => {
  const array = new Uint8Array(4);
  window.crypto.getRandomValues(array);
  const dataView = new DataView(array.buffer);
  const uint = dataView.getUint32(0);
  const value = uint / (0xffffffff + 1); // 0xFFFFFFFF = uint32.MaxValue (+1 because Math.random is inclusive of 0, but not 1)
  return value;
};

export const randomIntFromInterval = (min: number, max: number) =>
  Math.floor(cryptoRand() * (max - min + 1) + min);

export const zip = <T, E>(arrays: [Array<T>, Array<E>]) =>
  arrays[0].map((_, i) => arrays.map((x) => x[i]));

export const shuffle = <T>(array: T[]) => {
  const shuffled = array.slice(0);
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(cryptoRand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
