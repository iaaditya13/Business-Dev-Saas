
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AppConfig } from './appsConfig';

interface AppCardProps {
  app: AppConfig;
  onClick: (appId: string, route: string) => void;
}

export const AppCard = ({ app, onClick }: AppCardProps) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
      onClick={() => onClick(app.id, app.route)}
    >
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className={`${app.color} p-4 rounded-2xl`}>
            <app.icon className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-foreground">{app.name}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{app.description}</p>
            <Badge variant="outline" className="text-xs">
              {app.category}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
