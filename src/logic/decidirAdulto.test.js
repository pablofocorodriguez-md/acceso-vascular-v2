import { describe, it, expect } from "vitest";
import { decidirAdulto } from "./decidirAdulto.js";

// Helper — builds minimal input
function caso(overrides) {
  return {
    duracion: "D1",
    terapias: ["estandar"],
    venas: "V1",
    hemodinamico: false,
    irc: false,
    doubleLumen: false,
    ...overrides,
  };
}

// ── Existing-rule smoke tests ──────────────────────────────────────

describe("reglas existentes (smoke)", () => {
  it("C1 — D1 + estándar + V1 → VVP", () => {
    const r = decidirAdulto(caso());
    expect(r.main).toBe("Vía venosa periférica (VVP)");
  });

  it("C5 — D3 + estándar + V1 → PICC con alternativa midline", () => {
    const r = decidirAdulto(caso({ duracion: "D3", terapias: ["estandar"], venas: "V1" }));
    expect(r.main).toBe("PICC");
    expect(r.alt).toContain("Midline");
  });

  it("C6 — D4 + estándar + V1 → PICC o Hickman", () => {
    const r = decidirAdulto(caso({ duracion: "D4", terapias: ["estandar"], venas: "V1" }));
    expect(r.main).toBe("PICC o Hickman");
  });

  it("D1 + requiereCentral → PICC o CVC", () => {
    const r = decidirAdulto(caso({ duracion: "D1", terapias: ["npt"] }));
    expect(r.main).toBe("PICC o CVC no tunelizado");
  });

  it("D2 + requiereCentral → PICC", () => {
    const r = decidirAdulto(caso({ duracion: "D2", terapias: ["ph"] }));
    expect(r.main).toBe("PICC");
    expect(r.source).toContain("ASPEN 2016");
  });
});

// ── Bug-fix: D3/D4 + requiereCentral ──────────────────────────────

describe("D3 + requiereCentral (bug fix)", () => {
  it("D3 + npt + V1 → PICC sin alternativa midline", () => {
    const r = decidirAdulto(caso({ duracion: "D3", terapias: ["npt"], venas: "V1" }));
    expect(r.main).toBe("PICC");
    expect(r.alt).toBeNull();
    expect(r.source).toContain("ASPEN 2016");
  });

  it("D3 + ph + V2 → PICC sin alternativa midline", () => {
    const r = decidirAdulto(caso({ duracion: "D3", terapias: ["ph"], venas: "V2" }));
    expect(r.main).toBe("PICC");
    expect(r.alt).toBeNull();
  });
});

describe("D4 + requiereCentral (bug fix)", () => {
  it("D4 + npt + V1 → PICC o Hickman", () => {
    const r = decidirAdulto(caso({ duracion: "D4", terapias: ["npt"], venas: "V1" }));
    expect(r.main).toBe("PICC o Hickman");
    expect(r.source).toContain("ASPEN 2016");
  });

  it("D4 + ph + V3 → PICC o Hickman", () => {
    const r = decidirAdulto(caso({ duracion: "D4", terapias: ["ph"], venas: "V3" }));
    expect(r.main).toBe("PICC o Hickman");
    expect(r.alt).toBe("Hickman preferible si duración > 6 meses");
  });
});

// ── Bug-fix: D2 + estándar + irritante → PICC (no Midline) ────────

describe("D2 + irritante prevalece sobre estándar (bug fix)", () => {
  it("D2 + [estandar, irritante] + V1 → PICC (no Midline)", () => {
    const r = decidirAdulto(caso({ duracion: "D2", terapias: ["estandar", "irritante"], venas: "V1" }));
    expect(r.main).toBe("PICC");
    expect(r.source).toContain("INS 2021");
  });

  it("D2 + [estandar, irritante] + V2 → PICC (no Midline)", () => {
    const r = decidirAdulto(caso({ duracion: "D2", terapias: ["estandar", "irritante"], venas: "V2" }));
    expect(r.main).toBe("PICC");
  });

  it("D2 + [irritante] + V1 → PICC", () => {
    const r = decidirAdulto(caso({ duracion: "D2", terapias: ["irritante"], venas: "V1" }));
    expect(r.main).toBe("PICC");
  });
});

// ── Non-regression: C3/C5 still work for estándar ─────────────────

describe("no-regression estándar", () => {
  it("D2 + estándar + V1 → Midline (C3 sin romper)", () => {
    const r = decidirAdulto(caso({ duracion: "D2", terapias: ["estandar"], venas: "V1" }));
    expect(r.main).toBe("Midline");
  });

  it("D3 + estándar + V1 → PICC con alternativa midline (C5 sin romper)", () => {
    const r = decidirAdulto(caso({ duracion: "D3", terapias: ["estandar"], venas: "V1" }));
    expect(r.main).toBe("PICC");
    expect(r.alt).toContain("Midline");
    expect(r.note).toContain("Paje");
  });
});

