# Movie Finder

Movie Finder is a React application for searching movies, viewing movie details, rating titles, and saving a personal watched list in the browser.

The app uses the OMDb API to fetch movie data and combines that with local browser storage so the watched list stays available after a refresh.

## What The App Does

The application is split into two main panels:

- The left panel is used to search for movies.
- The right panel shows either the selected movie details or the watched list summary.

### Core user flow

1. The user types at least 3 characters into the search bar.
2. The app sends a request to the OMDb API and displays matching movies.
3. Clicking a movie opens a details view for that specific title.
4. The user can rate the movie using a star rating control.
5. After rating it, the user can add the movie to the watched list.
6. The watched list is stored in `localStorage`, so it persists across page reloads.
7. The user can remove a movie from the watched list at any time.

## Main Features

- Search movies by title using the OMDb API
- Show loading and error states during API requests
- View full movie details for the selected title
- Rate a movie with a 10-star scale
- Save watched movies locally in the browser
- View summary statistics for watched movies
- Remove movies from the watched list
- Keyboard interactions:
  - The search input is focused automatically on load
  - Pressing `Enter` focuses the search box
  - Pressing `Escape` closes the movie details panel

## Tech Stack

- React
- React DOM
- JavaScript
- Material UI
- OMDb API
- Browser `localStorage`

## Project Structure

```text
src/
  App.js
  Stars.js
  useMovies.js
  useLocalStorage.js
  index.js
  index.css
```

## File-By-File Explanation

### `src/index.js`

This is the entry point of the application.

- It imports the global stylesheet.
- It creates the React root.
- It renders the `App` component inside `React.StrictMode`.

`React.StrictMode` helps highlight unsafe patterns during development.

### `src/App.js`

This file contains the main application component and several UI components used throughout the app.

#### `App`

`App` is the top-level component and acts as the state manager for the whole UI.

It stores:

- `query`: the current search text
- `selectedId`: the IMDb ID of the currently selected movie
- `movies`: the current search results
- `errorMsg`: any error from the movie search request
- `isLoading`: whether a movie search is in progress
- `watched`: the saved watched list

It also defines the main event handlers:

- `handleBackClick`: closes the details view
- `handleSelect`: opens or toggles a selected movie
- `handleAdd`: adds a movie to the watched list
- `removeWatched`: removes a movie from the watched list

The layout renders:

- `Navbar` at the top
- One `Box` for search results
- One `Box` for either movie details or watched-list content

#### `Navbar`

The navigation bar contains:

- The app logo
- The controlled search input
- The total number of movies found

It uses:

- `useRef` to directly access the search input DOM element
- `useEffect` to auto-focus the input when the component mounts
- A keyboard listener so pressing `Enter` focuses the input again

This is a good example of using refs when React state is not the right tool for the job.

#### `Logo`

A simple presentational component that renders the application title and icon.

#### `Box`

`Box` is a reusable wrapper component used to contain either:

- the search results, or
- the watched/details panel

It keeps its own local `isOpen1` state and lets the user collapse or expand the panel.

This is a small example of component-local UI state.

#### `MovieList`

This component receives a `movies` array and renders the search results list.

For each movie it shows:

- poster
- title
- year

Clicking a movie calls `onSelect(movie.imdbID)`, which tells the parent component which movie should be opened in the details panel.

#### `MovieDetails`

This component is responsible for displaying full information about one selected movie.

It manages its own local state:

- `movie`: the fetched movie details object
- `isLoading`: loading state for the details request
- `rating`: the user-selected rating

It uses three `useEffect` hooks:

1. To listen for the `Escape` key and close the details panel
2. To update `document.title` when a movie is open
3. To fetch the selected movie details from the OMDb API whenever `id` changes

This component also checks whether the selected movie is already in the watched list:

- If not watched, it shows the `Stars` component and an `Add to List` button
- If already watched, it shows the stored user rating instead

When the user clicks `Add to List`, the component sends the movie data and the chosen `userRating` back to the parent using the `onAdd` callback.

