import React, { useState, useEffect } from 'react';
import { MOCK_SHOPS, MOCK_DRIVERS } from './data/shops';
import { Order, OrderStatus, CartItem, Product, TriangleCity, Shop } from './types';
import AgeGate from './components/AgeGate';
import CustomerPortal from './components/CustomerPortal';
import DriverPortal from './components/DriverPortal';
import TrackingMap from './components/TrackingMap';
import BuyersGuide from './components/BuyersGuide';
import IntegrationStudio from './components/IntegrationStudio';
import { ShoppingBag, ChevronRight, CheckCircle, Navigation, Play, Eye, Users, Heart, Star, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [ageVerified, setAgeVerified] = useState<boolean>(() => {
    const saved = localStorage.getItem('triangle_smoke_age_verified');
    return saved === 'true';
  });

  const [activeTab, setActiveTab] = useState<'customer' | 'guide' | 'driver' | 'integration'>('customer');
  const [shops, setShops] = useState<Shop[]>(MOCK_SHOPS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMember, setIsMember] = useState<boolean>(() => {
    return localStorage.getItem('northside_is_member') === 'true';
  });

  const [appToast, setAppToast] = useState<{ message: string; type: 'success' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'success' | 'warning' = 'success') => {
    setAppToast({ message, type });
  };

  useEffect(() => {
    if (!appToast) return;
    const t = setTimeout(() => setAppToast(null), 5000);
    return () => clearTimeout(t);
  }, [appToast]);

  // Keep track of accumulated simulated member savings!
  const [memberSavings, setMemberSavings] = useState<number>(() => {
    const saved = localStorage.getItem('northside_member_savings');
    return saved ? parseFloat(saved) : 0;
  });

  const handleToggleMembership = () => {
    setIsMember((prev) => {
      const next = !prev;
      localStorage.setItem('northside_is_member', String(next));
      if (!next) {
        // Reset savings if they opt out
        setMemberSavings(0);
        localStorage.setItem('northside_member_savings', '0');
      }
      return next;
    });
  };
  
  // Shared state for all simulated orders
  const [orders, setOrders] = useState<Order[]>([]);

  const handleSyncCustomCatalog = (shopId: string, customProducts: Product[]) => {
    setShops((prev) =>
      prev.map((s) => (s.id === shopId ? { ...s, products: customProducts } : s))
    );
  };
  // The index of the order the customer is currently tracking
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);

  // Auto-simulation timer for customers who do not switch to the Driver tab
  const [autoSimulate, setAutoSimulate] = useState(false);

  // Age Gate helper
  const handleVerifyAge = () => {
    localStorage.setItem('triangle_smoke_age_verified', 'true');
    setAgeVerified(true);
  };

  // Add items to standard cart
  const handleAddToCart = (
    product: Product,
    shopId: string,
    shopName: string,
    shopAddress: string,
    shopCoords: { x: number; y: number }
  ) => {
    if (cart.length > 0 && cart[0].shopId !== shopId) {
      showToast(
        "To guarantee fast delivery, you cannot bundle items from different smoke shops in the same dispatch run. Please complete or empty your current basket first!",
        "warning"
      );
      return;
    }

    setCart((prev) => {
      const match = prev.find((item) => item.product.id === product.id);
      if (match) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, shopId, shopName, shopAddress, shopCoords, quantity: 1 }];
    });
  };

  const handleUpdateCartQty = (productId: string, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.product.id !== productId);
      }
      return prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
    });
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Place delivery run order
  const handlePlaceOrder = (customer: {
    name: string;
    phone: string;
    address: string;
    city: TriangleCity;
    coords: { x: number; y: number };
    tip: number;
  }) => {
    if (cart.length === 0) return;

    const baseSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const activeShop = shops.find((s) => s.id === cart[0].shopId)!;
    const baseDeliveryFee = activeShop.deliveryFee;

    const subtotal = parseFloat((isMember ? baseSubtotal * 0.85 : baseSubtotal).toFixed(2));
    const deliveryFee = isMember ? 0 : baseDeliveryFee;
    const serviceFee = 1.99;
    const tax = parseFloat((subtotal * 0.07).toFixed(2));
    const finalTotal = parseFloat((subtotal + deliveryFee + serviceFee + tax + customer.tip).toFixed(2));

    // Persist additional savings
    if (isMember) {
      const savedAmount = (baseSubtotal - subtotal) + baseDeliveryFee;
      setMemberSavings((prev) => {
        const next = parseFloat((prev + savedAmount).toFixed(2));
        localStorage.setItem('northside_member_savings', String(next));
        return next;
      });
    }

    // Pick a mock driver coordinates relatively nearby in the Triangle
    const randomDriverIdx = Math.floor(Math.random() * MOCK_DRIVERS.length);
    const driverAsset = MOCK_DRIVERS[randomDriverIdx];

    const newOrder: Order = {
      id: `NSE-${Math.floor(1000 + Math.random() * 9000)}`,
      items: cart.map((item) => ({
        ...item,
        // Update product price in order items if user is member
        product: {
          ...item.product,
          price: parseFloat((isMember ? item.product.price * 0.85 : item.product.price).toFixed(2))
        }
      })),
      shopId: activeShop.id,
      shopName: activeShop.name,
      shopAddress: activeShop.address,
      shopCoords: activeShop.coords,
      deliveryAddress: customer.address,
      deliveryCity: customer.city,
      deliveryCoords: customer.coords,
      customerName: customer.name,
      customerPhone: customer.phone,
      subtotal,
      deliveryFee,
      serviceFee,
      tax,
      tip: customer.tip,
      total: finalTotal,
      status: 'placed',
      driverId: null,
      driverName: null,
      driverPhone: null,
      driverVehicle: null,
      driverCoords: driverAsset.coords,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedDeliveryTime: `${activeShop.deliveryTime}`,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setTrackingOrderId(newOrder.id);

    // Dynamic external delivery dispatch broadcast to ncsound919/Northside-Smoke
    const savedWebhookUrl = localStorage.getItem('ns_webhook_url');
    if (savedWebhookUrl) {
      const hmacSecret = localStorage.getItem('ns_hmac_secret') || 'none';
      fetch(savedWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Northside-Signature': hmacSecret
        },
        body: JSON.stringify(newOrder)
      }).catch((err) => {
        console.warn('Webhook dispatch generated simulated log bypass: ', err);
      });
    }
  };

  // Driver accept handler
  const handleAcceptOrder = (orderId: string) => {
    const randomDriverIdx = Math.floor(Math.random() * MOCK_DRIVERS.length);
    const mockDriver = MOCK_DRIVERS[randomDriverIdx];

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: 'accepted',
            driverId: mockDriver.id,
            driverName: mockDriver.name,
            driverPhone: mockDriver.phone,
            driverVehicle: mockDriver.vehicle,
          };
        }
        return ord;
      })
    );
  };

  const handleUpdateOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return { ...ord, status: nextStatus };
        }
        return ord;
      })
    );
  };

  const activeTrackingOrder = orders.find((o) => o.id === trackingOrderId) || null;

  // Active tracking automated sequence simulator
  useEffect(() => {
    if (!autoSimulate || !activeTrackingOrder) return;

    const statusCycle: OrderStatus[] = ['placed', 'accepted', 'preparing', 'picked_up', 'arriving_soon', 'delivered'];
    const currentIdx = statusCycle.indexOf(activeTrackingOrder.status);

    if (currentIdx === -1 || activeTrackingOrder.status === 'delivered') {
      setAutoSimulate(false);
      return;
    }

    const timer = setTimeout(() => {
      const nextStatus = statusCycle[currentIdx + 1];
      if (nextStatus) {
        if (nextStatus === 'accepted') {
          // auto assign default driver details
          const d = MOCK_DRIVERS[0];
          setOrders((prev) =>
            prev.map((o) =>
              o.id === activeTrackingOrder.id
                ? {
                    ...o,
                    status: 'accepted',
                    driverId: d.id,
                    driverName: d.name,
                    driverPhone: d.phone,
                    driverVehicle: d.vehicle,
                  }
                : o
            )
          );
        } else {
          handleUpdateOrderStatus(activeTrackingOrder.id, nextStatus);
        }
      }
    }, 6000); // cycle stages every 6 seconds

    return () => clearTimeout(timer);
  }, [autoSimulate, activeTrackingOrder?.status, activeTrackingOrder?.id]);

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] flex flex-col font-sans selection:bg-accent-gold selection:text-black">
      {/* Age Check Mandatory Guard */}
      {!ageVerified && <AgeGate onVerify={handleVerifyAge} />}

      {/* Global State-Driven Custom Toast Alert */}
      {appToast && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[calc(100%-2rem)] p-4 border rounded-2xl flex items-start gap-2.5 shadow-2xl transition duration-300 animate-slide-up ${
          appToast.type === 'warning' 
            ? 'bg-[#120f0d] border-[#bfa181]/30 text-[#e0e0e0]' 
            : 'bg-[#0d0f0d] border-emerald-500/20 text-[#e0e0e0]'
        }`}>
          <span className="text-base shrink-0">{appToast.type === 'warning' ? '⚠️' : '✨'}</span>
          <div className="flex-1">
            <h5 className={`text-[10px] font-bold uppercase tracking-wider font-mono ${appToast.type === 'warning' ? 'text-[#bfa181]' : 'text-emerald-400'}`}>
              {appToast.type === 'warning' ? 'Compliance Warning' : 'Action Succeeded'}
            </h5>
            <p className="text-[11px] text-[#e0e0e0]/75 mt-0.5 leading-relaxed font-light">{appToast.message}</p>
          </div>
          <button 
            onClick={() => setAppToast(null)} 
            className="text-xs text-[#e0e0e0]/30 hover:text-white px-1 font-mono transition"
          >
            ×
          </button>
        </div>
      )}

      {/* 1. Header Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#080808]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl w-9 h-9 rounded-xl bg-accent-gold/5 border border-accent-gold/20 flex items-center justify-center font-serif text-accent-gold italic font-bold">N</span>
            <div>
              <h1 className="font-extrabold font-sans text-white tracking-tight leading-none text-base">
                Northside Smoke <span className="text-accent-gold font-mono tracking-widest text-[11px] font-bold">EXPRESS</span>
              </h1>
              <p className="text-[9px] text-[#e0e0e0]/40 font-mono tracking-wider mt-1 uppercase">3rd-Party Express Dispatch</p>
            </div>
          </div>

          {/* Mode Tabs: Switch between Customer View, Buyers Guide, and Driver Sandbox */}
          <div className="bg-[#050505] p-1 rounded-xl border border-white/5 flex gap-1 flex-wrap md:flex-nowrap justify-center">
            <button
              onClick={() => setActiveTab('customer')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] uppercase tracking-widest font-bold transition duration-300 ${
                activeTab === 'customer'
                  ? 'bg-accent-gold text-black shadow'
                  : 'text-[#e0e0e0]/45 hover:text-white'
              }`}
            >
              🛒 Buyer Feed
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] uppercase tracking-widest font-bold transition duration-300 ${
                activeTab === 'guide'
                  ? 'bg-accent-gold text-black shadow'
                  : 'text-[#e0e0e0]/45 hover:text-white'
              }`}
            >
              📖 Buyers Guide
            </button>
            <button
              onClick={() => setActiveTab('driver')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] uppercase tracking-widest font-bold transition duration-300 ${
                activeTab === 'driver'
                  ? 'bg-accent-gold text-black shadow'
                  : 'text-[#e0e0e0]/45 hover:text-white'
              }`}
            >
              🚗 Driver Sandbox
            </button>
            <button
              onClick={() => setActiveTab('integration')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] uppercase tracking-widest font-bold transition duration-300 ${
                activeTab === 'integration'
                  ? 'bg-accent-gold text-black shadow'
                  : 'text-[#e0e0e0]/45 hover:text-white'
              }`}
            >
              🔌 API Integration
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Workspace Layout */}
      {/* 2. Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'customer' && (
            <motion.div
              key="customer-tab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.18 }}
              className="space-y-8"
            >
              {/* If customer has an active ongoing track route, show HUD panel */}
              {activeTrackingOrder && (
                <div className="bg-[#0d0d0d] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row gap-6 lg:items-center justify-between shadow-2xl relative overflow-hidden" id="active-tracking-hud">
                  <div className="absolute top-0 right-0 h-24 w-24 bg-accent-gold/5 rounded-bl-full border-b border-l border-white/5" />

                  {/* Left Column: Tracking text stages */}
                  <div className="space-y-4 flex-1">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[9px] text-[#e0e0e0]/50 font-mono uppercase tracking-wider">
                        <span>LIVE CARRIAGE: <strong className="text-accent-gold font-bold">{activeTrackingOrder.id}</strong></span>
                        <span className="inline-block w-1.5 h-1.5 bg-white/10 rounded-full" />
                        <span>EST ARRIVAL: {activeTrackingOrder.estimatedDeliveryTime}</span>
                      </div>
                      <h3 className="text-2xl font-serif italic text-white flex items-center gap-2">
                        Tracking Carriage Process
                      </h3>
                    </div>

                    {/* Sequential Progress pipeline bar */}
                    <div className="grid grid-cols-5 gap-2">
                      {(['placed', 'accepted', 'preparing', 'picked_up', 'delivered'] as const).map((step, idx) => {
                        const statusMapping: { [key in OrderStatus]: number } = {
                          placed: 0,
                          accepted: 1,
                          preparing: 2,
                          picked_up: 3,
                          arriving_soon: 4,
                          delivered: 5,
                        };
                        const orderStateLevel = statusMapping[activeTrackingOrder.status];
                        const stepActive = orderStateLevel >= idx;

                        return (
                          <div key={step} className="space-y-1.5">
                            <div className={`h-1 rounded-full transition-all duration-700 ${
                              stepActive ? 'bg-accent-gold shadow shadow-accent-gold/20' : 'bg-[#151515]'
                            }`} />
                            <div className={`text-[8px] font-mono capitalize tracking-wider truncate ${
                              stepActive ? 'text-accent-gold font-bold' : 'text-white/30'
                            }`}>
                              {step === 'placed' && 'placed'}
                              {step === 'accepted' && 'courier tied'}
                              {step === 'preparing' && 'at store'}
                              {step === 'picked_up' && 'en transit'}
                              {step === 'delivered' && 'delivered'}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Driver summary card */}
                    {activeTrackingOrder.driverName ? (
                      <div className="flex items-center gap-3 bg-[#151515] p-4 border border-white/5 rounded-xl max-w-md">
                        <span className="text-xl">👩‍✈️</span>
                        <div>
                          <div className="text-xs font-bold text-white uppercase tracking-wider">
                            {activeTrackingOrder.driverName} • {activeTrackingOrder.driverVehicle}
                          </div>
                          <div className="text-[10px] text-[#e0e0e0]/50 leading-relaxed font-light mt-0.5">
                            Courier assigned from Raleigh Transit Sector. ID verification is strictly required upon arrival matching: <strong className="text-white font-medium">{activeTrackingOrder.customerName}</strong>.
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#151515]/30 border border-white/5 border-dashed rounded-xl p-4 max-w-md">
                        <p className="text-xs text-[#e0e0e0]/45 leading-relaxed font-light">
                          Waiting for courier driver match on 3rd party carriers. Open the **Driver Sandbox** tab to claim this cargo, or toggle automated run sequences below!
                        </p>
                      </div>
                    )}

                    {/* Auto Simulator controls */}
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setAutoSimulate((prev) => !prev)}
                        className={`px-4 py-2 rounded-xl text-[9px] font-mono uppercase tracking-widest font-bold transition flex items-center gap-1.5 ${
                          autoSimulate
                            ? 'bg-accent-gold/20 border border-accent-gold/40 text-accent-gold'
                            : 'bg-[#151515] border border-white/5 text-[#e0e0e0]/80 hover:text-white hover:bg-[#1a1a1a]'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5" />
                        {autoSimulate ? 'AUTO-SEQUENCE ON' : 'SEQUENCE ROAD SIMULATOR'}
                      </button>

                      {activeTrackingOrder.status === 'delivered' && (
                        <button
                          onClick={() => setTrackingOrderId(null)}
                          className="px-4 py-2 bg-accent-gold text-black font-extrabold text-[9px] uppercase tracking-widest rounded-xl transition hover:brightness-110"
                        >
                          Acknowledge & Clear Route
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Mini Vector GPS Radar */}
                  <div className="w-full lg:w-80 flex flex-col gap-2">
                    <span className="text-[9px] text-[#e0e0e0]/40 font-mono uppercase tracking-widest block lg:text-right">
                      RDU Sector Vector Beacon
                    </span>
                    <TrackingMap order={activeTrackingOrder} height="h-60" />
                  </div>
                </div>
              )}

              {/* Main Catalog View */}
              <CustomerPortal
                cart={cart}
                shops={shops}
                isMember={isMember}
                onToggleMembership={handleToggleMembership}
                memberSavings={memberSavings}
                onAddToCart={handleAddToCart}
                onUpdateCartQty={handleUpdateCartQty}
                onClearCart={handleClearCart}
                onPlaceOrder={handlePlaceOrder}
                activeOrder={activeTrackingOrder}
              />
            </motion.div>
          )}

          {activeTab === 'guide' && (
            <motion.div
              key="guide-tab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.18 }}
            >
              <BuyersGuide onAddToCart={handleAddToCart} />
            </motion.div>
          )}

          {activeTab === 'driver' && (
            <motion.div
              key="driver-tab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.18 }}
            >
              <div className="mb-6 bg-[#0d0d0d] border border-white/5 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-[#e0e0e0]/75 font-light">
                <Compass className="w-5 h-5 shrink-0 text-accent-gold" />
                <div>
                  <strong className="text-white font-medium block uppercase tracking-wider text-[10px] mb-0.5">3rd-Party Courier Command Guidelines</strong>
                  Reroute orders in real time. Placed dispatch runs from Northside partner smoke shops show here. Claim a gig to test manual driver tracking phases.
                </div>
              </div>

              <DriverPortal
                orders={orders}
                activeOrder={orders.find((o) => o.status !== 'delivered' && o.driverId !== null) || null}
                onAcceptOrder={handleAcceptOrder}
                onUpdateOrderStatus={handleUpdateOrderStatus}
              />
            </motion.div>
          )}

          {activeTab === 'integration' && (
            <motion.div
              key="integration-tab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.18 }}
            >
              <IntegrationStudio 
                orders={orders} 
                onSyncCustomCatalog={handleSyncCustomCatalog} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. Global Footer Block */}
      <footer className="border-t border-[#121212] bg-[#050505] py-12 text-center text-[#e0e0e0]/30 text-xs mt-16 space-y-2">
        <p className="font-mono text-[9px] tracking-[0.25em] text-[#e0e0e0]/40">
          NORTHSIDE SMOKE REGISTRY • COURIER SANDBOX RUN
        </p>
        <p className="max-w-md mx-auto px-4 leading-relaxed text-[#e0e0e0]/25 font-light">
          This is an interactive full-fidelity delivery sandbox application simulating 3rd-party carbon-neutral logistics and featuring an expert-curated Buyers Guide for age-compliant smoke products in the Northside & Triangle region.
        </p>
        <p className="text-[10px] text-white/10 font-mono tracking-wider pt-1">© 2026 Sandbox Technologies LLC. All rights layout reserved.</p>
      </footer>
    </div>
  );
}
