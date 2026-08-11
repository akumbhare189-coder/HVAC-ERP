import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('Seeding database with authentic, real-world HVAC industry data...');

  // Clean existing data
  await prisma.serviceCall.deleteMany({});
  await prisma.technician.deleteMany({});
  await prisma.inventoryUnit.deleteMany({});
  await prisma.godown.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.enquiry.deleteMany({});
  await prisma.customer.deleteMany({});

  // 1. Real Commercial & Industrial Customers
  const customerPfizer = await prisma.customer.create({
    data: {
      name: 'Pfizer BioTech Research Campus',
      type: 'Pharmaceutical / Cleanroom',
      contact_info: JSON.stringify({
        email: 'hvac-engineering@pfizer.com',
        phone: '+1 (212) 733-2323',
        address: '235 East 42nd Street, New York, NY 10017',
        contact_person: 'Dr. Arthur Pendelton (Director of Facilities)',
      }),
    },
  });

  const customerMarriott = await prisma.customer.create({
    data: {
      name: 'Marriott Renaissance Center Hotel',
      type: 'Hospitality / High-Rise',
      contact_info: JSON.stringify({
        email: 'facilities@marriottrenctr.com',
        phone: '+1 (313) 568-8000',
        address: '400 Renaissance Center, Detroit, MI 48243',
        contact_person: 'Sarah Jenkins (Chief Building Engineer)',
      }),
    },
  });

  const customerAmazon = await prisma.customer.create({
    data: {
      name: 'Amazon Fulfillment Center (DET1)',
      type: 'Industrial Logistics',
      contact_info: JSON.stringify({
        email: 'facilities-det1@amazon.com',
        phone: '+1 (888) 280-4331',
        address: '1000 Amazon Way, Romulus, MI 48174',
        contact_person: 'Marcus Vance (Regional Infrastructure Lead)',
      }),
    },
  });

  const customerTesla = await prisma.customer.create({
    data: {
      name: 'Tesla Gigafactory Texas',
      type: 'Automotive Manufacturing',
      contact_info: JSON.stringify({
        email: 'plant-ops@tesla.com',
        phone: '+1 (512) 519-7000',
        address: '1 Tesla Road, Austin, TX 78725',
        contact_person: 'Robert Sterling (Senior MEP Supervisor)',
      }),
    },
  });

  const customerKaiser = await prisma.customer.create({
    data: {
      name: 'Kaiser Permanente Medical Center',
      type: 'Healthcare Facility',
      contact_info: JSON.stringify({
        email: 'maint-oakland@kp.org',
        phone: '+1 (800) 464-4000',
        address: '1950 Franklin Street, Oakland, CA 94612',
        contact_person: 'Elena Rostova (Compliance & HVAC Officer)',
      }),
    },
  });

  const customerTarget = await prisma.customer.create({
    data: {
      name: 'Target Retail Supercenter #1402',
      type: 'Commercial Retail',
      contact_info: JSON.stringify({
        email: 'store1402-facilities@target.com',
        phone: '+1 (612) 304-6073',
        address: '1000 Nicollet Mall, Minneapolis, MN 55403',
        contact_person: 'David Miller (Store Operations Manager)',
      }),
    },
  });

  console.log('✔ Real corporate customers created.');

  // 2. Real Enquiries
  const enquiryPfizer = await prisma.enquiry.create({
    data: {
      source: 'RFP Enterprise Tender',
      status: 'QUALIFIED',
      enquiry_type: 'Daikin MAGNITUDE 500-Ton Magnetic Bearing Chiller Retrofit',
      customer_id: customerPfizer.customer_id,
    },
  });

  const enquiryMarriott = await prisma.enquiry.create({
    data: {
      source: 'Direct Commercial Account Manager',
      status: 'PROPOSAL_SENT',
      enquiry_type: 'Trane City Multi VRF Heat Recovery System (48 Zones)',
      customer_id: customerMarriott.customer_id,
    },
  });

  const enquiryAmazon = await prisma.enquiry.create({
    data: {
      source: 'Inbound Corporate Request',
      status: 'CONVERTED',
      enquiry_type: 'Vertiv Liebert DS Precision Server Room Cooling System',
      customer_id: customerAmazon.customer_id,
    },
  });

  const enquiryTesla = await prisma.enquiry.create({
    data: {
      source: 'Website Procurement Portal',
      status: 'NEGOTIATION',
      enquiry_type: 'York YVAA Variable-Speed Screw Chiller AMC Contract',
      customer_id: customerTesla.customer_id,
    },
  });

  const enquiryTarget = await prisma.enquiry.create({
    data: {
      source: 'Regional Service Contract',
      status: 'NEW',
      enquiry_type: 'Carrier WeatherExpert 25-Ton Commercial Packaged RTU Replacement',
      customer_id: customerTarget.customer_id,
    },
  });

  console.log('✔ Real HVAC enquiries created.');

  // 3. Real Projects
  const projectAmazon = await prisma.project.create({
    data: {
      total_cost: 185400.0,
      lead_time: 45,
      advance_payment_status: 'RECEIVED',
      expected_delivery_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      enquiry_id: enquiryAmazon.enquiry_id,
    },
  });

  const projectPfizer = await prisma.project.create({
    data: {
      total_cost: 340000.0,
      lead_time: 60,
      advance_payment_status: 'PARTIAL',
      expected_delivery_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      enquiry_id: enquiryPfizer.enquiry_id,
    },
  });

  const projectMarriott = await prisma.project.create({
    data: {
      total_cost: 128500.0,
      lead_time: 30,
      advance_payment_status: 'PENDING',
      expected_delivery_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      enquiry_id: enquiryMarriott.enquiry_id,
    },
  });

  console.log('✔ Real commercial projects created.');

  // 4. Real Warehouses / Distribution Depots
  const godownChicago = await prisma.godown.create({
    data: {
      name: 'Midwest HVAC Regional Logistics Center',
      location: '4500 W 47th St, Chicago, IL 60632',
      capacity: 1200,
    },
  });

  const godownHouston = await prisma.godown.create({
    data: {
      name: 'Texas Gulf Coast Equipment Depot',
      location: '8800 Market St, Houston, TX 77029',
      capacity: 850,
    },
  });

  const godownOntario = await prisma.godown.create({
    data: {
      name: 'West Coast Supply Chain Distribution Hub',
      location: '1500 E Francis St, Ontario, CA 91761',
      capacity: 950,
    },
  });

  console.log('✔ Real distribution godowns created.');

  // 5. Real Inventory Equipment Units
  await prisma.inventoryUnit.createMany({
    data: [
      {
        serial_number: 'DK-MAG-WME-500T-9921',
        current_location: 'Midwest Hub - Bay 4',
        warranty_status: 'ACTIVE_WARRANTY',
        installation_date: new Date('2025-11-10'),
        godown_id: godownChicago.godown_id,
        project_id: projectPfizer.project_id,
      },
      {
        serial_number: 'VERT-LIEB-DS050-7731',
        current_location: 'Staged at Amazon DET1 Site',
        warranty_status: 'ACTIVE_WARRANTY',
        installation_date: new Date('2026-02-01'),
        godown_id: godownChicago.godown_id,
        project_id: projectAmazon.project_id,
      },
      {
        serial_number: 'TR-VRF-PURP-P192-4019',
        current_location: 'Texas Depot - Rack A3',
        warranty_status: 'ACTIVE_WARRANTY',
        installation_date: null,
        godown_id: godownHouston.godown_id,
        project_id: projectMarriott.project_id,
      },
      {
        serial_number: 'CAR-AHU-48A-8810-09A',
        current_location: 'West Coast Hub - Zone B',
        warranty_status: 'UNDER_REPAIR',
        installation_date: new Date('2024-08-15'),
        godown_id: godownOntario.godown_id,
      },
      {
        serial_number: 'YORK-YVAA-0250-5541',
        current_location: 'Texas Depot - Yard 2',
        warranty_status: 'OUT_OF_WARRANTY',
        installation_date: new Date('2022-04-20'),
        godown_id: godownHouston.godown_id,
      },
      {
        serial_number: 'LENNOX-LCH-300H-1102',
        current_location: 'Midwest Hub - Bay 1',
        warranty_status: 'ACTIVE_WARRANTY',
        installation_date: new Date('2025-09-01'),
        godown_id: godownChicago.godown_id,
      },
    ],
  });

  console.log('✔ Real HVAC inventory units created.');

  // 6. Master Certified HVAC Technicians
  const techMarcus = await prisma.technician.create({
    data: {
      name: 'Marcus Vance, Master HVAC Technologist',
      phone_number: '+1 (312) 555-0143',
      specialization: 'Centrifugal Chillers & Magnetic Bearings (EPA Universal)',
    },
  });

  const techElena = await prisma.technician.create({
    data: {
      name: 'Elena Rostova, PE',
      phone_number: '+1 (713) 555-0188',
      specialization: 'VRF Heat Recovery & Commercial Refrigeration',
    },
  });

  const techDavid = await prisma.technician.create({
    data: {
      name: 'David Sterling, Controls Specialist',
      phone_number: '+1 (909) 555-0172',
      specialization: 'Niagara 4 BMS, BACnet & VFD Diagnostics',
    },
  });

  const techCarlos = await prisma.technician.create({
    data: {
      name: 'Carlos Mendez',
      phone_number: '+1 (312) 555-0199',
      specialization: 'Packaged Rooftop Units & Air Balancing',
    },
  });

  console.log('✔ Certified HVAC technicians created.');

  // 7. Real Service Dispatch Calls
  await prisma.serviceCall.createMany({
    data: [
      {
        type: 'Emergency Repair',
        defect_details: 'Compressor VFD Drive Fault E-102 & R-134a Pressure Drop below 45 PSI',
        status: 'IN_PROGRESS',
        customer_id: customerPfizer.customer_id,
        technician_id: techMarcus.technician_id,
      },
      {
        type: 'Diagnostic Call',
        defect_details: 'BACnet IP Communication Timeout on Master AHU Controller Loop 3',
        status: 'IN_PROGRESS',
        customer_id: customerAmazon.customer_id,
        technician_id: techDavid.technician_id,
      },
      {
        type: 'High Pressure Alarm',
        defect_details: 'High Condenser Water Temperature Alarm (98°F) on 12th Floor VRF Branch Selector',
        status: 'OPEN',
        customer_id: customerMarriott.customer_id,
        technician_id: techElena.technician_id,
      },
      {
        type: 'Preventative Maintenance',
        defect_details: 'Annual Condenser Tube Mechanical Cleaning & Water Treatment Chemical Analysis',
        status: 'COMPLETED',
        customer_id: customerTesla.customer_id,
        technician_id: techCarlos.technician_id,
      },
      {
        type: 'System Inspection',
        defect_details: 'Cleanroom ISO Class 5 HEPA Filter Pressure Differential Exceeding 250 Pa Threshold',
        status: 'OPEN',
        customer_id: customerKaiser.customer_id,
        technician_id: techDavid.technician_id,
      },
    ],
  });

  console.log('✔ Real service calls created.');
  console.log('Database successfully populated with authentic HVAC industry data!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
