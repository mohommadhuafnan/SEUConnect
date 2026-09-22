export const DEFAULT_GRADE_SCALE = [
  { grade: 'A+', minMark: 85, maxMark: 100, gradePoint: 4.00, passStatus: 'Pass' },
  { grade: 'A',  minMark: 80, maxMark: 84,  gradePoint: 4.00, passStatus: 'Pass' },
  { grade: 'A-', minMark: 75, maxMark: 79,  gradePoint: 3.70, passStatus: 'Pass' },
  { grade: 'B+', minMark: 70, maxMark: 74,  gradePoint: 3.30, passStatus: 'Pass' },
  { grade: 'B',  minMark: 65, maxMark: 69,  gradePoint: 3.00, passStatus: 'Pass' },
  { grade: 'B-', minMark: 60, maxMark: 64,  gradePoint: 2.70, passStatus: 'Pass' },
  { grade: 'C+', minMark: 55, maxMark: 59,  gradePoint: 2.30, passStatus: 'Pass' },
  { grade: 'C',  minMark: 50, maxMark: 54,  gradePoint: 2.00, passStatus: 'Pass' },
  { grade: 'C-', minMark: 45, maxMark: 49,  gradePoint: 1.70, passStatus: 'Conditional' },
  { grade: 'D',  minMark: 40, maxMark: 44,  gradePoint: 1.00, passStatus: 'Conditional' },
  { grade: 'E',  minMark: 0,  maxMark: 39,  gradePoint: 0.00, passStatus: 'Fail' }
];

export const calculateGradeFromMark = (mark, gradeScale = DEFAULT_GRADE_SCALE) => {
  const numericMark = Math.round(Number(mark) || 0);
  for (const item of gradeScale) {
    if (numericMark >= item.minMark && numericMark <= item.maxMark) {
      return {
        grade: item.grade,
        gradePoint: item.gradePoint,
        passStatus: item.passStatus
      };
    }
  }
  return { grade: 'E', gradePoint: 0.0, passStatus: 'Fail' };
};
