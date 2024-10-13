export interface Task {
  id: string;
  name: string;
  category: string;
  tags: string[];
  details: string;
  startTime: string;
  endTime: string;
  status: '进行中' | '已完成' | '已取消';
}