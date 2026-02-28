'use client';

import Shell from '@/components/layout/Shell';
import { Box, FileText, Image as ImageIcon, Video, Folder, Search, Filter, MoreVertical, Download, ExternalLink, Plus, HardDrive, Trash2 } from 'lucide-react';

export default function UploadsPage() {
    return (
        <Shell>
            <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-black uppercase tracking-widest">
                            <Folder className="w-3 h-3" />
                            Media Library
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Uploaded Files</h2>
                        <p className="text-gray-500 font-medium max-w-xl">Organize and manage your product assets, documentation, and shipment proofs.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-6 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2">
                            <Folder className="w-5 h-5" />
                            New Folder
                        </button>
                        <button className="btn-primary flex items-center gap-2 shadow-xl shadow-primary-500/25">
                            <Plus className="w-5 h-5" />
                            Upload New
                        </button>
                    </div>
                </div>

                {/* Storage usage */}
                <div className="glass-card p-1">
                    <div className="p-8 flex flex-col md:flex-row items-center gap-10">
                        <div className="shrink-0">
                            <div className="relative w-24 h-24">
                                <svg className="w-24 h-24 transform -rotate-90">
                                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset="62.8" className="text-primary-600" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center font-black text-xl text-gray-900">75%</div>
                            </div>
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-center">
                                <h4 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                    <HardDrive className="w-5 h-5 text-gray-400" />
                                    Cloud Storage
                                </h4>
                                <p className="text-sm font-bold text-gray-500">1.5 GB of 2.0 GB used</p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {[
                                    { label: 'Images', val: '840 MB', color: 'bg-primary-500' },
                                    { label: 'Videos', val: '420 MB', color: 'bg-purple-500' },
                                    { label: 'Docs', val: '240 MB', color: 'bg-indigo-500' },
                                    { label: 'Other', val: '50 MB', color: 'bg-gray-300' },
                                ].map((item, i) => (
                                    <div key={i} className="space-y-1.5">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                            <span>{item.label}</span>
                                            <span>{item.val}</span>
                                        </div>
                                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div className={`h-full ${item.color}`} style={{ width: '40%' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* File Grid */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4 bg-white p-2 border border-gray-100 rounded-[2rem] shadow-sm">
                        <div className="relative flex-1 group pl-4">
                            <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search all files..."
                                className="w-full pl-10 pr-4 py-3 bg-transparent border-none rounded-2xl focus:ring-0 font-medium text-sm"
                            />
                        </div>
                        <button className="p-3 hover:bg-gray-50 rounded-2xl text-gray-400 transition-all border border-transparent hover:border-gray-100 mr-2"><Filter className="w-5 h-5" /></button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: 'Product_Hero_1.jpg', type: 'image', size: '2.4 MB', date: 'Dec 12, 2025' },
                            { name: 'Supplier_Contract.pdf', type: 'doc', size: '420 KB', date: 'Jan 5, 2026' },
                            { name: 'Unboxing_Reel.mp4', type: 'video', size: '42.8 MB', date: 'Dec 22, 2025' },
                            { name: 'Inventory_Sheet.xlsx', type: 'doc', size: '1.2 MB', date: 'Jan 10, 2026' },
                            { name: 'Return_Proof_8392.jpg', type: 'image', size: '1.8 MB', date: '2 hours ago' },
                            { name: 'Warehouse_Layout.pdf', type: 'doc', size: '8.4 MB', date: 'Jan 20, 2026' },
                            { name: 'Logo_Dark_v2.svg', type: 'image', size: '45 KB', date: 'Old' },
                            { name: 'Marketing_Pitch.pptx', type: 'doc', size: '12.5 MB', date: 'Jan 15, 2026' },
                        ].map((file, i) => (
                            <div key={i} className="glass-card p-6 group cursor-default hover:border-primary-100 transition-all relative">
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-all"><MoreVertical className="w-4 h-4" /></button>
                                </div>
                                <div className="w-full aspect-square bg-gray-50 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden group-hover:bg-primary-50 transition-colors">
                                    {file.type === 'image' ? <ImageIcon className="w-12 h-12 text-primary-400" /> :
                                        file.type === 'video' ? <Video className="w-12 h-12 text-purple-400" /> :
                                            <FileText className="w-12 h-12 text-indigo-400" />}

                                    <div className="absolute inset-0 bg-primary-600/90 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                                        <div className="flex gap-2">
                                            <button className="p-3 bg-white text-primary-600 rounded-xl hover:scale-110 transition-transform"><Download className="w-5 h-5" /></button>
                                            <button className="p-3 bg-white text-primary-600 rounded-xl hover:scale-110 transition-transform"><ExternalLink className="w-5 h-5" /></button>
                                        </div>
                                        <button className="flex items-center gap-1.5 text-white/60 hover:text-white text-[10px] font-black uppercase tracking-widest"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h5 className="font-black text-gray-900 truncate pr-4">{file.name}</h5>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{file.size}</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{file.date}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Shell>
    );
}
