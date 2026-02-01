// src/admin/ContactMessages.jsx
// Updated version with better error handling for Mark as Read + minor improvements
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Mail, 
  Clock, 
  CheckCircle, 
  Reply, 
  Eye, 
  Loader2,
  RefreshCw 
} from 'lucide-react';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get('/api/admin/contact-messages');
      
      // Extract data assuming { success: true, data: [...] } format
      let messageList = res.data?.data || [];
      if (!Array.isArray(messageList)) {
        messageList = [];
      }

      // Sort newest first (if not already sorted on server)
      const sorted = messageList.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setMessages(sorted);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(
        err.response?.data?.message || 
        'Failed to load messages. Check if the API endpoint is correct and server is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      const res = await axios.patch(`/api/admin/contact-messages/${id}`, { status: 'read' });
      
      // Update local state
      setMessages(prev =>
        prev.map(msg =>
          msg._id === id ? { ...msg, status: 'read' } : msg
        )
      );
      if (selectedMessage?._id === id) {
        setSelectedMessage(prev => ({ ...prev, status: 'read' }));
      }
      
      console.log('Mark read success:', res.data); // For debugging
    } catch (err) {
      console.error('Mark read failed:', err);
      alert(
        err.response?.data?.message || 
        'Failed to mark as read. Check console for details. Possible issues: Route not found (404), auth required, or server error.'
      );
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedMessage) return;

    setReplying(true);
    try {
      const res = await axios.patch(`/api/admin/contact-messages/${selectedMessage._id}`, {
        status: 'replied',
        adminReply: replyText.trim(),
      });

      // Update local state
      setMessages(prev =>
        prev.map(msg =>
          msg._id === selectedMessage._id
            ? { ...msg, status: 'replied', adminReply: replyText.trim() }
            : msg
        )
      );

      setSelectedMessage(prev => ({
        ...prev,
        status: 'replied',
        adminReply: replyText.trim(),
      }));

      setReplyText('');
      alert('Reply sent successfully! Email dispatched to user.');
    } catch (err) {
      console.error('Reply failed:', err);
      alert(
        err.response?.data?.message || 
        'Failed to send reply. Check console for details.'
      );
    } finally {
      setReplying(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      unread: 'bg-red-100 text-red-800 border-red-200',
      read: 'bg-blue-100 text-blue-800 border-blue-200',
      replied: 'bg-green-100 text-green-800 border-green-200',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p className="text-xl">{error}</p>
        <button
          onClick={fetchMessages}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <RefreshCw size={16} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Contact Messages</h1>
          <p className="text-gray-600 mt-1">
            {messages.length} message{messages.length !== 1 ? 's' : ''} received
          </p>
        </div>
        <button
          onClick={fetchMessages}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Messages List */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-800">Inbox</h2>
          </div>
          <div className="divide-y max-h-[70vh] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No messages yet
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                    selectedMessage?._id === msg._id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`font-medium ${msg.status === 'unread' ? 'text-gray-900' : 'text-gray-700'}`}>
                        {msg.name}
                      </p>
                      <p className="text-sm text-gray-500">{msg.email}</p>
                    </div>
                    {getStatusBadge(msg.status)}
                  </div>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">{msg.subject}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(msg.createdAt).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Detail / Reply Area */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-6 border-b bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{selectedMessage.subject}</h2>
                    <p className="text-gray-600 mt-1">
                      From: <span className="font-medium">{selectedMessage.name}</span> • {selectedMessage.email}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Received: {new Date(selectedMessage.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(selectedMessage.status)}
                    {selectedMessage.status === 'unread' && (
                      <button
                        onClick={() => handleMarkRead(selectedMessage._id)}
                        className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap text-gray-800">{selectedMessage.message}</p>
                </div>

                {selectedMessage.adminReply && (
                  <div className="mt-8 border-t pt-6">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Reply size={18} /> Your Reply
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <p className="whitespace-pre-wrap text-gray-700">{selectedMessage.adminReply}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t bg-gray-50">
                <form onSubmit={handleSendReply} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Send Reply to {selectedMessage.name} ({selectedMessage.email})
                    </label>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Type your reply here... It will be emailed to the user."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={replying || !replyText.trim()}
                    className={`
                      flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-white
                      ${replying || !replyText.trim()
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'}
                      transition-colors w-full sm:w-auto
                    `}
                  >
                    {replying ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Reply size={18} />
                        Send Reply & Email
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border h-96 flex flex-col items-center justify-center text-gray-500">
              <Mail size={64} className="mb-4 opacity-40" />
              <p className="text-xl font-medium">Select a message to view</p>
              <p className="mt-2">Click any message from the inbox</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactMessages;