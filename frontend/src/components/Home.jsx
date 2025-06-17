import { useRef, useState } from "react";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [searchKey, setSearchKey] = useState("");
  return (
    <div className="search-container">
      <div className="search-content">
        <input
          type="text"
          value={searchKey}
          placeholder="Search your product here ..."
          id="search"
          className="search-input"
          autoComplete="off"
          onChange={(e) => setSearchKey(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && searchKey) {
              navigate(`/products/${searchKey}/1`);
              inputRef.current.blur();
            }
          }}
          ref={inputRef}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.5rem"
          height="1.5rem"
          viewBox="0 0 24 24"
          fill="none"
          onClick={() => {
            if (searchKey) {
              navigate(`/products/${searchKey}/1`);
              inputRef.current.blur();
            }
          }}
          className="search-icon"
        >
          <path
            d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
            stroke="#333"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default Home;
