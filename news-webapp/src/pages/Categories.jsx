import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useLocation } from 'react-router-dom';

const Categories = () => {
  const [newsList, setNewsList] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'World', 'Politics', 'Sports', 'Technology', 'Business', 'Health', 'Entertainment'];

  const location = useLocation();

  // Fetch news from Firebase
  const fetchNews = async () => {
    const snapshot = await getDocs(collection(db, 'news'));
    const newsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setNewsList(newsData);

    const initialCategory = location.state?.selectedCategory || 'All';
    setSelectedCategory(initialCategory);

    if (initialCategory === 'All') {
      setFilteredNews(newsData);
    } else {
      const filtered = newsData.filter(news => (news.category || 'General').toLowerCase() === initialCategory.toLowerCase());
      setFilteredNews(filtered);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const filterByCategory = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredNews(newsList);
    } else {
      const filtered = newsList.filter(news => (news.category || 'General').toLowerCase() === category.toLowerCase());
      setFilteredNews(filtered);
    }
  };

return (
    <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Browse by Category</h1>

        <div style={{ marginBottom: '30px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => filterByCategory(cat)}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: selectedCategory === cat ? '#333' : '#f0f0f0',
                        color: selectedCategory === cat ? '#fff' : '#000',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                    }}
                >
                    {cat}
                </button>
            ))}
        </div>

        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '25px',
            }}
        >
            {filteredNews.length === 0 ? (
                <p>No news available in this category.</p>
            ) : (
                filteredNews.map(({ id, title, content, imageUrl }) => (
                    <a
                        key={id}
                        href={`/news/${id}`}
                        style={{
                            textDecoration: 'none',
                            color: 'inherit',
                        }}
                    >
                        <article
                            style={{
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                backgroundColor: '#fff',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'box-shadow 0.2s',
                            }}
                        >
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={title}
                                    style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                                    loading="lazy"
                                />
                            ) : (
                                <div
                                    style={{
                                        width: '100%',
                                        height: '180px',
                                        backgroundColor: '#ccc',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#666',
                                        fontStyle: 'italic',
                                    }}
                                >
                                    No Image
                                </div>
                            )}

                            <div style={{ padding: '15px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>{title}</h3>
                                <p style={{ flexGrow: 1, color: '#444', fontSize: '0.95rem', lineHeight: '1.4' }}>
                                    {content.length > 150 ? content.slice(0, 150) + '...' : content}
                                </p>
                                <span style={{ color: '#1976d2', marginTop: '10px', fontWeight: 500 }}>Read More</span>
                            </div>
                        </article>
                    </a>
                ))
            )}
        </div>
    </main>
);
};

export default Categories;
