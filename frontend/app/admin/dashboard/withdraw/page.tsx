'use client';

import { useEffect, useState, useCallback } from 'react';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const STATUS_MAP: any = {
    0: { label: 'Pending', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)' },
    1: { label: 'Approved', color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)' },
    2: { label: 'Rejected', color: '#f87171', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' },
};
const OP_TYPE: any = { 1: 'Bank', 2: 'USDT', 3: 'Package' };

export default function AdminWithdrawPage() {
    const [withdrawals, setWithdrawals] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [rejectModal, setRejectModal] = useState<{ id: string } | null>(null);
    const [rejectReason, setRejectReason] = useState('');

    const fetchWithdrawals = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/admin/withdrawals?page=${page}&status=${statusFilter}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (data.success) {
            setWithdrawals(data.withdrawals);
            setTotal(data.total);
            setPages(data.pages);
        }
        setLoading(false);
    }, [page, statusFilter]);

    useEffect(() => { fetchWithdrawals(); }, [fetchWithdrawals]);

    const handleStatus = async (id: string, status: number, reason?: string) => {
        setActionLoading(id);
        const token = localStorage.getItem('adminToken');
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/withdrawals/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ status, reason })
        });
        await fetchWithdrawals();
        setActionLoading(null);
        setRejectModal(null);
        setRejectReason('');
    };

    return (
        <div style={{ padding: '32px', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 4px' }}>Withdrawal Requests</h1>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: 0 }}>{total} total requests</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {[{ val: 'all', label: 'All' }, { val: '0', label: 'Pending' }, { val: '1', label: 'Approved' }, { val: '2', label: 'Rejected' }].map(f => (
                        <button key={f.val} onClick={() => { setStatusFilter(f.val); setPage(1); }} style={{
                            padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                            border: statusFilter === f.val ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.1)',
                            background: statusFilter === f.val ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.05)',
                            color: statusFilter === f.val ? '#a5b4fc' : 'rgba(255,255,255,0.5)',
                            cursor: 'pointer'
                        }}>{f.label}</button>
                    ))}
                    <button onClick={fetchWithdrawals} style={{
                        background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)',
                        borderRadius: '8px', color: '#818cf8', padding: '7px 10px', cursor: 'pointer', display: 'flex'
                    }}><RefreshCw size={15} /></button>
                </div>
            </div>

            <div style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px', overflow: 'hidden'
            }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '750px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                {['#', 'Seller', 'Shop', 'Amount', 'Method', 'Status', 'Date', 'Actions'].map(h => (
                                    <th key={h} style={{
                                        padding: '14px 16px', textAlign: 'left', fontSize: '11px',
                                        fontWeight: '700', color: 'rgba(255,255,255,0.4)',
                                        textTransform: 'uppercase', letterSpacing: '0.05em'
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={8} style={{ padding: '50px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>Loading...</td></tr>
                            ) : withdrawals.length === 0 ? (
                                <tr><td colSpan={8} style={{ padding: '50px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>No withdrawals found</td></tr>
                            ) : withdrawals.map((w, i) => {
                                const s = STATUS_MAP[w.status] || STATUS_MAP[0];
                                return (
                                    <tr key={w._id}
                                        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{(page - 1) * 20 + i + 1}</td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ fontWeight: '600', fontSize: '14px' }}>{w.seller?.name || 'Unknown'}</div>
                                            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>{w.seller?.email || ''}</div>
                                        </td>
                                        <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{w.seller?.shop_name || '—'}</td>
                                        <td style={{ padding: '14px 16px', fontWeight: '800', color: '#f59e0b', fontSize: '16px' }}>
                                            ₹{(w.amount || 0).toLocaleString()}
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span style={{
                                                padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600',
                                                background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc'
                                            }}>{OP_TYPE[w.op_type] || 'Other'}</span>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span style={{
                                                padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600',
                                                background: s.bg, border: `1px solid ${s.border}`, color: s.color
                                            }}>{s.label}</span>
                                        </td>
                                        <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>
                                            {w.createdAt ? new Date(w.createdAt).toLocaleDateString() : '—'}
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            {w.status === 0 ? (
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                    <button
                                                        onClick={() => handleStatus(w._id, 1)}
                                                        disabled={actionLoading === w._id}
                                                        style={{
                                                            background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
                                                            borderRadius: '8px', padding: '6px 10px', cursor: 'pointer',
                                                            color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px',
                                                            fontSize: '12px', fontWeight: '600'
                                                        }}
                                                    ><CheckCircle size={13} /> Approve</button>
                                                    <button
                                                        onClick={() => setRejectModal({ id: w._id })}
                                                        disabled={actionLoading === w._id}
                                                        style={{
                                                            background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
                                                            borderRadius: '8px', padding: '6px 10px', cursor: 'pointer',
                                                            color: '#f87171', display: 'flex', alignItems: 'center', gap: '4px',
                                                            fontSize: '12px', fontWeight: '600'
                                                        }}
                                                    ><XCircle size={13} /> Reject</button>
                                                </div>
                                            ) : (
                                                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>{w.reason || '—'}</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {pages > 1 && (
                    <div style={{ padding: '16px', display: 'flex', justifyContent: 'center', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                        {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                            <button key={p} onClick={() => setPage(p)} style={{
                                width: '36px', height: '36px', borderRadius: '8px', border: 'none',
                                background: p === page ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.06)',
                                color: p === page ? 'white' : 'rgba(255,255,255,0.5)',
                                cursor: 'pointer', fontWeight: '600', fontSize: '14px'
                            }}>{p}</button>
                        ))}
                    </div>
                )}
            </div>

            {/* Reject Modal */}
            {rejectModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{
                        background: '#1e1b4b', border: '1px solid rgba(99,102,241,0.3)',
                        borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '400px'
                    }}>
                        <h3 style={{ margin: '0 0 16px', color: 'white', fontSize: '18px', fontWeight: '700' }}>Reject Withdrawal</h3>
                        <textarea
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            placeholder="Reason for rejection..."
                            style={{
                                width: '100%', padding: '12px', background: 'rgba(255,255,255,0.07)',
                                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
                                color: 'white', fontSize: '14px', minHeight: '90px', outline: 'none',
                                resize: 'vertical', boxSizing: 'border-box'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                            <button onClick={() => setRejectModal(null)} style={{
                                flex: 1, padding: '11px', background: 'rgba(255,255,255,0.07)',
                                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
                                color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontWeight: '600'
                            }}>Cancel</button>
                            <button onClick={() => handleStatus(rejectModal.id, 2, rejectReason)} style={{
                                flex: 1, padding: '11px', background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer', fontWeight: '700'
                            }}>Confirm Reject</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
