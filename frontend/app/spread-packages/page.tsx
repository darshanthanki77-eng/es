'use client';

import Shell from '@/components/layout/Shell';
import { Box, Sparkles, Zap, TrendingUp, ArrowUpRight, ShieldCheck, Star } from 'lucide-react';

export default function SpreadPackagesPage() {
    return (
        <Shell>
            <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-xs font-bold uppercase tracking-wider">
                            <Sparkles className="w-3 h-3" />
                            Premium Marketing
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Spread Packages</h2>
                        <p className="text-gray-500 font-medium max-w-xl">Amplify your reach and scale your sales with our curated spread packages designed for maximum conversion.</p>
                    </div>
                    <button className="btn-primary flex items-center gap-2 group">
                        <Zap className="w-5 h-5 group-hover:fill-current" />
                        Explore All Packages
                    </button>
                </div>

                {/* Featured Packages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            name: 'Starter Spread',
                            price: '$99',
                            duration: 'Month',
                            features: ['Social Media Basic', '1,000 Impressions', 'Email Newsletter', '24/7 Support'],
                            color: 'from-blue-500 to-indigo-600',
                            popular: false
                        },
                        {
                            name: 'Growth Catalyst',
                            price: '$249',
                            duration: 'Month',
                            features: ['Advanced Targeting', '10,000 Impressions', 'Premium Placements', 'Dedicated Manager'],
                            color: 'from-primary-600 to-purple-700',
                            popular: true
                        },
                        {
                            name: 'Enterprise Reach',
                            price: '$599',
                            duration: 'Month',
                            features: ['Global Network Access', 'Unlimited Impressions', 'Custom Strategy', 'API Integration'],
                            color: 'from-orange-500 to-red-600',
                            popular: false
                        }
                    ].map((pkg, idx) => (
                        <div key={idx} className={`relative group ${pkg.popular ? 'scale-105 z-10' : ''}`}>
                            {pkg.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-950 text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg z-20 flex items-center gap-1.5 animate-bounce">
                                    <Star className="w-3 h-3 fill-current" />
                                    MOST POPULAR
                                </div>
                            )}
                            <div className={`glass-card p-8 h-full flex flex-col border-2 transition-all duration-500 ${pkg.popular ? 'border-primary-500 shadow-2xl shadow-primary-500/20' : 'border-transparent hover:border-gray-200'}`}>
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pkg.color} flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform`}>
                                    <Box className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2">{pkg.name}</h3>
                                <div className="flex items-baseline gap-1 mb-8">
                                    <span className="text-4xl font-black text-gray-900">{pkg.price}</span>
                                    <span className="text-gray-400 font-bold uppercase text-xs tracking-widest">/ {pkg.duration}</span>
                                </div>

                                <ul className="space-y-4 mb-10 flex-1">
                                    {pkg.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3 text-gray-600 font-medium">
                                            <div className="p-1 bg-success-50 rounded-full">
                                                <ShieldCheck className="w-4 h-4 text-success-600" />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <button className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 ${pkg.popular
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/40 hover:bg-primary-700'
                                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                    }`}>
                                    Select Package
                                    <ArrowUpRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Dashboard Stats Placeholder */}
                <div className="glass-card p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                <TrendingUp className="w-6 h-6 text-primary-600" />
                                Performance Tracking
                            </h3>
                            <p className="text-gray-500 font-medium max-w-lg">Monitor how your spread packages are impacting your bottom line with real-time analytics and detailed conversion reports.</p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <div className="px-6 py-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avg Conversion</p>
                                    <p className="text-xl font-black text-success-600">+12.4%</p>
                                </div>
                                <div className="px-6 py-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Impressions</p>
                                    <p className="text-xl font-black text-primary-600">842K</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/3">
                            <div className="p-6 bg-slate-900 rounded-[2rem] shadow-2xl relative">
                                <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary-500 rounded-2xl animate-spin-slow blur-xl opacity-50" />
                                <div className="space-y-4 relative z-10">
                                    <div className="flex justify-between items-center">
                                        <p className="text-white/60 text-xs font-bold uppercase tracking-widest">System Status</p>
                                        <span className="w-2 h-2 bg-success-500 rounded-full animate-ping" />
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary-500 w-[75%] shadow-[0_0_15px_rgba(79,70,229,0.5)]" />
                                    </div>
                                    <p className="text-white text-sm font-medium">Optimization in progress...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Shell>
    );
}
