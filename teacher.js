// ===== TEACHER JS FILE =====
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

    getStudentsBySemester(semester) {
        return this.students.filter(student => student.semester === semester);
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

    hasAttendanceForDate(studentId, date) {
        return this.attendance.some(record => record.studentId === studentId && record.date === date);
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

    removeStudent(studentId) {
        // Remove student from students array
        this.students = this.students.filter(student => student.id !== studentId);

        // Remove all attendance records for this student
        this.attendance = this.attendance.filter(record => record.studentId !== studentId);

        this.saveData();
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

// Define all subjects
 const allSubjects = ['software engineering', 'CAHM', 'CPUC', 'Web development using php', 'IOT', 'Minor project Work'];

// Define subjects by semester
const subjectsBySemester = {
    '1': ['communication skills - I', 'applied mathematics - 1', 'applied physics - 1', 'applied chemistry - 1', 'technical drawing', 'workshop practice'],
    '2': ['applied mathematics - 2', 'applied physics - 2', 'multimedia and animation', 'basics of electronics and electrical engineering', 'programming in C'],
    '3': ['applied mathematics - 3', 'data structures using C', 'internet and web technologies', 'environmental studies', 'digital electronics', 'data communications and computer networks'],
    '4': ['object oriented programming', 'java programming', 'computer networks', 'system software', 'web programming'],
    '5': ['software engineering', 'CAHM', 'CPUC', 'Web development using php', 'IOT'],
    '6': ['Minor project Work', 'industrial training', 'elective 1', 'elective 2', 'elective 3'],
};

// Initialize the system
const attendanceSystem = new AttendanceSystem();

// Teacher-specific functions
function initializeTeacherPage() {
    updateClassStatistics();
    displayAllStudents();

    // Update subject options based on semester selection for add student
    document.getElementById('studentSemester').addEventListener('change', function() {
        const semester = this.value;
        const subjectSelect = document.getElementById('studentSubject');
        subjectSelect.innerHTML = '<option value="">Select Subject</option>';
        if (subjectsBySemester[semester]) {
            subjectsBySemester[semester].forEach(subject => {
                const option = document.createElement('option');
                option.value = subject;
                option.textContent = subject;
                subjectSelect.appendChild(option);
            });
        }
    });

    // Update subject options based on semester selection for mark attendance
    document.getElementById('attendanceSemester').addEventListener('change', function() {
        const semester = this.value;
        const subjectSelect = document.getElementById('attendanceClass');
        subjectSelect.innerHTML = '<option value="">Select Subject</option>';
        if (subjectsBySemester[semester]) {
            subjectsBySemester[semester].forEach(subject => {
                const option = document.createElement('option');
                option.value = subject;
                option.textContent = subject;
                subjectSelect.appendChild(option);
            });
        }
    });



    // Add student form
    document.getElementById('addStudentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('studentName').value;
        const id = document.getElementById('studentId').value;
        const email = document.getElementById('studentEmail').value;
        const className = document.getElementById('studentClass').value;
        const semester = document.getElementById('studentSemester').value;
        const subject = document.getElementById('studentSubject').value;

        if (attendanceSystem.students.find(s => s.id === id)) {
            alert('Student ID already exists!');
            return;
        }

        // Create student for the selected semester
        const student = {
            id,
            name,
            email,
            semester,
            subject,
            classes: subjectsBySemester[semester] || allSubjects
        };

        attendanceSystem.addStudent(student);

        // If next semester exists, add student to next semester as well
        const nextSemester = (parseInt(semester) + 1).toString();
        if (subjectsBySemester[nextSemester]) {
            const nextStudent = {
                id,
                name,
                email,
                semester: nextSemester,
                subject: '', // No specific subject for next semester
                classes: subjectsBySemester[nextSemester]
            };
            attendanceSystem.addStudent(nextStudent);
        }

        alert('Student added successfully!');
        e.target.reset();
        displayAllStudents();
        updateClassStatistics();
    });

    // Attendance form
    document.getElementById('attendanceForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const semester = document.getElementById('attendanceSemester').value;
        const className = document.getElementById('attendanceClass').value;
        const date = document.getElementById('attendanceDate').value;

        if (!semester || !className || !date) {
            alert('Please select semester, subject and date');
            return;
        }

        const students = attendanceSystem.getStudentsBySemester(semester);
        if (students.length === 0) {
            alert('No students found in this semester');
            return;
        }

        displayStudentsForAttendance(students, className, date);
    });

    // Search form
    document.getElementById('searchForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const query = document.getElementById('searchInput').value.trim();
        const classFilter = document.getElementById('searchClass').value;

        const results = searchStudents(query, classFilter);
        displaySearchResults(results);
    });

    // Update class statistics based on semester selection
    document.getElementById('statsSemester').addEventListener('change', function() {
        const semester = this.value;
        updateClassStatistics(semester);
    });

    // Update student list based on semester filter
    document.getElementById('filterSemester').addEventListener('change', function() {
        const semester = this.value;
        displayAllStudents(semester || null);
    });
}

