import React from "react";
import { Bell, Check, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  timestamp: string;
  read: boolean;
  link?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Nuevo estudiante registrado",
    message: "Juan Pérez se ha registrado en el sistema",
    type: "info",
    timestamp: "2024-06-07T10:30:00",
    read: false,
    link: "/estudiantes/123",
  },
  {
    id: "2",
    title: "Pago pendiente",
    message: "El pago de María García está pendiente de confirmación",
    type: "warning",
    timestamp: "2024-06-07T09:15:00",
    read: false,
    link: "/pagos/456",
  },
  {
    id: "3",
    title: "Entrega completada",
    message: "La entrega del paquete #789 ha sido completada",
    type: "success",
    timestamp: "2024-06-06T16:45:00",
    read: true,
    link: "/entregas/789",
  },
  {
    id: "4",
    title: "Error en el sistema",
    message: "Se ha detectado un error en el procesamiento de pagos",
    type: "error",
    timestamp: "2024-06-06T14:20:00",
    read: false,
  },
];

const typeConfig = {
  info: {
    color: "bg-blue-100 text-blue-800",
  },
  warning: {
    color: "bg-yellow-100 text-yellow-800",
  },
  success: {
    color: "bg-green-100 text-green-800",
  },
  error: {
    color: "bg-red-100 text-red-800",
  },
};

const NotificationsPanel = () => {
  const [notifications, setNotifications] = React.useState(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id),
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true })),
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <DropdownMenu data-oid="cd_qubi">
      <DropdownMenuTrigger asChild data-oid="0dg3st4">
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          data-oid="xxr5css"
        >
          <Bell className="h-5 w-5" data-oid="842jaef" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px]"
              data-oid="g2n_9lb"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80" data-oid="dtis3wj">
        <div
          className="flex items-center justify-between p-2"
          data-oid="nh7.9by"
        >
          <h4 className="font-medium" data-oid="-jn-lpa">
            Notificaciones
          </h4>
          <div className="flex gap-2" data-oid="yaq3wv3">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={markAllAsRead}
              data-oid="zke05dz"
            >
              <Check className="h-4 w-4" data-oid="uhjo-mw" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={clearAll}
              data-oid="4lftr1a"
            >
              <Trash2 className="h-4 w-4" data-oid="ys9.3b-" />
            </Button>
          </div>
        </div>
        <ScrollArea className="h-[300px]" data-oid="k2d0-a9">
          {notifications.length === 0 ? (
            <div
              className="p-4 text-center text-sm text-muted-foreground"
              data-oid="0f6mvm."
            >
              No hay notificaciones
            </div>
          ) : (
            <div className="space-y-1 p-2" data-oid="b6ro2kl">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-2 rounded-lg p-2 ${
                    !notification.read ? "bg-muted/50" : ""
                  }`}
                  data-oid=".xz17fc"
                >
                  <div className="flex-1 space-y-1" data-oid="guf3tg0">
                    <div
                      className="flex items-center justify-between"
                      data-oid="oqdcm2_"
                    >
                      <p
                        className="text-sm font-medium leading-none"
                        data-oid="2oj12-."
                      >
                        {notification.title}
                      </p>
                      <Badge
                        className={typeConfig[notification.type].color}
                        data-oid="r6b_pek"
                      >
                        {notification.type}
                      </Badge>
                    </div>
                    <p
                      className="text-sm text-muted-foreground"
                      data-oid="pty_wed"
                    >
                      {notification.message}
                    </p>
                    <div
                      className="flex items-center justify-between"
                      data-oid=":lh-ibg"
                    >
                      <span
                        className="text-xs text-muted-foreground"
                        data-oid="t:8yh4."
                      >
                        {new Date(notification.timestamp).toLocaleString()}
                      </span>
                      <div className="flex gap-2" data-oid="v772u8_">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2"
                            onClick={() => markAsRead(notification.id)}
                            data-oid="c-kb3by"
                          >
                            <Check className="h-3 w-3" data-oid="x.zoeq8" />
                          </Button>
                        )}
                        {notification.link && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2"
                            asChild
                            data-oid="bksia_:"
                          >
                            <a href={notification.link} data-oid="lb9et58">
                              <ExternalLink
                                className="h-3 w-3"
                                data-oid="xyvinz4"
                              />
                            </a>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2"
                          onClick={() => deleteNotification(notification.id)}
                          data-oid="3zii29f"
                        >
                          <Trash2 className="h-3 w-3" data-oid="7yr4y:q" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsPanel;
