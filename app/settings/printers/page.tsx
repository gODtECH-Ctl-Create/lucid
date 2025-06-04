"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Plus, Printer, TestTube, Trash2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const printerFormSchema = z.object({
  name: z.string().min(2, {
    message: "Printer name must be at least 2 characters.",
  }),
  type: z.string(),
  connection: z.string(),
  ipAddress: z.string().optional(),
  port: z.coerce.number().optional(),
  paperSize: z.string(),
  isDefault: z.boolean(),
  printLogo: z.boolean(),
  autoCut: z.boolean(),
  openCashDrawer: z.boolean(),
})

type PrinterFormValues = z.infer<typeof printerFormSchema>

const defaultValues: PrinterFormValues = {
  name: "",
  type: "thermal",
  connection: "network",
  ipAddress: "",
  port: 9100,
  paperSize: "80mm",
  isDefault: false,
  printLogo: true,
  autoCut: true,
  openCashDrawer: false,
}

export default function PrinterSettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [printers, setPrinters] = useState([
    {
      id: "1",
      name: "Kitchen Printer",
      type: "thermal",
      connection: "network",
      ipAddress: "192.168.1.100",
      port: 9100,
      paperSize: "80mm",
      isDefault: false,
      printLogo: false,
      autoCut: true,
      openCashDrawer: false,
    },
    {
      id: "2",
      name: "Receipt Printer",
      type: "thermal",
      connection: "network",
      ipAddress: "192.168.1.101",
      port: 9100,
      paperSize: "58mm",
      isDefault: true,
      printLogo: true,
      autoCut: true,
      openCashDrawer: true,
    },
  ])

  const form = useForm<PrinterFormValues>({
    resolver: zodResolver(printerFormSchema),
    defaultValues,
  })

  function onSubmit(data: PrinterFormValues) {
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      
      // If setting as default, update other printers
      if (data.isDefault) {
        setPrinters(printers.map(printer => ({
          ...printer,
          isDefault: false,
        })))
      }
      
      // Add new printer
      setPrinters([
        ...printers,
        {
          id: `${printers.length + 1}`,
          ...data,
        },
      ])
      
      form.reset(defaultValues)
      
      toast({
        title: "Printer added",
        description: `${data.name} has been added successfully.`,
      })
    }, 1000)
  }

  const testPrinter = (printerId: string) => {
    toast({
      title: "Test print sent",
      description: "A test page has been sent to the printer.",
    })
  }

  const deletePrinter = (printerId: string) => {
    setPrinters(printers.filter(printer => printer.id !== printerId))
    toast({
      title: "Printer removed",
      description: "The printer has been removed successfully.",
    })
  }

  const connectionType = form.watch("connection")

  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Printer Settings</h2>
        <p className="text-muted-foreground">
          Configure receipt and kitchen printers for your restaurant.
        </p>
      </div>

      <Tabs defaultValue="printers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="printers">Printers</TabsTrigger>
          <TabsTrigger value="add">Add Printer</TabsTrigger>
        </TabsList>
        <TabsContent value="printers" className="space-y-4">
          {printers.length > 0 ? (
            printers.map((printer) => (
              <Card key={printer.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Printer className="h-5 w-5 text-muted-foreground" />
                      <CardTitle>{printer.name}</CardTitle>
                      {printer.isDefault && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => testPrinter(printer.id)}>
                        <TestTube className="mr-2 h-4 w-4" />
                        Test
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => deletePrinter(printer.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    {printer.type.charAt(0).toUpperCase() + printer.type.slice(1)} printer • 
                    {printer.connection === "network" ? ` ${printer.ipAddress}:${printer.port}` : " USB/Local"} • 
                    {printer.paperSize} paper
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium">Print Logo</span>
                      <span className="text-sm text-muted-foreground">
                        {printer.printLogo ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium">Auto Cut</span>
                      <span className="text-sm text-muted-foreground">
                        {printer.autoCut ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium">Cash Drawer</span>
                      <span className="text-sm text-muted-foreground">
                        {printer.openCashDrawer ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium">Paper Size</span>
                      <span className="text-sm text-muted-foreground">
                        {printer.paperSize}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Printer className="h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No printers configured</h3>
                <p className="mt-2 text-center text-muted-foreground">
                  You haven't added any printers yet. Add a printer to start printing receipts and kitchen orders.
                </p>
                <Button className="mt-4" onClick={() => document.querySelector('[value="add"]')?.click()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Printer
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New Printer</CardTitle>
              <CardDescription>
                Configure a new printer for receipts or kitchen orders.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Printer Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Kitchen Printer, Receipt Printer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Printer Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select printer type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="thermal">Thermal Printer</SelectItem>
                              <SelectItem value="impact">Impact Printer</SelectItem>
                              <SelectItem value="inkjet">Inkjet Printer</SelectItem>
                              <SelectItem value="laser">Laser Printer</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="connection"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Connection Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select connection type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="network">Network/IP</SelectItem>
                              <SelectItem value="usb">USB/Local</SelectItem>
                              <SelectItem value="bluetooth">Bluetooth</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="paperSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Paper Size</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select paper size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="58mm">58mm</SelectItem>
                              <SelectItem value="80mm">80mm</SelectItem>
                              <SelectItem value="a4">A4</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {connectionType === "network" && (
                      <>
                        <FormField
                          control={form.control}
                          name="ipAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>IP Address</FormLabel>
                              \
