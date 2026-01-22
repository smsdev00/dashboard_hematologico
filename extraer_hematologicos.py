#!/usr/bin/env python3
"""
Extrae datos de estudios hematológicos del Área de Hematología y Hemoterapia
del Hospital Italiano de La Plata.
"""

import json
import re
from pathlib import Path

import pdfplumber


def extraer_texto_pdf(pdf_path: str) -> str:
    """Extrae todo el texto de un PDF."""
    texto = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            texto += page.extract_text() or ""
    return texto


def es_hematologico_area_hematologia(texto: str) -> bool:
    """Verifica si es un estudio hematológico del Área de Hematología."""
    return (
        "ESTUDIO HEMATOLOGICO DE SANGRE PERIFERICA" in texto
        and "Area de Hematología y Hemoterapia" in texto
    )


def extraer_valor(texto: str, patron: str, grupo: int = 1) -> float | None:
    """Extrae un valor numérico usando regex."""
    match = re.search(patron, texto)
    if match:
        valor = match.group(grupo).replace(",", ".")
        if valor == "-":
            return None
        try:
            return float(valor)
        except ValueError:
            return None
    return None


def extraer_datos_hematologicos(texto: str, archivo: str) -> dict | None:
    """Extrae los datos de un estudio hematológico."""

    # Extraer metadatos
    protocolo_match = re.search(r"Protocolo:\s*(\d+)", texto)
    fecha_match = re.search(r"Fecha:\s*(\d{2}/\d{2}/\d{4})", texto)
    hora_match = re.search(r"(\d{1,2}:\d{2})\s*Hs", texto)
    paciente_match = re.search(r"Paciente:\s*([A-ZÁÉÍÓÚÑ\s,]+?)(?:\s+Fecha:|\s+\d)", texto)
    medico_match = re.search(r"Médico Solicitante:\s*(.+?)(?:\s+Protocolo:|\s*$)", texto)

    if not protocolo_match:
        return None

    # Convertir fecha a formato ISO
    fecha_iso = None
    if fecha_match:
        dia, mes, anio = fecha_match.group(1).split("/")
        fecha_iso = f"{anio}-{mes}-{dia}"

    datos = {
        "protocolo": protocolo_match.group(1),
        "fecha": fecha_iso,
        "hora": hora_match.group(1) if hora_match else None,
        "paciente": paciente_match.group(1).strip() if paciente_match else None,
        "medico_solicitante": medico_match.group(1).strip() if medico_match else None,
        "serie_roja": {
            "eritrocitos": extraer_valor(texto, r"Eritrocitos[:\s]*([\d.,]+)"),
            "hemoglobina": extraer_valor(texto, r"Hemoglobina[:\s]*([\d.,]+)"),
            "hematocrito": extraer_valor(texto, r"Hematocrito[:\s]*([\d.,]+)"),
            "vcm": extraer_valor(texto, r"VCM[:\s]*([\d.,]+)"),
            "reticulocitos": extraer_valor(texto, r"Reticulocitos[:\s]*([\d.,-]+)"),
        },
        "serie_blanca": {
            "leucocitos": extraer_valor(texto, r"Leucocitos[:\s]*([\d.,]+)"),
            "pmns": extraer_valor(texto, r"PMNs[:\s]*([\d.,]+)"),
            "eosinofilos": extraer_valor(texto, r"Eosin[oó]filos[:\s]*([\d.,]+)"),
            "basofilos": extraer_valor(texto, r"Basofilos[:\s]*([\d.,]+)"),
            "linfocitos": extraer_valor(texto, r"Linfocitos[:\s]*([\d.,]+)"),
            "monocitos": extraer_valor(texto, r"Monocitos[:\s]*([\d.,]+)"),
        },
        "plaquetas": extraer_valor(texto, r"PLAQUETAS[:\s]*([\d.,]+)"),
        "eritrosedimentacion": extraer_valor(texto, r"ERITROSEDIMENTACION 1er Hora[:\s]*([\d.,]+)"),
    }

    return datos


def main():
    directorio = Path(__file__).parent / "pdfs_laboratorio"
    salida = Path(__file__).parent / "resultados_hematologicos.json"

    estudios = []
    descartados = []

    for pdf_path in sorted(directorio.glob("*.pdf")):
        print(f"Procesando: {pdf_path.name}...")

        texto = extraer_texto_pdf(pdf_path)

        if not es_hematologico_area_hematologia(texto):
            descartados.append(pdf_path.name)
            print(f"  -> DESCARTADO (no es hematológico del Área de Hematología)")
            continue

        datos = extraer_datos_hematologicos(texto, pdf_path.name)

        if datos:
            estudios.append(datos)
            print(f"  -> OK (Protocolo: {datos['protocolo']}, Fecha: {datos['fecha']})")
        else:
            descartados.append(pdf_path.name)
            print(f"  -> ERROR al extraer datos")

    # Ordenar por fecha
    estudios.sort(key=lambda x: x["fecha"] or "")

    resultado = {"estudios": estudios}

    with open(salida, "w", encoding="utf-8") as f:
        json.dump(resultado, f, ensure_ascii=False, indent=2)

    print(f"\n{'='*50}")
    print(f"Procesados: {len(estudios)} estudios hematológicos")
    print(f"Descartados: {len(descartados)} archivos")
    if descartados:
        for d in descartados:
            print(f"  - {d}")
    print(f"\nResultado guardado en: {salida}")


if __name__ == "__main__":
    main()
