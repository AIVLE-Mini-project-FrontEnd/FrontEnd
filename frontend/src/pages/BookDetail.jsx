import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const GENRE_LIST = ['소설', '고전', '역사', 'IT', '동화', '자기계발', '과학', '경제', '철학', '예술'];
const TAG_LIST = ['한국문학', '고전문학', '개발/프로그래밍', '역사/인문', '고전/동화', '베스트셀러', '추천도서', '과학/기술'];

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [editGenre, setEditGenre] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTag, setEditTag] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`http://localhost:3000/books/${id}`);
        if (!res.ok) throw new Error('도서 정보를 불러오지 못했습니다.');
        const data = await res.json();
        setBook(data);
        setEditTitle(data.title);
        setEditAuthor(data.author);
        setEditGenre(data.genre);
        setEditContent(data.content);
        setEditTag(data.tag);
        setEditImageUrl(data.coverImageUrl);
      } catch (err) {
        console.error(err);
        alert(err.message);
        navigate('/books');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm(`"${book.title}"을(를) 삭제 도서로 이동할까요?`)) return;
    try {
      const res = await fetch(`http://localhost:3000/books/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deletedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error('삭제 실패');
      alert('삭제 도서로 이동했습니다.');
      navigate('/books/deleted');
    } catch (err) {
      console.error(err);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleSubmitUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:3000/books/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          author: editAuthor,
          genre: editGenre,
          content: editContent,
          tag: editTag,
          coverImageUrl: editImageUrl,
          updatedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error('수정 실패');
      const updated = await res.json();
      setBook(updated);
      setIsEditMode(false);
      alert('수정 완료');
    } catch (err) {
      console.error(err);
      alert('수정에 실패했습니다.');
    }
  };

  if (loading) return <p>도서 정보를 불러오는 중...</p>;
  if (!book) return null;

  const tagsArray = book.tag ? book.tag.split(',') : [];

  return (
    <div>
      <button onClick={() => navigate(-1)}>← 목록으로 돌아가기</button>
      <div>
        {/* 이미지 */}
        <div>
          {isEditMode ? (
            <input
              type="text"
              placeholder="이미지 URL"
              value={editImageUrl}
              onChange={(e) => setEditImageUrl(e.target.value)}
            />
          ) : (
            <img src={book.coverImageUrl} alt={book.title} width="200" />
          )}
          <p>❤️ 추천 수: {book.likes}개</p>
        </div>

        {/* 장르 */}
        <div>
          {isEditMode ? (
            <select
              value={editGenre}
              onChange={(e) => setEditGenre(e.target.value)}
            >
              {GENRE_LIST.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          ) : (
            <span>[{book.genre}]</span>
          )}
        </div>

        {/* 제목 */}
        <div>
          {isEditMode ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
          ) : (
            <h2>{book.title}</h2>
          )}
        </div>

        {/* 저자 */}
        <div>
          {isEditMode ? (
            <input
              type="text"
              value={editAuthor}
              onChange={(e) => setEditAuthor(e.target.value)}
            />
          ) : (
            <p>저자: {book.author}</p>
          )}
        </div>

        {/* 등록일 */}
        <p>등록일: {book.createdAt ? book.createdAt.split('T')[0] : ''}</p>

        {/* 태그 */}
        <div>
          {isEditMode ? (
            <select
              value={editTag}
              onChange={(e) => setEditTag(e.target.value)}
            >
              {TAG_LIST.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          ) : (
            tagsArray.map((t, idx) => (
              <span key={idx} style={{ marginRight: '5px' }}>
                #{t.trim()}
              </span>
            ))
          )}
        </div>

        {/* 도서 내용 */}
        <div style={{ marginTop: '20px' }}>
          <h4>도서 내용</h4>
          {isEditMode ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows="10"
              cols="50"
            />
          ) : (
            <p style={{ whiteSpace: 'pre-wrap' }}>{book.content}</p>
          )}
        </div>

        {/* 버튼 */}
        <div style={{ marginTop: '20px' }}>
          {!isEditMode ? (
            <button onClick={() => setIsEditMode(true)}>게시글 수정</button>
          ) : (
            <button onClick={handleSubmitUpdate}>수정 완료</button>
          )}
          <button onClick={handleDelete}>게시글 삭제</button>
        </div>
      </div>
    </div>
  );
}

export default BookDetail;