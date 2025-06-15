
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarView } from './CalendarView';
import { EventForm } from './EventForm';
import { EventList } from './EventList';
import { Plus } from 'lucide-react';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  time: string;
  color: string;
}

export const Calendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Team Meeting',
      description: 'Weekly team sync',
      date: new Date(),
      time: '10:00',
      color: 'bg-blue-500'
    },
    {
      id: '2',
      title: 'Client Call',
      description: 'Project review with client',
      date: new Date(Date.now() + 86400000), // Tomorrow
      time: '14:30',
      color: 'bg-green-500'
    }
  ]);
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const handleAddEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: Date.now().toString()
    };
    setEvents([...events, newEvent]);
    setShowEventForm(false);
  };

  const handleEditEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    if (editingEvent) {
      setEvents(events.map(event => 
        event.id === editingEvent.id 
          ? { ...eventData, id: editingEvent.id }
          : event
      ));
      setEditingEvent(null);
      setShowEventForm(false);
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const startEditingEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const cancelEventForm = () => {
    setShowEventForm(false);
    setEditingEvent(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground">Manage your schedule and appointments</p>
        </div>
        <Button onClick={() => setShowEventForm(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Event</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CalendarView
            events={events}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            onEventClick={startEditingEvent}
          />
        </div>
        
        <div className="space-y-6">
          {showEventForm && (
            <EventForm
              event={editingEvent}
              selectedDate={selectedDate}
              onSubmit={editingEvent ? handleEditEvent : handleAddEvent}
              onCancel={cancelEventForm}
            />
          )}
          
          <EventList
            events={events}
            selectedDate={selectedDate}
            onEditEvent={startEditingEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        </div>
      </div>
    </div>
  );
};
