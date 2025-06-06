// src/components/NewsDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, 'news', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setNews(docSnap.data());
        } else {
          setNews(null);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  if (loading) return <p style={{ padding: '20px' }}>Loading...</p>;

  if (!news) return <p style={{ padding: '20px' }}>News not found.</p>;

  return (
    <main style={{ maxWidth: '800px', margin: '20px auto', padding: '0 15px' }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>
        &larr; Back to Home
      </Link>
      <h1 style={{ marginTop: '10px' }}>{news.title}</h1>
      {news.imageUrl && (
        <img
          src={news.imageUrl}
          alt={news.title}
          style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', margin: '20px 0' }}
        />
      )}
      <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '1.1rem' }}>{news.content}</p>
      {news.category && (
        <p style={{ marginTop: '30px', fontStyle: 'italic', color: '#555' }}>
          Category: {news.category}
        </p>
      )}
    </main>
  );
};

export default NewsDetail;
