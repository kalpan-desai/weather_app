import React, { useState, useEffect } from "react";

const SearchBar = ({ onSearch }) => {
  const [city, setCity] = useState(() => localStorage.getItem("lastCity") || "");
  const [recent, setRecent] = useState(() => {
    const stored = localStorage.getItem("recentCities");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("recentCities", JSON.stringify(recent));
  }, [recent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      localStorage.setItem("lastCity", city.trim());
      setRecent((prev) => {
        const updated = [city.trim(), ...prev.filter(c => c.toLowerCase() !== city.trim().toLowerCase())].slice(0, 5);
        return updated;
      });
      onSearch(city.trim());
    }
  };

  const handleRecentClick = (c) => {
    setCity(c);
    onSearch(c);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex justify-center my-6">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          className="p-2 border rounded-l-md w-64 focus:outline-none dark:bg-gray-700 dark:text-white"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>
      {recent.length > 0 && (
        <div className="flex flex-col items-center mt-2">
          <div className="font-semibold mb-1">Recent</div>
          <div className="flex gap-2 flex-wrap justify-center">
            {recent.map((c, i) => (
              <button
                key={c + i}
                onClick={() => handleRecentClick(c)}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-blue-100 dark:hover:bg-blue-900 text-sm transition"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
