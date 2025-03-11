import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  const userEmail = 'your.email@example.com'; // Replace with your actual email
  const initials = userEmail.split('@')[0].split('.').map(name => name[0].toUpperCase()).join('');

  // Document templates array
  const documentTemplates = [
    { name: "Blank Document", icon: "+" },
    { name: "Professional Resume", type: "resume" },
    { name: "Business Letter", type: "letter" },
    { name: "Official Notice", type: "notice" },
    { name: "Company Announcement", type: "announcement" },
    { name: "Product Brochure", type: "brochure" },
    { name: "Project Proposal", type: "proposal" },
    { name: "Meeting Minutes", type: "meeting" },
  ];

  // Filter templates based on state
  const visibleTemplates = showAllTemplates
    ? documentTemplates
    : [documentTemplates[0], ...documentTemplates.slice(1, 4)];

  const handleNavigation = () => {
    const token = localStorage.getItem('token'); // Check for token in localStorage
    if (token) {
      navigate('/text-editor');
    } else {
      navigate('/auth');
      alert('Please login to access the editor');
    }
  };

  const recentDocuments = [
    { name: "CST Shortcuts", lastEdited: "2 days ago" },
    { name: "1. JavaScript Data Types", lastEdited: "Yesterday" },
    { name: "Project Proposal", lastEdited: "3 hours ago" },
  ];

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 font-sans">
      {/* Header Navigation */}
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
            onClick={handleNavigation}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-150"
          >
            New Document +
          </button>

          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg cursor-pointer">
            {initials}
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back!</h1>
          <p className="text-gray-400">Pick up where you left off or start something new.</p>
        </div>

        {/* Document Templates */}
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
                onClick={handleNavigation}
                className="bg-gray-700 hover:bg-gray-600 rounded-lg p-4 transition duration-200 cursor-pointer flex flex-col items-center justify-center h-48 shadow-md"
              >
                {template.name === "Blank Document" ? (
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

        {/* Recent Documents */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">Recent documents</h3>
            <button className="text-blue-400 hover:text-blue-300 text-sm">View all</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentDocuments.map((doc, index) => (
              <div
                key={index}
                className="bg-gray-700 hover:bg-gray-600 rounded-lg p-4 transition duration-200 cursor-pointer h-40 shadow-md flex flex-col"
              >
                <div className="flex-grow flex items-center justify-center">
                  <svg className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="mt-2">
                  <h4 className="text-sm font-medium truncate">{doc.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">Edited {doc.lastEdited}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;