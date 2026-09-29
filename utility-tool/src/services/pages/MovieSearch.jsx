import { useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Film,
  Search,
  Star,
  X,
} from "lucide-react";
import { ToolFrame } from "../../components/ToolFrame";
import {
  Button,
  Card,
  EmptyState,
  ErrorMessage,
  Input,
  Loader,
} from "../../components/UI";
import { apiConfig, movieApi } from "../../services/api";

const PAGE_SIZE = 10;

export default function MovieSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const searchMovies = async (searchTerm, requestedPage = 1) => {
    if (!apiConfig.movieKey) {
      setErrorMessage("Add your OMDb API key to search movies.");
      setStatus("error");
      return;
    }

    setSelectedMovie(null);
    setResults([]);
    setPage(requestedPage);
    setStatus("loading");
    try {
      const { data } = await movieApi.get("/", {
        params: {
          apikey: apiConfig.movieKey,
          s: searchTerm,
          type: "movie",
          page: requestedPage,
        },
      });

      if (data.Response === "False") {
        if (data.Error?.toLowerCase().includes("movie not found")) {
          setResults([]);
          setTotalResults(0);
          setStatus("success");
          return;
        }
        throw new Error(data.Error || "The movie service returned an error.");
      }

      const detailedResults = await Promise.all(
        (data.Search || []).map(async (movie) => {
          try {
            const { data: details } = await movieApi.get("/", {
              params: {
                apikey: apiConfig.movieKey,
                i: movie.imdbID,
                plot: "short",
              },
            });
            return details.Response === "False" ? movie : details;
          } catch {
            return movie;
          }
        }),
      );

      setResults(detailedResults);
      setTotalResults(Number(data.totalResults) || 0);
      setStatus("success");
    } catch (error) {
      const apiError =
        error.response?.data?.Error ||
        error.message ||
        "We couldn't reach the movie service right now.";
      setErrorMessage(
        /invalid api key/i.test(apiError)
          ? "OMDb rejected the configured key. Add a valid free key from omdbapi.com/apikey.aspx then restart the app."
          : apiError,
      );
      setStatus("error");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const searchTerm = query.trim();
    if (!searchTerm) {
      setResults([]);
      setSelectedMovie(null);
      setTotalResults(0);
      setStatus("empty-query");
      return;
    }
    searchMovies(searchTerm);
  };

  const totalPages = Math.ceil(totalResults / PAGE_SIZE);

  return (
    <ToolFrame
      eyebrow="Find something great Movie"
      title="Movies Search"
      description="Search the catalog and find your next favorite."
      toolId="movies"
    >
      <Card className="max-w-1000">
        <form
          className="flex flex-col gap-2.5 sm:flex-row"
          onSubmit={handleSubmit}
        >
          <Input
            placeholder="Try a title, actor, or year..."
            aria-label="Search movies by title"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Button
            type="submit"
            disabled={status === "loading"}
            className="bg-amber-50 text-black border-1"
          >
            <Search size={17} /> Search
          </Button>
        </form>
        {status === "loading" && <Loader text="Searching the catalog..." />}
        {status === "error" && <ErrorMessage>{errorMessage}</ErrorMessage>}
        {status === "empty-query" && (
          <EmptyState icon={Search} title="Enter a movie title">
            Type a title above to search the movie catalog.
          </EmptyState>
        )}
        {status === "idle" && (
          <EmptyState icon={Search} title="What do you want to watch?">
            Search by title to see matching films.
          </EmptyState>
        )}
        {status === "success" && !results.length && (
          <EmptyState title="No matches found">
            Try a different title or a broader search.
          </EmptyState>
        )}
        {selectedMovie && (
          <section
            className="mt-6 rounded-lg border border-line bg-surface p-4 sm:p-5"
            aria-label="Movie details"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold">Movie details</h2>
              <Button
                type="button"
                variant="secondary"
                className="min-h-9! px-2.5!  bg-amber-50 text-black"
                aria-label="Close movie details"
                onClick={() => setSelectedMovie(null)}
              >
                <X size={17} />
              </Button>
            </div>
            <div className="grid gap-5 sm:grid-cols-[180px_1fr]">
              {selectedMovie.Poster && selectedMovie.Poster !== "N/A" ? (
                <img
                  className="aspect-2/3 w-full rounded-md bg-[#efede8] object-contain sm:max-w-[180px]"
                  src={selectedMovie.Poster}
                  alt={`${selectedMovie.Title} poster`}
                />
              ) : (
                <div className="grid aspect-2/3 w-full place-items-center rounded-md bg-[#efede8] text-[#1d2421] sm:max-w-[180px]">
                  <Film size={32} />
                </div>
              )}
              <div>
                <h3 className="text-2xl font-semibold">
                  {selectedMovie.Title}
                </h3>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-m text-muted">
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays size={14} />{" "}
                    {selectedMovie.Year || "Year unknown"}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Star size={14} />{" "}
                    {selectedMovie.imdbRating &&
                    selectedMovie.imdbRating !== "N/A"
                      ? `${selectedMovie.imdbRating}/10 IMDb`
                      : "Rating unavailable"}
                  </span>
                  {selectedMovie.Runtime && selectedMovie.Runtime !== "N/A" && (
                    <span>{selectedMovie.Runtime}</span>
                  )}
                  {selectedMovie.Rated && selectedMovie.Rated !== "N/A" && (
                    <span>{selectedMovie.Rated}</span>
                  )}
                </div>
                <p className="mt-4 text-m leading-6">
                  {selectedMovie.Plot && selectedMovie.Plot !== "N/A"
                    ? selectedMovie.Plot
                    : "No description is available for this movie."}
                </p>
                <dl className="mt-4 grid gap-2 text-m sm:grid-cols-2">
                  {[
                    ["Genre", selectedMovie.Genre],
                    ["Director", selectedMovie.Director],
                    ["Cast", selectedMovie.Actors],
                    ["Released", selectedMovie.Released],
                    ["Awards", selectedMovie.Awards],
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
          </section>
        )}
        {results.length > 0 && (
          <>
            <div className="mt-[27px] grid grid-cols-1 gap-3 sm:grid-cols-4 sm:gap-[18px]">
              {results.map((movie) => (
                <button
                  className="overflow-hidden rounded-lg border border-line bg-surface text-left transition hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  key={movie.imdbID}
                  type="button"
                  aria-label={`Show details for ${movie.Title}`}
                  aria-pressed={selectedMovie?.imdbID === movie.imdbID}
                  onClick={() => setSelectedMovie(movie)}
                >
                  {movie.Poster && movie.Poster !== "N/A" ? (
                    <img
                      className="aspect-2/3 w-full bg-[#efede8] object-contain"
                      src={movie.Poster}
                      alt={`${movie.Title} poster`}
                      loading="lazy"
                    />
                  ) : (
                    <div className="grid aspect-2/3 w-full place-items-center bg-[#efede8] text-[#1d2421]">
                      <Film size={28} />
                    </div>
                  )}
                  <span className="block p-3">
                    <strong className="block text-xs">{movie.Title}</strong>
                    <span className="mt-1.5 flex items-center justify-between gap-2 text-[10px] text-muted">
                      <span>{movie.Year || "Year unknown"}</span>
                      <span className="inline-flex items-center gap-1">
                        <Star size={12} />{" "}
                        {movie.imdbRating && movie.imdbRating !== "N/A"
                          ? movie.imdbRating
                          : "N/A"}
                      </span>
                    </span>
                    <span className="mt-2 line-clamp-3 block text-[11px] leading-4 text-muted">
                      {movie.Plot && movie.Plot !== "N/A"
                        ? movie.Plot
                        : "Description unavailable."}
                    </span>
                  </span>
                </button>
              ))}
            </div>
            {totalPages > 1 && (
              <nav
                className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4"
                aria-label="Movie search pages"
              >
                <Button
                  type="button"
                  variant="secondary"
                  className="bg-amber-50 text-black"
                  disabled={page <= 1 || status === "loading"}
                  onClick={() => searchMovies(query.trim(), page - 1)}
                >
                  <ChevronLeft size={16} /> Previous
                </Button>
                <span className="text-xs text-muted">
                  Page {page} of {totalPages}
                </span>
                <Button
                  type="button"
                  variant="secondary"
                  className="bg-amber-50 text-black"
                  disabled={page >= totalPages || status === "loading"}
                  onClick={() => searchMovies(query.trim(), page + 1)}
                >
                  Next <ChevronRight size={16} />
                </Button>
              </nav>
            )}
          </>
        )}
      </Card>
    </ToolFrame>
  );
}
