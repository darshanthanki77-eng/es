'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Mail, Lock, LogIn, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, isLoading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login({ email, password });
        } catch (err: any) {
            setError(err.message || 'Failed to login');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" />

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl shadow-xl mb-6 animate-float">
                        <LayoutDashboard className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter gradient-text mb-2">Welcome Back</h1>
                    <p className="text-gray-500 font-medium">Continue managing your smart store</p>
                </div>

                <div className="glass-card !bg-white/80 backdrop-blur-3xl border-white/40 p-10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-purple-600"></div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-danger-50 border border-danger-100 text-danger-600 text-sm font-bold rounded-xl animate-shake">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group/input">
                                <div className="absolute inset-0 bg-primary-500/5 rounded-2xl blur opacity-0 group-focus-within/input:opacity-100 transition-opacity" />
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-primary-500 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-6 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all text-sm font-medium relative z-10"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Password</label>
                                <Link href="/password/reset" className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors">Forgot?</Link>
                            </div>
                            <div className="relative group/input">
                                <div className="absolute inset-0 bg-primary-500/5 rounded-2xl blur opacity-0 group-focus-within/input:opacity-100 transition-opacity" />
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-primary-500 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-6 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all text-sm font-medium relative z-10"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-2xl font-black shadow-xl shadow-primary-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group/btn disabled:opacity-70 disabled:hover:scale-100"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <LogIn className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                        <p className="text-gray-500 font-medium">
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="text-primary-600 font-black hover:underline underline-offset-4">Create Store</Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex justify-center items-center gap-6 text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                    <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3" /> Secure</span>
                    <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3" /> Encrypted</span>
                    <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3" /> Smart</span>
                </div>
            </div>
        </div>
    );
}
