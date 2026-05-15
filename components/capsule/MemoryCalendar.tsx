"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Memory } from "./MemoryGrid";

export interface FutureMessageMarker {
  id: string;
  unlocksAt: string;
}

interface MemoryCalendarProps {
  memories: Memory[];
  futureMessages?: FutureMessageMarker[];
  capsuleId?: string;
}

export const MemoryCalendar = ({
  memories,
  futureMessages = [],
  capsuleId,
}: MemoryCalendarProps) => {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const getMemoriesForDay = (day: number) =>
    memories.filter((memory) => {
      const date = new Date(memory.createdAt);
      return (
        date.getDate() === day &&
        date.getMonth() === month &&
        date.getFullYear() === year
      );
    });

  const hasFutureMessageForDay = (day: number) =>
    futureMessages.some((fm) => {
      const date = new Date(fm.unlocksAt);
      return (
        date.getDate() === day &&
        date.getMonth() === month &&
        date.getFullYear() === year
      );
    });

  const handleDayClick = (day: number) => {
    const fecha = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const query = capsuleId ? `?capsule=${capsuleId}` : "";
    router.push(`/dashboard/dia/${fecha}${query}`);
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const days = ["L", "M", "X", "J", "V", "S", "D"];

  return (
    <div className="w-full border border-border bg-background rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-serif text-xl">
          {monthNames[month]} {year}
        </h3>
        <div className="flex items-center gap-4">
          <button
            onClick={goToToday}
            className="text-[12px] font-bold tracking-widest uppercase hover:opacity-60"
          >
            Hoy
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="p-1 hover:bg-surface rounded-full"
            >
              <ChevronLeft className="h-5 w-5 opacity-40" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1 hover:bg-surface rounded-full"
            >
              <ChevronRight className="h-5 w-5 opacity-40" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-4 text-center">
        {days.map((day) => (
          <span
            key={day}
            className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest"
          >
            {day}
          </span>
        ))}

        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: totalDays }).map((_, i) => {
          const day = i + 1;
          const active = isToday(day);
          const dayMemories = getMemoriesForDay(day);
          const hasMemories = dayMemories.length > 0;
          const hasFutureMessage = hasFutureMessageForDay(day);

          return (
            <div key={day} className="relative flex flex-col items-center">
              <button
                onClick={() => handleDayClick(day)}
                className={cn(
                  "cursor-pointer h-10 w-10 flex items-center justify-center rounded-full text-[14px] font-medium transition-all relative",
                  active
                    ? "bg-foreground text-background"
                    : "text-foreground hover:bg-black/20",
                  !active &&
                    hasFutureMessage &&
                    "bg-foreground/5 hover:bg-accent hover:text-foreground",
                  !active &&
                    hasMemories &&
                    !hasFutureMessage &&
                    "hover:bg-accent hover:text-foreground",
                )}
              >
                {day}
              </button>
              {!active && (hasMemories || hasFutureMessage) && (
                <div className="absolute bottom-[-3px] flex items-center gap-[3px]">
                  {hasMemories && (
                    <span className="w-1 h-1 bg-foreground/40 rounded-full" />
                  )}
                  {hasFutureMessage && (
                    <span className="text-[7px] leading-none text-foreground/50">
                      ✦
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
