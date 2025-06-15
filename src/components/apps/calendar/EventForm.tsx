
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarEvent } from './Calendar';

interface EventFormProps {
  event?: CalendarEvent | null;
  selectedDate: Date;
  onSubmit: (event: Omit<CalendarEvent, 'id'>) => void;
  onCancel: () => void;
}

const eventColors = [
  { label: 'Blue', value: 'bg-blue-500' },
  { label: 'Green', value: 'bg-green-500' },
  { label: 'Red', value: 'bg-red-500' },
  { label: 'Purple', value: 'bg-purple-500' },
  { label: 'Orange', value: 'bg-orange-500' },
  { label: 'Pink', value: 'bg-pink-500' },
];

export const EventForm = ({ event, selectedDate, onSubmit, onCancel }: EventFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [color, setColor] = useState('bg-blue-500');

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
      setDate(event.date.toISOString().split('T')[0]);
      setTime(event.time);
      setColor(event.color);
    } else {
      setTitle('');
      setDescription('');
      setDate(selectedDate.toISOString().split('T')[0]);
      setTime('09:00');
      setColor('bg-blue-500');
    }
  }, [event, selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time) return;

    onSubmit({
      title,
      description,
      date: new Date(date),
      time,
      color,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{event ? 'Edit Event' : 'Add New Event'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {eventColors.map((colorOption) => (
                  <SelectItem key={colorOption.value} value={colorOption.value}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded ${colorOption.value}`}></div>
                      <span>{colorOption.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2">
            <Button type="submit" className="flex-1">
              {event ? 'Update Event' : 'Add Event'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
