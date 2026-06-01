import React, { useEffect, useMemo, useState } from "react";
import "../assets/styles/movies.scss";
import oceansElevenPoster from "../assets/images/oceans-eleven-poster.jpg";
import socialNetworkPoster from "../assets/images/the-social-network-poster.jpg";
import whisperOfTheHeartPoster from "../assets/images/whisper-of-the-heart-poster.jpg";
import yourNamePoster from "../assets/images/your-name-poster.jpg";

type FavoriteMovie = {
    title: string;
    year: string;
    format: string;
    poster: string;
    spine: string;
    thoughts: string;
};

type TmdbShelfMovieConfig = {
    tmdbId: number;
    title: string;
    fallbackYear: string;
    spine: string;
    tilt: number;
    offset: number;
};

type ShelfMovie = TmdbShelfMovieConfig & {
    posterPath?: string;
    releaseDate?: string;
    director?: string;
};

type TmdbMovieResponse = {
    poster_path?: string;
    release_date?: string;
    credits?: {
        crew?: Array<{
            job?: string;
            name?: string;
        }>;
    };
};

const favoriteMovies: FavoriteMovie[] = [
    {
        title: "The Social Network",
        year: "2010",
        format: "DVD",
        poster: socialNetworkPoster,
        spine: "#2563eb",
        thoughts: "Placeholder thoughts: sharp, restless, and endlessly rewatchable because every scene feels like a perfect argument.",
    },
    {
        title: "Whisper of the Heart",
        year: "1995",
        format: "VHS",
        poster: whisperOfTheHeartPoster,
        spine: "#16a34a",
        thoughts: "Placeholder thoughts: a warm reminder to chase craft seriously while still leaving room for wonder.",
    },
    {
        title: "Your Name",
        year: "2016",
        format: "Blu-ray",
        poster: yourNamePoster,
        spine: "#7c3aed",
        thoughts: "Placeholder thoughts: romantic, cosmic, and emotionally huge in the way only a perfect sky can feel.",
    },
    {
        title: "Ocean's Eleven",
        year: "2001",
        format: "DVD",
        poster: oceansElevenPoster,
        spine: "#dc2626",
        thoughts: "Placeholder thoughts: pure confidence and charm, with the kind of ensemble energy that makes every rewatch easy.",
    },
];

const tmdbShelfMovies: TmdbShelfMovieConfig[] = [
    { tmdbId: 11544, title: "Lilo & Stitch", fallbackYear: "2002", spine: "#0ea5e9", tilt: -7, offset: 12 },
    { tmdbId: 406, title: "La Haine", fallbackYear: "1995", spine: "#111827", tilt: 5, offset: 0 },
    { tmdbId: 545611, title: "Everything Everywhere All at Once", fallbackYear: "2022", spine: "#9333ea", tilt: -3, offset: 18 },
    { tmdbId: 11104, title: "Chungking Express", fallbackYear: "1994", spine: "#f97316", tilt: 6, offset: 7 },
    { tmdbId: 8392, title: "My Neighbor Totoro", fallbackYear: "1988", spine: "#16a34a", tilt: -5, offset: 22 },
    { tmdbId: 84892, title: "The Perks of Being a Wallflower", fallbackYear: "2012", spine: "#facc15", tilt: 4, offset: 5 },
    { tmdbId: 146, title: "Crouching Tiger, Hidden Dragon", fallbackYear: "2000", spine: "#047857", tilt: -2, offset: 14 },
    { tmdbId: 2062, title: "Ratatouille", fallbackYear: "2007", spine: "#dc2626", tilt: 7, offset: 1 },
    { tmdbId: 391713, title: "Lady Bird", fallbackYear: "2017", spine: "#fb7185", tilt: -6, offset: 16 },
];

const tmdbImageBaseUrl = "https://image.tmdb.org/t/p/w500";

const getYearFromDate = (releaseDate?: string, fallbackYear?: string) => {
    if (!releaseDate) {
        return fallbackYear ?? "TBA";
    }

    return releaseDate.slice(0, 4);
};

const formatReleaseDate = (releaseDate?: string, fallbackYear?: string) => {
    if (!releaseDate) {
        return fallbackYear ?? "Release date coming soon";
    }

    return new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(`${releaseDate}T00:00:00`));
};

