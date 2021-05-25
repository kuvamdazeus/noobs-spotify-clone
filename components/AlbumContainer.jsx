import router from 'next/router';

export default function AlbumContainer({ album }) {

    const handlePlayClick = () => {
        if (album.type === 'artist') router.push('/artist/' + album.id);
        else if (album.type === 'playlist') router.push('/playlist/' + album.id);
        else router.push('/album/' + album.id);
    }

    return (
        <div className="album_container">
            <center><img className='album_image' src={album.images[0]?.url} alt='' /><br /><br /></center>

            <section style={{display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between'}}>
                <p className='album_text'>
                    {album.name}
                </p>

                <img
                    src='/playing.png' 
                    style={{
                        objectFit: 'contain',
                        borderRadius: '100%',
                        width: 35,
                        cursor: 'pointer',
                        transition: 'all 50ms'
                    }}
                    onClick={handlePlayClick}
                    onMouseOver={e => e.target.style.transform = 'scale(1.1)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                />
            </section>
        </div>
    );
}