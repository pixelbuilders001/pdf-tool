'use client';

import { useDropzone } from 'react-dropzone';
import { Upload, X, File as FileIcon, MoveUp, MoveDown } from 'lucide-react';
import { useFileStore } from '@/store/useFileStore';
import { motion, Reorder } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface FileUploaderProps {
    accept?: Record<string, string[]>;
    maxFiles?: number;
    className?: string;
}

export default function FileUploader({
    accept = { 'application/pdf': ['.pdf'] },
    maxFiles = 10,
    className
}: FileUploaderProps) {
    const { files, addFiles, removeFile, setFiles } = useFileStore();

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => addFiles(acceptedFiles),
        accept,
        maxFiles: maxFiles - files.length,
        disabled: files.length >= maxFiles,
    });

    return (
        <div className={cn("w-full max-w-4xl mx-auto space-y-6", className)}>
            {files.length < maxFiles && (
                <div
                    {...getRootProps()}
                    className={cn(
                        "relative border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all bg-secondary/20",
                        isDragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/50",
                        files.length >= maxFiles && "opacity-50 cursor-not-allowed"
                    )}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <Upload className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <p className="text-xl font-bold">
                                {isDragActive ? "Drop files here" : "Click or drag files here"}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Up to {maxFiles} files, max 50MB each
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {files.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="font-bold">Queue ({files.length}/{maxFiles})</h3>
                        <span className="text-xs text-muted-foreground italic">Drag to reorder</span>
                    </div>

                    <Reorder.Group axis="y" values={files} onReorder={setFiles} className="space-y-2">
                        {files.map((fileItem) => (
                            <Reorder.Item
                                key={fileItem.id}
                                value={fileItem}
                                className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border group cursor-grab active:cursor-grabbing"
                            >
                                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                                    <FileIcon className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div className="flex-grow min-w-0">
                                    <p className="text-sm font-semibold truncate">{fileItem.file.name}</p>
                                    <p className="text-xs text-muted-foreground leading-none">
                                        {(fileItem.file.size / (1024 * 1024)).toFixed(2)} MB
                                    </p>
                                </div>
                                <button
                                    onClick={() => removeFile(fileItem.id)}
                                    className="p-2 rounded-full hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>
                </div>
            )}
        </div>
    );
}
