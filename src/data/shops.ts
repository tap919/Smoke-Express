import { Shop, TriangleCity } from '../types';

export const TRIANGLE_MAP_CITIES: { name: TriangleCity; x: number; y: number; description: string }[] = [
  { name: 'Chapel Hill', x: 15, y: 35, description: 'Franklin St, UNC' },
  { name: 'Durham', x: 35, y: 15, description: 'Downtown Bull City, Duke' },
  { name: 'Raleigh', x: 80, y: 60, description: 'Downtown, Glenwood & NC State' },
  { name: 'Cary', x: 52, y: 68, description: 'Kildaire Farm, Waverly Place' },
  { name: 'Apex', x: 44, y: 80, description: 'Historic Downtown Apex' }
];

export const MAP_INTERSECTIONS = {
  RDU: { x: 52, y: 38, label: 'RDU Intl Airport' },
  RTP: { x: 48, y: 40, label: 'Research Triangle Park' },
  WadeAve: { x: 70, y: 55, label: 'I-40 / Wade Ave' },
  Hwy147: { x: 40, y: 25, label: 'NC-147 / I-40' }
};

export const MOCK_SHOPS: Shop[] = [
  {
    id: 'shop_1',
    name: 'Capital Vapor, Smoke & Cigar',
    address: '3203 Hillsborough St, Raleigh, NC 27607',
    city: 'Raleigh',
    rating: 4.8,
    reviewsCount: 312,
    deliveryTime: '20-30 min',
    deliveryFee: 3.99,
    minOrder: 15.0,
    imageUrl: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=600',
    featured: true,
    coords: { x: 78, y: 58, label: 'Capital Smoke' },
    products: [
      {
        id: 'p1_1',
        name: 'RAW Classic 1 1/4 Rolling Papers',
        description: 'RAW Classic natural unrefined rolling papers, 1 1/4 size. 50 leaves per pack.',
        price: 2.49,
        imageUrl: '📜',
        category: 'Papers & Rolling',
        rating: 4.9,
        reviewsCount: 154,
        inStock: true
      },
      {
        id: 'p1_2',
        name: 'RAW Organic Hemp Metal Tray',
        description: 'Sturdy, food-grade metal tray featuring the limited RAW Organic look. Perfect 11" x 7" size.',
        price: 14.99,
        imageUrl: '📥',
        category: 'Accessories',
        rating: 4.7,
        reviewsCount: 42,
        inStock: true
      },
      {
        id: 'p1_3',
        name: 'Breeze Pro Vape (Cherry Lemon)',
        description: 'Premium vape device with crisp cherry & lemon flavors. 6ml capacity, 5% nicotine.',
        price: 19.99,
        imageUrl: '💨',
        category: 'Vapes',
        rating: 4.6,
        reviewsCount: 220,
        inStock: true
      },
      {
        id: 'p1_4',
        name: 'Geek Bar Pulse 15000 (Melon Berry)',
        description: 'Dual mesh coil, full screens display. Regular mode (15k puffs) or Pulse mode (7.5k puffs). 5% salt nicotine.',
        price: 22.99,
        imageUrl: '⚡',
        category: 'Vapes',
        rating: 4.9,
        reviewsCount: 405,
        inStock: true
      },
      {
        id: 'p1_5',
        name: 'Aerospaced 4-Piece Grinder (2.0")',
        description: 'CNC aircraft-grade aluminum. Clean anodized satin finish with razor sharp teeth & pollen sifter catcher.',
        price: 29.99,
        imageUrl: '⚙️',
        category: 'Accessories',
        rating: 4.8,
        reviewsCount: 88,
        inStock: true
      },
      {
        id: 'p1_6',
        name: 'Northern Lights Premium Flower (3.5g)',
        description: 'Curated organic, laboratory-tested hemp flower. Deep pine and earthy profiles for maximum nighttime relaxation.',
        price: 34.90,
        imageUrl: '🌸',
        category: 'Flower',
        rating: 4.9,
        reviewsCount: 142,
        inStock: true
      },
      {
        id: 'p1_7',
        name: 'Northside Reserve Pre-Rolls (2-Pack)',
        description: 'Indica-leaning pre-rolls wrapped in organic slow-burning hemp paper. 1g each, child-resistant casing.',
        price: 12.99,
        imageUrl: '🌱',
        category: 'Pre-rolls',
        rating: 4.7,
        reviewsCount: 56,
        inStock: true
      },
      {
        id: 'p1_8',
        name: 'Maduro Reserve Robusto Cigar',
        description: 'Expertly aged oily Nicaraguan Maduro tobacco wrapper. Medium-to-full body with rich dark cacao and leather notes.',
        price: 12.50,
        imageUrl: '🚬',
        category: 'Cigars',
        rating: 4.8,
        reviewsCount: 64,
        inStock: true
      }
    ]
  },
  {
    id: 'shop_2',
    name: 'Bull City Smoke, Glass & Flower',
    address: '714 Ninth St, Durham, NC 27705',
    city: 'Durham',
    rating: 4.9,
    reviewsCount: 198,
    deliveryTime: '25-35 min',
    deliveryFee: 4.99,
    minOrder: 20.0,
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=600',
    featured: true,
    coords: { x: 33, y: 17, label: 'Bull City Glass' },
    products: [
      {
        id: 'p2_1',
        name: 'Raleigh Artisanal Spoon Pipe',
        description: 'Sturdy, thick American scientific borosilicate glass. Dual colored ring swirls with a solid flat kickstand.',
        price: 34.99,
        imageUrl: '🧪',
        category: 'Glass & Pipes',
        rating: 4.9,
        reviewsCount: 74,
        inStock: true
      },
      {
        id: 'p2_2',
        name: 'Lost Mary MO5000 Vape (Grape Jelly)',
        description: 'Ergonomic soft-touch shell. 1.2ohm mesh coil, 13.5ml capacity. Unmatched depth of sweet grape jelly flavor.',
        price: 18.99,
        imageUrl: '💭',
        category: 'Vapes',
        rating: 4.7,
        reviewsCount: 112,
        inStock: true
      },
      {
        id: 'p2_3',
        name: 'Sour Diesel Sativa Bud (3.5g)',
        description: 'High-terpene indoor sativa flower. Invigorating citrus-diesel notes, ideal for clarity and focused daytime creativity.',
        price: 38.00,
        imageUrl: '💚',
        category: 'Flower',
        rating: 4.8,
        reviewsCount: 95,
        inStock: true
      },
      {
        id: 'p2_4',
        name: 'Vessel Vista Series Vape Battery',
        description: 'Ultra-premium 510 thread oil cartridge battery. Protected design, magnetic charging, 3 power tunes.',
        price: 45.0,
        imageUrl: '🔋',
        category: 'Vapes',
        rating: 4.9,
        reviewsCount: 39,
        inStock: true
      },
      {
        id: 'p2_5',
        name: 'Formula 420 Glass Cleaner (12oz)',
        description: 'Instant structural clean. Non-toxic, biodegradable formula with abrasive crystals for instant glass sparkle.',
        price: 8.99,
        imageUrl: '🧴',
        category: 'Accessories',
        rating: 4.8,
        reviewsCount: 145,
        inStock: true
      },
      {
        id: 'p2_6',
        name: 'Bull City Broadleaf Pre-Roll',
        description: 'Ninth Street special. Premium ground flower wrapped in dark Broadleaf wrapper. 1.5g total weight.',
        price: 10.99,
        imageUrl: '🌾',
        category: 'Pre-rolls',
        rating: 4.7,
        reviewsCount: 32,
        inStock: true
      }
    ]
  },
  {
    id: 'shop_3',
    name: 'Franklin Street Shisha & Cigar Co.',
    address: '143 E Franklin St, Chapel Hill, NC 27514',
    city: 'Chapel Hill',
    rating: 4.6,
    reviewsCount: 134,
    deliveryTime: '25-40 min',
    deliveryFee: 5.99,
    minOrder: 15.0,
    imageUrl: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&q=80&w=600',
    featured: false,
    coords: { x: 14, y: 34, label: 'Franklin Shisha' },
    products: [
      {
        id: 'p3_1',
        name: 'Northside Reserve Habano Cigar',
        description: 'Medium-to-full body classic Cuban-seed Habano wrapper cigar. Notes of cedar, sweet cream, and subtle baking spice.',
        price: 14.00,
        imageUrl: '🍂',
        category: 'Cigars',
        rating: 4.9,
        reviewsCount: 89,
        inStock: true
      },
      {
        id: 'p3_2',
        name: 'Cocourth Coconut Charcoal (120ct)',
        description: 'Premium odorless, clean-burning natural coconut coal block. Zero sparks, minimal ash, lasts 60m+.',
        price: 17.99,
        imageUrl: '⬛',
        category: 'Accessories',
        rating: 4.7,
        reviewsCount: 52,
        inStock: true
      },
      {
        id: 'p3_3',
        name: 'MYA Tabletop Hookah System',
        description: 'Compact 8-inch high durable solid chrome hookah. Includes base, hose, ceramic bowl, and solid cage protector.',
        price: 49.99,
        imageUrl: '💨',
        category: 'Glass & Pipes',
        rating: 4.5,
        reviewsCount: 34,
        inStock: true
      },
      {
        id: 'p3_4',
        name: 'Elements Premium Rice Papers 1 1/4',
        description: 'Slow burning thin rice papers. Made from natural rice, burns clean with zero ash. 50 leaves per pack.',
        price: 2.19,
        imageUrl: '🍁',
        category: 'Papers & Rolling',
        rating: 4.6,
        reviewsCount: 41,
        inStock: true
      },
      {
        id: 'p3_5',
        name: 'Franklin Street OG Kush Pre-Rolls (3-Pack)',
        description: 'Fresh regional terpene-rich organic hemp pre-rolls with sweet forest aroma. Beautiful slow burn.',
        price: 15.99,
        imageUrl: '🌱',
        category: 'Pre-rolls',
        rating: 4.8,
        reviewsCount: 78,
        inStock: true
      }
    ]
  },
  {
    id: 'shop_4',
    name: 'Cary Oasis Flower & Vape Hub',
    address: '103 Waverly Place Dr, Cary, NC 27518',
    city: 'Cary',
    rating: 4.7,
    reviewsCount: 110,
    deliveryTime: '15-25 min',
    deliveryFee: 2.99,
    minOrder: 10.0,
    imageUrl: 'https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?auto=format&fit=crop&q=80&w=600',
    featured: false,
    coords: { x: 52, y: 65, label: 'Cary Oasis' },
    products: [
      {
        id: 'p4_1',
        name: 'Blue Dream Hybrid Flower (3.5g)',
        description: 'Balanced sweet berry aroma hybrid flower. Fosters a relaxed, creative, and uplifting clear-headed experience.',
        price: 34.99,
        imageUrl: '🫐',
        category: 'Flower',
        rating: 4.8,
        reviewsCount: 68,
        inStock: true
      },
      {
        id: 'p4_2',
        name: 'Kush Midnight Sleep Pre-Rolls (5-Pack)',
        description: 'Infused with therapeutic CBN and organic floral lavender terpenes for a relaxing, smoke-smooth evening ritual.',
        price: 24.99,
        imageUrl: '🌙',
        category: 'Pre-rolls',
        rating: 4.7,
        reviewsCount: 23,
        inStock: true
      },
      {
        id: 'p4_3',
        name: 'Yocan Uni Pro 2.0 Vape Battery',
        description: 'Universal adjustable cartridge battery with digital OLED screen, sliding heights, and heavy zinc protective alloy case.',
        price: 32.99,
        imageUrl: '⚙️',
        category: 'Vapes',
        rating: 4.9,
        reviewsCount: 81,
        inStock: true
      },
      {
        id: 'p4_4',
        name: 'BONG DECAL Multi-Pack Rolling Box',
        description: 'Auto-rolling box with adjustable canvas tension. Includes mini grinder and high-grade filters.',
        price: 11.99,
        imageUrl: '📦',
        category: 'Accessories',
        rating: 4.4,
        reviewsCount: 19,
        inStock: true
      }
    ]
  },
  {
    id: 'shop_5',
    name: 'Northside Tobacco, Pipe & Glass',
    address: '4112 Glenwood Ave, Raleigh, NC 27612',
    city: 'Raleigh',
    rating: 4.5,
    reviewsCount: 88,
    deliveryTime: '25-35 min',
    deliveryFee: 3.99,
    minOrder: 15.0,
    coords: { x: 82, y: 50, label: 'Triangle Tobacco' },
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
    featured: false,
    products: [
      {
        id: 'p5_1',
        name: 'RAW Cones Classic King Size (3-Pack)',
        description: 'Convenient pre-rolled papers. RAW watermark prevents canoeing and burns slow and clean. Simply fill & enjoy.',
        price: 3.99,
        imageUrl: '📐',
        category: 'Papers & Rolling',
        rating: 4.8,
        reviewsCount: 215,
        inStock: true
      },
      {
        id: 'p5_2',
        name: 'Smok Buddy Personal Air Filter (Blue)',
        description: 'Handy active-carbon filter. Breath in smoke and blow clean odorless air out the exit. Highly compact.',
        price: 16.0,
        imageUrl: '🧯',
        category: 'Accessories',
        rating: 4.6,
        reviewsCount: 94,
        inStock: true
      },
      {
        id: 'p5_3',
        name: 'Hefty Beaker Water Pipe 10"',
        description: 'Heavy 9mm borosilicate glass beaker. Features built-in 3-pinch ice catcher, removable downstem & 14mm dry bowl.',
        price: 59.99,
        imageUrl: '⚗️',
        category: 'Glass & Pipes',
        rating: 4.7,
        reviewsCount: 41,
        inStock: true
      },
      {
        id: 'p5_4',
        name: 'Breeze Pro Vape (Fuji Apple Mint)',
        description: 'Refreshing sweet Fuji apple paired with a crisp, icy menthol finish. Pocket-sized, pre-filled with 2000 puffs.',
        price: 19.99,
        imageUrl: '❄️',
        category: 'Vapes',
        rating: 4.5,
        reviewsCount: 162,
        inStock: true
      },
      {
        id: 'p5_5',
        name: 'Connecticut Shade Toro Cigar',
        description: 'Silky, golden-brown Connecticut Shade wrappers cigar. Mild-to-medium flavor profile featuring smooth butter and toasted almond notes.',
        price: 9.49,
        imageUrl: '🥖',
        category: 'Cigars',
        rating: 4.6,
        reviewsCount: 38,
        inStock: true
      }
    ]
  },
  {
    id: 'shop_6',
    name: 'Franklin Glass & Premium Smoke',
    address: '221 Franklin St, Chapel Hill, NC 27516',
    city: 'Chapel Hill',
    rating: 4.9,
    reviewsCount: 142,
    deliveryTime: '20-30 min',
    deliveryFee: 4.99,
    minOrder: 15.0,
    coords: { x: 18, y: 38, label: 'Franklin Glass Art' },
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
    featured: true,
    products: [
      {
        id: 'p6_1',
        name: 'Bubbler Art Glass Rig (Tarheel Edition)',
        description: 'Heavy hand-blown North Carolina blue colored glass bubbler with dynamic showerhead percolator.',
        price: 79.99,
        imageUrl: '🍯',
        category: 'Glass & Pipes',
        rating: 5.0,
        reviewsCount: 31,
        inStock: true
      },
      {
        id: 'p6_2',
        name: 'Organic Hemp Premium Wraps (Mango)',
        description: 'Pack of 2 completely nicotine-free, tobacco-free unrefined organic hemp rolling wraps. Sweet mango flavour.',
        price: 2.99,
        imageUrl: '🥭',
        category: 'Papers & Rolling',
        rating: 4.7,
        reviewsCount: 78,
        inStock: true
      },
      {
        id: 'p6_3',
        name: 'Puffco Plus Portable Vape Pen',
        description: 'Award-winning master electronic concentrate vape. Coil-less ceramic chamber, built-in dart applicator.',
        price: 89.99,
        imageUrl: '🖊️',
        category: 'Vapes',
        rating: 4.8,
        reviewsCount: 22,
        inStock: true
      },
      {
        id: 'p6_4',
        name: 'Super Lemon Haze Infused Pre-Roll',
        description: 'Top-shelf local flower pre-roll painted with pure organic distillate oil and dusted generously in delta-9 pollen kief.',
        price: 18.99,
        imageUrl: '🍋',
        category: 'Pre-rolls',
        rating: 4.9,
        reviewsCount: 52,
        inStock: true
      },
      {
        id: 'p6_5',
        name: 'White Runtz Gelato Indica Bud (3.5g)',
        description: 'Incredibly aromatic and frosty indica bud. Heavy notes of sweet candy, citrus rind, and creamy resin. Ultimate serenity.',
        price: 36.50,
        imageUrl: '🍇',
        category: 'Flower',
        rating: 4.9,
        reviewsCount: 65,
        inStock: true
      }
    ]
  }
];

export const MOCK_DRIVERS = [
  { id: 'driver_1', name: 'Tyler', vehicle: 'Toyota Prius (Silver)', rating: 4.9, phone: '(919) 555-0192', coords: { x: 60, y: 55 } },
  { id: 'driver_2', name: 'Marcus', vehicle: 'Dodge Charger (Black)', rating: 4.7, phone: '(919) 555-0143', coords: { x: 45, y: 30 } },
  { id: 'driver_3', name: 'Jackson', vehicle: 'Moped Scooter (Yellow)', rating: 4.8, phone: '(919) 555-0177', coords: { x: 25, y: 30 } },
  { id: 'driver_4', name: 'Sarah', vehicle: 'Tesla Model 3 (White)', rating: 4.95, phone: '(919) 555-0121', coords: { x: 75, y: 48 } }
];
