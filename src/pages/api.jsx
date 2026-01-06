import "./styleSheets/api.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

const BASE_URL = "https://jsonplaceholder.typicode.com/posts";

/**
 * @typedef {Object} Post
 * @property {number} id
 * @property {string} title
 */

// Note: Items are currently static placeholders. You can make them dynamic later.
export default function Api() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem("posts") || "[]");
    if (savedPosts.length > 0) {
      setPosts(savedPosts);
      setIsInitialized(true);
      console.log("Data stored in local storage successfully", savedPosts);
    } else {
      const Fetch = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(BASE_URL);
          const posts = await res.json();
          setPosts(posts);
          setIsInitialized(true);
          console.log("Fetch response:", posts);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      Fetch();
    }
  }, []);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  const handleEdit = (label) => {
    alert(`Edit clicked for ${label}`);
  };

  const handleDelete = (label) => {
    alert(`Delete clicked for ${label}`);
  };

  return (
    <div className="api-container">
      <header className="api-header">
        <h2>API Fetcher</h2>
      </header>

      <ul className="items">
        {posts && posts.length > 0 ? (
          posts.map((post, index) => (
            <li className="item" key={post.id}>
              <span className="label">#{index + 1}</span>
              <span className="value">{post.title}</span>
              <div className="actions">
                <button className="edit" onClick={() => handleEdit(post)}>
                  <FontAwesomeIcon icon={faPenSquare} /> <span>Edit</span>
                </button>
                <button className="delete" onClick={() => handleDelete(post)}>
                  <FontAwesomeIcon icon={faTrash} /> <span>Delete</span>
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="item empty">No items found</li>
        )}
      </ul>

      <p className="note">
        Note: Items are fetched from the configured API and displayed as a list.
      </p>
    </div>
  );
}
