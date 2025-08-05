
import React, { useState } from 'react';

type Valuation = {
  value: number;
  explanation: string;
};

type ValuationResult = {
  DCF: Valuation;
  PE: Valuation;
  Graham: Valuation;
};

type SentimentResult = {
  score: number;
  headlines: string[];
  explanation: string;
};

function App() {
  const [url, setUrl] = useState('');
  const [valuation, setValuation] = useState<ValuationResult | null>(null);
  const [sentiment, setSentiment] = useState<SentimentResult | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleExpand = (section: string) => {
    setExpanded(expanded === section ? null : section);
  };

  const getBarColor = (score: number) => {
    const hue = (score + 1) * 60; // Score from -1 to 1 maps to 0–120 (red to green)
    return `hsl(${hue}, 70%, 50%)`;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setValuation(null);
    setSentiment(null);

    try {
      const valRes = await fetch('http://localhost:8000/valuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const valData = await valRes.json();

      const sentRes = await fetch('http://localhost:8000/sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: url.split('/').pop()?.split('?')[0] || 'company' }),
      });
      const sentData = await sentRes.json();

      if (valData.success) setValuation(valData.data);
      if (sentData.success) setSentiment(sentData);
    } catch (err) {
      setError('Failed to fetch data. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">QuantVestor</h1>
      <div className="max-w-xl mx-auto space-y-4">
        <input
          className="w-full p-3 border rounded"
          placeholder="Enter Yahoo Finance URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze Stock'}
        </button>
        {error && <p className="text-red-500">{error}</p>}

        {valuation &&
          Object.entries(valuation).map(([key, val]) => (
            <div
              key={key}
              className="bg-white rounded shadow p-4 cursor-pointer"
              onClick={() => toggleExpand(key)}
            >
              <div className="flex justify-between font-semibold text-lg">
                <span>{key} Valuation</span>
                <span>₹{val.value}</span>
              </div>
              {expanded === key && (
                <p className="mt-2 text-sm text-gray-700">{val.explanation}</p>
              )}
            </div>
          ))}

        {sentiment && (
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Market Sentiment</h2>
            <div className="relative w-full h-4 rounded bg-gray-200 overflow-hidden">
              <div
                className="h-full"
                style={{
                  width: \`\${(sentiment.score + 1) * 50}%\`,
                  backgroundColor: getBarColor(sentiment.score),
                }}
              ></div>
            </div>
            <p className="text-sm mt-2 text-gray-700">{sentiment.explanation}</p>
            <ul className="text-sm list-disc pl-5 mt-2">
              {sentiment.headlines.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
