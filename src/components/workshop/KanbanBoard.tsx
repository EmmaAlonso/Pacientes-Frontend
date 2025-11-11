import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  assignee?: {
    name: string;
    avatar?: string;
  };
  dueDate?: string;
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Reparación de toga",
    description: "Ajuste de mangas y limpieza general",
    status: "pending",
    priority: "high",
    assignee: {
      name: "Juan Pérez",
      avatar: "/avatars/01.png",
    },
    dueDate: "2024-06-10",
  },
  {
    id: "2",
    title: "Personalización de birrete",
    description: "Aplicación de logo institucional",
    status: "in_progress",
    priority: "medium",
    assignee: {
      name: "María García",
      avatar: "/avatars/02.png",
    },
    dueDate: "2024-06-12",
  },
  {
    id: "3",
    title: "Revisión de estola",
    description: "Verificación de bordados y acabados",
    status: "completed",
    priority: "low",
    assignee: {
      name: "Carlos López",
      avatar: "/avatars/03.png",
    },
    dueDate: "2024-06-08",
  },
];

const statusConfig = {
  pending: {
    title: "Pendiente",
    color: "bg-yellow-100 text-yellow-800",
  },
  in_progress: {
    title: "En Proceso",
    color: "bg-blue-100 text-blue-800",
  },
  completed: {
    title: "Completado",
    color: "bg-green-100 text-green-800",
  },
};

const priorityConfig = {
  low: {
    label: "Baja",
    color: "bg-gray-100 text-gray-800",
  },
  medium: {
    label: "Media",
    color: "bg-orange-100 text-orange-800",
  },
  high: {
    label: "Alta",
    color: "bg-red-100 text-red-800",
  },
};

interface KanbanBoardProps {
  searchTerm: string;
  sortField: "title" | "priority" | "dueDate" | "assignee";
  sortOrder: "asc" | "desc";
  selectedPriorities: ("low" | "medium" | "high")[];
  selectedStatuses: ("pending" | "in_progress" | "completed")[];
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  searchTerm,
  sortField,
  sortOrder,
  selectedPriorities,
  selectedStatuses,
}) => {
  const columns = ["pending", "in_progress", "completed"];

  const filteredAndSortedTasks = mockTasks
    .filter((task) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower) ||
        task.assignee?.name.toLowerCase().includes(searchLower) ||
        priorityConfig[task.priority].label.toLowerCase().includes(searchLower);

      const matchesPriority =
        selectedPriorities.length === 0 ||
        selectedPriorities.includes(task.priority);
      const matchesStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(task.status);

      return matchesSearch && matchesPriority && matchesStatus;
    })
    .sort((a, b) => {
      let aValue: string | number = "";
      let bValue: string | number = "";

      switch (sortField) {
        case "dueDate":
          aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          break;
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case "assignee":
          aValue = a.assignee?.name || "";
          bValue = b.assignee?.name || "";
          break;
        default:
          aValue = a[sortField] as string;
          bValue = b[sortField] as string;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((status) => (
        <div key={status} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              {statusConfig[status as keyof typeof statusConfig].title}
            </h3>
            <Badge variant="secondary">
              {
                filteredAndSortedTasks.filter((task) => task.status === status)
                  .length
              }
            </Badge>
          </div>

          <div className="space-y-4">
            {filteredAndSortedTasks
              .filter((task) => task.status === status)
              .map((task) => (
                <Card
                  key={task.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                >
                  <CardHeader className="p-4">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-sm font-medium">
                        {task.title}
                      </CardTitle>
                      <Badge className={priorityConfig[task.priority].color}>
                        {priorityConfig[task.priority].label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground mb-4">
                      {task.description}
                    </p>
                    <div className="flex items-center justify-between">
                      {task.assignee && (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={task.assignee.avatar}
                              alt={task.assignee.name}
                            />
                            <AvatarFallback>
                              {task.assignee.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">
                            {task.assignee.name}
                          </span>
                        </div>
                      )}
                      {task.dueDate && (
                        <span className="text-xs text-muted-foreground">
                          Entrega: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
