// src/components/dashboard/DashboardCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function DashboardCard({
  title,
  headerActions,
  children,
  footer,
  dialogContent,
}: {
  title: React.ReactNode;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  dialogContent?: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          {headerActions}
        </div>
      </CardHeader>
      <CardContent>
        {children}
        {footer && <div className="mt-4">{footer}</div>}
        {dialogContent}
      </CardContent>
    </Card>
  );
}
