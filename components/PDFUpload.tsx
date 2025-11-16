"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PDFUploadProps {
  onTextExtracted: (text: string) => void;
  onError: (error: string) => void;
}

export function PDFUpload({ onTextExtracted, onError }: PDFUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (file.type !== "application/pdf") {
        onError("Please upload a PDF file");
        return;
      }

      setIsUploading(true);
      setUploadedFileName(file.name);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/parse-pdf", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to parse PDF");
        }

        const data = await response.json();
        onTextExtracted(data.text);
      } catch (error) {
        onError(
          error instanceof Error ? error.message : "Failed to upload PDF"
        );
        setUploadedFileName(null);
      } finally {
        setIsUploading(false);
      }
    },
    [onTextExtracted, onError]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleClear = useCallback(() => {
    setUploadedFileName(null);
  }, []);

  return (
    <Card className="glass border-2 border-dashed transition-all hover:border-primary/50">
      <CardContent className="p-8">
        {!uploadedFileName ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "flex flex-col items-center justify-center space-y-4 transition-colors",
              isDragging && "opacity-70",
              isUploading && "opacity-50"
            )}
          >
            <div
              className={cn(
                "rounded-full p-4 transition-colors",
                isDragging
                  ? "bg-primary/20"
                  : "bg-muted"
              )}
            >
              <Upload
                className={cn(
                  "h-8 w-8 transition-colors",
                  isDragging ? "text-primary" : "text-muted-foreground"
                )}
              />
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">
                {isUploading
                  ? "Processing PDF..."
                  : isDragging
                  ? "Drop your syllabus here"
                  : "Upload your syllabus"}
              </p>
              <p className="text-xs text-muted-foreground">
                Drag and drop or click to browse
              </p>
            </div>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileInput}
              className="hidden"
              id="pdf-upload"
              disabled={isUploading}
            />
            <label htmlFor="pdf-upload">
              <Button
                variant="outline"
                disabled={isUploading}
                className="cursor-pointer"
                asChild
              >
                <span>Select PDF</span>
              </Button>
            </label>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">{uploadedFileName}</p>
                <p className="text-xs text-muted-foreground">
                  PDF processed successfully
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

