"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useInventory } from "@/contexts/inventory-context"

interface AddInventoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddInventoryDialog({ open, onOpenChange }: AddInventoryDialogProps) {
  const { dispatch } = useInventory()
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    currentStock: "",
    minStock: "",
    maxStock: "",
    unit: "",
    costPerUnit: "",
    supplier: "",
    expiryDate: "",
    description: "",
  })

  const categories = ["Vegetables", "Meat", "Dairy", "Beverages", "Spices", "Grains", "Other"]
  const units = ["kg", "liters", "pieces", "boxes", "bottles", "cans", "packets"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newItem = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category,
      currentStock: Number.parseInt(formData.currentStock),
      minStock: Number.parseInt(formData.minStock),
      maxStock: Number.parseInt(formData.maxStock),
      unit: formData.unit,
      costPerUnit: Number.parseFloat(formData.costPerUnit),
      supplier: formData.supplier,
      lastRestocked: new Date(),
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined,
      description: formData.description,
    }

    dispatch({ type: "ADD_ITEM", payload: newItem })
    onOpenChange(false)
    setFormData({
      name: "",
      category: "",
      currentStock: "",
      minStock: "",
      maxStock: "",
      unit: "",
      costPerUnit: "",
      supplier: "",
      expiryDate: "",
      description: "",
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Inventory Item</DialogTitle>
          <DialogDescription>Add a new item to your restaurant inventory.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Tomatoes"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentStock">Current Stock *</Label>
              <Input
                id="currentStock"
                type="number"
                value={formData.currentStock}
                onChange={(e) => handleInputChange("currentStock", e.target.value)}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minStock">Min Stock *</Label>
              <Input
                id="minStock"
                type="number"
                value={formData.minStock}
                onChange={(e) => handleInputChange("minStock", e.target.value)}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxStock">Max Stock *</Label>
              <Input
                id="maxStock"
                type="number"
                value={formData.maxStock}
                onChange={(e) => handleInputChange("maxStock", e.target.value)}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="costPerUnit">Cost per Unit *</Label>
              <Input
                id="costPerUnit"
                type="number"
                step="0.01"
                value={formData.costPerUnit}
                onChange={(e) => handleInputChange("costPerUnit", e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier *</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => handleInputChange("supplier", e.target.value)}
                placeholder="e.g., Fresh Farm Co."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange("expiryDate", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Optional description of the item"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Add Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
