export interface Attribute {
  trait_type: string;
  value: string;
}

export interface File {
  uri: string;
  type: string;
}

export interface Creator {
  address: string;
  share: number;
}

export interface Properties {
  files: File[];
  category: string;
  creators: Creator[];
}

export interface TokenMetadataType {
  name: string;
  symbol: string;
  description: string;
  seller_fee_basis_points: number;
  image: string;
  animation_url: string;
  external_url: string;
  attributes: Attribute[];
  properties: Properties;
}
