"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2, RefreshCw, Info, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function UnusedFilesPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [totalFileCount, setTotalFileCount] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const fetchUnusedFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/files/unused");
      
      if (!response.ok) {
        throw new Error("Failed to fetch unused files");
      }
      
      const data = await response.json();
      setFiles(data.files || []);
      
      // Get total file count for statistics
      try {
        const statsResponse = await fetch("/api/files/stats");
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setTotalFileCount(statsData.totalCount || 0);
        }
      } catch (err) {
        console.error("Error fetching file stats:", err);
        // Don't show toast for this secondary error
      }
    } catch (error) {
      console.error("Error fetching unused files:", error);
      toast.error("Failed to load unused files");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUnusedFiles();
  }, []);
  
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedFiles(files.map(file => file._id));
    } else {
      setSelectedFiles([]);
    }
  };
  
  const handleSelectFile = (fileId, checked) => {
    if (checked) {
      setSelectedFiles(prev => [...prev, fileId]);
    } else {
      setSelectedFiles(prev => prev.filter(id => id !== fileId));
    }
  };
  
  const handleDeleteSelected = async () => {
    if (selectedFiles.length === 0) {
      toast.error("No files selected for deletion");
      return;
    }
    
    setShowDeleteDialog(true);
  };
  
  const confirmDelete = async () => {
    try {
      setDeleting(true);
      
      const response = await fetch("/api/files/unused", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileIds: selectedFiles }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete files");
      }
      
      const data = await response.json();
      
      toast.success(`Successfully deleted ${data.deletedCount} files`);
      setSelectedFiles([]);
      
      // Refresh the file list
      fetchUnusedFiles();
    } catch (error) {
      console.error("Error deleting files:", error);
      toast.error("Failed to delete files");
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };
  
  const formatFileSize = (size) => {
    if (size < 1024) {
      return size + " B";
    } else if (size < 1024 * 1024) {
      return (size / 1024).toFixed(2) + " KB";
    } else {
      return (size / (1024 * 1024)).toFixed(2) + " MB";
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    try {
      return format(new Date(dateString), "MMM d, yyyy, h:mm a");
    } catch (e) {
      return "Invalid date";
    }
  };
  
  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Unused Files</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {!loading && `Found ${files.length} unused files${totalFileCount ? ` out of ${totalFileCount} total files` : ''}`}
          </p>
        </div>
        <Button 
          variant="destructive" 
          onClick={handleDeleteSelected}
          disabled={selectedFiles.length === 0 || deleting}
          className="w-full sm:w-auto"
        >
          {deleting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected ({selectedFiles.length})
            </>
          )}
        </Button>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to delete {selectedFiles.length} files. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              disabled={deleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Files"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
        <div>
          <AlertTitle>Important Information</AlertTitle>
          <AlertDescription>
            The system searches for file references in all content models and registrations. If a file appears here, it means no references were found in any database document.
          </AlertDescription>
        </div>
      </Alert>
      
      {/* Files List Card */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Unused Files Management</CardTitle>
            <CardDescription className="mt-1">
              These files are not referenced anywhere in the website content. You can safely delete them to free up database space.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchUnusedFiles}
            disabled={loading}
            title="Refresh list"
            className="self-end sm:self-auto"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : files.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No unused files found. All files are being referenced in the website content.
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">
                        <Checkbox 
                          checked={selectedFiles.length === files.length && files.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>File Name</TableHead>
                      <TableHead className="hidden md:table-cell">Type</TableHead>
                      <TableHead className="hidden md:table-cell">Section</TableHead>
                      <TableHead className="hidden md:table-cell">Uploaded</TableHead>
                      <TableHead className="w-[60px]">View</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {files.map((file) => (
                      <TableRow key={file._id}>
                        <TableCell className="p-2 sm:p-4">
                          <Checkbox 
                            checked={selectedFiles.includes(file._id)}
                            onCheckedChange={(checked) => handleSelectFile(file._id, checked)}
                          />
                        </TableCell>
                        <TableCell className="p-2 sm:p-4 font-medium">
                          <div className="flex flex-col">
                            <span className="truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px]">
                              {file.originalName}
                            </span>
                            <span className="text-xs text-muted-foreground truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px]">
                              {file.filename}
                            </span>
                            {/* Mobile-only info */}
                            <div className="md:hidden mt-2 space-y-1">
                              <Badge variant="outline" className="text-[10px] px-1 py-0 h-5 sm:text-xs">
                                {file.contentType.split('/')[1]?.toUpperCase() || file.contentType}
                              </Badge>
                              <span className="text-[10px] sm:text-xs text-muted-foreground block">
                                {file.section || "misc"} • {formatDate(file.createdAt)}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell p-2 sm:p-4">
                          <Badge variant="outline">
                            {file.contentType.split('/')[1]?.toUpperCase() || file.contentType}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell p-2 sm:p-4">{file.section || "misc"}</TableCell>
                        <TableCell className="hidden md:table-cell p-2 sm:p-4">
                          {formatDate(file.createdAt)}
                        </TableCell>
                        <TableCell className="p-2 sm:p-4">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            title="View file"
                            className="h-8 w-8 text-primary"
                            onClick={() => window.open(`/api/files/${file._id}`, '_blank')}
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </div>
        
        <CardFooter className="px-6 py-4">
          <div className="text-xs sm:text-sm text-muted-foreground">
            {!loading && (
              <Button 
                variant="link" 
                onClick={() => setShowDebug(!showDebug)}
                className="px-0 h-auto text-xs sm:text-sm text-muted-foreground hover:text-primary"
              >
                {showDebug ? "Hide Debug Info" : "Show Debug Info"}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
      
      {showDebug && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Debug Information</CardTitle>
            <CardDescription>
              Technical information for troubleshooting file detection issues
            </CardDescription>
          </CardHeader>
          <CardContent className="text-xs sm:text-sm">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">How File Detection Works</h3>
                <p className="mt-1 text-muted-foreground">
                  The system uses multiple techniques to detect file references:
                </p>
                <ol className="list-decimal pl-5 mt-2 space-y-1">
                  <li>Deep recursive search through all documents</li>
                  <li>Checking specific fields known to contain file references</li>
                  <li>Pattern matching for IDs in file URLs</li>
                  <li>Full-text search as a fallback</li>
                </ol>
              </div>
              
              <div>
                <h3 className="font-medium">Known Limitations</h3>
                <ul className="list-disc pl-5 mt-2">
                  <li>Files referenced in custom formats or non-standard ways might not be detected</li>
                  <li>Extremely large collections might timeout during processing</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 