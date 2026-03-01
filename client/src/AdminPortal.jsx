import React, { useState, useEffect } from 'react';

// API functions from App
const API_BASE = 'http://localhost:5175';

async function addCollection(col) {
  const res = await fetch(`${API_BASE}/api/collections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: col.name,
      tag: col.tag,
      description: col.description,
      color: col.color,
      image: col.image,
      is_active: col.isActive,
      featured: col.featured || false
    })
  });
  return res.json();
}

async function updateCollection(id, col) {
  const res = await fetch(`${API_BASE}/api/collections/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: col.name,
      tag: col.tag,
      description: col.description,
      color: col.color,
      image: col.image,
      is_active: col.isActive,
      featured: col.featured || false
    })
  });
  return res.json();
}

async function deleteCollection(id) {
  await fetch(`${API_BASE}/api/collections/${id}`, { method: 'DELETE' });
}

function AdminPortal({ collections, onUpdateCollections }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  
  // Admin credentials (in production, use environment variables)
  const ADMIN_PASSWORD = "skadmin123"; // Change this in production
  
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
      setShowLogin(false);
    } else {
      alert('Invalid password');
    }
  };
  
  const logout = () => {
    setIsAuthenticated(false);
  };
  
  if (showLogin && !isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full">
          <h3 className="text-2xl font-bold text-stone-900 mb-2">Admin Login</h3>
          <p className="text-stone-600 mb-6">Enter password to access admin portal</p>
          
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 rounded-lg border border-stone-300 mb-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setShowLogin(false)}
                className="flex-1 px-4 py-3 bg-stone-100 text-stone-700 font-medium rounded-lg hover:bg-stone-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <button
        onClick={() => setShowLogin(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-2 bg-stone-800 text-white text-sm font-medium rounded-lg hover:bg-stone-900 transition-colors shadow-lg"
      >
        Admin
      </button>
    );
  }
  
  return <AdminDashboard collections={collections} onUpdateCollections={onUpdateCollections} onLogout={logout} />;
}

