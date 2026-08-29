import { issEphemeris, issNow, issPasses, verifyFrames } from "@/platform/satellites/service";
async function main() {
  const env = await issEphemeris();
  console.log("status:", env.status, "error:", env.error ?? "-");
  if (!env.data) return;
  const e = env.data;
  console.log(`object=${e.objectName} id=${e.objectId} frame=${e.referenceFrame} time=${e.timeSystem}`);
  console.log(`originator=${e.originator} created=${e.creationTime}`);
  console.log(`states=${e.states.length} span=${new Date(e.startMs).toISOString()} -> ${new Date(e.stopMs).toISOString()}`);
  console.log(`mass=${e.massKg} kg  nodes=${e.ascendingNodes.length}`);
  console.log("\n=== FRAME VERIFICATION against NASA's own node longitudes ===");
  for (const c of verifyFrames(e)) {
    console.log(`  ${c.node.padEnd(5)} expected ${c.expectedLongitudeDeg.toFixed(5)}°  computed ${c.computedLongitudeDeg.toFixed(5)}°  lat ${c.computedLatitudeDeg.toFixed(5)}°  error ${c.groundErrorMetres.toFixed(1)} m`);
  }
  const now = Date.now();
  const s = issNow(env, now);
  if (s) {
    console.log(`\n=== ISS NOW (${new Date(now).toISOString()}) ===`);
    console.log(`  lat ${s.state.geodetic.latitudeDeg.toFixed(3)}°  lon ${s.state.geodetic.longitudeDeg.toFixed(3)}°  alt ${s.state.geodetic.altitudeKm.toFixed(1)} km`);
    console.log(`  speed ${s.state.speedKmS.toFixed(3)} km/s (${(s.state.speedKmS * 3600).toFixed(0)} km/h)  period ${s.periodMinutes?.toFixed(2)} min`);
    console.log(`  coverage remaining ${s.coverageHours.toFixed(1)} h  (~${s.orbitsRemaining} orbits)  track points ${s.track.length}`);
  }
  for (const [name, lat, lon] of [["London", 51.5074, -0.1278], ["Sydney", -33.8688, 151.2093], ["Quito", -0.1807, -78.4678]] as const) {
    const passes = issPasses(env, { latitudeDeg: lat, longitudeDeg: lon, altitudeKm: 0 }, now, 72);
    const visible = passes.filter((p) => p.visibility === "visible");
    console.log(`\n${name}: ${passes.length} passes above 10° in 72 h, ${visible.length} visible`);
    for (const p of visible.slice(0, 3)) {
      console.log(`  ${new Date(p.startMs).toISOString().slice(0,16)}Z  max ${p.maxElevationDeg.toFixed(0)}°  ${p.riseCompass}->${p.setCompass}  ${Math.round(p.durationSeconds/60)} min  range ${p.minRangeKm.toFixed(0)} km`);
    }
  }
}
main();
