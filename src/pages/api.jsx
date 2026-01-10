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
  const [editId, setEditId] = useState(null);
  const [editable, setEditable] = useState("");

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

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("posts", JSON.stringify(posts));
    }
  }, [posts, isInitialized]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  const handleEdit = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editable }),
      });
      const updatedPost = await res.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id ? { ...post, title: updatedPost.title } : post
        )
      );
      setEditId(null);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const confirmAndSave = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to update this item?");
    if (!isConfirmed) return;
    await handleEdit(id); 
  }

  const startEdit = (post) => {
    setEditId(post.id);
    setEditable(post.title);
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("are you sure you want to delete this item?");
    if (!isConfirmed) return;
    try {
      await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    }
  };

  return (
    <div className="api-container">
      <header className="api-header">
        <h2>API Fetcher</h2>
      </header>

      <ul className="items">
        {posts.map((post, index) => {
          return (
            <li className="item" key={post.id}>
              {editId === post.id ? (
                <>
                  <input
                    type="text"
                    className="inputText"
                    value={editable}
                    onChange={(e) => setEditable(e.target.value)}
                    // onBlur={() => handleEdit(post.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleEdit(post.id);
                    }}
                    autoFocus
                  />
                  <button className="save-btn" onClick={() => handleEdit(post.id)}>save</button>
                </>
              ) : (
                <>
                  <span className="label">#{index + 1}</span>
                  <span className="value">{post.title}</span>
                  <div className="actions">
                    <button className="edit" onClick={() => startEdit(post)}>
                      <FontAwesomeIcon icon={faPenSquare} /> <span>Edit</span>
                    </button>
                    <button
                      className="delete"
                      onClick={() => handleDelete(post.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} /> <span>Delete</span>
                    </button>
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ul>

      <p className="note">
        Note: Items are fetched from the configured API and displayed as a list.
      </p>
    </div>
  );
}
