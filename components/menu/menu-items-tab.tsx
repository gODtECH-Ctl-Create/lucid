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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Edit, Loader2, MoreHorizontal, Plus, Search, Trash2, Upload, Eye, EyeOff } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample menu items data
const menuItems = [
  {
    id: "1",
    name: "Grilled Chicken Breast",
    description: "Tender grilled chicken breast with herbs and spices",
    price: 25.99,
    category: "Main Course",
    image: "/placeholder.svg?height=100&width=100",
    isAvailable: true,
    preparationTime: 15,
    allergens: ["None"],
    nutritionalInfo: {
      calories: 350,
      protein: 45,
      carbs: 2,
      fat: 15,
    },
  },
  {
    id: "2",
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with Caesar dressing, croutons, and parmesan",
    price: 12.99,
    category: "Salads",
    image: "/placeholder.svg?height=100&width=100",
    isAvailable: true,
    preparationTime: 8,
    allergens: ["Dairy", "Gluten"],
    nutritionalInfo: {
      calories: 280,
      protein: 8,
      carbs: 15,
      fat: 22,
    },
  },
  {
    id: "3",
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center, served with vanilla ice cream",
    price: 8.99,
    category: "Desserts",
    image: "/placeholder.svg?height=100&width=100",
    isAvailable: false,
    preparationTime: 12,
    allergens: ["Dairy", "Eggs", "Gluten"],
    nutritionalInfo: {
      calories: 450,
      protein: 6,
      carbs: 55,
      fat: 24,
    },
  },
  {
    id: "4",
    name: "Fresh Orange Juice",
    description: "Freshly squeezed orange juice",
    price: 4.99,
    category: "Beverages",
    image: "/placeholder.svg?height=100&width=100",
    isAvailable: true,
    preparationTime: 3,
    allergens: ["None"],
    nutritionalInfo: {
      calories: 110,
      protein: 2,
      carbs: 26,
      fat: 0,
    },
  },
]

const menuItemFormSchema = z.object({
  name: z.string().min(2, {
    message: "Item name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.coerce.number().min(0.01, {
    message: "Price must be greater than 0.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  preparationTime: z.coerce.number().min(1, {
    message: "Preparation time must be at least 1 minute.",
  }),
  isAvailable: z.boolean(),
  allergens: z.array(z.string()),
  calories: z.coerce.number().optional(),
  protein: z.coerce.number().optional(),
  carbs: z.coerce.number().optional(),
  fat: z.coerce.number().optional(),
})

type MenuItemFormValues = z.infer<typeof menuItemFormSchema>

interface MenuItemsTabProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export function MenuItemsTab({ searchQuery, setSearchQuery }: MenuItemsTabProps) {
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [items, setItems] = useState(menuItems)

  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      preparationTime: 10,
      isAvailable: true,
      allergens: [],
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    },
  })

  function onSubmit(data: MenuItemFormValues) {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsAddItemDialogOpen(false)
      form.reset()
      toast({
        title: "Menu item added",
        description: `${data.name} has been added to the menu.`,
      })
      console.log(data)
    }, 1000)
  }

  const toggleAvailability = (itemId: string) => {
    setItems(items.map((item) => (item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item)))

    const item = items.find((item) => item.id === itemId)
    toast({
      title: "Availability updated",
      description: `${item?.name} is now ${item?.isAvailable ? "unavailable" : "available"}.`,
    })
  }

  const deleteItem = (itemId: string) => {
    const item = items.find((item) => item.id === itemId)
    setItems(items.filter((item) => item.id !== itemId))
    toast({
      title: "Item deleted",
      description: `${item?.name} has been removed from the menu.`,
    })
  }

  const categories = ["all", ...Array.from(new Set(items.map((item) => item.category)))]

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Menu Items</CardTitle>
              <CardDescription>Manage your restaurant menu items and their details.</CardDescription>
            </div>
            <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Menu Item</DialogTitle>
                  <DialogDescription>Create a new menu item with all the necessary details.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Item Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter item name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Appetizers">Appetizers</SelectItem>
                                <SelectItem value="Main Course">Main Course</SelectItem>
                                <SelectItem value="Salads">Salads</SelectItem>
                                <SelectItem value="Desserts">Desserts</SelectItem>
                                <SelectItem value="Beverages">Beverages</SelectItem>
                                <SelectItem value="Sides">Sides</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter item description" className="resize-none" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price ($)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="preparationTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preparation Time (minutes)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="10" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Nutritional Information (Optional)</h4>
                      <div className="grid gap-4 md:grid-cols-4">
                        <FormField
                          control={form.control}
                          name="calories"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Calories</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="0" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="protein"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Protein (g)</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="0" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="carbs"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Carbs (g)</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="0" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="fat"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fat (g)</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="0" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="isAvailable"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Available</FormLabel>
                            <FormDescription>Make this item available for ordering</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsAddItemDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          "Add Item"
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
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <Card key={item.id} className={`${!item.isAvailable ? "opacity-60" : ""}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{item.name}</CardTitle>
                          {!item.isAvailable && <Badge variant="secondary">Unavailable</Badge>}
                        </div>
                        <Badge variant="outline" className="mt-1">
                          {item.category}
                        </Badge>
                      </div>
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
                          <DropdownMenuItem onClick={() => toggleAvailability(item.id)}>
                            {item.isAvailable ? (
                              <>
                                <EyeOff className="mr-2 h-4 w-4" />
                                Mark Unavailable
                              </>
                            ) : (
                              <>
                                <Eye className="mr-2 h-4 w-4" />
                                Mark Available
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Image
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => deleteItem(item.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="h-32 w-full rounded-md object-cover"
                      />
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-green-600">${item.price.toFixed(2)}</span>
                        <span className="text-sm text-muted-foreground">{item.preparationTime} min</span>
                      </div>
                      {item.nutritionalInfo && (
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          <div className="text-center">
                            <div className="font-medium">{item.nutritionalInfo.calories}</div>
                            <div className="text-muted-foreground">cal</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{item.nutritionalInfo.protein}g</div>
                            <div className="text-muted-foreground">protein</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{item.nutritionalInfo.carbs}g</div>
                            <div className="text-muted-foreground">carbs</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{item.nutritionalInfo.fat}g</div>
                            <div className="text-muted-foreground">fat</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No menu items found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