// ── Bloque A — Hemodinámico ───────────────────────────────────────

describe("Bloque A — hemodinámico", () => {
  it("A1 — hemodinámico → CVC yugular", () => {
    const r = decidirAdulto(caso({ hemodinamico: true }));
    expect(r.main).toBe("CVC no tunelizado — yugular");
    expect(r.servicio).toBe("Angiografía");
    expect(r.alt).toContain("subclavia");
  });

  it("A1 — hemodinámico + D1 → CVC sin bridge", () => {
    const r = decidirAdulto(caso({ hemodinamico: true, duracion: "D1" }));
    expect(r.main).toBe("CVC no tunelizado — yugular");
    expect(r.bridge).toBeNull();
  });

  it("A1 — hemodinámico + D3 → CVC con bridge", () => {
    const r = decidirAdulto(caso({ hemodinamico: true, duracion: "D3" }));
    expect(r.main).toBe("CVC no tunelizado — yugular");
    expect(r.bridge).not.toBeNull();
    expect(r.bridge.main).toBe("PICC");
  });

  it("A1 — hemodinámico + D4 → CVC con bridge PICC/Hickman", () => {
    const r = decidirAdulto(caso({ hemodinamico: true, duracion: "D4" }));
    expect(r.bridge).not.toBeNull();
    expect(r.bridge.main).toBe("PICC o Hickman");
  });
});

// ── C0 — D1 + irritante ──────────────────────────────────────────

describe("C0 — D1 + irritante", () => {
  it("D1 + irritante + V1 → PICC (no VVP)", () => {
    const r = decidirAdulto(caso({ terapias: ["irritante"], venas: "V1" }));
    expect(r.main).toBe("PICC");
  });

  it("D1 + irritante + V3 → PICC (C0 prevalece sobre C2)", () => {
    const r = decidirAdulto(caso({ terapias: ["irritante"], venas: "V3" }));
    expect(r.main).toBe("PICC");
  });

  it("D1 + [estandar, irritante] + V1 → PICC (irritante prevalece)", () => {
    const r = decidirAdulto(caso({ terapias: ["estandar", "irritante"], venas: "V1" }));
    expect(r.main).toBe("PICC");
  });
});

// ── C2 — D1 + estándar + venas difíciles ─────────────────────────

describe("C2 — D1 + estándar + venas difíciles", () => {
  it("D1 + estándar + V2 → Midline", () => {
    const r = decidirAdulto(caso({ venas: "V2" }));
    expect(r.main).toBe("Midline");
  });

  it("D1 + estándar + V3 → Midline", () => {
    const r = decidirAdulto(caso({ venas: "V3" }));
    expect(r.main).toBe("Midline");
  });
});

// ── C3b — D2 + estándar + V3 ─────────────────────────────────────

describe("C3b — D2 + estándar + V3", () => {
  it("D2 + estándar + V3 → Midline con alt PICC", () => {
    const r = decidirAdulto(caso({ duracion: "D2", venas: "V3" }));
    expect(r.main).toBe("Midline");
    expect(r.alt).toContain("PICC");
  });
});

// ── Warnings IRC y doble lumen ────────────────────────────────────

describe("warnings", () => {
  it("IRC + PICC → warning nefrología", () => {
    const r = decidirAdulto(caso({ duracion: "D2", terapias: ["irritante"], irc: true }));
    expect(r.main).toBe("PICC");
    expect(r.warnings.length).toBeGreaterThan(0);
    expect(r.warnings.some(w => w.includes("IRC") || w.includes("Nefrolog"))).toBe(true);
  });

  it("doble lumen + PICC → warning educativo", () => {
    const r = decidirAdulto(caso({ duracion: "D2", terapias: ["irritante"], doubleLumen: true }));
    expect(r.main).toBe("PICC");
    expect(r.warnings.some(w => w.includes("doble lumen") || w.includes("incompatible"))).toBe(true);
  });

  it("IRC + VVP → sin warning (solo aplica a PICC)", () => {
    const r = decidirAdulto(caso({ irc: true }));
    expect(r.main).toBe("Vía venosa periférica (VVP)");
    expect(r.warnings.length).toBe(0);
  });
});

// ── Edge cases ────────────────────────────────────────────────────

describe("edge cases", () => {
  it("inputs vacíos → resultado vacío", () => {
    const r = decidirAdulto({});
    expect(r.main).toBeNull();
  });

  it("terapias vacío → resultado vacío", () => {
    const r = decidirAdulto(caso({ terapias: [] }));
    expect(r.main).toBeNull();
  });

  it("sin venas → resultado vacío", () => {
    const r = decidirAdulto(caso({ venas: null }));
    expect(r.main).toBeNull();
  });
});
