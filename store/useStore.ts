import { create } from 'zustand';
import * as Crypto from 'expo-crypto';
import type { Property, Chat, Message, Tour, Offer, SavedProperty, SearchFilters } from '@/types';

// Mock property data with real images
const mockProperties: Property[] = [
  {
    id: Crypto.randomUUID(),
    sellerId: 'seller-1',
    sellerName: 'Sarah Mitchell',
    sellerAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    sellerVerified: true,
    title: 'Stunning Modern Villa with Pool',
    description: 'Experience luxury living in this beautifully designed modern villa. Featuring an open floor plan, gourmet kitchen with top-of-the-line appliances, and floor-to-ceiling windows that flood the space with natural light. The backyard oasis includes a heated pool, outdoor kitchen, and manicured gardens.',
    price: 1250000,
    address: '1847 Sunset Boulevard',
    city: 'Beverly Hills',
    state: 'CA',
    zipCode: '90210',
    lat: 34.0736,
    lng: -118.4004,
    bedrooms: 5,
    bathrooms: 4,
    sqft: 4200,
    lotSize: 0.45,
    yearBuilt: 2021,
    propertyType: 'house',
    amenities: ['Pool', 'Smart Home', 'Wine Cellar', 'Home Theater', 'Gym', 'Solar Panels', 'EV Charger'],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800',
    ],
    status: 'listed',
    views: 1247,
    favorites: 89,
    daysOnMarket: 12,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: Crypto.randomUUID(),
    sellerId: 'seller-2',
    sellerName: 'Michael Chen',
    sellerAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    sellerVerified: true,
    title: 'Luxury Penthouse with City Views',
    description: 'Breathtaking penthouse offering panoramic city skyline views from every room. This sophisticated residence features a private rooftop terrace, chef\'s kitchen, marble bathrooms, and smart home technology throughout. Building amenities include 24-hour concierge, fitness center, and rooftop pool.',
    price: 2800000,
    address: '500 Park Avenue',
    city: 'New York',
    state: 'NY',
    zipCode: '10022',
    lat: 40.7614,
    lng: -73.9776,
    bedrooms: 4,
    bathrooms: 3.5,
    sqft: 3800,
    lotSize: 0,
    yearBuilt: 2019,
    propertyType: 'condo',
    amenities: ['Doorman', 'Rooftop Terrace', 'Concierge', 'Fitness Center', 'Private Elevator', 'Wine Storage'],
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    ],
    status: 'listed',
    views: 2341,
    favorites: 156,
    daysOnMarket: 8,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-22'),
  },
  {
    id: Crypto.randomUUID(),
    sellerId: 'seller-3',
    sellerName: 'Emily Rodriguez',
    sellerAvatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    sellerVerified: false,
    title: 'Charming Craftsman Bungalow',
    description: 'Beautifully restored Craftsman bungalow blending period details with modern updates. Original hardwood floors, built-in cabinetry, and a cozy fireplace create warm ambiance. Updated kitchen and bathrooms, detached garage with studio potential.',
    price: 685000,
    address: '742 Oak Street',
    city: 'Portland',
    state: 'OR',
    zipCode: '97214',
    lat: 45.5152,
    lng: -122.6784,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1850,
    lotSize: 0.18,
    yearBuilt: 1924,
    propertyType: 'house',
    amenities: ['Hardwood Floors', 'Fireplace', 'Garden', 'Garage', 'Updated Kitchen', 'Front Porch'],
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    ],
    status: 'listed',
    views: 456,
    favorites: 34,
    daysOnMarket: 21,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: Crypto.randomUUID(),
    sellerId: 'seller-4',
    sellerName: 'James Wilson',
    sellerAvatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    sellerVerified: true,
    title: 'Contemporary Waterfront Estate',
    description: 'Exceptional waterfront living with 180-degree lake views. This architectural masterpiece features walls of glass, floating staircase, infinity pool, and private dock. Designed for indoor-outdoor living with multiple terraces and outdoor entertainment areas.',
    price: 4500000,
    address: '2100 Lakeshore Drive',
    city: 'Austin',
    state: 'TX',
    zipCode: '78746',
    lat: 30.2672,
    lng: -97.7431,
    bedrooms: 6,
    bathrooms: 5.5,
    sqft: 6500,
    lotSize: 1.2,
    yearBuilt: 2022,
    propertyType: 'house',
    amenities: ['Waterfront', 'Infinity Pool', 'Boat Dock', 'Wine Room', 'Home Office', 'Guest House', 'Smart Home'],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    ],
    status: 'listed',
    views: 3456,
    favorites: 245,
    daysOnMarket: 5,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-22'),
  },
  {
    id: Crypto.randomUUID(),
    sellerId: 'seller-5',
    sellerName: 'Amanda Foster',
    sellerAvatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    sellerVerified: true,
    title: 'Urban Loft in Arts District',
    description: 'Industrial-chic loft in the heart of the Arts District. Soaring 16-foot ceilings, exposed brick, original timber beams, and polished concrete floors. Open concept living with custom kitchen island and oversized windows overlooking the vibrant neighborhood.',
    price: 525000,
    address: '333 Industrial Way',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90013',
    lat: 34.0407,
    lng: -118.2468,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1650,
    lotSize: 0,
    yearBuilt: 1928,
    propertyType: 'apartment',
    amenities: ['Exposed Brick', 'High Ceilings', 'Rooftop Access', 'Pet Friendly', 'In-Unit Laundry', 'Parking'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    ],
    status: 'listed',
    views: 892,
    favorites: 67,
    daysOnMarket: 14,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-18'),
  },
];

