"use client";

import * as React from "react";
import { getMovieDetails, type OMDbMovieResponse } from "../lib/omdb";
import { getCinemaDetails, type Cinema } from "../lib/cinemaData";
import { SeatSelection } from "./SeatSelection";
import { Button } from "./ui/button";

export function SeatSelectionPageWrapper() {
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [movie, setMovie] = React.useState<OMDbMovieResponse | null>(null);
    const [cinema, setCinema] = React.useState<Cinema | null>(null);
    const [time, setTime] = React.useState<string | null>(null);
    const [cinemaId, setCinemaId] = React.useState<number | null>(null);
    const [movieId, setMovieId] = React.useState<string | null>(null);

    React.useEffect(() => {
        // This code runs only in the browser
        const params = new URLSearchParams(window.location.search);
        const movieIdParam = params.get("movieId");
        const cinemaIdParam = params.get("cinemaId");
        const timeParam = params.get("time");

        console.log(`Wrapper - Params from URL: movieId=${movieIdParam}, cinemaId=${cinemaIdParam}, time=${timeParam}`);

        if (!movieIdParam || !cinemaIdParam || !timeParam) {
            setError("Faltan parámetros requeridos (película, cine, horario).");
            setIsLoading(false);
            return;
        }

        const parsedCinemaId = parseInt(cinemaIdParam, 10);
        if (isNaN(parsedCinemaId)) {
            setError("ID de cine inválido.");
            setIsLoading(false);
            return;
        }

        setMovieId(movieIdParam);
        setCinemaId(parsedCinemaId);
        setTime(timeParam);

        // Fetch data client-side
        async function fetchData() {
            try {
                // Use non-null assertion ! since we checked movieIdParam above
                const movieData = await getMovieDetails(movieIdParam!);
                if (!movieData) {
                    throw new Error(`No se encontró la película con ID ${movieIdParam}.`);
                }
                setMovie(movieData);

                // Get cinema details (sync)
                const cinemaData = getCinemaDetails(parsedCinemaId);
                if (!cinemaData) {
                    throw new Error(`No se encontró el cine con ID ${parsedCinemaId}.`);
                }
                setCinema(cinemaData);

            } catch (fetchError: any) {
                console.error("Fetch error:", fetchError);
                setError(fetchError.message || "Ocurrió un error al cargar los datos.");
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();

    }, []); // Empty dependency array ensures this runs once on mount

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <p className="text-muted-foreground animate-pulse">Cargando detalles...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md">
                <h2 className="text-xl font-semibold mb-2">Error</h2>
                <p>{error}</p>
                <Button variant="outline" className="mt-4" asChild>
                    <a href="/">&larr; Volver al Inicio</a>
                </Button>
            </div>
        );
    }

    if (movie && cinema && cinemaId && time && movieId) {
         return (
            <div className="bg-card rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold mb-1">{movie.Title}</h2>
                    <p className="text-lg text-muted-foreground mb-1">{cinema.name} - {cinema.location}</p>
                    <p className="text-lg font-semibold text-primary">Horario: {time}</p>
                </div>
                <SeatSelection cinemaId={cinemaId} time={time} movieId={movieId} />
            </div>
        );
    }

    return null; // Should not be reached if logic is correct
} 