export interface Customer {
  customer_id: string;
  name: string;
  type: string;
  contact_info: Record<string, any>;
  created_at: string;
  updated_at: string;
  enquiries?: Enquiry[];
  serviceCalls?: ServiceCall[];
}

export interface Enquiry {
  enquiry_id: string;
  source: string;
  status: string;
  enquiry_date: string;
  enquiry_type: string;
  customer_id: string;
  created_at: string;
  updated_at: string;
  customer?: Customer;
  projects?: Project[];
}

export interface Project {
  project_id: string;
  total_cost: number;
  lead_time: number;
  advance_payment_status: string;
  expected_delivery_date: string;
  enquiry_id: string;
  created_at: string;
  updated_at: string;
  enquiry?: Enquiry;
  inventoryUnits?: InventoryUnit[];
}

export interface Godown {
  godown_id: string;
  name: string;
  location: string;
  capacity: number;
  created_at: string;
  updated_at: string;
  inventoryUnits?: InventoryUnit[];
}

export interface InventoryUnit {
  serial_number: string;
  current_location: string;
  warranty_status: string;
  installation_date: string | null;
  godown_id: string;
  project_id: string | null;
  created_at: string;
  updated_at: string;
  godown?: Godown;
  project?: Project;
}

export interface Technician {
  technician_id: string;
  name: string;
  phone_number: string;
  specialization: string;
  created_at: string;
  updated_at: string;
  serviceCalls?: ServiceCall[];
}

export interface ServiceCall {
  call_id: string;
  type: string;
  date_opened: string;
  defect_details: string;
  status: string;
  customer_id: string;
  technician_id: string | null;
  created_at: string;
  updated_at: string;
  customer?: Customer;
  technician?: Technician;
}

export type EnquiryStatus = 'NEW' | 'QUALIFIED' | 'PROPOSAL_SENT' | 'NEGOTIATION' | 'CONVERTED' | 'LOST';
export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
export type ServiceCallStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type WarrantyStatus = 'ACTIVE' | 'EXPIRED' | 'VOID' | 'PENDING';
export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'FULL' | 'OVERDUE';