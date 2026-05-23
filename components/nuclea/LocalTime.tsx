"use client";

/**
 * Renders a time string in the **browser's local timezone**.
 * Use this instead of toLocaleTimeString() in server components,
 * which would render in UTC / server timezone.
 */
export function LocalTime({
  date,
  options,
}: {
  date: Date | string;
  options?: Intl.DateTimeFormatOptions;
}) {
  const d = new Date(date);
  return (
    <span suppressHydrationWarning>
      {d.toLocaleTimeString("es-ES", options)}
    </span>
  );
}

/**
 * Renders a date string in the **browser's local timezone**.
 */
export function LocalDate({
  date,
  options,
}: {
  date: Date | string;
  options?: Intl.DateTimeFormatOptions;
}) {
  const d = new Date(date);
  return (
    <span suppressHydrationWarning>
      {d.toLocaleDateString("es-ES", options)}
    </span>
  );
}

/**
 * Renders current date + time in browser local timezone.
 * Use in server components that need to show "now".
 */
export function LocalNow({
  showTime = true,
  showDate = true,
}: {
  showTime?: boolean;
  showDate?: boolean;
}) {
  const now = new Date();
  const parts: string[] = [];
  if (showDate)
    parts.push(
      now.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  if (showTime)
    parts.push(
      now.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
    );
  return <span suppressHydrationWarning>{parts.join(" · ")}</span>;
}
