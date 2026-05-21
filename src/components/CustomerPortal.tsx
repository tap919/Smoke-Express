import React, { useState } from 'react';
import { Shop, Product, CartItem, Order, TriangleCity } from '../types';
import { MOCK_SHOPS } from '../data/shops';
import { ShoppingCart, Star, MapPin, Search, X, Plus, Minus, ArrowRight, ShieldCheck, Sparkles, Crown, Percent, Lock, Unlock, Gift, Check } from 'lucide-react';

interface CustomerPortalProps {
  cart: CartItem[];
  shops?: Shop[];
  isMember: boolean;
  onToggleMembership: () => void;
  memberSavings: number;
  onAddToCart: (product: Product, shopId: string, shopName: string, shopAddress: string, shopCoords: { x: number; y: number }) => void;
  onUpdateCartQty: (productId: string, quantity: number) => void;
  onClearCart: () => void;
  onPlaceOrder: (customer: { name: string; phone: string; address: string; city: TriangleCity; coords: { x: number; y: number }; tip: number }) => void;
  activeOrder: Order | null;
}

const LOCAL_PRESET_ADDRESSES = [
  { label: 'NC State Campus (Hillsborough St)', city: 'Raleigh' as TriangleCity, address: '2512 Hillsborough St, Raleigh, NC 27607', coords: { x: 74, y: 61 } },
  { label: 'Duke West Campus Dorms (Science Dr)', city: 'Durham' as TriangleCity, address: 'Science Dr, Durham, NC 27708', coords: { x: 31, y: 19 } },
  { label: 'UNC Chapel Hill Dorms (Franklin St)', city: 'Chapel Hill' as TriangleCity, address: 'Connor Hall, 180 Raleigh Rd, Chapel Hill, NC 27514', coords: { x: 17, y: 36 } },
  { label: 'Waverly Place Residences', city: 'Cary' as TriangleCity, address: '302 Colton Pond Rd, Cary, NC 27518', coords: { x: 50, y: 72 } }
];

