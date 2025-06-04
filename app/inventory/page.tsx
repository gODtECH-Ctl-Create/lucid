"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { NavigationHeader } from "@/components/navigation-header"
import { InventoryItem } from "@/components/inventory-item"
import { AddInventoryDialog } from "@/components/add-inventory-dialog"
import { useInventory } from "@/contexts/inventory-context"
import { Search, Plus, AlertTriangle, Package, TrendingDown, TrendingUp } from "lucide-react"

export default function InventoryPage() {
  const { state } = useInventory()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showAddDialog, setShowAddDialog] = useState(false)

  const categories = ["All", "Vegetables", "Meat", "Dairy", "Beverages", "Spices", "Grains", "Other"]

  const filteredItems = state.items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const lowStockItems = state.items.filter((item) => item.currentStock <= item.minStock)
  const outOfStockItems = state.items.filter((item) => item.currentStock === 0)

  const totalValue = state.items.reduce((sum, item) => sum + item.currentStock * item.costPerUnit, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader title="Inventory Management" showBackButton />

      <div className="container mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{state.items.length}</div>
              <p className="text-xs text-muted-foreground">Active inventory items</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</div>
              <p className="text-xs text-muted-foreground">Items need restocking</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{outOfStockItems.length}</div>
              <p className="text-xs text-muted-foreground">Items unavailable</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Current inventory value</p>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="h-5 w-5" />
                Low Stock Alert
              </CardTitle>
              <CardDescription className="text-yellow-700">
                {lowStockItems.length} items are running low and need to be restocked soon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {lowStockItems.slice(0, 5).map((item) => (
                  <Badge key={item.id} variant="outline" className="border-yellow-300 text-yellow-800">
                    {item.name} ({item.currentStock} {item.unit})
                  </Badge>
                ))}
                {lowStockItems.length > 5 && (
                  <Badge variant="outline" className="border-yellow-300 text-yellow-800">
                    +{lowStockItems.length - 5} more
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search inventory items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        {/* Inventory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <InventoryItem key={item.id} item={item} />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCategory !== "All"
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first inventory item."}
            </p>
            <Button onClick={() => setShowAddDialog(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add First Item
            </Button>
          </div>
        )}
      </div>

      <AddInventoryDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  )
}
