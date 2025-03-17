import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

function Home() {
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth();
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  const [creatingDoc, setCreatingDoc] = useState(false);
  const [error, setError] = useState('');
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(true);

  const documentTemplates = [
    { name: "Blank Document", type: null },
    { name: "Professional Resume", type: "resume" },
    { name: "Business Letter", type: "letter" },
    { name: "Official Notice", type: "notice" },
    { name: "Company Announcement", type: "announcement" },
    { name: "Product Brochure", type: "brochure" },
    { name: "Project Proposal", type: "proposal" },
    { name: "Meeting Minutes", type: "meeting" },
  ];

  const visibleTemplates = showAllTemplates 
    ? documentTemplates 
    : [documentTemplates[0], ...documentTemplates.slice(1, 4)];

  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/auth');
    }
  }, [currentUser, authLoading, navigate]);

  useEffect(() => {
    const fetchRecentDocuments = async () => {
      try {
        setDocumentsLoading(true);
        const response = await fetch('/api/documents/recent', {
          headers: { 'Authorization': `Bearer ${currentUser?.token}` }
        });
        
        if (!response.ok) throw new Error('Failed to load documents');
        setRecentDocuments(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setDocumentsLoading(false);
      }
    };

    if (currentUser) fetchRecentDocuments();
  }, [currentUser]);

  const createNewDocument = async (templateType = null) => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }

    try {
      setCreatingDoc(true);
      setError('');
      
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({ templateType })
      });

      if (!response.ok) throw new Error('Failed to create document');

      const data = await response.json();
      navigate(`/text-editor/${data._id}`);
    } catch (err) {
      setError(err.message || 'Failed to create document');
      setTimeout(() => setError(''), 3000);
    } finally {
      setCreatingDoc(false);
    }
  };

  const handleTemplateClick = (templateType) => {
    createNewDocument(templateType);
  };

  const initials = currentUser?.email 
    ? currentUser.email.split('@')[0].split('.').map(name => name[0].toUpperCase()).join('')
    : 'GU';

  if (authLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 font-sans">
      <nav className="bg-gray-800 p-4 shadow-lg flex justify-between items-center">
        <div className="flex items-center">
          <svg className="h-8 w-8 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-xl font-bold text-blue-400">SyncScript</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <svg className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-700 text-gray-300 pl-10 pr-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-600"
            />
          </div>

          <button
            onClick={() => createNewDocument()}
            disabled={creatingDoc}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-150 disabled:opacity-50"
          >
            {creatingDoc ? 'Creating...' : 'New Document +'}
          </button>

          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg cursor-pointer">
            {initials}
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        {error && (
          <div className="mb-4 p-3 bg-red-500 text-white rounded-lg">
            {error}
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {currentUser ? 'Welcome back!' : 'Welcome to SyncScript!'}
          </h1>
          <p className="text-gray-400">
            {currentUser 
              ? 'Pick up where you left off or start something new'
              : 'Sign in to start creating documents'}
          </p>
        </div>

        {/* Document Templates Section */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">Start a new document</h3>
            <button
              onClick={() => setShowAllTemplates(!showAllTemplates)}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              {showAllTemplates ? "Show less" : "View all templates"}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {visibleTemplates.map((template, index) => (
              <div
                key={index}
                onClick={() => handleTemplateClick(template.type)}
                className="bg-gray-700 hover:bg-gray-600 rounded-lg p-4 transition duration-200 cursor-pointer flex flex-col items-center justify-center h-48 shadow-md"
              >
                {template.type === null ? (
                  <span className="text-5xl text-blue-400 mb-2">+</span>
                ) : (
                  <div className="text-4xl mb-2">
                    {template.type === 'resume' && '📄'}
                    {template.type === 'letter' && '✉️'}
                    {template.type === 'notice' && '📢'}
                    {template.type === 'announcement' && '🗞️'}
                    {template.type === 'brochure' && '📖'}
                    {template.type === 'proposal' && '📑'}
                    {template.type === 'meeting' && '📝'}
                  </div>
                )}
                <span className="text-sm font-medium text-center">{template.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Documents Section */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">Recent documents</h3>
            <button className="text-blue-400 hover:text-blue-300 text-sm">
              View all
            </button>
          </div>

          {documentsLoading ? (
            <div className="text-center py-4 text-gray-400">
              <LoadingSpinner />
            </div>
          ) : recentDocuments.length === 0 ? (
            <div className="text-center py-4 text-gray-400">
              No recent documents found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentDocuments.map((doc, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/text-editor/${doc._id}`)}
                  className="bg-gray-700 hover:bg-gray-600 rounded-lg p-4 transition duration-200 cursor-pointer h-40 shadow-md flex flex-col"
                >
                  <div className="flex-grow flex items-center justify-center">
                    <svg className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="mt-2">
                    <h4 className="text-sm font-medium truncate">{doc.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Last edited {new Date(doc.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;