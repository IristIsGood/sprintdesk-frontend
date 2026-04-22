import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import client from '../api/client';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  projectId: number;
}

const COLUMNS = ['TODO', 'IN_PROGRESS', 'DONE'];
const COLUMN_LABELS: Record<string, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};
const COLUMN_COLORS: Record<string, string> = {
  TODO: '#f1f5f9',
  IN_PROGRESS: '#fffbeb',
  DONE: '#f0fdf4',
};
const PRIORITY_COLORS: Record<string, string> = {
  HIGH: '#fee2e2',
  MEDIUM: '#fef9c3',
  LOW: '#dcfce7',
};
const PRIORITY_TEXT_COLORS: Record<string, string> = {
  HIGH: '#dc2626',
  MEDIUM: '#d97706',
  LOW: '#16a34a',
};

const BoardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState('MEDIUM'); // ← 优先级选择
  const [taskError, setTaskError] = useState('');           // ← 空白提醒
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchTasks = async () => {
    try {
      const res = await client.get(`/projects/${id}/tasks?page=0&size=50`);
      setTasks(res.data.content || []);
    } catch (err) {
      console.error('Failed to fetch tasks');
    }
  };

  const createTask = async () => {
    // 空白检查
    if (!newTitle.trim()) {
      setTaskError('Please enter a task title before adding.');
      return;
    }
    setTaskError('');
    try {
      await client.post(`/projects/${id}/tasks`, {
        title: newTitle,
        description: '',
        priority: newPriority,
      });
      setNewTitle('');
      setNewPriority('MEDIUM');
      fetchTasks();
    } catch (err) {
      console.error('Failed to create task');
    }
  };

  const updateStatus = async (taskId: number, newStatus: string) => {
    try {
      await client.patch(`/tasks/${taskId}/status?status=${newStatus}`);
      fetchTasks();
    } catch (err) {
      console.error('Failed to update status');
    }
  };

  // 拖拽结束时触发
  // result.source = 拖哪里来的
  // result.destination = 放到哪里
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // 放到原来的地方或者放到外面 — 不做任何操作
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const taskId = parseInt(draggableId);
    const newStatus = destination.droppableId;

    // 乐观更新 — 先在前端改状态，再发请求到后端
    // 好处：用户感觉即时响应，不需要等 API 返回
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    updateStatus(taskId, newStatus);
  };

  const getTasksByStatus = (status: string) =>
    tasks.filter((t) => t.status === status);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/projects')}>
          ← Back
        </button>
        <h2 style={styles.title}>Project Board</h2>
      </div>

      {/* 新增任务 — 加优先级下拉选择 */}
      <div style={styles.createRow}>
        <input
          style={{
            ...styles.input,
            borderColor: taskError ? '#ef4444' : '#ddd',
          }}
          placeholder="New task title..."
          value={newTitle}
          onChange={(e) => {
            setNewTitle(e.target.value);
            if (e.target.value.trim()) setTaskError('');
          }}
          onKeyDown={(e) => e.key === 'Enter' && createTask()}
        />

        {/* 优先级下拉 */}
        <select
          style={styles.select}
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value)}
        >
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        <button style={styles.createBtn} onClick={createTask}>
          + Add Task
        </button>
      </div>

      {/* 空白提醒 */}
      {taskError && <p style={styles.errorMsg}>{taskError}</p>}

      {/* 看板 — 用 DragDropContext 包住整个看板 */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={styles.board}>
          {COLUMNS.map((col) => (
            // Droppable — 每一列是一个放置区域
            // droppableId 就是状态名，拖放结束时用来识别目标列
            <Droppable droppableId={col} key={col}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    ...styles.column,
                    backgroundColor: snapshot.isDraggingOver
                      ? '#e0e7ff'  // 拖拽悬停时列变蓝
                      : COLUMN_COLORS[col],
                    transition: 'background-color 0.2s',
                  }}
                >
                  <div style={styles.columnHeader}>
                    <span>{COLUMN_LABELS[col]}</span>
                    <span style={styles.count}>
                      {getTasksByStatus(col).length}
                    </span>
                  </div>

                  {getTasksByStatus(col).map((task, index) => (
                    // Draggable — 每张卡片可以拖动
                    // draggableId 用 task.id 转成字符串
                    <Draggable
                      key={task.id}
                      draggableId={String(task.id)}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...styles.taskCard,
                            backgroundColor: snapshot.isDragging
                              ? '#e0e7ff'  // 拖动中卡片变蓝
                              : PRIORITY_COLORS[task.priority] || 'white',
                            boxShadow: snapshot.isDragging
                              ? '0 4px 12px rgba(0,0,0,0.15)'
                              : 'none',
                            ...provided.draggableProps.style,
                          }}
                        >
                          <p style={styles.taskTitle}>{task.title}</p>
                          <div style={styles.taskMeta}>
                            <span style={{
                              ...styles.priorityBadge,
                              color: PRIORITY_TEXT_COLORS[task.priority],
                              backgroundColor: PRIORITY_COLORS[task.priority],
                            }}>
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {/* 占位符 — 拖动时保持列的高度 */}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '2rem' },
  header: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' },
  backBtn: { padding: '6px 12px', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', background: 'white' },
  title: { margin: 0, fontSize: '20px' },
  createRow: { display: 'flex', gap: '10px', marginBottom: '8px' },
  input: { flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' },
  select: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', cursor: 'pointer', backgroundColor: 'white' },
  createBtn: { padding: '8px 16px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  errorMsg: { color: '#ef4444', fontSize: '13px', margin: '0 0 12px' },
  board: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  column: { borderRadius: '8px', padding: '12px', minHeight: '400px' },
  columnHeader: { display: 'flex', justifyContent: 'space-between', fontWeight: 600, marginBottom: '12px', fontSize: '14px' },
  count: { background: '#e5e7eb', borderRadius: '10px', padding: '2px 8px', fontSize: '12px' },
  taskCard: { padding: '10px', borderRadius: '6px', marginBottom: '8px', border: '1px solid #e5e7eb', cursor: 'grab', userSelect: 'none' },
  taskTitle: { margin: '0 0 8px', fontSize: '13px', fontWeight: 500 },
  taskMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  priorityBadge: { fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '10px' },
};

export default BoardPage;