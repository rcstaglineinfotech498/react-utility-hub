import { configureStore, createSlice } from '@reduxjs/toolkit'

const savedTheme = localStorage.getItem('utility-theme') || 'light'
const favorites = JSON.parse(localStorage.getItem('utility-favorites') || '[]')

const appSlice = createSlice({
  name: 'app',
  initialState: { theme: savedTheme, favorites },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('utility-theme', state.theme)
    },
    toggleFavorite: (state, action) => {
      state.favorites = state.favorites.includes(action.payload)
        ? state.favorites.filter((item) => item !== action.payload)
        : [...state.favorites, action.payload]
      localStorage.setItem('utility-favorites', JSON.stringify(state.favorites))
    },
  },
})

export const { toggleTheme, toggleFavorite } = appSlice.actions
export const store = configureStore({ reducer: { app: appSlice.reducer } })
