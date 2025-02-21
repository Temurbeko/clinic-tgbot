import puppeteer from 'puppeteer';
import * as fs from 'fs/promises';

export async function generateLabResultsPDF(patient) {
  const htmlContent = `
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      h2 { text-align: center; color: #444; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
      th { background-color: #f4f4f4; }
    </style>
  </head>
  <body>
    <h2>${patient.firstName}, Sizning labaratoriya natijalaringiz</h2>
    <table>
      <tr>
        <th>Nomi</th>
        <th>Holati</th>
        <th>Natija</th>
        <th>Topshirilgan</th>
        <th>O'zgargan</th>
      </tr>
      ${patient.labResults
        .map(
          (lr) => `
        <tr>
          <td>${lr.name}</td>
          <td>${lr.status}</td>
          <td>${lr.result}</td>
          <td>${formatDateUzbekLocale(lr.createdDate)}</td>
          <td>${formatDateUzbekLocale(lr.updatedDate)}</td>
        </tr>
      `,
        )
        .join('')}
    </table>
  </body>
  </html>
  `;

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  
  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();

  const pdfPath = `./lab_results_${patient.id}.pdf`;
  await fs.writeFile(pdfPath, Buffer.from(pdfBuffer));

  return pdfPath;
}

function formatDateUzbekLocale(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
