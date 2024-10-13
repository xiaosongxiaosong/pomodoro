import React, { useState, useEffect } from 'react';
import { Button, Typography, Space } from 'antd';
import { format } from 'date-fns';
import { Task } from '../types';
import TickSound from './TickSound';

const { Title, Text } = Typography;

interface PomodoroTimerProps {
  currentTask: Task | null;
  setCurrentTask: (task: Task | null) => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ currentTask, setCurrentTask }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      if (!isBreak) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icon48.png',
          title: '番茄钟完成',
          message: '是时候休息一下了！',
          buttons: [{ title: '开始休息' }],
          requireInteraction: true,
        });
        setIsBreak(true);
        setPomodoroCount((prevCount) => prevCount + 1);
        setTimeLeft(pomodoroCount % 4 === 3 ? 15 * 60 : 5 * 60);
      } else {
        chrome.tabs.create({ url: 'index.html' }, (tab) => {
          chrome.windows.update(tab.windowId!, { focused: true });
        });
        setIsBreak(false);
        setTimeLeft(25 * 60);
        setIsActive(false);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, isBreak, pomodoroCount]);

  const toggleTimer = () => {
    if (!isActive && !currentTask) {
      const newTask: Task = {
        id: Date.now().toString(),
        name: '未命名任务',
        category: '',
        tags: [],
        details: '',
        startTime: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
        endTime: '',
        status: '进行中',
      };
      setCurrentTask(newTask);
    }
    setIsActive(!isActive);
  };

  const cancelTimer = () => {
    if (currentTask) {
      const canceledTask: Task = {
        ...currentTask,
        endTime: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
        status: '已取消',
      };
      setCurrentTask(canceledTask);
    }
    setIsActive(false);
    setTimeLeft(25 * 60);
    setIsBreak(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="pomodoro-timer">
      <Title level={3}>{isBreak ? '休息时间' : '工作时间'}</Title>
      <Text className="timer" style={{ fontSize: '48px', display: 'block', margin: '20px 0' }}>
        {formatTime(timeLeft)}
      </Text>
      <Space>
        <Button type="primary" onClick={toggleTimer}>
          {isActive ? '暂停' : '开始'}
        </Button>
        {!isBreak && isActive && <Button onClick={cancelTimer}>取消</Button>}
      </Space>
      <TickSound isActive={isActive} />
    </div>
  );
};

export default PomodoroTimer;