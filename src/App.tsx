import React, { useState, useEffect } from 'react';
import { Layout, Typography, Space, Button } from 'antd';
import './App.css';
import PomodoroTimer from './components/PomodoroTimer';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { Task } from './types';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  useEffect(() => {
    chrome.storage.local.get(['tasks'], (result) => {
      if (result.tasks) {
        setTasks(result.tasks);
      }
    });
  }, []);

  const saveTask = (task: Task) => {
    const taskIndex = tasks.findIndex(t => t.id === task.id);
    let updatedTasks: Task[];
    
    if (taskIndex !== -1) {
      // Update existing task
      updatedTasks = [...tasks];
      updatedTasks[taskIndex] = task;
    } else {
      // Add new task
      updatedTasks = [...tasks, task];
    }
    
    setTasks(updatedTasks);
    chrome.storage.local.set({ tasks: updatedTasks });
    setCurrentTask(null);
  };

  const exportTasks = (format: 'json' | 'csv') => {
    let content: string;
    let mimeType: string;
    let filename: string;

    if (format === 'json') {
      content = JSON.stringify(tasks, null, 2);
      mimeType = 'application/json';
      filename = 'pomodoro_tasks.json';
    } else {
      const header = 'ID,Name,Category,Tags,Details,Start Time,End Time,Status\n';
      const csvContent = tasks.map(task => 
        `"${task.id}","${task.name}","${task.category}","${task.tags.join(';')}","${task.details}","${task.startTime}","${task.endTime}","${task.status}"`
      ).join('\n');
      content = header + csvContent;
      mimeType = 'text/csv';
      filename = 'pomodoro_tasks.csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    chrome.downloads.download({
      url: url,
      filename: filename,
      saveAs: true
    });
  };

  return (
    <Layout className="App">
      <Header>
        <Title level={2} style={{ color: 'white', margin: 0 }}>番茄工作助手</Title>
      </Header>
      <Content style={{ padding: '20px' }}>
        <PomodoroTimer currentTask={currentTask} setCurrentTask={setCurrentTask} />
        <TaskForm saveTask={saveTask} currentTask={currentTask} />
        <TaskList tasks={tasks} />
        <Space>
          <Button onClick={() => exportTasks('json')}>导出 JSON</Button>
          <Button onClick={() => exportTasks('csv')}>导出 CSV</Button>
        </Space>
      </Content>
    </Layout>
  );
}

export default App;