"use client";

import * as React from "react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

interface SeatSelectionProps {
    cinemaId: number;
    time: string;
    // In a real app, you might fetch the actual seat map/occupancy based on cinemaId/time
}

interface Seat {
    id: string; // e.g., "A1", "C5"
    row: string;
    number: number;
    status: "available" | "occupied" | "selected";
}

// --- Mock Seat Generation ---
function generateMockSeats(rows: string[], seatsPerRow: number): Seat[] {
    const seats: Seat[] = [];
    for (const row of rows) {
        for (let i = 1; i <= seatsPerRow; i++) {
            const id = `${row}${i}`;
            // Randomly mark some as occupied for demo purposes
            const isOccupied = Math.random() < 0.2; // 20% chance
            seats.push({
                id,
                row,
                number: i,
                status: isOccupied ? "occupied" : "available",
            });
        }
    }
    return seats;
}

const seatRows = ["A", "B", "C", "D", "E"];
const seatsPerRow = 8;

// --- Component ---
export function SeatSelection({ cinemaId, time }: SeatSelectionProps) {
    // Initialize seats only once
    const initialSeats = React.useMemo(() => generateMockSeats(seatRows, seatsPerRow), []);
    const [seats, setSeats] = React.useState<Seat[]>(initialSeats);
    const [selectedSeatIds, setSelectedSeatIds] = React.useState<Set<string>>(new Set());

    const handleSeatClick = (seatId: string) => {
        const seatIndex = seats.findIndex(s => s.id === seatId);
        if (seatIndex === -1 || seats[seatIndex].status === 'occupied') return;

        const newSelectedSeatIds = new Set(selectedSeatIds);
        let newStatus: Seat["status"];

        if (selectedSeatIds.has(seatId)) {
            newSelectedSeatIds.delete(seatId);
            newStatus = 'available';
        } else {
            newSelectedSeatIds.add(seatId);
            newStatus = 'selected';
        }

        // Update the status in the main seats array
        const updatedSeats = [...seats];
        updatedSeats[seatIndex] = { ...updatedSeats[seatIndex], status: newStatus };

        setSeats(updatedSeats);
        setSelectedSeatIds(newSelectedSeatIds);
    };

    const handleConfirm = () => {
        // Simulate confirmation
        alert(`Confirmando ${selectedSeatIds.size} asientos para la función de las ${time}.\nAsientos: ${Array.from(selectedSeatIds).join(', ')}`);
        // Here you would typically navigate to a payment/confirmation page
    };

    return (
        <div className="mt-6 p-4 border-t border-border bg-muted/50 rounded-b-lg">
            <h4 className="text-lg font-semibold mb-4 text-center">Seleccione sus asientos</h4>
            <div className="aspect-video bg-foreground/10 rounded mb-4 flex items-center justify-center text-muted-foreground text-sm">PANTALLA</div>
            <div className="space-y-2 mb-6 flex flex-col items-center">
                {seatRows.map(row => (
                    <div key={row} className="flex items-center gap-2">
                        <span className="w-4 text-sm font-medium text-muted-foreground">{row}</span>
                        {seats.filter(s => s.row === row).map(seat => (
                            <Button
                                key={seat.id}
                                variant={seat.status === 'available' ? 'outline' : seat.status === 'occupied' ? 'ghost' : 'default'}
                                size="icon"
                                className={cn(
                                    "h-8 w-8 text-xs",
                                    seat.status === 'occupied' && "bg-muted text-muted-foreground cursor-not-allowed",
                                    seat.status === 'selected' && "bg-primary text-primary-foreground",
                                    seat.status === 'available' && "hover:bg-primary/10"
                                )}
                                onClick={() => handleSeatClick(seat.id)}
                                disabled={seat.status === 'occupied'}
                                aria-label={`Asiento ${seat.id}`}
                            >
                                {seat.number}
                            </Button>
                        ))}
                    </div>
                ))}
            </div>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                <p className="text-sm text-muted-foreground">Asientos seleccionados: {selectedSeatIds.size}</p>
                <Button
                    onClick={handleConfirm}
                    disabled={selectedSeatIds.size === 0}
                >
                    Confirmar Selección ({selectedSeatIds.size})
                </Button>
            </div>
        </div>
    );
} 