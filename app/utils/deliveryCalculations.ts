import { Supplier } from '../types';

export interface DeliveryWindow {
  start: Date;
  end: Date;
  dayOfWeek: string;
}

export interface SupplierDelivery {
  supplierId: string;
  supplierName: string;
  deliveryDate: Date;
  deliveryWindow: DeliveryWindow;
}

// Convert day names to numbers (0 = Sunday, 1 = Monday, etc.)
const dayToNumber = (day: string): number => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days.indexOf(day.toLowerCase());
};

// Get the next occurrence of a specific day
const getNextDayOccurrence = (dayName: string, fromDate: Date = new Date()): Date => {
  const targetDay = dayToNumber(dayName);
  const today = new Date(fromDate);
  today.setHours(0, 0, 0, 0);
  
  const daysUntilTarget = (targetDay + 7 - today.getDay()) % 7;
  const nextOccurrence = new Date(today);
  
  if (daysUntilTarget === 0) {
    // It's the same day - delivery is today
    return nextOccurrence;
  } else {
    nextOccurrence.setDate(today.getDate() + daysUntilTarget);
  }
  
  return nextOccurrence;
};

// Parse cutoff time string to Date object
const parseCutoffTime = (cutoffTimeStr: string, date: Date): Date => {
  const [time, period] = cutoffTimeStr.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  
  let hour24 = hours;
  if (period?.toUpperCase() === 'PM' && hours !== 12) {
    hour24 += 12;
  } else if (period?.toUpperCase() === 'AM' && hours === 12) {
    hour24 = 0;
  }
  
  const cutoffDate = new Date(date);
  cutoffDate.setHours(hour24, minutes || 0, 0, 0);
  return cutoffDate;
};

// Calculate next delivery date for a supplier
export const calculateNextDeliveryDate = (supplier: Supplier): Date => {
  const today = new Date();
  const deliveryDays = supplier.deliveryDays.map(day => day.toLowerCase());
  
  // For daily delivery
  if (deliveryDays.includes('daily') || deliveryDays.length >= 6) {
    const cutoffTime = parseCutoffTime(supplier.cutoffTime, today);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    return today > cutoffTime ? tomorrow : today;
  }
  
  // Find the next available delivery day
  let earliestDelivery: Date | null = null;
  
  for (const day of deliveryDays) {
    const nextDelivery = getNextDayOccurrence(day, today);
    const cutoffTime = parseCutoffTime(supplier.cutoffTime, nextDelivery);
    
    // If it's today and we've passed cutoff, get next week's occurrence
    if (nextDelivery.toDateString() === today.toDateString() && today > cutoffTime) {
      const nextWeek = new Date(nextDelivery);
      nextWeek.setDate(nextDelivery.getDate() + 7);
      nextDelivery.setTime(nextWeek.getTime());
    }
    
    if (!earliestDelivery || nextDelivery < earliestDelivery) {
      earliestDelivery = nextDelivery;
    }
  }
  
  return earliestDelivery || new Date();
};

// Calculate delivery windows for all suppliers
export const calculateSupplierDeliveries = (suppliers: Supplier[]): SupplierDelivery[] => {
  return suppliers.map(supplier => {
    const deliveryDate = calculateNextDeliveryDate(supplier);
    
    return {
      supplierId: supplier.id,
      supplierName: supplier.name,
      deliveryDate,
      deliveryWindow: {
        start: deliveryDate,
        end: deliveryDate,
        dayOfWeek: deliveryDate.toLocaleDateString('en-US', { weekday: 'long' })
      }
    };
  });
};

// Find consolidated delivery window (union of all delivery dates)
export const calculateConsolidatedDeliveryWindow = (supplierDeliveries: SupplierDelivery[]): DeliveryWindow => {
  if (supplierDeliveries.length === 0) {
    const today = new Date();
    return {
      start: today,
      end: today,
      dayOfWeek: today.toLocaleDateString('en-US', { weekday: 'long' })
    };
  }

  // Sort by delivery date
  const sortedDeliveries = [...supplierDeliveries].sort((a, b) => 
    a.deliveryDate.getTime() - b.deliveryDate.getTime()
  );

  const earliestDelivery = sortedDeliveries[0].deliveryDate;
  const latestDelivery = sortedDeliveries[sortedDeliveries.length - 1].deliveryDate;

  return {
    start: earliestDelivery,
    end: latestDelivery,
    dayOfWeek: earliestDelivery.toLocaleDateString('en-US', { weekday: 'long' })
  };
};

// Find a common delivery day where most suppliers can deliver
export const findOptimalDeliveryDay = (suppliers: Supplier[]): Date | null => {
  const today = new Date();
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });

  // Count how many suppliers can deliver on each day
  const deliveryCountByDay = next7Days.map(date => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const suppliersAvailable = suppliers.filter(supplier => {
      const deliveryDays = supplier.deliveryDays.map(d => d.toLowerCase());
      
      // Check if supplier delivers on this day
      if (deliveryDays.includes('daily') || deliveryDays.includes(dayName)) {
        // Check if we haven't passed the cutoff time
        const cutoffTime = parseCutoffTime(supplier.cutoffTime, date);
        return date.toDateString() !== today.toDateString() || today <= cutoffTime;
      }
      
      return false;
    });

    return {
      date,
      count: suppliersAvailable.length,
      suppliers: suppliersAvailable
    };
  });

  // Find the day with the most suppliers available
  const bestDay = deliveryCountByDay.reduce((best, current) => 
    current.count > best.count ? current : best
  );

  return bestDay.count > 0 ? bestDay.date : null;
};

// Format delivery window for display
export const formatDeliveryWindow = (window: DeliveryWindow): string => {
  if (window.start.toDateString() === window.end.toDateString()) {
    return window.start.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
  return `${window.start.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  })} - ${window.end.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  })}`;
};
