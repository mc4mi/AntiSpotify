export default function ErrorBox({ message = 'Ocurrió un error', onRetry }) {
  return (
    <div className="container">
      <div className="glass" style={{padding:'1rem', border:'1px solid rgba(244,63,94,.4)'}}>
        <strong style={{color:'#fda4af'}}>⚠️ {message}</strong>
        {onRetry && <div style={{marginTop:'.6rem'}}><button className="btn btn--ghost" onClick={onRetry}>Reintentar</button></div>}
      </div>
    </div>
  )
}