import { describe, it, expect } from "vitest";
import { decidirOncologia } from "./decidirOncologia.js";

function caso(overrides) {
  return {
    duracion: "D3",
    tipoCancer: "ONC_S",
    urgenciaInicio: "URG0",
    nptOsmExtrema: false,
    incompatibles: false,
    ...overrides,
  };
}

// ── Hematológico + urgencia ───────────────────────────────────────

describe("ONC_H — urgencia", () => {
  it("ONC_H + URG0 → alt incluye port", () => {
    const r = decidirOncologia(caso({ tipoCancer: "ONC_H", urgenciaInicio: "URG0" }));
    expect(r.main).toBe("PICC o catéter tunelizado");
    expect(r.alt).toBe("Port solo en contexto no urgente");
  });

  it("ONC_H + URG1 → alt excluye port", () => {
    const r = decidirOncologia(caso({ tipoCancer: "ONC_H", urgenciaInicio: "URG1" }));
    expect(r.main).toBe("PICC o catéter tunelizado");
    expect(r.alt).toBe("Port es inapropiado en urgencia hematológica");
  });

  it("ONC_H + URG1 → warning port en urgencia", () => {
    const r = decidirOncologia(caso({ tipoCancer: "ONC_H", urgenciaInicio: "URG0" }));
    expect(r.note).toContain("Lúmenes");
    expect(r.note).toContain("MDS/MPN");
  });

  it("ONC_H sin urgencia definida → sigue funcionando", () => {
    const r = decidirOncologia(caso({ tipoCancer: "ONC_H", urgenciaInicio: null }));
    expect(r.main).toBe("PICC o catéter tunelizado");
    expect(r.alt).toBe("Port solo en contexto no urgente");
  });
});

// ── Sólido smoke tests ────────────────────────────────────────────

describe("ONC_S — smoke", () => {
  it("ONC_S + URG0 + D3 → PICC", () => {
    const r = decidirOncologia(caso());
    expect(r.main).toBe("PICC");
    expect(r.incluyePICC).toBe(true);
  });

  it("ONC_S + URG0 + D1 → PICC con alt port", () => {
    const r = decidirOncologia(caso({ duracion: "D1" }));
    expect(r.main).toBe("PICC");
    expect(r.alt).toContain("Port");
  });
});
