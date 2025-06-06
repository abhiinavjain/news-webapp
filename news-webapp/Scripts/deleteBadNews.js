import { db } from '../src/firebase.js'; // Adjust path if needed
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

async function deleteAllApiNews() {
  try {
    const newsRef = collection(db, 'news');
    const snapshot = await getDocs(newsRef);

    let deleteCount = 0;

    for (const document of snapshot.docs) {
      const data = document.data();

      if (data.source === 'api') {
        await deleteDoc(doc(db, 'news', document.id));
        console.log(`Deleted API news: ${data.title || document.id}`);
        deleteCount++;
      }
    }

    console.log(`\n✅ Finished deleting all API news. Total deleted: ${deleteCount}`);
  } catch (error) {
    console.error('Error deleting API news:', error);
  }
}

deleteAllApiNews();
