"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  ChefHat,
  AlertTriangle,
  Settings,
  Plus,
  Eye,
  MoreHorizontal,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

// Sample data
const todayStats = {
  revenue: 2847.5,
  orders: 156,
  customers: 89,
  avgOrderValue: 18.25,
}

const recentOrders = [
  {
    id: "ORD-001",
    table: "Table 5",
    customer: "John Doe",
    items: 3,
    total: 45.99,
    status: "preparing",
    time: "2 min ago",
  },
  {
    id: "ORD-002",
    table: "Table 2",
    customer: "Sarah Wilson",
    items: 2,
    total: 28.5,
    status: "ready",
    time: "5 min ago",
  },
  {
    id: "ORD-003",
    table: "Table 8",
    customer: "Mike Johnson",
    items: 4,
    total: 67.25,
    status: "served",
    time: "8 min ago",
  },
  {
    id: "ORD-004",
    table: "Takeaway",
    customer: "Emma Davis",
    items: 1,
    total: 12.99,
    status: "pending",
    time: "10 min ago",
  },
]

const popularItems = [
  { name: "Grilled Chicken Breast", orders: 23, revenue: 597.7 },
  { name: "Caesar Salad", orders: 18, revenue: 233.82 },
  { name: "Margherita Pizza", orders: 15, revenue: 224.85 },
  { name: "Beef Burger", orders: 12, revenue: 191.88 },
]

const lowStockItems = [
  { name: "Chicken Breast", current: 5, minimum: 10, unit: "kg" },
  { name: "Tomatoes", current: 8, minimum: 15, unit: "kg" },
  { name: "Mozzarella Cheese", current: 2, minimum: 5, unit: "kg" },
]

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("today")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "preparing":
        return "bg-blue-100 text-blue-800"
      case "ready":
        return "bg-green-100 text-green-800"
      case "served":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening at your restaurant today.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/pos">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Order
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${todayStats.revenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12.5%</span> from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayStats.orders}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8.2%</span> from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayStats.customers}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+5.1%</span> from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${todayStats.avgOrderValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+3.8%</span> from yesterday
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest orders from your restaurant</CardDescription>
                </div>
                <Link href="/orders">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="font-medium">{order.id}</div>
                        <div className="text-sm text-gray-500">
                          {order.table} • {order.customer}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium">${order.total.toFixed(2)}</div>
                        <div className="text-sm text-gray-500">{order.items} items</div>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <div className="text-sm text-gray-500">{order.time}</div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Update Status</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Print Receipt</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions & Alerts */}
          <div className="space-y-6">
            {/* Low Stock Alert */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Low Stock Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lowStockItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-gray-500">
                          {item.current} {item.unit} remaining
                        </div>
                      </div>
                      <Badge variant="outline" className="text-orange-600 border-orange-200">
                        Low
                      </Badge>
                    </div>
                  ))}
                </div>
                <Link href="/inventory">
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    Manage Inventory
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/pos">
                  <Button className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    New Order
                  </Button>
                </Link>
                <Link href="/kitchen">
                  <Button variant="outline" className="w-full justify-start">
                    <ChefHat className="h-4 w-4 mr-2" />
                    Kitchen Display
                  </Button>
                </Link>
                <Link href="/reports">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Reports
                  </Button>
                </Link>
                <Link href="/settings/menu">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Menu
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Popular Items */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Items Today</CardTitle>
            <CardDescription>Best-selling menu items and their performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularItems.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-500 mt-1">{item.orders} orders</div>
                  <div className="text-lg font-bold text-green-600 mt-2">${item.revenue.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="today" className="space-y-4">
              <TabsList>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="week">This Week</TabsTrigger>
                <TabsTrigger value="month">This Month</TabsTrigger>
              </TabsList>
              <TabsContent value="today" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">156</div>
                    <div className="text-sm text-gray-500">Total Orders</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">$2,847.50</div>
                    <div className="text-sm text-gray-500">Revenue</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">89</div>
                    <div className="text-sm text-gray-500">Customers</div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="week" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">1,092</div>
                    <div className="text-sm text-gray-500">Total Orders</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">$19,932.50</div>
                    <div className="text-sm text-gray-500">Revenue</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">623</div>
                    <div className="text-sm text-gray-500">Customers</div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="month" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">4,687</div>
                    <div className="text-sm text-gray-500">Total Orders</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">$85,432.75</div>
                    <div className="text-sm text-gray-500">Revenue</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">2,891</div>
                    <div className="text-sm text-gray-500">Customers</div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
