import React, { useState } from 'react';
import { 
  Megaphone, 
  Pin, 
  Calendar, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Search, 
  BellRing,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NoticeCategory } from '../../types';

export const NoticeBoardView: React.FC = () => {
  const { notices } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const activeNotices = notices.filter(n => n.isActive);

  const getCategoryLabel = (cat: NoticeCategory) => {
    switch (cat) {
      case 'general': return 'সাধারণ ঘোষণা';
      case 'schedule': return 'সময়সূচি ও শিডিউল';
      case 'maintenance': return 'রক্ষণাবেক্ষণ';
      case 'offer': return 'অফার ও বোনাস';
      case 'update': return 'সিস্টেম আপডেট';
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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              অফিশিয়াল নোটিশ বোর্ড (Notice Board)
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {activeNotices.length} টি আপডেট
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              MicroJobBoss-এর সকল প্ল্যাটফর্ম আপডেট, লেনদেন সময়সূচি এবং জরুরি ঘোষণা
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/60 px-3.5 py-2 rounded-xl border border-slate-800 self-start sm:self-auto">
          <BellRing className="w-4 h-4 text-amber-400" />
          <span>নিয়মিত নোটিশ বোর্ড চেক করুন</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="নোটিশ খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar text-xs">
          {[
            { id: 'all', label: 'সকল নোটিশ' },
            { id: 'schedule', label: 'সময়সূচি' },
            { id: 'maintenance', label: 'রক্ষণাবেক্ষণ' },
            { id: 'offer', label: 'অফার ও বোনাস' },
            { id: 'update', label: 'আপডেট' },
            { id: 'urgent', label: 'জরুরি' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                selectedFilter === cat.id
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
            <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-30 text-amber-400" />
            <p className="text-sm font-semibold">কোনো সক্রিয় নোটিশ নেই</p>
            <p className="text-xs text-slate-600 mt-1">
              পরবর্তী যেকোনো আপডেট এখানে স্বয়ংক্রিয়ভাবে প্রকাশ করা হবে
            </p>
          </div>
        ) : (
          filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className={`bg-slate-900 border rounded-2xl p-5 space-y-3.5 transition-all ${
                notice.isPinned
                  ? 'border-amber-500/50 bg-gradient-to-r from-amber-950/20 via-slate-900 to-slate-900 shadow-lg shadow-amber-500/5'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Badges & Timestamp */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  {notice.isPinned && (
                    <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                      <Pin className="w-3 h-3 fill-amber-400" />
                      পিন করা গুরুত্বপূর্ণ নোটিশ
                    </span>
                  )}

                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getCategoryBadgeClass(notice.category)}`}>
                    {getCategoryLabel(notice.category)}
                  </span>

                  {notice.priority === 'urgent' && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase">
                      Urgent Alert
                    </span>
                  )}
                </div>

                <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(notice.createdAt).toLocaleString('bn-BD', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                {notice.title}
              </h3>

              {/* Schedule Box (Kokhon ki kora hobe) */}
              {notice.scheduleTime && (
                <div className="bg-amber-500/10 border border-amber-500/30 px-3.5 py-2.5 rounded-xl text-xs text-amber-300 flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 text-[11px] block">কখন কী করা হবে / কার্যকর সময়সূচি:</span>
                    <strong className="text-amber-300 font-semibold">{notice.scheduleTime}</strong>
                  </div>
                </div>
              )}

              {/* Content */}
              <p className="text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                {notice.content}
              </p>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>পোস্টকারী: <strong className="text-slate-300">{notice.authorName || 'MicroJobBoss Official'}</strong></span>
                </div>
                <span>
                  {notice.targetAudience === 'all' ? 'সকল সদস্য' : 'ইনভেস্টর মেম্বার'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
