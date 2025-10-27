// src/components/Login.jsx
import React from 'react'
import spotifyLogo from '../assets/Spotify-Logo.png'

export default function Login({ onLogin }) {
  const handleClick = (e) => {
    e.preventDefault()
    if (typeof onLogin === 'function') {
      onLogin()
    } else {
      console.warn('onLogin no está definido — revisa que App pase doLogin como prop')
    }
  }

  return (
    <section className="container hero glass">
      <div className="hero__copy">
        <span className="tag">Hecho con React + Spotify API</span>
        <h1 className="hero__title">Tu música, a tu <span className="accent">estilo</span>.</h1>
        <p>Explora canciones, descubre recomendaciones y reproduce avances (30s) con buena vibra ⚡</p>

        <div className="hero__cta">
          <button className="btn btn--primary" onClick={handleClick}>
            <img src={spotifyLogo} alt="Spotify" style={{ width: '20px', marginRight: '8px', verticalAlign: 'middle' }} />
            Iniciar sesión con Spotify
          </button>

          <a href="https://developer.spotify.com/documentation/web-api" target="_blank" rel="noopener noreferrer" className="btn btn--secondary" style={{ marginLeft: '1rem' }}>
            Ver API
          </a>
        </div>
      </div>

      <div className="glass" style={{ flex: 1, minHeight: 220, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '1rem' }}>
        <img src={spotifyLogo} alt="Spotify Logo" style={{ width: '150px', opacity: 0.8 }} />
      </div>
    </section>
  )
}
