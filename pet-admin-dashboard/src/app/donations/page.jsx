'use client'
import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Chart } from 'primereact/chart'
import { Tag } from 'primereact/tag'
import { Avatar } from 'primereact/avatar'
import { Button } from 'primereact/button'
import StatsCard from '../../components/StatsCard'

const DonationPage = () => {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState({})
  const [metrics, setMetrics] = useState({
    totalDonations: 0,
    averageDonation: 0,
    monthlyGrowth: 0,
    totalDonors: 0
  })

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        // Simulated data
        const mockData = [
          { id: 1, donor: 'John Doe', amount: 100, date: '2024-01-15', purpose: 'Animal Food' },
          { id: 2, donor: 'Jane Smith', amount: 250, date: '2024-01-16', purpose: 'Medical Care' },
          { id: 3, donor: 'Bob Wilson', amount: 500, date: '2024-01-17', purpose: 'Shelter' },
          { id: 4, donor: 'Alice Brown', amount: 150, date: '2024-01-18', purpose: 'Medical Care' },
        ]
        setDonations(mockData)
        calculateMetrics(mockData)
        prepareChartData(mockData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching donations:', error)
        setLoading(false)
      }
    }

    fetchDonations()
  }, [])

  const calculateMetrics = (data) => {
    const total = data.reduce((sum, donation) => sum + donation.amount, 0)
    const average = total / data.length
    setMetrics({
      totalDonations: total,
      averageDonation: average.toFixed(2),
      monthlyGrowth: '+15%', // Mock growth rate
      totalDonors: new Set(data.map(d => d.donor)).size
    })
  }

  const prepareChartData = (data) => {
    const chartData = {
      labels: ['Medical Care', 'Animal Food', 'Shelter', 'Other'],
      datasets: [
        {
          data: [40, 30, 20, 10],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
        }
      ]
    }
    setChartData(chartData)
  }

  const statusTemplate = (donation) => {
    const getStatusColor = (amount) => {
      if (amount >= 500) return 'success'
      if (amount >= 200) return 'warning'
      return 'info'
    }
    return <Tag value={`$${donation.amount}`} severity={getStatusColor(donation.amount)} />
  }

  const donorTemplate = (donation) => {
    return (
      <div className="flex items-center gap-3">
        <Avatar
          image={`https://api.dicebear.com/7.x/initials/svg?seed=${donation.donor}`}
          size="large"
          shape="circle"
          className="border-2 border-zinc-700"
        />
        <div>
          <div className="text-white font-medium">{donation.donor}</div>
          <div className="text-zinc-400 text-sm">{donation.email || 'No email provided'}</div>
        </div>
      </div>
    )
  }

  const dateTemplate = (donation) => {
    const date = new Date(donation.date)
    return (
      <div className="flex flex-col">
        <span className="text-white">{date.toLocaleDateString()}</span>
        <span className="text-zinc-400 text-sm">{date.toLocaleTimeString()}</span>
      </div>
    )
  }

  const actionTemplate = () => {
    return (
      <div className="flex items-center gap-3 justify-center">
        <Button 
          className="p-button-sm p-button-text"
          tooltip="View Details"
          tooltipOptions={{ position: 'top' }}
          icon={
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
        />
        <Button 
          className="p-button-sm p-button-text"
          tooltip="Download Receipt"
          tooltipOptions={{ position: 'top' }}
          icon={
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <Button 
          className="p-button-sm p-button-text"
          tooltip="Send Thank You"
          tooltipOptions={{ position: 'top' }}
          icon={
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
      </div>
    )
  }

  const ExportIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  )

  const FilterIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Donations Overview
          </h1>
          <p className="text-zinc-400 mt-1">Track and manage all donations in one place.</p>
        </div>
        <button className="btn-bordered">
          <ExportIcon />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Donations"
          value={`$${metrics.totalDonations}`}
          trend="+14.5%"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="text-emerald-400"
        />
        <StatsCard
          title="Average Donation"
          value={`$${metrics.averageDonation}`}
          trend="+5.75%"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
          color="text-blue-400"
        />
        <StatsCard
          title="Monthly Growth"
          value={metrics.monthlyGrowth}
          trend="+28.4%"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
          color="text-purple-400"
        />
        <StatsCard
          title="Total Donors"
          value={metrics.totalDonors}
          trend="+12.5%"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          color="text-amber-400"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1 md:col-span-3 bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-xl backdrop-blur-sm hover:bg-zinc-800/30 transition-all duration-200">
          <Chart type="line" 
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [{
                label: 'Donations',
                data: [650, 590, 800, 810, 960, 1000],
                fill: true,
                borderColor: '#4BC0C0',
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                tension: 0.4
              }]
            }} 
            options={{
              responsive: true,
              plugins: {
                legend: { labels: { color: '#ffffff' } }
              },
              scales: {
                x: {
                  grid: { color: 'rgba(255, 255, 255, 0.1)' },
                  ticks: { color: '#ffffff' }
                },
                y: {
                  grid: { color: 'rgba(255, 255, 255, 0.1)' },
                  ticks: { color: '#ffffff' }
                }
              }
            }} 
          />
        </div>

        <div className="bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-xl backdrop-blur-sm hover:bg-zinc-800/30 transition-all duration-200">
          <Chart type="doughnut" data={chartData} options={{
            responsive: true,
            plugins: {
              legend: { labels: { color: '#ffffff' } }
            }
          }} />
        </div>
      </div>

      <div className="bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-xl backdrop-blur-sm hover:bg-zinc-800/30 transition-all duration-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Recent Donations</h2>
          <div className="flex gap-2">
            <button className="btn-icon">
              <FilterIcon />
            </button>
            <button className="btn-icon">
              <ExportIcon />
            </button>
          </div>
        </div>
        <DataTable
          value={donations}
          loading={loading}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25]}
          className="border-zinc-800 border rounded-lg overflow-hidden `"
          stripedRows
          showGridlines
          responsiveLayout="scroll"
          emptyMessage="No donations found"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} donations"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          pt={{
            
            table: { className: 'border-spacing-0' },
            header: { className: 'p-4 bg-zinc-900/50' },
          }}
        >
          <Column 
            field="donor" 
            header="Donor" 
            body={donorTemplate} 
            sortable 
            style={{ minWidth: '250px', padding: '1rem 1.5rem' }}
          />
          <Column 
            field="amount" 
            header="Amount" 
            body={statusTemplate} 
            sortable 
            style={{ minWidth: '150px', padding: '1rem 1.5rem' }}
          />
          <Column 
            field="purpose" 
            header="Purpose" 
            sortable 
            style={{ minWidth: '150px', padding: '1rem 1.5rem' }}
          />
          <Column 
            field="date" 
            header="Date" 
            body={dateTemplate} 
            sortable 
            style={{ minWidth: '200px', padding: '1rem 1.5rem' }}
          />
          <Column 
            body={actionTemplate} 
            header="Actions" 
            headerStyle={{ textAlign: 'center' }}
            style={{ 
              minWidth: '180px', 
              padding: '1rem',
              textAlign: 'center'
            }}
          />
        </DataTable>
      </div>
    </div>
  )
}

export default DonationPage
