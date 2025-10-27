import TrackCard from './TrackCard'

export default function TrackList({ tracks = [], onPlayPreview }) {
  if (!tracks.length) return null;
  return (
    <div className="grid">
      {tracks.map(t => (
        <TrackCard key={t.id} track={t} onPlayPreview={onPlayPreview} />
      ))}
    </div>
  )
}