"use client";

import * as React from "react";
import { type Screening, type Cinema } from "../lib/cinemaData"; // Adjust path if needed
import { Button } from "./ui/button"; // Use relative path for shadcn component
import { cn } from "../lib/utils"; // Assuming utils file exists from shadcn init

interface ShowtimeSelectorProps {
    screenings: (Screening & { cinema: Cinema })[];
    movieId: string; // Need movieId to construct the URL
}

export function ShowtimeSelector({ screenings, movieId }: ShowtimeSelectorProps) {
    const handleShowtimeSelect = (cinemaId: number, time: string) => {
        // Construct URL with query parameters
        const params = new URLSearchParams({
            movieId: movieId,
            cinemaId: cinemaId.toString(),
            time: time
        });
        const url = `/seleccionar-asientos?${params.toString()}`;
        console.log(`Navigating to: ${url}`);
        window.location.href = url; // Navigate to the new page
    };

    if (screenings.length === 0) {
        return <p className="text-muted-foreground">Actualmente no está programada en ningún cine.</p>;
    }

    return (
        <div className="bg-card rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-semibold mb-4">En cartelera en</h3>
            <ul className="space-y-4">
                {screenings.map((screening) => {
                    const { cinema, showtimes } = screening;
                    return (
                        <li key={cinema.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                            <h4 className="text-xl font-medium">{cinema.name}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{cinema.location}</p>
                            <div className="flex flex-wrap gap-2">
                                {showtimes.map((time) => {
                                    return (
                                        <Button
                                            key={time}
                                            variant={"secondary"} // No need for selected state here anymore
                                            size="sm"
                                            className="text-sm font-medium transition duration-300"
                                            onClick={() => handleShowtimeSelect(cinema.id, time)}
                                        >
                                            {time}
                                        </Button>
                                    );
                                })}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
} 