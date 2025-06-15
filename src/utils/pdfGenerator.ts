
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Interview } from '../types';

export const generateInterviewPDF = async (interview: Interview): Promise<Blob> => {
  // Create a new jsPDF instance
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let currentY = margin;

  // Title
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Interview Feedback Report', margin, currentY);
  currentY += 15;

  // Interview Details
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Interview Details', margin, currentY);
  currentY += 10;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Role: ${interview.role}`, margin, currentY);
  currentY += 6;
  pdf.text(`Level: ${interview.level}`, margin, currentY);
  currentY += 6;
  pdf.text(`Tech Stack: ${interview.techStack.join(', ')}`, margin, currentY);
  currentY += 6;
  pdf.text(`Date: ${interview.createdAt.toDateString()}`, margin, currentY);
  currentY += 6;
  if (interview.completedAt) {
    pdf.text(`Completed: ${interview.completedAt.toDateString()}`, margin, currentY);
    currentY += 10;
  }

  if (interview.feedback) {
    // Overall Score
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Overall Score', margin, currentY);
    currentY += 8;
    
    pdf.setFontSize(24);
    pdf.text(`${interview.feedback.overallScore}/100`, margin, currentY);
    currentY += 15;

    // Category Breakdown
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Category Breakdown', margin, currentY);
    currentY += 10;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    Object.entries(interview.feedback.categories).forEach(([category, score]) => {
      const categoryName = category.replace(/([A-Z])/g, ' $1').trim();
      pdf.text(`${categoryName}: ${score}/100`, margin, currentY);
      currentY += 6;
    });
    currentY += 5;

    // Summary
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Summary', margin, currentY);
    currentY += 8;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    const summaryLines = pdf.splitTextToSize(interview.feedback.summary, contentWidth);
    pdf.text(summaryLines, margin, currentY);
    currentY += summaryLines.length * 6 + 5;

    // Check if we need a new page
    if (currentY > pageHeight - 50) {
      pdf.addPage();
      currentY = margin;
    }

    // Strengths
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Strengths', margin, currentY);
    currentY += 8;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    interview.feedback.strengths.forEach((strength, index) => {
      const strengthLines = pdf.splitTextToSize(`• ${strength}`, contentWidth);
      pdf.text(strengthLines, margin, currentY);
      currentY += strengthLines.length * 6;
    });
    currentY += 5;

    // Areas for Improvement
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Areas for Improvement', margin, currentY);
    currentY += 8;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    interview.feedback.improvements.forEach((improvement, index) => {
      const improvementLines = pdf.splitTextToSize(`• ${improvement}`, contentWidth);
      pdf.text(improvementLines, margin, currentY);
      currentY += improvementLines.length * 6;
    });
  }

  return pdf.output('blob');
};

export const shareInterviewFeedback = async (interview: Interview) => {
  if (navigator.share) {
    try {
      const pdfBlob = await generateInterviewPDF(interview);
      const file = new File([pdfBlob], `${interview.role}-interview-feedback.pdf`, {
        type: 'application/pdf',
      });

      await navigator.share({
        title: `${interview.role} Interview Feedback`,
        text: `Check out my interview feedback for the ${interview.role} position!`,
        files: [file],
      });
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback to copying link
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        return 'Link copied to clipboard!';
      }
    }
  } else {
    // Fallback for browsers that don't support Web Share API
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      return 'Link copied to clipboard!';
    }
  }
  return null;
};
