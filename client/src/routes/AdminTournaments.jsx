import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminTournaments = () => {
  const { user, token } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    banner: '',
    date: ''
  });
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/tournaments');
      const data = await response.json();
      
      if (data.success) {
        setTournaments(data.tournaments);
      }
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, or WEBP)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setBannerFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = async () => {
    if (!bannerFile) {
      alert('Please select a banner image first');
      return;
    }

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('banner', bannerFile);

    try {
      console.log('Uploading banner file:', bannerFile.name);
      const response = await fetch('http://localhost:3000/api/tournaments/upload-banner', {
        method: 'POST',
        headers: {
          'userid': user._id,
          'Authorization': `Bearer ${token}`
        },
        body: uploadData
      });

      const data = await response.json();
      console.log('Upload response:', data);

      if (response.ok && data.banner) {
        setFormData({ ...formData, banner: data.banner });
        console.log('Banner path set to:', data.banner);
        alert('Banner uploaded successfully!');
      } else {
        alert(data.message || 'Failed to upload banner');
      }
    } catch (error) {
      console.error('Error uploading banner:', error);
      alert('Failed to upload banner');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate banner upload
    if (!formData.banner) {
      alert('Please upload a banner image before creating the tournament');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/tournaments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'userid': user._id,
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert('Tournament created successfully!');
        setFormData({ name: '', banner: '', date: '' });
        setBannerFile(null);
        setBannerPreview(null);
        setShowForm(false);
        fetchTournaments();
      } else {
        alert(data.message || 'Failed to create tournament');
      }
    } catch (error) {
      console.error('Error creating tournament:', error);
      alert('Failed to create tournament');
    }
  };

  const handleStatusChange = async (tournamentId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/api/tournaments/${tournamentId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'userid': user._id,
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (data.success) {
        alert('Tournament status updated!');
        fetchTournaments();
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (tournamentId) => {
    if (window.confirm('Are you sure you want to delete this tournament?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/tournaments/${tournamentId}`, {
          method: 'DELETE',
          headers: {
            'userid': user._id,
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (data.success) {
          alert('Tournament deleted successfully!');
          fetchTournaments();
        } else {
          alert(data.message || 'Failed to delete tournament');
        }
      } catch (error) {
        console.error('Error deleting tournament:', error);
        alert('Failed to delete tournament');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl shadow-2xl mb-10 p-8">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="admin-tournament-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="2" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#admin-tournament-pattern)" />
            </svg>
          </div>
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold text-white">Manage Tournaments</h1>
              </div>
              <p className="text-white/90 text-lg">Create and manage football tournaments</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold border-2 border-white/30"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              {showForm ? 'Cancel' : 'Create Tournament'}
            </button>
          </div>
        </div>

        {/* Create Tournament Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Create New Tournament
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tournament Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                  placeholder="e.g., Summer Championship 2025"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Banner Image
                </label>
                <div className="space-y-4">
                  {/* File Input */}
                  <div className="flex items-center gap-4">
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerChange}
                        className="hidden"
                      />
                      <div className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 transition-colors text-center">
                        <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-gray-600">
                          {bannerFile ? bannerFile.name : 'Click to select banner image'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">JPEG, PNG, GIF, WEBP (max 5MB)</p>
                      </div>
                    </label>
                    {bannerFile && (
                      <button
                        type="button"
                        onClick={handleBannerUpload}
                        disabled={uploading}
                        className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {uploading ? 'Uploading...' : 'Upload'}
                      </button>
                    )}
                  </div>

                  {/* Preview */}
                  {bannerPreview && (
                    <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-gray-200">
                      <img
                        src={bannerPreview}
                        alt="Banner preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Upload Status */}
                  {formData.banner && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-green-700 font-semibold">Banner uploaded successfully</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tournament Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>Registration Fee:</strong> ৳500 (fixed)
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                Create Tournament
              </button>
            </form>
          </div>
        )}

        {/* Tournaments List */}
        <div className="space-y-6">
          {tournaments.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-xl">
              <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Tournaments Yet</h3>
              <p className="text-gray-600">Create your first tournament to get started</p>
            </div>
          ) : (
            tournaments.map((tournament) => (
              <div key={tournament._id} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Banner */}
                  <div className="lg:w-64 h-48 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl overflow-hidden flex-shrink-0">
                    {tournament.banner ? (
                      <img
                        src={tournament.banner}
                        alt={tournament.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.log('Failed to load banner:', tournament.banner);
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{tournament.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                            tournament.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                            tournament.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {tournament.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Date</p>
                        <p className="font-bold text-gray-900">{formatDate(tournament.date)}</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Participants</p>
                        <p className="font-bold text-gray-900">{tournament.participants.length}</p>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Fee</p>
                        <p className="font-bold text-gray-900">৳{tournament.registrationFee}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <select
                        value={tournament.status}
                        onChange={(e) => handleStatusChange(tournament._id, e.target.value)}
                        className="px-4 py-2 border-2 border-gray-200 rounded-xl font-semibold focus:border-green-500 focus:outline-none"
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                      </select>

                      <button
                        onClick={() => handleDelete(tournament._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTournaments;
