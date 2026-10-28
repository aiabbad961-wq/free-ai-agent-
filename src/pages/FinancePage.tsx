import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  ShieldCheck,
  Plus,
  Copy,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
} from 'lucide-react';

interface FinancePageProps {
  onOpenAddPayment: () => void;
}

export const FinancePage: React.FC<FinancePageProps> = ({ onOpenAddPayment }) => {
  const { payments, bank, verifyPayment, flagPayment, showToast } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  const copyVal = (val: string, label: string) => {
    navigator.clipboard.writeText(val);
    showToast(`${label} copied to clipboard!`);
  };

  const filteredPayments = payments.filter((p) => {
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchesSearch =
      p.clientName.toLowerCase().includes(search.toLowerCase()) ||
      p.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.method.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const verifiedPkr = payments
    .filter((p) => p.status === 'verified' && p.currency === 'PKR')
    .reduce((sum, p) => sum + p.amount, 0);

  const verifiedUsd = payments
    .filter((p) => p.status === 'verified' && p.currency === 'USD')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPkr = payments
    .filter((p) => p.status === 'pending' && p.currency === 'PKR')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Mezan Bank Credentials Card & Financial Inflow Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Treasury Account Card */}
        <div className="lg:col-span-1 rounded-2xl bg-[var(--panel)] border border-[var(--line)] p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--muted)]">
                  Primary Treasury
                </span>
                <div className="font-bold text-xs text-[var(--txt)]">{bank.Bank}</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 font-semibold">
              Live Verified
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="text-[10px] text-[var(--muted)] mb-0.5">Account Title</div>
              <div className="font-semibold text-xs text-[var(--txt)] font-mono">{bank['Account Title']}</div>
            </div>

            <div className="group">
              <div className="text-[10px] text-[var(--muted)] mb-0.5">IBAN (International Bank Account)</div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--panel2)] border border-[var(--line)]">
                <span className="font-mono text-xs tabular-nums text-[var(--txt)] select-all">{bank.IBAN}</span>
                <button
                  onClick={() => copyVal(bank.IBAN, 'IBAN')}
                  className="p-1 rounded hover:bg-[var(--line)] text-[var(--muted)] hover:text-blue-400 transition-colors"
                  title="Copy IBAN"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="group">
              <div className="text-[10px] text-[var(--muted)] mb-0.5">Account Number</div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--panel2)] border border-[var(--line)]">
                <span className="font-mono text-xs tabular-nums text-[var(--txt)] select-all">{bank['Account #']}</span>
                <button
                  onClick={() => copyVal(bank['Account #'], 'Account Number')}
                  className="p-1 rounded hover:bg-[var(--line)] text-[var(--muted)] hover:text-blue-400 transition-colors"
                  title="Copy Account #"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs pt-1">
              <span className="text-[var(--muted)] text-[11px]">Settlement Currency:</span>
              <span className="font-mono font-semibold text-emerald-400">{bank.Currency} (Pakistani Rupee)</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-[11px] text-emerald-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Vault (Fraud Detection Officer) inspects all inbound bank slips.</span>
          </div>
        </div>

        {/* Financial Stat Cards (2 Columns on Desktop) */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[var(--panel)] border border-[var(--line)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[var(--muted)] mb-2">
                <span>Verified PKR Inflow</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  Cleared
                </span>
              </div>
              <div className="text-2xl font-bold font-mono tabular-nums text-[var(--txt)]">
                Rs {verifiedPkr.toLocaleString()}
              </div>
            </div>
            <p className="text-[11px] text-[var(--muted)] mt-4">Direct Mezan Bank transfers settled in full.</p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--panel)] border border-[var(--line)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[var(--muted)] mb-2">
                <span>Verified USD Inflow</span>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                  Wire / SWIFT
                </span>
              </div>
              <div className="text-2xl font-bold font-mono tabular-nums text-[var(--txt)]">
                ${verifiedUsd.toLocaleString()}
              </div>
            </div>
            <p className="text-[11px] text-[var(--muted)] mt-4">Foreign exchange escrow & contract payments.</p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--panel)] border border-[var(--line)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[var(--muted)] mb-2">
                <span>Pending Clearance</span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                  In Queue
                </span>
              </div>
              <div className="text-2xl font-bold font-mono tabular-nums text-[var(--txt)]">
                Rs {pendingPkr.toLocaleString()}
              </div>
            </div>
            <p className="text-[11px] text-[var(--muted)] mt-4">Awaiting Vault verification and deposit slips.</p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--panel)] border border-[var(--line)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[var(--muted)] mb-2">
                <span>Verification Integrity</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  100% Verified
                </span>
              </div>
              <div className="text-2xl font-bold font-mono tabular-nums text-[var(--txt)]">
                Zero Fraud
              </div>
            </div>
            <p className="text-[11px] text-[var(--muted)] mt-4">All transactions cross-checked by agent Vault.</p>
          </div>
        </div>
      </div>

      {/* Payment Ledger Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-blue-600 text-white font-semibold'
                : 'bg-[var(--panel)] border border-[var(--line)] text-[var(--muted)] hover:text-[var(--txt)]'
            }`}
          >
            All Inflow ({payments.length})
          </button>
          <button
            onClick={() => setFilterStatus('verified')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === 'verified'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'bg-[var(--panel)] border border-[var(--line)] text-[var(--muted)] hover:text-[var(--txt)]'
            }`}
          >
            Verified ({payments.filter((p) => p.status === 'verified').length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === 'pending'
                ? 'bg-amber-600 text-white font-semibold'
                : 'bg-[var(--panel)] border border-[var(--line)] text-[var(--muted)] hover:text-[var(--txt)]'
            }`}
          >
            Pending ({payments.filter((p) => p.status === 'pending').length})
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[var(--muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoices or clients..."
              className="pl-8 pr-3 py-1.5 rounded-lg bg-[var(--panel)] border border-[var(--line)] text-xs text-[var(--txt)] placeholder:text-[var(--muted)] focus:outline-hidden focus:border-blue-500 w-48 sm:w-56"
            />
          </div>

          <button
            onClick={onOpenAddPayment}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Payments Ledger Table */}
      <div className="rounded-xl bg-[var(--panel)] border border-[var(--line)] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--line)] bg-[var(--panel2)] text-[11px] font-semibold text-[var(--muted)]">
                <th className="py-3 px-4">Client / Entity</th>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-[var(--muted)]">
                    No payment records found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-[var(--panel2)]/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[var(--txt)]">{payment.clientName}</div>
                      {payment.notes && (
                        <div className="text-[10px] text-[var(--muted)] line-clamp-1">{payment.notes}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[var(--muted)]">
                      {payment.invoiceNumber}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums text-[var(--txt)]">
                      {payment.currency === 'PKR' ? 'Rs ' : '$'}
                      {payment.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-[var(--muted)] text-[11px]">{payment.method}</td>
                    <td className="py-3 px-4">
                      {payment.status === 'verified' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified ({payment.verifiedBy || 'Vault'})</span>
                        </span>
                      )}
                      {payment.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20">
                          <span>Pending Slip</span>
                        </span>
                      )}
                      {payment.status === 'flagged' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20">
                          <AlertCircle className="w-3 h-3" />
                          <span>Flagged Review</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[var(--muted)]">{payment.date}</td>
                    <td className="py-3 px-4 text-right">
                      {payment.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => verifyPayment(payment.id, 'Vault')}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px] transition-colors shadow-xs"
                          >
                            Verify with Vault
                          </button>
                          <button
                            onClick={() => flagPayment(payment.id)}
                            className="px-2 py-1 rounded border border-[var(--line)] text-rose-400 hover:bg-rose-500/10 transition-colors text-[11px]"
                          >
                            Flag
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[var(--muted)] font-mono">Audited OK</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
