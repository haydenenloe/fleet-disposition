export interface Truck {
  id: string
  unit_id: string
  vin: string | null
  make: string
  model: string
  year: number
  engine_type: string | null
  purchase_date: string | null
  purchase_price: number | null
  odometer_at_purchase: number | null
  current_odometer: number | null
  warranty_expiry_mileage: number | null
  warranty_expiry_date: string | null
  eld_platform: string | null
  notes: string | null
  created_at: string
}

export interface MaintenanceEvent {
  id: string
  unit_id: string
  event_date: string
  shop_name: string | null
  invoice_total: number
  repair_category: string
  mileage_at_repair: number | null
  notes: string | null
  created_at: string
}

export type TruckInsert = Omit<Truck, 'id' | 'created_at'>
export type MaintenanceEventInsert = Omit<MaintenanceEvent, 'id' | 'created_at'>