export default function CustomerPortal({
  cart,
  shops,
  isMember,
  onToggleMembership,
  memberSavings,
  onAddToCart,
  onUpdateCartQty,
  onClearCart,
  onPlaceOrder,
  activeOrder,
}: CustomerPortalProps) {
  const currentShops = shops || MOCK_SHOPS;
  const [selectedCity, setSelectedCity] = useState<TriangleCity | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Checkout sheet variables
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [buyerName, setBuyerName] = useState('John Doe');
  const [buyerPhone, setBuyerPhone] = useState('(919) 555-5231');
  const [selectedPresetVal, setSelectedPresetVal] = useState(0);
  const [customAddress, setCustomAddress] = useState('');
  const [tipPercent, setTipPercent] = useState<number>(20); // default 20%
  const [customTip, setCustomTip] = useState<string>('');
  const [validationError, setValidationError] = useState('');

  const [orderCreatedNotice, setOrderCreatedNotice] = useState(false);

  // Filter shops by Triangle cities
  const filteredShops = currentShops.filter((shop) => {
    const matchesCity = selectedCity === 'All' || shop.city === selectedCity;
    const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          shop.products.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCity && matchesSearch;
  });

  // Calculate cart metrics
  const baseSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartSubtotal = isMember ? baseSubtotal * 0.85 : baseSubtotal;
  const activeShopId = cart[0]?.shopId;
  const activeShop = currentShops.find(s => s.id === activeShopId);
  const baseDeliveryFee = activeShop?.deliveryFee ?? 0;
  const activeDeliveryFee = isMember ? 0 : baseDeliveryFee;
  
  const estimatedServiceFee = cart.length > 0 ? 1.99 : 0;
  const estimatedTax = cartSubtotal * 0.07; // 7% NC Tax

  // Determine tip magnitude
  const getTipAmount = () => {
    if (customTip) {
      const parsed = parseFloat(customTip);
      return isNaN(parsed) || parsed < 0 ? 0 : parsed;
    }
    return (cartSubtotal * tipPercent) / 100;
  };

  const calculatedTip = getTipAmount();
  const calculatedTotal = cartSubtotal + activeDeliveryFee + estimatedServiceFee + estimatedTax + calculatedTip;

  const handleCheckout = () => {
    if (!buyerName.trim()) {
      setValidationError('Full Name matches photo ID is required for delivery certification!');
      return;
    }
    if (!buyerPhone.trim()) {
      setValidationError('Contact Phone Contact is required for carrier status dispatch!');
      return;
    }
    setValidationError('');

    const selectedPreset = LOCAL_PRESET_ADDRESSES[selectedPresetVal];
    const finalAddress = customAddress || selectedPreset.address;
    const finalCity = selectedPreset.city;
    const finalCoords = selectedPreset.coords;

    onPlaceOrder({
      name: buyerName,
      phone: buyerPhone,
      address: finalAddress,
      city: finalCity,
      coords: finalCoords,
      tip: calculatedTip,
    });

    setIsCheckoutOpen(false);
    onClearCart();
    setOrderCreatedNotice(true);
    setTimeout(() => setOrderCreatedNotice(false), 5000);
  };

  return (
    <div className="space-y-8" id="customer-portal-root">
      
      {/* Dynamic Order Status Toast Alert in sophisticated metallic bronze */}
      {orderCreatedNotice && (
        <div className="bg-[#0f0e0d] border border-accent-gold/30 rounded-2xl p-5 flex items-center justify-between animate-fade-in shadow-2xl">
          <div className="flex items-center gap-3">
            <span className="text-xl">✨</span>
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">Dispatch Route Mobilized</h4>
              <p className="text-xs text-[#e0e0e0]/70 mt-0.5">Your bespoke smoke shop courier run was broadcasted to 3rd-party riders.</p>
            </div>
          </div>
          <button onClick={() => setOrderCreatedNotice(false)} className="text-accent-gold text-xs font-bold uppercase tracking-wider hover:underline px-2 py-1">
            Dismiss
          </button>
        </div>
      )}

      {/* Cart Float Bubble - Warm Gold / Off-black accent */}
      {cart.length > 0 && !isCheckoutOpen && (
        <div className="fixed bottom-6 right-6 z-40 bg-accent-gold text-black px-6 py-4 rounded-full flex items-center gap-2.5 font-bold shadow-2xl hover:scale-105 active:scale-95 transition cursor-pointer"
             onClick={() => setIsCheckoutOpen(true)}
             id="cart-floating-bubble">
          <ShoppingCart className="w-4 h-4 fill-black text-black" />
          <span className="text-xs uppercase tracking-wider">Your Basket ({cart.length} items • ${cartSubtotal.toFixed(2)})</span>
        </div>
      )}

      {/* 1. Header Hero Banner - Matching Triangle Haze design */}
      <header className="relative h-56 bg-gradient-to-br from-[#121212] to-[#080808] rounded-3xl border border-white/5 p-8 md:p-10 flex flex-col justify-end overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent-gold blur-[120px] opacity-10" />
        
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-accent-gold/90 font-bold">Northside Smoke Logistics Network</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif italic text-white leading-none tracking-tight">
            Elevated Delivery.
          </h1>
          <p className="text-sm md:text-base text-[#e0e0e0]/60 font-light leading-relaxed">
            Curated, age-compliant smoke essentials delivered on-demand from local Raleigh, Durham, Chapel Hill, and Cary merchants.
          </p>
        </div>
      </header>

      {/* 2. Northside Reserve Premium Lounge Banner - High-fidelity membership dashboard */}
      <div className="relative bg-gradient-to-r from-[#0d0d0d] via-[#16120e] to-[#0d0d0d] border border-accent-gold/20 rounded-3xl p-6 md:p-8 overflow-hidden shadow-2xl" id="northside-reserve-club-section">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/5 rounded-full blur-[80px]" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-accent-gold animate-pulse shrink-0" />
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent-gold font-bold">
                Northside Reserve Status: {isMember ? 'VIP GOLD ACCREDITED' : 'NOT SUBSCRIBED'}
              </span>
            </div>
            
            {isMember ? (
              <div>
                <h2 className="text-2xl font-serif italic text-white leading-tight">Welcome to the Gold Reserve Lounge</h2>
                <p className="text-xs text-[#e0e0e0]/75 mt-1 leading-relaxed">
                  Your VIP tier guarantees <strong className="text-accent-gold">15% off catalogue prices</strong>, <strong className="text-accent-gold">$0 delivery fee carriage runs</strong>, and unlocked access to our Signature Reserve special offers.
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <div className="bg-[#15120d] border border-accent-gold/20 px-3.5 py-1.5 rounded-xl flex items-center gap-2">
                    <Gift className="w-3.5 h-3.5 text-accent-gold shrink-0" />
                    <span className="text-[10px] font-mono text-[#e0e0e0]/60 uppercase tracking-wider">Accumulated VIP Savings:</span>
                    <span className="text-xs font-bold font-mono text-accent-gold">${memberSavings.toFixed(2)}</span>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl flex items-center gap-1.5 text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                    <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" /> Active benefits applied
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-serif italic text-white leading-tight">Elevate with Northside Reserve Club</h2>
                <p className="text-xs text-[#e0e0e0]/65 mt-1 leading-relaxed">
                  Join the Triangle area’s premier smoke and dispensaries circle. Save instantly on every purchase and dispatch, with zero standard delivery fees.
                </p>
                
                {/* Gold Tier Perks Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                  <div className="bg-[#101010]/80 border border-white/5 p-3 rounded-xl flex items-start gap-2.5">
                    <Percent className="w-4 h-4 text-accent-gold shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[10px] font-mono uppercase text-white font-bold tracking-wider">15% Off Everything</h4>
                      <p className="text-[9px] text-[#e0e0e0]/45 leading-normal mt-0.5">Applied automatically to flower, pre-rolls, and gear.</p>
                    </div>
                  </div>
                  <div className="bg-[#101010]/80 border border-white/5 p-3 rounded-xl flex items-start gap-2.5">
                    <Gift className="w-4 h-4 text-accent-gold shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[10px] font-mono uppercase text-white font-bold tracking-wider">$0 Delivery Fee</h4>
                      <p className="text-[9px] text-[#e0e0e0]/45 leading-normal mt-0.5">Free logistics carriage from all Triangle merchants.</p>
                    </div>
                  </div>
                  <div className="bg-[#101010]/80 border border-white/5 p-3 rounded-xl flex items-start gap-2.5">
                    <Crown className="w-4 h-4 text-accent-gold shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[10px] font-mono uppercase text-white font-bold tracking-wider">Secret Vault</h4>
                      <p className="text-[9px] text-[#e0e0e0]/45 leading-normal mt-0.5">Unlock limited, curated connoisseur batches.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="shrink-0 flex flex-col justify-center items-stretch lg:items-end gap-2 bg-[#090909]/40 border border-white/5 lg:border-none p-4 lg:p-0 rounded-2xl">
            <button
              onClick={onToggleMembership}
              className={`px-6 py-3.5 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-all duration-300 shadow-lg ${
                isMember
                  ? 'bg-amber-950/20 text-[#e0e0e0]/60 hover:text-white border border-white/10 hover:bg-[#1a150f]'
                  : 'bg-accent-gold hover:brightness-110 active:scale-98 text-black shadow-accent-gold/15'
              }`}
            >
              {isMember ? 'Opt-Out of VIP Lounge' : 'Activate Free 1-Click VIP Pass'}
            </button>
            <p className="text-[8px] text-center lg:text-right font-mono text-[#e0e0e0]/35 uppercase tracking-widest mt-1">
              {isMember ? 'Reserve accrediting loaded' : 'Simulation active • Instant access'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Browse System */}
      {!selectedShop ? (
        <div className="space-y-6">
          {/* Search bar and City Selector */}
          <div className="flex flex-col xl:flex-row gap-4 xl:items-center justify-between">
            {/* City Selection Tabs */}
            <div className="flex bg-[#080808] border border-white/5 p-1 rounded-2xl max-w-fit overflow-x-auto">
              {(['All', 'Raleigh', 'Durham', 'Chapel Hill', 'Cary'] as const).map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium uppercase tracking-wider transition whitespace-nowrap ${
                    selectedCity === city
                      ? 'bg-[#151515] text-accent-gold font-semibold border border-white/10'
                      : 'text-[#e0e0e0]/40 hover:text-white'
                  }`}
                >
                  {city === 'All' ? 'Explore Regions' : `${city}`}
                </button>
              ))}
            </div>

            {/* Keyword Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
              <input
                type="text"
                placeholder="Search shops or craft products (RAW, Geek Bar...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#080808] border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-xs text-[#e0e0e0] placeholder-[#e0e0e0]/30 focus:outline-none focus:border-accent-gold/40 transition font-sans"
              />
            </div>
          </div>

          {/* Shop Grid - Sophisticated Black Cards */}
          <section>
            <div className="flex justify-between items-end mb-6 border-b border-white/5 pb-2">
              <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-white/70">Northside Smoke Merchants</h2>
              <span className="text-[10px] uppercase font-mono text-accent-gold tracking-widest">{filteredShops.length} stores mapped</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShops.map((shop) => (
                <div
                  key={shop.id}
                  onClick={() => setSelectedShop(shop)}
                  className="group bg-[#0d0d0d] border border-white/5 overflow-hidden hover:border-accent-gold/30 rounded-2xl cursor-pointer transition-all duration-350 flex flex-col justify-between"
                >
                  <div>
                    {/* Visual card thumbnail with high class overlay */}
                    <div className="relative h-44 overflow-hidden bg-[#050505]">
                      <img
                        src={shop.imageUrl}
                        alt={shop.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />
                      
                      {shop.featured && (
                        <span className="absolute top-3 left-3 bg-accent-gold/10 text-accent-gold border border-accent-gold/20 px-2 py-0.5 rounded text-[9px] uppercase font-mono font-bold tracking-widest">
                          ★ Prime Partner
                        </span>
                      )}

                      <span className="absolute bottom-3 right-3 bg-[#050505]/85 text-accent-gold px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-widest border border-white/5">
                        {shop.city}
                      </span>
                    </div>

                    {/* Details content */}
                    <div className="p-6 space-y-1.5">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-serif italic text-xl text-white group-hover:text-accent-gold transition leading-tight">
                          {shop.name}
                        </h3>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-accent-gold font-mono bg-[#151515] px-1.5 py-0.5 border border-white/5 rounded">
                          {shop.rating} ★
                        </div>
                      </div>

                      <p className="text-xs text-[#e0e0e0]/40 line-clamp-1 font-sans font-light flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 opacity-55 text-accent-gold/80" /> {shop.address}
                      </p>
                    </div>
                  </div>

                  {/* Delivery specifications footer */}
                  <div className="mx-6 mb-6 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-[#e0e0e0]/50 font-mono uppercase tracking-wider">
                    <span>⏱ {shop.deliveryTime}</span>
                    <span>💸 ${shop.deliveryFee.toFixed(2)} delivery</span>
                    <span>🛒 min: ${shop.minOrder}</span>
                  </div>
                </div>
              ))}

              {filteredShops.length === 0 && (
                <div className="col-span-full py-16 text-center border border-dashed border-white/10 rounded-2xl bg-[#080808]/40">
                  <p className="text-xs text-[#e0e0e0]/50">No partners matched this criteria. Toggle "Explore Regions" to view all.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      ) : (
        /* SHOP DETAILED MENU INTERFACE */
        <div className="space-y-6" id="shop-detail-page">
          {/* Shop return button */}
          <div className="mb-2">
            <button
              onClick={() => { setSelectedShop(null); setSelectedCategory('All'); }}
              className="px-4 py-2 bg-[#0d0d0d] border border-white/5 text-[#e0e0e0]/80 hover:text-white hover:bg-[#151515] rounded-xl text-[10px] uppercase tracking-wider font-bold transition flex items-center gap-1.5"
            >
              ← Return to Northside Feed
            </button>
          </div>

          {/* Luxury Banner */}
          <div className="relative h-64 rounded-3xl overflow-hidden bg-[#080808] border border-white/5 p-8 flex flex-col justify-end">
            <div className="absolute inset-0">
              <img
                src={selectedShop.imageUrl}
                alt={selectedShop.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-25"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/30 to-transparent" />
            </div>

            <div className="relative space-y-2 z-10 max-w-3xl">
              <span className="px-2.5 py-0.5 bg-accent-gold/10 text-accent-gold border border-accent-gold/20 rounded font-mono text-[9px] uppercase font-bold tracking-widest">
                Authorized Haze Merchant • {selectedShop.city}
              </span>
              <h2 className="text-4xl font-serif italic text-white leading-tight">{selectedShop.name}</h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#e0e0e0]/60 font-mono uppercase tracking-wider font-light">
                <span className="text-accent-gold font-bold">
                  ★ {selectedShop.rating} Rating
                </span>
                <span className="text-white/20">•</span>
                <span>📍 Durham Road Sector</span>
                <span className="text-white/20">•</span>
                <span>⏱ {selectedShop.deliveryTime}</span>
                <span className="text-white/20">•</span>
                <span>💸 Delivery: ${selectedShop.deliveryFee.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Product Category Filter list in serif style */}
          <aside className="border-b border-white/5 pb-4 flex flex-col gap-3">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-accent-gold font-bold">Menu Categories</h3>
            <div className="flex flex-wrap gap-1">
              {['All', 'Flower', 'Pre-rolls', 'Vapes', 'Cigars', 'Accessories', 'Glass & Pipes', 'Papers & Rolling'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition ${
                    selectedCategory === cat
                      ? 'bg-accent-gold text-black font-semibold'
                      : 'text-[#e0e0e0]/50 hover:text-white hover:bg-[#151515]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </aside>

          {/* Menu Grid - Premium Products */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              ...selectedShop.products,
              {
                id: `${selectedShop.id}_vip_1`,
                name: 'Northside Reserve Gold Cut (3.5g)',
                description: 'Ultra rare, organic greenhouse hybrid. Frosty golden trichomes, rich pineapple haze taste. Member Lounge Harvest.',
                price: 49.99,
                imageUrl: '👑',
                category: 'Flower' as const,
                rating: 5.0,
                reviewsCount: 104,
                inStock: true,
                memberOnly: true,
              },
              {
                id: `${selectedShop.id}_vip_2`,
                name: 'Liquid Diamonds VIP Infused Pre-Roll',
                description: 'Hand-rolled glass tipped cone containing 1.5g premium indoor leaf infused with pure crystalline live resin.',
                price: 24.99,
                imageUrl: '💎',
                category: 'Pre-rolls' as const,
                rating: 4.9,
                reviewsCount: 88,
                inStock: true,
                memberOnly: true,
              },
              {
                id: `${selectedShop.id}_vip_3`,
                name: 'Limited Solid Gold Grinder (4-Piece)',
                description: 'Durable anodized 24k-gold style alloy grinder. Rare limited distribution collectible with matching felt carrying pouch.',
                price: 39.99,
                imageUrl: '🏆',
                category: 'Accessories' as const,
                rating: 5.0,
                reviewsCount: 31,
                inStock: true,
                memberOnly: true,
              }
            ]
              .filter((p) => selectedCategory === 'All' || p.category === selectedCategory)
              .map((prod) => {
                const cartMatch = cart.find(item => item.product.id === prod.id);
                const isExclusive = 'memberOnly' in prod && prod.memberOnly;
                const isLocked = isExclusive && !isMember;

                const basePrice = prod.price;
                const actualPrice = isMember ? basePrice * 0.85 : basePrice;

                return (
                  <div
                    key={prod.id}
                    className={`p-6 bg-[#0d0d0d] border rounded-2xl transition-all duration-300 flex flex-col justify-between h-64 relative overflow-hidden ${
                      isLocked 
                        ? 'border-accent-gold/25 bg-gradient-to-b from-[#0d0d0d] to-[#080808]/70' 
                        : isExclusive 
                          ? 'border-accent-gold/45 shadow-lg shadow-accent-gold/5 bg-gradient-to-b from-[#12100c] to-[#0d0d0d]' 
                          : 'border-white/5 hover:border-accent-gold/20'
                    }`}
                  >
                    {isExclusive && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-gold/10 via-accent-gold to-accent-gold/10" />
                    )}

                    <div>
                      {/* Product identity */}
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-2xl w-10 h-10 bg-[#151515] border border-white/5 rounded-xl flex items-center justify-center" role="img" aria-label={prod.name}>
                          {prod.imageUrl}
                        </span>
                        
                        {isExclusive ? (
                          <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#000000] bg-accent-gold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                            <Crown className="w-2.5 h-2.5" /> Special Offer
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#e0e0e0]/40 bg-[#151515] border border-white/5 px-2.5 py-0.5 rounded">
                            {prod.category}
                          </span>
                        )}
                      </div>

                      <h4 className="font-serif italic text-lg text-white leading-snug line-clamp-1 flex items-center gap-1.5">
                        {prod.name}
                      </h4>
                      <p className="text-xs text-[#e0e0e0]/55 line-clamp-2 mt-1 leading-normal font-light">{prod.description}</p>
                    </div>

                    {/* Footer values */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
                      {isMember ? (
                        <div className="flex flex-col items-start leading-none font-mono">
                          <span className="text-[#e2e2e2]/40 text-[9px] line-through">${basePrice.toFixed(2)}</span>
                          <span className="text-accent-gold font-bold text-sm mt-0.5">${actualPrice.toFixed(2)}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-start leading-none font-mono">
                          <span className="text-[#e0e0e0] font-semibold text-sm">${basePrice.toFixed(2)}</span>
                          <span className="text-[8px] text-accent-gold/75 font-semibold uppercase mt-1 tracking-wider">VIP: ${(basePrice * 0.85).toFixed(2)}</span>
                        </div>
                      )}
                      
                      {isLocked ? (
                        <button
                          onClick={onToggleMembership}
                          className="px-3 py-1.5 bg-gradient-to-r from-accent-gold to-amber-500 hover:brightness-110 active:scale-95 text-black text-[9px] uppercase tracking-wider font-extrabold rounded-xl transition flex items-center gap-1"
                        >
                          <Lock className="w-3 h-3" /> Join Club
                        </button>
                      ) : cartMatch ? (
                        <div className="flex items-center bg-accent-gold text-black p-1 rounded-xl shadow-lg shadow-accent-gold/10">
                          <button
                            onClick={() => onUpdateCartQty(prod.id, cartMatch.quantity - 1)}
                            className="p-1 hover:bg-black/10 rounded-lg transition"
                          >
                            <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                          <span className="px-3 text-xs font-bold font-mono leading-none">{cartMatch.quantity}</span>
                          <button
                            onClick={() => onUpdateCartQty(prod.id, cartMatch.quantity + 1)}
                            className="p-1 hover:bg-black/10 rounded-lg transition"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            const cleanProduct: Product = {
                              id: prod.id,
                              name: prod.name,
                              description: prod.description,
                              price: prod.price,
                              imageUrl: prod.imageUrl,
                              category: prod.category as any,
                              rating: prod.rating,
                              reviewsCount: prod.reviewsCount,
                              inStock: prod.inStock
                            };
                            onAddToCart(cleanProduct, selectedShop.id, selectedShop.name, selectedShop.address, selectedShop.coords);
                          }}
                          className={`px-4 py-1.5 border hover:border-accent-gold hover:text-accent-gold text-[10px] uppercase tracking-wider font-bold rounded-xl transition ${
                            isExclusive 
                              ? 'bg-[#1e1911]/50 border-accent-gold/30 text-accent-gold' 
                              : 'bg-[#151515] border-white/5 text-[#e0e0e0]/80'
                          }`}
                        >
                          + Purchase
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* DETAILED CHECKOUT BACK-SLIDED SIDEBAR MODULE (Sleek Golden/Bronze Layout) */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/85 backdrop-blur-sm animate-fade-in" id="checkout-sheet-container">
          <div className="max-w-md w-full h-full bg-[#080808] border-l border-white/10 p-6 md:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl">
            {/* Header detail */}
            <div>
              <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
                <div>
                  <h3 className="text-xl font-serif italic text-white flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-accent-gold" />
                    Delivery Carriage
                  </h3>
                  {activeShop && (
                    <span className="text-[10px] font-mono text-[#e0e0e0]/55 uppercase tracking-wider">
                      Merchant: <strong className="text-accent-gold font-semibold">{activeShop.name}</strong>
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="p-2 bg-[#151515] border border-white/5 text-[#e0e0e0]/50 hover:text-white rounded-xl transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Items breakdown list */}
              <div className="space-y-4 mb-6 max-h-[160px] overflow-y-auto pr-1">
                {cart.map((item) => {
                  const itemPrice = isMember ? item.product.price * 0.85 : item.product.price;
                  return (
                    <div key={item.product.id} className="flex justify-between items-center text-xs">
                      <div className="space-y-0.5">
                        <div className="text-white font-medium">
                          {item.product.imageUrl} {item.product.name}
                        </div>
                        <div className="text-[10px] text-[#e0e0e0]/40 font-mono flex items-center gap-1.5 uppercase tracking-wider">
                          <span>Quantity: {item.quantity}</span>
                          <span className="inline-block w-1 h-1 bg-white/10 rounded-full" />
                          {isMember ? (
                            <span className="text-accent-gold">
                              ${itemPrice.toFixed(2)} each <span className="text-[8px] opacity-75">(VIP)</span>
                            </span>
                          ) : (
                            <span>${item.product.price.toFixed(2)} each</span>
                          )}
                        </div>
                      </div>
                      <span className="font-semibold text-accent-gold font-mono">
                        ${(itemPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Recipient registry formulary */}
              <div className="space-y-4 border-t border-b border-white/10 py-6 mb-6">
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#bfa181] font-bold">Recipient Registry</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] text-[#e0e0e0]/40 uppercase tracking-widest font-mono">Full Name (Matches ID)</label>
                    <input
                      type="text"
                      value={buyerName}
                      onChange={(e) => { setBuyerName(e.target.value); setValidationError(''); }}
                      className="w-full bg-[#121212] border border-white/5 rounded-lg p-2.5 text-xs text-[#e0e0e0] focus:outline-none focus:border-accent-gold/40"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-[#e0e0e0]/40 uppercase tracking-widest font-mono">Phone Contact</label>
                    <input
                      type="text"
                      value={buyerPhone}
                      onChange={(e) => { setBuyerPhone(e.target.value); setValidationError(''); }}
                      className="w-full bg-[#121212] border border-white/5 rounded-lg p-2.5 text-xs text-[#e0e0e0] focus:outline-none focus:border-accent-gold/40"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-[#e0e0e0]/40 uppercase tracking-widest font-mono">Northside Sector Landmark Address</label>
                  <select
                    value={selectedPresetVal}
                    onChange={(e) => setSelectedPresetVal(parseInt(e.target.value))}
                    className="w-full bg-[#121212] border border-white/5 rounded-lg p-2.5 text-xs text-[#e0e0e0] focus:outline-none focus:border-accent-gold/40"
                  >
                    {LOCAL_PRESET_ADDRESSES.map((preset, index) => (
                      <option key={index} value={index}>
                        {preset.label} ({preset.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-[#e0e0e0]/40 uppercase tracking-widest font-mono">
                    Custom Suite / Floor / House Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sullivan Hall Suite 203"
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    className="w-full bg-[#121212] border border-white/5 rounded-lg p-2.5 text-xs text-[#e0e0e0] placeholder-[#e0e0e0]/20 focus:outline-none focus:border-accent-gold/40"
                  />
                </div>
              </div>

              {/* Carrier tipping */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#bfa181] font-bold">Rider Carriage Tip</h4>
                  <span className="text-xs font-mono text-accent-gold font-bold">${calculatedTip.toFixed(2)}</span>
                </div>
                <div className="flex gap-2">
                  {[15, 20, 25].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => { setTipPercent(pct); setCustomTip(''); }}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-mono transition ${
                        tipPercent === pct && !customTip
                          ? 'bg-accent-gold text-black shadow'
                          : 'bg-[#151515] border border-white/5 text-[#e0e0e0]/40 hover:text-white'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                  <input
                    type="text"
                    placeholder="Custom $"
                    value={customTip}
                    onChange={(e) => setCustomTip(e.target.value)}
                    className="w-[85px] bg-[#121212] border border-white/5 rounded-lg px-2 text-center text-xs text-[#e0e0e0] font-mono focus:outline-none focus:border-accent-gold/40"
                  />
                </div>
              </div>
            </div>

            {/* Calculations breakdown & payment execution */}
            <div className="space-y-4 border-t border-white/10 pt-5">
              <div className="space-y-1.5 text-[11px] font-mono text-[#e0e0e0]/50 uppercase tracking-wider">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-mono">
                    {isMember ? (
                      <span>
                        <span className="text-[#e2e2e2]/30 line-through mr-1.5">${baseSubtotal.toFixed(2)}</span>
                        <span className="text-accent-gold font-bold">${cartSubtotal.toFixed(2)}</span>
                      </span>
                    ) : (
                      <span>${cartSubtotal.toFixed(2)}</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>3rd-party logistics fee</span>
                  <span className="text-white font-mono">
                    {isMember ? (
                      <span className="text-accent-gold font-bold">FREE ($0.00)</span>
                    ) : (
                      <span>${activeDeliveryFee.toFixed(2)}</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Processing</span>
                  <span className="text-white font-mono">${estimatedServiceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated NC Tax (7%)</span>
                  <span className="text-white font-mono">${estimatedTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Northside Courier Tip</span>
                  <span className="text-white font-mono">${calculatedTip.toFixed(2)}</span>
                </div>
                {isMember && (
                  <div className="flex justify-between text-emerald-400 font-bold bg-emerald-500/5 px-2 py-1 rounded">
                    <span>Reserve Savings This Carriage Run</span>
                    <span>-${((baseSubtotal - cartSubtotal) + baseDeliveryFee).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-sans font-semibold text-white border-t border-dashed border-white/10 pt-2.5 mt-2">
                  <span>TOTAL COMPLIANT ESTIMATE</span>
                  <span className="text-accent-gold font-mono text-sm">${calculatedTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-[#151515] border border-white/5 p-3 rounded-xl flex items-center gap-2.5 mb-2">
                <ShieldCheck className="w-5 h-5 text-accent-gold shrink-0" />
                <span className="text-[10px] text-[#e0e0e0]/65 leading-relaxed">
                  21+ identity key authentication is strictly performed by courier upon arrival. Underage or false ID claims result in transaction nullification.
                </span>
              </div>

              {validationError && (
                <div className="bg-amber-500/5 border border-amber-500/20 p-3 rounded-xl flex items-center gap-2 text-amber-400 text-[10px] animate-fade-in font-mono uppercase tracking-wider">
                  <span>⚠️</span>
                  <span>{validationError}</span>
                </div>
              )}

              <button
                onClick={handleCheckout}
                className="w-full py-3.5 bg-accent-gold text-black font-bold uppercase tracking-widest text-[10px] rounded-xl transition hover:brightness-110 shadow-lg shadow-accent-gold/10"
              >
                Place Carriage Run
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
