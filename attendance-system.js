/**
 * Shared Attendance System - Centralized attendance management
 * Eliminates code duplication between student and teacher dashboards
 */

class AttendanceSystem {
  constructor() {
    this.students = JSON.parse(localStorage.getItem("students")) || [];
    this.classes = JSON.parse(localStorage.getItem("classes")) || [];
    this.attendance = JSON.parse(localStorage.getItem("attendance")) || [];
  }

  /**
   * Get all students
   */
  getStudents() {
    return this.students;
  }

  /**
   * Get student by ID
   */
  getStudentById(id) {
    return this.students.find((student) => student.id === id);
  }

  /**
   * Get student by name
   */
  getStudentByName(name) {
    return this.students.find(
      (student) =>
        student.name.toLowerCase().includes(name.toLowerCase()) ||
        student.email.toLowerCase().includes(name.toLowerCase()),
    );
  }

  /**
   * Get all classes
   */
  getClasses() {
    return this.classes;
  }

  /**
   * Get class by ID
   */
  getClassById(id) {
    return this.classes.find((cls) => cls.id === id);
  }

  /**
   * Get classes for a student
   */
  getStudentClasses(studentId) {
    return this.classes.filter((cls) =>
      cls.enrolledStudents.includes(studentId),
    );
  }

  /**
   * Get attendance for a class
   */
  getClassAttendance(classId) {
    return this.attendance.filter((att) => att.classId === classId);
  }

  /**
   * Get attendance for a student
   */
  getStudentAttendance(studentId) {
    return this.attendance.filter((att) => att.studentId === studentId);
  }

  /**
   * Mark attendance for a student in a class
   */
  markAttendance(studentId, classId, status = "present") {
    const date = new Date().toISOString().split("T")[0];
    const existingRecord = this.attendance.find(
      (att) =>
        att.studentId === studentId &&
        att.classId === classId &&
        att.date === date,
    );

    if (existingRecord) {
      existingRecord.status = status;
    } else {
      this.attendance.push({
        id: `att_${Date.now()}`,
        studentId,
        classId,
        date,
        status,
      });
    }

    this.saveAttendance();
    return true;
  }

  /**
   * Calculate attendance percentage for a student in a class
   */
  calculateAttendancePercentage(studentId, classId) {
    const classAttendance = this.attendance.filter(
      (att) => att.classId === classId && att.studentId === studentId,
    );

    if (classAttendance.length === 0) return 0;

    const presentCount = classAttendance.filter(
      (att) => att.status === "present",
    ).length;

    return Math.round((presentCount / classAttendance.length) * 100);
  }

  /**
   * Get attendance stats for a class
   */
  getClassAttendanceStats(classId) {
    const classAttendance = this.attendance.filter(
      (att) => att.classId === classId,
    );

    if (classAttendance.length === 0)
      return { total: 0, present: 0, absent: 0, percentage: 0 };

    const presentCount = classAttendance.filter(
      (att) => att.status === "present",
    ).length;
    const absentCount = classAttendance.length - presentCount;

    return {
      total: classAttendance.length,
      present: presentCount,
      absent: absentCount,
      percentage: Math.round((presentCount / classAttendance.length) * 100),
    };
  }

  /**
   * Get overall attendance stats for a student
   */
  getStudentAttendanceStats(studentId) {
    const studentAttendance = this.attendance.filter(
      (att) => att.studentId === studentId,
    );

    if (studentAttendance.length === 0)
      return { total: 0, present: 0, absent: 0, percentage: 0 };

    const presentCount = studentAttendance.filter(
      (att) => att.status === "present",
    ).length;
    const absentCount = studentAttendance.length - presentCount;

    return {
      total: studentAttendance.length,
      present: presentCount,
      absent: absentCount,
      percentage: Math.round((presentCount / studentAttendance.length) * 100),
    };
  }

  /**
   * Save attendance data to localStorage
   */
  saveAttendance() {
    localStorage.setItem("attendance", JSON.stringify(this.attendance));
  }

  /**
   * Save classes data to localStorage
   */
  saveClasses() {
    localStorage.setItem("classes", JSON.stringify(this.classes));
  }

  /**
   * Save students data to localStorage
   */
  saveStudents() {
    localStorage.setItem("students", JSON.stringify(this.students));
  }

  /**
   * Add a new class
   */
  addClass(classData) {
    const newClass = {
      id: `cls_${Date.now()}`,
      ...classData,
      enrolledStudents: classData.enrolledStudents || [],
      createdAt: new Date().toISOString(),
    };

    this.classes.push(newClass);
    this.saveClasses();
    return newClass;
  }

  /**
   * Update class information
   */
  updateClass(classId, classData) {
    const classIndex = this.classes.findIndex((cls) => cls.id === classId);
    if (classIndex === -1) return false;

    this.classes[classIndex] = {
      ...this.classes[classIndex],
      ...classData,
    };

    this.saveClasses();
    return true;
  }

  /**
   * Delete a class
   */
  deleteClass(classId) {
    this.classes = this.classes.filter((cls) => cls.id !== classId);
    this.attendance = this.attendance.filter((att) => att.classId !== classId);
    this.saveClasses();
    this.saveAttendance();
    return true;
  }

  /**
   * Enroll a student in a class
   */
  enrollStudent(classId, studentId) {
    const cls = this.getClassById(classId);
    if (cls && !cls.enrolledStudents.includes(studentId)) {
      cls.enrolledStudents.push(studentId);
      this.saveClasses();
      return true;
    }
    return false;
  }

  /**
   * Remove a student from a class
   */
  removeStudentFromClass(classId, studentId) {
    const cls = this.getClassById(classId);
    if (cls) {
      cls.enrolledStudents = cls.enrolledStudents.filter(
        (id) => id !== studentId,
      );
      this.saveClasses();
      return true;
    }
    return false;
  }

  /**
   * Get attendance report for a date range
   */
  getAttendanceReport(startDate, endDate, studentId = null) {
    let report = this.attendance.filter((att) => {
      const attDate = new Date(att.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return attDate >= start && attDate <= end;
    });

    if (studentId) {
      report = report.filter((att) => att.studentId === studentId);
    }

    return report;
  }

  /**
   * Export attendance data
   */
  exportAttendanceData(format = "json") {
    const data = {
      students: this.students,
      classes: this.classes,
      attendance: this.attendance,
      exportDate: new Date().toISOString(),
    };

    if (format === "csv") {
      return this.convertToCSV(data);
    }

    return JSON.stringify(data, null, 2);
  }

  /**
   * Convert data to CSV format
   */
  convertToCSV(data) {
    let csv = "Student ID,Student Name,Class ID,Date,Status\n";

    data.attendance.forEach((att) => {
      const student = data.students.find((s) => s.id === att.studentId);

      csv += `"${att.studentId}","${student?.name || "Unknown"}","${att.classId}","${att.date}","${att.status}"\n`;
    });

    return csv;
  }

  /**
   * Clear all data (use with caution)
   */
  clearAllData() {
    this.students = [];
    this.classes = [];
    this.attendance = [];
    this.saveStudents();
    this.saveClasses();
    this.saveAttendance();
  }
}

// Create global singleton instance
const attendanceSystem = new AttendanceSystem();
