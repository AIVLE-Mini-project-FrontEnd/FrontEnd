import { useState, useEffect } from 'react'
import BookEdit from './pages/BookEdit'
import './App.css'

const JSON_SERVER_URL = 'http://localhost:3000'

function App() {
  const [books, setBooks] = useState([])

  // 컴포넌트 마운트 시 도서 목록 불러오기
  useEffect(() => {
    fetch(`${JSON_SERVER_URL}/books`)
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch(() => alert('도서 목록을 불러오는데 실패했습니다.'))
  }, [])

  /**
   * 특정 도서의 coverImageUrl을 PATCH로 저장하고 화면 즉시 반영
   * @param {number} bookId - 업데이트할 도서 id
   * @param {string} imageSrc - Data URL 형태의 이미지
   */
  async function updateBookCover(bookId, imageSrc) {
    const res = await fetch(`${JSON_SERVER_URL}/books/${bookId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coverImageUrl: imageSrc }),
    })
    if (!res.ok) throw new Error('json-server 저장 실패')

    // 불변성 map 패턴으로 화면 즉시 반영
    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId ? { ...b, coverImageUrl: imageSrc } : b
      )
    )
  }

  return (
    <div className="app">
      {books.map((book) => (
        <BookEdit
          key={book.id}
          book={book}
          onCoverUpdate={updateBookCover}
        />
      ))}
    </div>
  )
}

export default App