import dotenv from "dotenv";

// 1) Handle Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message, err.stack);
  process.exit(1);
});

// Configure environment variable path
dotenv.config({ path: "./config/config.env" });

import app from "./app.js";
import connectDB from "./config/db.js";
import Course from "./models/courseModel.js";

// 2) Connect database
await connectDB();

// 3) Seed Database with initial courses if empty
const seedCourses = async () => {
  try {
    const count = await Course.countDocuments();
    if (count === 0) {
      console.log("No courses found. Seeding initial courses...");
      const sampleCourses = [
        {
          title: "Introduction to Python Programming",
          description:
            "Learn the fundamentals of Python syntax, loops, functions, and object-oriented paradigms.",
          level: "Beginner",
          duration: 12,
          subject: "Coding",
          instructor: "Dr. Jane Smith",
          enrollmentCount: 128,
        },
        {
          title: "Calculus I: Limits and Derivatives",
          description:
            "A comprehensive study of limits, continuity, derivative techniques, and applications of differentiation.",
          level: "Intermediate",
          duration: 18,
          subject: "Math",
          instructor: "Prof. Alan Turing",
          enrollmentCount: 94,
        },
        {
          title: "Modern Quantum Mechanics",
          description:
            "Explore Schrödinger equations, wavefunctions, quantum state operations, and subatomic dynamics.",
          level: "Advanced",
          duration: 24,
          subject: "Science",
          instructor: "Dr. Richard Feynman",
          enrollmentCount: 42,
        },
        {
          title: "World War II: Global Conflict Analysis",
          description:
            "Analyze key conflicts, strategies, geopolitical alliances, and historical outcomes of the Second World War.",
          level: "Intermediate",
          duration: 10,
          subject: "History",
          instructor: "Prof. A. J. P. Taylor",
          enrollmentCount: 88,
        },
      ];
      await Course.create(sampleCourses);
      console.log("Courses seeded successfully! 🌱");
    }
  } catch (error) {
    console.error("Error seeding courses:", error);
  }
};

await seedCourses();

// 4) Start Server
const port = process.env.PORT || 5500;
const server = app.listen(port, () => {
  console.log(
    `App running in ${process.env.NODE_ENV || "development"} mode on port ${port}...`,
  );
});

// 5) Handle Unhandled Rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
