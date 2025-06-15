
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JournalEntry } from '@/stores/businessStore';

interface JournalEntriesProps {
  entries: JournalEntry[];
}

export const JournalEntries = ({ entries }: JournalEntriesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Journal Entries</CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No journal entries recorded yet</p>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div key={entry.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{entry.description}</h4>
                  <span className="text-sm text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Debit: </span>
                    <span className="font-medium">{entry.debitAccount}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Credit: </span>
                    <span className="font-medium">{entry.creditAccount}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-lg font-bold">${entry.amount.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
