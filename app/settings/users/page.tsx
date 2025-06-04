"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Edit, Loader2, MoreHorizontal, Plus, Search, Trash2, UserPlus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample user data
const users = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    status: "active",
    lastLogin: "2023-06-01T10:30:00Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "manager",
    status: "active",
    lastLogin: "2023-06-02T14:45:00Z",
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael@example.com",
    role: "cashier",
    status: "inactive",
    lastLogin: "2023-05-28T09:15:00Z",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    role: "waiter",
    status: "active",
    lastLogin: "2023-06-03T11:20:00Z",
  },
  {
    id: "5",
    name: "David Brown",
    email: "david@example.com",
    role: "kitchen",
    status: "active",
    lastLogin: "2023-06-03T08:10:00Z",
  },
]

const userFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  role: z.string(),
  status: z.enum(["active", "inactive"]),
  sendInvite: z.boolean().optional(),
})

type UserFormValues = z.infer<typeof userFormSchema>

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "cashier",
      status: "active",
      sendInvite: true,
    },
  })

  function onSubmit(data: UserFormValues) {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsAddUserDialogOpen(false)
      form.reset()
      toast({
        title: "User added successfully",
        description: `${data.name} has been added as a ${data.role}.`,
      })
      console.log(data)
    }, 1000)
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 hover:bg-red-100/80"
      case "manager":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80"
      case "cashier":
        return "bg-green-100 text-green-800 hover:bg-green-100/80"
      case "waiter":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80"
      case "kitchen":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100/80"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date)
  }

  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
        <p className="text-muted-foreground">Manage staff accounts and permissions.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Staff Members</CardTitle>
              <CardDescription>Manage your restaurant staff and their access levels.</CardDescription>
            </div>
            <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>Create a new user account and set their role.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="admin">Administrator</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="cashier">Cashier</SelectItem>
                              <SelectItem value="waiter">Waiter/Waitress</SelectItem>
                              <SelectItem value="kitchen">Kitchen Staff</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sendInvite"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Send Invitation Email</FormLabel>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          "Create User"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="rounded-md border">
            <div className="grid grid-cols-12 gap-2 border-b bg-muted/50 p-4 font-medium">
              <div className="col-span-3">Name</div>
              <div className="col-span-3">Email</div>
              <div className="col-span-2">Role</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Last Login</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user.id} className="grid grid-cols-12 gap-2 border-b p-4 items-center">
                  <div className="col-span-3 font-medium">{user.name}</div>
                  <div className="col-span-3 text-muted-foreground">{user.email}</div>
                  <div className="col-span-2">
                    <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <Badge variant={user.status === "active" ? "default" : "secondary"}>
                      {user.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="col-span-1 text-sm text-muted-foreground">{formatDate(user.lastLogin)}</div>
                  <div className="col-span-1 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Plus className="mr-2 h-4 w-4" />
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">No users found matching your search.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
