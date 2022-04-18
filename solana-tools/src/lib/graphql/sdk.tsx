import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** DateTime */
  DateTimeUtc: any;
  /** Lamports */
  Lamports: any;
  /** PublicKey */
  PublicKey: string;
  /** Volume */
  Volume: any;
};

/** Filter on NFT attributes */
export type AttributeFilter = {
  traitType: Scalars['String'];
  values: Array<Scalars['String']>;
};

export type AttributeGroup = {
  __typename?: 'AttributeGroup';
  name: Scalars['String'];
  variants: Array<AttributeVariant>;
};

export type AttributeVariant = {
  __typename?: 'AttributeVariant';
  count: Scalars['Int'];
  name: Scalars['String'];
};

export type AuctionHouse = {
  __typename?: 'AuctionHouse';
  address: Scalars['String'];
  auctionHouseFeeAccount: Scalars['String'];
  auctionHouseTreasury: Scalars['String'];
  authority: Scalars['String'];
  bump: Scalars['Int'];
  canChangeSalePrice: Scalars['Boolean'];
  creator: Scalars['String'];
  feePayerBump: Scalars['Int'];
  feeWithdrawalDestination: Scalars['String'];
  requiresSignOff: Scalars['Boolean'];
  sellerFeeBasisPoints: Scalars['Int'];
  stats?: Maybe<MintStats>;
  treasuryBump: Scalars['Int'];
  treasuryMint: Scalars['String'];
  treasuryWithdrawalDestination: Scalars['String'];
};

export type Bid = {
  __typename?: 'Bid';
  bidderAddress: Scalars['String'];
  cancelled: Scalars['Boolean'];
  lastBidAmount: Scalars['Lamports'];
  lastBidTime: Scalars['String'];
  listing?: Maybe<Listing>;
  listingAddress: Scalars['String'];
};

/** auction house bid receipt */
export type BidReceipt = {
  __typename?: 'BidReceipt';
  address: Scalars['String'];
  auctionHouse: Scalars['String'];
  buyer: Scalars['String'];
  canceledAt?: Maybe<Scalars['DateTimeUtc']>;
  createdAt: Scalars['DateTimeUtc'];
  metadata: Scalars['String'];
  price: Scalars['Lamports'];
  tokenAccount?: Maybe<Scalars['String']>;
  tradeState: Scalars['String'];
  tradeStateBump: Scalars['Int'];
};

export type ConnectionCounts = {
  __typename?: 'ConnectionCounts';
  fromCount: Scalars['Int'];
  toCount: Scalars['Int'];
};

export type Creator = {
  __typename?: 'Creator';
  address: Scalars['String'];
  attributeGroups: Array<AttributeGroup>;
  counts: CreatorCounts;
  profile?: Maybe<TwitterProfile>;
  stats: Array<MintStats>;
};


export type CreatorStatsArgs = {
  auctionHouses: Array<Scalars['PublicKey']>;
};

export type CreatorCounts = {
  __typename?: 'CreatorCounts';
  creations: Scalars['Int'];
};

export type Denylist = {
  __typename?: 'Denylist';
  listings: Array<Scalars['PublicKey']>;
  storefronts: Array<Scalars['PublicKey']>;
};

export type GraphConnection = {
  __typename?: 'GraphConnection';
  address: Scalars['String'];
  from: Wallet;
  to: Wallet;
};

export type Listing = {
  __typename?: 'Listing';
  address: Scalars['String'];
  bids: Array<Bid>;
  cacheAddress: Scalars['String'];
  ended: Scalars['Boolean'];
  endsAt?: Maybe<Scalars['DateTimeUtc']>;
  extAddress: Scalars['String'];
  nfts: Array<Nft>;
  storeAddress: Scalars['String'];
  storefront?: Maybe<Storefront>;
};

/** An NFT listing receipt */
export type ListingReceipt = {
  __typename?: 'ListingReceipt';
  address: Scalars['String'];
  auctionHouse: Scalars['String'];
  bookkeeper: Scalars['String'];
  bump: Scalars['Int'];
  canceledAt?: Maybe<Scalars['DateTimeUtc']>;
  createdAt: Scalars['DateTimeUtc'];
  metadata: Scalars['String'];
  price: Scalars['Lamports'];
  purchaseReceipt?: Maybe<Scalars['String']>;
  seller: Scalars['String'];
  tokenSize: Scalars['Int'];
  tradeState: Scalars['String'];
  tradeStateBump: Scalars['Int'];
};

export type MarketStats = {
  __typename?: 'MarketStats';
  nfts?: Maybe<Scalars['Volume']>;
};

