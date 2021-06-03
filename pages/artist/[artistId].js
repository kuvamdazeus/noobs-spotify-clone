import { useEffect, useState } from "react";
import Head from 'next/head';
import { Avatar } from '@material-ui/core';
import jwt from 'jsonwebtoken';
import router from "next/router";
import AlbumContainer from "../../components/AlbumContainer";

export default function Album({ appContext }) {
    const { spotifyApi, user } = appContext;
	const [morning, noon, eve] = [['#8e8de5', '#121212'], ['#b96f29', '#121212'], ['#921212', '#121212']];

	const [colors, setColors] = useState([]);

    const [album, setAlbum] = useState('');
    const [albums, setAlbums] = useState([]);
    const [tracks, setTracks] = useState('');
    const [artist, setArtist] = useState('');

    useEffect(() => {
        if (localStorage.getItem('spotify_clone_token')) {
            let artistId = window.location.href.split('/artist/')[1].trim('/');
            spotifyApi.setAccessToken(jwt.verify(localStorage.getItem('spotify_clone_token'), 'access_token_spotify2'));

            let hours = new Date().getHours();

            if (hours >= 18) {
                setColors(eve);
            } else if (hours >= 12) {
                setColors(noon);
            } else {
                setColors(morning);
            }
            
            spotifyApi.getArtist(artistId)
            .then(songArtist => {
                spotifyApi.getArtistTopTracks(songArtist.id, 'IN', { limit: 50 })
                .then(data => {
                    setTracks(data.tracks);
                    setArtist(songArtist);
                })
            });

            spotifyApi.getArtistAlbums(artistId)
            .then(data => setAlbums(data.items));

        } else {
            router.push('/');

        }

    }, []);

    const navStyles = {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		position: 'sticky',
		top: 0,
		backgroundColor: colors[0],
		paddingBlock: 15,
		paddingInline: 10,
		zIndex: 1,
	};

	const avatarStyles = {
		objectFit: 'contain',
		marginRight: 5,
		width: 25,
		height: 25,
	};

    return (
        <section className="dashboard">

            <Head>
                <title>Spotify - Artist</title>
                <meta name="description" content="Play top albums from your favourite artist" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

			<nav style={navStyles}>
				<p></p>

				<div className='dashboard_nav_button'>
					<Avatar src={user.images ? user.images[0]?.url : null} style={avatarStyles} />
					{user.display_name}
				</div>
			</nav>

            <header
                style={{
                    backgroundImage: `linear-gradient(${colors[0]}, ${colors[1]})`,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                }}
                // className='dashboard_header'
            >
                <img
                    src={artist.images ? artist.images[0]?.url : null}
                    alt='' 
                    style={{
                        objectFit: 'contain',
                        width: '18vw',
                        margin: 20,
                        borderRadius: 10
                    }}
                />
				<p style={{fontSize: '3.5vw'}}><b>{artist.name}</b></p>

			</header><br /><br />

            <p className='small_heading'>Top albums</p>
			<div style={{ display: 'flex', overflowX: 'scroll', overflowY: 'hidden'}}>
				{albums.map(artistAlbum => <AlbumContainer album={artistAlbum} key={artistAlbum.id} />)}
			</div><br /><br />

        </section>
    );
}