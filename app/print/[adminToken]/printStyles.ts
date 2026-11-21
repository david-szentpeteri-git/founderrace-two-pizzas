/**
 * Print styles for the badges and intro cards. Kept as a plain string and
 * injected with a <style> tag so @page and @media print work without any
 * CSS module rules. Every class is prefixed "pv-" to avoid clashes.
 */
export const printCss = `
@page { size: A4; margin: 10mm; }

.pv-root { color: #000; background: #fff; }
.pv-root * { box-sizing: border-box; }

.pv-bar {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
  gap: 16px; padding: 20px 24px; margin-bottom: 24px;
  border: 1px solid #e4e4e7; border-radius: 16px; font-size: 14px; line-height: 1.5;
  background: #fafafa; color: #18181b;
}
.pv-bar p { margin: 0; }

.pv-section-title { font-size: 18px; font-weight: 600; margin: 0 0 12px; }
.pv-note {
  border: 1px dashed #a1a1aa; border-radius: 12px; padding: 16px;
  font-size: 15px; line-height: 1.5; margin: 0 0 24px;
}

/* One A4 sheet content box: 210 x 297 minus 10mm margins = 190 x 277 mm. */
.pv-sheet { width: 190mm; max-width: 100%; margin: 0 auto 24px; display: grid; gap: 0; }
.pv-sheet-badges { grid-template-columns: 1fr 1fr; grid-template-rows: repeat(4, 69mm); }
.pv-sheet-cards { grid-template-columns: 1fr; grid-template-rows: repeat(4, 69mm); }

.pv-badge, .pv-card {
  break-inside: avoid; page-break-inside: avoid;
  border: 0.3mm dashed #71717a; overflow: hidden; min-width: 0;
}

.pv-badge {
  padding: 6mm; display: flex; flex-direction: column; justify-content: center; gap: 2mm;
  text-align: center;
}
.pv-badge-number { font-size: 26mm; line-height: 1; font-weight: 700; }
.pv-badge-name {
  font-size: 7mm; line-height: 1.15; font-weight: 600;
  overflow-wrap: anywhere; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.pv-badge-role {
  font-size: 4mm; line-height: 1.25;
  overflow-wrap: anywhere; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.pv-badge-ask {
  font-size: 3.6mm; line-height: 1.3; margin-top: 1mm;
  overflow-wrap: anywhere; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}

.pv-card { padding: 4mm 5mm; display: flex; flex-direction: column; gap: 2mm; }
.pv-card-head {
  display: flex; align-items: baseline; gap: 3mm; border-bottom: 0.3mm solid #000; padding-bottom: 1.5mm;
}
.pv-card-number { font-size: 7mm; font-weight: 700; line-height: 1; flex: none; }
.pv-card-name {
  font-size: 5mm; font-weight: 600; line-height: 1.2; min-width: 0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.pv-card-sub {
  font-size: 3mm; margin-left: auto; flex: 0 1 auto; max-width: 40%; min-width: 0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.pv-hellos { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 3mm; flex: 1; min-height: 0; }
.pv-hello { min-width: 0; overflow: hidden; font-size: 3.1mm; line-height: 1.3; }
.pv-hello-who {
  font-weight: 600; font-size: 3.6mm;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.pv-hello-reason {
  margin: 1mm 0 0; overflow-wrap: anywhere;
  display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical; overflow: hidden;
}
.pv-hello-opener {
  margin: 1.5mm 0 0; font-style: italic; overflow-wrap: anywhere;
  display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;
}
.pv-empty-hellos { font-size: 3.4mm; }

.pv-break { break-after: page; page-break-after: always; }

@media screen {
  .pv-sheet { box-shadow: 0 0 0 1px #e4e4e7; }
}

.pv-sparks {
  width: 190mm; max-width: 100%; margin: 0 auto 24px; padding: 4mm 5mm;
  border: 0.3mm dashed #71717a; break-inside: avoid; page-break-inside: avoid;
}
.pv-sparks-title { font-size: 5mm; font-weight: 600; line-height: 1.2; margin-bottom: 2mm; }
.pv-sparks-list { margin: 0; padding-left: 5mm; font-size: 3.6mm; line-height: 1.4; }
.pv-sparks-list li { margin-bottom: 1.5mm; }
.pv-sparks-source { color: #52525b; }
.pv-sparks-note { font-size: 3mm; color: #52525b; margin-top: 1mm; }

@media print {
  html, body { background: #fff !important; color: #000 !important; }
  .pv-no-print { display: none !important; }
  /* Hide site chrome from the shared layout, if any. */
  body > header, body > footer, body > nav, .site-header, .site-footer { display: none !important; }
  .pv-root { padding: 0 !important; margin: 0 !important; max-width: none !important; }
  .pv-sheet { margin: 0; box-shadow: none; }
  .pv-section-title { display: none; }
  * { -webkit-print-color-adjust: economy; print-color-adjust: economy; }
}
`;
