export default function SpotifyAlert({ alertData }) {
    return (
        <section className={'alert ' + alertData.type}>
            {alertData.text}
        </section>
    );
}