// MOCK de SpotifyAPI: datos falsos para probar UI
export const SpotifyAPI = {
  me: async () => {
    // devuelve null para forzar la vista de Login; si quieres probar logged in, devuelve objeto user
    return null
    // Ejemplo user para probar UI autenticada:
    // return { id: 'maria', display_name: 'Maria Camila', images: [{url: 'https://via.placeholder.com/150'}], product: 'premium' }
  },

  searchTracks: async (q, limit = 24) => {
    return {
      tracks: {
        items: Array.from({length: Math.min(limit, 6)}).map((_,i) => ({
          track: {
            id: `mock-${i}`,
            name: `Canción mock ${i+1} - ${q}`,
            artists: [{ name: 'Artista Mock' }],
            preview_url: null,
            external_urls: { spotify: '#' }
          }
        }))
      }
    }
  },

  topTracks: async (limit = 12) =>
     {
    // devuelve lista simple (la app espera un array en setTracks)
    return Array.from({length: Math.min(limit,6)}).map((_,i) => ({
      id: `top-${i}`,
      name: `Top mock ${i+1}`,
      artists: [{name:'Top Artist'}],
      preview_url: null,
      external_urls: { spotify: '#' }
    }))
  },

  recommendationsBySeedTracks: async () => ({ tracks: [] })
}
