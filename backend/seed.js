require('dotenv').config()
const mongoose = require('mongoose')
const { Listing, Service } = require('./db')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://delhincr_admin:Delhi@2024@delhincr-cluster.xarvjbi.mongodb.net/delhincr?appName=delhincr-cluster'

const seedListings = [
  {
    userId: 'seed-1', title: 'Apple MacBook Pro M1 2021',
    description: 'Excellent condition, barely used. 8GB RAM, 256GB SSD. Original charger and box included.',
    price: 85000, isNegotiable: true, category: 'electronics', condition: 'Like New',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80'],
    location: 'Noida Sector 62', area: 'Noida', city: 'Noida',
    sellerName: 'Rahul Sharma', sellerPhone: '9876543210', isVerified: true, views: 234,
  },
  {
    userId: 'seed-2', title: 'Royal Enfield Bullet 350 - 2020',
    description: '2020 model, 12,000 km driven. Single owner. All documents clear.',
    price: 145000, isNegotiable: true, category: 'vehicles', condition: 'Good',
    images: ['https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=600&q=80'],
    location: 'Gurugram Sector 14', area: 'Gurugram', city: 'Gurugram',
    sellerName: 'Amit Kumar', sellerPhone: '9876543211', isVerified: true, views: 456,
  },
  {
    userId: 'seed-3', title: 'Samsung 55" Crystal 4K Smart TV',
    description: 'Samsung 2022 model. Perfect working condition. Remote and stand included.',
    price: 32000, isNegotiable: false, category: 'electronics', condition: 'Good',
    images: ['https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&q=80'],
    location: 'Dwarka Sector 10', area: 'Dwarka', city: 'Delhi',
    sellerName: 'Priya Singh', sellerPhone: '9876543212', isVerified: false, views: 189,
  },
  {
    userId: 'seed-4', title: 'Godrej Double Door Refrigerator 350L',
    description: 'Only 2 years old. Excellent cooling. Minor cosmetic scratch on side.',
    price: 18000, isNegotiable: true, category: 'appliances', condition: 'Good',
    images: ['https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&q=80'],
    location: 'Indirapuram', area: 'Ghaziabad', city: 'Ghaziabad',
    sellerName: 'Sunita Devi', sellerPhone: '9876543213', isVerified: true, views: 123,
  },
  {
    userId: 'seed-5', title: 'iPhone 13 Pro Max 256GB',
    description: 'Graphite color. 9 months old. Original box and all accessories.',
    price: 78000, isNegotiable: false, category: 'electronics', condition: 'Like New',
    images: ['https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=600&q=80'],
    location: 'Lajpat Nagar', area: 'South Delhi', city: 'Delhi',
    sellerName: 'Neha Gupta', sellerPhone: '9876543215', isVerified: true, views: 567,
  },
  {
    userId: 'seed-6', title: 'Wooden Sofa Set 3+1+1',
    description: 'Solid sheesham wood. Cushions in good condition. 4 years old.',
    price: 22000, isNegotiable: true, category: 'furniture', condition: 'Good',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80'],
    location: 'Faridabad Sector 21', area: 'Faridabad', city: 'Faridabad',
    sellerName: 'Deepak Verma', sellerPhone: '9876543214', isVerified: true, views: 312,
  },
  {
    userId: 'seed-7', title: 'Dell Inspiron 15 Laptop i5 11th Gen',
    description: '8GB RAM, 512GB SSD. 2022 model. Windows 11 activated. Bag included.',
    price: 38000, isNegotiable: true, category: 'electronics', condition: 'Good',
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80'],
    location: 'Rohini Sector 3', area: 'Rohini', city: 'Delhi',
    sellerName: 'Vijay Yadav', sellerPhone: '9876543216', isVerified: false, views: 145,
  },
  {
    userId: 'seed-8', title: 'Honda Activa 6G 2022 White',
    description: '8,000 km only. Single owner. Insurance valid till 2025.',
    price: 72000, isNegotiable: true, category: 'vehicles', condition: 'Like New',
    images: ['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80'],
    location: 'Mayur Vihar Phase 1', area: 'East Delhi', city: 'Delhi',
    sellerName: 'Arun Mishra', sellerPhone: '9876543217', isVerified: true, views: 289,
  },
]

