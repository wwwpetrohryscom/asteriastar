import type { ImageRecord } from "@/knowledge-graph/data/image-catalog/types";

/** Image-metadata helpers: turn a record's present fields into display rows (omitting the unknown). */
export interface MetaRow { label: string; value: string }

const IMAGE_TYPE_LABEL: Record<ImageRecord["imageType"], string> = {
  observation: "Observation", processed: "Processed", composite: "Composite",
  "historic-plate": "Historic plate", mission: "Mission image", diagram: "Scientific diagram",
};

/** Metadata rows for an image — only fields that are actually recorded (never invented). */
export function imageMetadataRows(img: ImageRecord): MetaRow[] {
  const rows: MetaRow[] = [];
  const push = (label: string, value?: string | number | null) => { if (value != null && value !== "") rows.push({ label, value: String(value) }); };
  push("Image type", IMAGE_TYPE_LABEL[img.imageType]);
  push("Processing", img.processingLevel);
  push("Instrument", img.instrument);
  push("Wavelength", img.wavelengthBand);
  push("Capture date", img.captureDate);
  push("Published", img.publicationYear);
  push("Resolution", img.resolution);
  push("Orientation", img.orientation);
  push("Coordinates", img.coordinates);
  push("Exposure", img.exposure);
  push("DOI", img.doi);
  return rows;
}

/** Fields that are deliberately not recorded for this image (shown honestly as "not recorded"). */
export function unrecordedFields(img: ImageRecord): string[] {
  const missing: string[] = [];
  if (!img.captureDate) missing.push("capture date");
  if (!img.resolution) missing.push("resolution");
  if (!img.exposure) missing.push("exposure");
  if (!img.coordinates) missing.push("coordinates");
  if (!img.doi) missing.push("DOI");
  return missing;
}
