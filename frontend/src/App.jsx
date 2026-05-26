import { useState, useEffect } from 'react';
import Header from './pages/Header';
import BookList from './pages/BookList';
import BookDetail from './pages/BookDetail';
import BookRegister from './pages/BookRegister';
import BookEdit from './pages/BookEdit';

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
    
    fetch('http://localhost:3000/books')
      .then((res) => res.json())
      .then((data) => setBooks(data));
  };
  
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3000/books/${id}`, {
        method: 'DELETE'
      });
      alert('삭제 완료');
      handleGoToList();
    } catch (err) {
      console.error(err);
    }
  };

const handleGoToEdit = () => setPage("edit");

  const handleBackFromEdit = () => {
    setPage("");
  };

  const handleBookSave = (updatedBook) => {
    setBooks(prev => prev.map(b => b.id === updatedBook.id ? updatedBook : b));
  };

  const handleCoverUpdate = async (bookId, imageSrc) => {
    // 낙관적 업데이트: 서버 응답 전에 먼저 state 반영
    setBooks(prev => prev.map(b => b.id === bookId ? { ...b, coverImageUrl: imageSrc } : b));
    try {
      const res = await fetch(`http://localhost:3000/books/${bookId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coverImageUrl: imageSrc }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setBooks(prev => prev.map(b => b.id === data.id ? data : b));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (updatedBook) => {

  try {
    const now = new Date();
    const res = await fetch(
      `http://localhost:3000/books/${updatedBook.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: updatedBook.title,
          author: updatedBook.author,
          genre: updatedBook.genre,
          content: updatedBook.content,
          tag: updatedBook.tag,
          coverImageUrl: updatedBook.coverImageUrl,
          updatedAt: now
        })
      }
    );
    const data = await res.json();
    // books 상태 업데이트
    setBooks(prev =>
      prev.map(book =>
        book.id === data.id ? data : book
      )
    );
    alert('수정 완료');
  } catch (err) {
    console.error(err);
  }
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
        ) : page === "edit" && selectedBook ? (
          <BookEdit
            book={selectedBook}
            onCoverUpdate={handleCoverUpdate}
            onBack={handleBackFromEdit}
            onSave={handleBookSave}
          />
        ) : selectedBook ? (
          <BookDetail
            book={selectedBook}
            onBack={handleGoToList}
            onDelete={() => handleDelete(selectedBook.id)}
            onEdit={handleGoToEdit}
          />
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