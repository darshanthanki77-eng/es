'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Mail, Lock, User, Store, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        shop_name: '',
        trans_password: '',
        invitation_code: '',
    });
    const [error, setError] = useState('');
    const { register, isLoading } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await register(formData);
        } catch (err: any) {
            setError(err.message || 'Failed to register');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" />

            <div className="w-full max-w-xl relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl shadow-xl mb-6 animate-bounce-slow">
                        <Store className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter gradient-text mb-2">Setup Your Store</h1>
                    <p className="text-gray-500 font-medium">Join thousands of smart sellers today</p>
                </div>

                <div className="glass-card !bg-white/80 backdrop-blur-3xl border-white/40 p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-primary-500 to-purple-600"></div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {error && (
                            <div className="md:col-span-2 p-4 bg-danger-50 border border-danger-100 text-danger-600 text-sm font-bold rounded-xl animate-shake">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Full Name</label>
                            <div className="relative group/input">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-primary-500 transition-colors" />
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-6 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all text-sm font-medium"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Store Name</label>
                            <div className="relative group/input">
                                <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-primary-500 transition-colors" />
                                <input
                                    type="text"
                                    name="shop_name"
                                    required
                                    value={formData.shop_name}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-6 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all text-sm font-medium"
                                    placeholder="My Awesome Store"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group/input">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-primary-500 transition-colors" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-6 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all text-sm font-medium"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Login Password</label>
                            <div className="relative group/input">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-primary-500 transition-colors" />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-6 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all text-sm font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Transaction Password</label>
                            <div className="relative group/input">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-primary-500 transition-colors" />
                                <input
                                    type="password"
                                    name="trans_password"
                                    required
                                    value={formData.trans_password}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-6 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all text-sm font-medium"
                                    placeholder="Used for withdrawals"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Invitation Code</label>
                            <div className="relative group/input">
                                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-primary-500 transition-colors" />
                                <input
                                    type="text"
                                    name="invitation_code"
                                    value={formData.invitation_code}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-6 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all text-sm font-medium"
                                    placeholder="Invite code (Optional)"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-2xl font-black shadow-xl shadow-primary-200 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 group/btn disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Launch My Store
                                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                        <p className="text-gray-500 font-medium">
                            Already have an account?{' '}
                            <Link href="/login" className="text-primary-600 font-black hover:underline underline-offset-4">Log In Instead</Link>
                        </p>
                    </div>
                </div>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    {[
                        { title: 'Instant Setup', desc: 'Ready in under 2 minutes' },
                        { title: 'No Commitment', desc: 'Scale as you grow' },
                        { title: '24/7 Support', desc: 'Expert help anytime' }
                    ].map((feature, i) => (
                        <div key={i} className="space-y-1 animate-fade-in" style={{ animationDelay: `${i * 0.2}s` }}>
                            <div className="flex justify-center mb-2">
                                <CheckCircle className="w-4 h-4 text-success-500" />
                            </div>
                            <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">{feature.title}</h4>
                            <p className="text-[10px] text-gray-400 font-bold">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
