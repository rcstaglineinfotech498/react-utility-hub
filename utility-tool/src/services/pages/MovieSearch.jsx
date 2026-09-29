import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Film,
  Search,
  Star,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const savedSearch = location.state?.search;
  const [query, setQuery] = useState(savedSearch?.query || "");
  const [results, setResults] = useState(savedSearch?.results || []);
  const [page, setPage] = useState(savedSearch?.page || 1);
  const [totalResults, setTotalResults] = useState(savedSearch?.totalResults || 0);
  const [status, setStatus] = useState(savedSearch?.status || "idle");
  const [errorMessage, setErrorMessage] = useState("");

  const searchMovies = async (searchTerm, requestedPage = 1) => {
    if (!apiConfig.movieKey) {
      setErrorMessage("Add your OMDb API key to search movies.");
      setStatus("error");
      return;
    }

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
        {results.length > 0 && (
          <>
            <div className="mt-[27px] grid grid-cols-1 gap-3 sm:grid-cols-4 sm:gap-[18px]">
              {results.map((movie) => (
                <Link
                  className="block overflow-hidden rounded-lg border border-line bg-surface text-left transition hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  key={movie.imdbID}
                  to={`/movies/${movie.imdbID}`}
                  state={{
                    movie,
                    search: { query, results, page, totalResults, status },
                  }}
                  aria-label={`View details for ${movie.Title}`}
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
                </Link>
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
