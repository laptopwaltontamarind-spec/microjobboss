import React, { useState } from 'react';
import { 
  Megaphone, 
  Plus, 
  Pin, 
  Trash2, 
  Edit3, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Tag, 
  Search,
  Sparkles,
  Info,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NoticeItem, NoticeCategory } from '../../types';

export const NoticeBoardAdmin: React.FC = () => {
  const { 
    notices, 
    addNotice, 
    updateNotice, 
    deleteNotice, 
    togglePinNotice, 
    toggleActiveNotice,
    currentAdmin 
  } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<NoticeItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NoticeCategory>('general');
  const [priority, setPriority] = useState<'normal' | 'high' | 'urgent'>('normal');
  const [scheduleTime, setScheduleTime] = useState('');
  const [targetAudience, setTargetAudience] = useState<'all' | 'investors' | 'new_members'>('all');
  const [isPinned, setIsPinned] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [authorName, setAuthorName] = useState('MicroJobBoss Official');

  const openCreateModal = () => {
    setEditingNotice(null);
    setTitle('');
    setContent('');
    setCategory('general');
    setPriority('normal');
    setScheduleTime('');
    setTargetAudience('all');
    setIsPinned(false);
    setIsActive(true);
    setAuthorName('MicroJobBoss Official');
    setIsCreateModalOpen(true);
  };

  const openEditModal = (notice: NoticeItem) => {
    setEditingNotice(notice);
    setTitle(notice.title);
    setContent(notice.content);
    setCategory(notice.category);
    setPriority(notice.priority);
    setScheduleTime(notice.scheduleTime || '');
    setTargetAudience(notice.targetAudience);
    setIsPinned(notice.isPinned);
    setIsActive(notice.isActive);
    setAuthorName(notice.authorName || 'MicroJobBoss Official');
    setIsCreateModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingNotice) {
      updateNotice(editingNotice.id, {
        title: title.trim(),
        content: content.trim(),
        category,
        priority,
        scheduleTime: scheduleTime.trim() || undefined,
        targetAudience,
        isPinned,
        isActive,
        authorName: authorName.trim() || 'MicroJobBoss Official'
      });
    } else {
      addNotice({
        title: title.trim(),
        content: content.trim(),
        category,
        priority,
        scheduleTime: scheduleTime.trim() || undefined,
        targetAudience,
        isPinned,
        isActive,
        authorName: authorName.trim() || 'MicroJobBoss Official'
      });
    }

    setIsCreateModalOpen(false);
  };

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
      case 'schedule': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'maintenance': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'offer': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'urgent': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'update': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    }
  };

  const filteredNotices = notices.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (n.scheduleTime && n.scheduleTime.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategoryFilter === 'all' || n.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              নোটিশ বোর্ড কন্ট্রোল প্যানেল
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {notices.length} টি নোটিশ
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              সাইটের সকল মেম্বারদের জন্য কখন কী করা হবে, ডিপোজিট-উইথড্র সময়সূচি বা জরুরি নোটিশ প্রকাশ করুন
            </p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 text-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন নোটিশ যোগ করুন</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
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

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar text-xs">
          {[
            { id: 'all', label: 'সকল নোটিশ' },
            { id: 'schedule', label: 'সময়সূচি' },
            { id: 'maintenance', label: 'রক্ষণাবেক্ষণ' },
            { id: 'update', label: 'আপডেট' },
            { id: 'offer', label: 'অফার' },
            { id: 'urgent', label: 'জরুরি' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategoryFilter === cat.id
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
      <div className="space-y-3">
        {filteredNotices.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-500">
            <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-30 text-amber-400" />
            <p className="text-sm font-semibold">কোনো নোটিশ পাওয়া যায়নি</p>
            <p className="text-xs text-slate-600 mt-1">
              "নতুন নোটিশ যোগ করুন" বাটনে ক্লিক করে নতুন ঘোষণা দিন
            </p>
          </div>
        ) : (
          filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className={`bg-slate-900 border rounded-xl p-4 transition-all ${
                notice.isPinned
                  ? 'border-amber-500/40 bg-gradient-to-r from-amber-950/20 via-slate-900 to-slate-900 shadow-md shadow-amber-500/5'
                  : 'border-slate-800 hover:border-slate-700'
              } ${!notice.isActive ? 'opacity-60' : ''}`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  {/* Badges Row */}
                  <div className="flex flex-wrap items-center gap-2">
                    {notice.isPinned && (
                      <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
                        <Pin className="w-3 h-3 fill-amber-400" />
                        পিন করা নোটিশ
                      </span>
                    )}

                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${getCategoryBadgeClass(notice.category)}`}>
                      {getCategoryLabel(notice.category)}
                    </span>

                    {notice.priority === 'urgent' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase">
                        Urgent
                      </span>
                    )}

                    {!notice.isActive && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        নিষ্ক্রিয় (Hidden)
                      </span>
                    )}

                    <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {new Date(notice.createdAt).toLocaleString('bn-BD', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-white leading-snug">
                    {notice.title}
                  </h3>

                  {/* Schedule Time Box (Kokhon ki kora hobe) */}
                  {notice.scheduleTime && (
                    <div className="inline-flex items-center gap-2 bg-slate-950/80 border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs text-amber-300">
                      <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>
                        <strong className="text-amber-400 font-semibold">কার্যকর সময়সূচি:</strong> {notice.scheduleTime}
                      </span>
                    </div>
                  )}

                  {/* Content Preview */}
                  <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                    {notice.content}
                  </p>

                  {/* Footer Meta */}
                  <div className="pt-1 flex items-center gap-3 text-[11px] text-slate-500">
                    <span>পোস্টদাতা: <strong className="text-slate-400">{notice.authorName || 'MicroJobBoss Official'}</strong></span>
                    <span>•</span>
                    <span>লক্ষ্য: <strong className="text-slate-400">{notice.targetAudience === 'all' ? 'সকল সদস্য' : notice.targetAudience === 'investors' ? 'প্ল্যান মেম্বার' : 'নতুন মেম্বার'}</strong></span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center md:flex-col gap-1.5 shrink-0 self-end md:self-start">
                  <button
                    onClick={() => togglePinNotice(notice.id)}
                    className={`p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                      notice.isPinned 
                        ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' 
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                    }`}
                    title={notice.isPinned ? 'আনপিন করুন' : 'শীর্ষে পিন করুন'}
                  >
                    <Pin className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => toggleActiveNotice(notice.id)}
                    className={`p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                      notice.isActive 
                        ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' 
                        : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                    title={notice.isActive ? 'লুকিয়ে রাখুন (Hide)' : 'সক্রিয় করুন (Show)'}
                  >
                    {notice.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => openEditModal(notice)}
                    className="p-2 rounded-lg text-xs bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                    title="সম্পাদনা করুন"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('আপনি কি নিশ্চিত এই নোটিশটি ডিলিট করতে চান?')) {
                        deleteNotice(notice.id);
                      }
                    }}
                    className="p-2 rounded-lg text-xs bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                    title="ডিলিট করুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Notice Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  {editingNotice ? 'নোটিশ সম্পাদনা করুন' : 'নতুন নোটিশ তৈরি করুন'}
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Title */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  নোটিশের শিরোনাম / বিষয় <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ⚡ ডিপোজিট ও উইথড্রয়াল সময়সূচি সংক্রান্ত নোটিশ"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Schedule Time (Kokhon ki kora hobe) */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                  <span>কখন কী করা হবে / সময়সূচি (ঐচ্ছিক)</span>
                  <span className="text-[10px] text-amber-400">খুব গুরুত্বপূর্ণ</span>
                </label>
                <input
                  type="text"
                  placeholder="যেমন: আজ রাত ১২:০০ টা থেকে ভোর ৪:০০ টা পর্যন্ত বা প্রতিদিন সকাল ৯টা - রাত ১১টা"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 placeholder:text-slate-600"
                />
                <p className="text-[10px] text-slate-500 mt-0.5">
                  সদস্যদের স্পষ্টভাবে জানিয়ে দিন কাজটি কখন শুরু হবে এবং কখন শেষ হবে।
                </p>
              </div>

              {/* Category & Priority Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">ক্যাটাগরি</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as NoticeCategory)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="general">📢 সাধারণ ঘোষণা</option>
                    <option value="schedule">⚡ সময়সূচি ও শিডিউল</option>
                    <option value="maintenance">🛠 রক্ষণাবেক্ষণ</option>
                    <option value="offer">🎁 অফার ও বোনাস</option>
                    <option value="update">🚀 সিস্টেম আপডেট</option>
                    <option value="urgent">⚠️ জরুরি নোটিশ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">অগ্রাধিকার (Priority)</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="normal">Normal (সাধারণ)</option>
                    <option value="high">High (উচ্চ)</option>
                    <option value="urgent">Urgent (জরুরি)</option>
                  </select>
                </div>
              </div>

              {/* Target Audience & Author */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">প্রাপক / লক্ষ্য</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="all">সকল মেম্বার (All)</option>
                    <option value="investors">প্ল্যান গ্রহণকারী (Investors)</option>
                    <option value="new_members">নতুন মেম্বার (New Users)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">পোস্টকারী স্বাক্ষর</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  নোটিশের বিস্তারিত বিবরণ <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="নোটিশের সম্পূর্ণ বার্তা এখানে লিখুন... বিস্তারিত নিয়ম, দিকনির্দেশনা ও করণীয়।"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
                />
              </div>

              {/* Checkboxes Row */}
              <div className="flex items-center gap-6 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-0 focus:outline-none"
                  />
                  <span className="text-slate-300 font-medium flex items-center gap-1">
                    <Pin className="w-3.5 h-3.5 text-amber-400" />
                    শীর্ষে পিন করে রাখুন
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-0 focus:outline-none"
                  />
                  <span className="text-slate-300 font-medium">
                    এখনই প্রকাশ করুন (Active)
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  {editingNotice ? 'নোটিশ আপডেট করুন' : 'নোটিশ প্রকাশ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
