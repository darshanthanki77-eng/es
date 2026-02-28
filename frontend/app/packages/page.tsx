'use client';

import { useState, useEffect } from 'react';
import Shell from '@/components/layout/Shell';
import { Truck, Package, Box, Search, CheckCircle2, Star, Zap, ShoppingCart, ArrowRight, ShieldCheck, TrendingUp, Sparkles, X, Lock } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function PackagesPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<any>(null);
    const [transPassword, setTransPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const packages = [
        {
            id: 'STA-001',
            sku: 'silver',
            name: 'Starter Merchant',
            price: '$50',
            amount: 50,
            duration: 'Month',
            description: 'Perfect for new sellers starting their journey.',
            features: ['5 Products Limit', 'Basic Analytics', 'Community Support', 'Standard Shipping Rates'],
            color: 'from-blue-500 to-cyan-500',
            popular: false,
            bgLight: 'bg-blue-50',
            textLight: 'text-blue-600'
        },
        {
            id: 'PRO-002',
            sku: 'platinum',
            name: 'Professional Seller',
            price: '$150',
            amount: 150,
            duration: 'Month',
            description: 'Scale your business with advanced tools.',
            features: ['Unlimited Products', 'Advanced AI Insights', 'Priority 24/7 Support', 'Discounted Shipping', 'Custom Branding'],
            color: 'from-primary-600 to-purple-700',
            popular: true,
            bgLight: 'bg-primary-50',
            textLight: 'text-primary-600'
        },
        {
            id: 'ENT-003',
            sku: 'diamond',
            name: 'Enterprise Pro',
            price: '$450',
            amount: 450,
            duration: 'Month',
            description: 'Complete solution for large scale operations.',
            features: ['Multiple Storefronts', 'Dedicated Account Manager', 'API Access', 'Global Logistics Network', 'Whiteglove Onboarding'],
            color: 'from-slate-800 to-slate-900',
            popular: false,
            bgLight: 'bg-gray-100',
            textLight: 'text-gray-900'
        }
    ];

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const handlePurchase = async () => {
        if (!transPassword) {
            setMessage('Error: Please enter transaction password');
            return;
        }

        setIsSubmitting(true);
        setMessage('');

        try {
            const response = await api.post('/packages/purchase', {
                packageId: selectedPackage.sku,
                trans_password: transPassword
            });

            if (response.success) {
                setMessage('Package activated successfully!');
                setTimeout(() => {
                    setIsModalOpen(false);
                    setMessage('');
                    setTransPassword('');
                    router.push('/'); // Force refresh to show new balance in header
                }, 2000);
            }
        } catch (error: any) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading || (!user)) return null;

    return (
        <Shell>
            <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
                {/* Hero Header */}
                <div className="text-center space-y-4 max-w-3xl mx-auto py-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-xs font-black uppercase tracking-[0.2em] animate-fade-in">
                        <Sparkles className="w-4 h-4" />
                        Expansion Packages
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tight leading-none">
                        Choose Your <span className="gradient-text">Growth Path</span>
                    </h1>
                    <p className="text-gray-500 text-lg font-medium leading-relaxed">
                        Select a package that fits your business needs. Upgrade or downgrade anytime as you scale your store to new heights.
                    </p>
                </div>

                {/* Packages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-10">
                    {packages.map((pkg) => (
                        <div key={pkg.id} className={`relative flex flex-col group ${pkg.popular ? 'md:-translate-y-4' : ''}`}>
                            {pkg.popular && (
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
                                    <div className="bg-yellow-400 text-yellow-950 text-[11px] font-black px-6 py-2 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
                                        <Star className="w-3.5 h-3.5 fill-current" />
                                        MOST POPULAR
                                    </div>
                                </div>
                            )}

                            <div className={`flex-1 glass-card p-10 flex flex-col border-2 transition-all duration-700 ${pkg.popular
                                ? 'border-primary-500 shadow-[0_30px_60px_rgba(79,70,229,0.15)] ring-8 ring-primary-500/5'
                                : 'border-transparent hover:border-gray-200 hover:shadow-2xl'
                                }`}>
                                {/* Icon & Name */}
                                <div className="mb-8">
                                    <div className={`w-16 h-16 rounded-[1.5rem] bg-gradient-to-br ${pkg.color} flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                                        <Package className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900">{pkg.name}</h3>
                                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">ID: {pkg.id}</p>
                                </div>

                                {/* Price */}
                                <div className="mb-8 pb-8 border-b border-gray-100">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-black text-gray-900 tracking-tighter">{pkg.price}</span>
                                        <span className="text-gray-400 font-black uppercase text-xs tracking-widest">/ {pkg.duration}</span>
                                    </div>
                                    <p className="text-gray-500 text-sm font-medium mt-3 leading-relaxed">{pkg.description}</p>
                                </div>

                                {/* Features */}
                                <div className="flex-1 space-y-5 mb-10">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">What&apos;s Included</p>
                                    {pkg.features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className="p-1 bg-success-50 rounded-lg mt-0.5 shrink-0">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-success-600" />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-700 leading-snug">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Action */}
                                <button
                                    onClick={() => {
                                        setSelectedPackage(pkg);
                                        setIsModalOpen(true);
                                    }}
                                    className={`w-full py-5 rounded-[1.5rem] font-black transition-all flex items-center justify-center gap-2 group/btn ${pkg.popular
                                        ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/30 hover:bg-primary-500 hover:scale-[1.02]'
                                        : 'bg-gray-100 text-gray-900 hover:bg-gray-900 hover:text-white'
                                        }`}
                                >
                                    Activate Package
                                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Purchase Modal */}
                {isModalOpen && selectedPackage && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                        <div className="relative glass-card p-8 w-full max-w-md animate-scale-in">
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full text-gray-400"><X className="w-5 h-5" /></button>

                            <div className="text-center mb-8">
                                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${selectedPackage.color} flex items-center justify-center mb-4 shadow-lg`}>
                                    <Zap className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900">Activate Plan</h3>
                                <p className="text-gray-500 text-sm font-medium mt-1">Confirming upgrade to {selectedPackage.name}</p>
                            </div>

                            {message && (
                                <div className={`p-4 mb-6 rounded-xl text-sm font-bold ${message.includes('Error') ? 'bg-danger-50 text-danger-600' : 'bg-success-50 text-success-600'}`}>
                                    {message}
                                </div>
                            )}

                            <div className="space-y-6">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Plan Amount</span>
                                        <span className="text-xl font-black text-gray-900">{selectedPackage.price}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider text-right">Deducted from balance</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <Lock className="w-4 h-4 text-gray-400" /> Transaction Password
                                    </label>
                                    <input
                                        type="password"
                                        value={transPassword}
                                        onChange={(e) => setTransPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="input-field py-4"
                                    />
                                </div>

                                <button
                                    onClick={handlePurchase}
                                    disabled={isSubmitting}
                                    className={`btn-primary w-full py-5 text-lg shadow-xl shadow-primary-200 group ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? 'Verifying...' : 'Confirm Activation'}
                                </button>
                                <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest">Immediate activation upon successful payment</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Shell>
    );
}
