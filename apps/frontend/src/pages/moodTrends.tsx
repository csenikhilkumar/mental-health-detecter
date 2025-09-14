import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Heart, BarChart3, RefreshCw, AlertCircle, CheckCircle, ArrowLeft, BookOpen } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

type MoodTrend = {
  createAt: string;
  mood: string;
};

type Entry = {
  createAt: string;
};

type MoodData = {
  date: string;
  mood: string;
  moodScore: number;
};

type DayData = {
  date: string;
  entries: number;
};

type MoodCount = {
  mood: string;
  count: number;
  percentage: number;
};

export default function MoodTrendsPage() {
  const [moodTrends, setMoodTrends] = useState<MoodTrend[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadMoodTrends();
  }, []);

  const getAuthToken = () => {
    return typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  };

  const loadMoodTrends = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const token = getAuthToken();

      const response = await fetch('http://localhost:3000/api/v1/routes/mood_trends', {
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
      
      setMoodTrends(data.moodTrend || []);
      setEntries(data.enteries || []);
      setSuccess(true);
    } catch (err: any) {
      console.error('Load error:', err);
      
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Network error: Unable to connect to the server.');
      } else if (err.message.includes('401')) {
        setError('Authentication error: Please log in again.');
      } else if (err.message.includes('403')) {
        setError("Access denied: You don't have permission to view mood trends.");
      } else {
        setError('Failed to load mood trends. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getMoodScore = (mood: string): number => {
    const moodLower = mood.toLowerCase();
    if (moodLower.includes('excited') || moodLower.includes('ecstatic')) return 10;
    if (moodLower.includes('happy') || moodLower.includes('joy')) return 8;
    if (moodLower.includes('good') || moodLower.includes('positive')) return 7;
    if (moodLower.includes('okay') || moodLower.includes('fine')) return 6;
    if (moodLower.includes('neutral')) return 5;
    if (moodLower.includes('tired') || moodLower.includes('bored')) return 4;
    if (moodLower.includes('sad') || moodLower.includes('down')) return 3;
    if (moodLower.includes('angry') || moodLower.includes('frustrated')) return 2;
    if (moodLower.includes('anxious') || moodLower.includes('worried')) return 2;
    if (moodLower.includes('depressed') || moodLower.includes('terrible')) return 1;
    return 5;
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  const processMoodData = (): MoodData[] => {
    return moodTrends.map(item => ({
      date: formatDate(item.createAt),
      mood: item.mood,
      moodScore: getMoodScore(item.mood)
    }));
  };

  const processEntryFrequency = (): DayData[] => {
    const entryCounts: { [key: string]: number } = {};
    
    entries.forEach(entry => {
      const date = formatDate(entry.createAt);
      entryCounts[date] = (entryCounts[date] || 0) + 1;
    });

    return Object.entries(entryCounts).map(([date, count]) => ({
      date,
      entries: count
    })).slice(-14);
  };

  const processMoodDistribution = (): MoodCount[] => {
    const moodCounts: { [key: string]: number } = {};
    
    moodTrends.forEach(item => {
      moodCounts[item.mood] = (moodCounts[item.mood] || 0) + 1;
    });

    const total = moodTrends.length;
    return Object.entries(moodCounts).map(([mood, count]) => ({
      mood,
      count,
      percentage: Math.round((count / total) * 100)
    }));
  };

  const moodChartData = processMoodData();
  const entryFrequencyData = processEntryFrequency();
  const moodDistributionData = processMoodDistribution();

  const pieColors = ['#0f766e', '#155e75', '#1e40af', '#7c2d12', '#be185d', '#9333ea', '#ca8a04', '#dc2626'];

  const getAverageMoodScore = (): number => {
    if (moodChartData.length === 0) return 0;
    const total = moodChartData.reduce((sum, item) => sum + item.moodScore, 0);
    return Math.round((total / moodChartData.length) * 10) / 10;
  };

  const getTotalEntries = (): number => {
    return entries.length;
  };

  const getMostCommonMood = (): string => {
    if (moodDistributionData.length === 0) return 'N/A';
    return moodDistributionData.reduce((prev, current) => 
      prev.count > current.count ? prev : current
    ).mood;
  };


  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoToJournals = () => {
    window.location.href = '/journal-search';
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

            
          </div>
          
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <TrendingUp className="w-8 h-8 sm:w-10 md:w-12 text-teal-300 mr-2 sm:mr-3" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-100">Mood Trends</h1>
            </div>
            <p className="text-slate-300 text-sm sm:text-base md:text-lg px-4">Track your emotional journey and journal patterns</p>
          </div>
        </div>

        {loading && (
          <div className="bg-slate-100 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-teal-600 mr-3"></div>
              <span className="text-teal-900 text-sm sm:text-base">Loading mood trends...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-slate-100 border-l-4 border-red-500 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-800 font-bold text-sm sm:text-base">Error</p>
                <p className="text-red-700 text-xs sm:text-sm mt-1">{error}</p>
                <button
                  onClick={loadMoodTrends}
                  className="mt-2 sm:mt-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-teal-600 text-slate-100 rounded-lg hover:bg-teal-700 transition duration-200 text-xs sm:text-sm font-semibold"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {success && !loading && moodTrends.length > 0 && (
          <div className="bg-slate-100 border-l-4 border-teal-500 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-start sm:items-center">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 mr-3 flex-shrink-0 mt-0.5 sm:mt-0" />
              <p className="text-teal-900 font-semibold text-sm sm:text-base">
                Loaded {moodTrends.length} mood entries and {entries.length} journal entries!
              </p>
            </div>
            <button
              onClick={loadMoodTrends}
              className="px-3 sm:px-4 py-2 bg-teal-600 hover:bg-teal-700 text-slate-100 rounded-lg transition duration-200 flex items-center justify-center text-xs sm:text-sm font-semibold self-start sm:self-auto"
            >
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Refresh
            </button>
          </div>
        )}

        {!loading && moodTrends.length > 0 && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
              <div className="bg-slate-100 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-teal-900 text-xs sm:text-sm font-semibold">Average Mood</p>
                    <p className="text-xl sm:text-2xl font-bold text-slate-800">{getAverageMoodScore()}/10</p>
                  </div>
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600" />
                </div>
              </div>

              <div className="bg-slate-100 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-teal-900 text-xs sm:text-sm font-semibold">Total Entries</p>
                    <p className="text-xl sm:text-2xl font-bold text-slate-800">{getTotalEntries()}</p>
                  </div>
                  <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600" />
                </div>
              </div>

              <div className="bg-slate-100 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-teal-900 text-xs sm:text-sm font-semibold">Most Common</p>
                    <p className="text-sm sm:text-lg font-bold text-slate-800 truncate">{getMostCommonMood()}</p>
                  </div>
                  <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600 flex-shrink-0" />
                </div>
              </div>

              <div className="bg-slate-100 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-teal-900 text-xs sm:text-sm font-semibold">Tracking Since</p>
                    <p className="text-sm sm:text-lg font-bold text-slate-800">
                      {moodTrends.length > 0 ? formatDate(moodTrends[0].createAt) : 'N/A'}
                    </p>
                  </div>
                  <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600" />
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
              {/* Mood Score Chart */}
              <div className="bg-slate-100 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
                <h2 className="text-lg sm:text-xl font-bold text-teal-900 mb-4 sm:mb-6">Mood Score Over Time</h2>
                <div className="w-full" style={{ height: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={moodChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#0f766e" 
                        fontSize={10}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis 
                        stroke="#0f766e" 
                        fontSize={10}
                        domain={[1, 10]}
                        tick={{ fontSize: 10 }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#e2e8f0',
                          fontSize: '12px'
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Line 
                        type="monotone" 
                        dataKey="moodScore" 
                        stroke="#0f766e" 
                        strokeWidth={2}
                        dot={{ fill: '#0f766e', strokeWidth: 2, r: 3 }}
                        name="Mood Score"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Entry Frequency Chart */}
              <div className="bg-slate-100 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
                <h2 className="text-lg sm:text-xl font-bold text-teal-900 mb-4 sm:mb-6">Journal Entry Frequency</h2>
                <div className="w-full" style={{ height: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={entryFrequencyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#0f766e" 
                        fontSize={10}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis 
                        stroke="#0f766e" 
                        fontSize={10}
                        tick={{ fontSize: 10 }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#e2e8f0',
                          fontSize: '12px'
                        }}
                      />
                      <Bar dataKey="entries" fill="#0f766e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Bottom Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {/* Pie Chart */}
              <div className="bg-slate-100 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
                <h2 className="text-lg sm:text-xl font-bold text-teal-900 mb-4 sm:mb-6">Mood Distribution</h2>
                <div className="w-full" style={{ height: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={moodDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ mood, percentage }) => window.innerWidth >= 640 ? `${mood} (${percentage}%)` : `${percentage}%`}
                        outerRadius={window.innerWidth >= 640 ? 80 : 60}
                        fill="#8884d8"
                        dataKey="count"
                        fontSize={window.innerWidth >= 640 ? 12 : 10}
                      >
                        {moodDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#e2e8f0',
                          fontSize: '12px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Mood Breakdown */}
              <div className="bg-slate-100 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
                <h2 className="text-lg sm:text-xl font-bold text-teal-900 mb-4 sm:mb-6">Mood Breakdown</h2>
                <div className="space-y-3 sm:space-y-4 max-h-60 overflow-y-auto">
                  {moodDistributionData.map((item, index) => (
                    <div key={item.mood} className="flex items-center justify-between py-1">
                      <div className="flex items-center flex-1 min-w-0">
                        <div 
                          className="w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-2 sm:mr-3 flex-shrink-0"
                          style={{ backgroundColor: pieColors[index % pieColors.length] }}
                        ></div>
                        <span className="text-slate-800 font-medium text-sm sm:text-base truncate">{item.mood}</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
                        <span className="text-slate-600 text-xs sm:text-sm">{item.count}</span>
                        <span className="text-teal-900 font-semibold text-xs sm:text-sm">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {!loading && moodTrends.length === 0 && !error && (
          <div className="text-center py-8 sm:py-12 bg-slate-100 rounded-xl sm:rounded-2xl shadow-2xl">
            <TrendingUp className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-teal-900 mb-2">No mood data found</h3>
            <p className="text-slate-600 font-medium text-sm sm:text-base px-4 mb-4">Start writing journal entries to see your mood trends!</p>
            <button
              onClick={handleGoToJournals}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-teal-600 text-slate-100 rounded-lg hover:bg-teal-700 transition duration-200 font-semibold text-sm sm:text-base flex items-center mx-auto"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Go to Journal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}