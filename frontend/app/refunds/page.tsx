'use client';

import Shell from '@/components/layout/Shell';
import { ShoppingCart, RefreshCcw, Search, CheckCircle, XCircle, Clock, AlertTriangle, ArrowRight, Box } from 'lucide-react';

export default function RefundsPage() {
    return (
        <Shell>
            <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-black uppercase tracking-widest">
                            <AlertTriangle className="w-3 h-3" />
                            Refund Center
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Received Refund Requests</h2>
                        <p className="text-gray-500 font-medium max-w-xl">Manage and process customer refund requests efficiently to maintain high satisfaction scores.</p>
                    </div>
                </div>

                {/* Status Tabs */}
                <div className="flex flex-wrap gap-4 bg-gray-100/50 p-2 rounded-[2rem] w-fit border border-gray-100">
                    {[
                        { name: 'All Requests', count: 24, active: true },
                        { name: 'Pending', count: 8, active: false },
                        { name: 'Approved', count: 12, active: false },
                        { name: 'Rejected', count: 4, active: false },
                    ].map((tab, i) => (
                        <button
                            key={i}
                            className={`px-8 py-3 rounded-2xl text-sm font-black transition-all flex items-center gap-3 ${tab.active ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {tab.name}
                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${tab.active ? 'bg-primary-50 text-primary-600' : 'bg-gray-200 text-gray-400'
                                }`}>{tab.count}</span>
                        </button>
                    ))}
                </div>

                {/* Requests Grid */}
                <div className="grid grid-cols-1 gap-6">
                    {[
                        { id: 'REF-8392', user: 'Jason Momoa', product: 'Ultra Wireless Headphones', amount: '$299.00', date: '2 hours ago', status: 'Pending', reason: 'Defective product - Sound cuts out' },
                        { id: 'REF-8391', user: 'Emma Stone', product: 'Premium Leather Case', amount: '$45.00', date: '5 hours ago', status: 'In Review', reason: 'Late delivery - No longer needed' },
                        { id: 'REF-8390', user: 'Robert Downey', product: 'Smart Watch Series X', amount: '$599.00', date: 'Yesterday', status: 'Approved', reason: 'Technical glich in screen' },
                        { id: 'REF-8389', user: 'Scarlett Johanson', product: 'Minimalist Desk Lamp', amount: '$85.00', date: '2 days ago', status: 'Rejected', reason: 'No valid proof of damage provided' },
                    ].map((ref, i) => (
                        <div key={i} className="glass-card hover:border-primary-100 transition-all group p-1">
                            <div className="p-8 flex flex-col lg:flex-row items-start lg:items-center gap-8">
                                {/* Product Info */}
                                <div className="flex items-center gap-6 flex-1">
                                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                        <Box className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <p className="text-xl font-black text-gray-900">{ref.product}</p>
                                            <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">ID: {ref.id}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
                                            <span className="flex items-center gap-1.5"><ShoppingCart className="w-4 h-4" /> Ordered by {ref.user}</span>
                                            <span className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {ref.date}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Reason & Amount */}
                                <div className="lg:w-1/4">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Reason for refund</p>
                                    <p className="text-sm font-bold text-gray-700 leading-relaxed italic">&quot;{ref.reason}&quot;</p>
                                </div>

                                <div className="lg:text-right shrink-0">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Refund Amount</p>
                                    <p className="text-2xl font-black text-danger-600">{ref.amount}</p>
                                </div>

                                {/* Status & Actions */}
                                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 lg:ml-4">
                                    <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 ${ref.status === 'Approved' ? 'bg-success-50 text-success-600' :
                                            ref.status === 'Rejected' ? 'bg-danger-50 text-danger-600' :
                                                'bg-blue-50 text-blue-600'
                                        }`}>
                                        {ref.status === 'Approved' ? <CheckCircle className="w-4 h-4" /> :
                                            ref.status === 'Rejected' ? <XCircle className="w-4 h-4" /> :
                                                <Clock className="w-4 h-4" />}
                                        {ref.status}
                                    </div>
                                    <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 transition-all">
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats Footer */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass-card p-10 bg-slate-900 text-white relative overflow-hidden group">
                        <RefreshCcw className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 group-hover:rotate-45 transition-transform duration-1000" />
                        <h3 className="text-2xl font-black mb-4">Refund Analytics</h3>
                        <p className="text-gray-400 mb-8 font-medium">Your refund rate is <span className="text-success-400 font-bold">2.4%</span>, which is 1.5% lower than the industry average. Good job!</p>
                        <button className="px-8 py-3 bg-white text-slate-900 rounded-2xl font-black text-sm shadow-xl shadow-black/20 hover:scale-105 transition-all">View Details</button>
                    </div>
                </div>
            </div>
        </Shell>
    );
}
