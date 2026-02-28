'use client';

import Shell from '@/components/layout/Shell';
import { FileText, Plus, Search, AlertCircle, Clock, CheckCircle2, MessageSquare, ArrowRight, LifeBuoy, Zap } from 'lucide-react';

export default function SupportTicketPage() {
    return (
        <Shell>
            <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
                {/* Visual Banner */}
                <div className="relative p-12 lg:p-20 rounded-[3rem] bg-indigo-900 text-white overflow-hidden group">
                    <LifeBuoy className="absolute -bottom-10 -left-10 w-64 h-64 text-white/5 group-hover:rotate-12 transition-transform duration-1000" />
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/20 to-transparent" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                                <Zap className="w-4 h-4 text-warning-400" />
                                <span className="text-white text-[10px] font-black uppercase tracking-widest">Global Support Center</span>
                            </div>
                            <h1 className="text-4xl lg:text-7xl font-black text-white tracking-tight leading-tight">
                                Expert Help, <br />When You Need It.
                            </h1>
                            <p className="text-indigo-200 text-lg font-medium max-w-lg leading-relaxed">
                                Our dedicated support engineers are on standby 24/7 to help you resolve any issues with your store or shipments.
                            </p>
                            <button className="px-10 py-5 bg-white text-indigo-900 rounded-[2rem] font-black text-lg shadow-2xl hover:scale-105 transition-all flex items-center gap-3">
                                <Plus className="w-6 h-6" />
                                Create New Ticket
                            </button>
                        </div>

                        <div className="hidden lg:grid grid-cols-2 gap-6">
                            <div className="glass-card !bg-white/10 border-white/10 p-8 hover:!bg-white/20 transition-all cursor-default">
                                <h4 className="text-4xl font-black text-white">4h</h4>
                                <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest mt-2">Median Response</p>
                            </div>
                            <div className="glass-card !bg-white/10 border-white/10 p-8 translate-y-8 hover:!bg-white/20 transition-all cursor-default">
                                <h4 className="text-4xl font-black text-white">99%</h4>
                                <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest mt-2">Satisfaction</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ticket List Header */}
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="relative flex-1 group w-full md:w-auto">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search your tickets (ID or subject)..."
                            className="w-full pl-16 pr-6 py-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm focus:ring-4 focus:ring-indigo-100 transition-all font-medium"
                        />
                    </div>
                    <div className="flex bg-gray-100/50 p-2 rounded-[2rem] border border-gray-100 w-full md:w-auto shrink-0 overflow-x-auto no-scrollbar">
                        {['All Tickets', 'Open', 'Resolved'].map((tab, i) => (
                            <button
                                key={i}
                                className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${i === 0 ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tickets Grid */}
                <div className="grid grid-cols-1 gap-6">
                    {[
                        { id: 'TKT-2901', subject: 'API Integration Failure in Checkout', priority: 'High', status: 'Open', date: '42m ago', msgs: 3 },
                        { id: 'TKT-2900', subject: 'Inconsistent Shipping Rates for EU', priority: 'Medium', status: 'In Progress', date: '3h ago', msgs: 12 },
                        { id: 'TKT-2895', subject: 'How to update tax settings?', priority: 'Low', status: 'Resolved', date: '2 days ago', msgs: 2 },
                        { id: 'TKT-2894', subject: 'Bulk upload error code #902', priority: 'High', status: 'Resolved', date: '1 week ago', msgs: 8 },
                    ].map((tkt, i) => (
                        <div key={i} className="glass-card group hover:border-indigo-100 transition-all p-8 flex flex-col md:flex-row items-center gap-10">
                            <div className="shrink-0">
                                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center relative ${tkt.status === 'Open' ? 'bg-indigo-50 text-indigo-600' :
                                        tkt.status === 'Resolved' ? 'bg-success-50 text-success-600' : 'bg-blue-50 text-blue-600'
                                    }`}>
                                    <FileText className="w-10 h-10" />
                                    <div className={`absolute -top-1 -right-1 p-2 rounded-xl shadow-lg ${tkt.priority === 'High' ? 'bg-danger-500' :
                                            tkt.priority === 'Medium' ? 'bg-warning-500' : 'bg-gray-400'
                                        }`}>
                                        <AlertCircle className="w-3.5 h-3.5 text-white" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{tkt.subject}</h3>
                                    <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg shrink-0">{tkt.id}</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-gray-500">
                                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-400" /> Opened {tkt.date}</span>
                                    <span className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4 text-gray-400" /> {tkt.msgs} replies</span>
                                    <span className={`flex items-center gap-1.5 ${tkt.status === 'Resolved' ? 'text-success-600' : 'text-indigo-600 animate-pulse'
                                        }`}>
                                        {tkt.status === 'Resolved' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                        {tkt.status}
                                    </span>
                                </div>
                            </div>

                            <button className="w-full md:w-auto px-8 py-4 bg-gray-50 group-hover:bg-indigo-600 text-gray-500 group-hover:text-white rounded-[1.5rem] font-black shadow-sm group-hover:shadow-xl group-hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-3">
                                View Case
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </Shell>
    );
}
