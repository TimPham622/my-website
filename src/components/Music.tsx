import React, { useEffect, useState } from "react";
import '../assets/styles/Music.scss';
import nurtureCover from '../assets/images/nurture-album-cover.png';
import redCover from '../assets/images/red-album-cover.jpg';
import timeNPlaceCover from '../assets/images/time-n-place-album-cover.png';
import melodramaCover from '../assets/images/melodrama-album-cover.jpg';

type Album = {
    title: string;
    artist: string;
    accent: string;
    cover: string;
    thoughts: string;
};

type RecommendedAlbum = {
    title: string;
    artist: string;
    mood: string;
    spotifyUrl: string;
};

type LastFmImage = {
    size: string;
    "#text": string;
};

type LastFmTrack = {
    name: string;
    artist: {
        "#text": string;
    };
    album?: {
        "#text": string;
    };
    image?: LastFmImage[];
    "@attr"?: {
        nowplaying?: string;
    };
};

type LastFmAlbum = {
    album?: {
        image?: LastFmImage[];
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
        cover: nurtureCover,
        thoughts: "Placeholder thoughts: this album feels like sunlight breaking through after a long storm.",
    },
    {
        title: "Red",
        artist: "Taylor Swift",
        accent: "#ac1d45",
        cover: redCover,
        thoughts: "Placeholder thoughts: a classic heart-on-sleeve record full of big feelings and sharper memories.",
    },
    {
        title: "Time 'n' Place",
        artist: "Kero Kero Bonito",
        accent: "#a135a5",
        cover: timeNPlaceCover,
        thoughts: "Placeholder thoughts: playful, bittersweet, and packed with sounds that make growing up feel surreal.",
    },
    {
        title: "Melodrama",
        artist: "Lorde",
        accent: "#0638bc",
        cover: melodramaCover,
        thoughts: "Placeholder thoughts: this is late-night pop drama with every emotion turned into neon.",
    },
];

const recommendedAlbums: RecommendedAlbum[] = [
    {
        title: "Give Up",
        artist: "The Postal Service",
        mood: "Glitchy electronic sounds, under a backdrop of rather pessimistic themes",
        spotifyUrl: "https://open.spotify.com/album/1BSwkKATGVCMgNuN8ve7mz",
    },
    {
        title: "Discovery",
        artist: "Daft Punk",
        mood: "Dance music perfection",
        spotifyUrl: "https://open.spotify.com/album/2noRn2Aes5aoNVsU6iWThc",
    },
    {
        title: "Modern Vampires of the City",
        artist: "Vampire Weekend",
        mood: "A fun indie pop album, with everything feeling studious and creative.",
        spotifyUrl: "https://open.spotify.com/album/2Qi2SySN2ePZwMLDSv9Krn",
    },
    {
        title: "To See the Next Part of the Dream",
        artist: "Parannoul",
        mood: "My favourite album cover, whilst having some hazy Korean-shoegaze sounds",
        spotifyUrl: "https://open.spotify.com/album/5IyHtkKQvafw7bQYFnx4FO",
    },
    {
        title: "A Brief Inquiry Into Online Relationships",
        artist: "The 1975",
        mood: "Pop maximalism",
        spotifyUrl: "https://open.spotify.com/album/6eeQNgCWx0t3vDPCYSxp7I",
    },
    {
        title: "Sound of Silver",
        artist: "LCD Soundsystem",
        mood: "Where are your friends tonight?",
        spotifyUrl: "https://open.spotify.com/album/1R8kkopLT4IAxzMMkjic6X",
    },
    {
        title: "American Football",
        artist: "American Football",
        mood: "An autumn album, with the most emo sounds",
        spotifyUrl: "https://open.spotify.com/album/70OkRXiiwdTCtZ9YiPBzPp",
    },
    {
        title: "Take Care",
        artist: "Drake",
        mood: "A gem of its time all while handling what fame is like",
        spotifyUrl: "https://open.spotify.com/album/6X1x82kppWZmDzlXXK3y3q",
    },
    {
        title: "For Lovers",
        artist: "Lamp",
        mood: "Simple and fun.",
        spotifyUrl: "https://open.spotify.com/album/0gwS2D9sukMLXNvleEnYr2",
    },
    {
        title: "Transatlanticism",
        artist: "Death Cab for Cutie",
        mood: "Long-distance longing stretched into a classic indie record.",
        spotifyUrl: "https://open.spotify.com/album/5XGQ4L4XsTI3uIZiAfeAum",
    },
];

