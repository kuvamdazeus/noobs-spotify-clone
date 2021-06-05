import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import { useEffect, useState } from 'react';
import router from 'next/router';

export default function Sidebar({ appContext }) {
    const { spotifyApi, setSearch, search } = appContext;

    const [playlists, setPlaylists] = useState([]);

    useEffect(async () => {
        let data = await spotifyApi.getUserPlaylists();
        setPlaylists(data.items);

    }, []);
    
    const goToPlaylist = e => {
        router.push('/album/' + e.target.id).then(() => window.location.reload());
    }

    const handleSearchClick = () => {
        if (window.location.pathname !== '/dashboard') {
            setSearch(true);
            router.push('/dashboard');
        }
        else setSearch(!search);
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