export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  avatar: string;
  role: 'buyer' | 'seller' | 'both';
  verified: boolean;
  rating: number;
  reviewCount: number;
  bio: string;
  createdAt: Date;
}

export interface Property {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerVerified: boolean;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  lat: number;
  lng: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lotSize: number;
  yearBuilt: number;
  propertyType: 'house' | 'apartment' | 'condo' | 'townhouse' | 'land';
  amenities: string[];
  images: string[];
  videoUrl?: string;
  tourUrl?: string;
  status: 'listed' | 'pending' | 'sold' | 'off-market';
  views: number;
  favorites: number;
  daysOnMarket: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Listing {
  id: string;
  propertyId: string;
  sellerId: string;
  status: 'active' | 'inactive' | 'sold';
  price: number;
  daysOnMarket: number;
  inquiries: number;
  favorites: number;
}

export interface Inquiry {
  id: string;
  buyerId: string;
  propertyId: string;
  sellerId: string;
  message: string;
  preQualified: boolean;
  status: 'pending' | 'viewed' | 'contacted';
  createdAt: Date;
}

export interface Chat {
  id: string;
  participantIds: string[];
  participants: {
    id: string;
    name: string;
    avatar: string;
  }[];
  propertyId?: string;
  propertyTitle?: string;
  propertyImage?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  images: string[];
  timestamp: Date;
  read: boolean;
}

export interface Tour {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  propertyAddress: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  sellerId: string;
  scheduledTime: Date;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes: string;
  createdAt: Date;
}

export interface Offer {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  sellerId: string;
  offerPrice: number;
  listPrice: number;
  earnestMoney: number;
  contingencies: string[];
  expiresAt: Date;
  status: 'pending' | 'accepted' | 'rejected' | 'countered' | 'expired';
  counterOffer?: number;
  createdAt: Date;
}

export interface SavedProperty {
  id: string;
  buyerId: string;
  propertyId: string;
  savedAt: Date;
}

export interface Review {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  toUserId: string;
  rating: number;
  text: string;
  transactionId?: string;
  createdAt: Date;
}

export interface SearchFilters {
  query: string;
  minPrice: number;
  maxPrice: number;
  minBeds: number;
  maxBeds: number;
  minBaths: number;
  maxBaths: number;
  propertyTypes: string[];
  amenities: string[];
  minSqft: number;
  maxSqft: number;
  sortBy: 'price-asc' | 'price-desc' | 'newest' | 'beds' | 'sqft';
}

export interface Notification {
  id: string;
  userId: string;
  type: 'price-drop' | 'new-listing' | 'tour-reminder' | 'offer-update' | 'message';
  title: string;
  body: string;
  data: Record<string, any>;
  read: boolean;
  createdAt: Date;
}