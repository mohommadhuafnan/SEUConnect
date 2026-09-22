import AcademicRule from '../models/AcademicRule.js';
import Result from '../models/Result.js';

export const calculateQualityPoints = (credit, gradePoint) => {
  return Number(((credit || 0) * (gradePoint || 0)).toFixed(2));
};

export const calculateSGPA = (courseResults) => {
  let totalQualityPoints = 0;
  let totalCredits = 0;

  for (const item of courseResults) {
    const credit = Number(item.subjectId?.credits ?? item.credits ?? 0);
    const isGPA = item.subjectId?.isGPA ?? item.isGPA ?? true;
    const gradePoint = Number(item.gradePoint || 0);

    if (isGPA && credit > 0) {
      totalQualityPoints += credit * gradePoint;
      totalCredits += credit;
    }
  }

  if (totalCredits === 0) return 0.00;
  return Number((totalQualityPoints / totalCredits).toFixed(2));
};

export const calculateCGPA = (allSemestersResults) => {
  let totalQualityPoints = 0;
  let totalCredits = 0;

  // Track highest grade point achieved per subject to properly handle repeats
  const bestResultsPerSubject = new Map();

  for (const item of allSemestersResults) {
    const subjectId = (item.subjectId?._id || item.subjectId || item.subjectCode)?.toString();
    const credit = Number(item.subjectId?.credits ?? item.credits ?? 0);
    const isGPA = item.subjectId?.isGPA ?? item.isGPA ?? true;
    const gradePoint = Number(item.gradePoint || 0);

    if (!isGPA || credit <= 0) continue;

    if (!bestResultsPerSubject.has(subjectId)) {
      bestResultsPerSubject.set(subjectId, { credit, gradePoint });
    } else {
      const prev = bestResultsPerSubject.get(subjectId);
      if (gradePoint > prev.gradePoint) {
        bestResultsPerSubject.set(subjectId, { credit, gradePoint });
      }
    }
  }

  for (const [_, val] of bestResultsPerSubject.entries()) {
    totalQualityPoints += val.credit * val.gradePoint;
    totalCredits += val.credit;
  }

  if (totalCredits === 0) return 0.00;
  return Number((totalQualityPoints / totalCredits).toFixed(2));
};

export const calculateClassEligibility = (cgpa, repeatCount = 0) => {
  const gpa = Number(cgpa || 0);
  if (gpa >= 3.70 && repeatCount === 0) {
    return 'First Class';
  } else if (gpa >= 3.30) {
    return 'Second Class (Upper Division)';
  } else if (gpa >= 3.00) {
    return 'Second Class (Lower Division)';
  } else if (gpa >= 2.00) {
    return 'Pass';
  } else {
    return 'Referred / Below Requirement';
  }
};

export const calculateDegreeProgress = (creditsCompleted, requiredCredits = 130) => {
  const comp = Number(creditsCompleted || 0);
  const req = Number(requiredCredits || 130);
  const percentage = Math.min(100, Math.round((comp / req) * 100));
  const remaining = Math.max(0, req - comp);
  return {
    completed: comp,
    required: req,
    remaining,
    percentage
  };
};
