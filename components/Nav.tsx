"use client";

import { LayoutDashboard, List, Calendar, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type View = "tasks" | "timeline" | "study-guides";

interface NavProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const views: { id: View; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "tasks", label: "Tasks", icon: List },
  { id: "timeline", label: "Timeline", icon: Calendar },
  { id: "study-guides", label: "Study Guides", icon: BookOpen },
];

export function Nav({ currentView, onViewChange }: NavProps) {
  return (
    <nav className="flex items-center gap-1 p-1 glass rounded-lg">
      {views.map((view) => {
        const Icon = view.icon;
        return (
          <Button
            key={view.id}
            variant={currentView === view.id ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onViewChange(view.id)}
            className={cn(
              "flex items-center gap-2 transition-all",
              currentView === view.id && "bg-background shadow-sm",
              "hover:bg-accent/50"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm">{view.label}</span>
          </Button>
        );
      })}
    </nav>
  );
}

