import React, { useState, useEffect } from 'react';
import { Archive, RotateCcw, Search, Filter, RefreshCw, ShieldCheck, Trash2 } from 'lucide-react';
import { archiveService } from '../../services/archiveService';
import type { ArchivedRecord } from '../../services/archiveService';
import AdminModal from '../components/ui/AdminModal';
import AdminButton from '../components/ui/AdminButton';

export default function AdminArchiveManager() {
  const [items, setItems] = useState<ArchivedRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Modal target states
  const [restoreTarget, setRestoreTarget] = useState<ArchivedRecord | null>(null);
  const [processing, setProcessing] = useState(false);
  const [isPurgingAll, setIsPurgingAll] = useState(false);

  const fetchArchives = async () => {
    setLoading(true);
    try {
      const data = await archiveService.getArchivedItems();
      setItems(data);
    } catch {
      // ignore fetch error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchives();
  }, []);

  // Filter modules options for category dropdown
  const moduleOptions = Array.from(new Set(items.map((i) => i.module_name))).sort();

  // Filtered item list
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesModule = selectedModule === 'all' || item.module_name === selectedModule;

    return matchesSearch && matchesModule;
  });

  // Handle Restore Confirm
  const handleRestoreConfirm = async () => {
    if (!restoreTarget) return;
    setProcessing(true);
    const res = await archiveService.restoreItem(restoreTarget);
    setProcessing(false);
    setRestoreTarget(null);

    if (res.success) {
      setActionNotice(`Successfully restored "${restoreTarget.title}" to its original module.`);
      setTimeout(() => setActionNotice(null), 4000);
      fetchArchives();
    }
  };

  // Handle Complete Pre-Launch Archive Data Purge
  const handlePurgeAllArchives = async () => {
    if (!window.confirm('Are you sure you want to delete ALL development archive data for production pre-launch? Active website items will NOT be touched.')) {
      return;
    }

    setIsPurgingAll(true);
    try {
      const res = await archiveService.purgeAllArchivedData();
      if (res.success) {
        setActionNotice(`Pre-launch archive cleanup complete. Deleted ${res.count} development archive record(s).`);
        setTimeout(() => setActionNotice(null), 5000);
        fetchArchives();
      }
    } catch {
      setActionNotice('Failed to purge archive data.');
    } finally {
      setIsPurgingAll(false);
    }
  };

  return (
    <div className="space-y-6 text-left select-none max-w-[1300px]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-xs">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-lg bg-[#0093DD]/10 text-[#0093DD] flex items-center justify-center">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#1F2937]">Archive</h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]">
                  {items.length} {items.length === 1 ? 'Item' : 'Items'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#6B7280]">
                View and restore archived website content. Archived records are protected against manual deletion.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {items.length > 0 && (
            <button
              type="button"
              onClick={handlePurgeAllArchives}
              disabled={isPurgingAll}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer"
              title="Clear all development test items from archive for production launch"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isPurgingAll ? 'Purging Archives...' : 'Pre-Launch Archive Purge'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={fetchArchives}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#374151] bg-[#F9FAFB] hover:bg-[#F3F4F6] border border-[#E5E7EB] rounded-lg transition-colors cursor-pointer"
            title="Refresh Archive"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Archive Protection Banner */}
      <div className="p-4 bg-[#F0F9FF] border border-[#BAE6FD] text-[#0369A1] rounded-xl flex items-start sm:items-center gap-3 text-xs sm:text-sm shadow-xs">
        <ShieldCheck className="w-5 h-5 text-[#0284C7] flex-shrink-0" />
        <div>
          <span className="font-bold">Archive Protection Active: </span>
          <span>
            Archived records are protected against manual permanent deletion. Archived data is retained indefinitely and automatically cleaned up when storage capacity threshold is reached.
          </span>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-lg flex items-center gap-2 shadow-xs">
          <span className="font-semibold">✓</span>
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Filters & Search Controls */}
      <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search archived content by title..."
            className="w-full pl-9 pr-4 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-xs sm:text-sm text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#0093DD] focus:bg-white transition-all"
          />
        </div>

        {/* Category Filter */}
        <div className="relative w-full sm:w-[220px]">
          <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-xs sm:text-sm text-[#1F2937] focus:outline-none focus:border-[#0093DD] focus:bg-white transition-all appearance-none cursor-pointer"
          >
            <option value="all">All Modules ({items.length})</option>
            {moduleOptions.map((mod) => {
              const count = items.filter((i) => i.module_name === mod).length;
              return (
                <option key={mod} value={mod}>
                  {mod} ({count})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Main List / Empty State */}
      {loading ? (
        <div className="bg-white p-12 rounded-xl border border-[#E5E7EB] shadow-xs text-center">
          <div className="w-8 h-8 border-3 border-[#0093DD] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-[#6B7280]">Loading archive contents...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white p-12 sm:p-16 rounded-xl border border-[#E5E7EB] shadow-xs text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-[#F3F4F6] text-[#9CA3AF] flex items-center justify-center mb-4">
            <Archive className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-[#1F2937] mb-1">Archive is empty.</h3>
          <p className="text-xs sm:text-sm text-[#6B7280] max-w-[360px]">
            Archived website content will appear here and remain protected.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const formattedDate = new Date(item.archived_at).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={`${item.source_key}_${item.id}`}
                className="bg-white p-4 sm:p-5 rounded-xl border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#CBD5E1] transition-colors"
              >
                {/* Info Block */}
                <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                  {/* Thumbnail / Icon */}
                  <div className="w-12 h-12 rounded-lg bg-[#F3F4F6] border border-[#E5E7EB] overflow-hidden flex items-center justify-center flex-shrink-0">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <Archive className="w-5 h-5 text-[#9CA3AF]" />
                    )}
                  </div>

                  {/* Title & Metadata */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#0093DD]/10 text-[#0093DD]">
                        {item.module_name}
                      </span>
                      <span className="text-[11px] font-medium text-[#9CA3AF]">
                        Archived: {formattedDate}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#1F2937] truncate">{item.title}</h3>
                    {item.subtitle && (
                      <p className="text-xs text-[#6B7280] truncate mt-0.5">{item.subtitle}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F3F4F6] w-full sm:w-auto justify-end">
                  {/* Restore Button */}
                  <button
                    type="button"
                    onClick={() => setRestoreTarget(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#0093DD] hover:text-white bg-[#0093DD]/10 hover:bg-[#0093DD] rounded-lg transition-colors cursor-pointer border border-[#0093DD]/20"
                    title="Restore item to original location"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore</span>
                  </button>

                  {/* Archive Deletion Protection Badge */}
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0369A1] bg-[#F0F9FF] border border-[#BAE6FD] rounded-lg cursor-default select-none"
                    title="Archived items are protected against manual permanent deletion. Storage threshold cleanup purges oldest items when capacity limit is reached."
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0284C7]" />
                    <span>Protected</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Restore Confirmation Modal */}
      <AdminModal
        isOpen={!!restoreTarget}
        onClose={() => setRestoreTarget(null)}
        title="Restore Archived Item?"
      >
        <div className="space-y-4 text-left">
          <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
            This item will be restored to its original CMS module ({restoreTarget?.module_name}) and will become visible on the website again.
          </p>
          <div className="p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
            <span className="text-xs font-bold text-[#1F2937] block">{restoreTarget?.title}</span>
            {restoreTarget?.subtitle && (
              <span className="text-xs text-[#6B7280] block mt-0.5">{restoreTarget.subtitle}</span>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <AdminButton variant="secondary" onClick={() => setRestoreTarget(null)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleRestoreConfirm} disabled={processing}>
              {processing ? 'Restoring...' : 'Restore Item'}
            </AdminButton>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
