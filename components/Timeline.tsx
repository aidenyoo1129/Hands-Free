"use client";

import { TimelineEvent } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Calendar, BookOpen, FileText, Target } from "lucide-react";

interface TimelineProps {
  events: TimelineEvent[];
}

const eventIcons = {
  assignment: FileText,
  exam: Target,
  reading: BookOpen,
  milestone: Calendar,
};

const eventColors = {
  assignment: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  exam: "bg-red-500/20 text-red-500 border-red-500/30",
  reading: "bg-green-500/20 text-green-500 border-green-500/30",
  milestone: "bg-purple-500/20 text-purple-500 border-purple-500/30",
};

export function Timeline({ events }: TimelineProps) {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const groupByMonth = (events: TimelineEvent[]) => {
    const groups: Record<string, TimelineEvent[]> = {};
    events.forEach((event) => {
      const date = new Date(event.date);
      const monthKey = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(event);
    });
    return groups;
  };

  const groupedEvents = groupByMonth(sortedEvents);

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardContent className="p-0">
        <div className="space-y-8">
          {Object.entries(groupedEvents).map(([month, monthEvents]) => (
            <div key={month} className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-4">
                {month}
              </h3>
              <div className="space-y-3">
                {monthEvents.map((event, index) => {
                  const Icon = eventIcons[event.type];
                  const isLast = index === monthEvents.length - 1;

                  return (
                    <div key={event.id} className="relative pl-8 group">
                      {!isLast && (
                        <div className="absolute left-3 top-8 bottom-0 w-px bg-border/50" />
                      )}
                      <div className="relative flex items-start gap-4 hover:opacity-80 transition-opacity">
                        <div
                          className={cn(
                            "flex items-center justify-center h-6 w-6 rounded-full border-2 flex-shrink-0 mt-0.5",
                            eventColors[event.type]
                          )}
                        >
                          <Icon className="h-3 w-3" />
                        </div>
                        <div className="flex-1 min-w-0 pb-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium">{event.title}</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDate(event.date)}
                              </p>
                            </div>
                            <span
                              className={cn(
                                "text-xs font-medium px-2 py-1 rounded capitalize flex-shrink-0",
                                eventColors[event.type]
                              )}
                            >
                              {event.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

