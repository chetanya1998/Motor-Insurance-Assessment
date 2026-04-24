"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { EventLog, TrackingService } from '../services/TrackingService';

interface TrackingContextType {
  events: EventLog[];
  trackEvent: (eventName: string, data?: any) => void;
  getStartTime: () => number;
  getTotalTimeMs: () => number;
}

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

export function TrackingProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<EventLog[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    // Initial app load track
    trackEvent('app_loaded');
  }, []);

  const trackEvent = (eventName: string, data?: any) => {
    const newEvent = TrackingService.logEvent(eventName, data);
    setEvents((prev) => {
      const updated = [...prev, newEvent];
      // Save to local storage for admin dashboard
      try {
        const storedEvents = JSON.parse(localStorage.getItem('tracking_events') || '[]');
        storedEvents.push(newEvent);
        localStorage.setItem('tracking_events', JSON.stringify(storedEvents));
      } catch (e) {}
      return updated;
    });
  };

  const getStartTime = () => startTime;
  
  const getTotalTimeMs = () => {
    if (events.length === 0) return 0;
    const lastEvent = events[events.length - 1];
    return lastEvent.timestamp - startTime;
  };

  return (
    <TrackingContext.Provider value={{ events, trackEvent, getStartTime, getTotalTimeMs }}>
      {children}
    </TrackingContext.Provider>
  );
}

export function useTracking() {
  const context = useContext(TrackingContext);
  if (context === undefined) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
}
