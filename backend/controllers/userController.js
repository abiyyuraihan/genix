import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const register = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, phone },
    });
    res
      .status(201)
      .json({ message: "User registered successfully", userId: user.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, email: true, name: true, phone: true },
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: { name, email, phone },
      select: { id: true, email: true, name: true, phone: true },
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