const seedServices = [
  {
    userId: 'pro-1', name: 'Rajesh Plumbing Services', category: 'plumber',
    description: 'All plumbing work: pipe fitting, leak repair, bathroom fitting. 15+ years experience.',
    priceFrom: 299, priceTo: 1500, experience: 15,
    rating: 4.8, totalRatings: 234, completedJobs: 1456,
    location: 'Noida Sector 62', area: 'Noida', city: 'Noida',
    isVerified: true, phone: '9911223344',
    providerName: 'Rajesh Kumar',
    avatar: 'https://i.pravatar.cc/150?img=11',
  },
  {
    userId: 'pro-2', name: 'PowerFix Electricians', category: 'electrician',
    description: 'Wiring, switchboard repair, fan/AC installation. Emergency service 24x7.',
    priceFrom: 199, priceTo: 2000, experience: 10,
    rating: 4.6, totalRatings: 189, completedJobs: 987,
    location: 'Gurugram Sector 14', area: 'Gurugram', city: 'Gurugram',
    isVerified: true, phone: '9922334455',
    providerName: 'Mohan Electricals',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
  {
    userId: 'pro-3', name: 'Sharma Carpentry Works', category: 'carpenter',
    description: 'Furniture repair, modular kitchen, wooden flooring. 20 years experience.',
    priceFrom: 399, priceTo: 5000, experience: 20,
    rating: 4.9, totalRatings: 312, completedJobs: 2100,
    location: 'Dwarka Sector 6', area: 'Dwarka', city: 'Delhi',
    isVerified: true, phone: '9933445566',
    providerName: 'Suresh Sharma',
    avatar: 'https://i.pravatar.cc/150?img=13',
  },
  {
    userId: 'pro-4', name: 'CoolAir AC Service', category: 'ac_repair',
    description: 'AC installation, servicing, gas refill, PCB repair. All brands. Same day.',
    priceFrom: 499, priceTo: 3000, experience: 8,
    rating: 4.7, totalRatings: 456, completedJobs: 3200,
    location: 'Indirapuram', area: 'Ghaziabad', city: 'Ghaziabad',
    isVerified: true, phone: '9944556677',
    providerName: 'Anil Gupta',
    avatar: 'https://i.pravatar.cc/150?img=14',
  },
  {
    userId: 'pro-5', name: 'ColorPro Painting', category: 'painter',
    description: 'Interior/exterior painting, waterproofing, texture & POP work.',
    priceFrom: 8, priceTo: 25, experience: 12,
    rating: 4.5, totalRatings: 178, completedJobs: 890,
    location: 'Faridabad Sector 21', area: 'Faridabad', city: 'Faridabad',
    isVerified: false, phone: '9955667788',
    providerName: 'Ramesh Painter',
    avatar: 'https://i.pravatar.cc/150?img=15',
  },
  {
    userId: 'pro-6', name: 'CleanHome Deep Cleaning', category: 'cleaning',
    description: 'Full home deep cleaning, sofa/carpet shampooing, bathroom sanitization.',
    priceFrom: 799, priceTo: 4000, experience: 6,
    rating: 4.4, totalRatings: 267, completedJobs: 1200,
    location: 'Rohini Sector 3', area: 'Rohini', city: 'Delhi',
    isVerified: true, phone: '9966778899',
    providerName: 'CleanHome Team',
    avatar: 'https://i.pravatar.cc/150?img=16',
  },
]

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ MongoDB Connected')

    // Clear existing seed data
    await Listing.deleteMany({ userId: { $regex: /^seed-/ } })
    await Service.deleteMany({ userId: { $regex: /^pro-/ } })
    console.log('🗑️  Old seed data cleared')

    // Insert new seed data
    await Listing.insertMany(seedListings)
    console.log('✅ Listings seeded:', seedListings.length)

    await Service.insertMany(seedServices)
    console.log('✅ Services seeded:', seedServices.length)

    console.log('\n🎉 Seed complete!')
    process.exit(0)
  } catch(err) {
    console.error('❌ Seed error:', err.message)
    process.exit(1)
  }
}

seed()