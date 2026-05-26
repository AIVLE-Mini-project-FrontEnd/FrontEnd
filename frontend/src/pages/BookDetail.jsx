import React from 'react';

function BookDetail({ book, onBack, onDelete, onEdit }) {
  const tagsArray = book.tag ? book.tag.split(',') : [];

  return (
    <div>
      <button onClick={onBack}>
        ← 목록으로 돌아가기
      </button>
      <div>
        {/* 이미지 */}
        <div>
          <img
            src={book.coverImageUrl}
            alt={book.title}
            width="200"
          />
          <p>❤️ 추천 수: {book.likes}개</p>
        </div>
        {/* 장르 */}
        <div>
          <span>[{book.genre}]</span>
        </div>
        {/* 제목 */}
        <div>
          <h2>{book.title}</h2>
        </div>
        {/* 작성자 */}
        <div>
          <p>저자: {book.author}</p>
        </div>
        {/* 등록일 */}
        <p>
          등록일:
          {book.createdAt
            ? book.createdAt.split('T')[0]
            : ''}
        </p>
        {/* 태그 */}
        <div>
          {tagsArray.map((t, idx) => (
            <span
              key={idx}
              style={{ marginRight: '5px' }}
            >
              #{t.trim()}
            </span>
          ))}
        </div>
        {/* 도서 내용 */}
        <div style={{ marginTop: '20px' }}>
          <h4>도서 내용</h4>
          <p style={{ whiteSpace: 'pre-wrap' }}>
            {book.content}
          </p>
        </div>
        {/* 버튼 */}
        <div style={{ marginTop: '20px' }}>
          <button onClick={onEdit}>
            게시글 수정
          </button>
          <button onClick={onDelete}>
            게시글 삭제
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookDetail;