#### `WatchedList`

This component renders all saved watched movies.

For each movie it displays:

- poster
- title
- IMDb rating
- user rating
- runtime

It also provides a remove action that calls `onRemove` with the movie ID.

#### `WatchSummary`

This component calculates and displays summary information about the watched list:

- total number of watched movies
- average IMDb rating
- average user rating
- average runtime

It uses the `average` helper function defined near the top of `App.js`.

#### `Loading`

A small presentational component used to show a loading message.

#### `ErrorMessage`

A small presentational component used to display fetch errors.

### `src/useMovies.js`

This file contains a custom React hook named `useMovies`.

Its purpose is to separate API-fetching logic from UI rendering.

#### What it does

- Watches the `query` value
- Starts a fetch request whenever the query changes
- Skips fetching if the query is shorter than 3 characters
- Tracks loading state
- Tracks error state
- Stores the search results

#### Why this hook is useful

Without this hook, the search logic would live directly inside `App`, making the component larger and harder to understand.

By extracting it into a custom hook, the code becomes:

- easier to read
- easier to reuse
- easier to test
- easier to maintain

#### Important React ideas used here

- `useState` is used to store movies, loading state, and errors
- `useEffect` is used to run side effects when `query` changes
- cleanup logic is used through the `ignore` flag to avoid applying stale results after a re-render

### `src/useLocalStorage.js`

This file contains another custom hook: `useLocalStorage`.

Its purpose is to keep the watched list synchronized with browser storage.

#### What it does

- On the first render, it reads `watchList` from `localStorage`
- If data exists, it parses it and uses it as the initial state
- If not, it starts with an empty array
- Whenever `watched` changes, it saves the updated array back into `localStorage`

#### Why this hook is useful

This keeps persistence logic out of `App`, so the component can focus on rendering and user interactions.

It is also a good example of lazy state initialization, because the initial `localStorage` read only happens once when the state is created.

### `src/Stars.js`

This component wraps Material UI's `Rating` component.

It receives:

- `rating`: the currently selected rating
- `setRating`: a setter passed down from `MovieDetails`

It also keeps its own `hoverRating` state so the UI can show the number currently being hovered.

This component demonstrates:

- lifting state up, because the main selected rating lives in the parent
- local UI state, because hover feedback is only relevant inside the star widget
- third-party component usage through Material UI

### `src/index.css`

This file defines the application's styling.

It includes:

- CSS custom properties for color values
- layout styles for the navbar and main panels
- reusable styles for boxes, loaders, and error states
- the overall dark theme of the application

## React Features Used In This Project

This project is a strong beginner-to-intermediate example of core React concepts.

### 1. Functional Components

All UI pieces are written as function components.

Examples:

- `App`
- `Navbar`
- `MovieList`
- `MovieDetails`
- `WatchSummary`

This is the modern React approach and works naturally with hooks.

### 2. `useState`

`useState` is used throughout the app to store dynamic values that affect rendering.

Examples include:

- search text
- selected movie ID
- loading state
- fetched movie data
- watched list
- star rating
- panel open/closed state

When state changes, React re-renders the affected component so the UI stays in sync with the data.

### 3. `useEffect`

`useEffect` is used for side effects, meaning logic that happens outside the normal render flow.

In this app it is used for:

- fetching movies from the API
- fetching details for a selected movie
- focusing the search input
- listening for keyboard events
- updating the browser tab title
- synchronizing data to `localStorage`

This project is a good practical example of when `useEffect` is appropriate.

### 4. `useRef`

`useRef` is used in `Navbar` to hold a reference to the search input element.

That allows the app to call `.focus()` on the input without storing that value in state.

Use refs when you need to interact with a DOM element directly.

### 5. Custom Hooks

Two custom hooks are used:

- `useMovies`
- `useLocalStorage`

Custom hooks are useful when logic needs to be shared or extracted from a component.

They help keep components cleaner by moving stateful behavior into dedicated reusable functions.

### 6. Controlled Components

The search input is a controlled component.

That means:

