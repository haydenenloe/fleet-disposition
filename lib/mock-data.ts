import type { Truck, MaintenanceEvent } from './types'

export const MOCK_TRUCKS: Truck[] = [
  {
    id: '1',
    unit_id: 'T-101',
    vin: '1FUJGBDV5CLBP8342',
    make: 'Freightliner',
    model: 'Cascadia',
    year: 2017,
    engine_type: 'Detroit DD15',
    purchase_date: '2019-03-15',
    purchase_price: 68000,
    odometer_at_purchase: 210000,
    current_odometer: 487500,
    warranty_expiry_mileage: null,
    warranty_expiry_date: null,
    eld_platform: 'Samsara',
    notes: 'High mileage unit, primary revenue earner on I-70 corridor',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    unit_id: 'T-102',
    vin: '3AKJGLD54FSFM1234',
    make: 'Kenworth',
    model: 'T680',
    year: 2020,
    engine_type: 'Paccar MX-13',
    purchase_date: '2020-08-10',
    purchase_price: 142000,
    odometer_at_purchase: 0,
    current_odometer: 298000,
    warranty_expiry_mileage: 500000,
    warranty_expiry_date: '2025-08-10',
    eld_platform: 'Motive',
    notes: 'Still under extended powertrain warranty',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    unit_id: 'T-103',
    vin: '1XKYD49X5EJ412876',
    make: 'Peterbilt',
    model: '579',
    year: 2014,
    engine_type: 'Cummins ISX15',
    purchase_date: '2016-11-20',
    purchase_price: 52000,
    odometer_at_purchase: 340000,
    current_odometer: 712000,
    warranty_expiry_mileage: null,
    warranty_expiry_date: null,
    eld_platform: 'HOS247',
    notes: 'Oldest unit in fleet, frequent breakdowns last 6 months',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    unit_id: 'T-104',
    vin: '3AKJHHDR0LSLU5671',
    make: 'International',
    model: 'LT Series',
    year: 2022,
    engine_type: 'Cummins X15',
    purchase_date: '2022-02-28',
    purchase_price: 168000,
    odometer_at_purchase: 0,
    current_odometer: 187000,
    warranty_expiry_mileage: 500000,
    warranty_expiry_date: '2027-02-28',
    eld_platform: 'Motive',
    notes: 'Newest unit, low maintenance costs, running well',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    unit_id: 'T-105',
    vin: '1FUJGBDV7DLBY9911',
    make: 'Freightliner',
    model: 'Cascadia',
    year: 2018,
    engine_type: 'Detroit DD13',
    purchase_date: '2020-01-05',
    purchase_price: 74000,
    odometer_at_purchase: 195000,
    current_odometer: 401000,
    warranty_expiry_mileage: null,
    warranty_expiry_date: null,
    eld_platform: 'Samsara',
    notes: 'Mid-range unit, moderate cost trend',
    created_at: '2024-01-01T00:00:00Z',
  },
]

