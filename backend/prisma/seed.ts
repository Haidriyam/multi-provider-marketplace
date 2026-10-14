import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seeding for Faraday Royal Expeditions...');

  // Clear existing data in reverse order of dependencies
  await prisma.auditLog.deleteMany();
  await prisma.message.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.favourite.deleteMany();
  await prisma.review.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.bookingItem.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.discount.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.media.deleteMany();
  await prisma.itineraryItem.deleteMany();
  await prisma.package.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.category.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.providerStaff.deleteMany();
  await prisma.provider.deleteMany();
  await prisma.user.deleteMany();
  await prisma.cMSBanner.deleteMany();

  const passwordHash = await bcrypt.hash('Marketplace123!', 10);
  const adminPasswordHash = await bcrypt.hash('Admin123!', 10);

  // 1. CREATE USERS
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@marketplace.com',
      passwordHash: adminPasswordHash,
      firstName: 'Faraday',
      lastName: 'SuperAdmin',
      phone: '+92 300 0000001',
      role: 'SUPER_ADMIN',
      isActive: true,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    }
  });

  const opsAdmin = await prisma.user.create({
    data: {
      email: 'ops@marketplace.com',
      passwordHash: adminPasswordHash,
      firstName: 'Tariq',
      lastName: 'Mahmood',
      phone: '+92 300 0000002',
      role: 'OPERATIONS_ADMIN',
      isActive: true,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
    }
  });

  const providerUser1 = await prisma.user.create({
    data: {
      email: 'apex@adventures.com',
      passwordHash,
      firstName: 'Kamran',
      lastName: 'Nazir',
      phone: '+92 300 1112233',
      role: 'PROVIDER',
      isActive: true,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
    }
  });

  const providerUser2 = await prisma.user.create({
    data: {
      email: 'coastal@escapes.com',
      passwordHash,
      firstName: 'Zainab',
      lastName: 'Baloch',
      phone: '+92 321 4445566',
      role: 'PROVIDER',
      isActive: true,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
    }
  });

  const providerUser3 = await prisma.user.create({
    data: {
      email: 'safari@wildlife.com',
      passwordHash,
      firstName: 'Bilal',
      lastName: 'Siddiqui',
      phone: '+92 333 7778899',
      role: 'PROVIDER',
      isActive: true,
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80'
    }
  });

  const providerUser4 = await prisma.user.create({
    data: {
      email: 'heritage@punjab.com',
      passwordHash,
      firstName: 'Hamza',
      lastName: 'Tariq',
      phone: '+92 345 8889900',
      role: 'PROVIDER',
      isActive: true,
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80'
    }
  });

  const customer1 = await prisma.user.create({
    data: {
      email: 'sarah@customer.com',
      passwordHash,
      firstName: 'Sarah',
      lastName: 'Jenkins',
      phone: '+44 7700 900077',
      role: 'CUSTOMER',
      isActive: true,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
    }
  });

  const customer2 = await prisma.user.create({
    data: {
      email: 'alistair@customer.com',
      passwordHash,
      firstName: 'Lord Alistair',
      lastName: 'Vance',
      phone: '+971 50 1234567',
      role: 'CUSTOMER',
      isActive: true,
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80'
    }
  });

  const customer3 = await prisma.user.create({
    data: {
      email: 'eleanor@customer.com',
      passwordHash,
      firstName: 'Dr. Eleanor',
      lastName: 'Wright',
      phone: '+1 415 555 2671',
      role: 'CUSTOMER',
      isActive: true,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'
    }
  });

  // 2. CREATE PROVIDERS
  const provider1 = await prisma.provider.create({
    data: {
      userId: providerUser1.id,
      businessName: 'Apex Karakoram Adventures',
      tradeLicenseNo: 'LIC-GB-2023-889',
      taxId: 'NTN-739210-9',
      phone: '+92 300 1112233',
      email: 'apex@adventures.com',
      address: 'Shahrah-e-Quaid-e-Azam, Jutial',
      city: 'Gilgit',
      country: 'Pakistan',
      bio: 'Premier high-altitude mountaineering logistics company founded by veteran Karakoram mountain guides. Specialists in K2, Broad Peak, Hunza royal heritage, and helicopter charter expeditions.',
      logoUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=200&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      verificationStatus: 'APPROVED',
      verificationNotes: 'All certified security clearances, mountain rescue insurance, and NTN verified.',
      verificationDocs: 'https://storage.marketplace.com/docs/apex-verified-license.pdf',
      rating: 4.9,
      reviewCount: 42,
    }
  });

  const provider2 = await prisma.provider.create({
    data: {
      userId: providerUser2.id,
      businessName: 'Coastal & Marine Safaris Pakistan',
      tradeLicenseNo: 'LIC-BAL-2022-441',
      taxId: 'NTN-8921043-1',
      phone: '+92 321 4445566',
      email: 'coastal@escapes.com',
      address: 'Marine Drive Coastal Hub',
      city: 'Gwadar',
      country: 'Pakistan',
      bio: 'PADI certified master divers, luxury twin-engine catamaran charters, deep-sea angling, and pristine Astola Island eco-camps with gourmet seafood catering.',
      logoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80',
      verificationStatus: 'APPROVED',
      verificationNotes: 'Verified maritime commercial vessel license and coast guard security audit.',
      verificationDocs: 'https://storage.marketplace.com/docs/coastal-marine-permit.pdf',
      rating: 4.8,
      reviewCount: 28,
    }
  });

  const provider3 = await prisma.provider.create({
    data: {
      userId: providerUser3.id,
      businessName: 'Indus Alpine & Wildlife Expeditions',
      tradeLicenseNo: 'LIC-KPK-2024-102',
      taxId: 'NTN-6102934-8',
      phone: '+92 333 7778899',
      email: 'safari@wildlife.com',
      address: 'Kalam Valley Road',
      city: 'Swat',
      country: 'Pakistan',
      bio: 'Eco-conscious wildlife observation, Himalayan brown bear tracking in Deosai, high-altitude alpine lakes, and trout angling expeditions in Swat, Kumrat, and Chitral valleys.',
      logoUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=200&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
      verificationStatus: 'APPROVED',
      verificationNotes: 'Eco-tourism wildlife handler license and commercial tour operator registration verified.',
      verificationDocs: 'https://storage.marketplace.com/docs/indus-approved.pdf',
      rating: 4.9,
      reviewCount: 16,
    }
  });

  const provider4 = await prisma.provider.create({
    data: {
      userId: providerUser4.id,
      businessName: 'Royal Heritage & Silk Route Caravans',
      tradeLicenseNo: 'LIC-PUN-2021-309',
      taxId: 'NTN-5019284-3',
      phone: '+92 345 8889900',
      email: 'heritage@punjab.com',
      address: 'Mall Road, Heritage Quarter',
      city: 'Lahore',
      country: 'Pakistan',
      bio: 'Private bespoke tours of UNESCO World Heritage Mughal monuments, historic palaces, Cholistan Desert luxury glamping, and Sufi shrine heritage trails.',
      logoUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=200&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
      verificationStatus: 'APPROVED',
      verificationNotes: 'Department of Archaeology & Tourism Punjab accreditation verified.',
      verificationDocs: 'https://storage.marketplace.com/docs/heritage-approved.pdf',
      rating: 5.0,
      reviewCount: 22,
    }
  });

  // 3. CREATE DESTINATIONS
  const hunza = await prisma.destination.create({
    data: {
      name: 'Hunza Valley',
      slug: 'hunza-valley',
      country: 'Pakistan',
      region: 'Gilgit-Baltistan',
      description: 'Fabled mountain kingdom nestled beneath 7,788m Rakaposhi, known for thousand-year-old forts, Attabad turquoise waters, and ancient Silk Route hospitality.',
      imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
    }
  });

  const skardu = await prisma.destination.create({
    data: {
      name: 'Skardu & Deosai Sanctuary',
      slug: 'skardu-deosai',
      country: 'Pakistan',
      region: 'Gilgit-Baltistan',
      description: 'Gateway to K2 and the four eight-thousanders. Home to the world’s second highest alpine plateau, cold deserts, and emerald glacial lakes.',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
    }
  });

  const swat = await prisma.destination.create({
    data: {
      name: 'Swat Emerald Highlands',
      slug: 'swat-valley',
      country: 'Pakistan',
      region: 'Khyber Pakhtunkhwa',
      description: 'The Switzerland of the East with lush alpine meadows, 2,000-year-old Buddhist Gandhara monasteries, and Malam Jabba ski slopes.',
      imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
    }
  });

  const gwadar = await prisma.destination.create({
    data: {
      name: 'Gwadar & Astola Coast',
      slug: 'gwadar-astola',
      country: 'Pakistan',
      region: 'Balochistan',
      description: 'Dramatic Arabian Sea cliffs, pristine white sand beaches, untouched coral reefs at Astola Island, and the Makran Coastal Highway.',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
    }
  });

  const kumrat = await prisma.destination.create({
    data: {
      name: 'Kumrat Alpine Valley',
      slug: 'kumrat-valley',
      country: 'Pakistan',
      region: 'Khyber Pakhtunkhwa',
      description: 'Dense Deodar cedar pine canopies, roaring crystal streams, and the majestic glacial amphitheater of Katora Lake.',
      imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
    }
  });

  const fairyMeadows = await prisma.destination.create({
    data: {
      name: 'Fairy Meadows & Nanga Parbat',
      slug: 'fairy-meadows-nanga-parbat',
      country: 'Pakistan',
      region: 'Gilgit-Baltistan',
      description: 'Legendary lush plateau facing the sheer 8,126m Raikot Face of Nanga Parbat, surrounded by alpine birch forests and dark skies.',
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
    }
  });

  const lahore = await prisma.destination.create({
    data: {
      name: 'Walled City of Lahore',
      slug: 'lahore-walled-city',
      country: 'Pakistan',
      region: 'Punjab',
      description: 'The cultural epicenter of the Mughal Empire. Home to the UNESCO-listed Lahore Fort, Badshahi Mosque, Shahi Hammam, and vibrant culinary bazaars.',
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
    }
  });

  const chitral = await prisma.destination.create({
    data: {
      name: 'Chitral & Kalash Valleys',
      slug: 'chitral-kalash',
      country: 'Pakistan',
      region: 'Khyber Pakhtunkhwa',
      description: 'Enchanting valleys under the 7,708m Tirich Mir peak, home to the ancient animist Kalash culture and scenic mountain passes.',
      imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
    }
  });

  // 4. CREATE CATEGORIES
  const catTrek = await prisma.category.create({
    data: {
      name: 'Mountain Trekking & Expeditions',
      slug: 'trekking-expeditions',
      description: 'High-altitude glacial ascents, basecamp treks, mountain passes, and certified alpine guiding.',
      icon: 'Mountain',
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
      isFeatured: true,
    }
  });

  const catCulture = await prisma.category.create({
    data: {
      name: 'Cultural & Heritage Tours',
      slug: 'cultural-heritage',
      description: 'UNESCO World Heritage forts, Mughal palaces, ancient Silk Route citadels, and private artisan immersions.',
      icon: 'Landmark',
      imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=600&q=80',
      isFeatured: true,
    }
  });

  const catWater = await prisma.category.create({
    data: {
      name: 'Coastal Escapes & Water Sports',
      slug: 'coastal-watersports',
      description: 'Private catamaran yacht charters, PADI coral scuba diving, deep-sea angling, and pristine island beach retreats.',
      icon: 'Waves',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      isFeatured: true,
    }
  });

  const catSafari = await prisma.category.create({
    data: {
      name: 'Wildlife & Eco Safaris',
      slug: 'wildlife-safari',
      description: 'Himalayan brown bear spotting in Deosai, winter snow leopard tracking, and Markhor conservation trails.',
      icon: 'Trees',
      imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
      isFeatured: true,
    }
  });

  const catLuxury = await prisma.category.create({
    data: {
      name: 'Luxury Glamping & Heli-Suites',
      slug: 'luxury-glamping',
      description: 'Heated panoramic dome suites, private helicopter transfers, personal gourmet chefs, and bespoke wellness retreats.',
      icon: 'Sparkles',
      imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=600&q=80',
      isFeatured: true,
    }
  });

  // 5. HELPER DATA CREATION FOR 10 EXPEDITIONS
  const listingsData = [
    // 1. Hunza Royal Heritage
    {
      providerId: provider1.id,
      destinationId: hunza.id,
      categoryId: catCulture.id,
      title: 'Hunza Royal Palaces, Attabad Fjord & Glacier Panorama (7 Days)',
      slug: 'hunza-valley-7-day-heritage-glacier-expedition',
      shortDescription: 'Executive 7-day luxury exploration with private 4x4 Land Cruiser, Baltit & Altit Fort private tours, and Serena Inn mountain view suites.',
      fullDescription: 'Embark on an unforgettable 7-day private odyssey through the legendary Hunza mountain kingdom. Travel in an executive Toyota Land Cruiser V8 with a mountain driver, stay in 5-star mountain view boutique suites, enjoy private after-hours tours of the 900-year-old Baltit and Altit Forts, and experience a private high-speed catamaran cruise across the turquoise Attabad Fjord.',
      basePrice: 145000,
      currency: 'PKR',
      durationDays: 7,
      maxGuests: 6,
      meetingPoint: 'Islamabad International Airport VIP Terminal or Gilgit Airport',
      inclusions: JSON.stringify([
        'Private Toyota Land Cruiser V8 with dedicated mountain chauffeur & fuel',
        '6 nights accommodation in Serena Hunza Inn & luxury mountain chalets',
        'Full gourmet board (Daily artisanal breakfast, scenic picnic, traditional dinners)',
        'Private Attabad Lake speedboat cruise with life jackets & safety boat',
        'Private entry and expert curator guide at Baltit Fort and Altit Fort',
        '24/7 Satellite phone dispatch and onboard medical oxygen kit'
      ]),
      exclusions: JSON.stringify(['International flights', 'Personal porter services for off-trail walks', 'Personal travel insurance']),
      highlights: JSON.stringify([
        'Sunrise illumination over 7,788m Rakaposhi from luxury private balcony',
        'Private sunset photography at the soaring Passu Cathedral Cones',
        'Exclusive royal garden apricot and walnut honey tasting session'
      ]),
      cancellationPolicy: 'Full 100% refund up to 10 days before departure date. Flexible reschedule.',
      isFeatured: true,
      featuredPriority: 10,
      rating: 4.9,
      reviewCount: 38,
      packages: [
        { name: 'First-Class Executive Suite', description: 'Private Land Cruiser V8 and Serena Inn Royal Terrace Suite with personal guide.', price: 170000, discountedPrice: 145000, maxGuests: 4, durationDays: 7 },
        { name: 'Presidential Family Villa', description: 'Exclusive 2-bedroom alpine chalet, private dining chef, and dedicated 24/7 support vehicle.', price: 245000, discountedPrice: 215000, maxGuests: 6, durationDays: 7 }
      ],
      media: [
        { url: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80', altText: 'Hunza Valley Baltit Fort and mountain peak', isCover: true, sortOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', altText: 'Passu Cathedral Cones at dusk', isCover: false, sortOrder: 1 }
      ],
      discount: { title: 'Royal Spring Privilege', code: 'ROYALSPRING', percentage: 15, startDate: '2026-03-01', endDate: '2026-11-30' },
      reviews: [
        { userName: 'Lord Alistair Vance', rating: 5, title: 'Absolute world-class service and discretion', comment: 'From our private greeting in Islamabad to the breathtaking view from our Serena terrace, Kamran and his team delivered an Emirates-level luxury standard.', response: 'Honored to host you Lord Vance. We look forward to welcoming your expedition party back to the Karakoram.' },
        { userName: 'Sarah Jenkins', rating: 5, title: 'Unmatched beauty and hospitality', comment: 'The private boat across Attabad Lake was surreal. Crisp turquoise water against sheer golden rock. The guides were exceptionally knowledgeable.', response: 'Thank you Sarah! It was a delight escorting your party.' }
      ]
    },

    // 2. K2 Base Camp Heli-Trek
    {
      providerId: provider1.id,
      destinationId: skardu.id,
      categoryId: catTrek.id,
      title: 'K2 Base Camp & Concordia Heli-Assisted Royal Trek (14 Days)',
      slug: 'k2-base-camp-concordia-heli-assisted-trek',
      shortDescription: 'The Throne Room of the Mountain Gods. Heated dome tents, high-altitude satellite dispatch, gourmet mountaineering chefs, and emergency heli-evac guarantee.',
      fullDescription: 'The pinnacle of global high-altitude trekking. Experience the legendary Baltoro Glacier, witness the convergence of 4 eight-thousanders at Concordia, and stand beneath the 8,611m pyramid of K2. Featuring heated private dome basecamps, hot shower facilities on the ice, satellite communications, high-altitude nutritionists, and standby military helicopter evacuation coverage.',
      basePrice: 280000,
      currency: 'PKR',
      durationDays: 14,
      maxGuests: 8,
      meetingPoint: 'Skardu Airport Private Terminal',
      inclusions: JSON.stringify([
        'Full expedition logistics: Central Karakoram National Park permits & royalty fees',
        'Private heated geodetic dome tents with memory foam cots and down sleeping bags',
        'Gourmet expedition culinary team preparing fresh high-altitude meals and barista coffee',
        'Certified UIAGM / Pakistani high-altitude guides with satellite Garmin inReach',
        'Comprehensive Askari Aviation emergency helicopter rescue insurance guarantee',
        'Skardu 5-star hotel transfers and heritage fort accommodations'
      ]),
      exclusions: JSON.stringify(['Personal high-altitude mountaineering boots and crampons', 'Personal international flights']),
      highlights: JSON.stringify([
        'Stargazing beneath K2, Broad Peak, and Gasherbrum from Concordia',
        'Scenic helicopter aerial return flight over the Trango Towers granite monoliths',
        'Celebratory gala dinner at historic Shigar Fort palace'
      ]),
      cancellationPolicy: 'Flexible reschedule up to 21 days before departure due to mountain logistics.',
      isFeatured: true,
      featuredPriority: 9,
      rating: 5.0,
      reviewCount: 24,
      packages: [
        { name: 'First-Class Concordia Expedition', description: 'Full overland glacier traverse with helicopter return from Concordia.', price: 280000, discountedPrice: 260000, maxGuests: 8, durationDays: 14 }
      ],
      media: [
        { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', altText: 'K2 and Baltoro Glacier Concordia view', isCover: true, sortOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', altText: 'High altitude heated camp under starry sky', isCover: false, sortOrder: 1 }
      ],
      discount: { title: 'Early Karakoram Dispatch', code: 'K2EXPED', percentage: 10, startDate: '2026-06-01', endDate: '2026-09-30' },
      reviews: [
        { userName: 'Dr. Eleanor Wright', rating: 5, title: 'The adventure of a lifetime', comment: 'Standing at Concordia surrounded by four 8,000-meter peaks is spiritual. The heated domes and hot meals on the glacier made this rugged trek extraordinarily comfortable.', response: 'Dr. Wright, it was an honor guiding you to the heart of the Karakoram.' }
      ]
    },

    // 3. Astola Island Catamaran & Coral Scuba
    {
      providerId: provider2.id,
      destinationId: gwadar.id,
      categoryId: catWater.id,
      title: 'Astola Island Private Catamaran & PADI Coral Scuba (4 Days)',
      slug: 'astola-island-scuba-diving-gwadar-charter',
      shortDescription: 'Sail to Pakistan’s largest offshore island on a private twin-engine catamaran charter. Crystal clear turquoise visibility, coral reef dives, and beach camping.',
      fullDescription: 'Charter a private twin-engine marine catamaran from Pasni to the legendary Astola Island, known as the Island of the Seven Hills. Renowned for crystal visibility up to 25 meters, virgin hard coral reefs, green sea turtle breeding sanctuaries, and bioluminescent nocturnal tides. Includes PADI Master Diver instruction and beachfront fresh catch lobster barbecue.',
      basePrice: 95000,
      currency: 'PKR',
      durationDays: 4,
      maxGuests: 8,
      meetingPoint: 'Gwadar International Airport or Pasni Port VIP Jetty',
      inclusions: JSON.stringify([
        'Private twin-engine 40-foot catamaran charter with certified captain and maritime crew',
        '4 guided scuba dives with PADI Master Instructor and full Aqualung gear',
        'Glamping beachfront pavilion on Astola with comfortable bedding and shade canopy',
        'All meals featuring fresh catch Arabian sea fish, lobster, and coastal cuisine',
        '4K underwater photography and drone cinema highlight video'
      ]),
      exclusions: JSON.stringify(['Personal wetsuit sizing (available on-site)', 'Domestic airfare to Gwadar']),
      highlights: JSON.stringify([
        'Dolphin pod escort during the open sea crossing',
        'Nocturnal swimming in bioluminescent glowing turquoise waters',
        'Exploration of untouched marine caves and coral gardens'
      ]),
      cancellationPolicy: '100% refund or free date reschedule in case of maritime weather advisories.',
      isFeatured: true,
      featuredPriority: 8,
      rating: 4.8,
      reviewCount: 19,
      packages: [
        { name: 'Certified Diver First-Class Charter', description: 'Includes 4 dives, private catamaran berth, and full glamping suite on Astola.', price: 110000, discountedPrice: 95000, maxGuests: 8, durationDays: 4 }
      ],
      media: [
        { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', altText: 'Astola Island turquoise shoreline and yacht', isCover: true, sortOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80', altText: 'Coral reef scuba diving clear waters', isCover: false, sortOrder: 1 }
      ],
      discount: { title: 'Arabian Sea Summer Privilege', code: 'ASTOLA20', percentage: 15, startDate: '2026-04-01', endDate: '2026-10-31' },
      reviews: [
        { userName: 'Sarah Jenkins', rating: 5, title: 'Hidden gem of the Arabian Sea', comment: 'I had no idea Pakistan possessed reefs as pristine as the Maldives! Water was crystal clear, we saw turtles on every dive.', response: 'Thank you Sarah! Astola remains our sacred coastal treasure.' }
      ]
    },

    // 4. Skardu & Deosai Safari
    {
      providerId: provider1.id,
      destinationId: skardu.id,
      categoryId: catSafari.id,
      title: 'Skardu & Deosai Plains Land Cruiser Safari & Brown Bear Sanctuary (6 Days)',
      slug: 'skardu-deosai-plains-land-cruiser-safari',
      shortDescription: 'Witness Shangrila Resort, Katpana cold desert, Sheosar Lake, and Himalayan brown bears in the world’s second highest alpine plateau.',
      fullDescription: 'The ultimate overland journey into the heart of Baltistan. Venture across the Deosai plateau at 4,000m, stargaze in the high altitude Katpana cold desert, and marvel at the snowy reflection in Lower Kachura Lake. Complete with luxury Heritage Fort accommodations and expert wildlife trackers.',
      basePrice: 160000,
      currency: 'PKR',
      durationDays: 6,
      maxGuests: 8,
      meetingPoint: 'Skardu Airport Terminal',
      inclusions: JSON.stringify([
        'Toyota Land Cruiser (70 Series) 4x4 throughout expedition',
        '5 nights luxury hotel stays (Shigar Fort & Shangrila Kachura Resort)',
        'Full gourmet board (Breakfast, lunch picnic, dinner)',
        'Deosai National Park entry fees & wildlife naturalist guide',
        'Cold desert ATV pass'
      ]),
      exclusions: JSON.stringify(['Personal cold weather gear', 'Gratuities']),
      highlights: JSON.stringify(['Sheosar lake reflection', 'Katpana dunes sunset', 'Shigar Fort palace walk']),
      cancellationPolicy: 'Full refund up to 10 days prior to trip start.',
      isFeatured: true,
      featuredPriority: 7,
      rating: 4.8,
      reviewCount: 24,
      packages: [
        { name: 'All-Inclusive Explorer Suite', description: 'Full transport, fort accommodation, meals and entrance tickets.', price: 175000, discountedPrice: 160000, maxGuests: 8, durationDays: 6 }
      ],
      media: [
        { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', altText: 'Deosai Plains alpine flowers and lake', isCover: true, sortOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80', altText: 'Skardu mountain landscape', isCover: false, sortOrder: 1 }
      ],
      discount: null,
      reviews: [
        { userName: 'Lord Alistair Vance', rating: 5, title: 'Spectacular wilderness', comment: 'The Deosai plateau is unlike anything in the world. Wild, untamed, and breathtakingly vast.', response: 'Delighted you enjoyed the Roof of the World, Lord Vance.' }
      ]
    },

    // 5. Fairy Meadows & Nanga Parbat
    {
      providerId: provider1.id,
      destinationId: fairyMeadows.id,
      categoryId: catTrek.id,
      title: 'Fairy Meadows & Nanga Parbat Raikot Glacier Expedition (5 Days)',
      slug: 'fairy-meadows-nanga-parbat-basecamp-heli-trek',
      shortDescription: 'Witness the sheer 8,126m Killer Mountain from the enchanting pine plateau of Fairy Meadows. Heated chalets, mountain horses, and glacier trekking.',
      fullDescription: 'A pilgrimage to one of the greatest mountain vistas on Earth. Ascend the world-famous Raikot gorge in private 4x4 jeeps, hike through fairy-tale pine and birch forests to the high alpine meadows, and sleep in cozy heated pine cabins directly beneath the colossal 8,126-meter north face of Nanga Parbat.',
      basePrice: 110000,
      currency: 'PKR',
      durationDays: 5,
      maxGuests: 10,
      meetingPoint: 'Raikot Bridge or Gilgit Airport',
      inclusions: JSON.stringify([
        'Private 4x4 mountain jeep transfers from Raikot Bridge to Tattu village',
        '4 nights in private heated alpine log cottages with direct Nanga Parbat views',
        'Trained mountain guide and pack horses for personal luggage',
        'All gourmet meals prepared with fresh mountain produce and bonfire dinners',
        'Day hike to Beyal Camp and the edge of the Raikot Glacier'
      ]),
      exclusions: JSON.stringify(['Personal sleeping bag (cottages provide down quilts)', 'Beverages']),
      highlights: JSON.stringify([
        'Nightly bonfires under zero-light-pollution starry skies and the Milky Way',
        'Sunrise reflection of Nanga Parbat in the tranquil reflection pool',
        'Hike to Beyal camp beneath hanging ice seracs'
      ]),
      cancellationPolicy: 'Full refund up to 7 days before tour departure.',
      isFeatured: true,
      featuredPriority: 6,
      rating: 4.9,
      reviewCount: 31,
      packages: [
        { name: 'Panoramic Pine Log Chalet', description: 'Private heated cottage with direct balcony view of Nanga Parbat face.', price: 125000, discountedPrice: 110000, maxGuests: 4, durationDays: 5 }
      ],
      media: [
        { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', altText: 'Fairy Meadows view of Nanga Parbat', isCover: true, sortOrder: 0 }
      ],
      discount: null,
      reviews: [
        { userName: 'Dr. Eleanor Wright', rating: 5, title: 'Incredible mountain presence', comment: 'The sheer scale of Nanga Parbat rising straight out of the pine trees is unforgettable.', response: 'Thank you Dr. Wright!' }
      ]
    },

    // 6. Kumrat Valley Alpine Forest Trek
    {
      providerId: provider3.id,
      destinationId: kumrat.id,
      categoryId: catTrek.id,
      title: 'Kumrat Valley Alpine Pine Forests & Katora Glacial Lake Traverse (5 Days)',
      slug: 'kumrat-valley-katora-lake-pine-trek',
      shortDescription: 'Trek beneath towering 100-foot Deodar cedar canopies, visit roaring waterfalls, and hike up to the mystical turquoise bowl of Katora Lake.',
      fullDescription: 'Discover the untamed grandeur of Upper Dir. Travel in 4x4 mountain vehicles along the raging Panjkora River, explore the dense Deodar forests of Kumrat, camp in comfortable luxury dome tents, and complete the scenic trek to Katora Lake — a sparkling high-altitude glacial bowl surrounded by snow peaks.',
      basePrice: 75000,
      currency: 'PKR',
      durationDays: 5,
      maxGuests: 12,
      meetingPoint: 'Islamabad Motorway Interchange or Timergara',
      inclusions: JSON.stringify([
        'Private 4x4 overland transport with experienced mountain driver',
        '4 nights in luxury riverside glamping pods and hotel rooms',
        'Full board meals including fresh river trout dinners and trail snacks',
        'Experienced local wilderness guide and porter support for camping gear',
        'Campfire nights with local folk music'
      ]),
      exclusions: JSON.stringify(['Personal trekking poles', 'Personal medications']),
      highlights: JSON.stringify([
        'Katora glacial lake exploration at 3,500m elevation',
        'Riverside trout barbecue under soaring Deodar trees',
        'Kumrat waterfall and Do Janga mountain confluence'
      ]),
      cancellationPolicy: 'Free cancellation up to 7 days before departure.',
      isFeatured: false,
      featuredPriority: 5,
      rating: 4.7,
      reviewCount: 15,
      packages: [
        { name: 'Riverside Glamping Suite', description: 'Private luxury riverside glamping pod with en-suite bath.', price: 85000, discountedPrice: 75000, maxGuests: 4, durationDays: 5 }
      ],
      media: [
        { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80', altText: 'Kumrat dense pine valley and river', isCover: true, sortOrder: 0 }
      ],
      discount: null,
      reviews: []
    },

    // 7. Swat Gandhara & Ski Suite
    {
      providerId: provider3.id,
      destinationId: swat.id,
      categoryId: catCulture.id,
      title: 'Swat Valley Buddhist Gandhara Heritage & Malam Jabba Luxury Ski Suite (4 Days)',
      slug: 'swat-gandhara-buddhist-heritage-ski-resort',
      shortDescription: 'Archaeological exploration of Butkara stupas paired with luxury alpine lodge lodging in Malam Jabba with private ski lift passes.',
      fullDescription: 'Immerse yourself in the rich Buddhist heritage of ancient Uddiyana. Visit the 2,000-year-old Butkara Stupa, Swat Museum, and Jahanabad Buddha carvings. Then ascend to the snow-covered slopes of Malam Jabba for luxury alpine lodge lodging, private ski lessons, and zip-line adventures across pine valleys.',
      basePrice: 85000,
      currency: 'PKR',
      durationDays: 4,
      maxGuests: 6,
      meetingPoint: 'Islamabad Airport or Saidu Sharif Airport',
      inclusions: JSON.stringify([
        'Executive chauffeur-driven vehicle throughout trip',
        '3 nights in Pearl Continental Hotel Malam Jabba luxury view rooms',
        'Private archaeological historian for Gandhara sites and museum',
        'VIP chairlift and ski slope access passes with equipment rental',
        'Daily breakfast and gourmet dinner buffets'
      ]),
      exclusions: JSON.stringify(['Personal warm ski jackets (rentals available)', 'Lunches']),
      highlights: JSON.stringify([
        'Private access to ancient Buddhist monastery ruins with head archaeologist',
        'Skiing and chairlift panoramic mountain views in Malam Jabba',
        'Swati hand-woven shawl and artisan emerald gemstone bazaar tour'
      ]),
      cancellationPolicy: '100% refund up to 5 days before trip departure.',
      isFeatured: false,
      featuredPriority: 4,
      rating: 4.7,
      reviewCount: 9,
      packages: [
        { name: 'Malam Jabba Ski Executive Package', description: 'Includes 5-star mountain resort room, ski passes, and heritage tour.', price: 95000, discountedPrice: 85000, maxGuests: 4, durationDays: 4 }
      ],
      media: [
        { url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80', altText: 'Swat snowy pine peaks and heritage landscape', isCover: true, sortOrder: 0 }
      ],
      discount: null,
      reviews: []
    },

    // 8. Walled City of Lahore Mughal Royal Tour
    {
      providerId: provider4.id,
      destinationId: lahore.id,
      categoryId: catCulture.id,
      title: 'Walled City of Lahore: Shahi Qila, Badshahi Mosque & Royal Mughal Dining (3 Days)',
      slug: 'lahore-walled-city-mughal-royal-palaces',
      shortDescription: 'Walk the Royal Trail through the 13 gates of Lahore. Exclusive after-hours illumination of the Lahore Fort, Sheesh Mahal, and rooftop dining.',
      fullDescription: 'A bespoke cultural journey through the crown jewel of the Mughal Empire. Experience private VIP access to the UNESCO World Heritage Lahore Fort, the dazzling Palace of Mirrors (Sheesh Mahal), the 17th-century Badshahi Mosque, and the restored Persian Shahi Hammam. Conclude every evening with rooftop Mughal cuisine overlooking illuminated minarets.',
      basePrice: 65000,
      currency: 'PKR',
      durationDays: 3,
      maxGuests: 10,
      meetingPoint: 'Allama Iqbal International Airport VIP Lounge or luxury hotel in Lahore',
      inclusions: JSON.stringify([
        'Executive Mercedes-Benz or Toyota luxury van transport throughout Lahore',
        '2 nights in 5-star heritage luxury suites (The Nishat / Avari)',
        'Private VIP permits and curator guides for Lahore Fort, Badshahi Mosque & Shalimar Gardens',
        'All meals including Haveli rooftop royal dinner and traditional old Lahore culinary food walk',
        'Private performance of classical Sufi qawwali music'
      ]),
      exclusions: JSON.stringify(['Personal antique shopping', 'Alcohol']),
      highlights: JSON.stringify([
        'Night illumination private tour of Sheesh Mahal (Palace of Mirrors)',
        'Rooftop candlelit dinner facing the illuminated dome of Badshahi Mosque',
        'Walking the historic Royal Trail from Delhi Gate to the royal baths'
      ]),
      cancellationPolicy: 'Full refund up to 3 days before start date.',
      isFeatured: true,
      featuredPriority: 8,
      rating: 5.0,
      reviewCount: 22,
      packages: [
        { name: 'Royal Heritage Concierge Package', description: '5-star boutique suite, private vehicle, museum curator, and rooftop feasts.', price: 75000, discountedPrice: 65000, maxGuests: 6, durationDays: 3 }
      ],
      media: [
        { url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80', altText: 'Badshahi Mosque and Lahore Fort at golden hour', isCover: true, sortOrder: 0 }
      ],
      discount: { title: 'Mughal Heritage Privilege', code: 'LAHOREVIP', percentage: 10, startDate: '2026-01-01', endDate: '2026-12-31' },
      reviews: [
        { userName: 'Lord Alistair Vance', rating: 5, title: 'Incredible historical depth and cuisine', comment: 'The after-hours access to Sheesh Mahal with our private historian was remarkable. The rooftop dinner overlooking Badshahi Mosque is a memory I will cherish.', response: 'Lord Vance, it was a pleasure hosting your party in the heart of Lahore.' }
      ]
    },

    // 9. Chitral & Kalash Chilam Joshi Festival
    {
      providerId: provider1.id,
      destinationId: chitral.id,
      categoryId: catCulture.id,
      title: 'Chitral Kalash Valleys Chilam Joshi Spring Festival & Tirich Mir View (6 Days)',
      slug: 'chitral-kalash-chilam-joshi-festival-safari',
      shortDescription: 'Witness the ancient spring festival of the Kalash people in Bumburet, Rumbur, and Birir valleys with dramatic views of 7,708m Tirich Mir peak.',
      fullDescription: 'Travel over the Lowari Pass or fly directly into Chitral to experience one of the rarest living indigenous cultures on earth. Join the animist Kalash people during the joyful Chilam Joshi festival, celebrate with traditional music and dance, explore the historic Chitral Shahi Mosque and Mehtar Fort, and gaze up at the towering Hindu Kush giant, Tirich Mir.',
      basePrice: 130000,
      currency: 'PKR',
      durationDays: 6,
      maxGuests: 8,
      meetingPoint: 'Islamabad Airport or Chitral Airport',
      inclusions: JSON.stringify([
        'Private 4x4 Prado transport with experienced Hindu Kush mountain driver',
        '5 nights accommodation in boutique heritage lodges in Chitral and Kalash valleys',
        'All meals including traditional Chitrali trout and local walnut breads',
        'Official Kalash cultural festival permits and dedicated community guide',
        'Visit to Chitral Gol National Park for Markhor observation'
      ]),
      exclusions: JSON.stringify(['Personal festival purchases and donations', 'Domestic flights']),
      highlights: JSON.stringify([
        'Vibrant dance performances during the sacred Chilam Joshi spring festival',
        'Chitral Gol National Park safari with binoculars for Markhor wild goats',
        'Traditional polo match observation at the Chitral royal polo ground'
      ]),
      cancellationPolicy: 'Full refund up to 14 days before festival start date.',
      isFeatured: false,
      featuredPriority: 5,
      rating: 4.9,
      reviewCount: 14,
      packages: [
        { name: 'Festival Explorer First-Class', description: 'Full transport, festival lodge, and cultural access.', price: 145000, discountedPrice: 130000, maxGuests: 6, durationDays: 6 }
      ],
      media: [
        { url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80', altText: 'Chitral mountain valley and Kalash cultural setting', isCover: true, sortOrder: 0 }
      ],
      discount: null,
      reviews: []
    },

    // 10. Snow Leopard Winter Wildlife Tracking
    {
      providerId: provider1.id,
      destinationId: hunza.id,
      categoryId: catSafari.id,
      title: 'Snow Leopard Winter Tracking & Pamir Wildlife Conservation Safari (8 Days)',
      slug: 'snow-leopard-winter-tracking-khunjerab-pamir',
      shortDescription: 'Join elite wildlife trackers and high-altitude spotters in the Khunjerab and Shimshal mountain corridors in search of the elusive Ghost of the Mountains.',
      fullDescription: 'An exclusive winter expedition for serious wildlife photographers and nature lovers. Venture into the rugged crags of the Karakoram and Pamir ranges where snow leopards descend during winter in pursuit of Himalayan ibex and blue sheep. Equipped with high-power spotting scopes, heated cabins, thermal imaging, and local conservation trackers.',
      basePrice: 350000,
      currency: 'PKR',
      durationDays: 8,
      maxGuests: 6,
      meetingPoint: 'Gilgit Airport or Islamabad VIP Transfer',
      inclusions: JSON.stringify([
        'Dedicated 4x4 Land Cruiser with snow chains and winch equipment',
        '7 nights in heated luxury glamping yurts and boutique winter lodges',
        'Team of 3 veteran snow leopard spotters with Swarovski spotting scopes',
        'Full gourmet board with hot high-calorie meals, soups, and beverages in the field',
        'Substantial direct contribution to the local community Snow Leopard Conservation Fund'
      ]),
      exclusions: JSON.stringify(['Personal extreme cold-weather parkas (-30C rated)', 'Personal camera lenses']),
      highlights: JSON.stringify([
        'Tracking fresh snow leopard pugmarks in pristine winter snow',
        'High-probability observation of Himalayan ibex, golden eagles, and Tibetan wolves',
        'Fireside discussions with local conservation rangers and community elders'
      ]),
      cancellationPolicy: 'Strict 30-day cancellation policy due to winter logistics and tracker reservation.',
      isFeatured: true,
      featuredPriority: 10,
      rating: 5.0,
      reviewCount: 11,
      packages: [
        { name: 'Master Wildlife Photographer Suite', description: 'Includes private tracker, Swarovski scope mount, and heated personal yurt.', price: 380000, discountedPrice: 350000, maxGuests: 4, durationDays: 8 }
      ],
      media: [
        { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80', altText: 'Snow leopard high mountain winter terrain', isCover: true, sortOrder: 0 }
      ],
      discount: null,
      reviews: [
        { userName: 'Dr. Eleanor Wright', rating: 5, title: 'We saw a mother and two cubs!', comment: 'On day 4 in the Shimshal corridor, our spotter located a female snow leopard with her cubs basking on a sunlit ledge. Unbelievable precision and ethical tracking.', response: 'Dr. Wright, that sighting was truly historic. The conservation fund thanks you!' }
      ]
    }
  ];

  // Insert all listings, packages, media, discounts, and reviews
  for (const item of listingsData) {
    const listing = await prisma.listing.create({
      data: {
        providerId: item.providerId,
        destinationId: item.destinationId,
        categoryId: item.categoryId,
        title: item.title,
        slug: item.slug,
        shortDescription: item.shortDescription,
        fullDescription: item.fullDescription,
        status: 'PUBLISHED',
        basePrice: item.basePrice,
        currency: item.currency,
        durationDays: item.durationDays,
        maxGuests: item.maxGuests,
        meetingPoint: item.meetingPoint,
        inclusions: item.inclusions,
        exclusions: item.exclusions,
        highlights: item.highlights,
        cancellationPolicy: item.cancellationPolicy,
        termsAndConditions: 'All guests must abide by regional conservation charters and local cultural norms.',
        isFeatured: item.isFeatured,
        featuredPriority: item.featuredPriority,
        rating: item.rating,
        reviewCount: item.reviewCount,
        packages: {
          create: item.packages.map(p => ({
            name: p.name,
            description: p.description,
            price: p.price,
            discountedPrice: p.discountedPrice,
            maxGuests: p.maxGuests,
            durationDays: p.durationDays,
          }))
        },
        media: {
          create: item.media.map(m => ({
            url: m.url,
            altText: m.altText,
            isCover: m.isCover,
            sortOrder: m.sortOrder,
          }))
        },
        discounts: item.discount ? {
          create: [
            {
              title: item.discount.title,
              code: item.discount.code,
              percentage: item.discount.percentage,
              fixedAmount: 0,
              startDate: item.discount.startDate,
              endDate: item.discount.endDate,
              isActive: true,
            }
          ]
        } : undefined,
      }
    });

    // Add sample reviews if available with associated completed bookings
    if (item.reviews && item.reviews.length > 0) {
      let bCounter = 1;
      for (const rev of item.reviews) {
        const completedBooking = await prisma.booking.create({
          data: {
            bookingReference: `BK-REV-${listing.slug.slice(0, 10).toUpperCase()}-${bCounter++}`,
            userId: customer1.id,
            providerId: item.providerId,
            listingId: listing.id,
            startDate: '2025-09-10',
            endDate: '2025-09-17',
            guestsCount: 2,
            unitPrice: item.basePrice,
            totalPrice: item.basePrice * 2,
            discountAmount: 0,
            finalPrice: item.basePrice * 2,
            currency: item.currency,
            status: 'COMPLETED',
            customerNotes: 'Completed luxury expedition booking for verified review.',
          }
        });

        await prisma.review.create({
          data: {
            bookingId: completedBooking.id,
            userId: customer1.id,
            providerId: item.providerId,
            listingId: listing.id,
            rating: rev.rating,
            title: rev.title,
            comment: rev.comment,
            providerResponse: rev.response,
            status: 'PUBLISHED',
          }
        });
      }
    }
  }

  // Create an initial sample active booking for testing customer dashboard
  const sampleListing = await prisma.listing.findFirst({ where: { slug: 'hunza-valley-7-day-heritage-glacier-expedition' } });
  if (sampleListing) {
    const booking = await prisma.booking.create({
      data: {
        bookingReference: 'BK-2026-001',
        userId: customer1.id,
        providerId: sampleListing.providerId,
        listingId: sampleListing.id,
        startDate: '2026-06-15',
        endDate: '2026-06-21',
        guestsCount: 2,
        unitPrice: 145000,
        totalPrice: 290000,
        discountAmount: 43500,
        finalPrice: 246500,
        currency: 'PKR',
        status: 'CONFIRMED',
        customerNotes: 'VIP pickup requested at Islamabad Airport terminal with personal luggage escort.',
        providerNotes: 'Land Cruiser V8 and Serena Royal Terrace Suite locked and assigned to Guide Sherbaz.',
      }
    });

    // Add audit log for booking
    await prisma.auditLog.create({
      data: {
        actorId: customer1.id,
        actorRole: 'CUSTOMER',
        action: 'BOOKING_CREATED',
        entityType: 'Booking',
        entityId: booking.id,
        metadata: JSON.stringify({ reference: booking.bookingReference, finalPrice: booking.finalPrice }),
        ipAddress: '127.0.0.1',
      }
    });
  }

  console.log('✅ Seeding successfully completed with 10 world-class luxury expeditions across 8 destinations!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
