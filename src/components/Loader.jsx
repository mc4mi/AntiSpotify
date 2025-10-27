export default function Loader({ label = 'Cargando...' }) {
  return (
    <div className="container" style={{display:'flex', justifyContent:'center', padding:'2rem'}}>
      <div className="glass" style={{padding:'1rem 1.2rem', display:'flex', alignItems:'center', gap:'.8rem'}}>
        <div style={{
          width:14, height:14, borderRadius:'50%',
          background:'linear-gradient(90deg, var(--purple-500), var(--green-500))',
          animation:'pulse .9s infinite alternate'
        }} />
        <span>{label}</span>
      </div>
      <style>
        {`@keyframes pulse { from{transform:scale(.9); opacity:.6} to{transform:scale(1.2); opacity:1} }`}
      </style>
    </div>
  )
}
