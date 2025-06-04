"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Upload } from "lucide-react"

const restaurantFormSchema = z.object({
  name: z.string().min(2, {
    message: "Restaurant name must be at least 2 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "State must be at least 2 characters.",
  }),
  country: z.string().min(2, {
    message: "Country must be at least 2 characters.",
  }),
  zipCode: z.string().min(3, {
    message: "Zip code must be at least 3 characters.",
  }),
  phone: z.string().min(5, {
    message: "Phone number must be at least 5 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  website: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
  taxId: z.string().optional(),
  businessType: z.string(),
  description: z.string().optional(),
})

type RestaurantFormValues = z.infer<typeof restaurantFormSchema>

const defaultValues: Partial<RestaurantFormValues> = {
  name: "Tasty Bites Restaurant",
  address: "123 Main Street",
  city: "Lagos",
  state: "Lagos State",
  country: "Nigeria",
  zipCode: "100001",
  phone: "+234 800 123 4567",
  email: "contact@tastybites.com",
  website: "https://tastybites.com",
  taxId: "1234567890",
  businessType: "restaurant",
  description: "A family-friendly restaurant serving delicious meals.",
}

export default function RestaurantSettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [logoUrl, setLogoUrl] = useState("/placeholder.svg?height=100&width=100")

  const form = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantFormSchema),
    defaultValues,
  })

  function onSubmit(data: RestaurantFormValues) {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Restaurant information updated",
        description: "Your restaurant information has been successfully updated.",
      })
      console.log(data)
    }, 1000)
  }

  const handleLogoUpload = () => {
    // In a real app, this would open a file picker and upload the image
    toast({
      title: "Logo upload",
      description: "This would open a file picker in a real application.",
    })
  }

  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Restaurant Information</h2>
        <p className="text-muted-foreground">Manage your restaurant details and business information.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Restaurant Logo</CardTitle>
            <CardDescription>
              Upload your restaurant logo. This will appear on receipts and the POS interface.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <div className="relative h-32 w-32 overflow-hidden rounded-lg border">
              <img src={logoUrl || "/placeholder.svg"} alt="Restaurant logo" className="h-full w-full object-cover" />
            </div>
            <Button onClick={handleLogoUpload} className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Upload Logo
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Enter your restaurant's basic information.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Restaurant Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter restaurant name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="businessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select business type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="restaurant">Restaurant</SelectItem>
                          <SelectItem value="cafe">Café</SelectItem>
                          <SelectItem value="fastfood">Fast Food</SelectItem>
                          <SelectItem value="bar">Bar</SelectItem>
                          <SelectItem value="foodtruck">Food Truck</SelectItem>
                        </SelectContent>
                      </Select>
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
                        <Textarea
                          placeholder="Brief description of your restaurant"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Enter your restaurant's contact and location details.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Street address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province</FormLabel>
                        <FormControl>
                          <Input placeholder="State or province" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal/Zip Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Postal or zip code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Phone number" {...field} />
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
                          <Input placeholder="Email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="taxId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax ID / VAT Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Tax ID or VAT number" {...field} />
                        </FormControl>
                        <FormDescription>This will appear on receipts and invoices.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
