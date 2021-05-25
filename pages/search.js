import { useEffect, useState, useRef } from 'react';
import { Avatar } from '@material-ui/core';
import AlbumContainer from '../components/AlbumContainer';
import jwt from 'jsonwebtoken';
import router from 'next/router';
import SpotifyAlert from '../components/SpotifyAlert';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import swal from 'sweetalert';

export default function Search({ appContext }) {

	const { spotifyApi, user, setRenderSidebar, accessToken } = appContext;
	const [morning, noon, eve] = [['#8e8de5', '#121212'], ['#b96f29', '#121212'], ['#921212', '#121212']];

	const [colors, setColors] = useState([]);
	const [dayGreet, setDayGreet] = useState([]);
	const [alertData, setAlertData] = useState('');
	const [renderPlayer, setRenderPlayer] = useState(false);

	const [artists, setArtists] = useState([]);
	const [topAlbums, setTopAlbums] = useState([]);
	const [artistAlbums, setArtistAlbums] = useState([]);

	useEffect(() => {
		if (localStorage.getItem('spotify_clone_token')) {
			spotifyApi.setAccessToken(jwt.verify(localStorage.getItem('spotify_clone_token'), 'access_token_spotify2'));
			setRenderSidebar(true);

			let hours = new Date().getHours();

			if (hours >= 18) {
				setDayGreet('evening');
				setColors(eve);
			} else if (hours >= 12) {
				setDayGreet('afternoon');
				setColors(noon);
			} else {
				setDayGreet('morning');
				setColors(morning);
			}

			spotifyApi.getMyTopArtists().then(data => {
				setArtists(data.items);
				
				spotifyApi.getArtistAlbums(data.items[0]?.id)
				.then(albumData => setArtistAlbums(albumData.items));
			});

			spotifyApi.getMyRecentlyPlayedTracks().then(data => {
				let albs = [];
				let names = [];

				if (data.items.length < 1) {
					setAlertData({ type: 'danger', text: 'You have to be a regular user of spotify (original), in order to get your top songs/playlists' });
				}

				data.items.map(item => {
					if (!names.includes(item.track?.album?.name)) {
						albs.push(item.track?.album);
						names.push(item.track?.album?.name);
					}
				});

				setTopAlbums(albs);
			});	

		} else {
			router.push('/');

		}

		setRenderPlayer(true);

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
								text: `"Spotify Web Player: This functionality is restricted to premium users only"\n😑............Fuck it ! we are using youtube's playback.`,
								button: {text: 'Hell yeah !'}
							})
						}}
					/>
				</div>
			</nav>

            <header style={{backgroundImage: `linear-gradient(${colors[0]}, ${colors[1]})`}} className='dashboard_header'>
				<h1>Good {dayGreet}</h1>
			</header><br /><br />

			<p className='small_heading'>Top artists</p>
			<div style={{ display: 'flex', overflowX: 'scroll', overflowY: 'hidden'}}>
				{artists.map(artist => <AlbumContainer album={artist} key={artist.id} />)}
			</div><br /><br />

			<p className='small_heading'>Top albums</p>
			<div style={{ display: 'flex', overflowX: 'scroll', overflowY: 'hidden'}}>
				{topAlbums.map(topAlbum => <AlbumContainer album={topAlbum} key={topAlbum.id} />)}
			</div><br /><br />

			<p className='small_heading'>Top artist albums</p>
			<div style={{ display: 'flex', overflowX: 'scroll', overflowY: 'hidden'}}>
				{artistAlbums.map(artistAlbum => <AlbumContainer album={artistAlbum} key={artistAlbum.id} />)}
			</div><br /><br />

			{alertData && <SpotifyAlert alertData={alertData} />}
			
			{/* renderPlayer && 
				<SpotifyPlayer
					token='BQCjWp8pLVxeGLPO7KSlSCwRyXfMV4IKdPtzZR0lJYNQuT6uwZv3VTcuFgmDfBSj_MfNXUJRNoe5shPlwJTig4BB7K3iFMKACfCv_OCzNt3huWYKF7urbAes2nzK6TBryp4fdCBgig2QR6IT2QRzdltEKqEtfttZNyI82Y0UFccCchOXUadMBI7mTSaAsbddWxa2aUnhy4Hs9zhddQ'
					uris={['spotify:artist:6HQYnRM4OzToCYPpVBInuU']}
				/> 
			*/}
        </section>
    );
}