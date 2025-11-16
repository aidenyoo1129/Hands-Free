"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronRight, Calendar, AlertCircle } from "lucide-react";
import { Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface TaskListProps {
  tasks: Task[];
  onTaskUpdate?: (taskId: string, subtaskId: string, completed: boolean) => void;
}

const priorityColors = {
  high: "text-red-500",
  medium: "text-yellow-500",
  low: "text-blue-500",
};

const priorityLabels = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

const categoryLabels = {
  assignment: "Assignment",
  exam: "Exam",
  reading: "Reading",
};

export function TaskList({ tasks, onTaskUpdate }: TaskListProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    assignments: true,
    exams: true,
    readings: true,
  });

  const groupedTasks = {
    assignments: tasks.filter((t) => t.category === "assignment"),
    exams: tasks.filter((t) => t.category === "exam"),
    readings: tasks.filter((t) => t.category === "reading"),
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysUntilDue = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateString);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderTask = (task: Task) => {
    const daysUntilDue = getDaysUntilDue(task.dueDate);
    const isOverdue = daysUntilDue < 0;
    const isDueSoon = daysUntilDue >= 0 && daysUntilDue <= 7;

    return (
      <div
        key={task.id}
        className="group border-b border-border/50 last:border-0 hover:bg-accent/30 transition-all duration-200"
      >
        <div className="flex items-start gap-3 p-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
                {task.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {task.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded",
                    priorityColors[task.priority]
                  )}
                >
                  {priorityLabels[task.priority]}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
              {(isOverdue || isDueSoon) && (
                <div
                  className={cn(
                    "flex items-center gap-1",
                    isOverdue ? "text-red-500" : "text-yellow-500"
                  )}
                >
                  <AlertCircle className="h-3 w-3" />
                  <span>
                    {isOverdue
                      ? `Overdue by ${Math.abs(daysUntilDue)} days`
                      : `Due in ${daysUntilDue} days`}
                  </span>
                </div>
              )}
            </div>

            {task.subtasks && task.subtasks.length > 0 && (
              <div className="mt-3 space-y-1.5 pl-1">
                {task.subtasks.map((subtask) => (
                  <label
                    key={subtask.id}
                    className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors group/subtask"
                  >
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={(e) => {
                          if (onTaskUpdate) {
                            onTaskUpdate(task.id, subtask.id, e.target.checked);
                          }
                        }}
                        className="sr-only"
                      />
                      <div
                        className={cn(
                          "h-4 w-4 rounded border-2 flex items-center justify-center transition-all",
                          subtask.completed
                            ? "bg-primary border-primary"
                            : "border-border group-hover/subtask:border-primary/50"
                        )}
                      >
                        {subtask.completed && (
                          <Check className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                    </div>
                    <span
                      className={cn(
                        "text-xs",
                        subtask.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {subtask.title}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardContent className="p-0">
        <div className="space-y-1">
          {Object.entries(groupedTasks).map(([category, categoryTasks]) => {
            if (categoryTasks.length === 0) return null;

            return (
              <Accordion
                key={category}
                type="single"
                collapsible
                defaultValue={expandedSections[category] ? category : undefined}
                onValueChange={(value) =>
                  setExpandedSections((prev) => ({
                    ...prev,
                    [category]: value === category,
                  }))
                }
              >
                <AccordionItem value={category} className="border-0">
                  <AccordionTrigger className="py-3 px-4 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold capitalize">
                        {categoryLabels[category as keyof typeof categoryLabels]}s
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({categoryTasks.length})
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0">
                    <div className="glass rounded-lg border border-border/50 overflow-hidden">
                      {categoryTasks.map(renderTask)}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

