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
  const [showFlushDialog, setShowFlushDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
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
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this registration? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedRegistration && (
              <div className="space-y-2">
                <p><strong>Event:</strong> {selectedRegistration.eventName}</p>
                <p><strong>Name:</strong> {selectedRegistration.mainParticipant.name}</p>
                <p><strong>Email:</strong> {selectedRegistration.mainParticipant.email}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedRegistration && deleteRegistration(selectedRegistration._id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Flush Confirmation Dialog */}
      <Dialog open={showFlushDialog} onOpenChange={setShowFlushDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Flush All Registrations</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete ALL registrations? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-destructive font-semibold">
              This will permanently delete all {registrations.length} registrations.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowFlushDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={flushAllRegistrations}
            >
              Delete All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Registration Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Registration Details</DialogTitle>
          </DialogHeader>
          {selectedRegistration && (
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Event Information</h3>
                    <div className="space-y-2">
                      <p><strong>Event ID:</strong> {selectedRegistration.eventId}</p>
                      <p><strong>Event Name:</strong> {selectedRegistration.eventName}</p>
                      <p><strong>Registration Date:</strong> {formatDate(selectedRegistration.registrationDate)}</p>
                      {selectedRegistration.isTeamEvent && (
                        <p><strong>Team Name:</strong> {selectedRegistration.teamName || 'N/A'}</p>
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
                    </div>
                  </div>
                </div>

                {selectedRegistration.teamMembers && selectedRegistration.teamMembers.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Team Members</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Roll No</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Year</TableHead>
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
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {selectedRegistration.query && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Query</h3>
                    <p>{selectedRegistration.query}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold mb-2">College ID</h3>
                  <div className="border rounded-md p-2">
                    <a 
                      href={selectedRegistration.collegeIdUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View College ID
                    </a>
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