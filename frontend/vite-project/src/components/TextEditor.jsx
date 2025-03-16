import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import io from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';

const SOCKET_SERVER_URL = "http://localhost:5000";

const TextEditor = () => {
  const { documentId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const quillInstance = useRef(null);
  const socket = useRef(null);
  const titleTimeout = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [documentData, setDocumentData] = useState({
    title: 'Untitled Document',
    content: '',
    wordCount: 0,
    charCount: 0
  });
  const [isSaving, setIsSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState('');

  // Fetch document data
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch(`/api/documents/${documentId}`, {
          headers: {
            'Authorization': `Bearer ${currentUser?.token}`
          }
        });
        
        if (!response.ok) {
          navigate('/');
          return;
        }

        const data = await response.json();
        setDocumentData({
          title: data.title,
          content: data.content,
          wordCount: data.wordCount,
          charCount: data.charCount
        });
        setLoading(false);
      } catch (err) {
        navigate('/');
      }
    };

    if (currentUser) fetchDocument();
  }, [documentId, currentUser, navigate]);

  // Socket.io connection
  useEffect(() => {
    if (!currentUser) return;

    socket.current = io(SOCKET_SERVER_URL, {
      auth: { token: currentUser.token }
    });

    socket.current.on("connect_error", (err) => {
      console.error("Connection error:", err);
      setSavedStatus('Connection error');
    });

    socket.current.emit("join-document", documentId);

    socket.current.on("document-content", (content) => {
      if (quillInstance.current) {
        quillInstance.current.root.innerHTML = content;
      }
    });

    socket.current.on("text-change", (content) => {
      if (quillInstance.current && quillInstance.current.root.innerHTML !== content) {
        quillInstance.current.root.innerHTML = content;
        const text = quillInstance.current.getText();
        updateCounts(text);
      }
    });

    return () => {
      socket.current?.disconnect();
    };
  }, [documentId, currentUser]);

  // Quill initialization
  const editorRef = useCallback((wrapper) => {
    if (!wrapper || !documentData.content) return;

    wrapper.innerHTML = '';
    const editor = document.createElement('div');
    wrapper.appendChild(editor);

    quillInstance.current = new Quill(editor, {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'font': [] }, { 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'color': [] }, { 'background': [] }, { 'align': [] }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }, 
           { 'indent': '-1'}, { 'indent': '+1' }],
          [{ 'script': 'sub'}, { 'script': 'super' }, 'blockquote', 'code-block'],
          ['link', 'image', 'video', 'clean'],
        ]
      },
      placeholder: 'Type your document content here...',
    });

    quillInstance.current.root.innerHTML = documentData.content;

    quillInstance.current.on('text-change', () => {
      const newContent = quillInstance.current.root.innerHTML;
      const text = quillInstance.current.getText();
      
      setDocumentData(prev => ({
        ...prev,
        content: newContent,
        charCount: text.length - 1,
        wordCount: text.trim().split(/\s+/).length
      }));

      socket.current?.emit("text-change", { 
        documentId, 
        content: newContent 
      });

      setSavedStatus('');
    });
  }, [documentId, documentData.content]);

  const updateCounts = (text) => {
    setDocumentData(prev => ({
      ...prev,
      charCount: text.length - 1,
      wordCount: text.trim() ? text.trim().split(/\s+/).length : 0
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({
          title: documentData.title,
          content: documentData.content
        })
      });

      if (!response.ok) throw new Error('Save failed');
      
      setSavedStatus('All changes saved');
      setTimeout(() => setSavedStatus(''), 3000);
    } catch (err) {
      setSavedStatus('Error saving document');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setDocumentData(prev => ({ ...prev, title: newTitle }));
    
    // Debounced title update
    clearTimeout(titleTimeout.current);
    titleTimeout.current = setTimeout(async () => {
      try {
        await fetch(`/api/documents/${documentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentUser.token}`
          },
          body: JSON.stringify({ title: newTitle })
        });
      } catch (err) {
        setSavedStatus('Error updating title');
      }
    }, 1000);
  };

  const handleExport = () => {
    const blob = new Blob([documentData.content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentData.title}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="text-center py-8">Loading document...</div>;

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" />
                <path d="M14 8V3L19 8H14Z" fill="white" />
                <path d="M10 13H14V15H10V13Z" fill="white" />
                <path d="M16 11H8V9H16V11Z" fill="white" />
                <path d="M16 17H8V15H16V17Z" fill="white" />
              </svg>
            </div>
            <input
              type="text"
              value={documentData.title}
              onChange={handleTitleChange}
              className="text-lg font-medium focus:outline-none focus:border-b-2 focus:border-blue-500 py-1"
            />
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-500 hidden md:block">
              {savedStatus ? (
                <span className="text-green-600">{savedStatus}</span>
              ) : (
                <span>Editing</span>
              )}
            </div>
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button 
              onClick={handleExport}
              className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
            >
              Export
            </button>
          </div>
        </div>
      </header>

      <main className="pt-1 pb-16">
        <div className="max-w-4xl mx-auto flex flex-col">
          <div className="flex justify-center bg-white">
            <div className="bg-white w-full border border-gray-200 shadow-sm min-h-screen">
              <div ref={editorRef} className="h-full min-h-screen"></div>
            </div>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex space-x-4 text-sm text-gray-600">
            <span>{documentData.wordCount} words</span>
            <span>{documentData.charCount} characters</span>
          </div>
        </div>
      </footer>

      <style jsx>{`
        :global(.ql-toolbar.ql-snow) {
          border-top: none !important;
          border-left: none !important;
          border-right: none !important;
          padding: 8px 12px !important;
          background-color: #f8f9fa !important;
          display: flex !important;
          flex-wrap: nowrap !important;
          overflow-x: auto !important;
          white-space: nowrap !important;
          gap: 8px !important;
        }
        
        :global(.ql-formats) {
          display: inline-flex !important;
          margin-right: 8px !important;
        }
        
        :global(.ql-container.ql-snow) {
          border: none !important;
          font-family: 'Arial', sans-serif !important;
          font-size: 11pt !important;
          line-height: 1.5 !important;
        }

        :global(.ql-editor) {
          padding: 60px 72px !important;
          min-height: 1056px !important;
          max-width: 816px !important;
          margin: 0 auto !important;
          box-shadow: 0 0 0 0.5px #e0e0e0 !important;
          background-color: white !important;
        }

        :global(.ql-editor:focus) {
          box-shadow: 0 0 0 0.5px #e0e0e0, 0 0 3px 1px rgba(66, 133, 244, 0.3) !important;
        }
      `}</style>
    </div>
  );
};

export default TextEditor;