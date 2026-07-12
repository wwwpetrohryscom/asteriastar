/**
 * The text forms an official page might render a YYYY-MM-DD date in. Single source of truth
 * shared by the corroboration ingest (to match a date on a page) and the validator (to check
 * that a recorded `confirmed_by_primary` evidence form is a genuine rendering of the date).
 */
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const ABBR = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

export function dateForms(iso: string): string[] {
  const [y, m, d] = iso.split("-").map(Number);
  const full = MONTHS[m - 1], ab = ABBR[m - 1];
  return [`${full} ${d}, ${y}`, `${ab}. ${d}, ${y}`, `${ab} ${d}, ${y}`, `${d} ${full} ${y}`, iso, `${full} ${d} ${y}`];
}

/** True when `form` is one of the legitimate text renderings of the ISO date. */
export function isDateRenderingOf(form: string, iso: string): boolean {
  return dateForms(iso).includes(form);
}
