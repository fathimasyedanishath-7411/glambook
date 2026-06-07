import { db } from '../config/firebase';
import { collection, getDocs, setDoc, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'artist' | 'admin';
  profileImage: string;
  createdAt: string;
  blocked?: boolean;
}

export interface Artist {
  artistId: string;
  category: 'makeup' | 'mehendi' | 'hairsalon' | 'photography' | 'beautician';
  city: string;
  experience: number;
  pricing: number;
  rating: number;
  availability: string[];
  verified: boolean;
  bio?: string;
  portfolio: string[];
}

export interface Service {
  serviceId: string;
  artistId: string;
  serviceName: string;
  price: number;
}

export interface Booking {
  bookingId: string;
  customerId: string;
  artistId: string;
  serviceId: string;
  serviceName: string;
  bookingDate: string;
  bookingTime: string;
  bookingStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalAmount: number;
  notes?: string;
}

export interface Review {
  reviewId: string;
  artistId: string;
  customerId: string;
  customerName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface Payment {
  paymentId: string;
  bookingId: string;
  customerId: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'refunded';
}

export interface Notification {
  notificationId: string;
  userId: string;
  title: string;
  message: string;
  readStatus: boolean;
  createdAt: string;
}

class MockDB {
  users: User[] = [
    {
      id: 'cust-1',
      name: 'Elena Gilbert',
      email: 'elena@example.com',
      role: 'customer',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      createdAt: '2026-05-10T12:00:00Z',
      blocked: false
    },
    {
      id: 'artist-1',
      name: 'Samira Khan',
      email: 'samira@example.com',
      role: 'artist',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      createdAt: '2026-05-11T12:00:00Z',
      blocked: false
    },
    {
      id: 'artist-2',
      name: 'Anika Sharma',
      email: 'anika@example.com',
      role: 'artist',
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      createdAt: '2026-05-12T12:00:00Z',
      blocked: false
    },
    {
      id: 'artist-3',
      name: 'Zoe Sterling',
      email: 'zoe@example.com',
      role: 'artist',
      profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      createdAt: '2026-05-13T12:00:00Z',
      blocked: false
    },
    {
      id: 'admin-1',
      name: 'GlamBook Admin',
      email: 'admin@glambook.com',
      role: 'admin',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      createdAt: '2026-05-01T12:00:00Z',
      blocked: false
    }
  ];

  artists: Artist[] = [
    {
      artistId: 'artist-1',
      category: 'makeup',
      city: 'San Francisco',
      experience: 6,
      pricing: 150,
      rating: 4.8,
      availability: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
      verified: true,
      bio: 'Professional makeup artist specializing in bridal, glamorous evening makeups, and high-fashion runways. 6+ years working with top models.',
      portfolio: [
        '/src/assets/images/bridal_makeup_1779375755644.png',
        '/src/assets/images/makeup_palette_1779375794421.png',
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400'
      ]
    },
    {
      artistId: 'artist-2',
      category: 'hairsalon',
      city: 'Los Angeles',
      experience: 8,
      pricing: 120,
      rating: 4.9,
      availability: ['Tuesday', 'Thursday', 'Saturday', 'Sunday'],
      verified: true,
      bio: 'Master hairstylist for weddings, red carpets and special events. Specializes in elegant updos, retro curls, and dramatic hair designs.',
      portfolio: [
        'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400',
        'https://images.unsplash.com/photo-1595475243690-aa1958d45f31?w=400'
      ]
    },
    {
      artistId: 'artist-3',
      category: 'mehendi',
      city: 'San Francisco',
      experience: 5,
      pricing: 95,
      rating: 4.7,
      availability: ['Friday', 'Saturday', 'Sunday'],
      verified: false,
      bio: 'Exquisite modern and traditional Mehendi / Henna artist with custom bridal detailing, geometric patterns, and rich dark organic stains.',
      portfolio: [
        '/src/assets/images/mehndi_henna_1779375777116.png'
      ]
    }
  ];

