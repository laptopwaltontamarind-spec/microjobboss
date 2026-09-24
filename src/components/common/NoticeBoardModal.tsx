import React, { useState } from 'react';
import { 
  Megaphone, 
  X, 
  Pin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  Search,
  ChevronRight,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NoticeCategory } from '../../types';

export const NoticeBoardModal: React.FC = () => {
  const { 
    notices, 
    isNoticeBoardModalOpen, 
    setIsNoticeBoardModalOpen 
  } = useApp();

  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isNoticeBoardModalOpen) return null;

  const activeNotices = notices.filter(n => n.isActive);

  const getCategoryLabel = (cat: NoticeCategory) => {
    switch (cat) {
      case 'general': return 'সাধারণ ঘোষণা';
      case 'schedule': return 'সময়সূচি';
      case 'maintenance': return 'রক্ষণাবেক্ষণ';
      case 'offer': return 'অফার ও বোনাস';
      case 'update': return 'আপডেট';
      case 'urgent': return 'জরুরি নোটিশ';
      default: return cat;
    }
  };

  const getCategoryBadgeClass = (cat: NoticeCategory) => {
    switch (cat) {
      case 'schedule': return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
      case 'maintenance': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'offer': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'urgent': return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'update': return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      default: return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    }
  };

  const filteredNotices = activeNotices.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (n.scheduleTime && n.scheduleTime.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedFilter === 'all' || n.category === selectedFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-transparent border-b border-slate-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">অফিশিয়াল নোটিশ বোর্ড</h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  MicroJobBoss
                </span>
              </div>
              <p className="text-xs text-slate-400">সকল আপডেট, সময়সূচি ও গুরুত্বপূর্ণ প্ল্যাটফর্ম ঘোষণা</p>
            </div>
          </div>

          <button
            onClick={() => setIsNoticeBoardModalOpen(false)}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="নোটিশ খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar text-[11px]">
            {[
              { id: 'all', label: 'সব' },
              { id: 'schedule', label: 'সময়সূচি' },
              { id: 'maintenance', label: 'রক্ষণাবেক্ষণ' },
              { id: 'offer', label: 'অফার' },
              { id: 'update', label: 'আপডেট' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedFilter(cat.id)}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                  selectedFilter === cat.id
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notice List Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {filteredNotices.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-30 text-amber-400" />
              <p className="text-xs">কোনো নোটিশ পাওয়া যায়নি</p>
            </div>
          ) : (
            filteredNotices.map((notice) => (
              <div
                key={notice.id}
                className={`bg-slate-950/80 border rounded-2xl p-4 sm:p-5 space-y-3 transition-all ${
                  notice.isPinned
                    ? 'border-amber-500/50 bg-gradient-to-br from-amber-950/20 via-slate-950/90 to-slate-950 shadow-lg shadow-amber-500/5'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Meta Row */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {notice.isPinned && (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        <Pin className="w-2.5 h-2.5 fill-amber-400" />
                        পিন করা নোটিশ
                      </span>
                    )}

                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(notice.category)}`}>
                      {getCategoryLabel(notice.category)}
                    </span>

                    {notice.priority === 'urgent' && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase">
                        Emergency
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {new Date(notice.createdAt).toLocaleString('bn-BD', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm sm:text-base font-bold text-slate-100 leading-snug">
                  {notice.title}
                </h3>

                {/* Schedule Time Box (Kokhon ki kora hobe) */}
                {notice.scheduleTime && (
                  <div className="bg-amber-500/10 border border-amber-500/30 px-3 py-2 rounded-xl text-xs text-amber-300 flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-slate-400 text-[11px] block">কার্যকর সময় / শিডিউল:</span>
                      <strong className="text-amber-300 font-semibold">{notice.scheduleTime}</strong>
                    </div>
                  </div>
                )}

                {/* Content */}
                <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                  {notice.content}
                </p>

                {/* Footer Signature */}
                <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>{notice.authorName || 'MicroJobBoss Official'}</span>
                  </div>
                  <span className="text-slate-500">
                    {notice.targetAudience === 'all' ? 'সকল সদস্যদের জন্য' : 'প্ল্যান মেম্বারদের জন্য'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-center">
          <button
            onClick={() => setIsNoticeBoardModalOpen(false)}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
