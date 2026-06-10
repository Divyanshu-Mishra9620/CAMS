# College Attendance Management System (CAMS)

## Welcome to CAMS! 📚

This is your complete guide to managing student attendance efficiently. Whether you're a professor, teacher, or invigilator, this guide will walk you through every feature step-by-step.

---

## 🚀 Getting Started

### Starting the System

**On Your Computer:**

1. Open **PowerShell** or **Command Prompt**
2. Navigate to the CAMS folder:

   ```
   cd "d:\Attendance maager\CAMS"
   ```

3. Start the system:

   ```
   npm start
   ```

4. Wait for the message: `"CAMS server running on http://localhost:5000"`
5. Open your web browser and go to: **http://localhost:5000**

**That's it! You're ready to use CAMS.**

---

## 🔐 Login

### Default Teacher/Professor Account

When you first access CAMS, you'll see the login page with two options:

- **Username:** `teacher`
- **Password:** `teacher`

### Steps to Login:

1. Click on **"Teacher Login"** button
2. Enter your username and password
3. Click **"Login"**
4. You'll be taken to the Teacher Dashboard

> **Note:** Student login is available for students to view their own attendance records.

---

## 👨‍🏫 Teacher/Professor Dashboard

Once logged in, you'll see your main dashboard with several important sections:

### Dashboard Overview

The Teacher Dashboard has the following main features:

1. **Class Management** - Manage your classes and enrolled students
2. **Mark Attendance** - Mark attendance for students in your class
3. **Attendance Reports** - View attendance statistics and reports
4. **Student Management** - View and manage student information

---

## 📋 How to Mark Attendance

### Step-by-Step Guide:

1. **Navigate to "Mark Attendance"** section on the dashboard

2. **Select a Class:**
   - Click on the class dropdown
   - Choose the class you want to mark attendance for
   - A list of enrolled students will appear

3. **Mark Each Student:**
   - For each student, you'll see three buttons:
     - ✅ **Present** (Green button) - Click if student is present
     - ❌ **Absent** (Red button) - Click if student is absent
     - 📝 **Leave** (Yellow button) - Click if student is on leave

4. **Add Remarks (Optional):**
   - You can add notes like "Medical Leave" or "Excused"
   - This helps with record-keeping

5. **That's all!**
   - Attendance is automatically saved to the system
   - The data is synced to the database in real-time

### Quick Tip:

- You can mark attendance for multiple classes throughout the day
- The system saves automatically - no need to click "Save"

---

## 📊 Viewing Attendance Reports

### How to Access Reports:

1. **Click on "Attendance Reports"** or similar section
2. You'll see:
   - **Overall Attendance** - Summary of all students' attendance
   - **Class-wise Reports** - Attendance breakdown by class
   - **Student-wise Reports** - Individual student attendance history

### Understanding the Report:

- **Present Days:** Number of classes attended
- **Absent Days:** Number of classes missed
- **Leave Days:** Authorized absences
- **Attendance %:** Percentage of classes attended
  - 🟢 **75% or above** = Good (Green)
  - 🟡 **50-74%** = Average (Yellow)
  - 🔴 **Below 50%** = Low (Red)

### Exporting Reports:

- Many reports can be downloaded as **CSV** or **PDF**
- Great for sending to administration

---

## 👥 Managing Students

### View All Students:

1. **Click on "Students"** section
2. You'll see a list of all registered students with:
   - Student ID
   - Name
   - Email
   - Semester/Year
   - Enrolled Classes

### Add a New Student:

1. **Click "Add New Student"** button
2. Fill in the following details:
   - **Student ID:** Unique identifier (e.g., CSE001)
   - **Name:** Full name
   - **Email:** Student email
   - **Semester:** Year/Semester (1, 2, 3, etc.)
   - **Classes:** Select classes student is enrolled in
3. **Click "Add Student"**

### Edit Student Information:

1. Find the student in the list
2. Click **"Edit"** button
3. Update the information
4. Click **"Save"**

### Remove a Student:

