const HeroSection = ({ news }) => {
  if (!news) return null;

  return (
    <div style={{ padding: '20px', background: '#f9f9f9', marginBottom: '20px' }}>
      <h1>{news.title}</h1>
      <p>{news.description}</p>
      <a href={news.link} target="_blank">Read More</a>
    </div>
  );
};

export default HeroSection;