  services: Service[] = [
    { serviceId: 'srv-1', artistId: 'artist-1', serviceName: 'Bridal HD Makeup', price: 250 },
    { serviceId: 'srv-2', artistId: 'artist-1', serviceName: 'Party Makeup with Lashes', price: 150 },
    { serviceId: 'srv-3', artistId: 'artist-2', serviceName: 'Glamorous Bridal Hair Styling', price: 180 },
    { serviceId: 'srv-4', artistId: 'artist-2', serviceName: 'Blowout & Express Curling', price: 90 },
    { serviceId: 'srv-5', artistId: 'artist-3', serviceName: 'Full Bridal Henna Hand & Feet', price: 200 },
    { serviceId: 'srv-6', artistId: 'artist-3', serviceName: 'Standard Event Henna', price: 95 }
  ];

  bookings: Booking[] = [
    {
      bookingId: 'book-1',
      customerId: 'cust-1',
      artistId: 'artist-1',
      serviceId: 'srv-2',
      serviceName: 'Party Makeup with Lashes',
      bookingDate: '2026-05-28',
      bookingTime: '02:00 PM',
      bookingStatus: 'confirmed',
      totalAmount: 150,
      notes: 'Please keep the makeup natural yet radiant.'
    },
    {
      bookingId: 'book-2',
      customerId: 'cust-1',
      artistId: 'artist-2',
      serviceId: 'srv-4',
      serviceName: 'Blowout & Express Curling',
      bookingDate: '2026-05-20',
      bookingTime: '11:00 AM',
      bookingStatus: 'completed',
      totalAmount: 90,
      notes: ''
    }
  ];

  reviews: Review[] = [
    {
      reviewId: 'rev-1',
      artistId: 'artist-1',
      customerId: 'cust-1',
      customerName: 'Elena Gilbert',
      rating: 5,
      comment: 'Samira made my party night! The makeup stood intact the whole night and received tons of compliments!',
      createdAt: '2026-05-19T14:00:00Z'
    },
    {
      reviewId: 'rev-2',
      artistId: 'artist-2',
      customerId: 'cust-1',
      customerName: 'Elena Gilbert',
      rating: 5,
      comment: 'Absolutely love Zoe! High professional and incredibly gentle with my fine curly hair!',
      createdAt: '2026-05-15T10:00:00Z'
    }
  ];

  payments: Payment[] = [
    {
      paymentId: 'pay-1',
      bookingId: 'book-1',
      customerId: 'cust-1',
      amount: 150,
      paymentMethod: 'Card',
      paymentStatus: 'completed'
    },
    {
      paymentId: 'pay-2',
      bookingId: 'book-2',
      customerId: 'cust-1',
      amount: 90,
      paymentMethod: 'PayPal',
      paymentStatus: 'completed'
    }
  ];

  notifications: Notification[] = [
    {
      notificationId: 'notif-1',
      userId: 'cust-1',
      title: 'Booking Confirmed!',
      message: 'Your party makeup booking with Samira Khan is confirmed for May 28, 2026.',
      readStatus: false,
      createdAt: '2026-05-21T10:00:00Z'
    },
    {
      notificationId: 'notif-2',
      userId: 'artist-1',
      title: 'New Booking Request',
      message: 'Elena Gilbert has booked you for Party Makeup on May 28, 2026.',
      readStatus: false,
      createdAt: '2026-05-21T09:30:00Z'
    }
  ];