1. Find the student in the list
2. Click **"Delete"** button
3. Confirm the deletion

---

## 📚 Managing Classes

### View Your Classes:

1. **Click on "Classes"** section
2. See all classes you're teaching with:
   - Class Name
   - Subject
   - Number of Students Enrolled
   - Class Schedule

### Add a New Class:

1. **Click "Add New Class"** button
2. Fill in:
   - **Class Name:** (e.g., CSE-101, BCA-2A)
   - **Subject:** Subject name
   - **Semester:** Class year/semester
3. **Click "Create Class"**

### Enroll Students in Class:

1. Open a class
2. **Click "Add Students"**
3. Select multiple students from the list
4. **Click "Enroll"**

---

## 📱 Student Dashboard (For Your Reference)

### What Students Can See:

When students log in, they can view:

1. **Today's Attendance** - Whether they're marked present/absent for today
2. **Overall Attendance %** - Their total attendance percentage
3. **Subject-wise Attendance** - Attendance in each class
4. **Recent Attendance History** - Last 10 days of attendance records

> Students **cannot** mark their own attendance - only teachers can do that.

---

## 🎯 Quick Tips for Professors

### Best Practices:

✅ **DO:**

- Mark attendance at the beginning or end of each class
- Use the "Leave" status for authorized absences
- Add remarks for important information
- Review weekly reports to track trends
- Update student information promptly

❌ **DON'T:**

- Mark incorrect attendance data
- Mark students as present who aren't in class
- Forget to mark attendance regularly

### Keyboard Shortcuts:

- **Tab** - Move to next field
- **Enter** - Confirm action
- **Ctrl+P** - Print current page
- **Ctrl+S** - Save (if available)

---

## 🔧 Troubleshooting

### "Page won't load"

- Make sure the backend is running (`npm start` in PowerShell)
- Check if the port 5000 is available
- Try refreshing the page (Ctrl+R)

### "Can't mark attendance"

- Make sure you're logged in as a teacher
- Check that a class is selected
- Ensure students are enrolled in that class

### "Attendance data not showing"

- Wait a few seconds - data syncs automatically
- Refresh the page
- Check your internet connection

### "Forgot password"

- Contact your administrator
- Default credentials: `teacher` / `teacher`

---

## 🆘 Need Help?

### Common Questions:

**Q: Can I mark attendance for past dates?**

- A: Yes, you can manually enter attendance for previous dates if needed.

**Q: What happens if I mark attendance twice?**

- A: The system updates the previous record - the latest entry is saved.

**Q: Can I see attendance trends?**

- A: Yes, check the "Reports" section for detailed analysis and trends.

**Q: How do I download attendance reports?**

- A: Go to Reports section and look for the Download/Export button.

---

## 📞 System Information

- **Backend Server:** http://localhost:5000
- **Database:** MongoDB
- **Default Port:** 5000
- **Frontend:** HTML/CSS/JavaScript

### Starting/Stopping:

- **To Start:** `npm start`
- **To Stop:** Press `Ctrl+C` in the terminal

---

## 📝 Important Notes

- **Data Privacy:** Student attendance records are confidential
- **Backup:** Regularly backup your attendance data
- **Updates:** Keep your browser updated for best performance
- **Support:** Contact your IT administrator for technical issues

---

## ✨ Features at a Glance

| Feature                | Description                            |
| ---------------------- | -------------------------------------- |
| **Real-time Sync**     | Attendance syncs instantly to database |
| **Multiple Classes**   | Manage attendance for multiple classes |
| **Attendance Reports** | Generate detailed attendance reports   |
| **Student Management** | Add, edit, and manage student records  |
| **Class Management**   | Create and manage classes              |
| **Flexible Status**    | Mark Present, Absent, or Leave         |
| **Remarks**            | Add notes to attendance records        |
| **Export**             | Download reports in multiple formats   |

---

## 🎓 Thank You!

Thank you for using CAMS. This system is designed to make attendance management simple and efficient for educators.

**Happy Teaching!** 📚✏️

---

**Last Updated:** June 2026
**Version:** 1.0
