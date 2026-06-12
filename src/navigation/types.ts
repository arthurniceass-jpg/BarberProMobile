export type HomeStackParamList = {
  HomeMain: undefined;
  BarbershopDetail: { shopId: string };
  Booking: { shopId: string; serviceId?: string };
};

export type ExploreStackParamList = {
  ExploreMain: undefined;
  BarbershopDetail: { shopId: string };
  Booking: { shopId: string; serviceId?: string };
};

export type RootTabParamList = {
  HomeTab: undefined;
  ExploreTab: undefined;
  ProfileTab: undefined;
};
