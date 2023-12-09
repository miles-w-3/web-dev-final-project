
export type Location = {
  lat: number;
  lng: number;
}

export type PostType = 'service' | 'favor';

export interface Post {
  name: string;
  description: string;
  location?: google.maps.LatLngLiteral;
  datePosted: Date;
  dateNeeded: Date;
  postedBy: string;
  acceptedBy: string
}