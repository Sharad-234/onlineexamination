/**
 * pdfService.js
 * 
 * Generates an official PDF application copy using PDFKit.
 * The PDF includes applicant photo, personal info, academic info,
 * exam details, payment information, and professional formatting.
 * The PDF is saved to uploads/pdfs/ and the file path is returned.
 */

const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

/**
 * Generates a PDF for the given application.
 * @param {Object} application - The application document from MongoDB
 * @returns {Promise<string>} - The file path of the generated PDF
 */
const generateApplicationPDF = async (application) => {
  return new Promise((resolve, reject) => {
    try {
      const pdfDir = path.join(__dirname, '../../uploads/pdfs');
      if (!fs.existsSync(pdfDir)) {
        fs.mkdirSync(pdfDir, { recursive: true });
      }

      const pdfPath = path.join(pdfDir, `${application.applicationId}.pdf`);
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        info: {
          Title: `Application - ${application.applicationId}`,
          Author: 'Examination Registration System',
          Subject: 'Online Examination Application',
        },
      });

      const stream = fs.createWriteStream(pdfPath);
      doc.pipe(stream);

      const pageWidth = doc.page.width - 100; // margins

      // ============ HEADER ============
      doc
        .fontSize(18)
        .font('Helvetica-Bold')
        .text('EXAMINATION REGISTRATION AUTHORITY', { align: 'center' });
      doc.moveDown(0.3);
      doc
        .fontSize(14)
        .font('Helvetica')
        .text('ONLINE EXAMINATION APPLICATION FORM', { align: 'center' });

      // Header line
      doc.moveDown(0.5);
      doc
        .moveTo(50, doc.y)
        .lineTo(50 + pageWidth, doc.y)
        .strokeColor('#333333')
        .lineWidth(1.5)
        .stroke();
      doc.moveDown(0.8);

      // ============ APPLICATION ID ============
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text(`Application ID: ${application.applicationId}`, { align: 'center' });
      doc.moveDown(0.8);

      // ============ APPLICANT PHOTO ============
      const photoPath = path.join(__dirname, '../../', application.photo);
      let photoY = doc.y;
      const photoX = 50;
      const photoSize = 100;

      if (fs.existsSync(photoPath)) {
        doc
          .save()
          .rect(photoX, photoY, photoSize, photoSize)
          .stroke('#999999');
        doc.image(photoPath, photoX, photoY, { width: photoSize, height: photoSize });
        doc.restore();
      } else {
        doc
          .save()
          .rect(photoX, photoY, photoSize, photoSize)
          .stroke('#999999');
        doc
          .fontSize(10)
          .font('Helvetica')
          .fillColor('#999999')
          .text('Photo Not\nAvailable', photoX, photoY + 35, { width: photoSize, align: 'center' });
        doc.fillColor('#000000');
        doc.restore();
      }

      // ============ PERSONAL INFORMATION ============
      const infoX = photoX + photoSize + 20;
      const infoWidth = pageWidth - photoSize - 20;

      doc.fontSize(13).font('Helvetica-Bold').text('PERSONAL INFORMATION', infoX, photoY);
      doc.moveDown(0.5);

      const addField = (label, value, x, y, width) => {
        doc.fontSize(10).font('Helvetica-Bold').text(`${label}:`, x, y);
        doc.fontSize(10).font('Helvetica').text(value || 'N/A', x, y + 14, { width });
        return y + 34;
      };

      let fieldY = doc.y;
      fieldY = addField('Full Name', application.fullName, infoX, fieldY, infoWidth);
      fieldY = addField('Email', application.email, infoX, fieldY, infoWidth);
      fieldY = addField('Phone', application.phone, infoX, fieldY, infoWidth);

      doc.y = Math.max(photoY + photoSize + 15, fieldY + 10);

      // Separator line
      doc.moveDown(0.3);
      doc
        .moveTo(50, doc.y)
        .lineTo(50 + pageWidth, doc.y)
        .strokeColor('#CCCCCC')
        .lineWidth(0.5)
        .stroke();
      doc.moveDown(0.8);

      // ============ ACADEMIC INFORMATION ============
      doc.fontSize(13).font('Helvetica-Bold').text('ACADEMIC INFORMATION');
      doc.moveDown(0.5);

      doc.fontSize(10).font('Helvetica-Bold').text('Course / Program:');
      doc.fontSize(10).font('Helvetica').text(application.course || 'N/A');
      doc.moveDown(0.3);

      doc.fontSize(10).font('Helvetica-Bold').text('College / School:');
      doc.fontSize(10).font('Helvetica').text(application.college || 'N/A');
      doc.moveDown(0.8);

      // Separator
      doc
        .moveTo(50, doc.y)
        .lineTo(50 + pageWidth, doc.y)
        .strokeColor('#CCCCCC')
        .lineWidth(0.5)
        .stroke();
      doc.moveDown(0.8);

      // ============ EXAMINATION DETAILS ============
      doc.fontSize(13).font('Helvetica-Bold').text('EXAMINATION DETAILS');
      doc.moveDown(0.5);

      doc.fontSize(10).font('Helvetica-Bold').text('Examination:');
      doc.fontSize(10).font('Helvetica').text(application.examName || 'N/A');
      doc.moveDown(0.3);

      doc.fontSize(10).font('Helvetica-Bold').text('Examination Fee:');
      doc.fontSize(10).font('Helvetica').text(`NPR ${application.examFee ? application.examFee.toLocaleString() : '0'}`);
      doc.moveDown(0.8);

      // Separator
      doc
        .moveTo(50, doc.y)
        .lineTo(50 + pageWidth, doc.y)
        .strokeColor('#CCCCCC')
        .lineWidth(0.5)
        .stroke();
      doc.moveDown(0.8);

      // Payment information removed from PDF

      // ============ APPLICATION STATUS ============
      doc.fontSize(13).font('Helvetica-Bold').text('APPLICATION STATUS');
      doc.moveDown(0.5);

      doc.fontSize(10).font('Helvetica-Bold').text('Status: ');
      doc.fontSize(10).font('Helvetica').text(
        application.applicationStatus
          ? application.applicationStatus.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
          : 'N/A'
      );
      doc.moveDown(0.3);

      doc.fontSize(10).font('Helvetica-Bold').text('Submission Date: ');
      const submitDate = application.submittedAt
        ? new Date(application.submittedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'N/A';
      doc.fontSize(10).font('Helvetica').text(submitDate);
      doc.moveDown(1);

      // ============ FOOTER ============
      const footerY = doc.page.height - 80;
      doc
        .moveTo(50, footerY)
        .lineTo(50 + pageWidth, footerY)
        .strokeColor('#333333')
        .lineWidth(1)
        .stroke();

      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('APPLICANT COPY', 50, footerY + 10, { align: 'center', width: pageWidth });
      doc
        .fontSize(8)
        .font('Helvetica')
        .fillColor('#666666')
        .text(
          'This is a system-generated document. No signature is required.',
          50,
          footerY + 25,
          { align: 'center', width: pageWidth }
        )
        .text(
          `Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
          50,
          footerY + 35,
          { align: 'center', width: pageWidth }
        );

      // Finalize
      doc.end();

      stream.on('finish', () => {
        resolve(pdfPath);
      });

      stream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateApplicationPDF };
