import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

const Admin = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNews = async () => {
    const newsCol = collection(db, 'news');
    const newsSnapshot = await getDocs(newsCol);
    const newsData = newsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setNewsList(newsData);
  };

  const addNews = async () => {
    if (!title || !content) {
      alert('Title and Content are required');
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, 'news'), {
        title,
        content,
        imageUrl,
        category: category.trim() || 'General',
        createdAt: serverTimestamp()
      });

      setTitle('');
      setContent('');
      setImageUrl('');
      setCategory('');
      fetchNews();
      alert('News uploaded successfully!');
    } catch (err) {
      console.error('Error adding news:', err);
      alert('Failed to upload news. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteNews = async (id) => {
    await deleteDoc(doc(db, 'news', id));
    fetchNews();
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Panel - Upload News</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addNews();
        }}
        style={{ marginBottom: '20px' }}
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ display: 'block', width: '300px', marginBottom: '8px' }}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={6}
          style={{ display: 'block', width: '300px', marginBottom: '8px' }}
        />
        <input
          type="text"
          placeholder="Image URL (optional)"
          value={imageUrl}
          onChange={e => setImageUrl(e.target.value)}
          style={{ display: 'block', width: '300px', marginBottom: '8px' }}
        />
        <input
          type="text"
          placeholder="Category (e.g. Sports, Tech)"
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={{ display: 'block', width: '300px', marginBottom: '8px' }}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload News'}
        </button>
      </form>

      <h3>Existing News</h3>
      {newsList.length === 0 && <p>No news yet.</p>}
      {newsList.map(({ id, title, content, imageUrl, category }) => (
        <article
          key={id}
          className="border rounded-md shadow-sm p-4 bg-white relative"
          style={{
            marginBottom: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '15px',
            position: 'relative',
            backgroundColor: '#fff'
          }}
        >
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <p className="text-gray-700 mb-2" style={{ lineHeight: '1.5' }}>
            {content}
          </p>
          {imageUrl && (
            <img
              src={imageUrl}
              alt={title}
              style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '6px', marginBottom: '10px' }}
              loading="lazy"
            />
          )}
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            Category: <span className="capitalize">{category || 'General'}</span>
          </p>
          <button
            onClick={() => deleteNews(id)}
            className="text-red-600 hover:text-red-800 font-semibold"
            style={{ position: 'absolute', top: '10px', right: '15px' }}
          >
            Delete
          </button>
        </article>
      ))}
    </div>
  );
};

export default Admin;