function AdminDashboard({ collections, onUpdateCollections, onLogout }) {
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    tag: '',
    description: '',
    color: 'from-amber-50 to-amber-100',
    image: '',
    isActive: true,
    featured: false
  });
  const [search, setSearch] = useState('');
  
  // Available color gradients for collections
  const colorOptions = [
    { value: 'from-amber-50 to-amber-100', label: 'Amber' },
    { value: 'from-stone-50 to-stone-100', label: 'Stone' },
    { value: 'from-blue-50 to-blue-100', label: 'Blue' },
    { value: 'from-emerald-50 to-emerald-100', label: 'Emerald' },
    { value: 'from-purple-50 to-purple-100', label: 'Purple' },
    { value: 'from-rose-50 to-rose-100', label: 'Rose' },
    { value: 'from-cyan-50 to-cyan-100', label: 'Cyan' },
    { value: 'from-slate-50 to-slate-100', label: 'Slate' },
    { value: 'from-orange-50 to-orange-100', label: 'Orange' },
    { value: 'from-teal-50 to-teal-100', label: 'Teal' },
    { value: 'from-indigo-50 to-indigo-100', label: 'Indigo' },
    { value: 'from-pink-50 to-pink-100', label: 'Pink' },
    { value: 'from-sky-50 to-sky-100', label: 'Sky' },
    { value: 'from-violet-50 to-violet-100', label: 'Violet' },
    { value: 'from-green-50 to-green-100', label: 'Green' },
    { value: 'from-red-50 to-red-100', label: 'Red' },
    { value: 'from-lime-50 to-lime-100', label: 'Lime' },
    { value: 'from-fuchsia-50 to-fuchsia-100', label: 'Fuchsia' },
  ];
  
 const handleAdd = async () => {
  if (!formData.name.trim()) {
    alert('Collection name is required');
    return;
  }
  
  try {
    // Make sure image URL is included
    const collectionData = {
      name: formData.name,
      tag: formData.tag,
      description: formData.description,
      color: formData.color,
      image: formData.image,  // This should now be the permanent URL
      isActive: formData.isActive,
      featured: formData.featured
    };
    
    const saved = await addCollection(collectionData);
    const newCollection = { 
      id: saved.id, 
      ...collectionData,
      isActive: saved.is_active 
    };
    onUpdateCollections([...collections, newCollection]);
    resetForm();
    alert('Collection added successfully!');
  } catch (error) {
    console.error('Error adding collection:', error);
    alert('Failed to add collection. Make sure server is running.');
  }
}; 
  const handleUpdate = async () => {
    if (!formData.name.trim()) {
      alert('Collection name is required');
      return;
    }
    
    try {
      await updateCollection(editingId, formData);
      onUpdateCollections(
        collections.map(col => 
          col.id === editingId ? { ...col, ...formData } : col
        )
      );
      resetForm();
      alert('Collection updated successfully!');
    } catch (error) {
      console.error('Error updating collection:', error);
      alert('Failed to update collection. Make sure server is running.');
    }
  };
  
  const handleEdit = (collection) => {
    setEditingId(collection.id);
    setFormData({
      name: collection.name,
      tag: collection.tag,
      description: collection.description || '',
      color: collection.color,
      isActive: collection.isActive,
      featured: collection.featured || false
    });
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      try {
        await deleteCollection(id);
        onUpdateCollections(collections.filter(col => col.id !== id));
        if (editingId === id) resetForm();
        alert('Collection deleted successfully!');
      } catch (error) {
        console.error('Error deleting collection:', error);
        alert('Failed to delete collection. Make sure server is running.');
      }
    }
  };
  
  const handleToggleStatus = async (id) => {
    const collection = collections.find(c => c.id === id);
    if (!collection) return;
    
    const updated = { ...collection, isActive: !collection.isActive };
    
    try {
      await updateCollection(id, updated);
      onUpdateCollections(
        collections.map(col => col.id === id ? updated : col)
      );
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Failed to update status. Make sure server is running.');
    }
  };
  
  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      tag: '',
      description: '',
      color: 'from-amber-50 to-amber-100',
      image: '',
      isActive: true,
      featured: false
    });
  };

  // Handle image upload: send to server, save permanent URL to form state
  const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  setUploading(true);
  
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const res = await fetch('http://localhost:5175/api/upload-hero-image', {
      method: 'POST',
      body: formData  // Don't set Content-Type header! FormData sets it automatically
    });
    
    const data = await res.json();
    console.log('Upload response:', data);
    
    if (data.url) {
      // Save the permanent URL to formData
      setFormData({...formData, image: data.url});
      alert('✅ Image uploaded successfully! It will now be permanent.');
    }
  } catch (error) {
    console.error('Upload error:', error);
    alert('❌ Upload failed. Check console for details.');
  } finally {
    setUploading(false);
  }
};
  
  const filteredCollections = collections.filter(col => 
    col.name.toLowerCase().includes(search.toLowerCase()) ||
    col.tag.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <div className="fixed inset-0 bg-stone-50 overflow-y-auto z-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 p-6 bg-white rounded-2xl shadow-sm border border-stone-200">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">Collections Admin Portal</h1>
            <p className="text-stone-600 mt-2">Manage all your collections here. Total: {collections.length}</p>
          </div>
          <button
            onClick={onLogout}
            className="px-6 py-3 bg-stone-800 text-white font-medium rounded-lg hover:bg-stone-900 transition-colors"
          >
            Logout
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 sticky top-6">
              <h2 className="text-xl font-bold text-stone-900 mb-6">
                {editingId ? 'Edit Collection' : 'Add New Collection'}
              </h2>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Collection Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g., Summer Essentials"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Tag Line</label>
                  <input
                    type="text"
                    value={formData.tag}
                    onChange={(e) => setFormData({...formData, tag: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g., Light & Breezy"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                    placeholder="Detailed description about the collection..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Color Theme</label>
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {colorOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full"
                  />
                  {formData.image && (
                    <div className="mt-3">
                      <img src={formData.image} alt="preview" className="w-32 h-20 object-cover rounded-md" />
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-3 border border-stone-200 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="w-5 h-5 text-amber-600 rounded"
                    />
                    <span className="text-sm font-medium text-stone-700">Active</span>
                  </label>
                  
                  <label className="flex items-center gap-3 p-3 border border-stone-200 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                      className="w-5 h-5 text-amber-600 rounded"
                    />
                    <span className="text-sm font-medium text-stone-700">Featured</span>
                  </label>
                </div>
                
                {/* Preview */}
                <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                  <div className="text-sm font-medium text-stone-700 mb-2">Preview:</div>
                  <div className={`h-24 rounded-xl bg-gradient-to-br ${formData.color} p-4 flex flex-col justify-between`}>
                    <div className="text-right">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/80 text-stone-700">
                        {formData.tag || 'Tag'}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-stone-900">
                      {formData.name || 'Collection Name'}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  {editingId ? (
                    <>
                      <button
                        type="button"
                        onClick={handleUpdate}
                        className="flex-1 px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        Update Collection
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-6 py-3 bg-stone-100 text-stone-700 font-medium rounded-lg hover:bg-stone-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAdd}
                      className="w-full px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-medium rounded-lg hover:from-amber-700 hover:to-amber-600 transition-all"
                    >
                      Add New Collection
                    </button>
                  )}
                </div>
              </form>
              
              <div className="mt-8 pt-6 border-t border-stone-200">
                <h3 className="text-sm font-medium text-stone-700 mb-3">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-amber-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-amber-700">{collections.length}</div>
                    <div className="text-sm text-amber-600">Total Collections</div>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-stone-700">
                      {collections.filter(c => c.isActive).length}
                    </div>
                    <div className="text-sm text-stone-600">Active</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Collections List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-stone-900">All Collections ({filteredCollections.length})</h2>
                
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search collections..."
                      className="pl-10 pr-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 w-64"
                    />
                    <svg className="w-5 h-5 text-stone-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stone-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-stone-700">Collection</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-stone-700">Tag</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-stone-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-stone-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCollections.map((collection) => (
                      <tr key={collection.id} className="border-b border-stone-100 hover:bg-stone-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-4">
                            {collection.image ? (
                              <img src={collection.image} alt={collection.name} className="w-16 h-16 object-cover rounded-lg" />
                            ) : (
                              <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${collection.color}`}></div>
                            )}
                            <div>
                              <div className="font-medium text-stone-900">{collection.name}</div>
                              {collection.featured && (
                                <span className="inline-block mt-1 text-xs font-medium px-2 py-1 bg-amber-100 text-amber-800 rounded">
                                  Featured
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-stone-600">{collection.tag}</div>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleToggleStatus(collection.id)}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              collection.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {collection.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(collection)}
                              className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(collection.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                            </button>
                            <button
                              onClick={() => window.open(`/collection/${collection.id}`, '_blank')}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    
                    {filteredCollections.length === 0 && (
                      <tr>
                        <td colSpan="4" className="py-12 text-center">
                          <div className="text-stone-400">
                            <svg className="w-16 h-16 mx-auto mb-4 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                            </svg>
                            <p className="text-lg">No collections found</p>
                            <p className="text-sm mt-2">Add your first collection using the form on the left</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex items-center justify-between text-sm text-stone-500">
                <div>
                  Showing {filteredCollections.length} of {collections.length} collections
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-stone-100 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                  </button>
                  <span className="px-3">1</span>
                  <button className="p-2 hover:bg-stone-100 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Import/Export Section */}
            <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
              <h3 className="text-lg font-bold text-stone-900 mb-4">Data Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => {
                    const dataStr = JSON.stringify(collections, null, 2);
                    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                    const link = document.createElement('a');
                    link.setAttribute('href', dataUri);
                    link.setAttribute('download', 'sk-collections-backup.json');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="p-4 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors text-left"
                >
                  <div className="text-amber-600 mb-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <div className="font-medium text-stone-900">Export Collections</div>
                  <div className="text-sm text-stone-600 mt-1">Download all collections as JSON</div>
                </button>
                
                <button
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.json';
                    input.onchange = (e) => {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        try {
                          const importedData = JSON.parse(event.target.result);
                          if (window.confirm(`Import ${importedData.length} collections? This will replace current data.`)) {
                            onUpdateCollections(importedData);
                          }
                        } catch (err) {
                          alert('Invalid JSON file');
                        }
                      };
                      reader.readAsText(file);
                    };
                    input.click();
                  }}
                  className="p-4 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors text-left"
                >
                  <div className="text-emerald-600 mb-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                    </svg>
                  </div>
                  <div className="font-medium text-stone-900">Import Collections</div>
                  <div className="text-sm text-stone-600 mt-1">Upload JSON file to import</div>
                </button>
                
                <button
                  onClick={() => {
                    if (window.confirm('Reset all collections to default? This cannot be undone.')) {
                      onUpdateCollections([]);
                    }
                  }}
                  className="p-4 border border-stone-200 rounded-lg hover:bg-red-50 transition-colors text-left"
                >
                  <div className="text-red-600 mb-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </div>
                  <div className="font-medium text-stone-900">Reset All</div>
                  <div className="text-sm text-stone-600 mt-1">Clear all collections data</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdminPortal;