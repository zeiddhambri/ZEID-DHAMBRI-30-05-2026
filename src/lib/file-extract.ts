import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import mammoth from 'mammoth';

export type ExtractedDossier = {
  debtor_name: string;
  debtor_email?: string;
  debtor_phone?: string;
  amount: number;
  due_date?: string;
};

async function readPdfText(file: File): Promise<string> {
  const pdfjs: any = await import('pdfjs-dist');
  // @ts-ignore
  const workerSrc = (await import('pdfjs-dist/build/pdf.worker.mjs?url')).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
  const buf = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buf }).promise;
  let txt = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    txt += content.items.map((it: any) => it.str).join(' ') + '\n';
  }
  return txt;
}

export async function fileToText(file: File): Promise<{ text: string; isTabular: boolean }> {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (ext === 'pdf') return { text: await readPdfText(file), isTabular: false };
  if (ext === 'docx') {
    const buf = await file.arrayBuffer();
    const r = await mammoth.extractRawText({ arrayBuffer: buf });
    return { text: r.value, isTabular: false };
  }
  if (ext === 'csv') {
    const text = await file.text();
    return { text, isTabular: true };
  }
  if (ext === 'xlsx' || ext === 'xls') {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: 'array' });
    let out = '';
    wb.SheetNames.forEach((n) => {
      const csv = XLSX.utils.sheet_to_csv(wb.Sheets[n]);
      out += `# Feuille: ${n}\n${csv}\n`;
    });
    return { text: out, isTabular: true };
  }
  return { text: await file.text(), isTabular: false };
}
