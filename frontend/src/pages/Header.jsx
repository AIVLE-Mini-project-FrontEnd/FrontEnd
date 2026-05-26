import { useState } from "react";
import logo from "../img/logo.png";

function Header({ onGoToMain, onGoToFinder }) {
  const [isHeaderOpen, setIsHeaderOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("genre");

  const GENRE_LIST = ["소설", "고전", "역사"];
  const TAG_LIST = ["한국문학", "고전문학", "개발/프로그래밍"];

  return (
    <header className="header">
      <div className="header-inner">

        {/* 로고 */}
        <div
          className="logo"
          onClick={onGoToMain}
          style={{ cursor: "pointer" }}
        >
          <img src={logo} alt="로고" />
        </div>

        {/* 검색 영역 */}
        <div className="search-area">

          <button
            className="search-type-btn"
            onClick={() => setIsHeaderOpen(!isHeaderOpen)}
          >
            자료검색
          </button>

          {/* 검색창 클릭 시 BookFinder 이동 */}
          <input
            className="search-input"
            placeholder="도서명 또는 저자를 입력하세요."
            onClick={onGoToFinder}
            readOnly
            style={{ cursor: "pointer" }}
          />

          {/* 검색 아이콘 클릭 시 BookFinder 이동 */}
          <button
            className="icon-btn"
            onClick={onGoToFinder}
          >
            🔍
          </button>

          {/* 상세검색 버튼 클릭 시 BookFinder 이동 */}
          <button
            className="detail-btn"
            onClick={onGoToFinder}
          >
            상세검색
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;