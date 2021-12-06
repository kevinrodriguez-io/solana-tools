import { useState } from 'react';

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(
        key,
        JSON.stringify(
          typeof value === 'function' ? (value as any)(storedValue) : value,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };
  return [storedValue, setValue] as const;
};
