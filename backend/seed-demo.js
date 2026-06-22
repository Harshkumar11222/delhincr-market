require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI).then(async function() {
  const { Rental, Service } = require('./db')

  console.log('🌱 Seeding demo data...')

  // ── DEMO RENTALS ──────────────────────────────
  var rentals = [
    { userId: 'demo1', title: 'Honda Activa 6G 2023', type: 'scooty', brand: 'Honda', model: 'Activa 6G', year: 2023, description: 'Excellent condition, well maintained, full service history available.', pricePerDay: 350, pricePerHour: 50, images: ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600'], location: 'Sector 62', city: 'Noida', ownerName: 'Rahul Sharma', ownerPhone: '9876543210', isVerified: true, features: ['Helmet Included', 'Full Tank', 'Insurance'], views: 45 },
    { userId: 'demo2', title: 'Maruti Swift 2022', type: 'car', brand: 'Maruti', model: 'Swift', year: 2022, description: 'AC, music system, comfortable for long drives. Self drive available.', pricePerDay: 1500, pricePerHour: 200, images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600'], location: 'Dwarka', city: 'Delhi', ownerName: 'Amit Verma', ownerPhone: '9876543211', isVerified: true, features: ['AC', 'GPS', 'Insurance', 'Self Drive'], views: 78 },
    { userId: 'demo3', title: 'Royal Enfield Classic 350', type: 'bike', brand: 'Royal Enfield', model: 'Classic 350', year: 2021, description: 'Perfect for weekend trips and long rides. Recently serviced.', pricePerDay: 800, pricePerHour: 100, images: ['https://images.unsplash.com/photo-1558979158-65a1eaa08691?w=600'], location: 'Connaught Place', city: 'Delhi', ownerName: 'Vikas Singh', ownerPhone: '9876543212', isVerified: true, features: ['Helmet Included', 'Full Tank'], views: 62 },
    { userId: 'demo4', title: 'Hero Cycle Sprint', type: 'cycle', brand: 'Hero', model: 'Sprint', year: 2023, description: 'Eco-friendly option, perfect for short distance travel within city.', pricePerDay: 100, pricePerHour: 20, images: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600'], location: 'Indirapuram', city: 'Ghaziabad', ownerName: 'Priya Gupta', ownerPhone: '9876543213', isVerified: false, features: ['Home Delivery'], views: 23 },
    { userId: 'demo5', title: 'Hyundai i20 2023', type: 'car', brand: 'Hyundai', model: 'i20', year: 2023, description: 'Premium hatchback, sunroof, automatic transmission.', pricePerDay: 1800, pricePerHour: 250, images: ['https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600'], location: 'Gurugram Sector 50', city: 'Gurugram', ownerName: 'Sanjay Mehta', ownerPhone: '9876543214', isVerified: true, features: ['AC', 'GPS', 'Insurance', 'Unlimited KM'], views: 91 },
    { userId: 'demo6', title: 'TVS Jupiter 125', type: 'scooty', brand: 'TVS', model: 'Jupiter 125', year: 2022, description: 'Mileage friendly, comfortable seating, great for daily commute.', pricePerDay: 300, pricePerHour: 40, images: ['https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600'], location: 'Lajpat Nagar', city: 'Delhi', ownerName: 'Neha Kapoor', ownerPhone: '9876543215', isVerified: true, features: ['Helmet Included', 'Full Tank'], views: 34 },
  ]

  await Rental.deleteMany({ userId: { $regex: '^demo' } })
  await Rental.insertMany(rentals)
  console.log('✅ ' + rentals.length + ' demo rentals added')

  // ── DEMO SERVICES ─────────────────────────────
  var services = [
    { userId: 'demo1', name: 'Kumar Electrical Works', category: 'electrician', description: 'All electrical work - wiring, switchboard, fan/light installation, inverter setup.', priceFrom: 199, priceTo: 1500, experience: 12, rating: 4.7, totalRatings: 189, completedJobs: 1650, location: 'Lajpat Nagar', city: 'Delhi', phone: '9876543220', providerName: 'Sunil Kumar' },
    { userId: 'demo2', name: 'Quick Fix AC Service', category: 'ac_repair', description: 'AC repair, installation, gas refill, servicing. Split & window AC specialist.', priceFrom: 399, priceTo: 3000, experience: 9, rating: 4.6, totalRatings: 245, completedJobs: 2100, location: 'Sector 18', city: 'Noida', phone: '9876543221', providerName: 'Manoj Yadav' },
    { userId: 'demo3', name: 'CleanHome Services', category: 'cleaning', description: 'Deep cleaning, sofa cleaning, kitchen cleaning. Professional equipment used.', priceFrom: 599, priceTo: 4000, experience: 5, rating: 4.8, totalRatings: 312, completedJobs: 1890, location: 'Dwarka', city: 'Delhi', phone: '9876543222', providerName: 'Anjali Devi' },
    { userId: 'demo4', name: 'PaintPro Painters', category: 'painter', description: 'Interior/exterior painting, texture work, waterproofing. Quality assured.', priceFrom: 8, priceTo: 25, experience: 15, rating: 4.9, totalRatings: 156, completedJobs: 890, location: 'Vasant Kunj', city: 'Delhi', phone: '9876543223', providerName: 'Ramesh Painter' },
    { userId: 'demo5', name: 'Sharma Home Tutoring', category: 'tutor', description: 'Maths, Science tuition for classes 6-12. CBSE/ICSE board. Home visits available.', priceFrom: 400, priceTo: 800, experience: 8, rating: 4.9, totalRatings: 98, completedJobs: 450, location: 'Rohini', city: 'Delhi', phone: '9876543224', providerName: 'Pooja Sharma' },
    { userId: 'demo6', name: 'SafeMove Packers', category: 'shifting', description: 'House/office shifting, packing, loading-unloading. Insured transport.', priceFrom: 1500, priceTo: 15000, experience: 10, rating: 4.5, totalRatings: 178, completedJobs: 670, location: 'Sector 62', city: 'Noida', phone: '9876543225', providerName: 'Vikram Movers' },
  ]

  await Service.deleteMany({ userId: { $regex: '^demo' } })
  await Service.insertMany(services)
  console.log('✅ ' + services.length + ' demo services added')

  console.log('🎉 Demo data seeding complete!')
  process.exit(0)
}).catch(function(err) {
  console.error('❌ Seed error:', err.message)
  process.exit(1)
})