const fallbackTrack: ListeningTrack = {
    title: "Currently listening placeholder",
    artist: "Last.fm ready",
    album: "Connect REACT_APP_LASTFM_USERNAME and REACT_APP_LASTFM_API_KEY",
    cover: "",
    isNowPlaying: false,
};

function getLargestImage(images?: LastFmImage[]) {
    return images?.slice().reverse().find((image) => image["#text"])?.["#text"] || "";
}

function buildLastFmUrl(params: Record<string, string>) {
    const lastFmUrl = new URL("https://ws.audioscrobbler.com/2.0/");
    lastFmUrl.search = new URLSearchParams({
        ...params,
        format: "json",
    }).toString();

    return lastFmUrl.toString();
}

function Music() {
    const [selectedAlbum, setSelectedAlbum] = useState<string | null>(favoriteAlbums[0].title);
    const [listeningTrack, setListeningTrack] = useState<ListeningTrack>(fallbackTrack);
    const [recommendedCovers, setRecommendedCovers] = useState<Record<string, string>>({});

    useEffect(() => {
        const username = process.env.REACT_APP_LASTFM_USERNAME;
        const apiKey = process.env.REACT_APP_LASTFM_API_KEY;

        if (!username || !apiKey) {
            return;
        }

        const controller = new AbortController();
        const lastFmUrl = buildLastFmUrl({
            method: "user.getrecenttracks",
            user: username,
            api_key: apiKey,
            limit: "1",
        });

        fetch(lastFmUrl, { signal: controller.signal })
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
                    cover: getLargestImage(track.image),
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

    useEffect(() => {
        const apiKey = process.env.REACT_APP_LASTFM_API_KEY;

        if (!apiKey) {
            return;
        }

        const controller = new AbortController();

        Promise.all(
            recommendedAlbums.map((album) => {
                const lastFmUrl = buildLastFmUrl({
                    method: "album.getinfo",
                    artist: album.artist,
                    album: album.title,
                    api_key: apiKey,
                    autocorrect: "1",
                });

                return fetch(lastFmUrl, { signal: controller.signal })
                    .then((response) => response.json())
                    .then((data: LastFmAlbum) => [album.title, getLargestImage(data.album?.image)] as const);
            })
        )
            .then((covers) => {
                setRecommendedCovers(
                    covers.reduce<Record<string, string>>((albumCovers, [title, cover]) => {
                        if (cover) {
                            albumCovers[title] = cover;
                        }

                        return albumCovers;
                    }, {})
                );
            })
            .catch((error) => {
                if (error.name !== "AbortError") {
                    console.error("Unable to load Last.fm album covers", error);
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
                                <span className="album-art">
                                    <img src={album.cover} alt={`${album.title} album cover`} />
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

            <section className="recommended-albums" aria-labelledby="recommended-albums-heading">
                <div className="section-heading recommended-heading">
                    <div>
                        <p className="eyebrow">Recommended listens</p>
                        <h2 id="recommended-albums-heading">Ten more albums to try</h2>
                    </div>

                </div>

                <div className="recommendations-grid">
                    {recommendedAlbums.map((album) => {
                        const cover = recommendedCovers[album.title];

                        return (
                            <a
                                className="recommendation-card"
                                href={album.spotifyUrl}
                                key={`${album.title}-${album.artist}`}
                                rel="noreferrer"
                                target="_blank"
                            >
                                <span className="recommendation-art" aria-hidden={!cover}>
                                    {cover ? (
                                        <img src={cover} alt={`${album.title} album cover`} loading="lazy" />
                                    ) : (
                                        <span>{album.title.charAt(0)}</span>
                                    )}
                                </span>
                                <span className="recommendation-copy">
                                    <span className="recommendation-title">{album.title}</span>
                                    <span className="recommendation-artist">{album.artist}</span>
                                    <span className="recommendation-mood">{album.mood}</span>
                                    <span className="spotify-link">Find on Spotify ↗</span>
                                </span>
                            </a>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}

export default Music;
