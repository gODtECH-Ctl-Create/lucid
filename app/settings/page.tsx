import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GeneralSettingsForm } from "@/components/settings/general-settings-form"
import { AppearanceForm } from "@/components/settings/appearance-form"
import { NotificationsForm } from "@/components/settings/notifications-form"

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your restaurant settings",
}

export default function SettingsPage() {
  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your restaurant settings and preferences.</p>
      </div>
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure general settings for your restaurant POS system.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <GeneralSettingsForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of your POS system.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <AppearanceForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <NotificationsForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
