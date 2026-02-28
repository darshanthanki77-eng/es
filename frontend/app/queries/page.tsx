'use client';

import Shell from '@/components/layout/Shell';
import { Box, HelpCircle, MessageCircle, Reply, ArrowRight, User, Clock, CheckCircle2, MoreVertical, Heart } from 'lucide-react';

export default function QueriesPage() {
    return (
        <Shell>
            <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-black uppercase tracking-widest">
                            <HelpCircle className="w-3 h-3" />
                            Customer Inquiries
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Product Queries</h2>
                        <p className="text-gray-500 font-medium max-w-xl">Respond to potential buyers asking about product details, specifications, and availability.</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-8 group">
                        <div className="flex items-start justify-between">
                            <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-all duration-500">
                                <MessageCircle className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-black text-success-600 bg-success-50 px-3 py-1 rounded-full">+12 new</span>
                        </div>
                        <h4 className="text-4xl font-black text-gray-900 mt-6 leading-tight">142</h4>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Active Queries</p>
                    </div>
                    <div className="glass-card p-8 group">
                        <div className="flex items-start justify-between">
                            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                <Clock className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-black text-gray-400 bg-gray-50 px-3 py-1 rounded-full">Fast</span>
                        </div>
                        <h4 className="text-4xl font-black text-gray-900 mt-6 leading-tight">14m</h4>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Avg Response Time</p>
                    </div>
                    <div className="glass-card p-8 group">
                        <div className="flex items-start justify-between">
                            <div className="p-4 bg-success-50 text-success-600 rounded-2xl group-hover:bg-success-600 group-hover:text-white transition-all duration-500">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-black text-primary-600 bg-primary-50 px-3 py-1 rounded-full">Top 5%</span>
                        </div>
                        <h4 className="text-4xl font-black text-gray-900 mt-6 leading-tight">96%</h4>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Resolution Rate</p>
                    </div>
                </div>

                {/* Queries List */}
                <div className="space-y-6">
                    {[
                        {
                            id: 'Q-902',
                            user: 'David Bowie',
                            product: 'RGB Gaming Keyboard V2',
                            query: 'Does this keyboard support hot-swapping switches, or are they soldered?',
                            time: '12m ago',
                            answered: false
                        },
                        {
                            id: 'Q-901',
                            user: 'Sarah Jenkins',
                            product: 'Waterproof Running Shell',
                            query: 'Is the material breathable enough for long distance running in humid weather?',
                            time: '1 hour ago',
                            answered: false
                        },
                        {
                            id: 'Q-900',
                            user: 'Mike Nelson',
                            product: 'Ceramic Coffee Dripper',
                            query: 'Does this come with a starting pack of filters, or do I need to buy them separately?',
                            time: '3 hours ago',
                            answered: true,
                            answer: 'Yes, it includes a pack of 40 V60-02 paper filters to get you started!'
                        },
                    ].map((item, i) => (
                        <div key={i} className={`glass-card overflow-hidden group transition-all duration-500 ${!item.answered ? 'border-purple-200 ring-4 ring-purple-500/5 shadow-xl shadow-purple-500/10' : ''}`}>
                            <div className="p-8 flex flex-col lg:flex-row gap-8">
                                <div className="flex-1 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 overflow-hidden font-black">
                                                {item.user[0]}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-gray-900 leading-tight">{item.user}</h4>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Ref: {item.id} • {item.time}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 hover:bg-gray-50 rounded-xl transition-all text-gray-400"><Heart className="w-4.5 h-4.5" /></button>
                                            <button className="p-2 hover:bg-gray-50 rounded-xl transition-all text-gray-400"><MoreVertical className="w-4.5 h-4.5" /></button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg w-fit">
                                            <Box className="w-3.5 h-3.5 text-gray-400" />
                                            <span className="text-xs font-bold text-gray-600 truncate max-w-xs">{item.product}</span>
                                        </div>
                                        <p className="text-lg font-bold text-gray-800 leading-relaxed italic">
                                            &quot;{item.query}&quot;
                                        </p>
                                    </div>

                                    {item.answered && (
                                        <div className="p-6 bg-success-50 rounded-[2rem] border border-success-100 space-y-3 relative group/answer">
                                            <div className="flex items-center gap-2 text-success-600">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span className="text-xs font-black uppercase tracking-widest">Your Response</span>
                                            </div>
                                            <p className="text-sm font-medium text-success-800 leading-relaxed">{item.answer}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="shrink-0 flex flex-col justify-end lg:items-end lg:w-48 gap-4 border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-8">
                                    {!item.answered ? (
                                        <>
                                            <button className="w-full py-4 bg-purple-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-purple-500/30 hover:bg-purple-500 transition-all flex items-center justify-center gap-2">
                                                <Reply className="w-4 h-4" />
                                                Reply Now
                                            </button>
                                            <button className="w-full py-3 bg-white border border-gray-200 text-gray-500 rounded-2xl font-bold text-xs hover:bg-gray-50 transition-all">
                                                Mark as Spam
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center lg:text-right">
                                            <p className="text-[10px] font-black text-success-600 uppercase tracking-widest mb-1">Status</p>
                                            <p className="text-sm font-black text-gray-900">Resolved</p>
                                            <button className="mt-4 text-xs font-black text-gray-400 hover:text-primary-600 flex items-center gap-1 lg:ml-auto">
                                                Edit Reply
                                                <ArrowRight className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Shell>
    );
}
