const NewsCard = ({ news }) => {
  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "5px", width: "300px" }}>
      <h3>{news.title}</h3>
      <p>{news.description}</p>
      <a href={news.link} target="_blank">Read More</a>
    </div>
  );
};

export default NewsCard;
