
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Clock } from 'lucide-react';
import { CalendarEvent } from './Calendar';

interface EventListProps {
  events: CalendarEvent[];
  selectedDate: Date;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
}

export const EventList = ({ events, selectedDate, onEditEvent, onDeleteEvent }: EventListProps) => {
  const selectedDateEvents = events.filter(event => 
    event.date.getDate() === selectedDate.getDate() &&
    event.date.getMonth() === selectedDate.getMonth() &&
    event.date.getFullYear() === selectedDate.getFullYear()
  );

  const upcomingEvents = events
    .filter(event => event.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Events for {formatDate(selectedDate)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateEvents.length === 0 ? (
            <p className="text-muted-foreground text-sm">No events scheduled for this date</p>
          ) : (
            <div className="space-y-3">
              {selectedDateEvents.map(event => (
                <div key={event.id} className="flex items-start justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className={`w-3 h-3 rounded-full ${event.color}`}></div>
                      <h4 className="font-medium">{event.title}</h4>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
                      <Clock className="h-3 w-3" />
                      <span>{event.time}</span>
                    </div>
                    {event.description && (
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditEvent(event)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteEvent(event.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length === 0 ? (
            <p className="text-muted-foreground text-sm">No upcoming events</p>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map(event => (
                <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${event.color}`}></div>
                    <div>
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{formatDate(event.date)}</span>
                        <span>•</span>
                        <span>{event.time}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditEvent(event)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
