const axios = require('axios');
require('dotenv').config();

let spotifyToken = null;
let tokenExpires = null;

async function getSpotifyToken() {
  if (spotifyToken && tokenExpires && Date.now() < tokenExpires) {
    return spotifyToken;
  }
  const auth = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');
  const response = await axios.post('https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  spotifyToken = response.data.access_token;
  tokenExpires = Date.now() + (response.data.expires_in - 60) * 1000; // 1 min de margen
  return spotifyToken;
}

async function search(query, type = "track") {
  const token = await getSpotifyToken();
  const response = await axios.get('https://api.spotify.com/v1/search', {
    headers: { 'Authorization': `Bearer ${token}` },
    params: { q: query, type, limit: 10 }
  });
  return response.data; // <--- devuelve el objeto completo
}

async function getTrackById(id) {
  const token = await getSpotifyToken();
  const response = await axios.get(`https://api.spotify.com/v1/tracks/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
}

async function getArtistById(id) {
  const token = await getSpotifyToken();
  const response = await axios.get(`https://api.spotify.com/v1/artists/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
}

async function getArtistTopTracks(id, market = 'US') {
  const token = await getSpotifyToken();
  const response = await axios.get(`https://api.spotify.com/v1/artists/${id}/top-tracks?market=${market}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
}

async function getArtistAlbums(id) {
  const token = await getSpotifyToken();
  const response = await axios.get(`https://api.spotify.com/v1/artists/${id}/albums`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
}

async function getAlbumById(id) {
  const token = await getSpotifyToken();
  const response = await axios.get(`https://api.spotify.com/v1/albums/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
}

async function getPlaylistById(id) {
  const token = await getSpotifyToken();
  try {
    const response = await axios.get(`https://api.spotify.com/v1/playlists/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  } catch (err) {
    console.error("Spotify API error:", err.response?.data || err.message);
    throw err;
  }
}

async function getRecommendations(params) {
  const token = await getSpotifyToken();
  const response = await axios.get(`https://api.spotify.com/v1/recommendations`, {
    headers: { 'Authorization': `Bearer ${token}` },
    params
  });
  return response.data;
}

module.exports = {
  getSpotifyToken,
  search,
  getTrackById,
  getArtistById,
  getArtistTopTracks,
  getArtistAlbums,
  getAlbumById,
  getPlaylistById,
  getRecommendations
};
