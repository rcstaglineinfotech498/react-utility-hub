import axios from 'axios'

export const apiConfig = {
  currencyKey: import.meta.env.VITE_CURRENCY_API_KEY,
  weatherKey: import.meta.env.VITE_WEATHER_API_KEY,
  movieKey: import.meta.env.VITE_MOVIE_API_KEY,
}

export const currencyApi = axios.create({ baseURL: 'https://api.freecurrencyapi.com/v1' })
export const weatherApi = axios.create({ baseURL: 'https://api.openweathermap.org/data/2.5' })
export const movieApi = axios.create({ baseURL: 'https://www.omdbapi.com' })

export const hasApiKey = (key) => Boolean(key && !key.includes('YOUR_'))
