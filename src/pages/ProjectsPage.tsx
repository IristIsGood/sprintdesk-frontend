import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

interface Project {
  id: number;
  name: string;
  description: string;
  ownerEmail: string;
  createdAt: string;
}

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');  // ← 提醒信息
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await client.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    // 空白检查 — 没填名字就提醒
    if (!newName.trim()) {
      setError('Please enter a project name before creating.');
      return;
    }
    setError('');
    try {
      await client.post('/projects', { name: newName, description: '' });
      setNewName('');
      fetchProjects();
    } catch (err) {
      console.error('Failed to create project');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>My Projects</h2>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      <div style={styles.createRow}>
        <input
          style={{
            ...styles.input,
            borderColor: error ? '#ef4444' : '#ddd',  // 报错时边框变红
          }}
          placeholder="New project name..."
          value={newName}
          onChange={(e) => {
            setNewName(e.target.value);
            if (e.target.value.trim()) setError(''); // 开始输入就清掉提醒
          }}
          onKeyDown={(e) => e.key === 'Enter' && createProject()}
        />
        <button style={styles.createBtn} onClick={createProject}>
          + Create
        </button>
      </div>

      {/* 空白提醒 */}
      {error && <p style={styles.errorMsg}>{error}</p>}

      <div style={styles.grid}>
        {projects.map((project) => (
          <div
            key={project.id}
            style={styles.card}
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            <h3 style={styles.projectName}>{project.name}</h3>
            <p style={styles.projectDesc}>
              {project.description || 'No description'}
            </p>
            <p style={styles.projectMeta}>Created: {project.createdAt}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '2rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  title: { margin: 0, fontSize: '22px' },
  logoutBtn: { padding: '6px 14px', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', background: 'white' },
  createRow: { display: 'flex', gap: '10px', marginBottom: '8px' },
  input: { flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', transition: 'border-color 0.2s' },
  createBtn: { padding: '8px 16px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  errorMsg: { color: '#ef4444', fontSize: '13px', margin: '0 0 12px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px', marginTop: '1rem' },
  card: { background: 'white', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e5e7eb', cursor: 'pointer' },
  projectName: { margin: '0 0 8px', fontSize: '16px' },
  projectDesc: { fontSize: '13px', color: '#666', margin: '0 0 8px' },
  projectMeta: { fontSize: '12px', color: '#999', margin: 0 },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' },
};

export default ProjectsPage;