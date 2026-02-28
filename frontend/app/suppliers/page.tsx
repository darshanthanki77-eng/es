'use client';

import { useState } from 'react';
import { Supplier } from '@/types';
import { Plus, Edit, Trash2, Star, MapPin, Phone, Mail, Clock, TrendingUp, Users, CheckCircle } from 'lucide-react';
import Shell from '@/components/layout/Shell';

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const avgRating = suppliers.length > 0
        ? (suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length).toFixed(1)
        : "0.0";

    return (
        <Shell>
            <div className="space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Suppliers</h2>
                        <p className="text-gray-600 focus:outline-none">Manage your supplier network and performance</p>
                    </div>
                </div>

                {/* Stats Overview - Updated to 3 columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="metric-card">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-600">Total Suppliers</p>
                            <div className="p-2 bg-primary-100 rounded-lg">
                                <Users className="w-5 h-5 text-primary-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">{suppliers.length}</h3>
                    </div>

                    <div className="metric-card">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                            <div className="p-2 bg-warning-100 rounded-lg">
                                <Star className="w-5 h-5 text-warning-600 fill-warning-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">
                            {avgRating}
                        </h3>
                    </div>

                    <div className="metric-card">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-600">Avg Delivery</p>
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Clock className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">0 days</h3>
                    </div>
                </div>

                {/* Suppliers Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {suppliers.length > 0 ? (
                        suppliers.map((supplier) => (
                            <SupplierCard key={supplier.id} supplier={supplier} />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center glass-card">
                            <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No suppliers configured in your database.</p>
                        </div>
                    )}
                </div>
            </div>
        </Shell>
    );
}

function SupplierCard({ supplier }: { supplier: Supplier }) {
    return (
        <div className="premium-card p-6 group">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 overflow-hidden">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors truncate">{supplier.name}</h3>
                    <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${supplier.status === 'active' ? 'bg-success-100 text-success-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                        {supplier.status}
                    </div>
                </div>
                <div className="flex items-center gap-1 bg-warning-50 px-2 py-1 rounded-lg">
                    <Star className="w-3.5 h-3.5 text-warning-500 fill-warning-500" />
                    <span className="font-bold text-xs text-warning-700">{supplier.rating}</span>
                </div>
            </div>

            {/* Info */}
            <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                    <span className="truncate">{supplier.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                    <span>{supplier.contact}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                    <span className="truncate">{supplier.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                    <span>Delivery: {supplier.deliveryTimeEstimate}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="text-xs font-semibold text-gray-500">
                    Comm: <span className="text-gray-900">{(supplier.commissionRate * 100).toFixed(0)}%</span>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 hover:bg-primary-50 text-gray-400 hover:text-primary-600 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-danger-50 text-gray-400 hover:text-danger-600 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
