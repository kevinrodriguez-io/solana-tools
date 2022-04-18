import { useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { HolderList } from './views/tokens/HolderList';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './lib/graphql/client';

const RPC_ENDPOINT = 'https://ssc-dao.genesysgo.net/';

export const App = () => {
  const network = WalletAdapterNetwork.Mainnet;
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new TorusWalletAdapter(),
    ],
    [network],
  );

  return (
    <ApolloProvider client={apolloClient}>
      <ConnectionProvider endpoint={RPC_ENDPOINT}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <Router>
              <Routes>
                <Route path="/" element={<HolderList />} />
                <Route
                  path="/candy-machine/holder-list"
                  element={<HolderList />}
                />
              </Routes>
            </Router>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ApolloProvider>
  );
};