const mockChats: Chat[] = [
  {
    id: Crypto.randomUUID(),
    participantIds: ['user-1', 'seller-1'],
    participants: [
      { id: 'seller-1', name: 'Sarah Mitchell', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    ],
    propertyId: mockProperties[0].id,
    propertyTitle: 'Stunning Modern Villa with Pool',
    propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
    lastMessage: 'I\'d love to schedule a tour this weekend if possible!',
    lastMessageTime: new Date('2024-01-22T14:30:00'),
    unreadCount: 2,
  },
  {
    id: Crypto.randomUUID(),
    participantIds: ['user-1', 'seller-2'],
    participants: [
      { id: 'seller-2', name: 'Michael Chen', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
    ],
    propertyId: mockProperties[1].id,
    propertyTitle: 'Luxury Penthouse with City Views',
    propertyImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
    lastMessage: 'Thank you for your interest! The property is still available.',
    lastMessageTime: new Date('2024-01-21T10:15:00'),
    unreadCount: 0,
  },
  {
    id: Crypto.randomUUID(),
    participantIds: ['user-1', 'seller-3'],
    participants: [
      { id: 'seller-3', name: 'Emily Rodriguez', avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
    ],
    propertyId: mockProperties[2].id,
    propertyTitle: 'Charming Craftsman Bungalow',
    propertyImage: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
    lastMessage: 'The inspection report is now available. Let me know if you have questions.',
    lastMessageTime: new Date('2024-01-20T16:45:00'),
    unreadCount: 1,
  },
];

const mockMessages: Message[] = [
  {
    id: Crypto.randomUUID(),
    chatId: mockChats[0].id,
    senderId: 'user-1',
    text: 'Hi! I\'m very interested in this property. Is it still available?',
    images: [],
    timestamp: new Date('2024-01-22T10:00:00'),
    read: true,
  },
  {
    id: Crypto.randomUUID(),
    chatId: mockChats[0].id,
    senderId: 'seller-1',
    text: 'Hello! Yes, the property is still available. Would you like to schedule a viewing?',
    images: [],
    timestamp: new Date('2024-01-22T10:30:00'),
    read: true,
  },
  {
    id: Crypto.randomUUID(),
    chatId: mockChats[0].id,
    senderId: 'user-1',
    text: 'That would be great! I\'d love to schedule a tour this weekend if possible!',
    images: [],
    timestamp: new Date('2024-01-22T14:30:00'),
    read: false,
  },
];

const mockTours: Tour[] = [
  {
    id: Crypto.randomUUID(),
    propertyId: mockProperties[0].id,
    propertyTitle: 'Stunning Modern Villa with Pool',
    propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
    propertyAddress: '1847 Sunset Boulevard, Beverly Hills, CA',
    buyerId: 'user-1',
    buyerName: 'John Doe',
    buyerAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    sellerId: 'seller-1',
    scheduledTime: new Date('2024-01-27T14:00:00'),
    duration: 60,
    status: 'confirmed',
    notes: 'Please arrive 5 minutes early. Gate code: 1234',
    createdAt: new Date('2024-01-22T15:00:00'),
  },
];

const mockOffers: Offer[] = [
  {
    id: Crypto.randomUUID(),
    propertyId: mockProperties[2].id,
    propertyTitle: 'Charming Craftsman Bungalow',
    propertyImage: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
    buyerId: 'user-1',
    buyerName: 'John Doe',
    buyerAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    sellerId: 'seller-3',
    offerPrice: 665000,
    listPrice: 685000,
    earnestMoney: 15000,
    contingencies: ['Inspection', 'Financing', 'Appraisal'],
    expiresAt: new Date('2024-01-30T23:59:59'),
    status: 'pending',
    createdAt: new Date('2024-01-21T09:00:00'),
  },
];

interface StoreState {
  // Properties
  properties: Property[];
  featuredProperties: Property[];
  searchResults: Property[];
  selectedProperty: Property | null;
  
  // Chats
  chats: Chat[];
  messages: Message[];
  
  // Tours
  tours: Tour[];
  
  // Offers
  offers: Offer[];
  
  // Favorites
  savedProperties: SavedProperty[];
  
  // Search
  searchFilters: SearchFilters;
  isSearching: boolean;
  
  // Loading states
  isLoading: boolean;
  
  // Actions
  fetchProperties: () => Promise<void>;
  searchProperties: (filters: Partial<SearchFilters>) => Promise<void>;
  getPropertyById: (id: string) => Property | undefined;
  
  fetchChats: () => Promise<void>;
  sendMessage: (chatId: string, text: string) => Promise<void>;
  getMessagesForChat: (chatId: string) => Message[];
  
  scheduleTour: (propertyId: string, date: Date, notes?: string) => Promise<void>;
  updateTourStatus: (tourId: string, status: Tour['status']) => Promise<void>;
  
  createOffer: (propertyId: string, offerPrice: number, earnestMoney: number, contingencies: string[]) => Promise<void>;
  respondToOffer: (offerId: string, action: 'accept' | 'reject' | 'counter', counterPrice?: number) => Promise<void>;
  
  toggleFavorite: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;
  
  setSearchFilters: (filters: Partial<SearchFilters>) => void;
  clearSearchFilters: () => void;
}

const defaultFilters: SearchFilters = {
  query: '',
  minPrice: 0,
  maxPrice: 10000000,
  minBeds: 0,
  maxBeds: 10,
  minBaths: 0,
  maxBaths: 10,
  propertyTypes: [],
  amenities: [],
  minSqft: 0,
  maxSqft: 20000,
  sortBy: 'newest',
};

export const useStore = create<StoreState>((set, get) => ({
  properties: [],
  featuredProperties: [],
  searchResults: [],
  selectedProperty: null,
  chats: [],
  messages: [],
  tours: [],
  offers: [],
  savedProperties: [],
  searchFilters: defaultFilters,
  isSearching: false,
  isLoading: false,

  fetchProperties: async () => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const featured = mockProperties.slice(0, 3);
      set({ 
        properties: mockProperties, 
        featuredProperties: featured,
        searchResults: mockProperties,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  searchProperties: async (filters: Partial<SearchFilters>) => {
    set({ isSearching: true });
    const currentFilters = { ...get().searchFilters, ...filters };
    set({ searchFilters: currentFilters });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let results = [...mockProperties];
      
      if (currentFilters.query) {
        const query = currentFilters.query.toLowerCase();
        results = results.filter(p => 
          p.title.toLowerCase().includes(query) ||
          p.address.toLowerCase().includes(query) ||
          p.city.toLowerCase().includes(query)
        );
      }
      
      results = results.filter(p => 
        p.price >= currentFilters.minPrice &&
        p.price <= currentFilters.maxPrice &&
        p.bedrooms >= currentFilters.minBeds &&
        p.bedrooms <= currentFilters.maxBeds &&
        p.bathrooms >= currentFilters.minBaths &&
        p.bathrooms <= currentFilters.maxBaths &&
        p.sqft >= currentFilters.minSqft &&
        p.sqft <= currentFilters.maxSqft
      );
      
      if (currentFilters.propertyTypes.length > 0) {
        results = results.filter(p => currentFilters.propertyTypes.includes(p.propertyType));
      }
      
      switch (currentFilters.sortBy) {
        case 'price-asc':
          results.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          results.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          break;
        case 'beds':
          results.sort((a, b) => b.bedrooms - a.bedrooms);
          break;
        case 'sqft':
          results.sort((a, b) => b.sqft - a.sqft);
          break;
      }
      
      set({ searchResults: results, isSearching: false });
    } catch (error) {
      set({ isSearching: false });
    }
  },

  getPropertyById: (id: string) => {
    return get().properties.find(p => p.id === id);
  },

  fetchChats: async () => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ chats: mockChats, messages: mockMessages, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  sendMessage: async (chatId: string, text: string) => {
    try {
      const newMessage: Message = {
        id: Crypto.randomUUID(),
        chatId,
        senderId: 'user-1',
        text,
        images: [],
        timestamp: new Date(),
        read: false,
      };
      
      set(state => ({
        messages: [...state.messages, newMessage],
        chats: state.chats.map(chat => 
          chat.id === chatId
            ? { ...chat, lastMessage: text, lastMessageTime: new Date(), unreadCount: 0 }
            : chat
        ),
      }));
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  },

  getMessagesForChat: (chatId: string) => {
    return get().messages.filter(m => m.chatId === chatId);
  },

  scheduleTour: async (propertyId: string, date: Date, notes?: string) => {
    try {
      const property = get().getPropertyById(propertyId);
      if (!property) return;
      
      const newTour: Tour = {
        id: Crypto.randomUUID(),
        propertyId,
        propertyTitle: property.title,
        propertyImage: property.images[0],
        propertyAddress: `${property.address}, ${property.city}, ${property.state}`,
        buyerId: 'user-1',
        buyerName: 'John Doe',
        buyerAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        sellerId: property.sellerId,
        scheduledTime: date,
        duration: 60,
        status: 'pending',
        notes: notes || '',
        createdAt: new Date(),
      };
      
      set(state => ({ tours: [...state.tours, newTour] }));
    } catch (error) {
      console.error('Failed to schedule tour:', error);
    }
  },

  updateTourStatus: async (tourId: string, status: Tour['status']) => {
    set(state => ({
      tours: state.tours.map(tour =>
        tour.id === tourId ? { ...tour, status } : tour
      ),
    }));
  },

  createOffer: async (propertyId: string, offerPrice: number, earnestMoney: number, contingencies: string[]) => {
    try {
      const property = get().getPropertyById(propertyId);
      if (!property) return;
      
      const newOffer: Offer = {
        id: Crypto.randomUUID(),
        propertyId,
        propertyTitle: property.title,
        propertyImage: property.images[0],
        buyerId: 'user-1',
        buyerName: 'John Doe',
        buyerAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        sellerId: property.sellerId,
        offerPrice,
        listPrice: property.price,
        earnestMoney,
        contingencies,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'pending',
        createdAt: new Date(),
      };
      
      set(state => ({ offers: [...state.offers, newOffer] }));
    } catch (error) {
      console.error('Failed to create offer:', error);
    }
  },

  respondToOffer: async (offerId: string, action: 'accept' | 'reject' | 'counter', counterPrice?: number) => {
    set(state => ({
      offers: state.offers.map(offer => {
        if (offer.id !== offerId) return offer;
        
        switch (action) {
          case 'accept':
            return { ...offer, status: 'accepted' as const };
          case 'reject':
            return { ...offer, status: 'rejected' as const };
          case 'counter':
            return { ...offer, status: 'countered' as const, counterOffer: counterPrice };
          default:
            return offer;
        }
      }),
    }));
  },

  toggleFavorite: (propertyId: string) => {
    const { savedProperties } = get();
    const existingIndex = savedProperties.findIndex(sp => sp.propertyId === propertyId);
    
    if (existingIndex >= 0) {
      set({
        savedProperties: savedProperties.filter((_, i) => i !== existingIndex),
      });
    } else {
      const newSaved: SavedProperty = {
        id: Crypto.randomUUID(),
        buyerId: 'user-1',
        propertyId,
        savedAt: new Date(),
      };
      set({ savedProperties: [...savedProperties, newSaved] });
    }
  },

  isFavorite: (propertyId: string) => {
    return get().savedProperties.some(sp => sp.propertyId === propertyId);
  },

  setSearchFilters: (filters: Partial<SearchFilters>) => {
    set(state => ({ searchFilters: { ...state.searchFilters, ...filters } }));
  },

  clearSearchFilters: () => {
    set({ searchFilters: defaultFilters });
  },
}));