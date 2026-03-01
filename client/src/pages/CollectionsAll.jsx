// src/CollectionsAll.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CollectionsAll.css'; // This is correct if CSS is in same folder

function CollectionsAll() {
  const [collections, setCollections] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Load collections from localStorage
  useEffect(() => {
    const savedCollections = localStorage.getItem('skCollections');
    if (savedCollections) {
      try {
        setCollections(JSON.parse(savedCollections));
      } catch (e) {
        console.error('Error loading collections:', e);
      }
    }
  }, []);

  const filteredCollections = collections.filter(col => {
    // Filter by active status
    if (!col.isActive && activeFilter !== 'all') return false;
    
    // Filter by category
    if (activeFilter === 'featured' && !col.featured) return false;
    if (activeFilter === 'new') {
      if (!col.createdAt) return false;
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return new Date(col.createdAt) > thirtyDaysAgo;
    }
    
    // Search filter
    if (searchTerm && 
        !col.name?.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !col.tag?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full border-2 border-stone-100 overflow-hidden">
              <img 
                src="/assets/SK%20COOl%20COTTON%20LOGO.jpg" 
                alt="SK Cool Cotton Logo" 
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-stone-800 to-amber-800 bg-clip-text text-transparent">
                SK Cool Cotton
              </h1>
              <p className="text-xs text-stone-500">Collections Catalog</p>
            </div>
          </Link>
          
          <Link 
            to="/"
            className="px-6 py-2.5 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black text-stone-900 mb-6">
            All Collections
          </h1>
          <p className="text-lg text-stone-600 max-w-3xl mx-auto mb-10">
            Browse through our complete range of premium cotton collections. 
            Each piece is crafted with meticulous attention to detail for ultimate comfort and style.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search collections by name or tag..."
                className="w-full px-6 py-4 pl-12 rounded-full border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white shadow-sm"
              />
              <svg className="w-5 h-5 text-stone-400 absolute left-4 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {[
            { id: 'all', label: 'All Collections' },
            { id: 'featured', label: 'Featured' },
            { id: 'new', label: 'New Arrivals' },
            { id: 'active', label: 'Available Now' },
            { id: 'summer', label: 'Summer' },
            { id: 'winter', label: 'Winter' }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeFilter === filter.id
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Collections Count */}
        <div className="mb-8 text-center">
          <span className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
            {filteredCollections.length} {filteredCollections.length === 1 ? 'Collection' : 'Collections'} Found
          </span>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCollections.map((collection) => (
            <div 
              key={collection.id} 
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                {collection.image ? (
                  <img 
                    src={collection.image} 
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className={`w-full h-full ${collection.color} flex items-center justify-center`}>
                    <div className="text-5xl opacity-20">
                      {collection.id % 3 === 0 ? '👕' : collection.id % 3 === 1 ? '👔' : '👚'}
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {collection.featured && (
                    <span className="px-3 py-1 bg-amber-600 text-white text-xs font-bold rounded-full">
                      Featured
                    </span>
                  )}
                  {!collection.isActive && (
                    <span className="px-3 py-1 bg-stone-600 text-white text-xs font-bold rounded-full">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-stone-900 mb-1">{collection.name}</h3>
                    <p className="text-sm text-stone-600">{collection.tag}</p>
                  </div>
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    collection.isActive ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {collection.isActive ? '✓' : '●'}
                  </span>
                </div>
                
                <p className="text-sm text-stone-600 mb-4 line-clamp-2">
                  {collection.description || 'Premium cotton collection with sustainable materials and expert craftsmanship.'}
                </p>
                
                <div className="space-y-3">
                  {/* Details */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-stone-500">Category:</div>
                    <div className="font-medium text-stone-700">{collection.tag}</div>
                    
                    <div className="text-stone-500">Status:</div>
                    <div className={`font-medium ${collection.isActive ? 'text-green-600' : 'text-amber-600'}`}>
                      {collection.isActive ? 'Available' : 'Coming Soon'}
                    </div>
                    
                    {collection.createdAt && (
                      <>
                        <div className="text-stone-500">Added:</div>
                        <div className="font-medium text-stone-700">
                          {new Date(collection.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-3 border-t border-stone-200">
                    <button className="flex-1 px-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors text-sm">
                      View Details
                    </button>
                    <button className="px-4 py-2 border border-stone-300 text-stone-700 font-medium rounded-lg hover:bg-stone-50 transition-colors text-sm">
                      Enquire
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCollections.length === 0 && (
          <div className="text-center py-20">
            <div className="text-stone-400 mb-4">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-stone-700 mb-2">No Collections Found</h3>
            <p className="text-stone-600 mb-6">Try adjusting your search or filter criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveFilter('all');
              }}
              className="px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
            >
              Show All Collections
            </button>
          </div>
        )}

        {/* Back to Top */}
        <div className="text-center mt-16">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-6 py-3 border border-stone-300 text-stone-700 font-medium rounded-lg hover:bg-stone-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
            Back to Top
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-stone-500 text-sm">
            © {new Date().getFullYear()} SK Cool Cotton. All rights reserved.
          </p>
          <p className="text-stone-400 text-xs mt-2">
            Premium Cotton Clothing Collections • {collections.length} Total Collections
          </p>
        </div>
      </footer>
    </div>
  );
}

export default CollectionsAll;