export type Studio = {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  deposit: number;
  capacity: number;
  location: string;
  images: string[];
  amenities: string[];
  overview: string;
  ownerName: string;
  ownerEmail: string;
  ownerImage?: string;
  rating: number;
  reviewCount: number;
  availability?: { start: string; end: string }[];
  reviews?: {
    _id: string;
    userName: string;
    rating: number;
    comment: string;
  }[];
};
export type Booking = {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  location: string;
  start: string;
  end: string;
  total: number;
  hours: number;
  deposit: number;
  hourlyRate: number;
  userName: string;
  canComplete?: boolean;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
};
export const categories = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
];
export const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
