import React, { useState, useEffect } from "react";

const BASE_URL = "http://20.244.56.144/evaluation-service";
const ACCESS_CODE = "nwpwrZ";

const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ACCESS_CODE}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      const userArray = Object.entries(data.users).map(([id, name]) => ({ id, name }));
      setUsers(userArray);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async (userId) => {
    try {
      setSelectedUser(userId);
      setPosts([]); 
      setLoading(true);

      const response = await fetch(`${BASE_URL}/users/${userId}/posts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ACCESS_CODE}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setPosts(data.posts || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Top Users</h1>

      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="bg-white shadow-lg rounded-lg p-6 w-96">
        {users.map((user) => (
          <li
            key={user.id}
            className="border-b py-2 cursor-pointer hover:bg-gray-200"
            onClick={() => fetchPosts(user.id)}
          >
            {user.name}
          </li>
        ))}
      </ul>

      {selectedUser && (
        <div className="mt-6 w-96">
          <h2 className="text-xl font-bold">Posts by {users.find(u => u.id === selectedUser)?.name}</h2>
          <ul className="bg-white shadow-lg rounded-lg p-4 mt-2">
            {posts.length > 0 ? (
              posts.map((post) => (
                <li key={post.id} className="border-b py-2">{post.content}</li>
              ))
            ) : (
              <p className="text-gray-500">No posts found.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
