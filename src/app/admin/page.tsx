'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  TrendingUp, 
  DollarSign, 
  ClipboardList, 
  Edit3, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Eye, 
  Search, 
  EyeOff, 
  Check, 
  AlertCircle,
  Database,
  ArrowLeft,
  Lock,
  Mail,
  LogOut
} from 'lucide-react';
import { getOrders, updateOrderStatus, getProducts, updateProduct, DBOrder, supabase } from '../../lib/supabase';
import { Product, ProductCategory, CATEGORIES } from '../../data/products';

export default function AdminDashboard() {
  const [isConfigured, setIsConfigured] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products'>('overview');
  
  // Data States
  const [orders, setOrders] = useState<DBOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filters
  const [orderFilter, setOrderFilter] = useState<DBOrder['status'] | 'all'>('all');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<ProductCategory | 'all'>('all');
  
  // Modals & Selected States
  const [selectedOrder, setSelectedOrder] = useState<DBOrder | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editPrice, setEditPrice] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);

  // Auth States
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Check Supabase configuration and auth on mount
  useEffect(() => {
    if (!supabase) {
      setIsConfigured(false);
      setCheckingAuth(false);
      setLoading(false);
      return;
    }
    
    checkUser();

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        verifyAdmin(session.user);
      } else {
        setUser(null);
        setCheckingAuth(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkUser() {
    setCheckingAuth(true);
    try {
      const { data: { user: currentUser } } = await supabase!.auth.getUser();
      if (currentUser) {
        await verifyAdmin(currentUser);
      } else {
        setUser(null);
        setCheckingAuth(false);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setCheckingAuth(false);
    }
  }

  async function verifyAdmin(currUser: any) {
    try {
      const { data, error } = await supabase!
        .from('sri_durga_admins')
        .select('email')
        .eq('email', currUser.email)
        .single();
        
      if (error || !data) {
        setAuthError("Access Denied: You are not authorized as an admin for Sri Durga Sweets & Bakery.");
        await supabase!.auth.signOut();
        setUser(null);
      } else {
        setUser(currUser);
        setAuthError('');
        loadData();
      }
    } catch (err) {
      setAuthError("Authorization verification failed.");
      await supabase!.auth.signOut();
      setUser(null);
    } finally {
      setCheckingAuth(false);
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    
    try {
      const { data, error } = await supabase!.auth.signInWithPassword({
        email: authEmail,
        password: authPassword
      });
      
      if (error) {
        setAuthError(error.message);
        setAuthLoading(false);
        return;
      }
      
      if (data.user) {
        await verifyAdmin(data.user);
      }
    } catch (err: any) {
      setAuthError(err.message || "Login failed");
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    await supabase!.auth.signOut();
    setUser(null);
    setOrders([]);
    setProducts([]);
  };

  async function loadData() {
    setLoading(true);
    try {
      const [fetchedOrders, fetchedProducts] = await Promise.all([
        getOrders(),
        getProducts()
      ]);
      setOrders(fetchedOrders);
      setProducts(fetchedProducts);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  }

  // Analytics Calculations
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const confirmedOrders = orders.filter(o => o.status === 'confirmed' || o.status === 'paid').length;
    
    // Revenue calculations (only from paid/confirmed orders)
    const totalRevenue = orders
      .filter(o => o.status === 'paid' || o.status === 'confirmed')
      .reduce((sum, o) => sum + Number(o.subtotal), 0);
      
    const pendingOrders = orders.filter(o => o.status === 'pending').length;

    return {
      totalOrders,
      confirmedOrders,
      totalRevenue,
      pendingOrders
    };
  }, [orders]);

  // Order filtering
  const filteredOrders = useMemo(() => {
    if (orderFilter === 'all') return orders;
    return orders.filter(o => o.status === orderFilter);
  }, [orders, orderFilter]);

  // Product filtering
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.id.toLowerCase().includes(productSearch.toLowerCase());
      const matchesCategory = productCategoryFilter === 'all' || p.category === productCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, productSearch, productCategoryFilter]);

  // Handle Order Status Change
  const handleStatusChange = async (orderId: string, newStatus: DBOrder['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) {
      alert("Failed to update status. Please try again.");
    }
  };

  // Open Product Edit Modal
  const startEditingProduct = (product: Product) => {
    setEditingProduct(product);
    const prices: Record<string, number> = {};
    if (product.price.quarter_kg !== undefined) prices.quarter_kg = product.price.quarter_kg;
    if (product.price.half_kg !== undefined) prices.half_kg = product.price.half_kg;
    if (product.price.one_kg !== undefined) prices.one_kg = product.price.one_kg;
    if (product.price.unit !== undefined) prices.unit = product.price.unit;
    setEditPrice(prices);
  };

  // Save Product Updates
  const handleSaveProduct = async () => {
    if (!editingProduct) return;
    setSubmitting(true);
    try {
      const updatedPrice = { ...editingProduct.price, ...editPrice };
      await updateProduct(editingProduct.id, { price: updatedPrice });
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, price: updatedPrice } : p));
      setEditingProduct(null);
    } catch (err) {
      alert("Failed to update product pricing.");
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Product Availability
  const handleToggleAvailability = async (productId: string, currentAvailable: boolean) => {
    try {
      const nextAvailable = !currentAvailable;
      await updateProduct(productId, { available: nextAvailable });
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, available: nextAvailable } : p));
    } catch (err) {
      alert("Failed to update availability.");
    }
  };

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-brand-cream/20 flex flex-col items-center justify-center p-6 text-brand-brown">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-lg border border-brand-brown/10 text-center">
          <Database className="w-16 h-16 text-brand-tan mx-auto mb-6" />
          <h1 className="font-serif text-3xl font-bold mb-4">Supabase Config Required</h1>
          <p className="text-brand-brown/70 mb-6 leading-relaxed">
            Please configure your Supabase environment variables in the <code className="bg-brand-cream px-1.5 py-0.5 rounded font-mono text-sm text-brand-tan">.env.local</code> file to run the admin dashboard:
          </p>
          <div className="bg-brand-cream/50 rounded-xl p-4 text-left font-mono text-xs text-brand-brown/90 mb-6 space-y-2 select-all">
            <div>NEXT_PUBLIC_SUPABASE_URL=your-supabase-url</div>
            <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key</div>
          </div>
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-brand-tan hover:text-brand-brown transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Storefront
          </Link>
        </div>
      </div>
    );
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-500">
        <div className="w-12 h-12 border-4 border-brand-tan border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-semibold text-sm">Verifying administration permissions...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-cream/20 flex flex-col items-center justify-center p-4 sm:p-6 text-brand-brown">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-brand-brown/10">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl font-bold text-brand-brown">Admin Portal</h2>
            <p className="text-sm text-brand-brown/60 mt-1">Sri Durga Sweets & Bakery</p>
          </div>
          
          {authError && (
            <div className="bg-red-50 text-red-700 text-xs font-semibold p-4 rounded-xl border border-red-100 flex items-start gap-2.5 mb-6">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-brand-brown/60 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-brown/40" />
                <input 
                  type="email"
                  required
                  placeholder="admin@sridurgasweets.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-brown/20 focus:outline-none focus:ring-2 focus:ring-brand-tan bg-white text-brand-brown placeholder:text-brand-brown/40 text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-brand-brown/60 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-brown/40" />
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-brown/20 focus:outline-none focus:ring-2 focus:ring-brand-tan bg-white text-brand-brown placeholder:text-brand-brown/40 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 bg-brand-tan hover:bg-[#b07848] disabled:opacity-50 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center mt-6 text-sm"
            >
              {authLoading ? 'Verifying...' : 'Sign In to Dashboard'}
            </button>
          </form>
          
          <div className="text-center mt-6">
            <Link href="/" className="inline-flex items-center text-xs font-semibold text-brand-brown/50 hover:text-brand-brown transition-colors">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* Admin Navbar */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 font-sans">
            <div className="flex items-center space-x-3">
              <Link href="/" className="font-serif font-bold tracking-tight hover:text-brand-tan transition-colors select-none leading-none flex flex-col sm:flex-row sm:items-baseline">
                <span className="text-base sm:text-xl">Sri Durga Sweets</span>
                <span className="text-[10px] sm:text-xl text-brand-tan sm:text-white sm:ml-1.5 font-sans sm:font-serif uppercase sm:normal-case tracking-widest sm:tracking-normal mt-0.5 sm:mt-0">
                  &amp; Bakery
                </span>
              </Link>
              <span className="bg-slate-800 text-slate-400 text-xs px-2.5 py-1 rounded-md font-semibold tracking-wider uppercase border border-slate-700">
                Admin
              </span>
            </div>
            
            <nav className="flex space-x-1 sm:space-x-2">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-slate-800 text-brand-tan' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'}`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-slate-800 text-brand-tan' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'}`}
              >
                Orders
              </button>
              <button 
                onClick={() => setActiveTab('products')}
                className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'products' ? 'bg-slate-800 text-brand-tan' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'}`}
              >
                Products
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="hidden lg:block text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Signed In As</div>
                <div className="text-xs text-brand-tan font-bold truncate max-w-[120px]">{user.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-all flex items-center gap-1.5 text-xs font-bold"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" /> <span className="hidden md:inline">Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 border-4 border-brand-tan border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Loading dashboard data...</p>
          </div>
        ) : (
          <>
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fadeIn">
                
                {/* Dashboard Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Analytics Overview</h1>
                    <p className="text-slate-500 text-sm mt-1">Real-time statistics of redirects and order status.</p>
                  </div>
                  <button 
                    onClick={loadData}
                    className="px-4 py-2 text-sm bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    Refresh Data
                  </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Revenue Card */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Revenue</span>
                      <h3 className="text-3xl font-bold text-slate-900 mt-2">₹{stats.totalRevenue.toLocaleString('en-IN')}</h3>
                      <p className="text-xs text-emerald-600 mt-1 font-medium flex items-center">
                        <TrendingUp className="w-3.5 h-3.5 mr-1" /> From paid/confirmed orders
                      </p>
                    </div>
                    <div className="p-4 bg-emerald-50 text-emerald-500 rounded-xl">
                      <DollarSign className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Total Orders Card */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Orders</span>
                      <h3 className="text-3xl font-bold text-slate-900 mt-2">{stats.totalOrders}</h3>
                      <p className="text-xs text-slate-400 mt-1">Redirected to WhatsApp</p>
                    </div>
                    <div className="p-4 bg-blue-50 text-blue-500 rounded-xl">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Confirmed Orders Card */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirmed & Paid</span>
                      <h3 className="text-3xl font-bold text-slate-900 mt-2">{stats.confirmedOrders}</h3>
                      <p className="text-xs text-slate-400 mt-1">Orders processed & finalized</p>
                    </div>
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Pending Orders Card */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Orders</span>
                      <h3 className="text-3xl font-bold text-slate-900 mt-2">{stats.pendingOrders}</h3>
                      <p className="text-xs text-amber-600 mt-1 font-medium flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" /> Awaiting confirmation
                      </p>
                    </div>
                    <div className="p-4 bg-amber-50 text-amber-500 rounded-xl">
                      <ClipboardList className="w-6 h-6" />
                    </div>
                  </div>

                </div>

                {/* Recent Orders Overview */}
                <div className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-serif text-lg font-bold text-slate-900">Recent WhatsApp Redirects</h3>
                    <button 
                      onClick={() => setActiveTab('orders')}
                      className="text-sm font-semibold text-brand-tan hover:text-[#b07848] transition-colors"
                    >
                      View All Orders
                    </button>
                  </div>
                  
                  {orders.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                      No orders recorded yet. Add items to cart and check out to see them here!
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold uppercase text-xs">
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Items</th>
                            <th className="px-6 py-4">Subtotal</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {orders.slice(0, 5).map((order) => (
                            <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 font-semibold text-slate-900">
                                <div>{order.customer_name}</div>
                                <div className="text-xs text-slate-400 font-normal mt-0.5">{order.customer_phone}</div>
                              </td>
                              <td className="px-6 py-4 text-slate-600 truncate max-w-xs">
                                {order.items.map((i: any) => `${i.product_name} (x${i.quantity})`).join(', ')}
                              </td>
                              <td className="px-6 py-4 font-bold text-slate-900">₹{order.subtotal}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                                  order.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                                  order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                  'bg-amber-100 text-amber-800'
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-slate-400">
                                {new Date(order.created_at || '').toLocaleDateString('en-IN', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button 
                                  onClick={() => setSelectedOrder(order)}
                                  className="text-slate-500 hover:text-brand-tan p-1 transition-colors"
                                >
                                  <Eye className="w-5 h-5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Manage Orders</h1>
                    <p className="text-slate-500 text-sm mt-1">Review orders and modify their workflow statuses.</p>
                  </div>
                  
                  {/* Status Filters */}
                  <div className="flex bg-slate-200/50 border border-slate-200 p-1 rounded-xl">
                    {(['all', 'pending', 'confirmed', 'paid', 'cancelled'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setOrderFilter(tab)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg capitalize transition-colors ${orderFilter === tab ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
                  {filteredOrders.length === 0 ? (
                    <div className="p-16 text-center text-slate-400">
                      No orders matches the filter "{orderFilter}".
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold uppercase text-xs">
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Items Ordered</th>
                            <th className="px-6 py-4">Subtotal</th>
                            <th className="px-6 py-4">Workflow Status</th>
                            <th className="px-6 py-4">Date & Time</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 font-semibold text-slate-900">
                                <div>{order.customer_name}</div>
                                <div className="text-xs text-slate-400 font-normal mt-0.5">{order.customer_phone}</div>
                              </td>
                              <td className="px-6 py-4 text-slate-600 truncate max-w-sm">
                                {order.items.map((i: any) => `${i.product_name} (x${i.quantity})`).join(', ')}
                              </td>
                              <td className="px-6 py-4 font-bold text-slate-900">₹{order.subtotal}</td>
                              <td className="px-6 py-4">
                                <select
                                  value={order.status}
                                  onChange={(e) => handleStatusChange(order.id!, e.target.value as DBOrder['status'])}
                                  className={`px-3 py-1 rounded-lg border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-tan capitalize ${
                                    order.status === 'paid' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                                    order.status === 'confirmed' ? 'bg-blue-50 border-blue-200 text-blue-800' :
                                    order.status === 'cancelled' ? 'bg-red-50 border-red-200 text-red-800' :
                                    'bg-amber-50 border-amber-200 text-amber-800'
                                  }`}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="paid">Paid</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </td>
                              <td className="px-6 py-4 text-slate-400">
                                {new Date(order.created_at || '').toLocaleDateString('en-IN', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button 
                                  onClick={() => setSelectedOrder(order)}
                                  className="text-slate-500 hover:text-brand-tan p-2 transition-colors flex items-center justify-center gap-1.5 ml-auto text-xs bg-slate-100 hover:bg-brand-cream/50 rounded-lg border border-slate-200 font-semibold"
                                >
                                  <Eye className="w-4 h-4" /> View Msg
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PRODUCTS TAB */}
            {activeTab === 'products' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Product Inventory</h1>
                    <p className="text-slate-500 text-sm mt-1">Adjust pricing, update stock availability, and manage items.</p>
                  </div>
                  
                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative flex-grow sm:w-64">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input 
                        type="text"
                        placeholder="Search product name..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-tan text-sm"
                      />
                    </div>
                    
                    <select
                      value={productCategoryFilter}
                      onChange={(e) => setProductCategoryFilter(e.target.value as ProductCategory | 'all')}
                      className="px-3 py-2 border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-tan text-sm capitalize"
                    >
                      <option value="all">All Categories</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Product Inventory Table */}
                <div className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold uppercase text-xs">
                          <th className="px-6 py-4">Item details</th>
                          <th className="px-6 py-4">Category</th>
                          <th className="px-6 py-4">Pricing structure</th>
                          <th className="px-6 py-4">Stock Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredProducts.map((product) => {
                          const hasPriceByWeight = product.price.quarter_kg !== undefined || product.price.half_kg !== undefined || product.price.one_kg !== undefined;
                          return (
                            <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 relative">
                                    <img 
                                      src={product.image} 
                                      alt={product.name} 
                                      className="object-cover w-full h-full"
                                    />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-slate-900">{product.name}</div>
                                    <div className="text-xs font-mono text-slate-400 mt-0.5">{product.id}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 capitalize text-slate-500 font-medium">
                                {product.category.replace('-', ' ')}
                              </td>
                              <td className="px-6 py-4 text-slate-600">
                                {hasPriceByWeight ? (
                                  <div className="space-y-1 text-xs">
                                    {product.price.quarter_kg !== undefined && <div>¼ kg: <span className="font-semibold text-slate-900">₹{product.price.quarter_kg}</span></div>}
                                    {product.price.half_kg !== undefined && <div>½ kg: <span className="font-semibold text-slate-900">₹{product.price.half_kg}</span></div>}
                                    {product.price.one_kg !== undefined && <div>1 kg: <span className="font-semibold text-slate-900">₹{product.price.one_kg}</span></div>}
                                  </div>
                                ) : (
                                  <div>Unit: <span className="font-semibold text-slate-900">₹{product.price.unit}</span></div>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <button
                                  onClick={() => handleToggleAvailability(product.id, product.available !== false)}
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                                    product.available !== false
                                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                                      : 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100'
                                  }`}
                                >
                                  {product.available !== false ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 mr-1" /> Available
                                    </>
                                  ) : (
                                    <>
                                      <AlertCircle className="w-3.5 h-3.5 mr-1" /> Sold Out
                                    </>
                                  )}
                                </button>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={() => startEditingProduct(product)}
                                  className="text-slate-600 hover:text-brand-tan p-2 transition-colors flex items-center justify-center gap-1.5 ml-auto text-xs bg-slate-100 hover:bg-brand-cream/50 rounded-lg border border-slate-200 font-semibold"
                                >
                                  <Edit3 className="w-4 h-4" /> Edit Price
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          </>
        )}

      </main>

      {/* VIEW ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] animate-zoomIn">
            <div className="px-6 py-5 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="font-serif text-lg font-bold">WhatsApp Order Receipt</h3>
                <p className="text-xs text-slate-400 mt-0.5">ID: {selectedOrder.id}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 flex-grow">
              
              {/* Customer Contact */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Customer Name</span>
                  <div className="font-bold text-slate-900 mt-1">{selectedOrder.customer_name}</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Contact Number</span>
                  <div className="font-bold text-slate-900 mt-1">{selectedOrder.customer_phone}</div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Delivery Address</span>
                <div className="text-sm font-medium text-slate-800 mt-1 leading-relaxed">{selectedOrder.customer_address}</div>
              </div>

              {/* Order Raw Msg */}
              <div>
                <span className="text-xs font-bold text-slate-400 block mb-2 uppercase tracking-wider">Raw WhatsApp Message Generated</span>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono whitespace-pre-wrap max-h-60 overflow-y-auto border border-slate-800 leading-relaxed">
                  {selectedOrder.whatsapp_message}
                </pre>
              </div>

              {/* Status Update Quick Bar */}
              <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Modify Status</span>
                <div className="flex gap-2">
                  {(['pending', 'confirmed', 'paid', 'cancelled'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedOrder.id!, st)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors capitalize ${
                        selectedOrder.status === st 
                          ? 'bg-slate-900 border-slate-900 text-white' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT PRICE MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col animate-zoomIn">
            <div className="px-6 py-5 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="font-serif text-lg font-bold">Edit Product Pricing</h3>
                <p className="text-xs text-slate-400 mt-0.5">{editingProduct.name}</p>
              </div>
              <button 
                onClick={() => setEditingProduct(null)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              
              {Object.keys(editPrice).map((weightKey) => (
                <div key={weightKey} className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider capitalize">
                    Price ({
                      weightKey === 'quarter_kg' ? '¼ kg' :
                      weightKey === 'half_kg' ? '½ kg' :
                      weightKey === 'one_kg' ? '1 kg' : 'Unit'
                    })
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-400 text-sm font-semibold">₹</span>
                    <input 
                      type="number"
                      value={editPrice[weightKey] || ''}
                      onChange={(e) => setEditPrice({ ...editPrice, [weightKey]: Number(e.target.value) })}
                      className="w-full pl-7 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-tan text-sm font-semibold"
                    />
                  </div>
                </div>
              ))}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 py-3 text-sm font-bold border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProduct}
                  disabled={submitting}
                  className="flex-1 py-3 text-sm font-bold bg-brand-tan hover:bg-[#b07848] text-white rounded-xl shadow-md transition-all flex items-center justify-center"
                >
                  {submitting ? 'Saving...' : 'Save Pricing'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
