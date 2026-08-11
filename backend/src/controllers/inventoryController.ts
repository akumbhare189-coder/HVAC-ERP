import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getInventoryUnits = async (req: Request, res: Response) => {
  try {
    const { godown_id, project_id, warranty_status } = req.query;
    const where: any = {};
    if (godown_id) where.godown_id = godown_id;
    if (project_id) where.project_id = project_id;
    if (warranty_status) where.warranty_status = warranty_status;

    const inventoryUnits = await prisma.inventoryUnit.findMany({
      where,
      include: {
        godown: true,
        project: { include: { enquiry: { include: { customer: true } } } },
      },
      orderBy: { created_at: 'desc' },
    });
    res.json(inventoryUnits);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory units' });
  }
};

export const getInventoryUnitById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const inventoryUnit = await prisma.inventoryUnit.findUnique({
      where: { serial_number: id },
      include: {
        godown: true,
        project: { include: { enquiry: { include: { customer: true } } } },
      },
    });
    if (!inventoryUnit) {
      return res.status(404).json({ error: 'Inventory unit not found' });
    }
    res.json(inventoryUnit);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory unit' });
  }
};

export const createInventoryUnit = async (req: Request, res: Response) => {
  try {
    const { serial_number, current_location, warranty_status, installation_date, godown_id, project_id } = req.body;
    const inventoryUnit = await prisma.inventoryUnit.create({
      data: {
        serial_number,
        current_location,
        warranty_status,
        installation_date: installation_date ? new Date(installation_date) : null,
        godown_id,
        project_id,
      },
    });
    res.status(201).json(inventoryUnit);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create inventory unit' });
  }
};

export const updateInventoryUnit = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { current_location, warranty_status, installation_date, godown_id, project_id } = req.body;
    const inventoryUnit = await prisma.inventoryUnit.update({
      where: { serial_number: id },
      data: {
        current_location,
        warranty_status,
        installation_date: installation_date ? new Date(installation_date) : null,
        godown_id,
        project_id,
      },
    });
    res.json(inventoryUnit);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update inventory unit' });
  }
};

export const deleteInventoryUnit = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.inventoryUnit.delete({ where: { serial_number: id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete inventory unit' });
  }
};