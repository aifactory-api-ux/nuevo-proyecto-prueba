export interface Dispatch {
  id: number;
  plant: string;
  distribution_center: string;
  product: string;
  quantity: number;
  dispatched_at: string;
}

export interface DispatchCreate {
  plant: string;
  distribution_center: string;
  product: string;
  quantity: number;
  dispatched_at: string;
}

export interface DispatchList {
  dispatches: Dispatch[];
}

export interface DispatchStats {
  plant: string;
  total_quantity: number;
  dispatch_count: number;
}

export interface DispatchStatsList {
  stats: DispatchStats[];
}