- React state stores the current input value
- the input displays that state
- typing updates the state through `onChange`

This pattern gives React full control over form values.

### 7. Conditional Rendering

The UI changes based on state.

Examples:

- loading indicator vs movie list
- error message vs normal content
- watched summary vs movie details
- add button only after a rating is selected
- watched message instead of rating controls for already-saved movies

Conditional rendering is one of the most important React patterns in this app.

### 8. Props And One-Way Data Flow

The parent component passes data and callbacks down to child components through props.

Examples:

- `App` passes `query` and `setQuery` behavior to `Navbar`
- `App` passes search results to `MovieList`
- `App` passes handlers like `onAdd`, `onRemove`, and `onBack` to child components

This follows React's one-way data flow:

- state usually lives in a parent
- children receive data through props
- children notify parents through callback props

### 9. Lifting State Up

The selected rating is a nice example of lifting state up.

The `Stars` component displays and changes the rating, but the actual `rating` state lives in `MovieDetails`.

That makes the rating available where it is needed for the `Add to List` action.

### 10. List Rendering With Keys

Both the movie search results and watched list are rendered with `.map()`.

Each item uses `movie.imdbID` as a React `key`, which helps React track list items efficiently during updates.

### 11. Event Handling

The app handles several kinds of events:

- typing in the search input
- clicking a movie
- clicking the add button
- clicking the remove button
- pressing keyboard keys like `Enter` and `Escape`
- interacting with the star rating widget

React event handling is a big part of how this app works.

## State Ownership In The App

Understanding where state lives is one of the most important parts of understanding React.

### State in `App`

Global page-level state:

- current search query
- selected movie
- watched movies

### State in `MovieDetails`

Details-view state:

- fetched movie details
- local loading state
- selected rating

### State in `Box`

Small UI state:

- whether the panel is collapsed

### State in `Stars`

Display-only interaction state:

- current hover value

This is a helpful example of placing state in the lowest component that truly needs it.

## Data Flow Summary

Here is the full flow of data in the application:

1. `Navbar` updates the `query` state in `App`
2. `App` passes `query` into `useMovies(query)`
3. `useMovies` fetches search results and returns them to `App`
4. `App` passes the `movies` array into `MovieList`
5. `MovieList` notifies `App` when a movie is clicked
6. `App` stores the clicked movie ID in `selectedId`
7. `MovieDetails` fetches full data for that movie ID
8. `MovieDetails` sends the completed movie object back to `App` through `onAdd`
9. `App` updates `watched`
10. `useLocalStorage` persists the watched list automatically

## External Services And Libraries

### OMDb API

The app uses the OMDb API to:

- search movies by title
- fetch full details for a specific movie by IMDb ID

### Material UI

Material UI is used for:

- the `Button` component
- the `Rating` component inside `Stars`

This shows how React apps can combine custom components with third-party UI libraries.

## Running The Project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Create a production build:

```bash
npm run build
```

Run tests:

```bash
npm test
```

## Learning Value Of This Project

This project is a very good practice app for learning:

- component composition
- state management with hooks
- side effects with `useEffect`
- custom hooks
- controlled inputs
- list rendering
- conditional rendering
- local persistence with `localStorage`
- API integration in React

It is small enough to understand, but large enough to demonstrate how React pieces work together in a real application.

## Possible Improvements

Here are a few good next steps if you want to continue improving the project:

- move all components into separate files for easier maintenance
- add prop validation or TypeScript
- handle API request cancellation more explicitly with `AbortController`
- improve accessibility for clickable list items and remove actions
- add tests for hooks and main user flows
- fix text encoding issues affecting some emoji/icons
- use `https` consistently for all API requests
- add empty-state messaging when no search has been performed yet

## Summary

Movie Finder is a React movie search and watchlist app that demonstrates practical use of:

- component-based UI design
- state with hooks
- side effects
- custom hooks
- browser storage
- API-driven rendering
- third-party UI components

It is a clean example of how React can be used to build an interactive application with real data and persistent user state.
