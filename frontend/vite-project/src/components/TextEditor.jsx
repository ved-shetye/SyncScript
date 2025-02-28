import React, { useCallback, useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const TextEditor = () => {
  const quillInstance = useRef(null);
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState('');
  const [documentTitle, setDocumentTitle] = useState('Untitled Document');

  // Quill initialization using callback ref
  const editorRef = useCallback((wrapper) => {
    if (wrapper === null) return;

    // Clear existing content and create new editor container
    wrapper.innerHTML = '';
    const editor = document.createElement('div');
    wrapper.appendChild(editor);

    // Initialize Quill
    quillInstance.current = new Quill(editor, {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'font': [] }, { 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'color': [] }, { 'background': [] }, { 'align': [] }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }, { 'indent': '-1'}, { 'indent': '+1' }],
          [{ 'script': 'sub'}, { 'script': 'super' }, 'blockquote', 'code-block'],
          ['link', 'image', 'video', 'clean'],
        ],
      },
      placeholder: 'Type your document content here...',
    });

    // Handle content changes
    quillInstance.current.on('text-change', () => {
      const newContent = quillInstance.current.root.innerHTML;
      setContent(newContent);
      
      // Calculate word and character count
      const text = quillInstance.current.getText();
      setCharCount(text.length > 1 ? text.length - 1 : 0);
      const words = text.trim() ? text.trim().split(/\s+/) : [];
      setWordCount(words.length > 0 && words[0] !== '' ? words.length : 0);
      
      // Reset saved status when edits are made
      if (savedStatus) {
        setSavedStatus('');
      }
    });
  }, [savedStatus]);

  // Cleanup Quill instance on unmount
  useEffect(() => {
    return () => {
      if (quillInstance.current) {
        quillInstance.current = null;
      }
    };
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log('Saving content:', content);
      
      setSavedStatus('All changes saved');
      setTimeout(() => setSavedStatus(''), 3000);
    } catch (error) {
      setSavedStatus('Error saving document');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTitleChange = (e) => {
    setDocumentTitle(e.target.value);
  };

  const handleExport = () => {
    // Export as HTML
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentTitle}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* App Header - Google Docs style */}
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
              value={documentTitle}
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
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
              U
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-1 pb-16">
        <div className="max-w-4xl mx-auto flex flex-col">
          <div className="flex justify-center bg-white">
            <div className="bg-white w-full border border-gray-200 shadow-sm min-h-screen">
              {/* Editor container using callback ref */}
              <div ref={editorRef} className="h-full min-h-screen"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex space-x-4 text-sm text-gray-600">
            <span>{wordCount} words</span>
            <span>{charCount} characters</span>
          </div>
          <div className="flex space-x-4">
            <button className="text-gray-700 hover:bg-gray-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="text-gray-700 hover:bg-gray-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </footer>

      {/* Custom styles for Quill */}
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