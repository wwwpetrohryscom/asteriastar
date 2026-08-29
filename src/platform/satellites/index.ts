/**
 * Satellites, the ISS and orbital passes (Program CL).
 *
 * Built on NASA's own operational ISS ephemeris rather than on two-line elements, because the
 * operator publishes the trajectory its flight controllers use and it comes with the ascending-node
 * longitudes that make the coordinate transformation verifiable. One satellite is served live, and
 * that is an outcome of checking what is legally and technically available rather than a starting
 * ambition.
 */
export * from "@/platform/satellites/frames";
export * from "@/platform/satellites/oem";
export * from "@/platform/satellites/ephemeris";
export * from "@/platform/satellites/passes";
export * from "@/platform/satellites/service";
