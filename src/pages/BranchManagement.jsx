import { useEffect, useState } from 'react'
import axios from 'axios'
import styles from './BranchManagement.module.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function BranchManagement() {
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ phone: '', email: '' })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)

  const headers = { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }

  useEffect(() => {
    axios
      .get(`${API_URL}/api/branches`, { headers })
      .then(res => setBranches(res.data))
      .catch(() => setError('Failed to load branches.'))
      .finally(() => setLoading(false))
  }, [])

  function openEdit(branch) {
    setEditingId(branch._id)
    setEditForm({ phone: branch.phone || '', email: branch.email || '' })
    setSaveError('')
    setSaveSuccess(false)
  }

  function closeEdit() {
    setEditingId(null)
    setSaveError('')
    setSaveSuccess(false)
  }

  function handleEditChange(e) {
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSave(id) {
    setSaving(true)
    setSaveError('')
    setSaveSuccess(false)
    try {
      const { data } = await axios.put(
        `${API_URL}/api/branches/${id}`,
        { phone: editForm.phone, email: editForm.email },
        { headers }
      )
      setBranches(prev => prev.map(b => (b._id === id ? { ...b, ...data } : b)))
      setSaveSuccess(true)
      setTimeout(() => {
        setEditingId(null)
        setSaveSuccess(false)
      }, 900)
    } catch {
      setSaveError('Failed to save changes.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h2 className={styles.heading}>Branch Management</h2>
      {loading && <p className={styles.msg}>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && branches.length === 0 && (
        <p className={styles.msg}>No branches found.</p>
      )}
      {!loading && branches.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Branch Name</th>
                <th>Address</th>
                <th>Province</th>
                <th>Contact Number</th>
                <th>Email</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {branches.map(branch => (
                <>
                  <tr key={branch._id}>
                    <td>{branch.name}</td>
                    <td>{branch.address}</td>
                    <td>{branch.province || '—'}</td>
                    <td>{branch.phone || '—'}</td>
                    <td>{branch.email || '—'}</td>
                    <td>
                      <button
                        className={styles.editBtn}
                        onClick={() => editingId === branch._id ? closeEdit() : openEdit(branch)}
                      >
                        {editingId === branch._id ? 'Cancel' : 'Edit'}
                      </button>
                    </td>
                  </tr>
                  {editingId === branch._id && (
                    <tr key={`${branch._id}-edit`} className={styles.editRow}>
                      <td colSpan={6}>
                        <div className={styles.editForm}>
                          <label className={styles.editLabel}>
                            Contact Number
                            <input
                              type="text"
                              name="phone"
                              value={editForm.phone}
                              onChange={handleEditChange}
                              className={styles.editInput}
                              placeholder="e.g. +27 11 000 0000"
                            />
                          </label>
                          <label className={styles.editLabel}>
                            Email
                            <input
                              type="email"
                              name="email"
                              value={editForm.email}
                              onChange={handleEditChange}
                              className={styles.editInput}
                              placeholder="branch@example.com"
                            />
                          </label>
                          <div className={styles.editActions}>
                            {saveError && <span className={styles.saveError}>{saveError}</span>}
                            {saveSuccess && <span className={styles.saveOk}>Saved!</span>}
                            <button
                              className={styles.saveBtn}
                              onClick={() => handleSave(branch._id)}
                              disabled={saving}
                            >
                              {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
