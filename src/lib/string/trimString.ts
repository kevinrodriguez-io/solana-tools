export const trimString = (str: string, maxLength: number) => {
  if (str.length <= maxLength) {
    return str;
  }
  const trimmedString =
    str.substr(0, maxLength / 2) +
    '...' +
    str.substr(str.length - maxLength / 2);
  return trimmedString;
};
