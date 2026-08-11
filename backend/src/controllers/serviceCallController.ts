import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getServiceCalls = async (req: Request, res: Response) => {
  try {
    const { status, customer_id, technician_id } = req.query;
    const where: any = {};
    if (status) where.status = status;
    if (customer_id) where.customer_id = customer_id;
    if (technician_id) where.technician_id = technician_id;

    const serviceCalls = await prisma.serviceCall.findMany({
      where,
      include: {
        customer: true,
        technician: true,
      },
      orderBy: { date_opened: 'desc' },
    });
    res.json(serviceCalls);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch service calls' });
  }
};

export const getServiceCallById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const serviceCall = await prisma.serviceCall.findUnique({
      where: { call_id: id },
      include: {
        customer: true,
        technician: true,
      },
    });
    if (!serviceCall) {
      return res.status(404).json({ error: 'Service call not found' });
    }
    res.json(serviceCall);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch service call' });
  }
};

export const createServiceCall = async (req: Request, res: Response) => {
  try {
    const { type, defect_details, status, customer_id, technician_id } = req.body;
    const serviceCall = await prisma.serviceCall.create({
      data: { type, defect_details, status, customer_id, technician_id },
    });
    res.status(201).json(serviceCall);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create service call' });
  }
};

export const updateServiceCall = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { type, defect_details, status, technician_id } = req.body;
    const serviceCall = await prisma.serviceCall.update({
      where: { call_id: id },
      data: { type, defect_details, status, technician_id },
    });
    res.json(serviceCall);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update service call' });
  }
};

export const deleteServiceCall = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.serviceCall.delete({ where: { call_id: id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete service call' });
  }
};

export const assignTechnician = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { technician_id } = req.body;
    const serviceCall = await prisma.serviceCall.update({
      where: { call_id: id },
      data: { technician_id, status: 'ASSIGNED' },
    });
    res.json(serviceCall);
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign technician' });
  }
};