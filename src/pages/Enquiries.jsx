import { useEffect, useState } from 'react'
import axios from 'axios'
import styles from './Enquiries.module.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const headers = { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }

  useEffect(() => {
    axios
      .get(`${API_URL}/api/contact`, { headers })
      .then(res => setEnquiries(res.data))
      .catch(() => setError('Failed to load enquiries.'))
      .finally(() => setLoading(false))
  }, [])

  async function markRead(id) {
    try {
      await axios.patch(`${API_URL}/api/contact/${id}/read`, {}, { headers })
      setEnquiries(prev => prev.map(e => (e._id === id ? { ...e, read: true } : e)))
    } catch {
      alert('Failed to update enquiry.')
    }
  }

  return (
    <div>
      <h2 className={styles.heading}>Enquiries</h2>
      {loading && <p className={styles.msg}>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && enquiries.length === 0 && (
        <p className={styles.msg}>No enquiries yet.</p>
      )}
      {!loading && enquiries.length > 0 && (
        <div className={styles.list}>
          {enquiries.map(enq => (
            <div key={enq._id} className={`${styles.row} ${enq.read ? styles.read : ''}`}>
              <div className={styles.info}>
                <span className={styles.name}>{enq.name}</span>
                <a href={`mailto:${enq.email}`} className={styles.email}>{enq.email}</a>
                <p className={styles.message}>{enq.message}</p>
                <span className={styles.date}>
                  {enq.createdAt ? new Date(enq.createdAt).toLocaleDateString('en-ZA', { dateStyle: 'medium' }) : ''}
                </span>
              </div>
              {!enq.read && (
                <button className={styles.markBtn} onClick={() => markRead(enq._id)}>
                  Mark as Read
                </button>
              )}
              {enq.read && <span className={styles.readBadge}>Read</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
