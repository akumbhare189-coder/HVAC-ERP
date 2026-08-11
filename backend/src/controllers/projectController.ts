import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getProjects = async (req: Request, res: Response) => {
  try {
    const { enquiry_id } = req.query;
    const where: any = {};
    if (enquiry_id) where.enquiry_id = enquiry_id;

    const projects = await prisma.project.findMany({
      where,
      include: {
        enquiry: { include: { customer: true } },
        inventoryUnits: true,
      },
      orderBy: { created_at: 'desc' },
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const project = await prisma.project.findUnique({
      where: { project_id: id },
      include: {
        enquiry: { include: { customer: true } },
        inventoryUnits: true,
      },
    });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const { total_cost, lead_time, advance_payment_status, expected_delivery_date, enquiry_id } = req.body;
    const project = await prisma.project.create({
      data: {
        total_cost,
        lead_time,
        advance_payment_status,
        expected_delivery_date: new Date(expected_delivery_date),
        enquiry_id,
      },
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { total_cost, lead_time, advance_payment_status, expected_delivery_date } = req.body;
    const project = await prisma.project.update({
      where: { project_id: id },
      data: { total_cost, lead_time, advance_payment_status, expected_delivery_date: new Date(expected_delivery_date) },
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.project.delete({ where: { project_id: id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
};