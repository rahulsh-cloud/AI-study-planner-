import React, { useState } from 'react';
import { 
  Bookmark, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Star, 
  Video, 
  FileText, 
  Globe, 
  Search, 
  Sparkles,
  X
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { StudyResource, ResourceType } from '../../types';

export const ResourcesView: React.FC = () => {
  const { 
    resources, 
    addResource, 
    deleteResource, 
    toggleResourceFavorite, 
    subjects 
  } = useStudy();

  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'youtube' | 'pdf' | 'notes'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<ResourceType>('youtube');
  const [notes, setNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const handleOpenAdd = () => {
    setTitle('');
    setUrl('');
    setNotes('');
    setTagsInput('');
    setIsAddModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const sub = subjects.find(s => s.id === subjectId);
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    addResource({
      title: title.trim(),
      subjectId,
      subjectName: sub?.name || 'General Subject',
      type,
      url: url.trim() || undefined,
      notes: notes.trim() || undefined,
      tags: tags.length > 0 ? tags : ['Study Material'],
      isFavorite: false
    });

    setIsAddModalOpen(false);
  };

  const filteredResources = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;

    if (activeTab === 'favorites') return r.isFavorite;
    if (activeTab === 'youtube') return r.type === 'youtube';
    if (activeTab === 'pdf') return r.type === 'pdf';
    if (activeTab === 'notes') return r.type === 'notes';
    return true;
  });

  const getIcon = (type: ResourceType) => {
    switch (type) {
      case 'youtube': return <Video className="h-4 w-4 text-rose-500" />;
      case 'pdf': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'cheat_sheet': return <Sparkles className="h-4 w-4 text-amber-500" />;
      default: return <Globe className="h-4 w-4 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Academic Resources & Bookmarks
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Organize lecture video playlists, professor PDFs, GitHub repositories, and formula cheat sheets.
          </p>
        </div>

        <button
          id="add-resource-btn"
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Add Resource</span>
        </button>
      </div>

      {/* 2. Search & Category Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes, videos, cheat sheets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {(['all', 'favorites', 'youtube', 'pdf', 'notes'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                activeTab === tab
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              {tab === 'favorites' ? '⭐ Favorites' : tab === 'youtube' ? 'YouTube' : tab === 'pdf' ? 'PDFs' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            No resources match your search or filter.
          </div>
        ) : (
          filteredResources.map((res) => (
            <div
              key={res.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                      {getIcon(res.type)}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {res.subjectName}
                      </span>
                      <span className="text-[10px] text-slate-400 block capitalize">
                        {res.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleResourceFavorite(res.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 transition"
                  >
                    <Star className={`h-4 w-4 ${res.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {res.title}
                </h3>

                {res.notes && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                    {res.notes}
                  </p>
                )}

                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {res.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                {res.url ? (
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <span>Open Resource</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-400">Saved Note</span>
                )}

                <button
                  onClick={() => deleteResource(res.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition"
                  title="Delete Resource"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Resource Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Bookmark Study Resource</h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Stanford DBMS Lecture Notes & Solutions"
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Format</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ResourceType)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="youtube">YouTube Video</option>
                    <option value="pdf">PDF Document</option>
                    <option value="website">Website / Doc</option>
                    <option value="cheat_sheet">Formula Cheat Sheet</option>
                    <option value="notes">Personal Notes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">URL (Optional)</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. Normalization, SQL, BCNF"
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                >
                  Save Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