function displayStudentsForAttendance(students, className, date) {
    const attendanceList = document.getElementById('attendanceList');
    const studentsForAttendance = document.getElementById('studentsForAttendance');
    const selectedClass = document.getElementById('selectedClass');
    const selectedDate = document.getElementById('selectedDate');

    selectedClass.textContent = className;
    selectedDate.textContent = date;
    attendanceList.style.display = 'block';

    const existingAttendance = attendanceSystem.getAttendanceByDate(date, className);

    studentsForAttendance.innerHTML = students.map(student => {
        const hasAttendanceForDate = attendanceSystem.hasAttendanceForDate(student.id, date);
        const attendance = existingAttendance.find(a => a.studentId === student.id);
        const status = attendance ? attendance.status : '';
        const isDisabled = hasAttendanceForDate;

        return `
            <div class="student-item">
                <span>${student.name} (${student.id}) ${isDisabled ? '(Attendance Already Marked for Today)' : ''}</span>
                <div>
                    <button class="attendance-btn present ${status === 'present' ? 'active' : ''} ${isDisabled ? 'disabled' : ''}"
                            data-student-id="${student.id}" data-status="present"
                            onclick="${isDisabled ? '' : `markStudentAttendance('${student.id}', 'present')`}" ${isDisabled ? 'disabled' : ''}>
                        Present
                    </button>
                    <button class="attendance-btn absent ${status === 'absent' ? 'active' : ''} ${isDisabled ? 'disabled' : ''}"
                            data-student-id="${student.id}" data-status="absent"
                            onclick="${isDisabled ? '' : `markStudentAttendance('${student.id}', 'absent')`}" ${isDisabled ? 'disabled' : ''}>
                        Absent
                    </button>
                    <button class="attendance-btn leave ${status === 'leave' ? 'active' : ''} ${isDisabled ? 'disabled' : ''}"
                            data-student-id="${student.id}" data-status="leave"
                            onclick="${isDisabled ? '' : `markStudentAttendance('${student.id}', 'leave')`}" ${isDisabled ? 'disabled' : ''}>
                        Leave
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function markStudentAttendance(studentId, status) {
    const buttons = document.querySelectorAll(`[onclick="markStudentAttendance('${studentId}', 'present')"]`);
    const buttons2 = document.querySelectorAll(`[onclick="markStudentAttendance('${studentId}', 'absent')"]`);
    const buttons3 = document.querySelectorAll(`[onclick="markStudentAttendance('${studentId}', 'leave')"]`);

    const allButtons = [...buttons, ...buttons2, ...buttons3];

    // Immediately disable all buttons for this student
    allButtons.forEach(btn => {
        btn.disabled = true;
        btn.classList.add('disabled');
        btn.onclick = null; // Remove onclick to prevent further actions
    });

    // Set the active class for the selected status
    if (status === 'present') {
        buttons.forEach(btn => btn.classList.add('active'));
    } else if (status === 'absent') {
        buttons2.forEach(btn => btn.classList.add('active'));
    } else {
        buttons3.forEach(btn => btn.classList.add('active'));
    }
}

function saveAttendance() {
    const selectedClass = document.getElementById('selectedClass').textContent;
    const selectedDate = document.getElementById('selectedDate').textContent;
    const semester = document.getElementById('attendanceSemester').value;

    const students = attendanceSystem.getStudentsBySemester(semester);
    let savedCount = 0;
    let skippedCount = 0;

    students.forEach(student => {
        const presentBtn = document.querySelector(`[data-student-id="${student.id}"][data-status="present"]`);
        const absentBtn = document.querySelector(`[data-student-id="${student.id}"][data-status="absent"]`);
        const leaveBtn = document.querySelector(`[data-student-id="${student.id}"][data-status="leave"]`);

        let status = '';
        if (presentBtn && presentBtn.classList.contains('active')) {
            status = 'present';
        } else if (absentBtn && absentBtn.classList.contains('active')) {
            status = 'absent';
        } else if (leaveBtn && leaveBtn.classList.contains('active')) {
            status = 'leave';
        }

        if (status) {
            if (!attendanceSystem.hasAttendanceForDate(student.id, selectedDate)) {
                attendanceSystem.markAttendance(selectedDate, selectedClass, student.id, status);
                savedCount++;
            } else {
                skippedCount++;
            }
        }
    });

    if (savedCount > 0) {
        alert(`Attendance saved for ${savedCount} students!${skippedCount > 0 ? ` ${skippedCount} students already had attendance marked for today.` : ''}`);
        const currentSemester = document.getElementById('statsSemester').value;
        updateClassStatistics(currentSemester || null);
        // Reload the attendance list to show disabled buttons
        const semesterStudents = attendanceSystem.getStudentsBySemester(semester);
        displayStudentsForAttendance(semesterStudents, selectedClass, selectedDate);
    } else {
        alert('No attendance marked! All selected students already have attendance for today.');
    }
}

function displayAllStudents(semester = null) {
    const allStudentsList = document.getElementById('allStudentsList');
    let students = attendanceSystem.getAllStudents();

    if (semester) {
        students = students.filter(student => student.semester === semester);
    }

    if (students.length === 0) {
        allStudentsList.innerHTML = '<p>No students added yet.</p>';
        return;
    }

    allStudentsList.innerHTML = students.map(student => {
        const percentage = attendanceSystem.calculateAttendancePercentage(student.id);
        const classesDisplay = student.classes ? student.classes.join(', ') : 'No classes assigned';
        const semesterDisplay = student.semester ? `Semester: ${student.semester}` : '';
        const subjectDisplay = student.subject ? `Subject: ${student.subject}` : '';

        return `
            <div class="student-item">
                <div>
                    <strong>${student.name}</strong><br>
                    <small>ID: ${student.id} | ${semesterDisplay} | ${subjectDisplay} | Classes: ${classesDisplay} | Email: ${student.email}</small>
                </div>
                <div>
                    <span class="percentage-${percentage >= 75 ? 'high' : percentage >= 50 ? 'medium' : 'low'}">
                        ${percentage}%
                    </span>
                    <button class="btn btn-danger remove-btn" onclick="attendanceSystem.removeStudent('${student.id}'); displayAllStudents(${semester ? `'${semester}'` : ''}); updateClassStatistics(); alert('Student removed successfully!');" style="margin-left: 10px; padding: 5px 10px; font-size: 12px;">
                        Remove
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function searchStudents(query, classFilter) {
    let students = attendanceSystem.getAllStudents();

    if (classFilter) {
        students = students.filter(student => student.classes && student.classes.includes(classFilter));
    }

    if (query) {
        const lowerQuery = query.toLowerCase();
        students = students.filter(student =>
            student.name.toLowerCase().includes(lowerQuery) ||
            student.id.toLowerCase().includes(lowerQuery)
        );
    }

    return students;
}

function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');

    if (results.length === 0) {
        searchResults.innerHTML = '<p>No students found matching the criteria.</p>';
        searchResults.style.display = 'block';
        return;
    }

    searchResults.innerHTML = results.map(student => {
        const percentage = attendanceSystem.calculateAttendancePercentage(student.id);
        const classesDisplay = student.classes ? student.classes.join(', ') : 'No classes assigned';

        return `
            <div class="student-item">
                <div>
                    <strong>${student.name}</strong><br>
                    <small>ID: ${student.id} | Classes: ${classesDisplay} | Email: ${student.email}</small>
                </div>
                <div>
                    <span class="percentage-${percentage >= 75 ? 'high' : percentage >= 50 ? 'medium' : 'low'}">
                        ${percentage}%
                    </span>
                </div>
            </div>
        `;
    }).join('');

    searchResults.style.display = 'block';
}

function updateClassStatistics(semester = null) {
    const classStatsDiv = document.getElementById('classStats');
    classStatsDiv.innerHTML = '';

    let classesToShow = [];
    if (semester) {
        classesToShow = subjectsBySemester[semester] || [];
    } else {
        classesToShow = ['software engineering', 'CAHM', 'CPUC', 'Web development using php', 'IOT', 'Minor project Work'];
    }

    classesToShow.forEach(className => {
        const stats = attendanceSystem.getClassStatistics(className);
        const percentage = stats.totalStudents > 0 ? Math.round((stats.presentToday / stats.totalStudents) * 100) : 0;
        const classDiv = document.createElement('div');
        classDiv.className = 'class-stat-item';
        classDiv.innerHTML = `
            <h4>${className}</h4>
            <div class="stat-details">
                <span>Total Students: ${stats.totalStudents}</span>
                <span>Present Today: ${stats.presentToday}</span>
                <span>Today's Attendance: ${percentage}%</span>
            </div>
        `;
        classStatsDiv.appendChild(classDiv);
    });

    if (classStatsDiv.children.length === 0) {
        classStatsDiv.innerHTML = '<p>No classes with students.</p>';
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Initialize teacher page if on teacher.html
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'teacher.html') {
        initializeTeacherPage();
    }
});