export type Marketplace = {
  __typename?: 'Marketplace';
  auctionHouse?: Maybe<AuctionHouse>;
  auctionHouseAddress: Scalars['String'];
  bannerUrl: Scalars['String'];
  configAddress: Scalars['String'];
  creators: Array<StoreCreator>;
  description: Scalars['String'];
  logoUrl: Scalars['String'];
  name: Scalars['String'];
  ownerAddress: Scalars['String'];
  stats?: Maybe<MarketStats>;
  storeAddress?: Maybe<Scalars['String']>;
  subdomain: Scalars['String'];
};

export type MintStats = {
  __typename?: 'MintStats';
  auctionHouse: Scalars['String'];
  average?: Maybe<Scalars['Volume']>;
  floor?: Maybe<Scalars['Volume']>;
  mint: Scalars['String'];
  volume24hr?: Maybe<Scalars['Volume']>;
};

export type Nft = {
  __typename?: 'Nft';
  activities: Array<NftActivity>;
  address: Scalars['String'];
  attributes: Array<NftAttribute>;
  creators: Array<NftCreator>;
  description: Scalars['String'];
  image: Scalars['String'];
  listings: Array<ListingReceipt>;
  mintAddress: Scalars['String'];
  name: Scalars['String'];
  offers: Array<BidReceipt>;
  owner?: Maybe<NftOwner>;
  primarySaleHappened: Scalars['Boolean'];
  purchases: Array<PurchaseReceipt>;
  sellerFeeBasisPoints: Scalars['Int'];
};


export type NftImageArgs = {
  width?: InputMaybe<Scalars['Int']>;
};

export type NftActivity = {
  __typename?: 'NftActivity';
  activityType: Scalars['String'];
  address: Scalars['String'];
  auctionHouse: Scalars['String'];
  createdAt: Scalars['DateTimeUtc'];
  metadata: Scalars['String'];
  price: Scalars['Lamports'];
  wallets: Array<Scalars['String']>;
};

export type NftAttribute = {
  __typename?: 'NftAttribute';
  metadataAddress: Scalars['String'];
  traitType: Scalars['String'];
  value: Scalars['String'];
};

export type NftCount = {
  __typename?: 'NftCount';
  listed: Scalars['Int'];
  total: Scalars['Int'];
};


export type NftCountListedArgs = {
  auctionHouses?: InputMaybe<Array<Scalars['PublicKey']>>;
};

export type NftCreator = {
  __typename?: 'NftCreator';
  address: Scalars['String'];
  metadataAddress: Scalars['String'];
  position?: Maybe<Scalars['Int']>;
  profile?: Maybe<TwitterProfile>;
  share: Scalars['Int'];
  twitterHandle?: Maybe<Scalars['String']>;
  verified: Scalars['Boolean'];
};

export type NftOwner = {
  __typename?: 'NftOwner';
  address: Scalars['String'];
  associatedTokenAccountAddress: Scalars['String'];
  profile?: Maybe<TwitterProfile>;
  twitterHandle?: Maybe<Scalars['String']>;
};

export type Profile = {
  __typename?: 'Profile';
  bannerImageUrl: Scalars['String'];
  handle: Scalars['String'];
  profileImageUrlHighres: Scalars['String'];
  profileImageUrlLowres: Scalars['String'];
  walletAddress?: Maybe<Scalars['String']>;
};

/** auction house bid receipt */
export type PurchaseReceipt = {
  __typename?: 'PurchaseReceipt';
  address: Scalars['String'];
  auctionHouse: Scalars['String'];
  buyer: Scalars['String'];
  createdAt: Scalars['DateTimeUtc'];
  price: Scalars['Lamports'];
  seller: Scalars['String'];
};

export type QueryRoot = {
  __typename?: 'QueryRoot';
  connections: Array<GraphConnection>;
  creator: Creator;
  denylist: Denylist;
  listings: Array<Listing>;
  /** A marketplace */
  marketplace?: Maybe<Marketplace>;
  nft?: Maybe<Nft>;
  nftCounts: NftCount;
  nfts: Array<Nft>;
  profile?: Maybe<Profile>;
  /** A storefront */
  storefront?: Maybe<Storefront>;
  storefronts: Array<Storefront>;
  wallet: Wallet;
};


export type QueryRootConnectionsArgs = {
  from?: InputMaybe<Array<Scalars['PublicKey']>>;
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  to?: InputMaybe<Array<Scalars['PublicKey']>>;
};


export type QueryRootCreatorArgs = {
  address: Scalars['String'];
};


