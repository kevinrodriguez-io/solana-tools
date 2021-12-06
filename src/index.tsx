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
import { HolderList } from 'views/candy-machine/HolderList';
import { ListNFTs } from 'views/list-nfts';
import { MintList } from 'views/candy-machine/MintList';

const RPC_ENDPOINT = 'https://cmnftdrop7299eedc071c.genesysgo.net/';
// const RPC_ENDPOINT = 'https://rpc-mainnet-oiwy5uyn6a-ue.a.run.app';

const App = () => {
  const network = WalletAdapterNetwork.Mainnet;

  // const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      getPhantomWallet(),
      getSolflareWallet(),
      getLedgerWallet(),
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
              <Route
                path="/candy-machine/holder-list"
                element={<HolderList />}
              />
              <Route path="/candy-machine/mints" element={<MintList />} />
              <Route path="/nfts" element={<ListNFTs />} />
            </Routes>
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
