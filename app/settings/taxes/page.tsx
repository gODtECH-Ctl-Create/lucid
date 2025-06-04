"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Plus, Trash2 } from "lucide-react"

const taxFormSchema = z.object({
  defaultTaxRate: z.coerce.number().min(0).max(100),
  taxIncluded: z.boolean(),
  displayTaxOnReceipt: z.boolean(),
  currency: z.string(),
  currencySymbol: z.string(),
  currencyPosition: z.enum(["before", "after"]),
  decimalPlaces: z.coerce.number().int().min(0).max(4),
  thousandsSeparator: z.string().max(1),
  decimalSeparator: z.string().max(1),
  additionalTaxes: z.array(
    z.object({
      name: z.string().min(1),
      rate: z.coerce.number().min(0).max(100),
      isEnabled: z.boolean(),
    }),
  ),
})

type TaxFormValues = z.infer<typeof taxFormSchema>

const defaultValues: TaxFormValues = {
  defaultTaxRate: 5,
  taxIncluded: false,
  displayTaxOnReceipt: true,
  currency: "NGN",
  currencySymbol: "₦",
  currencyPosition: "before",
  decimalPlaces: 2,
  thousandsSeparator: ",",
  decimalSeparator: ".",
  additionalTaxes: [
    {
      name: "VAT",
      rate: 7.5,
      isEnabled: true,
    },
  ],
}

export default function TaxSettingsPage() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<TaxFormValues>({
    resolver: zodResolver(taxFormSchema),
    defaultValues,
  })

  function onSubmit(data: TaxFormValues) {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Tax and currency settings updated",
        description: "Your tax and currency settings have been successfully updated.",
      })
      console.log(data)
    }, 1000)
  }

  const additionalTaxes = form.watch("additionalTaxes")

  const addTax = () => {
    form.setValue("additionalTaxes", [...additionalTaxes, { name: "", rate: 0, isEnabled: true }])
  }

  const removeTax = (index: number) => {
    const updatedTaxes = [...additionalTaxes]
    updatedTaxes.splice(index, 1)
    form.setValue("additionalTaxes", updatedTaxes)
  }

  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Tax & Currency Settings</h2>
        <p className="text-muted-foreground">Configure tax rates and currency display options.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tax Configuration</CardTitle>
              <CardDescription>Set up how taxes are calculated and displayed in your POS system.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="defaultTaxRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Tax Rate (%)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormDescription>The default tax rate applied to items.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="taxIncluded"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Tax Included in Prices</FormLabel>
                          <FormDescription>When enabled, displayed prices include tax.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="displayTaxOnReceipt"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Display Tax on Receipt</FormLabel>
                          <FormDescription>Show tax calculations on customer receipts.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Taxes</CardTitle>
              <CardDescription>Configure additional taxes or fees that may apply to orders.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {additionalTaxes.map((_, index) => (
                <div key={index} className="grid gap-4 rounded-lg border p-4 md:grid-cols-12">
                  <FormField
                    control={form.control}
                    name={`additionalTaxes.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="md:col-span-5">
                        <FormLabel>Tax Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., VAT, Service Fee" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`additionalTaxes.${index}.rate`}
                    render={({ field }) => (
                      <FormItem className="md:col-span-3">
                        <FormLabel>Rate (%)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`additionalTaxes.${index}.isEnabled`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-end space-x-3 md:col-span-3">
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel>Enabled</FormLabel>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTax(index)}
                          className="ml-auto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addTax} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Tax
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Currency Settings</CardTitle>
              <CardDescription>Configure how currency is displayed throughout the system.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="NGN">Nigerian Naira (NGN)</SelectItem>
                          <SelectItem value="GHS">Ghanaian Cedi (GHS)</SelectItem>
                          <SelectItem value="KES">Kenyan Shilling (KES)</SelectItem>
                          <SelectItem value="ZAR">South African Rand (ZAR)</SelectItem>
                          <SelectItem value="USD">US Dollar (USD)</SelectItem>
                          <SelectItem value="EUR">Euro (EUR)</SelectItem>
                          <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currencySymbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency Symbol</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., $, €, £" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currencyPosition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Symbol Position</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="before">Before amount (₦100)</SelectItem>
                          <SelectItem value="after">After amount (100₦)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="decimalPlaces"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Decimal Places</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select decimal places" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">0 (₦100)</SelectItem>
                          <SelectItem value="1">1 (₦100.0)</SelectItem>
                          <SelectItem value="2">2 (₦100.00)</SelectItem>
                          <SelectItem value="3">3 (₦100.000)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="thousandsSeparator"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thousands Separator</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select separator" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value=",">Comma (1,000)</SelectItem>
                          <SelectItem value=".">Period (1.000)</SelectItem>
                          <SelectItem value=" ">Space (1 000)</SelectItem>
                          <SelectItem value="">None (1000)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="decimalSeparator"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Decimal Separator</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select separator" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value=".">Period (100.00)</SelectItem>
                          <SelectItem value=",">Comma (100,00)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
