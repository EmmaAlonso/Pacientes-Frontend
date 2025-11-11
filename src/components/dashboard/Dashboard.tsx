import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Wrench, Ticket, Package } from "lucide-react";

const kpiCards = [
  {
    title: "Estudiantes Activos",
    value: "1,234",
    icon: Users,
    description: "Total de estudiantes con paquetes activos",
    trend: "+12%",
    trendUp: true,
  },
  {
    title: "Ingresos Mensuales",
    value: "$45,678",
    icon: DollarSign,
    description: "Ingresos totales del mes actual",
    trend: "+8%",
    trendUp: true,
  },
  {
    title: "En Reparación",
    value: "45",
    icon: Wrench,
    description: "Productos en proceso de reparación",
    trend: "-5%",
    trendUp: false,
  },
  {
    title: "Tickets Activos",
    value: "23",
    icon: Ticket,
    description: "Tickets de soporte pendientes",
    trend: "+3%",
    trendUp: false,
  },
  {
    title: "Paquetes Personalizados",
    value: "89",
    icon: Package,
    description: "Paquetes personalizados por universidad",
    trend: "+15%",
    trendUp: true,
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {kpiCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
              <div
                className={`mt-2 text-xs ${
                  card.trendUp ? "text-green-500" : "text-red-500"
                }`}
              >
                {card.trend} desde el mes pasado
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Aquí irían los gráficos y tablas adicionales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Ingresos por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Aquí iría el componente de gráfico */}
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Gráfico de ingresos mensuales
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Distribución de Paquetes</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Aquí iría el componente de gráfico circular */}
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Gráfico de distribución de paquetes
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
