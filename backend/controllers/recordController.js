import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addRecord = async (req, res) => {
  try {
    const { childId, weight, height, age, notes } = req.body;
    const child = await prisma.child.findUnique({ where: { id: childId } });
    if (!child || child.parentId !== req.user.userId) {
      return res.status(404).json({ error: "Child not found" });
    }
    const record = await prisma.record.create({
      data: {
        childId,
        weight,
        height,
        date: new Date(),
      },
    });
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getRecords = async (req, res) => {
  try {
    const { childId } = req.params;
    const child = await prisma.child.findUnique({
      where: { id: parseInt(childId) },
    });
    if (!child || child.parentId !== req.user.userId) {
      return res.status(404).json({ error: "Child not found" });
    }
    const records = await prisma.record.findMany({
      where: { childId: parseInt(childId) },
      orderBy: { date: "desc" },
    });
    res.json(records);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
