import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addChild = async (req, res) => {
  try {
    const { name, birthDate, gender } = req.body;
    const child = await prisma.child.create({
      data: {
        name,
        birthDate: new Date(birthDate),
        gender,
        parentId: req.user.userId,
      },
    });
    res.status(201).json(child);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getChildren = async (req, res) => {
  try {
    const children = await prisma.child.findMany({
      where: { parentId: req.user.userId },
    });
    res.json(children);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getChild = async (req, res) => {
  try {
    const child = await prisma.child.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!child || child.parentId !== req.user.userId) {
      return res.status(404).json({ error: "Child not found" });
    }
    res.json(child);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
