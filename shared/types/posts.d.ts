
export type Location = {
  lat: number;
  lng: number;
}

export interface Service {
  name: string;
  description: string;
  location: Location;
  datePosted: Date;
  postedBy: string;
  price: number;
  purchasedBy?: string
}

export interface SerializedService extends Service {
  datePosted: string; // when serialized, date is automatically converted to string
}

export interface Favor {
  name: string;
  description: string;
  location: Location;
  datePosted: Date;
  dateNeeded: Date;
  postedBy: string;
  acceptedBy?: string;
}

export interface SerializedFavor extends Favor {
  datePosted: string;
  dateNeeded: string;
}
