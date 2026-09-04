# Lucid Cash Point

Lucid Cash Point is a legacy restaurant Point of Sale (POS) and management system prototype originally built in June 2025.

## What it explores

- Restaurant dashboard and daily activity
- Order entry and cart workflows
- Kitchen and order management flows
- Inventory tracking and low-stock alerts
- Reporting and operational settings
- African payment-provider integration experiments

## Technology

Next.js, React, TypeScript, Tailwind CSS, Radix UI, and pnpm.

## Run locally

```sh
pnpm install
pnpm dev
```

Then open the local development URL shown by Next.js.

## GitHub Pages demo

This repository includes a GitHub Actions workflow for a static GitHub Pages demo. The normal application configuration is preserved for server-capable deployments.

The Pages build enables Next.js static export and temporarily excludes the legacy server-side payment verification routes because GitHub Pages serves static files only.

The source payment handlers remain in the repository and are not deleted or modified by the Pages workflow.

## Portfolio status

Lucid is presented as a legacy product prototype in the Ayo Richard Abe portfolio. The current goal is to preserve the original work, improve its presentation, and make a safe static demonstration available for portfolio review.