export type QueryRootMarketplaceArgs = {
  subdomain: Scalars['String'];
};


export type QueryRootNftArgs = {
  address: Scalars['String'];
};


export type QueryRootNftCountsArgs = {
  creators: Array<Scalars['PublicKey']>;
};


export type QueryRootNftsArgs = {
  attributes?: InputMaybe<Array<AttributeFilter>>;
  creators?: InputMaybe<Array<Scalars['PublicKey']>>;
  limit: Scalars['Int'];
  listed?: InputMaybe<Array<Scalars['PublicKey']>>;
  offerers?: InputMaybe<Array<Scalars['PublicKey']>>;
  offset: Scalars['Int'];
  owners?: InputMaybe<Array<Scalars['PublicKey']>>;
};


export type QueryRootProfileArgs = {
  handle: Scalars['String'];
};


export type QueryRootStorefrontArgs = {
  subdomain: Scalars['String'];
};


export type QueryRootWalletArgs = {
  address: Scalars['PublicKey'];
};

export type StoreCreator = {
  __typename?: 'StoreCreator';
  creatorAddress: Scalars['String'];
  preview: Array<Nft>;
  storeConfigAddress: Scalars['String'];
};

/** A Metaplex storefront */
export type Storefront = {
  __typename?: 'Storefront';
  address: Scalars['String'];
  bannerUrl: Scalars['String'];
  description: Scalars['String'];
  faviconUrl: Scalars['String'];
  logoUrl: Scalars['String'];
  ownerAddress: Scalars['String'];
  subdomain: Scalars['String'];
  title: Scalars['String'];
};

export type TwitterProfile = {
  __typename?: 'TwitterProfile';
  bannerImageUrl: Scalars['String'];
  description: Scalars['String'];
  handle: Scalars['String'];
  profileImageUrl: Scalars['String'];
};

export type Wallet = {
  __typename?: 'Wallet';
  address: Scalars['PublicKey'];
  bids: Array<Bid>;
  connectionCounts: ConnectionCounts;
  nftCounts: WalletNftCount;
  profile?: Maybe<TwitterProfile>;
};


export type WalletNftCountsArgs = {
  creators?: InputMaybe<Array<Scalars['PublicKey']>>;
};

export type WalletNftCount = {
  __typename?: 'WalletNftCount';
  listed: Scalars['Int'];
  offered: Scalars['Int'];
  owned: Scalars['Int'];
};


export type WalletNftCountListedArgs = {
  auctionHouses?: InputMaybe<Array<Scalars['PublicKey']>>;
};


export type WalletNftCountOfferedArgs = {
  auctionHouses?: InputMaybe<Array<Scalars['PublicKey']>>;
};

export type GetHolderSnapshotQueryVariables = Exact<{
  creator: Scalars['PublicKey'];
}>;


export type GetHolderSnapshotQuery = { __typename?: 'QueryRoot', nfts: Array<{ __typename?: 'Nft', name: string, description: string, metadata_account: string, mint_account: string, owner?: { __typename?: 'NftOwner', twitterHandle?: string | null, address: string } | null }> };


export const GetHolderSnapshotDocument = gql`
    query getHolderSnapshot($creator: PublicKey!) {
  nfts(creators: [$creator], limit: 15000, offset: 0) {
    metadata_account: address
    mint_account: mintAddress
    name
    description
    owner {
      twitterHandle
      address
    }
  }
}
    `;

/**
 * __useGetHolderSnapshotQuery__
 *
 * To run a query within a React component, call `useGetHolderSnapshotQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetHolderSnapshotQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetHolderSnapshotQuery({
 *   variables: {
 *      creator: // value for 'creator'
 *   },
 * });
 */
export function useGetHolderSnapshotQuery(baseOptions: Apollo.QueryHookOptions<GetHolderSnapshotQuery, GetHolderSnapshotQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetHolderSnapshotQuery, GetHolderSnapshotQueryVariables>(GetHolderSnapshotDocument, options);
      }
export function useGetHolderSnapshotLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetHolderSnapshotQuery, GetHolderSnapshotQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetHolderSnapshotQuery, GetHolderSnapshotQueryVariables>(GetHolderSnapshotDocument, options);
        }
export type GetHolderSnapshotQueryHookResult = ReturnType<typeof useGetHolderSnapshotQuery>;
export type GetHolderSnapshotLazyQueryHookResult = ReturnType<typeof useGetHolderSnapshotLazyQuery>;
export type GetHolderSnapshotQueryResult = Apollo.QueryResult<GetHolderSnapshotQuery, GetHolderSnapshotQueryVariables>;