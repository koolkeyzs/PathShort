import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './App.css';

const API_URL = 'http://localhost:3000';

function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [urls, setUrls] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const fetchUrls = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/urls`);
      setUrls(res.data);
    } catch {
      setError('Could not load your links. Try refreshing.');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/api/shorten`, { originalUrl });
      setShortUrl(res.data.shortUrl);
      setOriginalUrl('');
      await fetchUrls();
    } catch {
      setError('Could not shorten that link. Check the URL and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const chartData = urls.map((u) => ({
    name: u.shortCode,
    clicks: u.totalClicks,
  }));

  return (
    <div className="page">
      <div className="container">
        <h1 className="title">Link shortener</h1>
        <p className="subtitle">Paste a long link, get a short one, see who clicks it.</p>

        <form onSubmit={handleSubmit} className="form">
          <input
            type="url"
            placeholder="https://example.com/a-very-long-link"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            required
            className="input"
          />
          <button type="submit" className="button" disabled={submitting}>
            {submitting ? 'Shortening…' : 'Shorten'}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        {shortUrl && (
          <div className="result">
            <a href={shortUrl} target="_blank" rel="noreferrer" className="mono link">
              {shortUrl}
            </a>
            <button onClick={handleCopy} className="copyButton">
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        )}

        <h2 className="sectionTitle">Your links</h2>

        {loadingList ? (
          <div className="skeletonList">
            <div className="skeletonRow" />
            <div className="skeletonRow" />
            <div className="skeletonRow" />
          </div>
        ) : urls.length === 0 ? (
          <p className="empty">No links yet. Shorten one above to see it here.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Short code</th>
                <th>Destination</th>
                <th>Clicks</th>
              </tr>
            </thead>
            <tbody>
              {urls.map((u) => (
                <tr key={u.shortCode} className="row">
                  <td className="mono">{u.shortCode}</td>
                  <td className="mono truncate">{u.originalUrl}</td>
                  <td>{u.totalClicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {urls.length > 0 && (
          <>
            <h2 className="sectionTitle">Clicks by link</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#8B93A7" tick={{ fontFamily: 'monospace', fontSize: 12 }} />
                <YAxis stroke="#8B93A7" allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: '#131826', border: '1px solid #1F2532', borderRadius: 8, color: '#E7E9EE' }}
                />
                <Bar dataKey="clicks" fill="#5B8DEF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </div>
    </div>
  );
}

export default App;