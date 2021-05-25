import '../styles/globals.css';
import '../styles/dashboard.css';
import '../styles/album.css';
import { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import Sidebar from '../components/Sidebar.jsx';
import jwt from 'jsonwebtoken';
import router from 'next/router';
import YoutubePlayer from 'youtube-player';

const spotifyApi = new SpotifyWebApi({
	clientId: process.env.SPOTIFY_CLIENT_ID,
	clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
	redirectUri: process.env.REDIRECT_URL
});

function MyApp({ Component, pageProps }) {
  const [renderSidebar, setRenderSidebar] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [user, setUser] = useState('');
  const [search, setSearch] = useState(false);

  useEffect(() => {
    if(window.location.pathname !== '/') {
      setRenderSidebar(true);
    }

    if(window.location.href.includes('#access_token')) {
      let token = window.location.href.split('#access_token=')[1].split('&')[0];
      localStorage.setItem('spotify_clone_token', jwt.sign(token, 'access_token_spotify2'));

      spotifyApi.setAccessToken(token);
      spotifyApi.getMe().then(spotifyUser => {
        setUser(spotifyUser);
      });

      setAccessToken(token);

    }

    if(localStorage.getItem('spotify_clone_token') && window.location.pathname !== '/') {
      spotifyApi.getMe().then(spotifyUser => {
        setUser(spotifyUser);
      })
      .catch(err => {
        let errData = JSON.parse(err.response);
        if(errData.error.message === 'The access token expired') {
          localStorage.removeItem('spotify_clone_token');
          router.push('/');
        }
      });
      
    }

  }, [renderSidebar]);

  const appContext = {
    spotifyApi,
    user,
    search,
    setSearch,
    setRenderSidebar,
    accessToken,
    setAccessToken,
  };

  return (
    <>
      <div style={{display: renderSidebar && 'flex'}}>

        { renderSidebar && 
          <Sidebar
            appContext={appContext}
          /> 
        }

        <Component {...pageProps} appContext={appContext} />

      </div>

      <div id='player'></div>
      {/* <SpotifyPlayer /> */}
    </>
  );
}

export default MyApp;
