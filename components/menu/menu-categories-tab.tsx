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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Edit, Loader2, MoreHorizontal, Plus, Trash2, GripVertical, Eye, EyeOff } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample categories data
const categories = [
  {
    id: "1",
    name: "Appetizers",
    description: "Start your meal with our delicious appetizers",
    isActive: true,
    itemCount: 8,
    sortOrder: 1,
  },
  {
    id: "2",
    name: "Main Course",
    description: "Our signature main dishes",
    isActive: true,
    itemCount: 15,
    sortOrder: 2,
  },
  {
    id: "3",
    name: "Salads",
    description: "Fresh and healthy salad options",
    isActive: true,
    itemCount: 6,
    sortOrder: 3,
  },
  {
    id: "4",
    name: "Desserts",
    description: "Sweet treats to end your meal",
    isActive: false,
    itemCount: 4,
    sortOrder: 4,
  },
  {
    id: "5",
    name: "Beverages",
    description: "Refreshing drinks and beverages",
    isActive: true,
    itemCount: 12,
    sortOrder: 5,
  },
  {
    id: "6",
    name: "Sides",
    description: "Perfect accompaniments to your meal",
    isActive: true,
    itemCount: 7,
    sortOrder: 6,
  },
]

const categoryFormSchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  isActive: z.boolean(),
})

type CategoryFormValues = z.infer<typeof categoryFormSchema>

export function MenuCategoriesTab() {
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [categoryList, setCategoryList] = useState(categories)

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
    },
  })

  function onSubmit(data: CategoryFormValues) {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsAddCategoryDialogOpen(false)
      form.reset()
      toast({
        title: "Category added",
        description: `${data.name} category has been created.`,
      })
      console.log(data)
    }, 1000)
  }

  const toggleCategoryStatus = (categoryId: string) => {
    setCategoryList(
      categoryList.map((category) =>
        category.id === categoryId ? { ...category, isActive: !category.isActive } : category,
      ),
    )

    const category = categoryList.find((cat) => cat.id === categoryId)
    toast({
      title: "Category updated",
      description: `${category?.name} is now ${category?.isActive ? "inactive" : "active"}.`,
    })
  }

  const deleteCategory = (categoryId: string) => {
    const category = categoryList.find((cat) => cat.id === categoryId)
    setCategoryList(categoryList.filter((cat) => cat.id !== categoryId))
    toast({
      title: "Category deleted",
      description: `${category?.name} category has been removed.`,
    })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Menu Categories</CardTitle>
              <CardDescription>Organize your menu items into categories for better navigation.</CardDescription>
            </div>
            <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                  <DialogDescription>Create a new menu category to organize your items.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter category name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter category description" className="resize-none" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Active</FormLabel>
                            <FormDescription>Make this category visible in the menu</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsAddCategoryDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          "Create Category"
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
          <div className="space-y-4">
            {categoryList.map((category) => (
              <Card key={category.id} className={`${!category.isActive ? "opacity-60" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="icon" className="cursor-grab">
                        <GripVertical className="h-4 w-4" />
                      </Button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{category.name}</h3>
                          {!category.isActive && <Badge variant="secondary">Inactive</Badge>}
                          <Badge variant="outline">{category.itemCount} items</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                      </div>
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
                        <DropdownMenuItem onClick={() => toggleCategoryStatus(category.id)}>
                          {category.isActive ? (
                            <>
                              <EyeOff className="mr-2 h-4 w-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Eye className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => deleteCategory(category.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Management Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Organization</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use drag and drop to reorder categories</li>
                <li>• Group similar items together</li>
                <li>• Keep category names short and descriptive</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Best Practices</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Start with appetizers, then mains, then desserts</li>
                <li>• Use seasonal categories for special items</li>
                <li>• Deactivate instead of deleting categories</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
