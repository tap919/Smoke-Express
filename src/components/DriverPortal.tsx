import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { AlertCircle, Play, CheckCircle2, DollarSign, Navigation, ShoppingBag, Eye, Star, MapPin } from 'lucide-react';
import TrackingMap from './TrackingMap';

interface DriverPortalProps {
  orders: Order[];
  activeOrder: Order | null;
  onAcceptOrder: (orderId: string) => void;
  onUpdateOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;
}

export default function DriverPortal({
  orders,
  activeOrder,
  onAcceptOrder,
  onUpdateOrderStatus,
}: DriverPortalProps) {
  const [driverStatus, setDriverStatus] = useState<'online' | 'offline'>('online');
  const [earnings, setEarnings] = useState<number>(31.50);
  const [tripsCount, setTripsCount] = useState<number>(2);

  // Available orders that have been placed but not accepted by a driver yet
  const availableOrders = orders.filter((o) => o.status === 'placed');

  const handleAccept = (orderId: string) => {
    onAcceptOrder(orderId);
  };

  const promoteStatus = () => {
    if (!activeOrder) return;
    const flow: { [key in OrderStatus]: OrderStatus | null } = {
      placed: 'accepted',
      accepted: 'preparing',
      preparing: 'picked_up',
      picked_up: 'arriving_soon',
      arriving_soon: 'delivered',
      delivered: null,
    };
    const next = flow[activeOrder.status];
    if (next) {
      onUpdateOrderStatus(activeOrder.id, next);

      // If completing transaction, add to driver earnings
      if (next === 'delivered') {
        const pay = activeOrder.deliveryFee + activeOrder.tip;
        setEarnings((prev) => prev + pay);
        setTripsCount((prev) => prev + 1);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="driver-portal-wrapper">
      {/* 1. Left hand: Driver stats & active routes */}
      <div className="lg:col-span-4 space-y-6">
        {/* Profile Card */}
        <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-16 w-16 bg-accent-gold/5 rounded-bl-full border-b border-l border-white/5" />

          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <span className="w-12 h-12 bg-accent-gold/5 border border-accent-gold/20 rounded-full flex items-center justify-center text-lg">
                🚗
              </span>
              <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0d0d0d] ${
                driverStatus === 'online' ? 'bg-accent-gold' : 'bg-white/20'
              }`} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-sans uppercase tracking-wider">Courier Sandbox</h2>
              <p className="text-[10px] text-white/45 font-mono">ID: Triangle-Rider-2</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-[#151515] border border-white/5 p-3 rounded-xl">
              <div className="text-[9px] text-[#bfa181] font-mono mb-1 flex items-center gap-1 uppercase tracking-wider">
                <DollarSign className="w-3 h-3 text-accent-gold" /> EARNINGS
              </div>
              <div className="text-lg font-bold text-white font-sans">${earnings.toFixed(2)}</div>
            </div>
            <div className="bg-[#151515] border border-white/5 p-3 rounded-xl">
              <div className="text-[9px] text-[#bfa181] font-mono mb-1 flex items-center gap-1 uppercase tracking-wider">
                <CheckCircle2 className="w-3 h-3 text-accent-gold" /> COMPLETED
              </div>
              <div className="text-lg font-bold text-white font-sans">{tripsCount} runs</div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setDriverStatus('online')}
              className={`flex-1 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-bold transition ${
                driverStatus === 'online'
                  ? 'bg-accent-gold text-black shadow-md shadow-accent-gold/10'
                  : 'bg-[#151515] text-[#e0e0e0]/45 border border-white/5 hover:text-white'
              }`}
            >
              Go Online
            </button>
            <button
              onClick={() => setDriverStatus('offline')}
              className={`flex-1 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-bold transition ${
                driverStatus === 'offline'
                  ? 'bg-[#151515] text-white border border-white/10'
                  : 'bg-[#151515] text-white/40 border border-white/5 hover:text-[#e0e0e0]/70'
              }`}
            >
              Pause
            </button>
          </div>
        </div>

        {/* Dispatch Jobs Queue */}
        <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-white font-sans tracking-wide uppercase flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-accent-gold" /> Triangle Feed
            </h3>
            <span className="px-2.5 py-0.5 bg-accent-gold/10 border border-accent-gold/20 rounded font-mono text-[9px] text-accent-gold uppercase tracking-wider font-semibold">
              {availableOrders.length} gigs matched
            </span>
          </div>

          {availableOrders.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-white/10 rounded-xl bg-[#151515]/20">
              <p className="text-xs text-[#e0e0e0]/40 leading-normal px-2">Waiting for local Raleigh or Durham smoke shop orders. Keep this portal open...</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {availableOrders.map((ord) => {
                const totalDeliveryPay = ord.deliveryFee + ord.tip;
                return (
                  <div
                    key={ord.id}
                    className="p-3.5 bg-[#151515] hover:bg-[#1a1a1a] border border-white/5 rounded-xl transition flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-xs font-bold text-white leading-tight block font-serif italic">
                          Pickup: {ord.shopName}
                        </div>
                        <div className="text-[10px] text-[#e0e0e0]/50 font-mono mt-1">
                          Dropoff: {ord.deliveryCity} ({ord.deliveryAddress.substring(0, 15)}...)
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-accent-gold font-mono">${totalDeliveryPay.toFixed(2)}</div>
                        <div className="text-[8px] uppercase tracking-wider text-white/30 font-mono">Fee + Tip</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 text-[10px] text-[#e0e0e0]/40 font-mono border-t border-white/5 pt-2">
                      <span>{ord.items.reduce((sum, item) => sum + item.quantity, 0)} packages</span>
                      <button
                        onClick={() => handleAccept(ord.id)}
                        className="px-3 py-1 bg-accent-gold text-black font-bold rounded-lg transition text-[9px] uppercase tracking-wider hover:brightness-110"
                      >
                        Accept Gig
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 2. Right hand: Map track and current gig checklist */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        {/* Dynamic Map Block */}
        <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-white/85 flex items-center gap-1.5 font-sans">
              <Navigation className="w-4 h-4 text-accent-gold animate-pulse" />
              Live Courier Navigation Matrix
            </h3>
            {activeOrder && (
              <span className="text-[10px] font-mono text-white/40">
                ACTIVE JOB: <span className="text-accent-gold font-bold">{activeOrder.id}</span>
              </span>
            )}
          </div>

          <TrackingMap order={activeOrder} height="h-96" />
        </div>

        {/* Active Gig Controls (DoorDash / Uber Style Actions) */}
        {activeOrder ? (
          <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4 border-b border-white/5 pb-4">
              <div>
                <span className="text-[9px] uppercase font-mono tracking-widest text-[#bfa181] block mb-1">
                  Active Dispatch Transit
                </span>
                <h4 className="text-xl font-serif italic text-white flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-accent-gold" />
                  {activeOrder.shopName}
                </h4>
                <p className="text-xs text-[#e0e0e0]/55 flex items-center gap-1 mt-1 font-light">
                  <MapPin className="w-3.5 h-3.5 text-accent-gold" />
                  Courier Destination: <span className="text-white font-medium">{activeOrder.deliveryAddress} ({activeOrder.deliveryCity})</span>
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex flex-col items-end">
                <span className="text-[8px] text-white/30 font-mono uppercase tracking-wider">STATUS STAGE</span>
                <span className="px-2.5 py-1 bg-accent-gold/15 text-accent-gold border border-accent-gold/25 rounded-lg text-[10px] font-mono font-bold uppercase mt-1 tracking-wider">
                  {activeOrder.status === 'accepted' && 'heading to shop'}
                  {activeOrder.status === 'preparing' && 'at store / cooking'}
                  {activeOrder.status === 'picked_up' && 'driving to home'}
                  {activeOrder.status === 'arriving_soon' && 'at customer door'}
                  {activeOrder.status === 'delivered' && 'delivered'}
                </span>
              </div>
            </div>

            <div className="bg-[#151515] border border-white/5 rounded-xl p-4 mb-6">
              <h5 className="text-[10px] font-bold text-accent-gold uppercase tracking-widest font-mono mb-2">Package Contents</h5>
              <div className="space-y-1.5">
                {activeOrder.items.map((item) => (
                  <div key={item.product.id} className="text-xs text-[#e0e0e0]/60 flex justify-between">
                    <span>
                      {item.product.imageUrl || '📦'} {item.product.name} <strong className="text-white">x{item.quantity}</strong>
                    </span>
                    <span className="font-mono text-white/40">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Uber - DoorDash Style Action Transition button */}
            <div className="flex gap-4 items-center justify-between">
              <div className="flex-1 flex flex-col justify-center">
                <div className="text-[9px] text-white/35 font-mono uppercase tracking-wider">Payout potential</div>
                <div className="text-2xl font-bold text-accent-gold font-sans tracking-tight">
                  ${(activeOrder.deliveryFee + activeOrder.tip).toFixed(2)}
                </div>
              </div>

              <button
                onClick={promoteStatus}
                className="px-6 py-3 bg-accent-gold hover:brightness-110 text-black font-bold text-xs uppercase tracking-widest rounded-xl transition flex items-center gap-2 shadow-lg shadow-accent-gold/10"
              >
                <Play className="w-3.5 h-3.5 fill-black text-black" />
                {activeOrder.status === 'accepted' && 'I have Arrived at Store'}
                {activeOrder.status === 'preparing' && 'Package Picked Up (Leaving Store)'}
                {activeOrder.status === 'picked_up' && 'Arrived at Customer Door'}
                {activeOrder.status === 'arriving_soon' && 'Complete ID Verification & Dropoff'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[300px]">
            <span className="w-16 h-16 bg-[#151515] border border-white/5 rounded-full flex items-center justify-center text-3xl mb-4 select-none">
              📡
            </span>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">No Active Delivery Run</h4>
            <p className="text-xs text-[#e0e0e0]/45 max-w-sm mt-2 leading-relaxed font-light">
              To test the Courier Driver sandbox, either accept an open Triangle gig from the Left Feed tab, or go to the Customer tab to place a smoke shop order first!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
