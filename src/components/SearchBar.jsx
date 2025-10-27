import { useState } from 'react'

export default function SearchBar({ onSearch, placeholder = 'Busca canciones, artistas...' }) {
  const [q, setQ] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if (q.trim()) onSearch(q.trim());
  }
  return (
    <form onSubmit={submit} className="glass" style={{display:'flex', gap:'0.6rem', padding:'0.6rem'}}>
      <input
        className="input"
        type="text"
        placeholder={placeholder}
        value={q}
        onChange={e => setQ(e.target.value)}
      />
      <button className="btn btn--primary" type="submit">Buscar</button>
    </form>
  )
}