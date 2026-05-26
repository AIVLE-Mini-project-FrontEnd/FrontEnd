import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../img/logo.png';

function Header() {
  const navigate = useNavigate();
  const [isHeaderOpen, setIsHeaderOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-inner">
        <div
          className="logo"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          <img src={logo} alt="로고" />
        </div>

        <div className="search-area">
          <button
            className="search-type-btn"
            onClick={() => setIsHeaderOpen(!isHeaderOpen)}
          >
            자료검색
          </button>

          <input
            className="search-input"
            placeholder="도서명 또는 저자를 입력하세요."
          />

          <button className="icon-btn">🔍</button>
          <button className="detail-btn">상세검색</button>
        </div>
      </div>
    </header>
  );
}

export default Header;