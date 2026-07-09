# Quantum & Fundamental Physics for Astronomy (Program CA)

The physics that underpins the cosmos, told through its astronomical relevance. Built on the platform's
honesty envelope: only well-established physics is stated, every concept is framed by where it matters
for astronomy, open problems are flagged as open, and nothing — no value, equation, discovery date, or
mechanism — is fabricated.

## Reuse-first

CA reuses the physics already in the graph and adds only the concepts that were missing:

- **Special & general relativity** (`cosmology_concept` / `astronomical_theory`), **spacetime**, **cosmic
  inflation**, **dark matter**, **dark energy**, the **cosmological constant**, the **Standard Model of
  particle physics**, and **quantum gravity** (`cosmology_concept`); the **neutrino-astronomy** method,
  **IceCube**, **cosmic rays**, the **cosmic microwave background**, **Big Bang nucleosynthesis**, and the
  **Sun** and **solar core** — all referenced via `relatedKeys`, none duplicated.

## New entities (one new type, grouped by kind for discovery)

All new entities share a single new `physics_concept` type; `kind` groups them for discovery only.

- **Quantum physics** — the wave function, quantum superposition, entanglement, the Heisenberg
  uncertainty principle, wave–particle duality, quantum spin, quantum tunnelling, zero-point energy, and
  quantum decoherence.
- **Particle physics** — elementary particles, the four fundamental forces, the Higgs boson, the
  neutrino, neutrino oscillation, antimatter, and the matter–antimatter asymmetry.
- **Relativity** — mass–energy equivalence (E = mc²), time dilation, length contraction, and the
  equivalence principle.
- **Quantum cosmology** — quantum fluctuations, vacuum energy, the cosmological-constant problem, the
  cosmic neutrino background, and the GZK limit.

Each new concept links to the reused relativity/cosmology/particle entities and to the astronomy where
it shows up (degeneracy pressure in white dwarfs and neutron stars, the 21-cm line, fusion in the Sun's
core, the CMB, cosmic rays), producing `associated_with` edges that are deduped against every existing
relation.

## Surfaces

- Hub `/fundamental-physics`, entry pages `/fundamental-physics/[slug]`, and four discovery hubs
  `/fundamental-physics/discover/{quantum-physics,particle-physics,relativity,quantum-cosmology}`.
- Resolved through the Scientific Data Engine (`engine.fundamentalPhysics`), reusing the shared quality,
  review, provenance, connections, breadcrumb, and JSON-LD (`DefinedTerm`) infrastructure. Accent: comet.

## Honesty

Open questions are named as open — the cosmological-constant problem (quantum theory over-predicts the
vacuum energy by many tens of orders of magnitude), the matter–antimatter asymmetry (baryogenesis), and
the union of gravity with quantum theory. Undetected-but-predicted phenomena (the cosmic neutrino
background) are stated as such. Nothing is fabricated.
