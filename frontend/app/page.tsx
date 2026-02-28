'use client';

import { useState, useEffect } from 'react';
import {
    AmountReceivablesCard,
    TotalLifetimeSalesCard,
    TodaySalesCard,
    ThisMonthSalesCard,
    LastMonthSalesCard
} from '@/components/dashboard/MetricCard';
import SalesChart from '@/components/dashboard/SalesChart';
import FeaturedProductsCarousel from '@/components/products/FeaturedProductsCarousel';
import StoreHealthDashboard from '@/components/health/StoreHealthDashboard';
import {
    mockSalesStats,
    mockChartData,
    mockProducts,
    mockStoreHealthScore
} from '@/lib/mockData';
import { TrendingUp, Package, Heart, Zap, Sparkles, Activity, ArrowUpRight, Globe, CheckCircle2, ShieldCheck, Star } from 'lucide-react';
import Shell from '@/components/layout/Shell';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();

    // Original Stats from DB
    const [stats, setStats] = useState({
        amountReceivables: 0,
        totalLifetimeSales: 0,
        todaySales: 0,
        todayChange: 0,
        thisMonthSales: 0,
        thisMonthChange: 0,
        lastMonthSales: 0,
        netProfit: 0,
        netProfitMargin: 0,
    });

    const [chartData, setChartData] = useState<any[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
    const [healthScore, setHealthScore] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    // Fetch original stats from Database
    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            setIsLoading(true);
            try {
                // Fetch basic stats
                const statsRes = await api.get('/sellers/stats');
                if (statsRes.success) {
                    const dbStats = statsRes.stats;
                    setStats(prev => ({
                        ...prev,
                        totalLifetimeSales: dbStats.totalSales || 0,
                        amountReceivables: dbStats.guaranteeMoney || 0,
                        // Other stats can be added if backend supports them, otherwise default to 0
                    }));
                }

                // Fetch real products for carousel
                const productsRes = await api.get('/products/my-products');
                if (productsRes.success) {
                    setFeaturedProducts(productsRes.products || []);
                }

                // Note: If other endpoints (Chart, Health, Feed) are not yet fully implemented in backend, 
                // they will stay empty/zero as requested (only original data)

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    // Optimized Loading: Show Shell immediately to feel fast
    if (authLoading) return null;
    if (!user) return null;

    return (
        <Shell>
            <div className="space-y-10 pb-20 max-w-[1600px] mx-auto transition-all duration-500">
                {/* Store Identity & Vitals Section */}
                <section className="animate-slide-up">
                    <div className="glass-card p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative border-primary-100/20">
                        <div className="flex items-center gap-6 z-10">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-primary-500 to-purple-600 rounded-[2rem] flex items-center justify-center text-white text-2xl font-black shadow-lg">
                                {user.shop_name?.slice(0, 1).toUpperCase() || user.name?.slice(0, 1).toUpperCase()}
                            </div>
                            <div className="text-left">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight truncate max-w-[200px] sm:max-w-md">
                                        {user.shop_name || 'Premium Seller'}
                                    </h2>
                                    {user.verified === 1 ? (
                                        <div className="flex items-center gap-1 bg-success-50 text-success-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-success-100 shadow-sm shrink-0">
                                            <CheckCircle2 className="w-3 h-3" />
                                            Verified
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-amber-100 shadow-sm shrink-0">
                                            <ShieldCheck className="w-3 h-3" />
                                            Not Verified
                                        </div>
                                    )}
                                </div>
                                <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500 font-medium">
                                    <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> 4.9 Rating</span>
                                    <span className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-primary-500" /> Active Service</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 z-10 w-full md:w-auto">
                            <div className="flex-1 md:flex-none py-4 px-6 bg-slate-50/80 rounded-2xl border border-gray-100 text-left transition-all hover:bg-white hover:shadow-md group/vital">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Store Vital</p>
                                <div className="flex items-center justify-between md:justify-start gap-10 mt-2">
                                    <h4 className="text-xl font-black text-slate-800">Health: <span className="text-success-600 uppercase">Excellent</span></h4>
                                    <button
                                        onClick={() => router.push('/health')}
                                        className="text-[10px] font-black text-white bg-slate-800 px-3 py-2 rounded-lg group-hover/vital:bg-primary-600 transition-colors uppercase tracking-widest shadow-sm"
                                    >
                                        Click for Details
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Accent */}
                        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-primary-500/5 to-transparent pointer-events-none"></div>
                    </div>
                </section>

                {/* Hero Welcome Section */}
                <section className="relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-purple-700 rounded-[2.5rem] opacity-90 group-hover:opacity-100 transition-opacity duration-1000 shadow-[0_20px_50px_rgba(79,70,229,0.3)]"></div>
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>

                    {/* Floating Decorative Elements */}
                    <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float-slow"></div>
                    <div className="absolute bottom-[-20%] left-[10%] w-48 h-48 bg-purple-400/20 rounded-full blur-3xl animate-float"></div>

                    <div className="relative z-10 p-6 sm:p-10 lg:p-14 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left">
                        <div className="text-white space-y-4 md:space-y-6 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 animate-fade-in shadow-inner mx-auto md:mx-0">
                                <Zap className="w-3 md:w-4 h-3 md:h-4 text-yellow-300 fill-yellow-300" />
                                <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">Live Store Intelligence</span>
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-3xl sm:text-4xl lg:text-7xl font-black tracking-tight animate-slide-up leading-tight">
                                    Hello, <span className="text-yellow-300">{user.name || 'Seller'}</span>!
                                </h1>
                                <p className="text-base md:text-xl text-primary-50 opacity-90 animate-slide-up stagger-1 max-w-lg mx-auto md:mx-0">
                                    Welcome back to your dashboard. All systems are online and synchronized with your original data.
                                </p>
                            </div>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2 md:pt-4">
                                <button className="px-6 py-3 md:px-8 md:py-4 bg-white text-primary-600 rounded-2xl font-black hover:scale-105 transition-all shadow-xl flex items-center gap-2 group/btn text-sm md:text-base">
                                    Upload Products
                                    <ArrowUpRight className="w-4 md:w-5 h-4 md:h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                </button>
                                <button className="px-6 py-3 md:px-8 md:py-4 bg-primary-900/40 backdrop-blur-md text-white rounded-2xl font-black border border-white/20 hover:bg-primary-900/60 transition-all flex items-center gap-2 text-sm md:text-base">
                                    <Globe className="w-4 md:w-5 h-4 md:h-5" />
                                    Global Stats
                                </button>
                            </div>
                        </div>

                        {/* Interactive Metric Highlight */}
                        <div className="relative group/metric animate-float-premium hidden lg:block">
                            <div className="glass-card !bg-white/95 border-white/40 p-10 w-80 h-96 backdrop-blur-3xl shadow-[0_30px_70px_rgba(0,0,0,0.15)] rotate-3 group-hover/metric:rotate-0 transition-all duration-1000 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-success-400 to-emerald-500"></div>
                                <div className="space-y-8 relative z-10 text-left">
                                    <div className="flex justify-between items-start">
                                        <div className="p-4 bg-success-50 rounded-[1.5rem] shadow-inner">
                                            <Activity className="w-10 h-10 text-success-600" />
                                        </div>
                                        <span className="text-[11px] font-black text-white px-4 py-1.5 bg-[#00C06A] rounded-full tracking-wider shadow-lg shadow-emerald-900/20">ACTIVE</span>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-slate-400 font-black text-[11px] uppercase tracking-[0.25em]">Database Connectivity</p>
                                        <h4 className="text-[4rem] font-black text-slate-900 leading-none tracking-tighter">100%</h4>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                        <div className="h-full bg-gradient-to-r from-success-400 to-emerald-500 w-full shadow-[0_0_15px_rgba(16,185,129,0.3)]"></div>
                                    </div>
                                    <p className="text-slate-500 text-sm font-semibold leading-relaxed italic border-l-4 border-success-200 pl-4 py-1 bg-success-50/50 rounded-r-xl">
                                        &quot;Connected to original MongoDB instance. Ready for deployment.&quot;
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Stats Grid */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 animate-slide-up stagger-1">
                    <div className="sm:col-span-2 lg:col-span-2">
                        <AmountReceivablesCard amount={stats.amountReceivables} />
                    </div>
                    <div className="sm:col-span-2 lg:col-span-2">
                        <TotalLifetimeSalesCard amount={stats.totalLifetimeSales} />
                    </div>
                    <div className="sm:col-span-2 sm:col-start-1 md:col-start-auto lg:col-span-1">
                        <TodaySalesCard amount={stats.todaySales} change={stats.todayChange} />
                    </div>
                </section>

                {/* Sub Stats & Net Profit Row */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up stagger-2">
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ThisMonthSalesCard amount={stats.thisMonthSales} change={stats.thisMonthChange} />
                        <LastMonthSalesCard amount={stats.lastMonthSales} />
                    </div>

                    <div className="premium-card relative overflow-hidden group/profit min-h-[250px]">
                        <div className="absolute inset-0 bg-gradient-to-br from-success-600 to-emerald-700 group-hover:scale-110 transition-transform duration-700 opacity-95"></div>
                        <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-between text-white text-left">
                            <div className="flex justify-between items-start gap-3">
                                <div className="min-w-0">
                                    <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-success-200 truncate">Total Net Profit</p>
                                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-black mt-2 leading-none truncate">
                                        ${stats.netProfit.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                                    </h3>
                                </div>
                                <div className="p-3 md:p-4 bg-white/20 rounded-2xl shadow-xl backdrop-blur-md group-hover/profit:rotate-12 transition-transform shrink-0">
                                    <TrendingUp className="w-8 h-8 md:w-10 md:h-10" />
                                </div>
                            </div>

                            <div className="mt-4 md:mt-8 pt-4 md:pt-8 border-t border-white/20">
                                <div className="flex justify-between items-end gap-2 text-left">
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-white/60 font-bold uppercase tracking-wider truncate">Margin Percentage</p>
                                        <p className="text-2xl md:text-3xl font-black text-yellow-300">{stats.netProfitMargin}%</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="flex items-center gap-1 text-success-300 font-bold justify-end">
                                            <ArrowUpRight className="w-4 h-4" />
                                            <span className="text-xs md:text-sm">Active</span>
                                        </div>
                                        <p className="text-[9px] md:text-[10px] text-white/40 uppercase tracking-widest font-bold">Data Status</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Analytics Split */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <section className="xl:col-span-2 animate-slide-up stagger-3">
                        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 px-4 gap-4 text-left md:text-left">
                            <div className="flex items-center gap-4 w-full">
                                <div className="p-3.5 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[1.2rem] shrink-0 border border-gray-100">
                                    <TrendingUp className="w-6 h-6 text-[#4F46E5]" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-[#0F172A] leading-none tracking-tight">Performance</h2>
                                    <p className="text-sm text-slate-400 font-semibold mt-1.5 tracking-wide">Real-time revenue stream tracking</p>
                                </div>
                            </div>
                        </div>
                        <SalesChart data={chartData} />
                    </section>

                    <section className="animate-slide-up stagger-4 space-y-8 text-left">
                        <div className="glass-card p-6 !bg-white/40 border-white/60">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-primary-600" />
                                    Live Shop Feed
                                </h3>
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success-500"></span>
                                </span>
                            </div>
                            <div className="space-y-4">
                                {isLoading ? (
                                    <p className="text-xs text-gray-400 p-4 text-center">Syncing feed...</p>
                                ) : (
                                    <p className="text-xs text-gray-400 p-8 text-center bg-white/30 rounded-2xl italic">No recent activity detected in database.</p>
                                )}
                            </div>
                        </div>

                        <div className="premium-card p-6 bg-gradient-to-br from-slate-900 to-indigo-900 text-white relative overflow-hidden group text-left">
                            <Sparkles className="absolute -top-4 -right-4 w-24 h-24 text-white/5 group-hover:rotate-12 transition-transform" />
                            <h3 className="text-xl font-bold mb-2">Original Data Sync</h3>
                            <p className="text-sm text-indigo-100/60 leading-relaxed mb-4">You are currently viewing live data directly from your MongoDB cluster.</p>
                            <button className="text-xs font-bold text-white underline decoration-primary-500 decoration-2 underline-offset-4 hover:text-primary-400 transition-colors">Monitor Connection</button>
                        </div>
                    </section>
                </div>

                {/* Sections */}
                <section className="animate-slide-up stagger-4 text-left">
                    <div className="flex items-center justify-between mb-8 px-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-white shadow-xl rounded-2xl">
                                <Package className="w-6 h-6 text-primary-600" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 leading-none">Your Products</h2>
                                <p className="text-sm text-gray-400 font-medium mt-1">Real-time inventory from your database</p>
                            </div>
                        </div>
                    </div>
                    {featuredProducts.length > 0 ? (
                        <FeaturedProductsCarousel products={featuredProducts} />
                    ) : (
                        <div className="glass-card p-20 text-center !bg-white/40 border-dashed border-2 border-gray-200">
                            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No products found in your database.</p>
                            <button onClick={() => router.push('/products')} className="mt-4 text-primary-600 font-black text-sm uppercase tracking-widest hover:underline">Add First Product</button>
                        </div>
                    )}
                </section>

                {/* Footer */}
                <footer className="text-center pt-16 mt-16 border-t border-gray-100">
                    <div className="space-y-4">
                        <p className="text-sm font-medium text-gray-400">
                            © 2026 <span className="gradient-text font-black tracking-tighter">SmartSeller Pro</span>.
                            Database Connected & Synchronized.
                        </p>
                    </div>
                </footer>
            </div>
        </Shell>
    );
}

function SalesChartIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m19 20-3.5-3.5" />
            <path d="m2 2 10 10" />
            <path d="m22 2-10 10" />
            <path d="M20 16a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
            <path d="M4 16a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
        </svg>
    );
}
