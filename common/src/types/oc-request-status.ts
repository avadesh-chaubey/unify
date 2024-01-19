export enum OCRequestStatus {
  PreSubmit = 'pre:submit',
  Requested = 'requested',
  Approved = 'approved',
  Rejected = 'rejected',
  Pending = 'pending',
  AcceptedForDelivery = 'accepted:for:delivery',
  Dispatched = 'dispatched',
  Received = 'received',
  Returned = 'returned',
  Cancelled = 'cancelled',
  Delivered = 'delivered',
  InTransit = 'in:transit',
  PickupRequested = 'pickup:requested',
  PickupAccepted = 'pickup:accepted',
  PickupDone = 'pickup:done'
}
