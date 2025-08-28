import Header from "./components/Header";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import Spinner from "./components/Spinner";
import { ThemeProvider } from "./components/ThemeContext";
import { useState } from 'react';
import './App.css';

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (city) => {
    setLoading(true);
    setError("");
    setWeather(null);
    try {
      const res = await fetch(`http://127.0.0.1:8000/weather/${city}`);
      if (!res.ok) throw new Error("City not found or API error.");
      const data = await res.json();
      setWeather({
        ...data,
        icon: data.condition && data.condition.icon ? data.condition.icon : `https://cdn.weatherapi.com/weather/64x64/day/113.png`
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <div className={`flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300`}>
        <Header />
        <main className="flex-1 container mx-auto px-4">
          <SearchBar onSearch={handleSearch} />
          {loading && <Spinner />}
          {error && <div className="text-center text-red-500">{error}</div>}
          {weather && (
            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded shadow p-6 mt-6 text-center">
              <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                {weather.icon && <img src={weather.icon} alt="icon" className="w-10 h-10" />} {weather.city}, {weather.country}
              </h2>
              <div className="text-4xl mb-2">{weather.temperature_c}&deg;C</div>
              <div className="text-lg text-gray-700 dark:text-gray-300">{weather.condition && weather.condition.text ? weather.condition.text : weather.condition}</div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
