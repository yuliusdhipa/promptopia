"use client";

import { useEffect, useState } from "react";
import PromptCard from "./PromptCard";
import Loading from "./Loading";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [posts, setPosts] = useState([]);

  // Search states
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetcPosts();
  }, []);

  const fetcPosts = async () => {
    setLoading(true);
    const res = await fetch("/api/prompt");
    const data = await res.json();

    setPosts(data);
    setLoading(false);
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);

    let str = e.target.value;
    setSearchText(str);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        if (str.length > 2) {
          const searchResult = filterPrompts(str);
          setSearchedResults(searchResult);

          addMark(str);
        } else {
          removeMark();
        }
      }, 500)
    );
  };

  const filterPrompts = (str) => {
    const regex = new RegExp(str, "i"); // 'i' flag for case insensitive search
    return posts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const addMark = (str) => {
    let patern = new RegExp(str, "gi");
    const paragraphs = document.getElementsByClassName("mark");

    for (let i = 0; i < paragraphs.length; i++) {
      paragraphs[i].innerHTML = paragraphs[i].textContent.replace(
        patern,
        (match) => `<mark>${match}</mark>`
      );
    }
  };

  const removeMark = () => {
    const paragraphs = document.getElementsByClassName("mark");

    for (let i = 0; i < paragraphs.length; i++) {
      paragraphs[i].innerHTML = paragraphs[i].textContent;
    }
  };

  const handleTagClick = (tag) => {
    setSearchText(tag);

    const searchResult = filterPrompts(tag);
    setSearchedResults(searchResult);

    addMark(tag);
  };

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a prompt, tag or username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      {loading ? (
        <Loading />
      ) : (
        <>
          {/* List Prompts */}
          {searchText.length > 2 ? (
            <PromptCardList
              data={searchedResults}
              handleTagClick={handleTagClick}
            />
          ) : (
            <PromptCardList data={posts} handleTagClick={handleTagClick} />
          )}
        </>
      )}
    </section>
  );
};

export default Feed;
