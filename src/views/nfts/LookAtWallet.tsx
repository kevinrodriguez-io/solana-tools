import { SearchIcon } from '@heroicons/react/solid';
import { PublicKey } from '@solana/web3.js';
import { LabelledInput } from 'components/LabelledInput';
import { Shell } from 'components/layouts/Shell';
import { NFTCardList } from 'components/NFTCardList';
import { RoundButton } from 'components/RoundButton';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const LookAtWallet = () => {
  const { walletId } = useParams();
  const [customWalletInput, setCustomWalletInput] = useState(walletId);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const walletId = e.currentTarget.elements.namedItem(
      'walletIdentifier',
    ) as HTMLInputElement;
    navigate(`/nfts/lookup-form/${walletId.value}`);
  };
  return (
    <Shell title="NFTs">
      <div className="bg-white mt-4 shadow-2xl rounded-2xl">
        <div className="mx-auto py-4 px-4 overflow-auto">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Enter Wallet Id
          </h2>
          <form onSubmit={handleSubmit} method="post">
            <div className="flex flex-row items-end">
              <LabelledInput
                value={customWalletInput}
                onChange={(e) => setCustomWalletInput(e.target.value)}
                label="Wallet Identifier"
                minLength={32}
                maxLength={44}
                required
                placeHolder="DeirG7Kui7zw8srzShhrPv2TJgwAn61GU7m8xmaK9GnW"
                name="walletIdentifier"
                type="text"
              />
              <div className="ml-2">
                <RoundButton type="submit">
                  <SearchIcon className="h-5 w-5" aria-hidden="true" />
                </RoundButton>
              </div>
            </div>
          </form>
        </div>
      </div>
      {walletId ? <NFTCardList publicKey={new PublicKey(walletId)} /> : null}
    </Shell>
  );
};
