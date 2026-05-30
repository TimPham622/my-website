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
        mood: "Tiny electronic heartbreak with massive hooks.",
        spotifyUrl: "https://open.spotify.com/search/album%3AGive%20Up%20artist%3AThe%20Postal%20Service/albums",
    },
    {
        title: "Discovery",
        artist: "Daft Punk",
        mood: "Glossy, joyful dance music that still sounds futuristic.",
        spotifyUrl: "https://open.spotify.com/album/2noRn2Aes5aoNVsU6iWThc",
    },
    {
        title: "Modern Vampires of the City",
        artist: "Vampire Weekend",
        mood: "Brainy indie pop with existential Sunday-afternoon energy.",
        spotifyUrl: "https://open.spotify.com/album/2Qi2SySN2ePZwMLDSv9Krn",
    },
    {
        title: "To See the Next Part of the Dream",
        artist: "Parannoul",
        mood: "Blown-out bedroom shoegaze for big feelings.",
        spotifyUrl: "https://open.spotify.com/search/album%3ATo%20See%20the%20Next%20Part%20of%20the%20Dream%20artist%3AParannoul/albums",
    },
    {
        title: "A Brief Inquiry Into Online Relationships",
        artist: "The 1975",
        mood: "Messy internet-age pop maximalism with a soft heart.",
        spotifyUrl: "https://open.spotify.com/search/album%3AA%20Brief%20Inquiry%20Into%20Online%20Relationships%20artist%3AThe%201975/albums",
    },
    {
        title: "Sound of Silver",
        artist: "LCD Soundsystem",
        mood: "Dance-punk catharsis for staying up too late.",
        spotifyUrl: "https://open.spotify.com/album/1R8kkopLT4IAxzMMkjic6X",
    },
    {
        title: "American Football",
        artist: "American Football",
        mood: "Twinkly emo that turns quiet memories cinematic.",
        spotifyUrl: "https://open.spotify.com/search/album%3AAmerican%20Football%20artist%3AAmerican%20Football/albums",
    },
    {
        title: "Take Care",
        artist: "Drake",
        mood: "Nocturnal rap and R&B with winter-city drama.",
        spotifyUrl: "https://open.spotify.com/search/album%3ATake%20Care%20artist%3ADrake/albums",
    },
    {
        title: "For Lovers",
        artist: "Lamp",
        mood: "Soft, breezy Japanese pop for a golden-hour walk.",
        spotifyUrl: "https://open.spotify.com/search/album%3AFor%20Lovers%20artist%3ALamp/albums",
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
                    <p>
                        Smaller shelf notes for records I would hand to someone after the favourites above. Covers are pulled from Last.fm when the API key is available, so the page avoids shipping ten extra image assets.
                    </p>
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
