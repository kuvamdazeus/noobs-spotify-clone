import { useEffect, useState } from "react";
import search from 'youtube-search';
import ReactPlayer from 'react-player';

export default function SongContainer({ song, album }) {

    const [songTime, setSongTime] = useState('');
    const [songAlbum, setSongAlbum] = useState('');
    const [playing, setPlaying] = useState('');

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
        console.log('searching');
        const opts = {
            key: 'AIzaSyCisOJ1rNLIPQ4-f5xzX5S7gG46LKbxT9M',
            maxResults: 1,
        };

        search(`${song.name} by ${song.artists[0].name}`, opts, (err, results) => {
            console.log(results, song);

            if (err) {
                console.log(JSON.parse(err.response));
            
            } else {
                setPlaying(results[0].link);

            }
        });
    }

    if (playing)
        return (
            <section className='song' style={{display: 'flex', justifyContent: 'center'}}>
                <ReactPlayer url={playing} controls playing />
            </section>
        );
    
    return (
        <>
            <section className='song' onClick={handleSongPlay}>
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
                    <p className='song_text'>{song.name}</p>
                </div>
                <p className='song_text'>{songTime}</p>
            </section>
        </>
    );
}