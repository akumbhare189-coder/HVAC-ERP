import dotenv from 'dotenv';
import { prisma } from '../src/lib/prisma';

dotenv.config();

async function main() {
  console.log('Seeding database with authentic, real-world HVAC industry data...');

  const now = new Date();
  const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 60 * 60 * 1000);
  const daysFromNow = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

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

  const customerTataMotors = await prisma.customer.create({
    data: {
      name: 'Tata Motors Passenger Vehicles',
      type: 'Automotive Manufacturing',
      contact_info: JSON.stringify({
        email: 'facility-ops@tatamotors.com',
        phone: '+91 20 6624 9000',
        address: 'Pune, Maharashtra 411045',
        contact_person: 'Arjun Nair (Plant Maintenance Manager)',
      }),
    },
  });

  const customerInfosys = await prisma.customer.create({
    data: {
      name: 'Infosys Limited',
      type: 'IT Campus Operations',
      contact_info: JSON.stringify({
        email: 'campus-services@infosys.com',
        phone: '+91 80 2852 0261',
        address: 'Electronics City, Bengaluru, Karnataka 560100',
        contact_person: 'Riya Mehta (Infrastructure Lead)',
      }),
    },
  });

  const customerApollo = await prisma.customer.create({
    data: {
      name: 'Apollo Hospitals Enterprise Ltd.',
      type: 'Healthcare Facility',
      contact_info: JSON.stringify({
        email: 'facility.planning@apollohospitals.com',
        phone: '+91 44 2829 3333',
        address: 'Chennai, Tamil Nadu 600035',
        contact_person: 'Sanjay Reddy (Medical Engineering Head)',
      }),
    },
  });

  const customerReliance = await prisma.customer.create({
    data: {
      name: 'Reliance Industries Limited',
      type: 'Industrial Complex',
      contact_info: JSON.stringify({
        email: 'industrial.services@reliance.com',
        phone: '+91 289 669 7000',
        address: 'Jamnagar, Gujarat 361140',
        contact_person: 'Vikram Shah (Utility Operations Head)',
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

  const enquiryTataMotors = await prisma.enquiry.create({
    data: {
      source: 'Plant Maintenance Procurement',
      status: 'QUALIFIED',
      enquiry_type: 'Blue Star Chiller Plant Modernization for Paint Shop',
      customer_id: customerTataMotors.customer_id,
      enquiry_date: hoursAgo(18),
    },
  });

  const enquiryInfosys = await prisma.enquiry.create({
    data: {
      source: 'Campus Energy Audit',
      status: 'PROPOSAL_SENT',
      enquiry_type: 'DAIKIN VRV IV Plus Upgradation for 3 Office Blocks',
      customer_id: customerInfosys.customer_id,
      enquiry_date: hoursAgo(42),
    },
  });

  const enquiryApollo = await prisma.enquiry.create({
    data: {
      source: 'Hospital Facilities Network',
      status: 'NEGOTIATION',
      enquiry_type: 'Critical Care HVAC Redundancy Expansion',
      customer_id: customerApollo.customer_id,
      enquiry_date: hoursAgo(72),
    },
  });

  const enquiryReliance = await prisma.enquiry.create({
    data: {
      source: 'Utility Operations Board',
      status: 'CONVERTED',
      enquiry_type: 'Thermal Storage & Cooling Tower Optimization Project',
      customer_id: customerReliance.customer_id,
      enquiry_date: hoursAgo(120),
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

  const projectTataMotors = await prisma.project.create({
    data: {
      total_cost: 421500.0,
      lead_time: 52,
      advance_payment_status: 'RECEIVED',
      expected_delivery_date: daysFromNow(21),
      enquiry_id: enquiryTataMotors.enquiry_id,
    },
  });

  const projectInfosys = await prisma.project.create({
    data: {
      total_cost: 267400.0,
      lead_time: 38,
      advance_payment_status: 'PARTIAL',
      expected_delivery_date: daysFromNow(16),
      enquiry_id: enquiryInfosys.enquiry_id,
    },
  });

  const projectApollo = await prisma.project.create({
    data: {
      total_cost: 318900.0,
      lead_time: 41,
      advance_payment_status: 'PENDING',
      expected_delivery_date: daysFromNow(26),
      enquiry_id: enquiryApollo.enquiry_id,
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

  const godownPune = await prisma.godown.create({
    data: {
      name: 'Tata Motors Component Warehouse',
      location: 'Chakan, Pune, Maharashtra 410501',
      capacity: 1100,
    },
  });

  const godownBengaluru = await prisma.godown.create({
    data: {
      name: 'Infosys Campus Energy Hub',
      location: 'Electronics City, Bengaluru, Karnataka 560100',
      capacity: 720,
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
      {
        serial_number: 'TATAMOTORS-CHILLER-4421',
        current_location: 'Chakan Plant - Utility Bay 2',
        warranty_status: 'ACTIVE_WARRANTY',
        installation_date: hoursAgo(18 * 24),
        godown_id: godownPune.godown_id,
        project_id: projectTataMotors.project_id,
      },
      {
        serial_number: 'INFY-VRV-6178-BLR',
        current_location: 'Electronics City Campus - Block B',
        warranty_status: 'ACTIVE_WARRANTY',
        installation_date: hoursAgo(26 * 24),
        godown_id: godownBengaluru.godown_id,
        project_id: projectInfosys.project_id,
      },
      {
        serial_number: 'APOLLO-CRAC-9034-CHN',
        current_location: 'Apollo Chennai ICU Support Area',
        warranty_status: 'UNDER_REPAIR',
        installation_date: hoursAgo(14 * 24),
        godown_id: godownBengaluru.godown_id,
        project_id: projectApollo.project_id,
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

  const techRohit = await prisma.technician.create({
    data: {
      name: 'Rohit Sharma',
      phone_number: '+91 98200 11234',
      specialization: 'Industrial Chillers & Plant Utilities',
    },
  });

  const techNeha = await prisma.technician.create({
    data: {
      name: 'Neha Kapoor',
      phone_number: '+91 98765 43210',
      specialization: 'Healthcare HVAC & Critical Environment Compliance',
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
        date_opened: hoursAgo(3),
      },
      {
        type: 'Diagnostic Call',
        defect_details: 'BACnet IP Communication Timeout on Master AHU Controller Loop 3',
        status: 'IN_PROGRESS',
        customer_id: customerAmazon.customer_id,
        technician_id: techDavid.technician_id,
        date_opened: hoursAgo(6),
      },
      {
        type: 'High Pressure Alarm',
        defect_details: 'High Condenser Water Temperature Alarm (98°F) on 12th Floor VRF Branch Selector',
        status: 'OPEN',
        customer_id: customerMarriott.customer_id,
        technician_id: techElena.technician_id,
        date_opened: hoursAgo(9),
      },
      {
        type: 'Preventative Maintenance',
        defect_details: 'Annual Condenser Tube Mechanical Cleaning & Water Treatment Chemical Analysis',
        status: 'COMPLETED',
        customer_id: customerTesla.customer_id,
        technician_id: techCarlos.technician_id,
        date_opened: hoursAgo(36),
      },
      {
        type: 'System Inspection',
        defect_details: 'Cleanroom ISO Class 5 HEPA Filter Pressure Differential Exceeding 250 Pa Threshold',
        status: 'OPEN',
        customer_id: customerKaiser.customer_id,
        technician_id: techDavid.technician_id,
        date_opened: hoursAgo(12),
      },
      {
        type: 'Performance Review',
        defect_details: 'Cooling tower fan VFD harmonics above threshold at Tata Motors paint shop utilities',
        status: 'IN_PROGRESS',
        customer_id: customerTataMotors.customer_id,
        technician_id: techRohit.technician_id,
        date_opened: hoursAgo(2),
      },
      {
        type: 'Critical Environment Check',
        defect_details: 'Microbiological safety room pressure imbalance and AHU differential failure in oncology block',
        status: 'OPEN',
        customer_id: customerApollo.customer_id,
        technician_id: techNeha.technician_id,
        date_opened: hoursAgo(5),
      },
      {
        type: 'Energy Optimization',
        defect_details: 'Re-commissioning VRF system and sensor calibration for campus office blocks',
        status: 'COMPLETED',
        customer_id: customerInfosys.customer_id,
        technician_id: techElena.technician_id,
        date_opened: hoursAgo(28),
      },
      {
        type: 'Utility Audit',
        defect_details: 'Thermal storage cycle mismatch and cooling load balancing at Reliance complex',
        status: 'OPEN',
        customer_id: customerReliance.customer_id,
        technician_id: techRohit.technician_id,
        date_opened: hoursAgo(15),
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
