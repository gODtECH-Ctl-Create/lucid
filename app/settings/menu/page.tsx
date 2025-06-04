"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MenuCategoriesTab } from "@/components/menu/menu-categories-tab"
import { MenuItemsTab } from "@/components/menu/menu-items-tab"
import { MenuImportExportTab } from "@/components/menu/menu-import-export-tab"

export default function MenuManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Menu Management</h2>
        <p className="text-muted-foreground">Manage your restaurant menu items, categories, and pricing.</p>
      </div>

      <Tabs defaultValue="items" className="space-y-4">
        <TabsList>
          <TabsTrigger value="items">Menu Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="import-export">Import/Export</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-4">
          <MenuItemsTab searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <MenuCategoriesTab />
        </TabsContent>

        <TabsContent value="import-export" className="space-y-4">
          <MenuImportExportTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
