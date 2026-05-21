import React, { useState, useEffect } from 'react';
import { Order, Product, Shop } from '../types';
import { MOCK_SHOPS } from '../data/shops';
import { Link, Globe, RefreshCw, Terminal, Copy, Check, ExternalLink, Code, AlertCircle, Database, Cpu, Send, CheckCircle2 } from 'lucide-react';

interface IntegrationStudioProps {
  orders: Order[];
  onSyncCustomCatalog?: (shopId: string, customProducts: Product[]) => void;
}

interface WebhookLog {
  id: string;
  timestamp: string;
  url: string;
  payload: string;
  status: 'pending' | 'success' | 'failed' | 'cors_blocked';
  response?: string;
}

export default function IntegrationStudio({ orders, onSyncCustomCatalog }: IntegrationStudioProps) {
  // Config states
  const [webhookUrl, setWebhookUrl] = useState(() => {
    return localStorage.getItem('ns_webhook_url') || 'http://localhost:5000/api/northside-webhook';
  });
  const [hmacSecret, setHmacSecret] = useState(() => {
    return localStorage.getItem('ns_hmac_secret') || 'ns_sec_prod_919_secret';
  });
  const [customCatalogUrl, setCustomCatalogUrl] = useState(() => {
    return localStorage.getItem('ns_catalog_url') || '';
  });

  const [activeCodeTab, setActiveCodeTab] = useState<'express' | 'python' | 'nextjs'>('express');
  const [copiedText, setCopiedText] = useState<string>('');
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'loading' | 'success' | 'failed'>('idle');
  const [syncMessage, setSyncMessage] = useState<string>('');

  // Persist settings
  useEffect(() => {
    localStorage.setItem('ns_webhook_url', webhookUrl);
  }, [webhookUrl]);

  useEffect(() => {
    localStorage.setItem('ns_hmac_secret', hmacSecret);
  }, [hmacSecret]);

  useEffect(() => {
    localStorage.setItem('ns_catalog_url', customCatalogUrl);
  }, [customCatalogUrl]);

  const handleCopy = (code: string, tab: string) => {
    navigator.clipboard.writeText(code);
    setCopiedText(tab);
    setTimeout(() => setCopiedText(''), 2000);
  };

  // Run a manual trigger test webhook payload
  const handleTestWebhook = async () => {
    if (!webhookUrl) return;

    const testPayload: Partial<Order> = orders[0] || {
      id: 'NSE-TEST-9999',
      items: [
        {
          product: {
            id: 'p1_6',
            name: 'Northern Lights Premium Flower (3.5g)',
            description: 'Curated organic, laboratory-tested hemp flower.',
            price: 34.90,
            imageUrl: '🌸',
            category: 'Flower',
            rating: 4.9,
            reviewsCount: 142,
            inStock: true
          },
          shopId: 'shop_1',
          shopName: 'Capital Vapor, Smoke & Cigar',
          quantity: 1
        }
      ],
      shopId: 'shop_1',
      shopName: 'Capital Vapor, Smoke & Cigar',
      shopAddress: '3203 Hillsborough St, Raleigh, NC 27607',
      deliveryAddress: '2512 Hillsborough St, Raleigh, NC 27607',
      subtotal: 34.90,
      deliveryFee: 3.99,
      serviceFee: 1.99,
      tax: 2.44,
      tip: 6.98,
      total: 50.30,
      status: 'placed',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedDeliveryTime: '20-30 min'
    };

    const newLogId = `log-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString();
    
    // Create pre-log
    const newLog: WebhookLog = {
      id: newLogId,
      timestamp,
      url: webhookUrl,
      payload: JSON.stringify(testPayload, null, 2),
      status: 'pending'
    };

    setLogs(prev => [newLog, ...prev]);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Northside-Signature': hmacSecret || 'none'
        },
        body: JSON.stringify(testPayload)
      });

      if (response.ok) {
        const text = await response.text();
        setLogs(prev => prev.map(l => l.id === newLogId ? { ...l, status: 'success', response: text || '200 OK (Empty Response)' } : l));
      } else {
        setLogs(prev => prev.map(l => l.id === newLogId ? { ...l, status: 'failed', response: `Error Status: ${response.status} ${response.statusText}` } : l));
      }
    } catch (err: any) {
      console.warn('Webhook dispatch generated simulated log bypass: ', err);
      // In web browsers, fetch is often blocked by CORS policy if sending to a local server without CORS configured.
      // We categorize this specifically so the user understands what to do.
      setLogs(prev => prev.map(l => l.id === newLogId ? { 
        ...l, 
        status: 'cors_blocked', 
        response: `CORS Blocked or Server Unloaded.\nBrowser detected fetch error: "${err.message || err}".\nMake sure your online dispensary server allows cross-origin requests from this preview domain, or use the Node.js CORS middleware template below.` 
      } : l));
    }
  };

  // Synchronize active shop inventory with custom dispensary catalog URL
  const handleFetchCustomCatalog = async () => {
    if (!customCatalogUrl) {
      setSyncStatus('failed');
      setSyncMessage('Please provide a valid JSON feed URL (e.g., local URL or raw GitHub content URL).');
      return;
    }

    setSyncStatus('loading');
    try {
      const response = await fetch(customCatalogUrl);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      const data = await response.json();

      // Check format
      if (!Array.isArray(data)) {
        throw new Error('Invalid schema format. Expected a JSON array of products.');
      }

      // Validating structure safely to prevent crashes on null/primitive list entries
      const validProducts: Product[] = data
        .filter((item: any) => item && typeof item === 'object')
        .map((item: any, idx: number) => ({
          id: item.id ? String(item.id) : `custom-${idx}`,
          name: item.name ? String(item.name) : 'Custom Product',
          description: item.description ? String(item.description) : 'Dispensary sourced dynamic accessory/flower.',
          price: typeof item.price === 'number' && !isNaN(item.price) ? item.price : 10.00,
          imageUrl: item.imageUrl ? String(item.imageUrl) : '🌿',
          category: (['Flower', 'Pre-rolls', 'Vapes', 'Cigars', 'Accessories', 'Glass & Pipes', 'Papers & Rolling'].includes(item.category) 
                    ? item.category 
                    : 'Flower') as any,
          rating: typeof item.rating === 'number' && !isNaN(item.rating) ? item.rating : 4.8,
          reviewsCount: typeof item.reviewsCount === 'number' && !isNaN(item.reviewsCount) ? item.reviewsCount : 24,
          inStock: typeof item.inStock === 'boolean' ? item.inStock : true,
        }));

      if (onSyncCustomCatalog) {
        onSyncCustomCatalog('shop_1', validProducts); // sync into Capital Vapor
        setSyncStatus('success');
        setSyncMessage(`Successfully fetched and injected ${validProducts.length} items from your dispensary catalog into Capital Vapor!`);
      } else {
        throw new Error('Active Catalog handler not registered in mother component.');
      }
    } catch (err: any) {
      setSyncStatus('failed');
      setSyncMessage(`Failed to synchronize. Error logic: "${err.message || err}". Ensure CORS header 'Access-Control-Allow-Origin: *' is configured on your server.`);
    }
  };

  // Node + Express code template matching our system
  const EXPRESS_CODE = `// ncsound919/Northside-Smoke: Node.js Webhook Receiver
// Save as express-webhook.js, run: npm install express cors body-parser
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// CRITICAL: Configure CORS to receive delivery updates from our browser preview frame!
app.use(cors({
  origin: '*', // For debugging. Restrict to preview origin in production
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Northside-Signature']
}));

app.use(express.json());

// Main webhook receiver
app.post('/api/northside-webhook', (req, res) => {
  const signature = req.headers['x-northside-signature'];
  const order = req.body;
  
  console.log(\`🔌 Received Northside dispatch event signature: \${signature}\`);
  console.log(\`📦 ORDER ID: \${order.id} | Customer: \${order.customerName}\`);
  console.log(\`📍 Address: \${order.deliveryAddress}, \${order.deliveryCity}\`);
  console.log(\`💰 Order Total: \$\${order.total} (Subtotal: \$\${order.subtotal})\`);
  
  // Custom parsing to match ncsound919/Northside-Smoke inventory database
  console.log('--- Items Ordered ---');
  if (Array.isArray(order.items)) {
    order.items.forEach(item => {
      console.log(\`• [\${item.quantity}x] \${item.product.name} (\$\${item.product.price})\`);
    });
  }

  // Handle local database storage or push notifications here
  
  res.status(200).json({ status: 'dispatched', trackingId: order.id, message: 'Dispensary received carriage command' });
});

app.listen(PORT, () => {
  console.log(\`🚀 Dispensary webhook listener operational on port \${PORT}\`);
});`;

  const NEXTJS_CODE = `// Next.js Route Handler for ncsound919/Northside-Smoke
// Save in: app/api/webhook/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const signature = request.headers.get('x-northside-signature');
    const order = await request.json();

    console.log('Webhook triggered. ID:', order.id);

    // Business Logic - Connect to your PostgreSQL or local inventory system
    // ...

    return NextResponse.json({ 
      success: true, 
      receivedOrder: order.id,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Northside-Signature'
    }
  });
}`;

  const PYTHON_CODE = `# ncsound919/Northside-Smoke: Python Flask Webhook Service
# pip install flask flask-cors
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

@app.route('/api/northside-webhook', methods=['POST'])
def receive_webhook():
    signature = request.headers.get('X-Northside-Signature')
    order = request.json
    
    print(f"🔌 Event Signature: {signature}")
    print(f"📦 Order {order['id']} placed for {order['customerName']}")
    print(f"📍 Location: {order['deliveryAddress']}")
    print(f"💰 Sum: \${order['total']}")
    
    # Process dispensary dispatch logic...
    return jsonify({
        "status": "success",
        "order_acknowledged": order['id']
    }), 200

if __name__ == '__main__':
    app.run(port=5000)
`;

  return (
    <div className="space-y-8" id="integration-studio-root">
      
      {/* Upper header */}
      <header className="relative bg-gradient-to-br from-[#121212] to-[#080808] border border-white/5 rounded-3xl p-8 md:p-10 flex flex-col justify-end overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent-gold/10 blur-[130px] rounded-full" />
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-accent-gold animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-accent-gold font-bold">REPOSYNC HUB</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif italic text-white leading-none tracking-tight">
            Integration Studio.
          </h1>
          <p className="text-sm md:text-base text-[#e0e0e0]/60 font-light leading-relaxed">
            Diagnose, examine, and configure real-time connections to your online dispensary codebase at{' '}
            <a 
              href="https://github.com/ncsound919/Northside-Smoke" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-accent-gold hover:underline font-mono inline-flex items-center gap-1"
            >
              ncsound919/Northside-Smoke <ExternalLink className="w-3 h-3" />
            </a>.
          </p>
        </div>
      </header>

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Settings column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0d0d0d] border border-white/5 p-6 rounded-2xl space-y-6">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Globe className="w-4 h-4 text-accent-gold" />
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">Dispensary Endpoints</h3>
            </div>

            {/* Field 1: Webhook Address */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono text-white/50 block">Dispatch Webhook URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="e.g. http://localhost:5000/api/northside-webhook"
                  className="flex-1 px-3 py-2.5 bg-[#050505] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-accent-gold/50 font-mono"
                />
              </div>
              <p className="text-[9px] text-[#e0e0e0]/40 leading-normal font-light">
                Order dispatches placed from the Buyer Feed will be broadcasted to this URL as a JSON POST payload.
              </p>
            </div>

            {/* Field 2: Token Secret */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono text-white/50 block">HMAC Signature Key</label>
              <input
                type="text"
                value={hmacSecret}
                onChange={(e) => setHmacSecret(e.target.value)}
                placeholder="Secure validation key"
                className="w-full px-3 py-2.5 bg-[#050505] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-accent-gold/50 font-mono"
              />
              <p className="text-[9px] text-[#e0e0e0]/40 leading-normal font-light">
                Transmitted under headers as <code className="text-accent-gold bg-[#050505] px-1 py-0.5 rounded">X-Northside-Signature</code>. Perfect for server validations.
              </p>
            </div>

            {/* Diagnostic Button */}
            <button
              disabled={!webhookUrl}
              onClick={handleTestWebhook}
              className={`w-full py-3 bg-accent-gold/10 hover:bg-accent-gold/20 border border-accent-gold/30 text-accent-gold text-[10px] uppercase tracking-widest font-bold rounded-xl transition flex items-center justify-center gap-2 ${
                !webhookUrl ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              Send Diagnostic Webhook Event
            </button>
          </div>

          {/* Dynamic Catalog Import Panel */}
          <div className="bg-[#0d0d0d] border border-white/5 p-6 rounded-2xl space-y-5">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Database className="w-4 h-4 text-accent-gold" />
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">Dynamic Catalog Sync</h3>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono text-white/50 block">Dispensary Catalog JSON URL</label>
              <input
                type="text"
                value={customCatalogUrl}
                onChange={(e) => setCustomCatalogUrl(e.target.value)}
                placeholder="e.g. http://localhost:5000/api/products"
                className="w-full px-3 py-2.5 bg-[#050505] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-accent-gold/50 font-mono text-left"
              />
              <p className="text-[9px] text-[#e0e0e0]/40 leading-normal font-light">
                Synchronize this app with live pricing or inventory structures stored directly on your dispensary servers!
              </p>
            </div>

            <button
              onClick={handleFetchCustomCatalog}
              disabled={syncStatus === 'loading'}
              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] uppercase tracking-widest font-bold rounded-xl transition flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === 'loading' ? 'animate-spin' : ''}`} />
              Fetch and Synchronize Menu
            </button>

            {/* Sync Notifications */}
            {syncStatus === 'success' && (
              <div className="bg-emerald-950/20 border border-emerald-500/20 p-3.5 rounded-xl flex gap-2 items-start text-[11px] text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{syncMessage}</span>
              </div>
            )}
            {syncStatus === 'failed' && (
              <div className="bg-rose-950/25 border border-rose-500/25 p-3.5 rounded-xl flex gap-2 items-start text-[11px] text-rose-300/90 leading-relaxed">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{syncMessage}</span>
              </div>
            )}

            <div className="bg-[#151515]/30 p-3 rounded-lg border border-white/5 text-[9.5px] text-[#e0e0e0]/55 font-light leading-relaxed">
              <span className="font-mono text-accent-gold uppercase font-bold block mb-1">Expected JSON Format:</span>
              <pre className="bg-[#050505] p-2 rounded block font-mono text-[8px] text-white/50 overflow-x-auto">
{`[
  {
    "id": "dispensary-p1",
    "name": "Northside Reserve Pre-Roll",
    "description": "Custom dispensary ground flower",
    "price": 12.99,
    "category": "Pre-rolls",
    "imageUrl": "🌱"
  }
]`}
              </pre>
            </div>
          </div>
        </div>

        {/* Console / Boilerplate code generators */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Terminal Webhook Monitor logs */}
          <div className="bg-black border border-white/10 rounded-2xl overflow-hidden shadow">
            
            <div className="bg-[#0d0d0d] px-4 py-3 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-accent-gold" />
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-white">Event Stream Monitor</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-mono text-emerald-400/90 uppercase">Active Diagnostics</span>
              </div>
            </div>

            <div className="p-4 space-y-4 max-h-[340px] overflow-y-auto font-mono text-left scrollbar-thin">
              {logs.length === 0 ? (
                <div className="py-20 text-center text-[#e0e0e0]/30 text-xs">
                  <p>No delivery dispatch signals captured yet.</p>
                  <p className="text-[10px] text-white/20 mt-1">Place an order under Buyer Feed or tap 'Send Test' to debug.</p>
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="border-b border-white/5 pb-3.5 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-accent-gold font-bold">[{log.timestamp}] POST Event</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                        log.status === 'success' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30' :
                        log.status === 'cors_blocked' ? 'bg-[#291710] text-[#ff8040] border border-[#ff8040]/30' :
                        log.status === 'pending' ? 'bg-white/5 text-[#e0e0e0]/80' :
                        'bg-rose-950/40 text-rose-400 border border-rose-500/30'
                      }`}>
                        {log.status === 'success' && '200 OK'}
                        {log.status === 'cors_blocked' && 'CORS Block / Network Error'}
                        {log.status === 'pending' && 'Transmitting...'}
                        {log.status === 'failed' && 'Transmission Failed'}
                      </span>
                    </div>

                    <div className="bg-[#0c0c0c] border border-white/5 p-2 rounded text-[10px] text-white/60 overflow-x-auto max-h-36">
                      <p className="text-[9px] text-[#e0e0e0]/40 uppercase mb-1">Signed Headers Payload Sample:</p>
                      <pre className="text-white/80">{log.payload}</pre>
                    </div>

                    {log.response && (
                      <div className="bg-[#1c120c]/40 border border-[#402010]/30 p-2.5 rounded text-[9.5px]">
                        <span className="text-[8px] text-[#ff8040] uppercase tracking-wider block font-bold mb-1">Server Response / Diagnose Trace:</span>
                        <pre className="font-sans text-[#e0e0e0]/80 leading-relaxed max-w-full overflow-x-auto whitespace-pre-wrap">{log.response}</pre>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Boilerplate generators */}
          <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-accent-gold" />
                <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">Receiver Boilerplates</h3>
              </div>
            </div>

            <p className="text-xs text-[#e0e0e0]/50 font-light leading-relaxed">
              Use these certified templates inside your digital storefront server (<span className="text-white font-mono font-bold">ncsound919/Northside-Smoke</span>) to handle, route, and capture these delivery events effortlessly.
            </p>

            {/* Language tabs */}
            <div className="flex bg-[#050505] p-1 border border-white/5 rounded-xl max-w-fit">
              {[
                { id: 'express', label: 'Node Express' },
                { id: 'nextjs', label: 'Next.js API Route' },
                { id: 'python', label: 'Python Flask' }
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setActiveCodeTab(lang.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase font-bold transition ${
                    activeCodeTab === lang.id
                      ? 'bg-[#151515] border border-white/5 text-accent-gold'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Code pane */}
            <div className="relative">
              <button
                onClick={() => handleCopy(
                  activeCodeTab === 'express' ? EXPRESS_CODE : activeCodeTab === 'nextjs' ? NEXTJS_CODE : PYTHON_CODE, 
                  activeCodeTab
                )}
                className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/60 border border-white/5 hover:border-white/15 rounded-lg text-white/60 hover:text-white transition cursor-pointer"
                title="Copy to clipboard"
              >
                {copiedText === activeCodeTab ? (
                  <Check className="w-3.5 h-3.5 text-[#5dfd9d]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

              <div className="font-mono text-[9.5px] bg-[#050505] rounded-xl overflow-x-auto text-white/70 p-4 border border-white/5 max-h-[320px] leading-relaxed text-left">
                <pre>{activeCodeTab === 'express' ? EXPRESS_CODE : activeCodeTab === 'nextjs' ? NEXTJS_CODE : PYTHON_CODE}</pre>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
