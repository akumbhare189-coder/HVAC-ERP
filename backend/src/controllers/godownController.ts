import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getGodowns = async (req: Request, res: Response) => {
  try {
    const godowns = await prisma.godown.findMany({
      include: {
        inventoryUnits: true,
      },
      orderBy: { created_at: 'desc' },
    });
    res.json(godowns);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch godowns' });
  }
};

export const getGodownById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const godown = await prisma.godown.findUnique({
      where: { godown_id: id },
      include: { inventoryUnits: true },
    });
    if (!godown) {
      return res.status(404).json({ error: 'Godown not found' });
    }
    res.json(godown);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch godown' });
  }
};

export const createGodown = async (req: Request, res: Response) => {
  try {
    const { name, location, capacity } = req.body;
    const godown = await prisma.godown.create({
      data: { name, location, capacity },
    });
    res.status(201).json(godown);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create godown' });
  }
};

export const updateGodown = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, location, capacity } = req.body;
    const godown = await prisma.godown.update({
      where: { godown_id: id },
      data: { name, location, capacity },
    });
    res.json(godown);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update godown' });
  }
};

export const deleteGodown = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.godown.delete({ where: { godown_id: id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete godown' });
  }
};