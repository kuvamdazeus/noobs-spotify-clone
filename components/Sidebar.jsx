import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import axios from 'axios';
import { useEffect, useState } from 'react';
import router from 'next/router';

export default function Sidebar({ appContext }) {
    const { spotifyApi, setSearch, search } = appContext;

    const [playlists, setPlaylists] = useState([]);
    
    const [alertData, setAlertData] = useState('');

    useEffect(async () => {
        let data = await spotifyApi.getUserPlaylists();
        setPlaylists(data.items);

    }, []);
    
    const goToPlaylist = e => {
        router.push('/album/' + e.target.id);
    }

    const handleSearchClick = () => {
        if (window.location.pathname !== '/dashboard') {
            setSearch(true);
            router.push('/dashboard');
        }
        else setSearch(!search);
    }

    const sendSpotifyDataAndWait = () => {
        spotifyApi.getUserPlaylists()
        .then(userPlaylists => {
            let playlistTracks = [];

            userPlaylists.items.map(async (playlist) => {
                let playlistSongs = [];
                let totalSongs = playlist.tracks.total;
                let offset = 0;

                while (totalSongs - offset > 100) {
                    let tracks = await spotifyApi.getPlaylistTracks(playlist.id, { limit: 100, offset });
                    
                    tracks = tracks.items.map(track => track.track.id);
                    let audioFeatures = await spotifyApi.getAudioFeaturesForTracks(tracks);

                    playlistSongs = playlistSongs.concat(audioFeatures.audio_features);
                    offset = offset + 100;
                }

                let newTracks = await spotifyApi.getPlaylistTracks(playlist.id, { limit: 100, offset });
                newTracks = newTracks.items.map(track => track.track.id);
                let newAudioFeatures = await spotifyApi.getAudioFeaturesForTracks(newTracks);

                playlistSongs = playlistSongs.concat(newAudioFeatures.audio_features);

                playlistTracks.push([playlist.id, playlistSongs]);

            });

            setTimeout(() => {
                axios.post(process.env.NEXT_PUBLIC_ML_SERVER + '/push-user-friendlies', playlistTracks)
                .then(console.log);
            
            }, 5000);
            
        });
    }
    
    const iconStyles = {
        fontSize: 30,
        marginRight: 10,
    }

    return (
        <div className='sidebar'>
            <img src='/sidebar1.png' /><br /><br />

            <section
                style={{color: window.location.pathname === '/dashboard' && 'white'}} 
                className='sidebar_icons'
                onClick={() => router.push('/dashboard')}
            >
                <HomeRoundedIcon style={iconStyles} />
                Home
            </section>

            <section 
                className='sidebar_icons'
                onClick={handleSearchClick}
            >
                <SearchOutlinedIcon style={iconStyles} />
                Search
            </section>

            <section 
                style={{color: window.location.pathname === '/library' && 'white'}} 
                className='sidebar_icons'
                onClick={() => router.push('/library')}
            >
                <LibraryBooksIcon style={iconStyles} />
                Your Library
            </section>

            <hr /><br />

            {playlists && 
                playlists.map(playlist => 
                    <section
                        style={{
                            fontSize: 15,
                            paddingLeft: 17
                        }}
                        className='sidebar_icons'
                        onClick={goToPlaylist}
                        id={playlist.id}
                        key={playlist.id}
                    >
                        {playlist.name}
                    </section>
                )
            }
        </div>
    );
}