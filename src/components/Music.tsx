import React, { useEffect, useState } from "react";
import '../assets/styles/Music.scss';

type Album = {
    title: string;
    artist: string;
    accent: string;
    thoughts: string;
};

type LastFmTrack = {
    name: string;
    artist: {
        "#text": string;
    };
    album?: {
        "#text": string;
    };
    image?: Array<{
        size: string;
        "#text": string;
    }>;
    "@attr"?: {
        nowplaying?: string;
    };
};

type ListeningTrack = {
    title: string;
    artist: string;
    album: string;
    cover: string;
    isNowPlaying: boolean;
};

const favoriteAlbums: Album[] = [
    {
        title: "Nurture",
        artist: "Porter Robinson",
        accent: "#139220",
        thoughts: "Placeholder thoughts: this album feels like sunlight breaking through after a long storm.",
    },
    {
        title: "Red",
        artist: "Taylor Swift",
        accent: "#ac1d45",
        thoughts: "Placeholder thoughts: a classic heart-on-sleeve record full of big feelings and sharper memories.",
    },
    {
        title: "Time 'n' Place",
        artist: "Kero Kero Bonito",
        accent: "#a135a5",
        thoughts: "Placeholder thoughts: playful, bittersweet, and packed with sounds that make growing up feel surreal.",
    },
    {
        title: "Melodrama",
        artist: "Lorde",
        accent: "#0638bc",
        thoughts: "Placeholder thoughts: this is late-night pop drama with every emotion turned into neon.",
    },
];

const fallbackTrack: ListeningTrack = {
    title: "Currently listening placeholder",
    artist: "Last.fm ready",
    album: "Connect REACT_APP_LASTFM_USERNAME and REACT_APP_LASTFM_API_KEY",
    cover: "",
    isNowPlaying: false,
};

function getLargestImage(track: LastFmTrack) {
    return track.image?.slice().reverse().find((image) => image["#text"])?.["#text"] || "";
}

function Music() {
    const [selectedAlbum, setSelectedAlbum] = useState<string | null>(favoriteAlbums[0].title);
    const [listeningTrack, setListeningTrack] = useState<ListeningTrack>(fallbackTrack);

    useEffect(() => {
        const username = process.env.REACT_APP_LASTFM_USERNAME;
        const apiKey = process.env.REACT_APP_LASTFM_API_KEY;

        if (!username || !apiKey) {
            return;
        }

        const controller = new AbortController();
        const lastFmUrl = new URL("https://ws.audioscrobbler.com/2.0/");
        lastFmUrl.search = new URLSearchParams({
            method: "user.getrecenttracks",
            user: username,
            api_key: apiKey,
            format: "json",
            limit: "1",
        }).toString();

        fetch(lastFmUrl.toString(), { signal: controller.signal })
            .then((response) => response.json())
            .then((data) => {
                const track: LastFmTrack | undefined = data?.recenttracks?.track?.[0];

                if (!track) {
                    return;
                }

                setListeningTrack({
                    title: track.name,
                    artist: track.artist?.["#text"] || "Unknown artist",
                    album: track.album?.["#text"] || "Recent track",
                    cover: getLargestImage(track),
                    isNowPlaying: track["@attr"]?.nowplaying === "true",
                });
            })
            .catch((error) => {
                if (error.name !== "AbortError") {
                    console.error("Unable to load Last.fm listening data", error);
                }
            });

        return () => controller.abort();
    }, []);

    return (
        <div className="music-container" id="music">
            <h1>Music</h1>
            <p>
                Music is the most treasured part of my life. It's primarily the stream on how I get creative. Ever since high school,
                I have been deeply interested in discovering new music from a wild range of artists, where I used to do a project where
                I tried to listen to a new album every day for around 3-4 years, and it was amazing, Below are music recommendations I 
                have for you, where I believed it has defined who I am.
            </p>

            <section className="listening-section" aria-labelledby="listening-heading">
                <div>
                    <p className="eyebrow">On repeat</p>
                    <h2 id="listening-heading">What I am currently listening to right now</h2>
                    <p className="listening-copy">
                    If you also listen to this song, maybe you and I are more alike than you think!
                    </p>
                </div>

                <div className="listening-player" aria-live="polite">
                    <div className="cd-shell">
                        <div className="spinning-cd">
                            {listeningTrack.cover ? (
                                <img src={listeningTrack.cover} alt={`${listeningTrack.album} cover`} />
                            ) : (
                                <span>♪</span>
                            )}
                        </div>
                    </div>
                    <div className="track-details">
                        <span className={listeningTrack.isNowPlaying ? "status status-live" : "status"}>
                            {listeningTrack.isNowPlaying ? "Now playing" : "Last played"}
                        </span>
                        <h3>{listeningTrack.title}</h3>
                        <p>{listeningTrack.artist}</p>
                        <p className="album-name">{listeningTrack.album}</p>
                    </div>
                </div>
            </section>

            <section className="favorite-albums" aria-labelledby="favorite-albums-heading">
                <div className="section-heading">
                    <p className="eyebrow">Shelf picks</p>
                    <h2 id="favorite-albums-heading">Four favourite albums</h2>
                </div>

                <div className="albums-grid">
                    {favoriteAlbums.map((album) => {
                        const isSelected = selectedAlbum === album.title;

                        return (
                            <button
                                className={`album-card ${isSelected ? "is-selected" : ""}`}
                                key={album.title}
                                onClick={() => setSelectedAlbum(isSelected ? null : album.title)}
                                style={{ "--album-accent": album.accent } as React.CSSProperties}
                                type="button"
                                aria-expanded={isSelected}
                            >
                                <span className="album-art" aria-hidden="true">
                                    <span className="album-art-title">{album.title}</span>
                                </span>
                                <span className="album-info">
                                    <span className="album-title">{album.title}</span>
                                    <span className="album-artist">{album.artist}</span>
                                </span>
                                <span className="album-thoughts">
                                    <span className="back-label">Back cover notes</span>
                                    {album.thoughts}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}

export default Music;
