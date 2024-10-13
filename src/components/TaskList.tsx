import React from 'react';
import { List, Typography } from 'antd';
import { Task } from '../types';

const { Title, Text } = Typography;

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  return (
    <div className="task-list">
      <Title level={3}>已完成任务</Title>
      <List
        itemLayout="vertical"
        dataSource={tasks}
        renderItem={(task, index) => (
          <List.Item key={index}>
            <Title level={4}>{task.name} - {task.status}</Title>
            <Text>类别: {task.category}</Text>
            <br />
            <Text>标签: {task.tags.join(', ')}</Text>
            <br />
            <Text>开始: {new Date(task.startTime).toLocaleString()}</Text>
            <br />
            <Text>结束: {new Date(task.endTime).toLocaleString()}</Text>
            <br />
            <Text>详情: {task.details}</Text>
          </List.Item>
        )}
      />
    </div>
  );
};

export default TaskList;