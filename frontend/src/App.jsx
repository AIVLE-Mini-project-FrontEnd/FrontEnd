import { useState, useEffect } from 'react';
import Header from './pages/Header';
import BookList from './pages/BookList';
import BookDetail from './pages/BookDetail';
import BookRegister from './pages/BookRegister';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [page, setPage] = useState("list");

  useEffect(() => {
    async function loadBooks() {
      try {
        const res = await fetch('http://localhost:3000/books');
        if (!res.ok) throw new Error('서버 연결 실패');
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.error(err);
        setError('도서 목록을 불러오지 못했습니다.');
      }
      setLoading(false);
    }
    loadBooks();
  }, []);

  const handleSelectBook = (id) => {
    setSelectedBookId(id);
  };

  const handleGoToList = () => {
    setSelectedBookId(null);
    setPage("list");
  };

  if (loading) return <><Header /><p>도서 정보를 불러오는 중...</p></>;
  if (error) return <><Header /><p>에러 발생: {error}</p></>;

  const selectedBook = books.find(b => b.id === selectedBookId);

  return (
    <>
      <Header />

      <main>
        {page === "register" ? (
          <BookRegister onBack={handleGoToList} />
        ) : selectedBook ? (
          <BookDetail book={selectedBook} onBack={handleGoToList} />
        ) : (
          <>
            <button onClick={() => setPage("register")}>+ 도서 등록</button>
            <BookList books={books} onSelectBook={handleSelectBook} />
          </>
        )}
      </main>
    </>
  );
}

export default App;