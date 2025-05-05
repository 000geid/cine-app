// cine-app/src/lib/omdb.ts

// Define the expected structure of the OMDb API response
// Based on: http://www.omdbapi.com/?i=tt3896198&apikey=3b62c8ca
export interface OMDbMovieResponse {
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Ratings: Array<{ Source: string; Value: string }>;
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    Type: string;
    DVD?: string; // Optional fields
    BoxOffice?: string;
    Production?: string;
    Website?: string;
    Response: "True" | "False";
    Error?: string; // Present if Response is "False"
}

const API_KEY = "3b62c8ca";
const BASE_URL = `http://www.omdbapi.com/`;

/**
 * Fetches detailed information for a movie from the OMDb API.
 * @param imdbId The IMDb ID of the movie (e.g., "tt3896198")
 * @returns A promise that resolves to the movie data or null if not found/error.
 */
export async function getMovieDetails(imdbId: string): Promise<OMDbMovieResponse | null> {
    const url = `${BASE_URL}?i=${imdbId}&apikey=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}`);
            return null;
        }
        const data: OMDbMovieResponse = await response.json();

        if (data.Response === "False") {
            console.error(`OMDb API Error for ID ${imdbId}: ${data.Error}`);
            return null;
        }

        return data;
    } catch (error) {
        console.error(`Failed to fetch movie details for ID ${imdbId}:`, error);
        return null;
    }
}

// Example function to fetch multiple movies (e.g., for the index page)
// Takes an array of IMDb IDs
export async function getMultipleMovieDetails(imdbIds: string[]): Promise<OMDbMovieResponse[]> {
    const moviePromises = imdbIds.map(id => getMovieDetails(id));
    const results = await Promise.all(moviePromises);
    // Filter out any null results (errors/not found)
    return results.filter((movie): movie is OMDbMovieResponse => movie !== null);
} 