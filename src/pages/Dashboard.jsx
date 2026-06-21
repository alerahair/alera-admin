import { useEffect, useState } from 'react'
import axios from 'axios'
import styles from './Dashboard.module.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Dashboard() {
  const [stats, setStats] = useState({ branches: 0, enquiries: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const token = localStorage.getItem('adminToken')
      const headers = { Authorization: `Bearer ${token}` }
      try {
        const [branchRes, enquiryRes] = await Promise.all([
          axios.get(`${API_URL}/api/branches`, { headers }),
          axios.get(`${API_URL}/api/contact`, { headers }),
        ])
        setStats({
          branches: branchRes.data?.length ?? 0,
          enquiries: enquiryRes.data?.length ?? 0,
        })
      } catch {
        // stats stay at 0 on error
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div>
      <h2 className={styles.heading}>Dashboard</h2>
      {loading ? (
        <p className={styles.loading}>Loading...</p>
      ) : (
        <div className={styles.grid}>
          <StatCard label="Total Branches" value={stats.branches} />
          <StatCard label="Contact Enquiries" value={stats.enquiries} />
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className={styles.card}>
      <span className={styles.value}>{value}</span>
      <span className={styles.label}>{label}</span>
    </div>
  )
}
