// cine-app/src/lib/cinemaData.ts

// --- Estructuras de Datos ---

export interface Cinema {
  id: number;
  name: string;
  location: string;
}

export interface Screening {
  movieId: string; // Corresponde a OMDbMovieResponse.imdbID
  cinemaId: number; // Corresponde a Cinema.id
  showtimes: string[]; // Array de horarios para esta película en este cine
}

// --- Datos de Ejemplo (Localizados) ---

export const cinemas: Cinema[] = [
  { id: 1, name: "Cineplex Centro", location: "Av. Corrientes 1234, CABA" },
  { id: 2, name: "MegaCines Oeste", location: "Av. Rivadavia 5678, CABA" },
  { id: 3, name: "Cine Club Palermo", location: "Jorge Luis Borges 1999, CABA" },
];

// Asociar películas (por IMDb ID) con cines y horarios
// (Movie titles/plots come from OMDb, so only showtimes/associations are here)
export const screenings: Screening[] = [
  // Guardians of the Galaxy Vol. 2 (tt3896198)
  { movieId: "tt3896198", cinemaId: 1, showtimes: ["11:00", "14:30", "18:00", "21:30"] }, // Switched to 24h format
  { movieId: "tt3896198", cinemaId: 2, showtimes: ["13:00", "16:30", "20:00"] },

  // The Avengers (tt0848228)
  { movieId: "tt0848228", cinemaId: 1, showtimes: ["10:00", "13:15", "16:45", "20:15"] },
  { movieId: "tt0848228", cinemaId: 2, showtimes: ["11:30", "15:00", "18:30", "22:00"] },
  { movieId: "tt0848228", cinemaId: 3, showtimes: ["17:00", "20:45"] },

  // Avengers: Endgame (tt4154796)
  { movieId: "tt4154796", cinemaId: 1, showtimes: ["12:00", "16:00", "20:00"] },
  { movieId: "tt4154796", cinemaId: 2, showtimes: ["10:30", "14:30", "18:30", "22:30"] },

  // Toy Story (tt0114709)
  { movieId: "tt0114709", cinemaId: 2, showtimes: ["10:00", "12:15", "14:45"] },
  { movieId: "tt0114709", cinemaId: 3, showtimes: ["16:00", "18:15"] },
];

// --- Funciones Auxiliares ---

/**
 * Encuentra todas las funciones para una película específica.
 * @param movieId El IMDb ID de la película.
 * @returns Un array de funciones para esa película.
 */
export function getScreeningsForMovie(movieId: string): Screening[] {
  return screenings.filter(s => s.movieId === movieId);
}

/**
 * Encuentra todas las funciones en un cine específico.
 * @param cinemaId El ID del cine.
 * @returns Un array de funciones en ese cine.
 */
export function getScreeningsAtCinema(cinemaId: number): Screening[] {
  return screenings.filter(s => s.cinemaId === cinemaId);
}

/**
 * Obtiene los detalles de un cine específico.
 * @param cinemaId El ID del cine.
 * @returns Los detalles del cine o undefined si no se encuentra.
 */
export function getCinemaDetails(cinemaId: number): Cinema | undefined {
  return cinemas.find(c => c.id === cinemaId);
} 