import { useEffect, useState } from "react";
import search from 'youtube-search';
import ReactPlayer from 'react-player';

export default function SongContainer({ song, album, spotifyApi }) {

    const [songTime, setSongTime] = useState('');
    const [songAlbum, setSongAlbum] = useState('');
    const [playing, setPlaying] = useState('');

    const [mouseOver, setMouseOver] = useState(false);
    const [buttonText, setButtonText] = useState('Save');
    const [isPlaylist, setIsPlaylist] = useState(album?.type === 'playlist');

    useEffect(() => {
        let songMinutes = song.duration_ms / (1000 * 60);
        let secondsRemain = Math.round((song.duration_ms - Math.floor(songMinutes) * 1000 * 60) / 1000);
        if (secondsRemain.toString().length < 2) {
            secondsRemain = '0' + secondsRemain.toString();
        }
        setSongTime(`${Math.floor(songMinutes)}:${secondsRemain}`);

        if (song.album) {
            setSongAlbum({ images: song.album.images });
        }

    }, []);

    const handleSongPlay = () => {
        // search song by name first
        if (playing) setPlaying('');

        else {
            const opts = {
                key: 'AIzaSyCisOJ1rNLIPQ4-f5xzX5S7gG46LKbxT9M',
                maxResults: 1,
            };

            search(`${song.name} by ${song.artists[0].name}`, opts, (err, results) => {
                console.log(results, song);

                if (err) {
                    console.log(err);
                
                } else {
                    setPlaying(results[0].link);

                }
            });
        
        }
    }

    const handleAddToPlaylist = () => {
        spotifyApi.addToMySavedTracks([song.id])
            .then(() => {
                setButtonText('Saved');
            })
            .catch(err => console.log(err.response));
    }
    
    return (
        <>
            <section onMouseOver={() => setMouseOver(true)} onMouseLeave={() => setMouseOver(false)} className='song'>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <img 
                        src={(album && album.type !== 'playlist') ? (album.images && album.images[0].url) : (songAlbum.images && songAlbum.images[0].url)} 
                        alt=''
                        style={{
                            objectFit: 'contain',
                            height: 40,
                            marginRight: 10
                        }}
                    />

                    <div>
                        <p
                            className='song_text'
                            onMouseOver={e => e.target.style.textDecoration = 'underline'}
                            onMouseLeave={e => e.target.style.textDecoration = 'none'}
                            style={{cursor: 'pointer'}}
                            onClick={handleSongPlay}
                        >
                            {song.name}
                        </p>

                        <p
                            style={{
                                color: 'grey',
                                fontSize: 12
                            }}
                        >
                            {song.artists.map(artist => artist.name).join(', ')}
                        </p>
                    </div>
                </div>
                {mouseOver && !isPlaylist ?
                    <button
                        style={{
                            border: '1px solid white',
                            borderRadius: 100,
                            padding: 7,
                            paddingInline: 10,
                            backgroundColor: 'inherit',
                            cursor: 'pointer',
                        }}
                        onClick={handleAddToPlaylist}
                    >
                        {buttonText}
                    </button>
                    :
                    <p className='song_text'>{songTime}</p>
                }
            </section>

            {playing && 
                <section style={{display: 'flex', justifyContent: 'center', marginBottom: 20}}>
                    <ReactPlayer url={playing} controls playing />
                </section>
            }
        </>
    );
}