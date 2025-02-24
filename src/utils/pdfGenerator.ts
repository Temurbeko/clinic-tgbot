import { Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import puppeteer from 'puppeteer';
import { formatDateUzbekLocale } from 'utils/formatDate';

export async function generateLabResultsPDF(patient) {
  Logger.log(patient);

  const htmlContent = `
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      h2 { text-align: center; color: #444; }
      .test-container { margin-bottom: 20px; }
      table { width: 100%; border-collapse: collapse; margin-top: 10px; }
      th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
      th { background-color: #f4f4f4; }
    </style>
  </head>
  <body>
    <h2>${patient.firstName}, Sizning laboratoriya natijalaringiz</h2>
    ${patient.labResults
      .reverse()
      .map(
        (test) => `
      <div class="test-container">
        <h3>${test.name}</h3>
        <p>Shifokor ko'rsatmasi: ${test.status}</p>
        <p>Analiz topshirgan vaqti: ${formatDateUzbekLocale(test.createdDate)}</p>
        <p>Natija berilgan vaqti: ${formatDateUzbekLocale(test.updatedDate)}</p>
        <table>
          <tr>
            <th>Ko'rsatkichlari</th>
            <th>Qiymat</th>
            <th>Normal qiymat</th>
            <th>Minimal sog'lom qiymat</th>
          </tr>
          ${test.groupResults
            .map(
              (result) => `
            <tr>
              <td>${result.display}</td>
              <td>${result.value} (${result.units})</td>
              <td>${result.hiNormal || ''}</td>
              <td>${result.lowNormal || ''}</td>
            </tr>
          `,
            )
            .join('')}
        </table>
      </div>
    `,
      )
      .join('')}
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