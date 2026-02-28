'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Box,
    Warehouse,
    ShoppingCart,
    Truck,
    Wallet,
    Users,
    FileText,
    Settings,
    Lock,
    ChevronRight,
    Circle,
    IndianRupee
} from 'lucide-react';

const groups = [
    {
        name: 'General',
        items: [
            { name: 'Dashboard', href: '/', icon: LayoutDashboard },
            { name: 'Reports', href: '/reports', icon: FileText },
        ]
    },
    {
        name: 'Management',
        items: [
            { name: 'Product', href: '/products', icon: Box },
            { name: 'Storehouse', href: '/storehouse', icon: Warehouse },
            { name: 'Order', href: '/orders', icon: ShoppingCart },
            { name: 'Package', href: '/packages', icon: Truck },
            { name: 'Spread Packages', href: '/spread-packages', icon: Box },
            { name: 'Refund Requests', href: '/refunds', icon: ShoppingCart },
            { name: 'Product Queries', href: '/queries', icon: Box },
            { name: 'Suppliers', href: '/suppliers', icon: Users },
        ]
    },
    {
        name: 'Accounts & Security',
        items: [
            { name: 'Make Payment', href: '/payment', icon: IndianRupee },
            { name: 'Money Withdraw', href: '/withdraw', icon: Wallet },
            { name: 'Commission History', href: '/commissions', icon: FileText },
            { name: 'Affiliate System', href: '/affiliate', icon: Users },
            { name: 'Shop Setting', href: '/settings', icon: Settings },
            { name: 'Transaction Password', href: '/password', icon: Lock },
        ]
    },
    {
        name: 'Support & Media',
        items: [
            { name: 'Conversations', href: '/conversations', icon: Users },
            { name: 'Support Ticket', href: '/support', icon: FileText },
            { name: 'Uploaded Files', href: '/uploads', icon: Box },
        ]
    }
];

export default function Navigation() {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col gap-6 p-4">
            {groups.map((group) => (
                <div key={group.name} className="space-y-1">
                    <p className="px-4 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-3 flex items-center gap-2">
                        <Circle className="w-1.5 h-1.5 fill-current" />
                        {group.name}
                    </p>
                    <div className="space-y-1">
                        {group.items.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`relative flex items-center justify-between group px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${isActive
                                        ? 'text-white'
                                        : 'text-gray-500 hover:text-primary-600 hover:bg-white/50'
                                        }`}
                                >
                                    {/* Active Background Pill */}
                                    {isActive && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl shadow-lg shadow-primary-500/30 -z-10 animate-scale-in" />
                                    )}

                                    <div className="flex items-center gap-3 relative z-10">
                                        <div className={`p-1.5 rounded-lg transition-transform duration-300 group-hover:scale-110 ${isActive ? 'bg-white/20' : 'bg-gray-100/50 group-hover:bg-primary-50'
                                            }`}>
                                            <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary-600'}`} />
                                        </div>
                                        <span className="text-sm tracking-tight">{item.name}</span>
                                    </div>

                                    {isActive && (
                                        <div className="relative z-10">
                                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                        </div>
                                    )}

                                    {!isActive && (
                                        <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}
        </nav>
    );
}
