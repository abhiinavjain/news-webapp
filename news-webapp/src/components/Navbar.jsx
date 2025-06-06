import { Link, useNavigate, useLocation } from 'react-router-dom';

const categories = ['All', 'World', 'Politics', 'Sports', 'Technology', 'Business', 'Health', 'Entertainment'];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleCategoryClick = (category) => {
    navigate('/categories', { state: { selectedCategory: category } });
  };

  const isCategoriesPage = location.pathname === '/categories';

  return (
    <nav style={{ padding: '15px', background: '#222', color: 'white', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
      <Link to="/" style={{ marginRight: '20px', color: 'white', fontWeight: 'bold', fontSize: '18px' }}>
        News App
      </Link>

      {!isCategoriesPage && (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', flexGrow: 1 }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      <Link to="/admin" style={{ color: 'white', marginLeft: 'auto', fontWeight: 'bold' }}>
        Admin
      </Link>
    </nav>
  );
};

export default Navbar;
