import React, { useRef } from "react";
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from "react-router";

const Header = ({ searchKey, setSearchKey }) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  return (
    <header>
      <div className="search-container">
        <input
          type="text"
          value={searchKey}
          placeholder="Search here ..."
          id="search"
          autoComplete="off"
          onChange={(e) => setSearchKey(e.target.value)}
          // onKeyDown={(e) => {
          //   if (e.key === "Enter" && searchKey) {
          //     navigate(`/${searchKey}`);
          //     inputRef.current.blur();
          //   }
          // }}
          ref={inputRef}
        />
        <IoIosSearch
          size={"1.5rem"}
          className="search-icon"
          onClick={(e) => {
            e.preventDefault();
            if (searchKey) {
              navigate(`/${searchKey}`);
            } else {
              inputRef.current.focus();
            }
          }}
        />
      </div>
    </header>
  );
};

export default Header;
