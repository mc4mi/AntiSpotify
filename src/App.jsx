import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import Login from './components/Login'
import SearchBar from './components/SearchBar'
import TrackList from './components/TrackList'
import Player from './components/Player'
import Loader from './components/Loader'
import ErrorBox from './components/Error'
import { buildAuthorizeUrl, handleRedirectCallback, getStoredTokens, clearTokens } from './auth/spotifyAuth'
import { SpotifyAPI } from './services/spotify'

export default function App() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | ready | error
  const [error, setError] = useState('');
  const [tracks, setTracks] = useState([]);
  const [current, setCurrent] = useState(null);
  const isAuthed = useMemo(() => !!getStoredTokens(), []);

  // 🔁 Manejo del callback ?code=... y carga inicial
  useEffect(() => {
    (async () => {
      try {
        setStatus('loading');
        const tokens = await handleRedirectCallback();

        // Si hay tokens o ya hay sesión guardada
        if (tokens || isAuthed) {
          const me = await SpotifyAPI.me();
          setUser(me);

          // 🔹 Cargar top tracks del usuario
          const top = await SpotifyAPI.topTracks(12);
          setTracks(top || []);

          // ✅ Mostrar automáticamente el reproductor con la primera canción
          if (top && top.length > 0) {
            setCurrent(top[0]);
          }

          setStatus('ready');
        } else {
          setStatus('idle');
        }
      } catch (e) {
        console.error(e);
        setError(e.message);
        setStatus('error');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔑 Iniciar sesión
  const doLogin = async () => {
    const url = await buildAuthorizeUrl();
    window.location.assign(url);
  };

  // 🚪 Cerrar sesión
  const doLogout = () => {
    clearTokens();
    setUser(null);
    setTracks([]);
    setCurrent(null);
    window.location.reload();
  }

  // 🔍 Buscar canciones
  const onSearch = async (q) => {
    try {
      setStatus('loading');
      const res = await SpotifyAPI.searchTracks(q, 24);
      setTracks(res.tracks?.items || []);
      setStatus('ready');
    } catch (e) {
      console.error(e);
      if (e.message === 'NO_AUTH') {
        setError('Necesitas iniciar sesión.');
      } else {
        setError('No se pudo buscar.');
      }
      setStatus('error');
    }
  }

  // 🌀 Estados de carga y error
  if (status === 'loading') 
    return <div className="app"><Header user={user} onLogout={user ? doLogout : null} /><Loader /></div>;
  
  if (status === 'error') 
    return <div className="app"><Header user={user} onLogout={user ? doLogout : null} /><ErrorBox message={error} /></div>;

  // 🎵 Interfaz principal
  return (
    <div className="app">
      <Header user={user} onLogout={user ? doLogout : null} />

      <main className="main">
        {!user ? (
          // Si no está logueado, mostrar login
          <Login onLogin={doLogin} />
        ) : (
          // Si está logueado, mostrar contenido principal
          <section className="container">
            <div className="grid">
              {/* Sidebar con usuario y búsqueda */}
              <aside className="sidebar glass">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                    {user.images?.[0]?.url && (
                      <img 
                        src={user.images[0].url} 
                        alt="user avatar" 
                        style={{ width: 44, height: 44, borderRadius: 12 }}
                      />
                    )}
                    <div>
                      <div style={{ fontWeight: 700 }}>{user.display_name || user.id}</div>
                      <div className="badge">Plan: {user.product || '—'}</div>
                    </div>
                  </div>

                  {/* Barra de búsqueda */}
                  <SearchBar onSearch={onSearch} />

                  {/* Tips */}
                  <div className="section glass">
                    <div style={{ fontWeight: 700, marginBottom: '.6rem' }}>Tips</div>
                    <ul style={{ margin: 0, paddingLeft: '1rem', opacity: .9, lineHeight: 1.5 }}>
                      <li>Busca artistas o canciones (ej: “Bad Bunny”)</li>
                      <li>Reproduce la <span className="tag">previsualización</span> de 30s</li>
                      <li>Abre el tema en Spotify para escuchar completo</li>
                    </ul>
                  </div>
                </div>
              </aside>

              {/* Contenido principal: lista de canciones */}
              <div className="content">
                <div className="section glass" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h2 style={{ margin: 0 }}>Explorar</h2>
                  <span className="tag">Morado + Verde vibes</span>
                </div>

                <TrackList tracks={tracks} onPlayPreview={setCurrent} />
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Reproductor activo */}
      {current && <Player track={current} />}
    </div>
  )
}
