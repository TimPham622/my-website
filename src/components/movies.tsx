import React, { useState } from "react";
import "../assets/styles/movies.scss";
import oceansElevenPoster from "../assets/images/oceans-eleven-poster.jpg";
import socialNetworkPoster from "../assets/images/the-social-network-poster.jpg";
import whisperOfTheHeartPoster from "../assets/images/whisper-of-the-heart-poster.jpg";
import yourNamePoster from "../assets/images/your-name-poster.jpg";

type Movie = {
    title: string;
    year: string;
    format: string;
    poster: string;
    spine: string;
    thoughts: string;
};

const favoriteMovies: Movie[] = [
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

function Movies() {
    const [selectedMovie, setSelectedMovie] = useState<Movie>(favoriteMovies[0]);
    const [isFlipped, setIsFlipped] = useState(false);

    const handleSelectMovie = (movie: Movie) => {
        setSelectedMovie(movie);
        setIsFlipped(false);
    };

    const handleFlip = () => {
        setIsFlipped((currentFlipState) => !currentFlipState);
    };

    return (
        <section className="movies-container" id="movies" aria-labelledby="movies-heading">
            <div className="movies-copy">
                <p className="eyebrow">Rental shelf</p>
                <h1 id="movies-heading">Favourite movies</h1>
                <p>
                    A small rental-store shelf of films I keep coming back to. Pick a movie from the shelf to load it into the case,
                    then flip the case to read placeholder notes for now.
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
                                <span className="movie-rental-sticker">New arrival</span>
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
        </section>
    );
}

export default Movies;
