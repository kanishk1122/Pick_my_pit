'use client'
import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Card } from 'primereact/card'
import "primereact/resources/themes/lara-dark-indigo/theme.css"; // Change to dark theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "remixicon/fonts/remixicon.css";
import "./globals.css";
import Sidebar from '../components/Sidebar';

const DonationPage = () => {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchDonations = async () => {
      try {
        // Simulated data - replace with actual API call
        const mockData = [
          { id: 1, donor: 'John Doe', amount: 100, date: '2024-01-15', purpose: 'Animal Food' },
          { id: 2, donor: 'Jane Smith', amount: 250, date: '2024-01-16', purpose: 'Medical Care' },
        ]
        setDonations(mockData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching donations:', error)
        setLoading(false)
      }
    }

    fetchDonations()
  }, [])

  const amountTemplate = (rowData) => {
    return `$${rowData.amount}`
  }

  return (
    <div className="p-4">
      <Card title="Donations">
        <DataTable
          value={donations}
          loading={loading}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          className="p-datatable-sm"
        >
          <Column field="id" header="ID" sortable />
          <Column field="donor" header="Donor Name" sortable />
          <Column field="amount" header="Amount" body={amountTemplate} sortable />
          <Column field="date" header="Date" sortable />
          <Column field="purpose" header="Purpose" sortable />
        </DataTable>
      </Card>
    </div>
  )
}

export { DonationPage }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Add any other font loading here */}
      </head>
      <body>
        <div className="flex h-screen bg-zinc-900">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}