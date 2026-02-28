'use client';

import Shell from '@/components/layout/Shell';
import { DollarSign, Wallet, ArrowUpRight, ArrowDownLeft, Search, Filter, Calendar, Zap, TrendingUp, Sparkles } from 'lucide-react';

export default function CommissionsPage() {
    return (
        <Shell>
            <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
                {/* Visual Header */}
                <div className="relative p-10 lg:p-14 rounded-[3rem] bg-gradient-to-br from-indigo-600 to-purple-800 text-white overflow-hidden shadow-2xl">
                    <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-64 h-64 bg-pink-500/20 rounded-full blur-[80px]" />

                    <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
                        <div className="space-y-6 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                                <Sparkles className="w-4 h-4 text-yellow-300" />
                                <span className="text-white text-xs font-black uppercase tracking-widest whitespace-nowrap">Commission Dashboard</span>
                            </div>
                            <h2 className="text-4xl lg:text-6xl font-black tracking-tight leading-tight">Your Earnings, <br /><span className="text-yellow-300 italic">Redefined.</span></h2>
                            <p className="text-white/70 font-medium text-lg max-w-lg mx-auto lg:mx-0">Track every penny earned through sales, referrals, and affiliate spreads in one premium interface.</p>
                        </div>

                        <div className="glass-card !bg-white/10 border-white/10 p-10 backdrop-blur-2xl w-full lg:w-96 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
                            <div className="space-y-8">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-white/60 text-xs font-black uppercase tracking-[0.2em] mb-2">Total Commissions</p>
                                        <h3 className="text-5xl font-black text-white leading-none">$12,842</h3>
                                    </div>
                                    <div className="p-4 bg-white/10 rounded-2xl">
                                        <TrendingUp className="w-8 h-8 text-yellow-300" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-white/60 font-medium">This Month Growth</span>
                                        <span className="text-success-400 font-black">+14.2%</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-yellow-300 w-[65%] shadow-[0_0_15px_rgba(253,224,71,0.5)]" />
                                    </div>
                                </div>
                                <button className="w-full py-4 bg-white text-indigo-700 rounded-2xl font-black hover:bg-yellow-300 hover:text-indigo-900 transition-all shadow-xl shadow-black/20">
                                    Withdraw Rewards
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3">
                        <div className="glass-card p-4 flex flex-col md:flex-row items-center gap-4">
                            <div className="relative flex-1 group w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search by ID, product, or source..."
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-sm"
                                />
                            </div>
                            <div className="flex gap-4 w-full md:w-auto">
                                <button className="flex-1 md:flex-none px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2">
                                    <Filter className="w-4 h-4" />
                                    Filter
                                </button>
                                <button className="flex-1 md:flex-none px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Date
                                </button>
                            </div>
                        </div>

                        {/* History Table */}
                        <div className="glass-card mt-6 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-400 font-black text-[10px] uppercase tracking-widest border-b border-gray-100">
                                        <tr>
                                            <th className="px-8 py-5 whitespace-nowrap">Transaction</th>
                                            <th className="px-8 py-5 whitespace-nowrap">Source</th>
                                            <th className="px-8 py-5 whitespace-nowrap">Date</th>
                                            <th className="px-8 py-5 whitespace-nowrap">Status</th>
                                            <th className="px-8 py-5 text-right whitespace-nowrap">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {[
                                            { id: '#TRX-9281', type: 'Product Sale', source: 'Apple AirPods Pro', date: 'Jan 22, 2026', status: 'Completed', amount: '+$24.50' },
                                            { id: '#TRX-9280', type: 'Affiliate Spread', source: 'Monthly Pro Upgrade', date: 'Jan 22, 2026', status: 'Processing', amount: '+$142.00' },
                                            { id: '#TRX-9279', type: 'Direct Referral', source: 'Mike Ross signup', date: 'Jan 21, 2026', status: 'Completed', amount: '+$5.00' },
                                            { id: '#TRX-9278', type: 'Product Sale', source: 'Leather Office Chair', date: 'Jan 21, 2026', status: 'Completed', amount: '+$18.20' },
                                            { id: '#TRX-9277', type: 'Withdrawal', source: 'Bank Transfer ****42', date: 'Jan 20, 2026', status: 'Completed', amount: '-$500.00' },
                                        ].map((trx, i) => (
                                            <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2.5 rounded-xl ${trx.amount.startsWith('+') ? 'bg-success-50 text-success-600' : 'bg-gray-100 text-gray-500'
                                                            }`}>
                                                            {trx.amount.startsWith('+') ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900">{trx.id}</p>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{trx.type}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 font-medium text-gray-600 truncate max-w-[200px]">{trx.source}</td>
                                                <td className="px-8 py-6 text-gray-500 font-medium">{trx.date}</td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${trx.status === 'Completed' ? 'bg-success-50 text-success-600' : 'bg-amber-50 text-amber-600'
                                                        }`}>
                                                        {trx.status}
                                                    </span>
                                                </td>
                                                <td className={`px-8 py-6 text-right font-black text-lg ${trx.amount.startsWith('+') ? 'text-success-600' : 'text-gray-900'
                                                    }`}>{trx.amount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="glass-card p-8">
                            <h4 className="font-black text-gray-900 mb-6 flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-indigo-600" />
                                Commission Sources
                            </h4>
                            <div className="space-y-6">
                                {[
                                    { name: 'Product Sales', percentage: 65, color: 'bg-indigo-500' },
                                    { name: 'Affiliate System', percentage: 25, color: 'bg-purple-500' },
                                    { name: 'Referrals', percentage: 10, color: 'bg-pink-500' },
                                ].map((source, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between items-center text-sm font-bold">
                                            <span className="text-gray-600">{source.name}</span>
                                            <span className="text-gray-900">{source.percentage}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className={`h-full ${source.color}`} style={{ width: `${source.percentage}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="premium-card p-8 bg-slate-900 text-white group overflow-hidden">
                            <Zap className="absolute -top-4 -right-4 w-20 h-20 text-white/5 rotate-12 group-hover:rotate-45 transition-transform duration-700" />
                            <h4 className="text-xl font-black mb-2">Automated Payouts</h4>
                            <p className="text-sm text-gray-400 font-medium leading-relaxed mb-6">Enable instant payouts to skip the 24-hour review period.</p>
                            <button className="w-full py-4 bg-indigo-600 rounded-2xl font-black hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-900/50">
                                Upgrade Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Shell>
    );
}
