import { jsPDF } from 'jspdf';

/**
 * Generates an official OPD Physical Presence Letter & Clinical Consultation Prescription Pass
 * Includes full hospital details, doctor qualifications, designation, appointment schedule, fee,
 * patient particulars with chief complaint/symptoms, and a real-time clinical prescription & physical presence letterhead.
 * 
 * Designed and Developed by Anas Siddiqui
 * @param {Object} appointment - The appointment data object
 */
export const generateAppointmentPdf = (appointment) => {
  if (!appointment) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;
  const contentWidth = pageWidth - (margin * 2);

  // --- OFFICIAL HEALTHCARE COLOR PALETTE ---
  const PRIMARY = [15, 41, 66];        // Deep Medical Navy (#0f2942)
  const ROYAL_BLUE = [37, 99, 235];    // Clinical Royal Blue (#2563eb)
  const EMERALD = [5, 150, 105];       // Verified Green (#059669)
  const TEXT_DARK = [15, 23, 42];      // Slate 900
  const TEXT_SECONDARY = [51, 65, 85]; // Slate 700
  const TEXT_MUTED = [100, 116, 139];  // Slate 500
  const BG_LIGHT = [248, 250, 252];    // Slate 50
  const BG_HIGHLIGHT = [240, 249, 255];// Soft Sky Tint (#f0f9ff)
  const BORDER_COLOR = [226, 232, 240];// Slate 200

  // --- EXTRACT PATIENT CHIEF COMPLAINT / DESCRIPTION SAFELY ---
  const rawDescription = appointment.symptoms 
    || appointment.reasonForVisit 
    || appointment.description 
    || appointment.chiefComplaint 
    || appointment.patientNotes 
    || '';

  let cleanComplaint = rawDescription.trim();
  let consultationMode = 'OPD Physical Clinic Consultation';

  // Normalize if format like "In-Person Clinic Visit: Fever and cough" or "Telehealth - Headache"
  if (cleanComplaint.includes(' - ')) {
    const parts = cleanComplaint.split(' - ');
    if (parts.length >= 2 && (parts[0].includes('Visit') || parts[0].includes('Consultation') || parts[0].includes('Telehealth'))) {
      consultationMode = parts[0].trim();
      cleanComplaint = parts.slice(1).join(' - ').trim();
    }
  } else if (cleanComplaint.includes(': ')) {
    const parts = cleanComplaint.split(': ');
    if (parts.length >= 2 && (parts[0].includes('Visit') || parts[0].includes('Consultation') || parts[0].includes('Telehealth'))) {
      consultationMode = parts[0].trim();
      cleanComplaint = parts.slice(1).join(': ').trim();
    }
  }

  if (!cleanComplaint || cleanComplaint.toLowerCase() === 'general specialist consultation') {
    cleanComplaint = 'Routine Outpatient Specialist Consultation & Clinical Examination';
  }

  // --- 1. TOP HOSPITAL LETTERHEAD BAR ---
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, pageWidth, 24, 'F');

  doc.setFillColor(...ROYAL_BLUE);
  doc.rect(0, 24, pageWidth, 2, 'F');

  // Hospital & Brand Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('MEDPLUS APPOINTMENTS — HEALTHCARE NETWORK', margin, 10);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('CENTRAL OUTPATIENT DEPARTMENT (OPD) • PHYSICAL ENTRY & OFFICIAL PRESCRIPTION LETTER', margin, 17);

  // Top Right Info
  doc.setFontSize(7.5);
  doc.setTextColor(226, 232, 240);
  const issuedDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  doc.text(`ISSUED: ${issuedDate}`, pageWidth - margin, 9.5, { align: 'right' });
  doc.text('FORM: OPD-PASS-V4', pageWidth - margin, 15, { align: 'right' });
  doc.text('AUTH: VERIFIED CLINICAL PASS', pageWidth - margin, 20.5, { align: 'right' });

  let y = 30;

  // --- 2. OFFICIAL PHYSICAL PRESENCE ADVISORY BANNER ---
  doc.setFillColor(...BG_LIGHT);
  doc.setDrawColor(...BORDER_COLOR);
  doc.roundedRect(margin, y, contentWidth, 19, 2.5, 2.5, 'FD');

  // Token Number Left
  const tokenNum = appointment.bookingReference 
    ? 'TOKEN #OPD-' + appointment.bookingReference.replace(/[^0-9]/g, '').slice(-3)
    : 'TOKEN #OPD-042';

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...TEXT_MUTED);
  doc.text('OFFICIAL OPD TOKEN / QUEUE NUMBER:', margin + 5, y + 6);

  doc.setFont('courier', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...ROYAL_BLUE);
  doc.text(tokenNum, margin + 5, y + 14);

  // Booking Reference Right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...TEXT_MUTED);
  doc.text('BOOKING REFERENCE PASS CODE:', pageWidth - margin - 65, y + 6);

  doc.setFont('courier', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...PRIMARY);
  doc.text(appointment.bookingReference || 'MED-APT-0000', pageWidth - margin - 65, y + 13.5);

  y += 24;

  // --- 3. ATTENDING DOCTOR & HOSPITAL SECTION ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...PRIMARY);
  doc.text('1. ATTENDING PHYSICIAN & HOSPITAL FACILITY', margin, y);

  doc.setDrawColor(...ROYAL_BLUE);
  doc.setLineWidth(0.4);
  doc.line(margin, y + 2, margin + 45, y + 2);

  y += 5.5;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...BORDER_COLOR);
  doc.roundedRect(margin, y, contentWidth, 34, 2.5, 2.5, 'FD');

  // Doctor Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(...PRIMARY);
  doc.text(appointment.doctorName || 'Specialist Consultant', margin + 6, y + 6.5);

  // Designation & Qualifications
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...ROYAL_BLUE);
  const qualText = appointment.doctorQualifications 
    ? `${appointment.doctorSpecialty || 'Specialist'} • ${appointment.doctorQualifications}`
    : `${appointment.doctorSpecialty || 'Specialist Medicine'} • MBBS, MD (Senior Consultant)`;
  doc.text(qualText, margin + 6, y + 12);

  // Hospital Name & Clinic Address
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...TEXT_DARK);
  doc.text(`Hospital: ${appointment.hospital || 'Hospital Medical Center'}`, margin + 6, y + 17.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...TEXT_MUTED);
  const fullAddress = appointment.address || `${appointment.hospital}, ${appointment.city || 'Bihar'}`;
  const splitAddress = doc.splitTextToSize(`Address: ${fullAddress}`, contentWidth - 12);
  doc.text(splitAddress[0] || '', margin + 6, y + 22.5);

  // Consultation Fee & OPD Room
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...TEXT_MUTED);
  doc.text('Consultation Fee: ', margin + 6, y + 29.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...EMERALD);
  doc.text(`INR ${appointment.consultationFee || 600} (Payable at OPD Registration Desk)`, margin + 27, y + 29.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PRIMARY);
  doc.text(`OPD Chamber: Room 204, Clinical Block`, pageWidth - margin - 6, y + 29.5, { align: 'right' });

  y += 38.5;

  // --- 4. PATIENT DETAILS & SCHEDULED TIME FOR PHYSICAL PRESENCE ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...PRIMARY);
  doc.text('2. PATIENT PARTICULARS & PHYSICAL PRESENCE SCHEDULE', margin, y);

  doc.setDrawColor(...ROYAL_BLUE);
  doc.line(margin, y + 2, margin + 50, y + 2);

  y += 5.5;

  // Wrap description for section 2
  const patientDescLines = doc.splitTextToSize(cleanComplaint, contentWidth - 38);
  const showTwoLines = patientDescLines.length > 1;
  const sec2Height = showTwoLines ? 37 : 33;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...BORDER_COLOR);
  doc.roundedRect(margin, y, contentWidth, sec2Height, 2.5, 2.5, 'FD');

  const halfWidth = (contentWidth - 12) / 2;

  // Row 1: Patient Name & Appointment Date
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(...TEXT_MUTED);
  doc.text('PATIENT FULL NAME & PARTICULARS:', margin + 6, y + 6.5);
  doc.text('PHYSICAL REPORTING DATE:', margin + 6 + halfWidth, y + 6.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...TEXT_DARK);
  const patientParticulars = appointment.patientAge 
    ? `${appointment.patientName || 'Registered Patient'} (${appointment.patientAge} Yrs • ${appointment.patientGender || 'Patient'})`
    : `${appointment.patientName || 'Registered Patient'} (${appointment.patientGender || 'Patient'})`;
  doc.text(patientParticulars, margin + 6, y + 12);

  doc.setTextColor(...PRIMARY);
  doc.text(appointment.appointmentDate || 'Today', margin + 6 + halfWidth, y + 12);

  // Row 2: Contact Phone & Allocated Time Slot
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(...TEXT_MUTED);
  doc.text('CONTACT PHONE NUMBER:', margin + 6, y + 18);
  doc.text('ALLOCATED OPD SESSION / TIME SLOT:', margin + 6 + halfWidth, y + 18);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...TEXT_DARK);
  doc.text(appointment.patientPhone || 'Not provided', margin + 6, y + 23.5);
  doc.setTextColor(...ROYAL_BLUE);
  doc.text(appointment.timeSlot || 'Morning Session (10:00 AM - 01:00 PM)', margin + 6 + halfWidth, y + 23.5);

  // Row 3: Chief Complaint / Reason for Visit
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(...ROYAL_BLUE);
  doc.text('CHIEF COMPLAINT:', margin + 6, y + 29.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...TEXT_DARK);
  doc.text(patientDescLines.slice(0, 2), margin + 34, y + 29.5);

  y += sec2Height + 4.5;

  // --- 5. REAL-TIME CLINICAL PRESCRIPTION (Rx) & EXAMINATION SECTION ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...PRIMARY);
  doc.text('3. CLINICAL EXAMINATION & OFFICIAL PRESCRIPTION (Rx)', margin, y);

  doc.setDrawColor(...ROYAL_BLUE);
  doc.line(margin, y + 2, margin + 48, y + 2);

  y += 5.5;

  // Prescription Box
  const rxBoxHeight = 88;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...BORDER_COLOR);
  doc.roundedRect(margin, y, contentWidth, rxBoxHeight, 2.5, 2.5, 'FD');

  // Vitals Bar
  doc.setFillColor(...BG_LIGHT);
  doc.rect(margin, y, contentWidth, 9.5, 'F');
  doc.setDrawColor(...BORDER_COLOR);
  doc.line(margin, y + 9.5, margin + contentWidth, y + 9.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(...TEXT_SECONDARY);
  doc.text('VITALS:  BP: ______ / ______ mmHg   |   Pulse: ______ bpm   |   SpO2: ______ %   |   Temp: ______ °F   |   Weight: ______ kg', margin + 6, y + 6.5);

  // --- PROMINENT PATIENT CHIEF COMPLAINT / Rx INDICATION CALLOUT IN PRESCRIPTION ---
  const complaintBoxY = y + 12;
  const complaintBoxH = 15;
  doc.setFillColor(...BG_HIGHLIGHT);
  doc.setDrawColor(186, 230, 253); // sky-200 border
  doc.roundedRect(margin + 5, complaintBoxY, contentWidth - 10, complaintBoxH, 2, 2, 'FD');

  // Left solid indicator bar
  doc.setFillColor(...ROYAL_BLUE);
  doc.rect(margin + 5, complaintBoxY, 2.5, complaintBoxH, 'F');

  // Callout Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...ROYAL_BLUE);
  doc.text('PATIENT REPORTED CHIEF COMPLAINT & SYMPTOMS (CLINICAL INDICATION FOR PRESCRIPTION):', margin + 10, complaintBoxY + 4.5);

  // Description / Symptoms wrapped inside the Rx box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(...TEXT_DARK);
  const rxDescriptionLines = doc.splitTextToSize(`"${cleanComplaint}"`, contentWidth - 22);
  doc.text(rxDescriptionLines.slice(0, 2), margin + 10, complaintBoxY + 10.5);

  // Rx Symbol
  const rxSymbolY = complaintBoxY + complaintBoxH + 7;
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(16);
  doc.setTextColor(...PRIMARY);
  doc.text('Rx', margin + 6, rxSymbolY);

  // Guidelines note in prescription area
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.2);
  doc.setTextColor(...TEXT_MUTED);
  doc.text('Physician\'s Clinical Diagnosis, Medication Orders, Dosage, and Directions for Use:', margin + 17, rxSymbolY - 1);

  // Ruled Medication Lines for Doctor's handwritten/entered prescription
  doc.setDrawColor(241, 245, 249);
  doc.setLineWidth(0.3);
  const ruledStartY = rxSymbolY + 5;
  for (let lineY = ruledStartY; lineY <= ruledStartY + 24; lineY += 8) {
    doc.line(margin + 6, lineY, margin + contentWidth - 6, lineY);
  }

  // Official Signature & Stamp Areas inside the Rx box
  const sigBoxY = y + rxBoxHeight - 18.5;

  // Left: Hospital Physical Presence Stamp Area
  doc.setDrawColor(...BORDER_COLOR);
  doc.setLineDashPattern([1, 1], 0);
  doc.roundedRect(margin + 6, sigBoxY - 1, 64, 16, 1.5, 1.5, 'D');
  doc.setLineDashPattern([], 0); // reset

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(...EMERALD);
  doc.text('HOSPITAL OPD PHYSICAL ENTRY STAMP', margin + 9, sigBoxY + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(...TEXT_MUTED);
  doc.text('Verified Physical Attendance', margin + 9, sigBoxY + 8.5);
  doc.text(`Ref: ${appointment.bookingReference || 'VERIFIED'}`, margin + 9, sigBoxY + 12.5);

  // Right: Doctor's Signature & NMC Registration
  const sigRightX = pageWidth - margin - 75;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...TEXT_MUTED);
  doc.text('___________________________________________', sigRightX, sigBoxY + 3);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...PRIMARY);
  doc.text(`Signature: ${appointment.doctorName || 'Attending Physician'}`, sigRightX, sigBoxY + 7.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(...TEXT_MUTED);
  doc.text('State Medical Council / NMC Reg. No: MCI-REG-8420', sigRightX, sigBoxY + 12);

  y += rxBoxHeight + 4.5;

  // --- 6. MANDATORY PHYSICAL PRESENCE GUIDELINES ---
  doc.setFillColor(...BG_LIGHT);
  doc.setDrawColor(...BORDER_COLOR);
  doc.roundedRect(margin, y, contentWidth, 21, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(...PRIMARY);
  doc.text('IMPORTANT INSTRUCTIONS FOR PHYSICAL PRESENCE AT THE HOSPITAL OPD:', margin + 5, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...TEXT_SECONDARY);
  doc.text('1. Please carry this printed letter or show this digital PDF pass directly at the Hospital OPD Reception Counter.', margin + 5, y + 8.5);
  doc.text('2. Please arrive 15 minutes before your scheduled slot. Tokens are called in chronological queue sequence.', margin + 5, y + 12);
  doc.text('3. Bring previous prescriptions, lab reports, MRI/X-ray films, and current ongoing medications for the doctor to review.', margin + 5, y + 15.5);
  doc.text('4. In case of acute medical emergencies, please report immediately to the 24/7 Emergency Casualty Department.', margin + 5, y + 19);

  // --- 7. OFFICIAL FOOTER WITH ANAS SIDDIQUI ATTRIBUTION ---
  doc.setFillColor(...PRIMARY);
  doc.rect(0, pageHeight - 10, pageWidth, 10, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(203, 213, 225);
  doc.text('MedPlus Appointments • Official OPD Physical Presence & Prescription Pass • Central Healthcare Network', margin, pageHeight - 4);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Designed and Developed by Anas Siddiqui • © 2026', pageWidth - margin, pageHeight - 4, { align: 'right' });

  // Save the PDF file
  const filename = `MedPlus-OPD-Prescription-Pass-${appointment.bookingReference || 'APT'}.pdf`;
  doc.save(filename);
};
