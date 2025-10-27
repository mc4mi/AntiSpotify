export default function Header({ onLogout, user }) {
  return (
    <header className="container">
      <nav className="nav">
        <div className="brand">
          <div className="brand__logo"></div>
          <div>
            Anti<span style={{color:'var(--green-500)'}}>Spotify</span>
          </div>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:'0.8rem'}}>
          {user && (
            <span className="badge">
              {user.display_name || user.id}
            </span>
          )}
          {onLogout && (
            <button className="btn btn--ghost" onClick={onLogout}>Cerrar sesión</button>
          )}
        </div>
      </nav>
    </header>
  )
}