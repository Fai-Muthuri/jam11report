import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Download, X, MapPin, Clock, ThumbsUp,
  AlertTriangle, Play, CheckCircle, Shield, Leaf, Heart, Info
} from 'lucide-react';

interface Report {
  id: number;
  title: string;
  ward: string;
  category: 'security' | 'environment' | 'health' | 'other';
  status: 'pending' | 'in-progress' | 'resolved';
  dateReported: string;
  votes: number;
  reporter: string;
  description: string;
  isUrgent: boolean;
}

const AdminReportsPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    search: ''
  });
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { id: 'security', name: 'Security', icon: Shield, color: 'bg-red-100 text-red-700 border-red-200' },
    { id: 'environment', name: 'Environment', icon: Leaf, color: 'bg-green-100 text-green-700 border-green-200' },
    { id: 'health', name: 'Health', icon: Heart, color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { id: 'other', name: 'Other', icon: Info, color: 'bg-gray-100 text-gray-700 border-gray-200' }
  ];

  const statusOptions = [
    { id: 'pending', name: 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { id: 'in-progress', name: 'In Progress', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { id: 'resolved', name: 'Resolved', color: 'bg-green-100 text-green-700 border-green-200' }
  ];

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [reports, filters]);

  const fetchReports = async () => {
    try {
      const mockReports: Report[] = [
        {
          id: 1,
          title: "Open drain causing flooding on main road",
          ward: "Lindi",
          category: "environment",
          status: "pending",
          dateReported: "2025-01-15T10:00:00Z",
          votes: 67,
          reporter: "John Mwangi",
          description: "There is a large open drain on the main road that causes severe flooding during rainy seasons. The drain has been blocked for months and is affecting local businesses and residents.",
          isUrgent: false
        },
        {
          id: 2,
          title: "Street fights disrupting market business",
          ward: "Makina",
          category: "security",
          status: "in-progress",
          dateReported: "2025-01-12T15:40:00Z",
          votes: 54,
          reporter: "Grace Wanjiku",
          description: "Daily street fights near the market area are disrupting business and creating an unsafe environment for traders and customers. Police presence is needed urgently.",
          isUrgent: true
        },
        {
          id: 3,
          title: "Broken streetlights on residential street",
          ward: "Laini Saba",
          category: "security",
          status: "resolved",
          dateReported: "2025-01-10T09:20:00Z",
          votes: 32,
          reporter: "Peter Kamau",
          description: "Multiple streetlights along the residential area have been broken for weeks, creating safety concerns for residents returning home at night.",
          isUrgent: false
        },
        {
          id: 4,
          title: "Garbage collection not happening regularly",
          ward: "Woodley",
          category: "environment",
          status: "pending",
          dateReported: "2025-01-08T14:15:00Z",
          votes: 45,
          reporter: "Mary Njeri",
          description: "Garbage collection has been irregular for the past month, leading to accumulation of waste that poses health risks to the community.",
          isUrgent: false
        },
        {
          id: 5,
          title: "Water shortage affecting entire neighborhood",
          ward: "Sarang'ombe",
          category: "health",
          status: "in-progress",
          dateReported: "2025-01-05T11:30:00Z",
          votes: 78,
          reporter: "David Ochieng",
          description: "Our neighborhood has been without clean water for over a week. This is affecting over 200 families and creating serious health concerns.",
          isUrgent: true
        },
        {
          id: 6,
          title: "Potholes damaging vehicles on main highway",
          ward: "Lindi",
          category: "other",
          status: "pending",
          dateReported: "2025-01-03T08:45:00Z",
          votes: 91,
          reporter: "Samuel Kiprotich",
          description: "Large potholes on the main highway are causing vehicle damage and creating dangerous driving conditions. Several accidents have been reported.",
          isUrgent: true
        }
      ];

      setReports(mockReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...reports];

    if (filters.category) {
      filtered = filtered.filter(report => report.category === filters.category);
    }

    if (filters.status) {
      filtered = filtered.filter(report => report.status === filters.status);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(searchLower) ||
        report.ward.toLowerCase().includes(searchLower) ||
        report.reporter.toLowerCase().includes(searchLower)
      );
    }

    setFilteredReports(filtered);
  };

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "ID,Title,Ward,Category,Status,Date Reported,Votes,Reporter\n" +
      filteredReports.map(report =>
        `${report.id},"${report.title}",${report.ward},${report.category},${report.status},${report.dateReported},${report.votes},"${report.reporter}"`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reports.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[3];
  };

  const getStatusInfo = (statusId: string) => {
    return statusOptions.find(status => status.id === statusId) || statusOptions[0];
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  const handleMarkUrgent = (reportId: number) => {
    setReports(prev =>
      prev.map(report =>
        report.id === reportId ? { ...report, isUrgent: !report.isUrgent } : report
      )
    );

    if (selectedReport?.id === reportId) {
      setSelectedReport(prev => prev ? { ...prev, isUrgent: !prev.isUrgent } : null);
    }
  };

  const handleStatusChange = (reportId: number, newStatus: 'pending' | 'in-progress' | 'resolved') => {
    setReports(prev =>
      prev.map(report =>
        report.id === reportId ? { ...report, status: newStatus } : report
      )
    );

    if (selectedReport?.id === reportId) {
      setSelectedReport(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const stats = [
    { label: 'Total Reports', value: reports.length, color: 'bg-blue-500' },
    { label: 'Pending', value: reports.filter(r => r.status === 'pending').length, color: 'bg-yellow-500' },
    { label: 'Urgent', value: reports.filter(r => r.isUrgent).length, color: 'bg-red-500' },
    { label: 'Resolved', value: reports.filter(r => r.status === 'resolved').length, color: 'bg-green-500' }
  ];

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports Center</h1>
          <p className="text-gray-600 mt-1">Monitor, review, and manage all community reports</p>
        </div>
        <button
          onClick={exportData}
          className="flex items-center space-x-2 px-4 py-2 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 ${stat.color} rounded-lg opacity-20`}></div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
      >
        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent text-sm"
          >
            <option value="">All Categories ▼</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent text-sm"
          >
            <option value="">All Status ▼</option>
            {statusOptions.map(status => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>

          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by report, ward, or reporter..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredReports.map((report, index) => {
            const categoryInfo = getCategoryInfo(report.category);
            const statusInfo = getStatusInfo(report.status);
            const CategoryIcon = categoryInfo.icon;

            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedReport(report)}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                {report.isUrgent && (
                  <div className="flex items-center space-x-1 mb-3 px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full w-fit">
                    <AlertTriangle className="w-3 h-3" />
                    <span>URGENT</span>
                  </div>
                )}

                <h3 className="font-semibold text-gray-900 mb-3 leading-tight line-clamp-2">
                  {report.title}
                </h3>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    {report.ward}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${categoryInfo.color}`}>
                    <CategoryIcon className="w-3 h-3 inline mr-1" />
                    {categoryInfo.name}
                  </span>
                </div>

                <div className="text-xs text-gray-500 mb-3">
                  by {report.reporter}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                    {statusInfo.name}
                  </span>

                  <div className="flex items-center space-x-3 text-sm">
                    <div className="flex items-center text-gray-600">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {report.votes}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatTimeAgo(report.dateReported)}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl">
          <p className="text-gray-500">No reports found</p>
        </div>
      )}

      <AnimatePresence>
        {selectedReport && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReport(null)}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {selectedReport.isUrgent && (
                        <span className="flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          <span>URGENT</span>
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusInfo(selectedReport.status).color}`}>
                        {getStatusInfo(selectedReport.status).name}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedReport.title}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Category</span>
                    <div className="flex items-center space-x-2">
                      {React.createElement(getCategoryInfo(selectedReport.category).icon, { className: "w-4 h-4" })}
                      <span className="font-medium">{getCategoryInfo(selectedReport.category).name}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Ward</span>
                    <span className="font-medium">{selectedReport.ward}</span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Reporter</span>
                    <span className="font-medium">{selectedReport.reporter}</span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Date Reported</span>
                    <span className="font-medium">{new Date(selectedReport.dateReported).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Community Votes</span>
                    <span className="font-medium flex items-center">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {selectedReport.votes}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedReport.description}</p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handleMarkUrgent(selectedReport.id)}
                    className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                      selectedReport.isUrgent
                        ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>{selectedReport.isUrgent ? 'Unmark Urgent' : 'Mark as Urgent'}</span>
                  </button>

                  {selectedReport.status === 'pending' && (
                    <button
                      onClick={() => handleStatusChange(selectedReport.id, 'in-progress')}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      <span>Start Work</span>
                    </button>
                  )}

                  {selectedReport.status === 'in-progress' && (
                    <button
                      onClick={() => handleStatusChange(selectedReport.id, 'resolved')}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Resolve</span>
                    </button>
                  )}
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Admin Notes</h3>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent text-sm"
                    rows={3}
                    placeholder="Add internal notes or comments..."
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminReportsPage;
