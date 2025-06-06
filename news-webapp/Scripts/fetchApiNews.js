import axios from 'axios';
import { db } from '../src/firebase.js'; // Adjust path if needed
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = 'https://newsdata.io/api/1/latest';

const categories = ['World', 'Politics', 'Sports', 'Technology', 'Business', 'Health', 'Entertainment'];

async function fetchAndStoreNews() {
  try {
    const newsRef = collection(db, 'news');

    for (const cat of categories) {
      console.log(`Fetching news for category: ${cat}`);

      const response = await axios.get(BASE_URL, {
        params: {
          apikey: API_KEY,
          category: cat.toLowerCase(),
          language: 'en'
        }
      });

      const articles = response.data.results || [];

      for (const article of articles) {
        // Filter: skip if no content or too short content (less than 50 chars)
        const content = article.description || '';
        const imageUrl = article.image_url || '';

        if (
          content.length < 100 || // too short content
          !imageUrl ||           // no image URL
          !isValidUrl(imageUrl)  // invalid image URL
        ) {
          console.log(`Skipped (no good content/image): ${article.title}`);
          continue;
        }

        // Check for duplicates by title
        const q = query(newsRef, where('title', '==', article.title));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          await addDoc(newsRef, {
            title: article.title,
            content,
            imageUrl,
            category: cat,
            source: 'api',
            createdAt: new Date().toISOString()
          });
          console.log(`Added: ${article.title}`);
        } else {
          console.log(`Skipped duplicate: ${article.title}`);
        }
      }
    }
    console.log('✅ Done fetching and storing all categories!');
  } catch (error) {
    console.error('Error fetching/storing news:', error);
  }
}

// Helper function to validate URLs
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

fetchAndStoreNews();
