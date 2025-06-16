
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
      <CardContent className="p-3 sm:p-6">
        <div className="flex flex-col items-center text-center space-y-2 sm:space-y-4">
          <div className={`${app.color} p-2 sm:p-4 rounded-xl sm:rounded-2xl`}>
            <app.icon className="h-5 w-5 sm:h-8 sm:w-8 text-white" />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <h3 className="font-semibold text-sm sm:text-lg text-foreground">{app.name}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed hidden sm:block">{app.description}</p>
            <Badge variant="outline" className="text-xs">
              {app.category}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
