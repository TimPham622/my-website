import React, { useState } from "react";
import "../assets/styles/movies.scss";

type Movie = {
    title: string;
    year: string;
    format: string;
    palette: string;
    spine: string;
    placeholderPoster: string;
    thoughts: string;
};

const favoriteMovies: Movie[] = [
    {
        title: "The Social Network",
        year: "2010",
        format: "DVD",
        palette: "linear-gradient(135deg, #0f172a, #2563eb)",
        spine: "#2563eb",
        placeholderPoster: "SN",
        thoughts: "Placeholder thoughts: sharp, restless, and endlessly rewatchable because every scene feels like a perfect argument.",
    },
    {
        title: "Whisper of the Heart",
        year: "1995",
        format: "VHS",
        palette: "linear-gradient(135deg, #14532d, #fbbf24)",
        spine: "#16a34a",
        placeholderPoster: "WH",
        thoughts: "Placeholder thoughts: a warm reminder to chase craft seriously while still leaving room for wonder.",
    },
    {
        title: "Your Name",
        year: "2016",
        format: "Blu-ray",
        palette: "linear-gradient(135deg, #312e81, #fb7185)",
        spine: "#7c3aed",
        placeholderPoster: "YN",
        thoughts: "Placeholder thoughts: romantic, cosmic, and emotionally huge in the way only a perfect sky can feel.",
    },
    {
        title: "Ocean's Eleven",
        year: "2001",
        format: "DVD",
        palette: "linear-gradient(135deg, #7f1d1d, #f59e0b)",
        spine: "#dc2626",
        placeholderPoster: "OE",
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
                                style={{ "--movie-spine": movie.spine } as React.CSSProperties}
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
                        style={{ "--movie-poster": selectedMovie.palette } as React.CSSProperties}
                        type="button"
                        aria-label={`Flip ${selectedMovie.title} case`}
                    >
                        <span className="movie-case-inner">
                            <span className="movie-case-face movie-case-front">
                                <span className="movie-poster-art">{selectedMovie.placeholderPoster}</span>
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
