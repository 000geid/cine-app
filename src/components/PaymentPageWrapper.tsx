"use client";

import * as React from "react";
import { getMovieDetails, type OMDbMovieResponse } from "../lib/omdb";
import { getCinemaDetails, type Cinema } from "../lib/cinemaData";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

export function PaymentPageWrapper() {
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [movie, setMovie] = React.useState<OMDbMovieResponse | null>(null);
    const [cinema, setCinema] = React.useState<Cinema | null>(null);
    const [time, setTime] = React.useState<string | null>(null);
    const [seats, setSeats] = React.useState<string[]>([]);
    const [selectedPayment, setSelectedPayment] = React.useState<string | null>(null);

    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const movieIdParam = params.get("movieId");
        const cinemaIdParam = params.get("cinemaId");
        const timeParam = params.get("time");
        const seatsParam = params.get("seats"); // Comma-separated string

        if (!movieIdParam || !cinemaIdParam || !timeParam || !seatsParam) {
            setError("Faltan datos de la reserva (película, cine, horario, asientos).");
            setIsLoading(false);
            return;
        }

        const parsedCinemaId = parseInt(cinemaIdParam, 10);
        if (isNaN(parsedCinemaId)) {
            setError("ID de cine inválido.");
            setIsLoading(false);
            return;
        }

        setTime(timeParam);
        setSeats(seatsParam.split(',').filter(s => s)); // Split and filter empty strings

        async function fetchData() {
            try {
                const movieData = await getMovieDetails(movieIdParam!);
                if (!movieData) throw new Error(`No se encontró la película con ID ${movieIdParam}.`);
                setMovie(movieData);

                const cinemaData = getCinemaDetails(parsedCinemaId);
                if (!cinemaData) throw new Error(`No se encontró el cine con ID ${parsedCinemaId}.`);
                setCinema(cinemaData);

            } catch (fetchError: any) {
                setError(fetchError.message || "Ocurrió un error al cargar los datos.");
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    const handlePayment = () => {
        if (!selectedPayment) {
            alert("Por favor, seleccione un método de pago.");
            return;
        }
        alert(`¡Reserva confirmada!\nPelícula: ${movie?.Title}\nCine: ${cinema?.name}\nHorario: ${time}\nAsientos: ${seats.join(', ')}\nMétodo de Pago: ${selectedPayment}\n\n(Esto es una demo, no se realizó ningún pago real)`);
        // Redirect to a success/confirmation page or back home
        window.location.href = "/";
    };

    if (isLoading) { /* ... Loading state ... */
        return <div className="flex justify-center items-center p-8"><p className="text-muted-foreground animate-pulse">Cargando resumen...</p></div>;
     }

    if (error) { /* ... Error state ... */
        return (
            <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md">
                <h2 className="text-xl font-semibold mb-2">Error</h2>
                <p>{error}</p>
                <Button variant="outline" className="mt-4" asChild><a href="/">&larr; Volver al Inicio</a></Button>
            </div>
        );
    }

    if (movie && cinema && time && seats.length > 0) {
        const totalSeats = seats.length;
        const mockPricePerSeat = 1500; // Mock price in ARS
        const totalPrice = totalSeats * mockPricePerSeat;

        return (
            <div className="bg-card rounded-lg shadow-lg p-6 space-y-6">
                <div>
                    <h2 className="text-2xl font-bold mb-3">Confirmar Reserva y Pago</h2>
                    <p className="mb-1"><span className="font-semibold">Película:</span> {movie.Title} ({movie.Year})</p>
                    <p className="mb-1"><span className="font-semibold">Cine:</span> {cinema.name} ({cinema.location})</p>
                    <p className="mb-1"><span className="font-semibold">Horario:</span> {time}</p>
                    <p className="mb-1"><span className="font-semibold">Asientos ({totalSeats}):</span> {seats.join(', ')}</p>
                    <p className="text-lg font-semibold mt-2">Total: ARS ${totalPrice.toLocaleString('es-AR')}</p>
                </div>

                <div className="border-t pt-6">
                    <h3 className="text-xl font-semibold mb-4">Seleccionar Método de Pago</h3>
                    <RadioGroup value={selectedPayment || undefined} onValueChange={setSelectedPayment}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="credit-card" id="r1" />
                            <Label htmlFor="r1">Tarjeta de Crédito/Débito</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="mercado-pago" id="r2" />
                            <Label htmlFor="r2">Mercado Pago</Label>
                        </div>
                        {/* Add more payment options here */}
                    </RadioGroup>
                </div>

                <Button
                    className="w-full"
                    onClick={handlePayment}
                    disabled={!selectedPayment}
                >
                    Confirmar y Pagar (Demo)
                </Button>
            </div>
        );
    }

    return null; // Fallback
} 