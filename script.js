// ===== COMMON JS FILE =====
// Data Management Functions
class AttendanceSystem {
    constructor() {
        this.students = JSON.parse(localStorage.getItem('students')) || [];
        this.attendance = JSON.parse(localStorage.getItem('attendance')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    saveData() {
        localStorage.setItem('students', JSON.stringify(this.students));
        localStorage.setItem('attendance', JSON.stringify(this.attendance));
    }

    addStudent(student) {
        this.students.push(student);
        this.saveData();
    }

    getStudentsByClass(className) {
        return this.students.filter(student => student.class === className);
    }

    getAllStudents() {
        return this.students;
    }

    markAttendance(date, className, studentId, status) {
        const attendanceRecord = {
            date,
            class: className,
            studentId,
            status
        };
        this.attendance.push(attendanceRecord);
        this.saveData();
    }

    getAttendanceByDate(date, className) {
        return this.attendance.filter(record =>
            record.date === date && record.class === className
        );
    }

    getStudentAttendance(studentId) {
        return this.attendance.filter(record => record.studentId === studentId);
    }

    getStudentById(studentId) {
        return this.students.find(student => student.id === studentId);
    }

    calculateAttendancePercentage(studentId) {
        const studentAttendance = this.getStudentAttendance(studentId);
        if (studentAttendance.length === 0) return 0;

        const present = studentAttendance.filter(record => record.status === 'present').length;
        return Math.round((present / studentAttendance.length) * 100);
    }

    getClassStatistics(className) {
        const students = this.getStudentsByClass(className);
        const totalStudents = students.length;

        if (totalStudents === 0) {
            return {
                totalStudents: 0,
                presentToday: 0,
                overallPercentage: 0
            };
        }

        const today = new Date().toISOString().split('T')[0];
        const todayAttendance = this.getAttendanceByDate(today, className);
        const presentToday = todayAttendance.filter(record => record.status === 'present').length;

        let totalRecords = 0;
        let totalPresent = 0;

        students.forEach(student => {
            const attendance = this.getStudentAttendance(student.id);
            totalRecords += attendance.length;
            totalPresent += attendance.filter(record => record.status === 'present').length;
        });

        const overallPercentage = totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : 0;

        return {
            totalStudents,
            presentToday,
            overallPercentage
        };
    }
}

// Initialize the system
const attendanceSystem = new AttendanceSystem();

// Login functionality
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'index.html' || currentPage === '') {
        initializeLoginPage();
    }
    // Role-specific initialization is now handled in teacher.js and student.js
});

function initializeLoginPage() {
    const teacherLoginBtn = document.getElementById('teacherLogin');
    const studentLoginBtn = document.getElementById('studentLogin');
    const loginForm = document.getElementById('loginForm');
    const authForm = document.getElementById('authForm');
    const errorMessage = document.getElementById('errorMessage');

    let selectedRole = '';

    teacherLoginBtn.addEventListener('click', () => {
        selectedRole = 'teacher';
        showLoginForm('Teacher');
    });

    studentLoginBtn.addEventListener('click', () => {
        selectedRole = 'student';
        showLoginForm('Student');
    });

    function showLoginForm(role) {
        document.getElementById('formTitle').textContent = `${role} Login`;
        loginForm.style.display = 'block';
    }

    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (selectedRole === 'teacher') {
            if (username === 'teacher' && password === 'teacher123') {
                localStorage.setItem('currentUser', JSON.stringify({
                    role: 'teacher',
                    username: username
                }));
                window.location.href = 'teacher.html';
            } else {
                showError('Invalid teacher credentials');
            }
        } else if (selectedRole === 'student') {
            const student = attendanceSystem.students.find(s => s.id === username);
            if (student && password === 'student123') {
                localStorage.setItem('currentUser', JSON.stringify({
                    role: 'student',
                    username: username,
                    studentId: student.id
                }));
                window.location.href = 'student.html';
            } else {
                showError('Invalid student credentials or student not found');
            }
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    }
}
