// src/components/Home.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const Home = () => {
  const [newsByCategory, setNewsByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch news from Firestore, ordered newest first
const fetchNews = async () => {
    try {
        setLoading(true);
        const newsCol = collection(db, 'news');
        const q = query(newsCol, orderBy('createdAt', 'desc'));
        const newsSnapshot = await getDocs(q);

        const newsData = newsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Group news by category (default to 'General')
        const grouped = newsData.reduce((acc, news) => {
            const category = news.category?.trim() || 'General';
            if (!acc[category]) acc[category] = [];
            acc[category].push(news);
            return acc;
        }, {});

        // Reorder so 'Technology' is first if it exists
        if (grouped['Technology']) {
            const { Technology, ...rest } = grouped;
            setNewsByCategory({ Technology, ...rest });
        } else {
            setNewsByCategory(grouped);
        }
    } catch (error) {
        console.error('Error loading news:', error);
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    fetchNews();
}, []);

if (loading) {
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <p>Loading news...</p>
        </div>
    );
}

return (
    <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '30px', fontSize: '2.5rem' }}>Latest News</h1>

        {Object.keys(newsByCategory).length === 0 && (
            <p style={{ fontSize: '1.2rem' }}>No news available right now.</p>
        )}

        {Object.entries(newsByCategory).map(([category, newsList]) => (
            <section key={category} style={{ marginBottom: '50px' }}>
                <h2
                    style={{
                        borderBottom: '3px solid #333',
                        paddingBottom: '5px',
                        marginBottom: '20px',
                        fontSize: '1.8rem',
                        textTransform: 'capitalize',
                    }}
                >
                    {category}
                </h2>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '25px',
                    }}
                >
                    {newsList.map(({ id, title, content, imageUrl }) => (
                        <a
                            key={id}
                            href={`/news/${id}`}
                            style={{
                                textDecoration: 'none',
                                color: 'inherit',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                backgroundColor: '#fff',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
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
                                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', flexGrow: 0 }}>{title}</h3>
                                <p style={{ flexGrow: 1, color: '#444', fontSize: '0.95rem', lineHeight: '1.4' }}>
                                    {content.length > 150 ? content.slice(0, 150) + '...' : content}
                                </p>
                                <span
                                    style={{
                                        marginTop: '10px',
                                        color: '#1976d2',
                                        fontWeight: 'bold',
                                        fontSize: '0.98rem',
                                        alignSelf: 'flex-start',
                                    }}
                                >
                                    Read More &rarr;
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            </section>
        ))}
    </main>
);
};

export default Home;
