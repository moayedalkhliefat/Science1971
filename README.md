# 🧪 Science1971 — Virtual Science Lab

Built by **Mr. Moayed Alkhliefat**, Science Teacher, ATS-AQB.

Live site: https://moayedalkhliefat.github.io/science1971/

## Who logs in, and how

| Account | Logs in with | Can do |
|---|---|---|
| **Admin** (Moayed) | username + password | Create / reset / delete teacher accounts; see all students and results |
| **Teacher** | username + password (made by admin) | Upload up to **30 students** from Excel, see their results, preview labs |
| **Student** | **first name + School ID** | Do the labs their teacher opened for their class; results are saved for the teacher |

Teachers open or close each lab per class (grade + section) in **Teacher dashboard → 🏫 Class Labs**.

Excel columns for teachers: **Name, School ID, Grade, Section** (a template can be downloaded in the teacher page).

## Files

```
index.html            Login page (students + staff)
admin.html            Admin panel (teachers)
teacher.html          Teacher dashboard (students, results, labs preview)
student.html          Student home (labs + my results)
assets/config.js      Supabase URL + public key, pass mark (75%)
assets/app.js         Shared helpers (API calls, login session)
assets/lab-sdk.js     Connects any lab to the login + saves results
assets/lab-engine.js  Shared lab engine: explore step, 10 tasks per level (5 lab challenges + 5 diagram tasks, adaptive difficulty), scoring, calculator
assets/lab.css        Shared lab styles
labs/catalog.js       List of labs and their levels
labs/digestive/       Biology: Functions of the Digestive System (Grades 7–8, 3 levels)
labs/speed/           Physics: Speed and How to Calculate It (Grade 7, 3 levels)
labs/atom/            Chemistry: Build an Atom (Grades 9–10, 3 levels)
```

Database: Supabase project **Science1971** (tables: staff, students, sessions, results, login_attempts — the setup is saved as migrations inside Supabase).

## Adding a new lab

1. Create a folder `labs/<name>/index.html` (copy the digestive lab as a starting point).
2. Add it to `labs/catalog.js` with its levels (each level id like `name-l1`).
3. In the lab call `await S1971Lab.init("<name>")` and, at the end, `await S1971Lab.submit(score, maxScore, details)`.

## Security notes

- The browser never reads the tables directly: Row Level Security blocks all direct access, and everything goes through database functions that check the login token and role.
- Passwords are stored hashed (bcrypt). The admin password is **not** in this repository.
- Wrong logins are limited (8 failed tries → 15-minute wait).
