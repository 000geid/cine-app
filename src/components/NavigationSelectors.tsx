"use client"; // Required for client-side interactivity in Astro

import * as React from "react";
import { type OMDbMovieResponse } from "../lib/omdb"; // Adjust path as needed
import { type Cinema } from "../lib/cinemaData"; // Adjust path as needed

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select"; // Changed path alias to relative path

interface NavigationSelectorsProps {
    movies: OMDbMovieResponse[];
    cinemas: Cinema[];
}

export function NavigationSelectors({ movies, cinemas }: NavigationSelectorsProps) {
    const handleMovieChange = (movieId: string) => {
        if (movieId) {
            window.location.href = `/movie/${movieId}`;
        }
    };

    const handleCinemaChange = (cinemaId: string) => {
        if (cinemaId) {
            window.location.href = `/cinemas/${cinemaId}`;
        }
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Movie Selector */} 
            <Select onValueChange={handleMovieChange}>
                <SelectTrigger className="w-full sm:w-[280px]">
                    <SelectValue placeholder="Seleccionar Película..." />
                </SelectTrigger>
                <SelectContent>
                    {movies.map((movie) => (
                        <SelectItem key={movie.imdbID} value={movie.imdbID}>
                            {movie.Title} ({movie.Year})
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Cinema Selector */} 
            <Select onValueChange={handleCinemaChange}>
                <SelectTrigger className="w-full sm:w-[280px]">
                    <SelectValue placeholder="Seleccionar Cine..." />
                </SelectTrigger>
                <SelectContent>
                    {cinemas.map((cinema) => (
                        <SelectItem key={cinema.id.toString()} value={cinema.id.toString()}>
                            {cinema.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
} 