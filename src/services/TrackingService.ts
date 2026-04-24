export interface EventLog {
  eventName: string;
  timestamp: number;
  data?: any;
}

export const TrackingService = {
  logEvent: (eventName: string, data?: any): EventLog => {
    return {
      eventName,
      timestamp: Date.now(),
      data
    };
  }
};
