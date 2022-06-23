import { firebaseDatabase } from './firebase';

class BookmarkDB {
  saveBookmark(userId, card) {
    firebaseDatabase.ref(`${userId}/bookmark/${card.id}`).set(card);
  }

  removeBookmark(userId, card) {
    firebaseDatabase.ref(`${userId}/bookmark/${card.id}`).remove();
  }

  syncBookmark(userId, onUpdate) {
    const ref = firebaseDatabase.ref(`${userId}/bookmark`);
    ref.on('value', (snapshot) => {
      const value = snapshot.val();
      value && onUpdate(value);
    });
    return () => ref.off();
  }
}

export default BookmarkDB;
