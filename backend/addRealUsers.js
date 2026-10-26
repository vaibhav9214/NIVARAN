require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Department = require("./models/Department");

async function main() {
  await mongoose.connect(process.env.MONGO_URI);

  const passwordHash = await bcrypt.hash("1234", 12);

  const accounts = [
    {
      name: "Praveer Singh",
      email: "singhpraveer984@gmail.com",
      role: "student",
      studentId: "NIV-REAL-STU-001",
      departmentCode: "CSE",
    },
    {
      name: "Praveer Singh",
      email: "singhpraveer513@gmail.com",
      role: "officer",
      studentId: null,
      departmentCode: "CSE",
    },
    {
      name: "Zelensk Admin",
      email: "zelensk984@gmail.com",
      role: "admin",
      studentId: null,
      departmentCode: "SWA",
    },
  ];

  for (const account of accounts) {
    const department = await Department.findOne({
      code: account.departmentCode,
    });

    if (!department) {
      throw new Error(
        `Department ${account.departmentCode} not found. Seed departments first.`
      );
    }

    const existing = await User.findOne({
      email: account.email.toLowerCase(),
    });

    if (existing) {
      console.log(`Already exists; skipped: ${account.email}`);
      continue;
    }

    await User.create({
      name: account.name,
      email: account.email,
      passwordHash,
      role: account.role,
      accountStatus: "active",
      department: department._id,
      studentId: account.studentId,
      mustChangePassword: true,
      passwordChangedAt: null,
    });

    console.log(`Created ${account.role}: ${account.email}`);
  }

  console.log("\nReal accounts processed.");
  console.log("Temporary password: 1234");
  console.log("Password change required at first login.");

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("Error:", error.message);
  await mongoose.disconnect();
  process.exit(1);
});