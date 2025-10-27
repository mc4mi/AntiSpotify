// src/auth/spotifyAuth.js
// Implementación PKCE para una SPA (cliente). Compatible con Vite (import.meta.env).
// Exports:
// - buildAuthorizeUrl() -> url para redirigir al login de Spotify
// - handleRedirectCallback() -> intercambia code -> tokens (usa VITE_TOKEN_PROXY_URL si está definido)
// - getStoredTokens() -> devuelve objeto de tokens o null
// - clearTokens() -> limpia sessionStorage

// ---- helpers PKCE / base64url ----
function base64urlEncode(buffer) {
  // buffer: ArrayBuffer
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sha256Plain(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return base64urlEncode(hash);
}

function randomString(length = 64) {
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  // map bytes to chars (url-safe)
  const chars = [];
  for (let i = 0; i < arr.length; i++) {
    // 0-61 -> 0-9,a-z,A-Z
    const val = arr[i] % 62;
    if (val < 10) chars.push(String.fromCharCode(48 + val)); // 0-9
    else if (val < 36) chars.push(String.fromCharCode(97 + (val - 10))); // a-z
    else chars.push(String.fromCharCode(65 + (val - 36))); // A-Z
  }
  return chars.join('');
}

// ---- storage keys ----
const KEY_VERIFIER = 'spotify_code_verifier';
const KEY_TOKENS = 'spotify_tokens';

// ---- build authorize URL (PKCE) ----
export async function buildAuthorizeUrl() {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_REDIRECT_URI;
  const scopes = import.meta.env.VITE_SPOTIFY_SCOPES || '';
  if (!clientId || !redirectUri) {
    console.error('[spotifyAuth] faltan VITE_SPOTIFY_CLIENT_ID o VITE_REDIRECT_URI en .env');
    throw new Error('Missing SPOTIFY client id or redirect uri');
  }

  // generar code_verifier y code_challenge
  const verifier = randomString(96); // suficientemente largo
  const codeChallenge = await sha256Plain(verifier);

  // guardar verifier en sessionStorage (para luego intercambiar)
  sessionStorage.setItem(KEY_VERIFIER, verifier);
  console.log('[spotifyAuth] saved code_verifier (length):', verifier.length);

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: scopes,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    // show_dialog puede forzar login cada vez (opcional)
    // show_dialog: 'true'
  });

  const url = `https://accounts.spotify.com/authorize?${params.toString()}`;
  console.log('[spotifyAuth] buildAuthorizeUrl ->', url);
  return url;
}

// ---- handle redirect callback (code -> tokens) ----
export async function handleRedirectCallback() {
  try {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');
    if (error) {
      console.error('[spotifyAuth] callback returned error', error);
      throw new Error('SpotifyAuthError: ' + error);
    }
    if (!code) {
      // nada que hacer si no hay code en la URL
      return null;
    }

    // obtener verifier guardado
    const verifier = sessionStorage.getItem(KEY_VERIFIER);
    console.log('[spotifyAuth] handleRedirectCallback code=', code ? '[present]' : null);
    console.log('[spotifyAuth] verifier present?', !!verifier);
    if (!verifier) throw new Error('No se encontró code_verifier en sessionStorage');

    // preparar body form-urlencoded
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: import.meta.env.VITE_REDIRECT_URI,
      client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
      code_verifier: verifier
    });

    console.log('[spotifyAuth] token exchange body:', body.toString().slice(0, 300)); // no imprimir todo si es muy largo

    // elegir endpoint: proxy (si VITE_TOKEN_PROXY_URL) o cuentas de spotify
    const tokenUrl = import.meta.env.VITE_TOKEN_PROXY_URL || 'https://accounts.spotify.com/api/token';

    // realizar fetch
    const resp = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    });

    const text = await resp.text();
    console.log('[spotifyAuth] token exchange status', resp.status, 'respTextPreview:', text.slice(0, 600));

    if (!resp.ok) {
      // lanzar error con cuerpo para depuración
      throw new Error('Token exchange failed: ' + resp.status + ' - ' + text);
    }

    const data = JSON.parse(text);

    // calcular expiración y guardar tokens
    const now = Date.now();
    const store = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      scope: data.scope,
      token_type: data.token_type,
      expires_at: now + (data.expires_in * 1000)
    };
    sessionStorage.setItem(KEY_TOKENS, JSON.stringify(store));

    // limpiar querystring para que la app no re-procese el code al recargar
    try {
      history.replaceState({}, document.title, window.location.pathname + window.location.hash);
    } catch (e) {
      console.warn('[spotifyAuth] no se pudo limpiar querystring:', e);
    }

    console.log('[spotifyAuth] tokens guardados, expires_at:', store.expires_at);
    return store;
  } catch (err) {
    console.error('[spotifyAuth] handleRedirectCallback error:', err);
    throw err;
  }
}

// ---- helpers para tokens ----
export function getStoredTokens() {
  try {
    const raw = sessionStorage.getItem(KEY_TOKENS);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (obj.expires_at && Date.now() > obj.expires_at) return null;
    return obj;
  } catch (e) {
    console.error('[spotifyAuth] getStoredTokens parse error:', e);
    return null;
  }
}

export function clearTokens() {
  sessionStorage.removeItem(KEY_TOKENS);
  sessionStorage.removeItem(KEY_VERIFIER);
  console.log('[spotifyAuth] tokens and verifier cleared');
}

// ---- utilidad opcional: refresh (si quieres implementarlo más tarde) ----
// export async function refreshTokenIfNeeded() { ... }

// Nota: Esta implementación deja los logs útiles para depurar.
// Asegúrate de que:
// - import.meta.env.VITE_REDIRECT_URI coincide exactamente con lo registrado en Spotify Dashboard
// - si usas ngrok, que la URL pública que pongas en Spotify sea la misma que VITE_REDIRECT_URI
// - si tienes problemas CORS, configura VITE_TOKEN_PROXY_URL apuntando a tu token-proxy (y que el proxy reenvíe form-urlencoded).
