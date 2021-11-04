import SPLToken from '@solana/spl-token';
import { useWallet } from '@solana/wallet-adapter-react';

import { Shell } from 'components/layouts/Shell';

export const HomeView = () => {
  const wallet = useWallet();
  return <Shell title="Random Drop"></Shell>;
};
