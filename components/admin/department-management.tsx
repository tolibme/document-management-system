"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, Plus, MoreHorizontal, Edit, Trash2, Users } from "lucide-react"

interface Department {
  id: string
  name: string
  description: string
  userCount: number
  manager: string
  createdAt: Date
}

const mockDepartments: Department[] = [
  {
    id: "1",
    name: "Information Technology",
    description: "Manages all technology infrastructure and software development",
    userCount: 12,
    manager: "John Doe",
    createdAt: new Date("2023-01-15"),
  },
  {
    id: "2",
    name: "Human Resources",
    description: "Handles employee relations, recruitment, and organizational development",
    userCount: 8,
    manager: "Jane Smith",
    createdAt: new Date("2023-01-15"),
  },
  {
    id: "3",
    name: "Finance",
    description: "Manages financial planning, accounting, and budget oversight",
    userCount: 6,
    manager: "Bob Johnson",
    createdAt: new Date("2023-01-15"),
  },
  {
    id: "4",
    name: "Marketing",
    description: "Develops marketing strategies and manages brand communications",
    userCount: 10,
    manager: "Alice Brown",
    createdAt: new Date("2023-02-01"),
  },
  {
    id: "5",
    name: "Operations",
    description: "Oversees daily business operations and process optimization",
    userCount: 15,
    manager: "Charlie Wilson",
    createdAt: new Date("2023-02-15"),
  },
]

export function DepartmentManagement() {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    manager: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      manager: "",
    })
    setError("")
  }

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!formData.name || !formData.description) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newDepartment: Department = {
        id: Date.now().toString(),
        ...formData,
        userCount: 0,
        createdAt: new Date(),
      }

      setDepartments((prev) => [newDepartment, ...prev])
      setIsCreateDialogOpen(false)
      resetForm()
    } catch (err) {
      setError("Failed to create department")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditDepartment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDepartment) return

    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setDepartments((prev) =>
        prev.map((dept) => (dept.id === selectedDepartment.id ? { ...dept, ...formData } : dept)),
      )
      setIsEditDialogOpen(false)
      setSelectedDepartment(null)
      resetForm()
    } catch (err) {
      setError("Failed to update department")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteDepartment = async (departmentId: string) => {
    const department = departments.find((d) => d.id === departmentId)
    if (department && department.userCount > 0) {
      alert("Cannot delete department with active users. Please reassign users first.")
      return
    }

    if (confirm("Are you sure you want to delete this department?")) {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))
        setDepartments((prev) => prev.filter((dept) => dept.id !== departmentId))
      } catch (error) {
        console.error("Failed to delete department:", error)
      }
    }
  }

  const openEditDialog = (department: Department) => {
    setSelectedDepartment(department)
    setFormData({
      name: department.name,
      description: department.description,
      manager: department.manager,
    })
    setIsEditDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Department Management</h2>
          <p className="text-muted-foreground">Manage organizational departments and structure</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Department</DialogTitle>
              <DialogDescription>Add a new department to the organization</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateDepartment}>
              <div className="space-y-4 py-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="create-name">Department Name *</Label>
                  <Input
                    id="create-name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter department name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-description">Description *</Label>
                  <Textarea
                    id="create-description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Enter department description"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-manager">Department Manager</Label>
                  <Input
                    id="create-manager"
                    value={formData.manager}
                    onChange={(e) => handleInputChange("manager", e.target.value)}
                    placeholder="Enter manager name"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Department"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Departments
          </CardTitle>
          <CardDescription>{departments.length} departments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{department.name}</div>
                      <div className="text-sm text-muted-foreground max-w-md truncate">{department.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>{department.manager || "Not assigned"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="secondary">{department.userCount}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>{department.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openEditDialog(department)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="mr-2 h-4 w-4" />
                          View Users
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteDepartment(department.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Department Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>Update department information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditDepartment}>
            <div className="space-y-4 py-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="edit-name">Department Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter department name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter department description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-manager">Department Manager</Label>
                <Input
                  id="edit-manager"
                  value={formData.manager}
                  onChange={(e) => handleInputChange("manager", e.target.value)}
                  placeholder="Enter manager name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Department"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
