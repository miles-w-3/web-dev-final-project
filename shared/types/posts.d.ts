
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
  purchasedBy?: string;
  id?: string;
  // these fields aren't stored in the DB, they're filled in by the backend to approximate a join
  postedByName?: string;
  purchasedByName?: string;
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
  id?: string;
  // these fields aren't stored in the DB, they're filled in by the backend to approximate a join
  postedByName?: string;
  acceptedByName?: string;
}

export interface SerializedFavor extends Favor {
  datePosted: string;
  dateNeeded: string;
}

export interface Favorite {
  userId: string;
  postId: string;
}

export interface Posts {
  favors: SerializedFavor[];
  services: SerializedService[];
}

export interface FavoriteQueryResult {
  found: boolean;
}