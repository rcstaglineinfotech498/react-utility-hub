import { useState } from "react";
import { CloudSun, Search } from "lucide-react";
import { ToolFrame } from "../../components/ToolFrame";
import {
  Button,
  Card,
  EmptyState,
  ErrorMessage,
  Input,
  Loader,
} from "../../components/UI";
import { apiConfig, weatherApi } from "../../services/api";

export default function Weather() {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("idle");
  const searchWeather = async (event) => {
    // console.log(response)
    event.preventDefault();
    if (!city.trim()) return;
    setStatus("loading");
    try {
      const { data: response } = await weatherApi.get(
        `/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiConfig.weatherKey}`,
      );
      setData(response);
      // console.log(apiConfig)
      setStatus("success");
    } catch {
      setStatus("error");
    }
    // console.log(city)
  };
  return (
    <ToolFrame
      eyebrow="Outside, simplified"
      title="Weather"
      description="A quick read on the sky wherever you are."
      toolId="weather"
    >
      <Card>
        <form
          className="flex flex-col gap-2.5 sm:flex-row"
          onSubmit={searchWeather}
        >
          <Input
            placeholder="Search a city..."
            value={city}
            onChange={(event) => setCity(event.target.value)}
          />
          <Button type="submit" className="bg-amber-50 text-black border-1">
            <Search size={17} /> Search
          </Button>
        </form>
        {status === "loading" && <Loader text="Finding your forecast..." />}
        {status === "error" && (
          <ErrorMessage>
            We couldn't find that city. Check the spelling and try again.
          </ErrorMessage>
        )}
        {status === "idle" && (
          <EmptyState icon={CloudSun} title="Where are you headed?">
            Search a city to see weather conditions.
          </EmptyState>
        )}
        {data && (
          <div className="mt-7 rounded-xl p-6">
            <div className="flex items-center gap-[18px] text-green-dark">
              <CloudSun size={48} />
              <div className="grid gap-0.5">
                <span>
                  {data.name}, {data.sys.country}
                </span>
                <strong className="font-mono text-[42px] font-bold leading-none">
                  {Math.round(data.main.temp)}°
                </strong>
                <em className="text-xs capitalize not-italic">
                  {data.weather[0].description}
                </em>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-[22px] border-t border-[rgba(57,124,104,0.2)] pt-[15px] text-[11px] text-muted">
              <span>
                Feels like{" "}
                <b className="ml-1 text-ink">
                  {Math.round(data.main.feels_like)}°
                </b>
              </span>
              <span>
                Humidity <b className="ml-1 text-ink">{data.main.humidity}%</b>
              </span>
              <span>
                Wind <b className="ml-1 text-ink">{data.wind.speed} m/s</b>
              </span>
            </div>
          </div>
        )}
      </Card>
    </ToolFrame>
  );
}
