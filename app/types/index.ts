export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: "Kitere" | "Rongo Town" | "Kisii";
  category: "Bedsitter" | "Single Room" | "One Bedroom";
  image: string;
}