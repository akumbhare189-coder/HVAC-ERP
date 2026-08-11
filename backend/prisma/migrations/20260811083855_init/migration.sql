-- CreateTable
CREATE TABLE "Customer" (
    "customer_id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "contact_info" JSONB NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Enquiry" (
    "enquiry_id" TEXT NOT NULL PRIMARY KEY,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "enquiry_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enquiry_type" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Enquiry_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer" ("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Project" (
    "project_id" TEXT NOT NULL PRIMARY KEY,
    "total_cost" REAL NOT NULL,
    "lead_time" INTEGER NOT NULL,
    "advance_payment_status" TEXT NOT NULL,
    "expected_delivery_date" DATETIME NOT NULL,
    "enquiry_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Project_enquiry_id_fkey" FOREIGN KEY ("enquiry_id") REFERENCES "Enquiry" ("enquiry_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Godown" (
    "godown_id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "InventoryUnit" (
    "serial_number" TEXT NOT NULL PRIMARY KEY,
    "current_location" TEXT NOT NULL,
    "warranty_status" TEXT NOT NULL,
    "installation_date" DATETIME,
    "godown_id" TEXT NOT NULL,
    "project_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "InventoryUnit_godown_id_fkey" FOREIGN KEY ("godown_id") REFERENCES "Godown" ("godown_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InventoryUnit_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project" ("project_id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Technician" (
    "technician_id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ServiceCall" (
    "call_id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "date_opened" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "defect_details" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "technician_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "ServiceCall_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer" ("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ServiceCall_technician_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "Technician" ("technician_id") ON DELETE SET NULL ON UPDATE CASCADE
);