function Movies() {
    const [selectedMovie, setSelectedMovie] = useState<FavoriteMovie>(favoriteMovies[0]);
    const [isFlipped, setIsFlipped] = useState(false);
    const [shelfMovies, setShelfMovies] = useState<ShelfMovie[]>(tmdbShelfMovies);
    const [selectedShelfMovieId, setSelectedShelfMovieId] = useState(tmdbShelfMovies[0].tmdbId);
    const tmdbApiKey = process.env.REACT_APP_TMDB_API_KEY;

    useEffect(() => {
        if (!tmdbApiKey) {
            return;
        }

        const controller = new AbortController();

        const fetchShelfMovies = async () => {
            const movieDetails = await Promise.all(
                tmdbShelfMovies.map(async (movie) => {
                    const response = await fetch(
                        `https://api.themoviedb.org/3/movie/${movie.tmdbId}?api_key=${tmdbApiKey}&append_to_response=credits`,
                        { signal: controller.signal }
                    );

                    if (!response.ok) {
                        return movie;
                    }

                    const data: TmdbMovieResponse = await response.json();
                    const director = data.credits?.crew
                        ?.filter((crewMember) => crewMember.job === "Director")
                        .map((crewMember) => crewMember.name)
                        .filter(Boolean)
                        .join(", ");

                    return {
                        ...movie,
                        posterPath: data.poster_path,
                        releaseDate: data.release_date,
                        director: director || undefined,
                    };
                })
            );

            setShelfMovies(movieDetails);
        };

        fetchShelfMovies().catch((error) => {
            if (error.name !== "AbortError") {
                // Keep the hand-authored fallback shelf if TMDB is unavailable.
                console.error("Unable to load TMDB shelf", error);
            }
        });

        return () => controller.abort();
    }, [tmdbApiKey]);

    const selectedShelfMovie = useMemo(
        () => shelfMovies.find((movie) => movie.tmdbId === selectedShelfMovieId) ?? shelfMovies[0],
        [selectedShelfMovieId, shelfMovies]
    );

    const handleSelectMovie = (movie: FavoriteMovie) => {
        setSelectedMovie(movie);
        setIsFlipped(false);
    };

    const handleFlip = () => {
        setIsFlipped((currentFlipState) => !currentFlipState);
    };

    const selectedShelfPoster = selectedShelfMovie.posterPath ? `${tmdbImageBaseUrl}${selectedShelfMovie.posterPath}` : undefined;

    return (
        <section className="movies-container" id="movies" aria-labelledby="movies-heading">
            <div className="movies-copy">
                <p className="eyebrow">Rental shelf</p>
                <h1 id="movies-heading">Favourite movies</h1>
                <p>
                Movies have also defined my life, where I tackled a similar project where I watched a movie every 
                day for around 2-3 years. Here are my favourites!
                </p>
            </div>

            <div className="movie-rental-layout">
                <div className="movie-shelf" aria-label="Favourite movie shelf">
                    {favoriteMovies.map((movie) => {
                        const isSelected = selectedMovie.title === movie.title;

                        return (
                            <button
                                className={`movie-shelf-card ${isSelected ? "is-selected" : ""}`}
                                key={movie.title}
                                onClick={() => handleSelectMovie(movie)}
                                style={{
                                    "--movie-spine": movie.spine,
                                    "--movie-poster": `url(${movie.poster})`,
                                } as React.CSSProperties}
                                type="button"
                                aria-pressed={isSelected}
                            >
                                <span className="movie-spine-label">{movie.title}</span>
                                <span className="movie-format">{movie.format}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="movie-detail-panel" aria-live="polite">
                    <button
                        className={`movie-case ${isFlipped ? "is-flipped" : ""}`}
                        onClick={handleFlip}
                        type="button"
                        aria-label={`Flip ${selectedMovie.title} case`}
                    >
                        <span className="movie-case-inner">
                            <span className="movie-case-face movie-case-front">
                                <img src={selectedMovie.poster} alt={`${selectedMovie.title} poster`} />
                                <span className="movie-case-title">{selectedMovie.title}</span>
                                <span className="movie-case-meta">{selectedMovie.year} • {selectedMovie.format}</span>
                            </span>
                            <span className="movie-case-face movie-case-back">
                                <span className="movie-case-title">Thoughts</span>
                                <span className="movie-thoughts">{selectedMovie.thoughts}</span>
                                <span className="movie-flip-hint">Tap or click to flip back</span>
                            </span>
                        </span>
                    </button>
                    <p className="movie-flip-hint">Tap or click the case to flip it.</p>
                </div>
            </div>

            <div className="dvd-rack-layout" aria-label="TMDB DVD shelf">
                    <div className="dvd-stack">
                        {shelfMovies.map((movie) => {
                            const isSelected = selectedShelfMovie.tmdbId === movie.tmdbId;

                            return (
                                <button
                                    className={`dvd-spine ${isSelected ? "is-selected" : ""}`}
                                    key={movie.tmdbId}
                                    onClick={() => setSelectedShelfMovieId(movie.tmdbId)}
                                    style={
                                        {
                                            "--dvd-spine": movie.spine,
                                        } as React.CSSProperties
                                    }
                                    type="button"
                                    aria-pressed={isSelected}
                                >
                                    <span>{movie.title}</span>
                                    <small>{getYearFromDate(movie.releaseDate, movie.fallbackYear)}</small>
                                </button>
                            );
                        })}
                    </div>

                <aside className="dvd-side-panel" aria-live="polite">
                    <div className="dvd-poster-frame">
                        {selectedShelfPoster ? (
                            <img src={selectedShelfPoster} alt={`${selectedShelfMovie.title} poster`} />
                        ) : (
                            <span>{selectedShelfMovie.title}</span>
                        )}
                    </div>
                    <div className="dvd-panel-copy">
                        <h2>{selectedShelfMovie.title}</h2>
                        <dl>
                            <div>
                                <dt>Director</dt>
                                <dd>{selectedShelfMovie.director ?? "Loading from TMDB"}</dd>
                            </div>
                            <div>
                                <dt>Release date</dt>
                                <dd>{formatReleaseDate(selectedShelfMovie.releaseDate, selectedShelfMovie.fallbackYear)}</dd>
                            </div>
                        </dl>
                    </div>
                </aside>
            </div>
        </section>
    );
}

export default Movies;