export const MOCK_MAINTENANCE_EVENTS: MaintenanceEvent[] = [
  // T-101 — High cost, escalating (SELL signal)
  { id: 'm1', unit_id: 'T-101', event_date: '2026-03-10', shop_name: 'Denver Truck Repair', invoice_total: 4200, repair_category: 'Engine', mileage_at_repair: 485000, notes: 'Injector replacement, 2 of 6', created_at: '2026-03-10T00:00:00Z' },
  { id: 'm2', unit_id: 'T-101', event_date: '2026-02-14', shop_name: 'Denver Truck Repair', invoice_total: 2800, repair_category: 'Transmission', mileage_at_repair: 481000, notes: 'Clutch adjustment + fluid', created_at: '2026-02-14T00:00:00Z' },
  { id: 'm3', unit_id: 'T-101', event_date: '2026-01-22', shop_name: 'Roadside', invoice_total: 1100, repair_category: 'Brakes', mileage_at_repair: 477000, notes: 'Emergency brake pad replacement', created_at: '2026-01-22T00:00:00Z' },
  { id: 'm4', unit_id: 'T-101', event_date: '2025-11-03', shop_name: 'Denver Truck Repair', invoice_total: 1900, repair_category: 'Cooling System', mileage_at_repair: 469000, notes: 'Radiator hose + thermostat', created_at: '2025-11-03T00:00:00Z' },
  { id: 'm5', unit_id: 'T-101', event_date: '2025-09-18', shop_name: 'Flying J Shop', invoice_total: 650, repair_category: 'PM Service', mileage_at_repair: 462000, notes: 'Oil, filters, DEF top-off', created_at: '2025-09-18T00:00:00Z' },
  { id: 'm6', unit_id: 'T-101', event_date: '2025-08-05', shop_name: 'Denver Truck Repair', invoice_total: 3100, repair_category: 'DPF / Emissions', mileage_at_repair: 455000, notes: 'DPF cleaning + EGR valve', created_at: '2025-08-05T00:00:00Z' },

  // T-102 — Low cost, under warranty (HOLD signal)
  { id: 'm7', unit_id: 'T-102', event_date: '2026-03-05', shop_name: 'Kenworth Denver', invoice_total: 540, repair_category: 'PM Service', mileage_at_repair: 296000, notes: 'Scheduled oil + filter', created_at: '2026-03-05T00:00:00Z' },
  { id: 'm8', unit_id: 'T-102', event_date: '2025-12-10', shop_name: 'Kenworth Denver', invoice_total: 720, repair_category: 'PM Service', mileage_at_repair: 285000, notes: 'Oil change + tire rotation', created_at: '2025-12-10T00:00:00Z' },
  { id: 'm9', unit_id: 'T-102', event_date: '2025-09-02', shop_name: 'Kenworth Denver', invoice_total: 480, repair_category: 'PM Service', mileage_at_repair: 272000, notes: 'Scheduled maintenance', created_at: '2025-09-02T00:00:00Z' },

  // T-103 — Very high cost, very old (SELL NOW signal)
  { id: 'm10', unit_id: 'T-103', event_date: '2026-03-18', shop_name: 'Cummins Authorized', invoice_total: 7400, repair_category: 'Engine', mileage_at_repair: 710000, notes: 'Overhead rebuild, liner replacement', created_at: '2026-03-18T00:00:00Z' },
  { id: 'm11', unit_id: 'T-103', event_date: '2026-02-28', shop_name: 'Roadside', invoice_total: 950, repair_category: 'Electrical', mileage_at_repair: 708000, notes: 'Alternator failure, tow + repair', created_at: '2026-02-28T00:00:00Z' },
  { id: 'm12', unit_id: 'T-103', event_date: '2026-01-09', shop_name: 'Cummins Authorized', invoice_total: 3200, repair_category: 'Turbo / Intake', mileage_at_repair: 703000, notes: 'Turbocharger replacement', created_at: '2026-01-09T00:00:00Z' },
  { id: 'm13', unit_id: 'T-103', event_date: '2025-11-15', shop_name: 'Local Shop', invoice_total: 2100, repair_category: 'Drivetrain', mileage_at_repair: 696000, notes: 'U-joint + driveshaft work', created_at: '2025-11-15T00:00:00Z' },
  { id: 'm14', unit_id: 'T-103', event_date: '2025-09-20', shop_name: 'Cummins Authorized', invoice_total: 4800, repair_category: 'Engine', mileage_at_repair: 688000, notes: 'Fuel pump + injector cleaning', created_at: '2025-09-20T00:00:00Z' },

  // T-104 — Minimal cost, newest (strong HOLD)
  { id: 'm15', unit_id: 'T-104', event_date: '2026-02-20', shop_name: 'International Dealer', invoice_total: 620, repair_category: 'PM Service', mileage_at_repair: 185000, notes: 'Scheduled oil + DEF', created_at: '2026-02-20T00:00:00Z' },
  { id: 'm16', unit_id: 'T-104', event_date: '2025-10-14', shop_name: 'International Dealer', invoice_total: 580, repair_category: 'PM Service', mileage_at_repair: 172000, notes: 'Oil change + inspection', created_at: '2025-10-14T00:00:00Z' },

  // T-105 — Moderate cost, trending up slightly (MONITOR)
  { id: 'm17', unit_id: 'T-105', event_date: '2026-03-12', shop_name: 'Freightliner Denver', invoice_total: 1850, repair_category: 'Brakes', mileage_at_repair: 399000, notes: 'Full brake job, all axles', created_at: '2026-03-12T00:00:00Z' },
  { id: 'm18', unit_id: 'T-105', event_date: '2026-01-30', shop_name: 'Flying J Shop', invoice_total: 720, repair_category: 'PM Service', mileage_at_repair: 393000, notes: 'Oil + filters + DEF', created_at: '2026-01-30T00:00:00Z' },
  { id: 'm19', unit_id: 'T-105', event_date: '2025-11-08', shop_name: 'Freightliner Denver', invoice_total: 1400, repair_category: 'Cooling System', mileage_at_repair: 386000, notes: 'Water pump replacement', created_at: '2025-11-08T00:00:00Z' },
  { id: 'm20', unit_id: 'T-105', event_date: '2025-08-22', shop_name: 'Flying J Shop', invoice_total: 680, repair_category: 'PM Service', mileage_at_repair: 376000, notes: 'Scheduled maintenance', created_at: '2025-08-22T00:00:00Z' },
]

