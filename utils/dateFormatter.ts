import { parse, format, isValid } from "date-fns"

export function formatDate(date: string): string {
   const formats = ['dd.MM.yyyy', 'yyyy.MM.dd'];

   if (!date) return "-"
   for (const fmt of formats) {
      const parsedDate = parse(date, fmt, new Date());
      return isValid(parsedDate) ? format(parsedDate, "MMM d, yyyy") : "-"

   }
   return "-"
}

export function localDateFormatter(date: string) {
   const formattedDate = new Date(date)
   return isNaN(formattedDate.getTime())
    ? ""
    : formattedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
}