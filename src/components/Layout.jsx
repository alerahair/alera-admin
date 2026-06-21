import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import styles from './Layout.module.css'

export default function Layout() {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('adminToken')
    navigate('/login')
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>Alera Admin</div>
        <nav className={styles.nav}>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? styles.active : ''}>
            Dashboard
          </NavLink>
          <NavLink to="/branches" className={({ isActive }) => isActive ? styles.active : ''}>
            Branches
          </NavLink>
          <NavLink to="/enquiries" className={({ isActive }) => isActive ? styles.active : ''}>
            Enquiries
          </NavLink>
        </nav>
        <button className={styles.logout} onClick={handleLogout}>Logout</button>
      </aside>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
