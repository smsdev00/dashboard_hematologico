export interface SerieRoja {
  eritrocitos: number | null;
  hemoglobina: number | null;
  hematocrito: number | null;
  vcm: number | null;
  reticulocitos: number | null;
}

export interface SerieBlanca {
  leucocitos: number | null;
  pmns: number | null;
  eosinofilos: number | null;
  basofilos: number | null;
  linfocitos: number | null;
  monocitos: number | null;
}

export interface Estudio {
  protocolo: string;
  fecha: string;
  hora: string;
  paciente: string;
  medico_solicitante: string;
  serie_roja: SerieRoja;
  serie_blanca: SerieBlanca;
  plaquetas: number | null;
  eritrosedimentacion: number | null;
}

export const estudios: Estudio[] = [
  {
    "protocolo": "1674054",
    "fecha": "2025-02-13",
    "hora": "8:05",
    "paciente": "SCARANO, SEBASTIAN MIGUEL",
    "medico_solicitante": "Prates María Virginia",
    "serie_roja": {
      "eritrocitos": 6.74,
      "hemoglobina": 17.9,
      "hematocrito": 60.1,
      "vcm": 89.3,
      "reticulocitos": null
    },
    "serie_blanca": {
      "leucocitos": 19.4,
      "pmns": 90.0,
      "eosinofilos": 0.0,
      "basofilos": 0.0,
      "linfocitos": 5.0,
      "monocitos": 5.0
    },
    "plaquetas": 446.0,
    "eritrosedimentacion": 1.0
  },
  {
    "protocolo": "1698045",
    "fecha": "2025-04-15",
    "hora": "9:43",
    "paciente": "SCARANO, SEBASTIAN MIGUEL",
    "medico_solicitante": "Prates María Virginia",
    "serie_roja": {
      "eritrocitos": 6.63,
      "hemoglobina": 18.1,
      "hematocrito": 59.0,
      "vcm": 89.0,
      "reticulocitos": null
    },
    "serie_blanca": {
      "leucocitos": 18.0,
      "pmns": 83.0,
      "eosinofilos": 0.0,
      "basofilos": 2.0,
      "linfocitos": 8.0,
      "monocitos": 7.0
    },
    "plaquetas": 362.0,
    "eritrosedimentacion": 1.0
  },
  {
    "protocolo": "1700361",
    "fecha": "2025-04-22",
    "hora": "10:05",
    "paciente": "SCARANO, SEBASTIAN MIGUEL",
    "medico_solicitante": "Szelagowski Maria Milagros",
    "serie_roja": {
      "eritrocitos": 5.97,
      "hemoglobina": 16.4,
      "hematocrito": 53.7,
      "vcm": 89.9,
      "reticulocitos": null
    },
    "serie_blanca": {
      "leucocitos": 15.7,
      "pmns": 86.0,
      "eosinofilos": 0.0,
      "basofilos": 1.0,
      "linfocitos": 9.0,
      "monocitos": 3.0
    },
    "plaquetas": 429.0,
    "eritrosedimentacion": null
  },
  {
    "protocolo": "1709523",
    "fecha": "2025-05-15",
    "hora": "8:48",
    "paciente": "SCARANO, SEBASTIAN MIGUEL",
    "medico_solicitante": "Prates María Virginia",
    "serie_roja": {
      "eritrocitos": 5.56,
      "hemoglobina": 15.9,
      "hematocrito": 51.4,
      "vcm": 92.5,
      "reticulocitos": null
    },
    "serie_blanca": {
      "leucocitos": 25.8,
      "pmns": 90.0,
      "eosinofilos": 0.0,
      "basofilos": 0.0,
      "linfocitos": 9.0,
      "monocitos": 1.0
    },
    "plaquetas": 443.0,
    "eritrosedimentacion": 3.0
  },
  {
    "protocolo": "1728935",
    "fecha": "2025-07-04",
    "hora": "9:02",
    "paciente": "SCARANO, SEBASTIAN MIGUEL",
    "medico_solicitante": "Szelagowski Maria Milagros",
    "serie_roja": {
      "eritrocitos": 6.08,
      "hemoglobina": 17.1,
      "hematocrito": 53.9,
      "vcm": 88.7,
      "reticulocitos": null
    },
    "serie_blanca": {
      "leucocitos": 32.2,
      "pmns": 90.0,
      "eosinofilos": 0.0,
      "basofilos": 0.0,
      "linfocitos": 10.0,
      "monocitos": 0.0
    },
    "plaquetas": 584.0,
    "eritrosedimentacion": 1.0
  },
  {
    "protocolo": "1733809",
    "fecha": "2025-07-17",
    "hora": "8:16",
    "paciente": "SCARANO, SEBASTIAN MIGUEL",
    "medico_solicitante": "Prates María Virginia",
    "serie_roja": {
      "eritrocitos": 5.69,
      "hemoglobina": 16.0,
      "hematocrito": 50.1,
      "vcm": 88.0,
      "reticulocitos": null
    },
    "serie_blanca": {
      "leucocitos": 31.2,
      "pmns": 88.0,
      "eosinofilos": 0.0,
      "basofilos": 0.0,
      "linfocitos": 7.0,
      "monocitos": 5.0
    },
    "plaquetas": 601.0,
    "eritrosedimentacion": 1.0
  },
  {
    "protocolo": "1752518",
    "fecha": "2025-09-04",
    "hora": "8:06",
    "paciente": "SCARANO, SEBASTIAN MIGUEL",
    "medico_solicitante": "Prates María Virginia",
    "serie_roja": {
      "eritrocitos": 6.02,
      "hemoglobina": 17.0,
      "hematocrito": 52.0,
      "vcm": 86.4,
      "reticulocitos": null
    },
    "serie_blanca": {
      "leucocitos": 17.5,
      "pmns": 87.0,
      "eosinofilos": 0.0,
      "basofilos": 0.0,
      "linfocitos": 10.0,
      "monocitos": 3.0
    },
    "plaquetas": 294.0,
    "eritrosedimentacion": 1.0
  },
  {
    "protocolo": "1760988",
    "fecha": "2025-09-25",
    "hora": "9:54",
    "paciente": "SCARANO, SEBASTIAN MIGUEL",
    "medico_solicitante": "Prates María Virginia",
    "serie_roja": {
      "eritrocitos": 5.33,
      "hemoglobina": 15.3,
      "hematocrito": 46.2,
      "vcm": 86.7,
      "reticulocitos": null
    },
    "serie_blanca": {
      "leucocitos": 10.5,
      "pmns": 80.0,
      "eosinofilos": 0.0,
      "basofilos": 0.0,
      "linfocitos": 20.0,
      "monocitos": 0.0
    },
    "plaquetas": 232.0,
    "eritrosedimentacion": 2.0
  },
  {
    "protocolo": "1779751",
    "fecha": "2025-11-12",
    "hora": "8:56",
    "paciente": "SCARANO, SEBASTIAN MIGUEL",
    "medico_solicitante": "Milone Jorge Horacio",
    "serie_roja": {
      "eritrocitos": 3.15,
      "hemoglobina": 10.3,
      "hematocrito": 27.8,
      "vcm": 88.3,
      "reticulocitos": null
    },
    "serie_blanca": {
      "leucocitos": 4.31,
      "pmns": 70.0,
      "eosinofilos": 0.0,
      "basofilos": 0.0,
      "linfocitos": 30.0,
      "monocitos": 0.0
    },
    "plaquetas": 233.0,
    "eritrosedimentacion": 18.0
  },
  {
    "protocolo": "1805765",
    "fecha": "2026-01-21",
    "hora": "8:44",
    "paciente": "SCARANO, SEBASTIAN MIGUEL",
    "medico_solicitante": "Milone Jorge Horacio",
    "serie_roja": {
      "eritrocitos": 2.44,
      "hemoglobina": 9.9,
      "hematocrito": 26.3,
      "vcm": 108.0,
      "reticulocitos": null
    },
    "serie_blanca": {
      "leucocitos": 4.67,
      "pmns": 80.0,
      "eosinofilos": 0.0,
      "basofilos": 0.0,
      "linfocitos": 14.0,
      "monocitos": 6.0
    },
    "plaquetas": 130.0,
    "eritrosedimentacion": 4.0
  }
];

// Valores normales de referencia
export const valoresNormales = {
  eritrocitos: { min: 4.5, max: 5.9, unidad: 'x10¹²/L' },
  hemoglobina: { min: 13, max: 17, unidad: 'g/dL' },
  hematocrito: { min: 40, max: 50, unidad: '%' },
  vcm: { min: 80, max: 100, unidad: 'fL' },
  leucocitos: { min: 4, max: 11, unidad: 'x10⁹/L' },
  plaquetas: { min: 150, max: 400, unidad: 'x10⁹/L' },
  eritrosedimentacion: { min: 0, max: 15, unidad: 'mm/h' },
  pmns: { min: 55, max: 70, unidad: '%' },
  linfocitos: { min: 20, max: 40, unidad: '%' },
  monocitos: { min: 2, max: 8, unidad: '%' },
  eosinofilos: { min: 1, max: 4, unidad: '%' },
  basofilos: { min: 0, max: 1, unidad: '%' },
};

export type MetricKey = keyof typeof valoresNormales;
