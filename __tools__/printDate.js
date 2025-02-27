export function printDate() {
  const MONTH = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const a = new Date();
  return `${MONTH[a.getMonth()]} ${a
    .getDate()
    .toString()
    .padStart(2, "0")} ${a.getFullYear()}`;
}
printDate();
