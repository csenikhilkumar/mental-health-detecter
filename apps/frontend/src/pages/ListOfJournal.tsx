import { useState, useEffect } from 'react';
import { Search, BookOpen, AlertCircle, CheckCircle, RefreshCw, User, Heart, Lightbulb, Trash2, Edit2, X, Save, TrendingUp, ArrowLeft } from 'lucide-react';

type Journal = {
  id: number;
  mood: string;
  entry: string;
  suggestion?: string;
  userId: string;
  createAt: string;
};

export default function JournalSearchPage() {
  const [allJournals, setAllJournals] = useState<Journal[]>([]);
  const [filteredJournals, setFilteredJournals] = useState<Journal[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [editingJournal, setEditingJournal] = useState<Journal | null>(null);
  const [editForm, setEditForm] = useState({ mood: '', entry: '' });
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    loadUserJournals();
  }, []);

  useEffect(() => {
    filterJournals();
  }, [searchQuery, allJournals]);

  const getAuthToken = () => {
    return typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  };

  const loadUserJournals = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const token = getAuthToken();

      const response = await fetch('http://localhost:3000/api/v1/routes/Journal', {
        method: 'GET',
        headers: {
          'token': token || '',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setAllJournals(data.data || []);
        setFilteredJournals(data.data || []);
        if (data.data && data.data.length > 0) {
          setSuccess(true);
        }
        setError('');
      } else {
        setError(data.message || 'Failed to load journals');
        setAllJournals([]);
        setFilteredJournals([]);
      }
    } catch (err: any) {
      console.error('Load error:', err);

      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Network error: Unable to connect to the server. Please check your internet connection.');
      } else if (err.message.includes('401')) {
        setError('Authentication error: Please log in again.');
      } else if (err.message.includes('403')) {
        setError("Access denied: You don't have permission to view these journals.");
      } else if (err.message.includes('404')) {
        setError('API endpoint not found. Please contact support.');
      } else if (err.message.includes('500')) {
        setError('Server error: Please try again later.');
      } else {
        setError('Failed to load journals. Please try again.');
      }

      setAllJournals([]);
      setFilteredJournals([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteJournal = async (journalId: number) => {
    if (!confirm('Are you sure you want to delete this journal entry?')) {
      return;
    }

    setDeleteLoading(journalId);
    try {
      const token = getAuthToken();

      const response = await fetch(`http://localhost:3000/api/v1/routes/Journal/${journalId}`, {
        method: 'DELETE',
        headers: {
          'token': token || '',
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setAllJournals(prev => prev.filter(journal => journal.id !== journalId));
        setFilteredJournals(prev => prev.filter(journal => journal.id !== journalId));
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.message || 'Failed to delete journal');
        setTimeout(() => setError(''), 5000);
      }
    } catch (err: any) {
      console.error('Delete error:', err);
      setError('Failed to delete journal. Please try again.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setDeleteLoading(null);
    }
  };

  const openEditModal = (journal: Journal) => {
    setEditingJournal(journal);
    setEditForm({ mood: journal.mood, entry: journal.entry });
  };

  const closeEditModal = () => {
    setEditingJournal(null);
    setEditForm({ mood: '', entry: '' });
    setEditLoading(false);
  };

  const updateJournal = async () => {
    if (!editingJournal || !editForm.mood.trim() || !editForm.entry.trim()) {
      setError('Please fill in both mood and entry fields.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setEditLoading(true);
    try {
      const token = getAuthToken();

      const response = await fetch(`http://localhost:3000/api/v1/routes/Journal/${editingJournal.id}`, {
        method: 'PUT',
        headers: {
          'token': token || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mood: editForm.mood,
          entry: editForm.entry,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const updatedJournal = { ...editingJournal, mood: editForm.mood, entry: editForm.entry };
        setAllJournals(prev => prev.map(journal => 
          journal.id === editingJournal.id ? updatedJournal : journal
        ));
        setFilteredJournals(prev => prev.map(journal => 
          journal.id === editingJournal.id ? updatedJournal : journal
        ));
        
        closeEditModal();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.message || 'Failed to update journal');
        setTimeout(() => setError(''), 5000);
      }
    } catch (err: any) {
      console.error('Update error:', err);
      setError('Failed to update journal. Please try again.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setEditLoading(false);
    }
  };

  const filterJournals = () => {
    setSearchLoading(true);

    let filtered = [...allJournals];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (journal) =>
          (journal.mood && journal.mood.toLowerCase().includes(query)) ||
          (journal.entry && journal.entry.toLowerCase().includes(query)) ||
          (journal.suggestion && journal.suggestion.toLowerCase().includes(query))
      );
    }

    setFilteredJournals(filtered);

    setTimeout(() => {
      setSearchLoading(false);
    }, 200);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm || !text) return text;

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-teal-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const getMoodColor = (mood: string) => {
    const moodLower = mood.toLowerCase();
    if (moodLower.includes('happy') || moodLower.includes('joy') || moodLower.includes('excited')) {
      return 'bg-teal-100 text-teal-800';
    } else if (moodLower.includes('sad') || moodLower.includes('down') || moodLower.includes('depressed')) {
      return 'bg-slate-200 text-slate-800';
    } else if (moodLower.includes('angry') || moodLower.includes('frustrated') || moodLower.includes('mad')) {
      return 'bg-red-200 text-red-800';
    } else if (moodLower.includes('anxious') || moodLower.includes('worried') || moodLower.includes('nervous')) {
      return 'bg-orange-200 text-orange-800';
    } else if (moodLower.includes('calm') || moodLower.includes('peaceful') || moodLower.includes('relaxed')) {
      return 'bg-teal-200 text-teal-900';
    } else {
      return 'bg-slate-200 text-slate-800';
    }
  };

  const handleGoToMoodTrends = () => {
    window.location.href = '/MoodTrends';
  };

  const handleGoBack = () => {
    
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:absolute sm:top-0 sm:right-0 mb-6 sm:mb-0 order-first sm:order-last">
            <button
              onClick={handleGoBack}
              className="flex items-center justify-center sm:justify-start space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-200"
              title="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </button>

            <button
              onClick={handleGoToMoodTrends}
              className="flex items-center justify-center sm:justify-start space-x-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg text-white hover:from-teal-600 hover:to-cyan-600 transition-all duration-200 shadow-lg"
              title="View mood trends and analytics"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Mood Trends</span>
            </button>
          </div>
          
          {/* Header content */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <BookOpen className="w-8 h-8 sm:w-10 md:w-12 text-teal-300 mr-2 sm:mr-3" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-100">My Entries</h1>
            </div>
            <p className="text-slate-300 text-sm sm:text-base md:text-lg px-4">View and search through your journal entries</p>
          </div>
        </div>

        {loading && (
          <div className="bg-slate-100 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-teal-600 mr-3"></div>
              <span className="text-teal-900 text-sm sm:text-base">Loading your journals...</span>
            </div>
          </div>
        )}

        {!loading && (
          <div className="bg-slate-100 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-teal-900">
                Search Journals 
                <span className="block sm:inline text-sm sm:text-base font-normal text-slate-600 mt-1 sm:mt-0">
                  ({filteredJournals.length} of {allJournals.length} entries)
                </span>
              </h2>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={loadUserJournals}
                  disabled={loading}
                  className="px-3 sm:px-4 py-2 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 rounded-lg transition duration-200 flex items-center justify-center text-xs sm:text-sm font-semibold text-slate-700"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Refresh
                </button>
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="px-3 sm:px-4 py-2 bg-teal-600 hover:bg-teal-700 text-slate-100 rounded-lg transition duration-200 text-xs sm:text-sm font-semibold"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs sm:text-sm font-semibold text-teal-900 mb-2">
                Search in Moods, Entries, and Suggestions
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-3 pl-10 sm:pl-12 bg-teal-200 border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent transition duration-200 text-teal-900 placeholder-teal-700 text-sm sm:text-base"
                  placeholder="Enter keywords to search..."
                />
                <Search className="absolute left-3 sm:left-4 top-2.5 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-teal-700" />
                {searchLoading && (
                  <div className="absolute right-3 sm:right-4 top-2.5 sm:top-3.5">
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-teal-600"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-slate-100 border-l-4 border-red-500 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-bold text-sm sm:text-base">Error</p>
                <p className="text-red-700 text-xs sm:text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && !loading && (
          <div className="bg-slate-100 border-l-4 border-teal-500 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6 flex items-center">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 mr-3 flex-shrink-0" />
            <p className="text-teal-900 font-semibold text-sm sm:text-base">
              Operation completed successfully!
            </p>
          </div>
        )}

        {!loading && searchQuery && (
          <div className="bg-slate-100 border-l-4 border-teal-400 rounded-xl sm:rounded-2xl shadow-2xl p-4 mb-4 sm:mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs sm:text-sm text-teal-900 font-semibold">Searching for:</span>
              <span className="px-2 sm:px-3 py-1 bg-teal-600 text-slate-100 rounded-full text-xs sm:text-sm font-semibold">
                "{searchQuery}"
              </span>
            </div>
          </div>
        )}

        {!loading && filteredJournals.length > 0 && (
          <div className="space-y-4 sm:space-y-6">
            {filteredJournals.map((journal, index) => (
              <div
                key={journal.id}
                className="bg-slate-100 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden border-l-4 border-teal-500 hover:shadow-3xl transition-shadow duration-300"
              >
                <div className="p-4 sm:p-6 md:p-8">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                        <span className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center w-fit ${getMoodColor(journal.mood)}`}>
                          <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          {searchQuery
                            ? highlightSearchTerm(journal.mood, searchQuery)
                            : journal.mood}
                        </span>
                        <span className="text-xs sm:text-sm text-slate-600 font-semibold">
                          {formatDate(journal.createAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-start">
                      <button
                        onClick={() => openEditModal(journal)}
                        className="px-2 sm:px-3 py-1.5 sm:py-2 bg-teal-600 hover:bg-teal-700 text-slate-100 rounded-lg transition duration-200 flex items-center text-xs sm:text-sm font-semibold"
                      >
                        <Edit2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => deleteJournal(journal.id)}
                        disabled={deleteLoading === journal.id}
                        className="px-2 sm:px-3 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-slate-100 rounded-lg transition duration-200 flex items-center text-xs sm:text-sm font-semibold"
                      >
                        {deleteLoading === journal.id ? (
                          <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-slate-100 mr-1"></div>
                        ) : (
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        )}
                        <span className="hidden sm:inline">
                          {deleteLoading === journal.id ? 'Deleting...' : 'Delete'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-xs sm:text-sm font-bold text-teal-900 mb-2 sm:mb-3 flex items-center">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Journal Entry
                    </h3>
                    <div className="bg-teal-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <p className="text-teal-900 leading-relaxed font-medium text-sm sm:text-base">
                        {searchQuery
                          ? highlightSearchTerm(
                              journal.entry.length > 300
                                ? `${journal.entry.substring(0, 300)}...`
                                : journal.entry,
                              searchQuery
                            )
                          : journal.entry.length > 300
                          ? `${journal.entry.substring(0, 300)}...`
                          : journal.entry}
                      </p>
                    </div>
                  </div>

                  {journal.suggestion && (
                    <div className="mb-4">
                      <h3 className="text-xs sm:text-sm font-bold text-teal-900 mb-2 sm:mb-3 flex items-center">
                        <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Suggestion
                      </h3>
                      <div className="bg-slate-200 rounded-lg sm:rounded-xl p-3 sm:p-4 border-l-4 border-teal-600">
                        <p className="text-slate-800 leading-relaxed font-medium text-sm sm:text-base">
                          {searchQuery
                            ? highlightSearchTerm(journal.suggestion, searchQuery)
                            : journal.suggestion}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && allJournals.length > 0 && filteredJournals.length === 0 && (
          <div className="text-center py-8 sm:py-12 bg-slate-100 rounded-xl sm:rounded-2xl shadow-2xl">
            <Search className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-teal-900 mb-2">No matching entries found</h3>
            <p className="text-slate-600 mb-4 font-medium text-sm sm:text-base px-4">
              {searchQuery
                ? `No journal entries found containing "${searchQuery}". Try searching for different moods, entries, or suggestions.`
                : 'Use the search box above to find specific journal entries.'}
            </p>
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-teal-600 text-slate-100 rounded-lg hover:bg-teal-700 transition duration-200 font-semibold text-sm sm:text-base"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {!loading && allJournals.length === 0 && !error && (
          <div className="text-center py-8 sm:py-12 bg-slate-100 rounded-xl sm:rounded-2xl shadow-2xl">
            <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-teal-900 mb-2">No journal entries found</h3>
            <p className="text-slate-600 font-medium text-sm sm:text-base px-4">You haven't created any journal entries yet. Start writing to see them here!</p>
          </div>
        )}

        {/* Edit Modal */}
        {editingJournal && (
          <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-100 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-teal-900">Edit Journal Entry</h2>
                <button
                  onClick={closeEditModal}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-teal-900 mb-2">
                    Mood
                  </label>
                  <input
                    type="text"
                    value={editForm.mood}
                    onChange={(e) => setEditForm({ ...editForm, mood: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-teal-200 border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent transition duration-200 text-teal-900 text-sm sm:text-base"
                    placeholder="Enter your mood..."
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-teal-900 mb-2">
                    Journal Entry
                  </label>
                  <textarea
                    value={editForm.entry}
                    onChange={(e) => setEditForm({ ...editForm, entry: e.target.value })}
                    rows={6}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-teal-200 border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent transition duration-200 text-teal-900 resize-none text-sm sm:text-base"
                    placeholder="Write your journal entry..."
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                  <button
                    onClick={closeEditModal}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-slate-300 hover:bg-slate-400 text-slate-800 rounded-lg transition duration-200 font-semibold text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updateJournal}
                    disabled={editLoading}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-slate-100 rounded-lg transition duration-200 font-semibold flex items-center justify-center text-sm sm:text-base"
                  >
                    {editLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-slate-100 mr-2"></div>
                    ) : (
                      <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    )}
                    {editLoading ? 'Updating...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}