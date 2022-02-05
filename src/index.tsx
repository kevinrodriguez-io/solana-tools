import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HomeView } from 'views/home';

import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  getLedgerWallet,
  getPhantomWallet,
  getSlopeWallet,
  getSolflareWallet,
  getSolletExtensionWallet,
  getSolletWallet,
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
// import { clusterApiUrl } from '@solana/web3.js';

import '@solana/wallet-adapter-react-ui/styles.css';
import './index.css';
import { useMemo } from 'react';
import { GrindKey } from 'views/grindKey';

const RPC_ENDPOINT = 'https://ssc-dao.genesysgo.net/';

const App = () => {
  const network = WalletAdapterNetwork.Mainnet;
  const wallets = useMemo(
    () => [
      getPhantomWallet(),
      getSolflareWallet(),
      getLedgerWallet(),
      getSlopeWallet(),
      getSolletWallet({ network }),
      getSolletExtensionWallet({ network }),
    ],
    [network],
  );
  return (
    <ConnectionProvider endpoint={RPC_ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/grind-key" element={<GrindKey />} />
            </Routes>
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
