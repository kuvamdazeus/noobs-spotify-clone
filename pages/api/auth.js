export default function(req, res) {
    let scopes = `
        user-read-private
        user-read-email
        user-top-read
        user-read-recently-played
        user-read-playback-state
        app-remote-control
        user-modify-playback-state
        user-read-currently-playing
        user-read-playback-position
        playlist-read-private
        user-library-read
        streaming
    `;
    
    let url = 'https://accounts.spotify.com/authorize?response_type=token&client_id=' +
        process.env.SPOTIFY_CLIENT_ID + '&scope=' + 
        encodeURIComponent(scopes) +
        '&redirect_uri=' + encodeURIComponent(process.env.REDIRECT_URL);
    
    res.status(200).json({ url });
}