// Pre-canned AI analysis responses keyed by unit_id
export const MOCK_ANALYSIS: Record<string, { recommendation: string; dataUsed: object }> = {
  'T-101': {
    recommendation: `**RECOMMENDATION: SELL — List within 30 days**

Unit T-101 is showing clear escalation signals that indicate you're entering a costly maintenance cycle typical of high-mileage Cascadias in the 480,000–520,000 mile range.

**What the numbers are telling you:**
- You've spent **$8,100 in the last 90 days** on this truck — up from $5,650 in the prior 90-day window. That's a **43% escalation** in maintenance spend.
- The injector replacement in March is especially concerning. Once you're replacing injectors on a DD15 at 485k miles, the others aren't far behind. A full injector set runs $12,000–$18,000 at a dealer.
- This truck is costing you an estimated **$2,700/month** in maintenance alone, not counting downtime or lost revenue when it's in the shop.

**Market timing:**
At 487,500 miles, you're still in a window where this truck has meaningful resale value — likely **$28,000–$34,000** to a buyer who runs used iron. Wait another 6 months and that window closes fast.

**Action window: 15–30 days.** List now while it's not sitting at a shop. A truck that drives to the buyer is worth $4,000–$6,000 more than one that gets towed.`,
    dataUsed: {
      unitId: 'T-101', vehicle: '2017 Freightliner Cascadia', ageMonths: 84,
      currentMileage: 487500, totalMaintenanceCost: 13750, last90DayCost: 8100,
      prior90DayCost: 5650, warrantyStatus: 'No warranty data on file',
      marketValue: 31000, eventCount: 6,
    },
  },
  'T-102': {
    recommendation: `**RECOMMENDATION: HOLD — Strong keep for 18–24 months**

Unit T-102 is one of your best performing assets right now. Low maintenance cost, active warranty coverage, and still well under the 300,000-mile threshold where costs typically accelerate.

**What the numbers are telling you:**
- You've spent just **$1,260 in the last 6 months** on this truck — nearly all scheduled PM. No unplanned repairs.
- The Paccar MX-13 is covered by extended powertrain warranty through August 2025 (date) and 500,000 miles — you have both buffers still active.
- This truck is costing you roughly **$210/month** in maintenance. That's exceptional for a truck doing real miles.

**Why selling now would be a mistake:**
At 298,000 miles, you'd be selling in the most competitive resale window — buyers know it, and you'd be leaving value on the table. Hold through 400,000 miles and reassess.

**Action window: 18–24 months.** Revisit when mileage approaches 420,000 or if maintenance spend spikes above $1,500/month for two consecutive months.`,
    dataUsed: {
      unitId: 'T-102', vehicle: '2020 Kenworth T680', ageMonths: 67,
      currentMileage: 298000, totalMaintenanceCost: 1740, last90DayCost: 540,
      prior90DayCost: 0, warrantyStatus: 'Mileage warranty active (298,000 / 500,000 mi); Date warranty active until 8/10/2025',
      marketValue: 89000, eventCount: 3,
    },
  },
  'T-103': {
    recommendation: `**RECOMMENDATION: SELL IMMEDIATELY — Do not invest further**

Unit T-103 is the clearest sell signal in your fleet. At 712,000 miles on a 2014 Peterbilt with a Cummins ISX15, you've crossed into the territory where you're spending more on repairs than the truck earns.

**What the numbers are telling you:**
- You've spent **$11,550 in the last 90 days** — a turbo, an overhead rebuild, roadside tow, and electrical failure. This is not a run of bad luck. This is a truck telling you it's done.
- The overhead rebuild in March is a serious red flag. That's typically the beginning of the end for an ISX15 at this mileage — expect EGR cooler, oil cooler, and potentially rod bearings within the next 80,000 miles.
- Estimated monthly maintenance cost: **$3,850/month** based on trailing 6 months.

**The math:**
Even if this truck earns $8,000/month gross, you're eating nearly half of that in repairs. That ratio is unsustainable.

**Market reality:**
At 712k miles, buyers are thin. You might get **$12,000–$16,000** from a parts buyer or salvage. That number drops to near zero if the engine fails completely. Move it now.

**Action window: 7 days.** Do not put another dollar into this truck.`,
    dataUsed: {
      unitId: 'T-103', vehicle: '2014 Peterbilt 579', ageMonths: 112,
      currentMileage: 712000, totalMaintenanceCost: 18450, last90DayCost: 11550,
      prior90DayCost: 6900, warrantyStatus: 'No warranty data on file',
      marketValue: 14000, eventCount: 5,
    },
  },
  'T-104': {
    recommendation: `**RECOMMENDATION: HOLD — Your best asset, protect it**

Unit T-104 is your newest and healthiest truck. There is no financial or operational case for selling this unit at this time.

**What the numbers are telling you:**
- Total maintenance spend in the last 12 months: **$1,200** — two scheduled PMs. No unplanned downtime.
- You're still under factory extended warranty through 2027 and 500,000 miles. Any major component failure in that window is covered.
- Estimated monthly cost: **$100/month**. That is best-in-fleet by a wide margin.

**Why this matters:**
This truck represents your lowest-risk, highest-reliability asset. For a small fleet, having at least one unit like this in the rotation reduces your overall exposure to breakdowns and keeps your service commitments.

**Action window: 36+ months.** Revisit when warranty expires or mileage crosses 420,000. Until then, run it hard and maintain it on schedule.`,
    dataUsed: {
      unitId: 'T-104', vehicle: '2022 International LT Series', ageMonths: 37,
      currentMileage: 187000, totalMaintenanceCost: 1200, last90DayCost: 620,
      prior90DayCost: 0, warrantyStatus: 'Mileage warranty active (187,000 / 500,000 mi); Date warranty active until 2/28/2027',
      marketValue: 135000, eventCount: 2,
    },
  },
  'T-105': {
    recommendation: `**RECOMMENDATION: MONITOR — Hold for now, watch closely**

Unit T-105 is in a middle zone — not distressed, but showing early signs of cost escalation that warrant attention over the next 60–90 days.

**What the numbers are telling you:**
- You spent **$2,570 in the last 90 days** vs. **$2,080 in the prior 90 days** — a modest 24% increase. Not alarming yet, but worth tracking.
- The brake job in March was expected at this mileage and is a one-time cost. The cooling system work in November is more telling — water pumps often signal the beginning of engine accessory wear.
- Estimated monthly cost: **$855/month**.

**The decision point:**
At 401,000 miles, T-105 has another solid 80,000–100,000 miles of productive life if maintenance stays controlled. But if you see another unplanned repair above $2,000 in the next 90 days, the math starts shifting toward sell.

**Action window: 60–90 days.** Log every repair event, and re-run this analysis after the next maintenance event. If trailing 90-day costs exceed $4,500, that's your sell trigger.`,
    dataUsed: {
      unitId: 'T-105', vehicle: '2018 Freightliner Cascadia', ageMonths: 74,
      currentMileage: 401000, totalMaintenanceCost: 4650, last90DayCost: 2570,
      prior90DayCost: 2080, warrantyStatus: 'No warranty data on file',
      marketValue: 42000, eventCount: 4,
    },
  },
}
