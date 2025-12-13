// ===== STUDENT JS FILE =====
// Data Management Functions
class AttendanceSystem {
    constructor() {
        this.students = JSON.parse(localStorage.getItem('students')) || [];
        this.attendance = JSON.parse(localStorage.getItem('attendance')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.cleanStudents();
        this.saveData();
    }

    saveData() {
        localStorage.setItem('students', JSON.stringify(this.students));
        localStorage.setItem('attendance', JSON.stringify(this.attendance));
    }

    cleanStudents() {
        this.students = this.students.filter(student =>
            student &&
            typeof student.id !== 'undefined' &&
            typeof student.name !== 'undefined' &&
            typeof student.email !== 'undefined' &&
            Array.isArray(student.classes) &&
            student.classes.every(cls => typeof cls !== 'undefined')
        );
    }

    addStudent(student) {
        this.students.push(student);
        this.saveData();
    }

    getStudentsByClass(className) {
        return this.students.filter(student => student.classes && student.classes.includes(className));
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

// Student-specific functions
function initializeStudentPage() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'student') {
        window.location.href = 'index.html';
        return;
    }

    const student = attendanceSystem.getStudentById(currentUser.studentId);
    if (!student) {
        alert('Student not found!');
        window.location.href = 'index.html';
        return;
    }

    displayStudentInfo(student);
    displayTodayAttendance(student.id);
    displayStudentAttendance(student.id);
    displaySubjectWiseAttendance(student.id);
    displayRecentAttendance(student.id);
}

function displayStudentInfo(student) {
    document.getElementById('studentIdDisplay').textContent = student.id;
    document.getElementById('studentNameDisplay').textContent = student.name;
    const classesDisplay = student.classes ? student.classes.join(', ') : 'No classes assigned';
    document.getElementById('studentClassDisplay').textContent = classesDisplay;
}

function displayStudentAttendance(studentId) {
    const attendance = attendanceSystem.getStudentAttendance(studentId);
    const totalDays = attendance.length;
    const presentDays = attendance.filter(record => record.status === 'present').length;
    const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

    document.getElementById('totalDays').textContent = totalDays;
    document.getElementById('presentDays').textContent = presentDays;
    document.getElementById('overallAttendance').textContent = percentage + '%';

    // Draw circular chart
    drawAttendanceChart(percentage);
}

function drawAttendanceChart(percentage) {
    const canvas = document.getElementById('attendanceChart');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 40;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background circle (red for absent part)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#dc3545'; // Red for absent
    ctx.fill();

    // Draw progress sector (green for present part)
    const startAngle = -Math.PI / 2; // Start from top
    const endAngle = startAngle + (percentage / 100) * 2 * Math.PI;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = '#28a745'; // Green for present
    ctx.fill();

    // Draw percentage text
    ctx.fillStyle = '#fff'; // White text for contrast
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(percentage + '%', centerX, centerY);
}

function displaySubjectWiseAttendance(studentId) {
    const student = attendanceSystem.getStudentById(studentId);
    const attendance = attendanceSystem.getStudentAttendance(studentId);

    const subjectStats = {};
    attendance.forEach(record => {
        if (!subjectStats[record.class]) {
            subjectStats[record.class] = { total: 0, present: 0, absent: 0, leave: 0 };
        }
        subjectStats[record.class].total++;
        subjectStats[record.class][record.status]++;
    });

    const tbody = document.getElementById('subjectAttendanceBody');
    tbody.innerHTML = Object.entries(subjectStats).map(([subject, stats]) => {
        const percentage = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;
        return `
            <tr>
                <td>${subject}</td>
                <td>${stats.total}</td>
                <td>${stats.present}</td>
                <td>${stats.absent}</td>
                <td>${stats.leave}</td>
                <td class="percentage-${percentage >= 75 ? 'high' : percentage >= 50 ? 'medium' : 'low'}">
                    ${percentage}%
                </td>
            </tr>
        `;
    }).join('');
}

function displayTodayAttendance(studentId) {
    const today = new Date().toISOString().split('T')[0];
    const attendance = attendanceSystem.getStudentAttendance(studentId);
    const todayAttendance = attendance.find(record => record.date === today);

    if (todayAttendance) {
        document.getElementById('todayStatus').textContent = todayAttendance.status.charAt(0).toUpperCase() + todayAttendance.status.slice(1);
        document.getElementById('todaySubject').textContent = todayAttendance.class;
    } else {
        document.getElementById('todayStatus').textContent = 'Not Marked';
        document.getElementById('todaySubject').textContent = '-';
    }
}

function displayRecentAttendance(studentId) {
    const attendance = attendanceSystem.getStudentAttendance(studentId);
    const recentAttendance = attendance
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10);

    const tbody = document.getElementById('recentAttendanceBody');
    tbody.innerHTML = recentAttendance.map(record => `
        <tr>
            <td>${record.date}</td>
            <td>${record.class}</td>
            <td>
                <span class="attendance-btn ${record.status}">
                    ${record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </span>
            </td>
        </tr>
    `).join('');
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Initialize student page if on student.html
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'student.html') {
        initializeStudentPage();
    }
});
