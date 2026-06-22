import { useEffect, useState } from 'react'
import axios from 'axios'
import styles from './LegalDocuments.module.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const DOCS = [
  { type: 'privacy-policy', label: 'Privacy Policy' },
  { type: 'terms-of-service', label: 'Terms of Service' },
  { type: 'cookie-policy', label: 'Cookie Policy' },
]

export default function LegalDocuments() {
  const [contents, setContents] = useState({
    'privacy-policy': '',
    'terms-of-service': '',
    'cookie-policy': '',
  })
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState({})

  const headers = { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }

  useEffect(() => {
    async function fetchAll() {
      try {
        const results = await Promise.allSettled(
          DOCS.map(doc => axios.get(`${API_URL}/api/legal/${doc.type}`, { headers }))
        )
        const updated = { ...contents }
        results.forEach((result, i) => {
          if (result.status === 'fulfilled') {
            updated[DOCS[i].type] = result.value.data?.content ?? ''
          }
        })
        setContents(updated)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  function handleChange(type, value) {
    setContents(prev => ({ ...prev, [type]: value }))
  }

  async function handleSave(type) {
    setStatus(prev => ({ ...prev, [type]: 'saving' }))
    try {
      await axios.put(`${API_URL}/api/legal/${type}`, { content: contents[type] }, { headers })
      setStatus(prev => ({ ...prev, [type]: 'saved' }))
      setTimeout(() => setStatus(prev => ({ ...prev, [type]: '' })), 2000)
    } catch {
      setStatus(prev => ({ ...prev, [type]: 'error' }))
    }
  }

  return (
    <div>
      <h2 className={styles.heading}>Legal Documents</h2>
      {loading ? (
        <p className={styles.msg}>Loading...</p>
      ) : (
        <div className={styles.docList}>
          {DOCS.map(doc => (
            <div key={doc.type} className={styles.docCard}>
              <h3 className={styles.docTitle}>{doc.label}</h3>
              <textarea
                className={styles.textarea}
                value={contents[doc.type]}
                onChange={e => handleChange(doc.type, e.target.value)}
                rows={14}
                placeholder={`Enter ${doc.label} content...`}
              />
              <div className={styles.footer}>
                {status[doc.type] === 'error' && (
                  <span className={styles.err}>Failed to save.</span>
                )}
                {status[doc.type] === 'saved' && (
                  <span className={styles.ok}>Saved!</span>
                )}
                <button
                  className={styles.saveBtn}
                  onClick={() => handleSave(doc.type)}
                  disabled={status[doc.type] === 'saving'}
                >
                  {status[doc.type] === 'saving' ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
