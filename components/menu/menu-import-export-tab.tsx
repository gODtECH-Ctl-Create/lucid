"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Download, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function MenuImportExportTab() {
  const [isImporting, setIsImporting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle")

  const handleExport = async (format: "csv" | "json") => {
    setIsExporting(true)

    // Simulate export process
    setTimeout(() => {
      setIsExporting(false)
      toast({
        title: "Export completed",
        description: `Menu data has been exported as ${format.toUpperCase()}.`,
      })

      // In a real app, this would trigger a file download
      const filename = `menu-export-${new Date().toISOString().split("T")[0]}.${format}`
      console.log(`Exporting as: ${filename}`)
    }, 2000)
  }

  const handleImport = async (file: File) => {
    setIsImporting(true)
    setImportStatus("idle")

    // Simulate import process
    setTimeout(() => {
      setIsImporting(false)

      // Simulate random success/error for demo
      const success = Math.random() > 0.3

      if (success) {
        setImportStatus("success")
        toast({
          title: "Import successful",
          description: "Menu data has been imported successfully.",
        })
      } else {
        setImportStatus("error")
        toast({
          title: "Import failed",
          description: "There was an error importing the menu data.",
          variant: "destructive",
        })
      }
    }, 3000)
  }

  const downloadTemplate = (format: "csv" | "json") => {
    toast({
      title: "Template downloaded",
      description: `${format.toUpperCase()} template has been downloaded.`,
    })

    // In a real app, this would trigger a template file download
    console.log(`Downloading ${format} template`)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Export Menu Data</CardTitle>
          <CardDescription>
            Download your current menu data in various formats for backup or external use.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium">CSV Format</h4>
              <p className="text-sm text-muted-foreground">
                Export as CSV for use in spreadsheet applications like Excel or Google Sheets.
              </p>
              <Button onClick={() => handleExport("csv")} disabled={isExporting} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                {isExporting ? "Exporting..." : "Export as CSV"}
              </Button>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">JSON Format</h4>
              <p className="text-sm text-muted-foreground">
                Export as JSON for technical integrations or backup purposes.
              </p>
              <Button onClick={() => handleExport("json")} disabled={isExporting} variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                {isExporting ? "Exporting..." : "Export as JSON"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Import Menu Data</CardTitle>
          <CardDescription>Upload menu data from a CSV or JSON file to bulk add or update items.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {importStatus === "success" && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Import Successful</AlertTitle>
              <AlertDescription>
                Your menu data has been imported successfully. All items have been added or updated.
              </AlertDescription>
            </Alert>
          )}

          {importStatus === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Import Failed</AlertTitle>
              <AlertDescription>
                There was an error importing your menu data. Please check the file format and try again.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="menu-file">Select File</Label>
              <Input
                id="menu-file"
                type="file"
                accept=".csv,.json"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handleImport(file)
                  }
                }}
                disabled={isImporting}
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-2">Supported formats: CSV, JSON (Max file size: 10MB)</p>
            </div>

            {isImporting && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                Importing menu data...
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Download Templates</CardTitle>
          <CardDescription>Download template files to see the required format for importing menu data.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <h4 className="font-medium">CSV Template</h4>
              </div>
              <p className="text-sm text-muted-foreground">Template with all required columns and sample data.</p>
              <Button onClick={() => downloadTemplate("csv")} variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download CSV Template
              </Button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <h4 className="font-medium">JSON Template</h4>
              </div>
              <p className="text-sm text-muted-foreground">Template with proper JSON structure and sample data.</p>
              <Button onClick={() => downloadTemplate("json")} variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download JSON Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Import Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Required Fields</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  • <strong>Name:</strong> Item name (required)
                </li>
                <li>
                  • <strong>Description:</strong> Item description (required)
                </li>
                <li>
                  • <strong>Price:</strong> Item price in decimal format (required)
                </li>
                <li>
                  • <strong>Category:</strong> Category name (required)
                </li>
                <li>
                  • <strong>Available:</strong> true/false for availability (optional, defaults to true)
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Optional Fields</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  • <strong>Preparation Time:</strong> Time in minutes
                </li>
                <li>
                  • <strong>Calories:</strong> Nutritional information
                </li>
                <li>
                  • <strong>Allergens:</strong> Comma-separated list
                </li>
                <li>
                  • <strong>Image URL:</strong> Link to item image
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
