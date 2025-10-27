export default function TrackCard({ track, onPlayPreview }) {
  const img = track.album?.images?.[1]?.url || track.album?.images?.[0]?.url;
  const artists = (track.artists || []).map(a => a.name).join(', ');
  return (
    <div className="card">
      <img className="card__cover" src={img} alt={track.name} />
      <div className="card__title">{track.name}</div>
      <div className="card__subtitle">{artists}</div>
      <div style={{display:'flex', gap:'.5rem', marginTop:'.4rem', flexWrap:'wrap'}}>
        {track.preview_url ? (
          <button className="btn btn--primary" onClick={() => onPlayPreview(track)}>
            ▶︎ Previa 30s
          </button>
        ) : (
          <span className="badge">Sin preview</span>
        )}
        <a className="btn btn--ghost" href={track.external_urls?.spotify} target="_blank" rel="noreferrer">
          Abrir en Spotify
        </a>
      </div>
    </div>
  )
}