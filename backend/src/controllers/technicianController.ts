import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getTechnicians = async (req: Request, res: Response) => {
  try {
    const technicians = await prisma.technician.findMany({
      include: { serviceCalls: true },
      orderBy: { created_at: 'desc' },
    });
    res.json(technicians);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch technicians' });
  }
};

export const getTechnicianById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const technician = await prisma.technician.findUnique({
      where: { technician_id: id },
      include: { serviceCalls: { include: { customer: true } } },
    });
    if (!technician) {
      return res.status(404).json({ error: 'Technician not found' });
    }
    res.json(technician);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch technician' });
  }
};

export const createTechnician = async (req: Request, res: Response) => {
  try {
    const { name, phone_number, specialization } = req.body;
    const technician = await prisma.technician.create({
      data: { name, phone_number, specialization },
    });
    res.status(201).json(technician);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create technician' });
  }
};

export const updateTechnician = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, phone_number, specialization } = req.body;
    const technician = await prisma.technician.update({
      where: { technician_id: id },
      data: { name, phone_number, specialization },
    });
    res.json(technician);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update technician' });
  }
};

export const deleteTechnician = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.technician.delete({ where: { technician_id: id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete technician' });
  }
};