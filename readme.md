# Automobile Shop Management System

## Project Overview

This is a **DBMS Course Project** implemented as a **full-stack web
application** using **Spring Boot (Java)**, **React (JavaScript)**, and
**MySQL**.
The system is designed to manage the operations of an **Automobile
Shop**, providing functionalities such as customer management, vehicle
records, services, and appointment scheduling.

It demonstrates: - Database schema design and normalization.

- Entity relationships (one-to-many, many-to-many with composite keys).
- Backend API development using Spring Boot.
- Secure configuration management using `.env`.
- Frontend integration using React for user interaction.

---

## 📘 Student Details

### 👨‍💻 Team Members

| Role                         | Name                          | Roll Number  | GitHub ID                                                 |
| ---------------------------- | ----------------------------- | ------------ | --------------------------------------------------------- |
| ⭐ **Team Leader & Backend** | **Atul Kumar Pandey**         | **23074006** | [Atul625-py](https://github.com/Atul625-py)               |
| 🤝 **Co-Leader & Backend**   | Thakkarwad Basweshwar Pradeep | 23074030     | [bt666-1](https://github.com/bt666-1)                     |
| 🎨 **Frontend Engineer**     | Purushottam Lal               | 23075061     | [purushottam62](https://github.com/purushottam62) |
| 🖌️ **Frontend Designer**     | Chukka Chamantej              | 23074010     | [chukkachaman](https://github.com/chukkachaman)           |

---

### 🎓 Academic Information

- **Program**: CSE (Integrated Dual Degree), 3rd Year
- **Course**: Database Management Systems
- **Instructor**: Rabindranath Choudhary C

---

## Tech Stack

### Backend

- **Spring Boot (Java)** for REST APIs.
- **Hibernate / JPA** for ORM.
- **Maven** as build tool.

### Frontend

- **React.js** for user interface.
- **Axios / Fetch API** for connecting frontend to backend.
- **TailwindCSS / CSS Modules** for styling.

### Database

- **MySQL** for relational data storage.
- Entities: `Customer`, `Vehicle`, `Service`, `Appointment`, and join
  tables for many-to-many relationships.

### Environment & Tools

- **.env** file for secure database credentials.
- **Postman** for API testing.
- **Git & GitHub** for version control.

---

## Features

- 👤 **Customer Management**: Add, update, and track customer details.
- 🚗 **Vehicle Records**: Link vehicles to customers, manage multiple
  vehicles per customer.
- 🛠 **Services**: Track repair and maintenance services with
  associated mechanics.
- 📅 **Appointments**: Schedule and manage service appointments.
- 🔗 **Many-to-Many Relationships**: Customers ↔ Vehicles, Services ↔
  Mechanics.
- 🔐 Secure environment-based configuration.
- 🌐 Full-stack integration with a responsive frontend.

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-link>
cd automobileshop
```

### 2. Configure Backend (.env in project root)

```env
SPRING_APPLICATION_NAME=automobileshop
DB_URL=jdbc:mysql://localhost:3306/automobile
DB_USERNAME=root
DB_PASSWORD=your_password_here
```

### 3. Run Backend (Spring Boot)

```bash
mvn spring-boot:run
```

### 4. Setup Frontend (React)

```bash
cd frontend
npm install
npm start
```

---

## Best Practices Followed

- Clear separation of concerns between backend and frontend.
- Entities organized under `entity/` package in backend.
- Many-to-many relationships implemented via join entities with
  `@EmbeddedId`.
- Sensitive credentials excluded from version control using
  `.gitignore`.
- Responsive UI for better user experience.

---

## Future Improvements

- Authentication & role-based access (ADMIN, Customer).
- Dashboard with analytics (services done, revenue, etc.).
- Deployment on cloud (Heroku / AWS).
- CI/CD pipeline integration.

---

## Acknowledgements

This project was developed as part of the **DBMS Course Project** under
the guidance of **Rabindranath Choudhary C**.

---

## Author

👨‍💻 **Atul Kumar Pandey**\
Roll No: 23074006 \| 3rd Year \| CSE (IDD)
