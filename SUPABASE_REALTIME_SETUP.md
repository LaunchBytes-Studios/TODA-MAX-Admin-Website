# Supabase Real-Time Notifications Setup Guide

## Overview

This document outlines the setup for Supabase real-time notifications on the ordering page. The system will display toast notifications when new orders are created.

## What Was Implemented

### 1. Created Supabase Client (`src/lib/supabaseClient.ts`)

- Initializes Supabase client with your project credentials
- Reads environment variables: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### 2. Updated `useOrders` Hook (`src/hooks/ordering/useOrders.ts`)

- Added real-time subscription to the `Order` table
- Listens for INSERT events (new orders)
- Displays toast notification when new orders arrive
- Automatically refreshes the orders list
- Properly cleans up subscriptions on unmount

## Setup Steps

### Step 1: Install Supabase Client

Run this command in the admin website folder:

```bash
npm install @supabase/supabase-js
```

### Step 2: Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Project Settings → API
4. Copy:
   - Project URL (under "Project URL")
   - Public Anon Key (under "Your API Key")

### Step 3: Update `.env` File

Add the following environment variables to `.env`:

```env
VITE_API_URL=http://localhost:3000

# Supabase Configuration
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Example:

```env
VITE_SUPABASE_URL=https://abcdefghijk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: Enable Real-Time in Supabase

1. Go to your Supabase Dashboard
2. Navigate to Database → Replication
3. Enable replication for the `Order` table
4. Make sure "INSERT" is checked

### Step 5: Verify Backend Configuration

The backend (TODA-MAX-Backend-Service) should have Supabase already configured in `src/config/db.ts`.

## How It Works

### Real-Time Flow

1. Admin opens the ordering page
2. `useOrders` hook initializes and sets up a Supabase real-time subscription
3. When a new order is inserted in Supabase:
   - Real-time event is triggered
   - Toast notification appears with order details
   - Orders list is automatically refreshed
4. On page close, subscription is cleaned up

### Toast Notification Display

When a new order arrives, users see:

```
✅ New Order Received!
Order #XXXXX from patient
```

## Features

- **Automatic Refresh**: Orders list updates immediately when new orders arrive
- **Toast Notifications**: Visual feedback with order information
- **Proper Cleanup**: Subscription is properly removed when component unmounts
- **Error Handling**: Subscription errors are logged to console

## Testing

To test the real-time functionality:

1. **Option A - Mobile/Web App**: Create an order through the patient app
2. **Option B - Direct Database Insert**: Insert a test order directly into the Supabase `Order` table
3. Observe the admin website for the toast notification and order list update

## Troubleshooting

### I don't see toast notifications

1. Verify `.env` variables are set correctly
2. Check browser console for errors
3. Ensure the Order table realtime is enabled in Supabase
4. Check that you're using the anon key (not service role key)

### Connection errors

```
"Missing Supabase environment variables"
```

- Make sure both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are in `.env`
- Restart the dev server after adding environment variables

### No real-time updates

1. Check Supabase Dashboard → Database → Replication
2. Ensure `Order` table is enabled for replication
3. Verify INSERT events are checked

## Files Modified/Created

- ✅ Created: `src/lib/supabaseClient.ts` - Supabase client configuration
- ✅ Updated: `src/hooks/ordering/useOrders.ts` - Added real-time subscription
- ⚠️ To Update: `.env` - Add Supabase credentials

## Dependencies Added

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.x.x"
  }
}
```

## Notes

- The real-time subscription uses Supabase's broadcast feature
- Only INSERT events for new orders are monitored
- Toast notifications appear for 5 seconds
- The hook automatically fetches updated order details when new orders arrive
