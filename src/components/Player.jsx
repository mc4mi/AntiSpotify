import { useEffect, useRef, useState } from 'react'

export default function Player({ track }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
    }
  }, [track?.id]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) { a.play(); setPlaying(true); }
    else { a.pause(); setPlaying(false); }
  }

  if (!track) return null;

  const img = track.album?.images?.[2]?.url || track.album?.images?.[1]?.url;
  const artists = (track.artists || []).map(a => a.name).join(', ');
  return (
    <div className="player glass container">
      <img src={img} alt="" style={{width:52, height:52, borderRadius:10}} />
      <div style={{display:'flex', flexDirection:'column', gap:'.2rem'}}>
        <strong style={{lineHeight:1}}>{track.name}</strong>
        <span style={{opacity:.85, fontSize:'.9rem'}}>{artists}</span>
      </div>
      <div style={{marginLeft:'auto', display:'flex', gap:'.6rem', alignItems:'center'}}>
        <button className="btn btn--primary" onClick={toggle}>
          {playing ? '⏸️ Pausa' : '▶︎ Reproducir'}
        </button>
        <audio ref={audioRef} controls style={{display:'none'}}>
          <source src={track.preview_url} type="audio/mpeg" />
        </audio>
      </div>
    </div>
  )
}