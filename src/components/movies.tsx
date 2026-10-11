import React, { useEffect, useState } from "react";
import "../assets/styles/movies.scss";
import { useContent } from '../content/ContentProvider';

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
    title?: string;
    poster_path?: string;
    release_date?: string;
    credits?: {
        crew?: Array<{
            job?: string;
            name?: string;
        }>;
    };
};

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
    const { content, image } = useContent();
    const favoriteMovies = content.movies.favorites;
    const tmdbShelfMovies: TmdbShelfMovieConfig[] = content.movies.tmdbShelf;
    const [selectedMovieTitle, setSelectedMovieTitle] = useState(favoriteMovies[0]?.title ?? '');
    const selectedMovie = favoriteMovies.find((movie) => movie.title === selectedMovieTitle) ?? favoriteMovies[0];
    const [isFlipped, setIsFlipped] = useState(false);
    const [shelfMovies, setShelfMovies] = useState<ShelfMovie[]>(tmdbShelfMovies);
    const [selectedShelfMovieId, setSelectedShelfMovieId] = useState<number | null>(tmdbShelfMovies[0]?.tmdbId ?? null);
    const tmdbApiKey = process.env.REACT_APP_TMDB_API_KEY;

    useEffect(() => {
        setShelfMovies(tmdbShelfMovies);
        setSelectedShelfMovieId((current) => tmdbShelfMovies.some((movie) => movie.tmdbId === current)
            ? current : tmdbShelfMovies[0]?.tmdbId ?? null);

        if (!tmdbApiKey) {
            return;
        }

        const controller = new AbortController();

        const fetchShelfMovies = async () => {
            const movieDetails = await Promise.all(
                tmdbShelfMovies.map(async (movie) => {
                    try {
                        const response = await fetch(
                            `https://api.themoviedb.org/3/movie/${movie.tmdbId}?api_key=${encodeURIComponent(tmdbApiKey)}&append_to_response=credits`,
                            { signal: controller.signal }
                        );

                        if (!response.ok) return movie;

                        const data: TmdbMovieResponse = await response.json();
                        const director = data.credits?.crew
                            ?.filter((crewMember) => crewMember.job === "Director")
                            .map((crewMember) => crewMember.name)
                            .filter(Boolean)
                            .join(", ");

                        return {
                            ...movie,
                            title: data.title || movie.title,
                            posterPath: data.poster_path,
                            releaseDate: data.release_date,
                            director: director || undefined,
                        };
                    } catch (error) {
                        if (controller.signal.aborted) throw error;
                        console.error(`Unable to load TMDB movie ${movie.tmdbId}`, error);
                        return movie;
                    }
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
    }, [tmdbApiKey, tmdbShelfMovies]);

    const selectedShelfMovie = shelfMovies.find((movie) => movie.tmdbId === selectedShelfMovieId) ?? shelfMovies[0];

    const handleSelectMovie = (movie: (typeof favoriteMovies)[number]) => {
        setSelectedMovieTitle(movie.title);
        setIsFlipped(false);
    };

    const handleFlip = () => {
        setIsFlipped((currentFlipState) => !currentFlipState);
    };

    const selectedShelfPoster = selectedShelfMovie?.posterPath ? `${tmdbImageBaseUrl}${selectedShelfMovie.posterPath}` : undefined;

    return (
        <section className="movies-container" id="movies" aria-labelledby="movies-heading">
            <div className="movies-copy">
                <p className="eyebrow">{content.movies.eyebrow}</p>
                <h1 id="movies-heading">{content.movies.heading}</h1>
                <p>{content.movies.intro}</p>
            </div>

            <div className="movie-rental-layout">
                <div className="movie-shelf" aria-label="Favourite movie shelf">
                    {favoriteMovies.map((movie) => {
                        const isSelected = selectedMovie?.title === movie.title;

                        return (
                            <button
                                className={`movie-shelf-card ${isSelected ? "is-selected" : ""}`}
                                key={movie.title}
                                onClick={() => handleSelectMovie(movie)}
                                style={{
                                    "--movie-spine": movie.spine,
                                    "--movie-poster": `url(${image(movie.poster)})`,
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

                {selectedMovie && <div className="movie-detail-panel" aria-live="polite">
                    <button
                        className={`movie-case ${isFlipped ? "is-flipped" : ""}`}
                        onClick={handleFlip}
                        type="button"
                        aria-label={`Flip ${selectedMovie.title} case`}
                    >
                        <span className="movie-case-inner">
                            <span className="movie-case-face movie-case-front">
                                <img src={image(selectedMovie.poster)} alt={`${selectedMovie.title} poster`} />
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
                </div>}
            </div>

            {selectedShelfMovie && <div className="dvd-rack-layout" aria-label="TMDB DVD shelf">
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
                                            "--dvd-tilt": `${movie.tilt ?? 0}deg`,
                                            "--dvd-offset": `${movie.offset ?? 0}px`,
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
            </div>}
        </section>
    );
}

export default Movies;
