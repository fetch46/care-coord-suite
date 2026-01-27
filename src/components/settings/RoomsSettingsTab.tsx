import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Bed, Plus, Trash2, Search, Users } from "lucide-react";

interface Room {
  id: string;
  room_number: string;
  room_type?: string;
  capacity?: number;
  status?: string;
  floor?: string;
  building?: string;
}

interface RoomsSettingsTabProps {
  rooms: Room[];
  onUpdate: (rooms: Room[]) => void;
  loading?: boolean;
}

const ROOM_TYPES = ["Private", "Semi-Private", "Ward", "ICU", "Emergency", "Isolation", "Suite"];
const ROOM_STATUSES = [
  { value: "available", label: "Available", color: "bg-green-500" },
  { value: "occupied", label: "Occupied", color: "bg-blue-500" },
  { value: "maintenance", label: "Maintenance", color: "bg-yellow-500" },
  { value: "reserved", label: "Reserved", color: "bg-purple-500" },
];

export function RoomsSettingsTab({ rooms, onUpdate, loading = false }: RoomsSettingsTabProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newRoom, setNewRoom] = useState<Partial<Room>>({
    room_number: "",
    room_type: "Private",
    capacity: 1,
    status: "available",
    floor: "",
    building: "",
  });

  const filteredRooms = rooms.filter(room => 
    room.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (room.room_type?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (room.building?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const handleAddRoom = async () => {
    if (!newRoom.room_number?.trim()) {
      toast({
        title: "Validation Error",
        description: "Room number is required",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const roomToInsert = {
        room_number: newRoom.room_number,
        room_type: newRoom.room_type || "Private",
        capacity: newRoom.capacity || 1,
        status: newRoom.status || "available",
        floor: newRoom.floor || null,
        building: newRoom.building || null,
      };
      
      const { data, error } = await supabase
        .from("rooms")
        .insert([roomToInsert])
        .select();
      
      if (error) throw error;
      
      if (data) {
        onUpdate([...rooms, data[0]]);
        setNewRoom({
          room_number: "",
          room_type: "Private",
          capacity: 1,
          status: "available",
          floor: "",
          building: "",
        });
        setIsAddDialogOpen(false);
        
        toast({
          title: "Room added",
          description: `Room ${data[0].room_number} has been added successfully.`,
        });
      }
    } catch (error) {
      console.error("Error adding room:", error);
      toast({
        title: "Error",
        description: "Failed to add room",
        variant: "destructive"
      });
    }
    setSaving(false);
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      const { error } = await supabase
        .from("rooms")
        .delete()
        .eq("id", roomId);
      
      if (error) throw error;
      
      onUpdate(rooms.filter(room => room.id !== roomId));
      
      toast({
        title: "Room deleted",
        description: "Room has been removed successfully.",
      });
    } catch (error) {
      console.error("Error deleting room:", error);
      toast({
        title: "Error",
        description: "Failed to delete room",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = ROOM_STATUSES.find(s => s.value === status) || ROOM_STATUSES[0];
    return (
      <Badge variant="outline" className="gap-1.5">
        <span className={`h-2 w-2 rounded-full ${statusConfig.color}`} />
        {statusConfig.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Stats
  const stats = {
    total: rooms.length,
    available: rooms.filter(r => r.status === "available").length,
    occupied: rooms.filter(r => r.status === "occupied").length,
    maintenance: rooms.filter(r => r.status === "maintenance").length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Rooms</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
            <p className="text-xs text-muted-foreground">Available</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.occupied}</div>
            <p className="text-xs text-muted-foreground">Occupied</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{stats.maintenance}</div>
            <p className="text-xs text-muted-foreground">Maintenance</p>
          </CardContent>
        </Card>
      </div>

      {/* Rooms Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Bed className="h-5 w-5 text-primary" />
                <CardTitle>Room Management</CardTitle>
              </div>
              <CardDescription>
                Manage rooms and their availability status
              </CardDescription>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Room
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Room</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new room
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="room_number">Room Number *</Label>
                      <Input
                        id="room_number"
                        placeholder="e.g., 101"
                        value={newRoom.room_number || ""}
                        onChange={(e) => setNewRoom({...newRoom, room_number: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="room_type">Room Type</Label>
                      <Select
                        value={newRoom.room_type || "Private"}
                        onValueChange={(value) => setNewRoom({...newRoom, room_type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROOM_TYPES.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input
                        id="capacity"
                        type="number"
                        min="1"
                        value={newRoom.capacity || 1}
                        onChange={(e) => setNewRoom({...newRoom, capacity: parseInt(e.target.value) || 1})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={newRoom.status || "available"}
                        onValueChange={(value) => setNewRoom({...newRoom, status: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROOM_STATUSES.map(status => (
                            <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="floor">Floor</Label>
                      <Input
                        id="floor"
                        placeholder="e.g., Ground Floor"
                        value={newRoom.floor || ""}
                        onChange={(e) => setNewRoom({...newRoom, floor: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="building">Building</Label>
                      <Input
                        id="building"
                        placeholder="e.g., Main Building"
                        value={newRoom.building || ""}
                        onChange={(e) => setNewRoom({...newRoom, building: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddRoom} disabled={saving}>
                    {saving ? "Adding..." : "Add Room"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search rooms..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Table */}
          {filteredRooms.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Bed className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No rooms found</p>
              <p className="text-sm">Add a room to get started</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room #</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Floor</TableHead>
                    <TableHead>Building</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.room_number}</TableCell>
                      <TableCell>{room.room_type || "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {room.capacity || 1}
                        </div>
                      </TableCell>
                      <TableCell>{room.floor || "-"}</TableCell>
                      <TableCell>{room.building || "-"}</TableCell>
                      <TableCell>{getStatusBadge(room.status || "available")}</TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Room</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete room {room.room_number}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteRoom(room.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
