import { useEffect, useState } from 'react'
import axios from 'axios'
import styles from './Branches.module.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Branches() {
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const headers = { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }

  useEffect(() => {
    axios
      .get(`${API_URL}/api/branches`, { headers })
      .then(res => setBranches(res.data))
      .catch(() => setError('Failed to load branches.'))
      .finally(() => setLoading(false))
  }, [])

  async function toggleActive(id, current) {
    try {
      const { data } = await axios.patch(
        `${API_URL}/api/branches/${id}`,
        { active: !current },
        { headers }
      )
      setBranches(prev => prev.map(b => (b._id === id ? { ...b, active: data.active } : b)))
    } catch {
      alert('Failed to update branch.')
    }
  }

  return (
    <div>
      <h2 className={styles.heading}>Branches</h2>
      {loading && <p className={styles.msg}>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && branches.length === 0 && (
        <p className={styles.msg}>No branches found.</p>
      )}
      {!loading && branches.length > 0 && (
        <div className={styles.list}>
          {branches.map(branch => (
            <div key={branch._id} className={styles.row}>
              <div className={styles.info}>
                <span className={styles.name}>{branch.name}</span>
                <span className={styles.address}>{branch.address}</span>
              </div>
              <button
                className={`${styles.toggle} ${branch.active ? styles.active : styles.inactive}`}
                onClick={() => toggleActive(branch._id, branch.active)}
              >
                {branch.active ? 'Active' : 'Inactive'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
