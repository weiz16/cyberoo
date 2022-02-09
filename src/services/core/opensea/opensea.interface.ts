export type OpenSeaAssets = {
  assets: { image_url: string }[];
}

export type OpenSeaEvent = {
  asset_events: {
    approved_account: string;
    permalink: string;
    event_type: string;
    asset: {
      image_url: string;
    },
    from_account: {
      address: string;
    },
    to_account: {
      address: string;
    },
    total_price: string;
  }[]
};