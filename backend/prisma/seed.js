"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seeding for Multi-Provider Marketplace...');
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
    const passwordHash = await bcryptjs_1.default.hash('Marketplace123!', 10);
    const adminPasswordHash = await bcryptjs_1.default.hash('Admin123!', 10);
    // 1. CREATE USERS
    const superAdmin = await prisma.user.create({
        data: {
            email: 'admin@marketplace.com',
            passwordHash: adminPasswordHash,
            firstName: 'Faraday',
            lastName: 'Admin',
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
    const customer1 = await prisma.user.create({
        data: {
            email: 'sarah@customer.com',
            passwordHash,
            firstName: 'Sarah',
            lastName: 'Jenkins',
            phone: '+92 312 9991122',
            role: 'CUSTOMER',
            isActive: true,
            avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
        }
    });
    const customer2 = await prisma.user.create({
        data: {
            email: 'ali@customer.com',
            passwordHash,
            firstName: 'Ali',
            lastName: 'Raza',
            phone: '+92 345 8882233',
            role: 'CUSTOMER',
            isActive: true,
            avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80'
        }
    });
    // 2. CREATE PROVIDERS
    const provider1 = await prisma.provider.create({
        data: {
            userId: providerUser1.id,
            businessName: 'Apex Mountain Expeditions',
            tradeLicenseNo: 'LIC-GB-2021-998',
            taxId: 'NTN-7389210-4',
            phone: '+92 300 1112233',
            email: 'apex@adventures.com',
            address: 'Zero Point Commercial Center, Karimabad',
            city: 'Hunza',
            country: 'Pakistan',
            bio: 'Leading high-altitude trekking, cultural overland journeys, and glacial expeditions across the Karakoram and Himalayas since 2014. Certified alpine guides and rescue-equipped.',
            logoUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=200&q=80',
            bannerUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
            verificationStatus: 'APPROVED',
            verificationNotes: 'Verified with Gilgit-Baltistan Tourism Department & FBR Tax Active.',
            verificationDocs: 'https://storage.marketplace.com/docs/apex-license.pdf',
            rating: 4.9,
            reviewCount: 42,
        }
    });
    const provider2 = await prisma.provider.create({
        data: {
            userId: providerUser2.id,
            businessName: 'Coastal & Watersports Pakistan',
            tradeLicenseNo: 'LIC-BAL-2022-441',
            taxId: 'NTN-8921043-1',
            phone: '+92 321 4445566',
            email: 'coastal@escapes.com',
            address: 'Marine Drive Coastal Hub',
            city: 'Gwadar',
            country: 'Pakistan',
            bio: 'PADI certified diving masters, luxury catamaran charters, deep-sea angling, and pristine Astola Island eco-camps.',
            logoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80',
            bannerUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80',
            verificationStatus: 'APPROVED',
            verificationNotes: 'Verified maritime commercial vessel license and maritime safety audit.',
            verificationDocs: 'https://storage.marketplace.com/docs/coastal-marine-permit.pdf',
            rating: 4.8,
            reviewCount: 28,
        }
    });
    const provider3 = await prisma.provider.create({
        data: {
            userId: providerUser3.id,
            businessName: 'Indus Eco Safari & Treks',
            tradeLicenseNo: 'LIC-KPK-2024-102',
            taxId: 'NTN-6102934-8',
            phone: '+92 333 7778899',
            email: 'safari@wildlife.com',
            address: 'Mingora Bypass Road',
            city: 'Swat',
            country: 'Pakistan',
            bio: 'Eco-conscious wildlife observation, high-altitude alpine lakes, and trout angling expeditions in Swat and Chitral valleys.',
            logoUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=200&q=80',
            bannerUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
            verificationStatus: 'PENDING',
            verificationNotes: 'Application submitted. Awaiting commercial insurance certificate check.',
            verificationDocs: 'https://storage.marketplace.com/docs/indus-pending.pdf',
            rating: 5.0,
            reviewCount: 0,
        }
    });
    // 3. CREATE DESTINATIONS
    const hunza = await prisma.destination.create({
        data: {
            name: 'Hunza Valley',
            slug: 'hunza-valley',
            country: 'Pakistan',
            region: 'Gilgit-Baltistan',
            description: 'Fabled mountain kingdom nestled beneath Rakaposhi, known for thousand-year-old forts, glacial lakes, and apricot blossoms.',
            imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
            isFeatured: true,
        }
    });
    const skardu = await prisma.destination.create({
        data: {
            name: 'Skardu & Deosai',
            slug: 'skardu-deosai',
            country: 'Pakistan',
            region: 'Gilgit-Baltistan',
            description: 'Gateway to K2 and the four eight-thousanders. Home to the world’s second highest alpine plateau and cold deserts.',
            imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
            isFeatured: true,
        }
    });
    const swat = await prisma.destination.create({
        data: {
            name: 'Swat Emerald Valley',
            slug: 'swat-valley',
            country: 'Pakistan',
            region: 'Khyber Pakhtunkhwa',
            description: 'The Switzerland of the East with lush emerald valleys, archaeological Buddhist sites, and pristine trout streams.',
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
            description: 'Dramatic Arabian Sea cliffs, white sand beaches, untouched coral reefs, and the historic Makran Coastal Highway.',
            imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
            isFeatured: true,
        }
    });
    const kumrat = await prisma.destination.create({
        data: {
            name: 'Kumrat Valley',
            slug: 'kumrat-valley',
            country: 'Pakistan',
            region: 'Khyber Pakhtunkhwa',
            description: 'Dense Deodar pine canopies, roaring Panjkora river, and the mesmerizing glacial bowl of Katora Lake.',
            imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
            isFeatured: false,
        }
    });
    // 4. CREATE CATEGORIES
    const catTrek = await prisma.category.create({
        data: {
            name: 'Mountain Trekking & Expeditions',
            slug: 'trekking-expeditions',
            description: 'Guided glacial ascents, high-altitude alpine passes, basecamp treks, and rock climbing.',
            icon: 'Mountain',
            imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
            isFeatured: true,
        }
    });
    const catCulture = await prisma.category.create({
        data: {
            name: 'Cultural & Heritage Tours',
            slug: 'cultural-heritage',
            description: 'Historic forts, ancient Silk Route settlements, local culinary immersions, and artisan workshops.',
            icon: 'Landmark',
            imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=600&q=80',
            isFeatured: true,
        }
    });
    const catWater = await prisma.category.create({
        data: {
            name: 'Coastal Escapes & Water Sports',
            slug: 'coastal-watersports',
            description: 'Scuba diving, deep sea sport fishing, island camping, and sunset catamaran cruises.',
            icon: 'Waves',
            imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
            isFeatured: true,
        }
    });
    const catSafari = await prisma.category.create({
        data: {
            name: 'Wildlife & Eco Safaris',
            slug: 'wildlife-safari',
            description: 'Himalayan brown bear spotting in Deosai, Markhor conservation trails, and bird migrations.',
            icon: 'Trees',
            imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
            isFeatured: true,
        }
    });
    const catLuxury = await prisma.category.create({
        data: {
            name: 'Luxury Glamping & Retreats',
            slug: 'luxury-glamping',
            description: 'Dome suites with panoramic glacier views, heated tents, private gourmet chefs, and wellness stays.',
            icon: 'Sparkles',
            imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=600&q=80',
            isFeatured: false,
        }
    });
    // 5. CREATE LISTINGS
    // Listing 1: Hunza Expedition
    const listingHunza = await prisma.listing.create({
        data: {
            providerId: provider1.id,
            destinationId: hunza.id,
            categoryId: catCulture.id,
            title: 'Hunza Valley 7-Day Royal Heritage & Glacier Expedition',
            slug: 'hunza-valley-7-day-heritage-glacier-expedition',
            shortDescription: 'Explore ancient Baltit & Altit forts, Attabad lake boating, Passu Cones, and Hussaini suspension bridge with 4x4 overland transport.',
            fullDescription: 'Embark on an unforgettable 7-day odyssey through the legendary Hunza valley. Enjoy premier boutique lodge accommodations, private luxury Prado transport, guided tours through 900-year-old forts, traditional Wakhi culinary masterclasses, and an exhilarating walk over the Passu suspension bridge. Complete with certified mountain guides and dedicated support team.',
            status: 'PUBLISHED',
            basePrice: 145000,
            currency: 'PKR',
            durationDays: 7,
            maxGuests: 12,
            meetingPoint: 'Islamabad International Airport (Terminal 1) or Gilgit Airport',
            inclusions: JSON.stringify([
                'Private 4x4 Prado with dedicated driver & fuel',
                '6 nights accommodation in 4-star boutique lodges',
                'All breakfasts and traditional mountain dinners',
                'Certified English & Urdu speaking cultural guide',
                'Attabad Lake private boat cruise and fort entry tickets',
                'First-aid oxygen kit & 24/7 operations room coordination'
            ]),
            exclusions: JSON.stringify([
                'Domestic or international flights',
                'Personal trekking gear and gratuities',
                'Personal travel/medical insurance'
            ]),
            highlights: JSON.stringify([
                'Sunrise view of 7,788m Rakaposhi peak',
                'Private night-time photography at Passu Cones',
                'Altit Fort royal garden apricot tasting'
            ]),
            cancellationPolicy: 'Free cancellation up to 14 days before start date. 50% refund between 7 to 14 days.',
            termsAndConditions: 'Participants must follow local environmental guidelines. No littering permitted on glacial tracks.',
            isFeatured: true,
            featuredPriority: 10,
            rating: 4.9,
            reviewCount: 38,
            packages: {
                create: [
                    {
                        name: 'Standard Twin-Sharing',
                        description: 'Twin sharing in premier view rooms, all excursions and group transport.',
                        price: 145000,
                        discountedPrice: 125000,
                        minGuests: 1,
                        maxGuests: 12,
                        durationDays: 7,
                    },
                    {
                        name: 'Deluxe Private Suite',
                        description: 'Private single executive suite with panoramic terrace and private vehicle exclusively for your party.',
                        price: 215000,
                        discountedPrice: 189000,
                        minGuests: 1,
                        maxGuests: 4,
                        durationDays: 7,
                    }
                ]
            },
            itineraryItems: {
                create: [
                    {
                        dayNumber: 1,
                        title: 'Departure Islamabad to Naran & Chilas Highlands',
                        description: 'Scenic journey via Hazara Motorway and Babusar Pass with stopovers at Lulusar Lake.',
                        mealsIncluded: 'Dinner included',
                        accommodation: 'Shangrila Chilas'
                    },
                    {
                        dayNumber: 2,
                        title: 'Junction of Three Mountain Ranges to Karimabad, Hunza',
                        description: 'Witness the convergence of Karakoram, Himalaya, and Hindu Kush. Check-in to Karimabad view resort.',
                        mealsIncluded: 'Breakfast & Dinner',
                        accommodation: 'Serena Hunza Inn'
                    },
                    {
                        dayNumber: 3,
                        title: '900-Year-Old Baltit Fort & Altit Royal Orchards',
                        description: 'Deep dive into ancient Mir of Hunza history and traditional music performance.',
                        mealsIncluded: 'Breakfast & Dinner',
                        accommodation: 'Serena Hunza Inn'
                    },
                    {
                        dayNumber: 4,
                        title: 'Attabad Lake Boating & Passu Cones Cathedral Peaks',
                        description: 'Jet boat across the turquoise Attabad lake and hike towards Passu Glacier snout.',
                        mealsIncluded: 'Breakfast & Dinner',
                        accommodation: 'Passu Ambassador Hotel'
                    },
                    {
                        dayNumber: 5,
                        title: 'Khunjerab Pass — World’s Highest Paved Border',
                        description: 'Overland safari to 4,693 meters altitude at the Pakistan-China border pass.',
                        mealsIncluded: 'Breakfast & Dinner',
                        accommodation: 'Karimabad Lodge'
                    },
                    {
                        dayNumber: 6,
                        title: 'Return scenic drive through Gilgit and Babusar',
                        description: 'Explore Gilgit historic suspension bridge and return to mountain valley lodge.',
                        mealsIncluded: 'Breakfast & Dinner',
                        accommodation: 'Pine Park Hotel'
                    },
                    {
                        dayNumber: 7,
                        title: 'Final scenic leg to Islamabad',
                        description: 'Arrive safely in Islamabad by evening with transfer to airport or hotel.',
                        mealsIncluded: 'Breakfast included',
                        accommodation: 'Departure'
                    }
                ]
            },
            media: {
                create: [
                    {
                        url: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
                        altText: 'Hunza Valley Baltit Fort and mountain peak',
                        isCover: true,
                        sortOrder: 0,
                    },
                    {
                        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
                        altText: 'Passu Cones Golden Hour',
                        isCover: false,
                        sortOrder: 1,
                    },
                    {
                        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
                        altText: 'Attabad Lake turquoise waters',
                        isCover: false,
                        sortOrder: 2,
                    }
                ]
            },
            discounts: {
                create: [
                    {
                        title: 'Autumn Golden Season 15% Off',
                        code: 'AUTUMN15',
                        percentage: 15,
                        fixedAmount: 0,
                        startDate: '2026-09-01',
                        endDate: '2026-11-30',
                        isActive: true,
                    }
                ]
            }
        }
    });
    // Listing 2: Skardu & Deosai Safari
    const listingSkardu = await prisma.listing.create({
        data: {
            providerId: provider1.id,
            destinationId: skardu.id,
            categoryId: catSafari.id,
            title: 'Skardu & Deosai Plains Land Cruiser Safari (6 Days)',
            slug: 'skardu-deosai-plains-land-cruiser-safari',
            shortDescription: 'Witness Shangrila Resort, Katpana cold desert, Sheosar Lake, and Himalayan brown bears in Deosai National Park.',
            fullDescription: 'The ultimate overland journey into the heart of Baltistan. Venture across the Deosai plateau at 4,000m, stargaze in the high altitude Katpana cold desert, and marvel at the reflection of snowy summits in Lower Kachura Lake.',
            status: 'PUBLISHED',
            basePrice: 160000,
            currency: 'PKR',
            durationDays: 6,
            maxGuests: 10,
            meetingPoint: 'Skardu Airport or Islamabad Pick-up',
            inclusions: JSON.stringify([
                'Toyota Land Cruiser (70 Series) 4x4 throughout expedition',
                '5 nights premium hotel stays',
                'Full board meals (Breakfast, lunch picnic, dinner)',
                'Deosai National park entry fees & wildlife guide',
                'Cold desert ATV pass'
            ]),
            exclusions: JSON.stringify(['Personal cold weather gear', 'Tips']),
            highlights: JSON.stringify(['Sheosar lake reflection', 'Katpana dunes sunset', 'Shigar Fort walk']),
            cancellationPolicy: 'Full refund 10 days prior to trip start.',
            termsAndConditions: 'High altitude briefing required prior to departure.',
            isFeatured: true,
            featuredPriority: 9,
            rating: 4.8,
            reviewCount: 24,
            packages: {
                create: [
                    {
                        name: 'All-Inclusive Explorer',
                        description: 'Full transport, accommodation, meals and entrance tickets.',
                        price: 160000,
                        discountedPrice: 145000,
                        minGuests: 2,
                        maxGuests: 10,
                        durationDays: 6,
                    }
                ]
            },
            itineraryItems: {
                create: [
                    {
                        dayNumber: 1,
                        title: 'Arrival in Skardu & Shangrila Kachura Resort',
                        description: 'Check into waterfront resort and explore the historic aircraft converted hotel.',
                        mealsIncluded: 'Dinner included',
                        accommodation: 'Shangrila Resort Skardu'
                    },
                    {
                        dayNumber: 2,
                        title: 'Katpana Cold Desert & Sarfaranga Dunes',
                        description: 'Desert 4x4 drive surrounded by snowcapped Karakoram peaks.',
                        mealsIncluded: 'All meals',
                        accommodation: 'Shigar Heritage Fort'
                    },
                    {
                        dayNumber: 3,
                        title: 'Deosai National Park & Sheosar Lake',
                        description: 'Ascend to the Roof of the World. Wildlife spotting and picnic by Sheosar lake.',
                        mealsIncluded: 'All meals & packed lunch',
                        accommodation: 'Glamping camp or Skardu city'
                    }
                ]
            },
            media: {
                create: [
                    {
                        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
                        altText: 'Deosai Plains alpine flowers and lake',
                        isCover: true,
                        sortOrder: 0,
                    },
                    {
                        url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
                        altText: 'Skardu mountain landscape',
                        isCover: false,
                        sortOrder: 1,
                    }
                ]
            }
        }
    });
    // Listing 3: Gwadar & Astola Coastal Diving
    const listingGwadar = await prisma.listing.create({
        data: {
            providerId: provider2.id,
            destinationId: gwadar.id,
            categoryId: catWater.id,
            title: 'Astola Island Coral Scuba Diving & Gwadar Marine Charter',
            slug: 'astola-island-scuba-diving-gwadar-charter',
            shortDescription: 'Discover the Island of the Seven Hills with crystal clear coral reefs, scuba diving, and private beachfront camps.',
            fullDescription: 'Sail from Pasni harbor to Pakistan’s largest offshore island, Astola. Renowned for turquoise visibility up to 20 meters, pristine coral reefs, green turtles, and untouched sea caves. Includes PADI certified instructors and underwater photography.',
            status: 'PUBLISHED',
            basePrice: 95000,
            currency: 'PKR',
            durationDays: 4,
            maxGuests: 8,
            meetingPoint: 'Gwadar International Airport or Pasni Jetty',
            inclusions: JSON.stringify([
                'Private twin-engine boat charter with certified skipper',
                '2 full scuba dives with PADI master and complete gear',
                'Eco-camping luxury dome tents on Astola island',
                'Fresh seafood catch BBQ every evening',
                'Underwater 4K video reel package'
            ]),
            exclusions: JSON.stringify(['Personal wetsuit (rentals available)', 'Flights to Gwadar']),
            highlights: JSON.stringify(['Coral reef dive', 'Dolphin pod sailing', 'Bioluminescent night waters']),
            cancellationPolicy: 'Weather dependent. Full reschedule or 100% refund if sea advisory issued.',
            termsAndConditions: 'Medical self-declaration for scuba diving required.',
            isFeatured: true,
            featuredPriority: 8,
            rating: 4.9,
            reviewCount: 19,
            packages: {
                create: [
                    {
                        name: 'PADI Certified Diver Package',
                        description: 'Includes 4 guided dives, equipment, and Astola camp.',
                        price: 95000,
                        discountedPrice: 85000,
                        minGuests: 1,
                        maxGuests: 8,
                        durationDays: 4,
                    }
                ]
            },
            itineraryItems: {
                create: [
                    {
                        dayNumber: 1,
                        title: 'Gwadar Marina & Sunset Cliff Cruise',
                        description: 'Arrival, equipment sizing, safety briefing, and sunset cruise along the Hammerhead cliffs.',
                        mealsIncluded: 'Dinner included',
                        accommodation: 'Zaver Pearl Continental Gwadar'
                    },
                    {
                        dayNumber: 2,
                        title: 'Charter to Astola Island & First Reef Dive',
                        description: 'Early morning 3-hour sea voyage. Check-in to island camp and first afternoon dive.',
                        mealsIncluded: 'All meals included',
                        accommodation: 'Astola Island Eco-Camp'
                    },
                    {
                        dayNumber: 3,
                        title: 'Deep Coral Wall Dive & Sea Turtle Bay',
                        description: 'Two morning dives exploring underwater volcanic formations and green turtle feeding bays.',
                        mealsIncluded: 'All meals included',
                        accommodation: 'Astola Island Eco-Camp'
                    },
                    {
                        dayNumber: 4,
                        title: 'Return to Mainland & Airport Transfer',
                        description: 'Return cruise to Pasni port and private escort to Gwadar Airport.',
                        mealsIncluded: 'Breakfast included',
                        accommodation: 'Departure'
                    }
                ]
            },
            media: {
                create: [
                    {
                        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
                        altText: 'Astola turquoise waters and shoreline',
                        isCover: true,
                        sortOrder: 0,
                    },
                    {
                        url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80',
                        altText: 'Coastal cliffs and ocean sunset',
                        isCover: false,
                        sortOrder: 1,
                    }
                ]
            }
        }
    });
    // Listing 4: Swat Valley Heritage Trail (Pending Approval state to test Admin Moderation!)
    const listingSwat = await prisma.listing.create({
        data: {
            providerId: provider1.id,
            destinationId: swat.id,
            categoryId: catCulture.id,
            title: 'Swat Valley Royal Buddhist Monasteries & White Palace Tour',
            slug: 'swat-valley-royal-buddhist-monasteries-white-palace',
            shortDescription: 'Travel through the ancient kingdom of Udyana with visits to White Palace Marghazar, Butkara stupa, and trout valleys.',
            fullDescription: 'Immerse yourself in centuries of Gandhara civilization, pristine river gorges, and royal summer retreats.',
            status: 'PENDING_APPROVAL',
            basePrice: 65000,
            currency: 'PKR',
            durationDays: 3,
            maxGuests: 15,
            meetingPoint: 'Islamabad Motorway Interchange',
            inclusions: JSON.stringify(['AC Executive Coaster', 'Boutique hotel', 'Museum entry', 'Breakfast & Lunch']),
            exclusions: JSON.stringify(['Dinner', 'Tips']),
            highlights: JSON.stringify(['White Palace architecture', 'Gandhara art museum']),
            cancellationPolicy: 'Moderate policy: 7 days notice required.',
            rating: 5.0,
            reviewCount: 0,
            packages: {
                create: [
                    {
                        name: 'Weekend Getaway',
                        price: 65000,
                        durationDays: 3,
                    }
                ]
            },
            media: {
                create: [
                    {
                        url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
                        altText: 'Swat Valley river and pine peaks',
                        isCover: true,
                        sortOrder: 0,
                    }
                ]
            }
        }
    });
    // 6. CREATE SAMPLE BOOKINGS & MESSAGES
    // Completed booking with Review
    const bookingCompleted = await prisma.booking.create({
        data: {
            bookingReference: 'BK-2026-104921',
            userId: customer1.id,
            providerId: provider1.id,
            listingId: listingHunza.id,
            startDate: '2026-08-10',
            endDate: '2026-08-17',
            guestsCount: 2,
            unitPrice: 125000,
            totalPrice: 250000,
            discountAmount: 25000,
            finalPrice: 225000,
            currency: 'PKR',
            status: 'COMPLETED',
            customerNotes: 'Celebrating 5th anniversary. Would appreciate a quiet room with peak views.',
            providerNotes: 'Arranged top floor terrace suite at Serena Hunza.',
            items: {
                create: [
                    {
                        description: 'Hunza Valley 7-Day Royal Heritage (2 guests)',
                        quantity: 2,
                        unitPrice: 125000,
                        totalPrice: 250000,
                    }
                ]
            },
            transactions: {
                create: [
                    {
                        transactionReference: 'TXN-984210',
                        amount: 225000,
                        currency: 'PKR',
                        status: 'COMPLETED',
                        paymentMethod: 'BANK_TRANSFER'
                    }
                ]
            }
        }
    });
    // Create review for the completed booking
    await prisma.review.create({
        data: {
            bookingId: bookingCompleted.id,
            userId: customer1.id,
            providerId: provider1.id,
            listingId: listingHunza.id,
            rating: 5,
            title: 'Exceptional service and unforgettable Karakoram views!',
            comment: 'Apex Expeditions delivered beyond our highest expectations. Our driver and guide Kamran made sure every stop was seamless. The sunrise over Rakaposhi from our balcony was life-changing. Highly recommend to anyone seeking verified professional travel!',
            status: 'PUBLISHED',
            providerResponse: 'Thank you Sarah! It was our utmost pleasure hosting you and your husband. Looking forward to your next Karakoram journey.'
        }
    });
    // Pending Booking Request from Ali Raza
    const bookingPending = await prisma.booking.create({
        data: {
            bookingReference: 'BK-2026-772910',
            userId: customer2.id,
            providerId: provider2.id,
            listingId: listingGwadar.id,
            startDate: '2026-11-15',
            endDate: '2026-11-19',
            guestsCount: 4,
            unitPrice: 85000,
            totalPrice: 340000,
            discountAmount: 20000,
            finalPrice: 320000,
            currency: 'PKR',
            status: 'PENDING',
            customerNotes: 'Group of 4 certified advanced open water divers. Can we arrange night dive on Astola?',
            items: {
                create: [
                    {
                        description: 'Astola Island Scuba Charter (4 guests)',
                        quantity: 4,
                        unitPrice: 85000,
                        totalPrice: 340000,
                    }
                ]
            }
        }
    });
    // Add conversation message thread
    await prisma.message.create({
        data: {
            bookingId: bookingPending.id,
            senderId: customer2.id,
            receiverId: providerUser2.id,
            message: 'Hello Zainab! We are 4 divers looking forward to Astola. Is night diving permitted if sea conditions are calm?',
        }
    });
    await prisma.message.create({
        data: {
            bookingId: bookingPending.id,
            senderId: providerUser2.id,
            receiverId: customer2.id,
            message: 'Welcome Ali! Yes, Astola has phenomenal bioluminescence on calm November evenings. We will equip your team with high-power dive torches.',
        }
    });
    // Confirmed booking
    await prisma.booking.create({
        data: {
            bookingReference: 'BK-2026-881230',
            userId: customer1.id,
            providerId: provider1.id,
            listingId: listingSkardu.id,
            startDate: '2026-12-01',
            endDate: '2026-12-07',
            guestsCount: 2,
            unitPrice: 145000,
            totalPrice: 290000,
            discountAmount: 0,
            finalPrice: 290000,
            currency: 'PKR',
            status: 'CONFIRMED',
            customerNotes: 'Need airport pickup from Skardu.',
            providerNotes: 'Confirmed driver assignment and Katpana tent booking.',
        }
    });
    // 7. CREATE CMS BANNERS
    await prisma.cMSBanner.create({
        data: {
            title: 'Discover Extraordinary Destinations with Verified Providers',
            subtitle: 'Compare transparent pricing, verified customer reviews, and submit custom requests directly to licensed operators.',
            tag: 'PREMIER EXPEDITIONS 2026',
            imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
            linkUrl: '/search',
            position: 'HOMEPAGE_HERO',
            isActive: true,
            sortOrder: 1,
        }
    });
    await prisma.cMSBanner.create({
        data: {
            title: 'Early Autumn Expeditions in Northern Pakistan',
            subtitle: 'Save up to 15% on curated mountain journeys across Hunza and Skardu.',
            tag: 'LIMITED SPECIALS',
            imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1600&q=80',
            linkUrl: '/search?hasDiscount=true',
            position: 'PROMO_SECTION',
            isActive: true,
            sortOrder: 2,
        }
    });
    // 8. AUDIT LOGS FOR DEMO
    await prisma.auditLog.create({
        data: {
            actorId: superAdmin.id,
            actorRole: 'SUPER_ADMIN',
            action: 'SYSTEM_INITIALIZED',
            entityType: 'Platform',
            entityId: 'ROOT',
            metadata: JSON.stringify({ version: '1.0.0', env: 'production_ready' }),
        }
    });
    await prisma.auditLog.create({
        data: {
            actorId: opsAdmin.id,
            actorRole: 'OPERATIONS_ADMIN',
            action: 'PROVIDER_APPROVED',
            entityType: 'Provider',
            entityId: provider1.id,
            metadata: JSON.stringify({ businessName: provider1.businessName, verifiedBy: opsAdmin.email }),
        }
    });
    console.log('✅ Database successfully seeded with full multi-provider marketplace data!');
    console.log('-----------------------------------------------------------------------');
    console.log('Credentials:');
    console.log('Super Admin: admin@marketplace.com / Admin123!');
    console.log('Operations Admin: ops@marketplace.com / Admin123!');
    console.log('Verified Provider 1: apex@adventures.com / Marketplace123!');
    console.log('Verified Provider 2: coastal@escapes.com / Marketplace123!');
    console.log('Pending Provider 3: safari@wildlife.com / Marketplace123!');
    console.log('Customer 1: sarah@customer.com / Marketplace123!');
    console.log('Customer 2: ali@customer.com / Marketplace123!');
    console.log('-----------------------------------------------------------------------');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
