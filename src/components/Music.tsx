import React, { useEffect, useState } from "react";
import '../assets/styles/Music.scss';
import { useContent } from '../content/ContentProvider';

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

type LastFmTrackInfo = {
    track?: {
        album?: {
            image?: LastFmImage[];
        };
    };
};

type ListeningTrack = {
    title: string;
    artist: string;
    album: string;
    cover: string;
    isNowPlaying: boolean;
};

type LastFmWeeklyTrack = {
    name: string;
    artist?: {
        "#text"?: string;
    };
    playcount?: string;
};

type TopTrack = {
    title: string;
    artist: string;
    playCount: number;
    cover: string;
};

const fallbackTrack: ListeningTrack = {
    title: "Currently listening placeholder",
    artist: "Last.fm ready",
    album: "Connect REACT_APP_LASTFM_USERNAME and REACT_APP_LASTFM_API_KEY",
    cover: "",
    isNowPlaying: false,
};

const secondsPerDay = 24 * 60 * 60;

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
    const { content, image } = useContent();
    const { music } = content;
    const favoriteAlbums = music.favorites;
    const recommendedAlbums = music.recommendations;
    const lastFmUsername = music.lastFm.username.trim();
    const chartDays = Number.isInteger(music.lastFm.chartDays) && music.lastFm.chartDays > 0
        ? Math.min(music.lastFm.chartDays, 365) : 90;
    const topTracksLimit = Number.isInteger(music.lastFm.topTracksLimit) && music.lastFm.topTracksLimit > 0
        ? Math.min(music.lastFm.topTracksLimit, 20) : 5;
    const lastFmApiKey = process.env.REACT_APP_LASTFM_API_KEY;
    const [selectedAlbum, setSelectedAlbum] = useState<string | null>(favoriteAlbums[0]?.title ?? null);
    const [listeningTrack, setListeningTrack] = useState<ListeningTrack>(fallbackTrack);
    const [topTracks, setTopTracks] = useState<TopTrack[]>([]);
    const [topTracksMessage, setTopTracksMessage] = useState<string>("Loading your 90-day chart...");
    const [recommendedCovers, setRecommendedCovers] = useState<Record<string, string>>({});

    useEffect(() => {
        setSelectedAlbum((current) => favoriteAlbums.some((album) => album.title === current) ? current : favoriteAlbums[0]?.title ?? null);
    }, [favoriteAlbums]);

    useEffect(() => {
        if (!lastFmUsername || !lastFmApiKey) {
            setListeningTrack(fallbackTrack);
            return;
        }

        const controller = new AbortController();
        setListeningTrack(fallbackTrack);
        const lastFmUrl = buildLastFmUrl({
            method: "user.getrecenttracks",
            user: lastFmUsername,
            api_key: lastFmApiKey,
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
    }, [lastFmUsername, lastFmApiKey]);


    useEffect(() => {
        if (!lastFmUsername || !lastFmApiKey) {
            setTopTracks([]);
            setTopTracksMessage("Connect Last.fm to see your chart.");
            return;
        }

        const controller = new AbortController();
        setTopTracks([]);
        setTopTracksMessage(`Loading your ${chartDays}-day chart...`);
        const now = Math.floor(Date.now() / 1000);
        const lastFmUrl = buildLastFmUrl({
            method: "user.getweeklytrackchart",
            user: lastFmUsername,
            api_key: lastFmApiKey,
            from: String(now - chartDays * secondsPerDay),
            to: String(now),
        });

        fetch(lastFmUrl, { signal: controller.signal })
            .then((response) => response.json())
            .then((data) => {
                const tracks: LastFmWeeklyTrack[] = data?.weeklytrackchart?.track || [];
                const normalizedTracks = tracks
                    .map((track) => ({
                        title: track.name,
                        artist: track.artist?.["#text"] || "Unknown artist",
                        playCount: Number(track.playcount || 0),
                        cover: "",
                    }))
                    .filter((track) => track.title && track.playCount > 0)
                    .sort((trackA, trackB) => trackB.playCount - trackA.playCount)
                    .slice(0, topTracksLimit);

                if (!normalizedTracks.length) {
                    setTopTracks([]);
                    setTopTracksMessage(`No scrobbles found in the past ${chartDays} days.`);
                    return;
                }

                return Promise.all(
                    normalizedTracks.map((track) => {
                        const trackInfoUrl = buildLastFmUrl({
                            method: "track.getInfo",
                            artist: track.artist,
                            track: track.title,
                            api_key: lastFmApiKey,
                            autocorrect: "1",
                        });

                        return fetch(trackInfoUrl, { signal: controller.signal })
                            .then((response) => response.json())
                            .then((trackInfo: LastFmTrackInfo) => ({
                                ...track,
                                cover: getLargestImage(trackInfo.track?.album?.image),
                            }))
                            .catch((error) => {
                                if (error.name === "AbortError") {
                                    throw error;
                                }

                                console.error(`Unable to load Last.fm cover for ${track.title}`, error);

                                return track;
                            });
                    })
                ).then((tracksWithCovers) => {
                    setTopTracks(tracksWithCovers);
                    setTopTracksMessage("");
                });
            })
            .catch((error) => {
                if (error.name !== "AbortError") {
                    setTopTracksMessage(`Unable to load your ${chartDays}-day chart right now.`);
                    console.error("Unable to load Last.fm top tracks", error);
                }
            });

        return () => controller.abort();
    }, [lastFmUsername, lastFmApiKey, chartDays, topTracksLimit]);

    useEffect(() => {
        if (!lastFmApiKey) {
            return;
        }

        const controller = new AbortController();

        Promise.all(
            recommendedAlbums.map((album) => {
                const lastFmUrl = buildLastFmUrl({
                    method: "album.getinfo",
                    artist: album.artist,
                    album: album.title,
                    api_key: lastFmApiKey,
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
    }, [recommendedAlbums, lastFmApiKey]);

    return (
        <div className="music-container" id="music">
            <h1>{music.heading}</h1>

            <div className="music-intro-grid">
                <section className="music-blurb-card" aria-labelledby="music-blurb-heading">
                    <p className="eyebrow">{music.blurbEyebrow}</p>
                    <h2 id="music-blurb-heading">{music.blurbHeading}</h2>
                    <p>{music.blurb}</p>
                </section>

                <section className="listening-section" aria-labelledby="listening-heading">
                    <div>
                        <p className="eyebrow">{music.listeningEyebrow}</p>
                        <h2 id="listening-heading">{music.listeningHeading}</h2>
                        <p className="listening-copy">{music.listeningCopy}</p>
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

                <section className="top-tracks-card" aria-labelledby="top-tracks-heading">
                    <div className="top-tracks-heading">
                        <div>
                            <p className="eyebrow">{music.topTracksEyebrow}</p>
                            <h2 id="top-tracks-heading">{(music.topTracksHeading || 'Most played in the past {days} days').replace(/\{days\}/g, String(chartDays))}</h2>
                        </div>
                        <span className="top-tracks-badge">Top {topTracksLimit}</span>
                    </div>

                    {topTracks.length ? (
                        <ol className="top-tracks-list" aria-live="polite">
                            {topTracks.map((track) => (
                                <li className="top-track-item" key={`${track.title}-${track.artist}`}>
                                    <span className="top-track-cover">
                                        {track.cover ? (
                                            <img src={track.cover} alt={`${track.title} cover`} loading="lazy" />
                                        ) : (
                                            <span aria-hidden="true">♪</span>
                                        )}
                                    </span>
                                    <span className="top-track-copy">
                                        <span className="top-track-title">{track.title}</span>
                                        <span className="top-track-artist">{track.artist}</span>
                                    </span>
                                    <span className="top-track-plays">
                                        {track.playCount}
                                        <span>plays</span>
                                    </span>
                                </li>
                            ))}
                        </ol>
                    ) : (
                        <p className="top-tracks-message" aria-live="polite">{topTracksMessage}</p>
                    )}
                </section>
            </div>

            <section className="favorite-albums" aria-labelledby="favorite-albums-heading">
                <div className="section-heading">
                    <p className="eyebrow">{music.favoritesEyebrow}</p>
                    <h2 id="favorite-albums-heading">{music.favoritesHeading}</h2>
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
                                    <img src={image(album.cover)} alt={`${album.title} album cover`} />
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
                        <p className="eyebrow">{music.recommendationsEyebrow}</p>
                        <h2 id="recommended-albums-heading">{music.recommendationsHeading}</h2>
                    </div>

                </div>

                <div className="recommendations-grid">
                    {recommendedAlbums.map((album) => {
                        const cover = album.cover ? image(album.cover) : recommendedCovers[album.title];

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
