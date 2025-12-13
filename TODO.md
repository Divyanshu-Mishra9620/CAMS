# TODO: Add Semester and Subject Options to Add Student Form

## Steps to Complete:

- [x] Edit teacher.html to add a new form-row with semester select (options: 1-4) and subject select (options: existing subjects)
- [x] Edit teacher.js to make subject select dynamic based on semester (different subjects for each semester)
- [x] Edit teacher.js to capture semester and subject values in the addStudent form handler, add them to the student object, but enroll student in all subjects as before
- [x] Update displayAllStudents to show semester and subject in the student list
- [ ] Test the form to ensure it works without disturbing the page format
- [ ] Verify student is added to all subjects and semester/subject are stored/displayed

# TODO: Add Semester Selection to Mark Attendance Section

## Steps to Complete:

- [x] Edit teacher.html to add a semester select dropdown (id="attendanceSemester") with options 1-6 in the attendanceForm, before the attendanceClass select
- [x] Edit teacher.js to add an event listener for attendanceSemester change, to dynamically populate attendanceClass with subjects from subjectsBySemester[semester]
- [ ] Test the Mark Attendance form to ensure semester selection populates subjects correctly and attendance can be marked without errors
- [ ] Verify that the page format is not disturbed
