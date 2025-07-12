import React, { useState } from 'react';

export default function HomepageSearchBar({ onSearch }) {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ keyword, location });
  };

  return (
    <form className="homepage-search-bar" onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Keyword (e.g. React, Designer)"
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        className="form-control"
        style={{ display: 'inline-block', width: '40%', marginRight: 8 }}
      />
      <input
        type="text"
        placeholder="Location (e.g. New York)"
        value={location}
        onChange={e => setLocation(e.target.value)}
        className="form-control"
        style={{ display: 'inline-block', width: '40%', marginRight: 8 }}
      />
      <button type="submit" className="btn btn-primary">Search</button>
    </form>
  );
}
