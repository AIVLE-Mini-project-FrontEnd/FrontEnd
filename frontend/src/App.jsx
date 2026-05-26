import { useState, useEffect } from 'react';
import Header from './pages/Header';
import BookList from './pages/BookList';
import BookDetail from './pages/BookDetail';
import BookRegister from './pages/BookRegister';
import Footer from './pages/Footer';
import BookMain from './pages/BookMain';

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
      <BookMain />
      <main>
        {page === "register" ? (
          <BookRegister onBack={handleGoToList} />
        ) : selectedBook ? (
          <BookDetail book={selectedBook} onBack={handleGoToList} onDelete={() => handleDelete(selectedBook.id)} 
            onUpdate={handleUpdate}/>
        ) : (
          <>
            <button onClick={() => setPage("register")}>+ 도서 등록</button>
            <BookList books={books} onSelectBook={handleSelectBook} />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

export default App;