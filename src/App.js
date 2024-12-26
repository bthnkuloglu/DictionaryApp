import './App.css';
import { useState } from 'react';
import { fetchWordData } from './services/api';

function App() {
  const [query, setQuery] = useState('');
  const [formattedQuery, setFormattedQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Lütfen bir kelime girin.');
      setResults([]); // Reset The  Results
      return;
    }

    const firstChar = query[0];
    const restOfQuery = query.slice(1);
    const formatted = `${firstChar.toUpperCase()}${restOfQuery}`;
    setFormattedQuery(formatted);

    setLoading(true); // Loading state the start
    try {
      setError(''); // Clear the error mesage
      const data = await fetchWordData(formatted);
      console.log('Arama Sonuçları:', data); // Debug log

      // API, Data Check
      if (!data || !Array.isArray(data) || data.length === 0) {
        setError('Aradığınız kelime bulunamadı. Lütfen doğru bir kelime girin.');
        setResults([]); // Reset Results
      } else {
        setResults(data); // Current results
      }
    } catch (err) {
      console.error('Hata:', err);
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      setResults([]); // Reset the Result
    } finally {
      setLoading(false); // Stop the Loading state
    }
  };

  return (
    <div className="container">
      <h1>Türkçe Sözlük</h1>
      <div className="search-box">
        <input
          type="text"
          placeholder="Lütfen Kelime Giriniz: "
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          required
        />
        <button type="button" onClick={handleSearch}>
          Ara
        </button>
      </div>

      {/* Loading Message */}
      {loading && <p className="loading">Yükleniyor...</p>}

      {/* Error Message */}
      {!loading && error && <p className="error">{error}</p>}

      {/* Result Container : If have a results, it is shown */}
      {!loading && !error && Array.isArray(results) && results.length > 0 && (
        <div className="result-box">
          <h2>Arama Sonucu</h2>
          {formattedQuery && <h3>{formattedQuery}</h3>}
          {results.map((result, index) => (
            <div key={index} className="result">
              {result.madde.kelime.map((kelime, i) => (
                <div key={i} className="result-item">
                  {kelime.ozellik && kelime.ozellik.length > 0 && (
                    <p>
                      <strong>Tür:</strong>{' '}
                      {kelime.ozellik.map((ozl) => ozl.tamAdı).join(', ')}
                    </p>
                  )}
                  <p>
                    <strong>Anlam {i + 1}:</strong> {kelime.anlam}
                  </p>
                  {kelime.ornek && kelime.ornek.length > 0 && (
                    <p>
                      <strong>Örnek:</strong> {kelime.ornek[0]?.ornek} -{' '}
                      {kelime.ornek[0]?.yazar}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
