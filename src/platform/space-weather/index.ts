/**
 * Space Weather (Program CJ) — the operational space-weather layer.
 *
 * Real, current data from NOAA SWPC and NASA CCMC DONKI, through the live-provider runtime's
 * honesty envelope. There is no composite "space weather score": the agencies publish scales,
 * and a number invented on top of them would be AsteriaStar's opinion wearing NOAA's authority.
 */
export * from "@/platform/space-weather/model";
export * as swpc from "@/platform/space-weather/swpc";
export * as donki from "@/platform/space-weather/donki";
export * as explain from "@/platform/space-weather/explain";
export * from "@/platform/space-weather/service";
