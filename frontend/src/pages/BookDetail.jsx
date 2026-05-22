import React from 'react';

function BookDetail({ book, onBack }) {
  const tagsArray = book.tag ? book.tag.split(',') : [];

  return (
    <div>
      <button onClick={onBack}>← 목록으로 돌아가기</button>
      
      <div>
        <img src={book.coverImageUrl} alt={book.title} width="200" />
        <p>❤️ 추천 수: {book.likes}개</p>
      </div>
      
      <div>
        <span>[{book.genre}]</span>
        <h2>{book.title}</h2>
        <p>저자: {book.author}</p>
        <p>등록일: {book.createdAt ? book.createdAt.split('T')[0] : ''}</p>
        
        <div>
          {tagsArray.map((t, idx) => (
            <span key={idx} style={{ marginRight: '5px' }}>#{t.trim()}</span>
          ))}
        </div>

        <div style={{ marginTop: '20px' }}>
          <h4>도서 내용</h4>
          <p style={{ whiteSpace: 'pre-wrap' }}>{book.content}</p>
        </div>
      </div>
    </div>
  );
}

export default BookDetail;