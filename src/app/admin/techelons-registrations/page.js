"use client";

import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Download, Trash2, RefreshCw, Eye } from "lucide-react";
import toast from "react-hot-toast";

export default function TechelonsRegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showFlushDialog, setShowFlushDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);

  // Fetch registrations
  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/techelons-registrations");
      
      if (!response.ok) {
        throw new Error("Failed to fetch registrations");
      }
      
      const data = await response.json();
      setRegistrations(data.registrations || []);
    } catch (error) {
      console.error("Error fetching registrations:", error);
      toast.error("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  // Filter registrations based on active tab
  useEffect(() => {
    if (activeTab === "all") {
      setFilteredRegistrations(registrations);
    } else {
      setFilteredRegistrations(
        registrations.filter(reg => reg.eventId === activeTab)
      );
    }
  }, [activeTab, registrations]);

  // Initial fetch
  useEffect(() => {
    fetchRegistrations();
  }, []);

  // Get unique event IDs for tabs
  const eventIds = [...new Set(registrations.map(reg => reg.eventId))];

  // Delete a registration
  const deleteRegistration = async (id) => {
    try {
      const response = await fetch(`/api/admin/techelons-registrations?id=${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete registration");
      }
      
      toast.success("Registration deleted successfully");
      fetchRegistrations();
    } catch (error) {
      console.error("Error deleting registration:", error);
      toast.error("Failed to delete registration");
    } finally {
      setShowDeleteDialog(false);
    }
  };

  // Flush all registrations
  const flushAllRegistrations = async () => {
    try {
      const response = await fetch("/api/admin/techelons-registrations/flush", {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to flush registrations");
      }
      
      const data = await response.json();
      toast.success(`${data.count} registrations deleted successfully`);
      fetchRegistrations();
    } catch (error) {
      console.error("Error flushing registrations:", error);
      toast.error("Failed to flush registrations");
    } finally {
      setShowFlushDialog(false);
    }
  };

  // Download registrations as CSV
  const downloadCSV = () => {
    window.open("/api/admin/techelons-registrations/export", "_blank");
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Techelons Registrations</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchRegistrations}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            onClick={downloadCSV}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => setShowFlushDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Flush All
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registration Data</CardTitle>
          <CardDescription>
            Total Registrations: {registrations.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Events</TabsTrigger>
              {eventIds.map(eventId => (
                <TabsTrigger key={eventId} value={eventId}>
                  {eventId}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredRegistrations.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-64 text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mb-2" />
                  <p>No registrations found</p>
                </div>
              ) : (
                <ScrollArea className="h-[60vh]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>College</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRegistrations.map((registration) => (
                        <TableRow key={registration._id}>
                          <TableCell>
                            <Badge variant="outline">{registration.eventId}</Badge>
                          </TableCell>
                          <TableCell>{registration.mainParticipant.name}</TableCell>
                          <TableCell>{registration.mainParticipant.email}</TableCell>
                          <TableCell>{registration.mainParticipant.phone}</TableCell>
                          <TableCell>{registration.mainParticipant.college}</TableCell>
                          <TableCell>{formatDate(registration.registrationDate)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedRegistration(registration);
                                  setShowDetailsDialog(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                onClick={() => {
                                  setSelectedRegistration(registration);
                                  setShowDeleteDialog(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this registration? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            {selectedRegistration && (
              <div className="space-y-2">
                <p><strong>Event:</strong> {selectedRegistration.eventName}</p>
                <p><strong>Name:</strong> {selectedRegistration.mainParticipant.name}</p>
                <p><strong>Email:</strong> {selectedRegistration.mainParticipant.email}</p>
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedRegistration && deleteRegistration(selectedRegistration._id)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Flush Confirmation Alert Dialog */}
      <AlertDialog open={showFlushDialog} onOpenChange={setShowFlushDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Flush All Registrations</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete ALL registrations? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <p className="text-destructive font-semibold">
              This will permanently delete all {registrations.length} registrations.
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={flushAllRegistrations}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Registration Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden sm:max-w-[95%] lg:max-w-[85%] xl:max-w-[75%] w-full">
          <DialogHeader>
            <DialogTitle>Registration Details</DialogTitle>
          </DialogHeader>
          {selectedRegistration && (
            <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Event Information</h3>
                    <div className="space-y-2">
                      <p><strong>Event ID:</strong> {selectedRegistration.eventId}</p>
                      <p><strong>Event Name:</strong> {selectedRegistration.eventName}</p>
                      <p><strong>Registration Date:</strong> {formatDate(selectedRegistration.registrationDate)}</p>
                      <p><strong>Team Event:</strong> {selectedRegistration.isTeamEvent ? 'Yes' : 'No'}</p>
                      {selectedRegistration.isTeamEvent && (
                        <p><strong>Team Name:</strong> {selectedRegistration.teamName || 'N/A'}</p>
                      )}
                      {selectedRegistration.createdAt && (
                        <p><strong>Created At:</strong> {formatDate(selectedRegistration.createdAt)}</p>
                      )}
                      {selectedRegistration.updatedAt && (
                        <p><strong>Updated At:</strong> {formatDate(selectedRegistration.updatedAt)}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Main Participant</h3>
                    <div className="space-y-2">
                      <p><strong>Name:</strong> {selectedRegistration.mainParticipant.name}</p>
                      <p><strong>Email:</strong> {selectedRegistration.mainParticipant.email}</p>
                      <p><strong>Phone:</strong> {selectedRegistration.mainParticipant.phone}</p>
                      <p><strong>Roll No:</strong> {selectedRegistration.mainParticipant.rollNo}</p>
                      <p><strong>Course:</strong> {selectedRegistration.mainParticipant.course}</p>
                      <p><strong>Year:</strong> {selectedRegistration.mainParticipant.year}</p>
                      <p><strong>College:</strong> {selectedRegistration.mainParticipant.college}</p>
                      {selectedRegistration.mainParticipant.otherCollege && (
                        <p><strong>Other College:</strong> {selectedRegistration.mainParticipant.otherCollege}</p>
                      )}
                    </div>
                  </div>
                </div>

                {selectedRegistration.teamMembers && selectedRegistration.teamMembers.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Team Members</h3>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Roll No</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>Year</TableHead>
                            <TableHead>College</TableHead>
                            <TableHead>Other College</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedRegistration.teamMembers.map((member, index) => (
                            <TableRow key={index}>
                              <TableCell>{member.name}</TableCell>
                              <TableCell>{member.email}</TableCell>
                              <TableCell>{member.phone}</TableCell>
                              <TableCell>{member.rollNo}</TableCell>
                              <TableCell>{member.course}</TableCell>
                              <TableCell>{member.year}</TableCell>
                              <TableCell>{member.college}</TableCell>
                              <TableCell>{member.otherCollege || '-'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {selectedRegistration.query && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Query</h3>
                    <p className="break-words">{selectedRegistration.query}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold mb-2">College ID</h3>
                  <div className="border rounded-md p-2">
                    <a 
                      href={selectedRegistration.collegeIdUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-2"
                    >
                      <span>View College ID</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Record Information</h3>
                  <div className="space-y-2">
                    <p><strong>ID:</strong> {selectedRegistration._id}</p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 