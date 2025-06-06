import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import NewsCard from '../components/NewsCard';

const CategoryPage = () => {
  const { cat } = useParams();
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      const res = await axios.get(`https://newsdata.io/api/1/news?apikey=YOUR_API_KEY&country=in&language=en&category=${cat}`);
      setNews(res.data.results || []);
    };

    fetchNews();
  }, [cat]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>{cat.toUpperCase()} News</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {news.map((n, i) => (
          <NewsCard key={i} news={n} />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
