import React, { FC, useCallback, useMemo } from 'react';
import { Subscription, useSubscription } from 'use-subscription';
import { BehaviorSubject } from 'rxjs';

const defaultState = {
  loadedNFTS: false,
  loadedHolders: false,
  candyMachinePrimaryKey: "",
};

type State = typeof defaultState;

const RandropperContext = React.createContext(defaultState);

export const RandropperStateSubject = new BehaviorSubject(defaultState);

export const RandropperProvider: FC = ({ children }) => {
  const subscription = useMemo(
    () =>
      ({
        getCurrentValue: () => RandropperStateSubject.value,
        subscribe: (callback: VoidFunction) => {
          const subscription = RandropperStateSubject.subscribe(callback);
          return () => subscription.unsubscribe();
        },
      } as Subscription<State>),
    [],
  );
  const value = useSubscription(subscription);
  return (
    <RandropperContext.Provider value={value}>
      {children}
    </RandropperContext.Provider>
  );
};

export const useRandropper = (): [State, (value: State) => void] => {
  const currentValue = React.useContext(RandropperContext);
  if (currentValue === undefined) {
    throw new Error('useRandropper must be used within a RandropperProvider');
  }
  const setValue = useCallback(
    (value: State) => RandropperStateSubject.next(value),
    [],
  );
  return useMemo(() => [currentValue, setValue], [currentValue, setValue]);
};
