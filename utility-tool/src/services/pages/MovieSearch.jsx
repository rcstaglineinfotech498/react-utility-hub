import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
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

export default function MovieSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle");
  const searchMovies = async (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    setStatus("loading");
    try {
      const { data } = await movieApi.get(
        `/?apikey=${apiConfig.movieKey}&s=${encodeURIComponent(query)}&type=movie`,
      );
      setResults(data.Response === "False" ? [] : data.Search || []);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };
  return (
    <ToolFrame
      eyebrow="Find something great"
      title="Movie Search"
      description="Search the catalog and find your next favorite."
      toolId="movies"
    >
      <Card>
        <form className="flex flex-col gap-2.5 sm:flex-row" onSubmit={searchMovies}>
          <Input
            placeholder="Try a title, actor, or year..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Button type="submit">
            <Search size={17} /> Search
          </Button>
        </form>
        {status === "loading" && <Loader text="Searching the catalog..." />}
        {status === "error" && (
          <ErrorMessage>
            We couldn't reach the movie service right now.
          </ErrorMessage>
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
          <div className="mt-[27px] grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-[18px]">
            {results.map((movie) => (
              <article className="overflow-hidden rounded-[10px] border border-line bg-surface" key={movie.imdbID}>
                {movie.Poster !== "N/A" ? (
                  <img className="h-[180px] w-full object-cover sm:h-[210px]" src={movie.Poster} alt="" />
                ) : (
                  <div className="grid h-[180px] w-full place-items-center bg-[#e8e4f4] text-[#8d80a5] sm:h-[210px]">
                    <Sparkles size={24} />
                  </div>
                )}
                <div className="p-3">
                  <strong className="block text-xs">{movie.Title}</strong>
                  <span className="mt-[5px] block text-[10px] text-muted">
                    {movie.Year} · {movie.Type}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </Card>
    </ToolFrame>
  );
}
