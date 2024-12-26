// services/api.js

export const fetchWordData = async (query) => {
    const url = `https://api.collectapi.com/dictionary/wordSearchTurkish?query=${encodeURIComponent(query)}`;
    const apiKey = process.env.REACT_APP_API_KEY;
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `apikey ${apiKey}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const json = await response.json();
      return json.result || [];
    } catch (error) {
      console.error('Error fetching word data:', error);
      throw error;
    }
  };
  