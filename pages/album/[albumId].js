import { useEffect, useState } from "react";
import Head from 'next/head';
import { Avatar } from '@material-ui/core';
import jwt from 'jsonwebtoken';
import SongContainer from "../../components/SongContainer";
import router from "next/router";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import swal from 'sweetalert';

export default function Album({ appContext }) {
    const { spotifyApi, user } = appContext;
	const [morning, noon, eve] = [['#8e8de5', '#121212'], ['#b96f29', '#121212'], ['#921212', '#121212']];

	const [colors, setColors] = useState([]);

    const [album, setAlbum] = useState('');
    const [tracks, setTracks] = useState('');

    useEffect(() => {
        if (localStorage.getItem('spotify_clone_token')) {
            let albumId = window.location.href.split('/album/')[1].trim('/');
            spotifyApi.setAccessToken(jwt.verify(localStorage.getItem('spotify_clone_token'), 'access_token_spotify2'));

            let hours = new Date().getHours();

            if (hours >= 18) {
                setColors(eve);
            } else if (hours >= 12) {
                setColors(noon);
            } else {
                setColors(morning);
            }

            spotifyApi.getAlbum(albumId)
            .then(data => {
                setAlbum(data);
                spotifyApi.getAlbumTracks(albumId)
                .then(tracksData => setTracks(tracksData.items));

            })
            .catch(err => {
                if (err.status === 404) {
                    spotifyApi.getPlaylist(albumId)
                    .then(data => {
                        setAlbum(data);

                        let pTracks = [];
                        data.tracks.items.map(t => pTracks.push(t.track));
                        setTracks(pTracks);
                    });
                }
            });

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
                <title>Spotify - Player</title>
                <meta name="description" content="Play your favourites here" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

			<nav style={navStyles}>
				<p></p>

				<div className='dashboard_nav_button'>
					<Avatar src={user.images ? user.images[0]?.url : null} style={avatarStyles} />
					{user.display_name}
                    <InfoOutlinedIcon
						style={{marginLeft: 5}}
						onClick={() => {
							swal({
								icon: 'info',
								title: 'Info', 
								text: `
                                    Click on song's title to start/stop the youtube playback\n
                                    If songs arent playing on clicking their title, it is probably due to per day quota limit of youtube's playback
                                `,
								button: {text: '😑'}
							})
						}}
					/>
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
                    src={album.images ? album.images[0]?.url : null}
                    alt='' 
                    style={{
                        objectFit: 'contain',
                        width: '18vw',
                        margin: 20,
                        borderRadius: 10
                    }}
                />
				<p style={{fontSize: '3.5vw'}}><b>{album.name}</b></p>

			</header><br /><br />

            {tracks && tracks.map(song => <SongContainer song={song} album={album} key={song.id} spotifyApi={spotifyApi} />)}

        </section>
    );
}