import { Logger } from '@nestjs/common';
import { Patient } from '@prisma/client';
import * as fs from 'fs/promises';
import * as path from 'path';
import puppeteer from 'puppeteer';
import { formatDateUzbekLocale } from 'utils/formatDate';

// dummycomment !DONT DELETE!
export async function generateLabResultsPDF(patient: Patient & { labResults: any[] }) {
  Logger.log(patient);

  // Build an absolute path to the logo image using process.cwd()
  const logoPath = path.join(process.cwd(), 'public', 'login-logo.png');
  // Load the logo image and convert it to a Base64-encoded string.
  const logoBuffer = await fs.readFile(logoPath);
  const logoBase64 = logoBuffer.toString('base64');

  const htmlContent = `
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      .header { text-align: center; margin-bottom: 20px; }
      .header img { max-width: 200px; }
      h2 { text-align: center; color: #444; }
      .test-container { 
        margin-bottom: 20px; 
        page-break-after: always; 
      }
      .test-container:last-child { 
        page-break-after: auto; 
      }
      table { width: 100%; border-collapse: collapse; margin-top: 10px; }
      th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
      th { background-color: #f4f4f4; }
    </style>
  </head>
  <body>
    <div class="header">
      <img src="data:image/png;base64,${logoBase64}" alt="Logo" />
    </div>
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
          ${test?.groupResults
            ?.map(
              (result) => `
            <tr>
              <td>${result.display}</td>
              <td>${result.value} ${`(${result.units})` || ''}</td>
              <td>${result.hiNormal || '-'}</td>
              <td>${result.lowNormal || '-'}</td>
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

  // Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();

  // Define a temporary file path.
  const pdfPath: string = `./lab_results_${patient.id}.pdf`;

  // Write the PDF file.
  await fs.writeFile(pdfPath, pdfBuffer);

  // Read the file back as a Buffer (this is what you'll use as the source).
  const fileBuffer: Buffer = await fs.readFile(pdfPath);

  // Delete the temporary file.
  await fs.unlink(pdfPath);

  // Return the file Buffer so that "source" is a Buffer, not a string.
  return fileBuffer;
}