  // Dual-mode helper that pushes to Firestore and saves locally
  async loadFromFirestore() {
    if (!db) {
      console.log("No Firestore available, using local memory seed data.");
      return;
    }
    try {
      console.log("Loading persistent data from Firestore to memory cache...");
      
      // Load users
      const usersSnap = await getDocs(collection(db, 'users'));
      if (!usersSnap.empty) {
        usersSnap.forEach((doc) => {
          const user = doc.data() as User;
          const idx = this.users.findIndex(u => u.id === user.id);
          if (idx > -1) {
            this.users[idx] = user;
          } else {
            this.users.push(user);
          }
        });
        console.log(`Loaded ${usersSnap.size} users from Firestore.`);
      }

      // Load artists
      const artistsSnap = await getDocs(collection(db, 'artists'));
      if (!artistsSnap.empty) {
        artistsSnap.forEach((doc) => {
          const artist = doc.data() as Artist;
          const idx = this.artists.findIndex(a => a.artistId === artist.artistId);
          if (idx > -1) {
            this.artists[idx] = artist;
          } else {
            this.artists.push(artist);
          }
        });
        console.log(`Loaded ${artistsSnap.size} artists from Firestore.`);
      }

      // Load services
      const servicesSnap = await getDocs(collection(db, 'services'));
      if (!servicesSnap.empty) {
        servicesSnap.forEach((doc) => {
          const service = doc.data() as Service;
          const idx = this.services.findIndex(s => s.serviceId === service.serviceId);
          if (idx > -1) {
            this.services[idx] = service;
          } else {
            this.services.push(service);
          }
        });
        console.log(`Loaded ${servicesSnap.size} services from Firestore.`);
      }

      // Load bookings
      const bookingsSnap = await getDocs(collection(db, 'bookings'));
      if (!bookingsSnap.empty) {
        bookingsSnap.forEach((doc) => {
          const booking = doc.data() as Booking;
          const idx = this.bookings.findIndex(b => b.bookingId === booking.bookingId);
          if (idx > -1) {
            this.bookings[idx] = booking;
          } else {
            this.bookings.push(booking);
          }
        });
        console.log(`Loaded ${bookingsSnap.size} bookings from Firestore.`);
      }

      // Load reviews
      const reviewsSnap = await getDocs(collection(db, 'reviews'));
      if (!reviewsSnap.empty) {
        reviewsSnap.forEach((doc) => {
          const review = doc.data() as Review;
          const idx = this.reviews.findIndex(r => r.reviewId === review.reviewId);
          if (idx > -1) {
            this.reviews[idx] = review;
          } else {
            this.reviews.push(review);
          }
        });
        console.log(`Loaded ${reviewsSnap.size} reviews from Firestore.`);
      }

      // Load payments
      const paymentsSnap = await getDocs(collection(db, 'payments'));
      if (!paymentsSnap.empty) {
        paymentsSnap.forEach((doc) => {
          const payment = doc.data() as Payment;
          const idx = this.payments.findIndex(p => p.paymentId === payment.paymentId);
          if (idx > -1) {
            this.payments[idx] = payment;
          } else {
            this.payments.push(payment);
          }
        });
        console.log(`Loaded ${paymentsSnap.size} payments from Firestore.`);
      }

      // Load notifications
      const notificationsSnap = await getDocs(collection(db, 'notifications'));
      if (!notificationsSnap.empty) {
        notificationsSnap.forEach((doc) => {
          const notification = doc.data() as Notification;
          const idx = this.notifications.findIndex(n => n.notificationId === notification.notificationId);
          if (idx > -1) {
            this.notifications[idx] = notification;
          } else {
            this.notifications.push(notification);
          }
        });
        console.log(`Loaded ${notificationsSnap.size} notifications from Firestore.`);
      }
    } catch (e) {
      console.warn("Error fetching persistent collections from Firestore:", e);
    }
  }

  // Dual-mode helper that pushes to Firestore and saves locally
  async syncToFirestore(collectionName: string, docId: string, data: any) {
    if (!db) return;
    try {
      await setDoc(doc(db, collectionName, docId), data);
      console.log(`Synced to Firestore collection ${collectionName} with doc code ${docId}`);
    } catch (e) {
      console.warn(`Firestore sync write error on ${collectionName}/${docId}:`, e);
    }
  }

  async deleteFromFirestore(collectionName: string, docId: string) {
    if (!db) return;
    try {
      await deleteDoc(doc(db, collectionName, docId));
      console.log(`Deleted from Firestore: ${collectionName}/${docId}`);
    } catch (e) {
      console.warn(`Firestore sync delete error on ${collectionName}/${docId}:`, e);
    }
  }
}

export const mockDB = new MockDB();
