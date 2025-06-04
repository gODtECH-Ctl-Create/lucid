"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useInventory, type InventoryItem as InventoryItemType } from "@/contexts/inventory-context"
import { Package, AlertTriangle, Calendar, Truck, Plus, Minus, Edit, Trash2 } from "lucide-react"

interface InventoryItemProps {
  item: InventoryItemType
}

export function InventoryItem({ item }: InventoryItemProps) {
  const { dispatch } = useInventory()
  const [isEditing, setIsEditing] = useState(false)
  const [stockChange, setStockChange] = useState("")

  const isLowStock = item.currentStock <= item.minStock
  const isOutOfStock = item.currentStock === 0
  const isExpiringSoon = item.expiryDate && new Date(item.expiryDate) <= new Date(Date.now() + 86400000 * 3)

  const handleStockUpdate = (type: "add" | "subtract") => {
    const quantity = Number.parseInt(stockChange)
    if (quantity > 0) {
      dispatch({
        type: "UPDATE_STOCK",
        payload: { id: item.id, quantity, type },
      })
      setStockChange("")
    }
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
      dispatch({ type: "DELETE_ITEM", payload: item.id })
    }
  }

  const getStockStatus = () => {
    if (isOutOfStock) return { label: "Out of Stock", color: "bg-red-100 text-red-800" }
    if (isLowStock) return { label: "Low Stock", color: "bg-yellow-100 text-yellow-800" }
    return { label: "In Stock", color: "bg-green-100 text-green-800" }
  }

  const stockStatus = getStockStatus()

  return (
    <Card className={`${isOutOfStock ? "border-red-200" : isLowStock ? "border-yellow-200" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{item.name}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge className={stockStatus.color}>{stockStatus.label}</Badge>
          <Badge variant="outline">{item.category}</Badge>
          {isExpiringSoon && (
            <Badge variant="outline" className="border-orange-300 text-orange-700">
              Expiring Soon
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stock Information */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex items-center gap-1 text-gray-600 mb-1">
              <Package className="h-3 w-3" />
              Current Stock
            </div>
            <div className="font-semibold">
              {item.currentStock} {item.unit}
            </div>
          </div>
          <div>
            <div className="text-gray-600 mb-1">Min Stock</div>
            <div className="font-semibold">
              {item.minStock} {item.unit}
            </div>
          </div>
        </div>

        {/* Cost and Supplier */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-600 mb-1">Cost per {item.unit}</div>
            <div className="font-semibold">${item.costPerUnit.toFixed(2)}</div>
          </div>
          <div>
            <div className="flex items-center gap-1 text-gray-600 mb-1">
              <Truck className="h-3 w-3" />
              Supplier
            </div>
            <div className="font-semibold text-xs">{item.supplier}</div>
          </div>
        </div>

        {/* Dates */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <Calendar className="h-3 w-3" />
            Last Restocked: {item.lastRestocked.toLocaleDateString()}
          </div>
          {item.expiryDate && (
            <div className="flex items-center gap-1 text-gray-600">
              <AlertTriangle className="h-3 w-3" />
              Expires: {item.expiryDate.toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Stock Management */}
        {isEditing && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Quantity"
                value={stockChange}
                onChange={(e) => setStockChange(e.target.value)}
                className="flex-1"
              />
              <Button size="sm" variant="outline" onClick={() => handleStockUpdate("subtract")}>
                <Minus className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleStockUpdate("add")}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2">
          {isLowStock && (
            <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
              Restock
            </Button>
          )}
          {isOutOfStock && (
            <Button size="sm" className="flex-1 bg-red-600 hover:bg-red-700">
              Urgent Restock
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
