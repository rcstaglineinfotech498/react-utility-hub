import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Film, Star } from "lucide-react";
import { ToolFrame } from "../../components/ToolFrame";
import { Card, ErrorMessage, Loader } from "../../components/UI";
import { apiConfig, movieApi } from "../../services/api";

export default function MovieDetails() {
  const { imdbID } = useParams();
  const location = useLocation();
  const initialMovie =
    location.state?.movie?.imdbID === imdbID ? location.state.movie : null;
  const [movie, setMovie] = useState(initialMovie);
  const [status, setStatus] = useState(initialMovie ? "success" : "loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    if (initialMovie) {
      setMovie(initialMovie);
      setStatus("success");
      return () => {
        active = false;
      };
    }

    setMovie(null);
    setStatus("loading");
    if (!apiConfig.movieKey) {
      setErrorMessage("Add your OMDb API key to view movie details.");
      setStatus("error");
      return () => {
        active = false;
      };
    }

    movieApi
      .get("/", {
        params: { apikey: apiConfig.movieKey, i: imdbID, plot: "full" },
      })
      .then(({ data }) => {
        if (data.Response === "False") {
          throw new Error(data.Error || "Movie details are unavailable.");
        }
        if (active) {
          setMovie(data);
          setStatus("success");
        }
      })
      .catch((error) => {
        if (active) {
          setErrorMessage(error.message || "We couldn't load this movie.");
          setStatus("error");
        }
      });

    return () => {
      active = false;
    };
  }, [imdbID, initialMovie]);

  return (
    <ToolFrame
      eyebrow="Movie details"
      title={movie?.Title || "Movie details"}
      description={movie?.Year || "Explore the film, cast, and credits."}
      toolId="movies"
    >
      <Card className="max-w-1000">
        <Link
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-ink hover:underline"
          to="/movies"
          state={{ search: location.state?.search }}
        >
          <ArrowLeft size={16} /> Back to search
        </Link>
        {status === "loading" && <Loader text="Loading movie details..." />}
        {status === "error" && <ErrorMessage>{errorMessage}</ErrorMessage>}
        {movie && status === "success" && (
          <div className="grid gap-5 sm:grid-cols-[220px_1fr]">
            {movie.Poster && movie.Poster !== "N/A" ? (
              <img
                className="aspect-2/3 w-full rounded-md bg-[#efede8] object-contain sm:max-w-[220px]"
                src={movie.Poster}
                alt={`${movie.Title} poster`}
              />
            ) : (
              <div className="grid aspect-2/3 w-full place-items-center rounded-md bg-[#efede8] text-[#1d2421] sm:max-w-[220px]">
                <Film size={36} />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-semibold">{movie.Title}</h2>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays size={14} /> {movie.Year || "Year unknown"}
                </span>
                <span className="inline-flex items-center gap-1">
                  < Star size={14} />
                  {movie.imdbRating && movie.imdbRating !== "N/A"
                    ? `${movie.imdbRating}/10 IMDb`
                    : "Rating unavailable"}
                </span>
                {movie.Runtime && movie.Runtime !== "N/A" && (
                  <span>{movie.Runtime}</span>
                )}
                {movie.Rated && movie.Rated !== "N/A" && (
                  <span>{movie.Rated}</span>
                )}
              </div>
              <p className="mt-4 text-sm leading-6">
                {movie.Plot && movie.Plot !== "N/A"
                  ? movie.Plot
                  : "No description is available for this movie."}
              </p>
              <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                {[
                  ["Genre", movie.Genre],
                  ["Director", movie.Director],
                  ["Writers", movie.Writer],
                  ["Cast", movie.Actors],
                  ["Released", movie.Released],
                  ["Awards", movie.Awards],
                  ["Language", movie.Language],
                  ["Country", movie.Country],
                ]
                  .filter(([, value]) => value && value !== "N/A")
                  .map(([label, value]) => (
                    <div key={label}>
                      <dt className="font-semibold">{label}</dt>
                      <dd className="mt-0.5 text-muted">{value}</dd>
                    </div>
                  ))}
              </dl>
            </div>
          </div>
        )}
      </Card>
    </ToolFrame>
  );
}
