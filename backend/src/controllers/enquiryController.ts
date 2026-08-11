import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getEnquiries = async (req: Request, res: Response) => {
  try {
    const { status, customer_id } = req.query;
    const where: any = {};
    if (status) where.status = status;
    if (customer_id) where.customer_id = customer_id;

    const enquiries = await prisma.enquiry.findMany({
      where,
      include: {
        customer: true,
        projects: true,
      },
      orderBy: { enquiry_date: 'desc' },
    });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
};

export const getEnquiryById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const enquiry = await prisma.enquiry.findUnique({
      where: { enquiry_id: id },
      include: {
        customer: true,
        projects: { include: { inventoryUnits: true } },
      },
    });
    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }
    res.json(enquiry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enquiry' });
  }
};

export const createEnquiry = async (req: Request, res: Response) => {
  try {
    const { source, status, enquiry_type, customer_id } = req.body;
    const enquiry = await prisma.enquiry.create({
      data: { source, status, enquiry_type, customer_id },
    });
    res.status(201).json(enquiry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create enquiry' });
  }
};

export const updateEnquiry = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { source, status, enquiry_type } = req.body;
    const enquiry = await prisma.enquiry.update({
      where: { enquiry_id: id },
      data: { source, status, enquiry_type },
    });
    res.json(enquiry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update enquiry' });
  }
};

export const deleteEnquiry = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.enquiry.delete({ where: { enquiry_id: id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete enquiry' });
  }
};

export const convertEnquiryToProject = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { total_cost, lead_time, advance_payment_status, expected_delivery_date } = req.body;

    const enquiry = await prisma.enquiry.findUnique({
      where: { enquiry_id: id },
    });

    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    const project = await prisma.project.create({
      data: {
        total_cost,
        lead_time,
        advance_payment_status,
        expected_delivery_date: new Date(expected_delivery_date),
        enquiry_id: id,
      },
    });

    await prisma.enquiry.update({
      where: { enquiry_id: id },
      data: { status: 'CONVERTED' },
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to convert enquiry to project' });
  }
};