import React, { useState, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { format } from 'date-fns';
import { Task } from '../types';

const { TextArea } = Input;

interface TaskFormProps {
  saveTask: (task: Task) => void;
  currentTask: Task | null;
}

const TaskForm: React.FC<TaskFormProps> = ({ saveTask, currentTask }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (currentTask) {
      form.setFieldsValue({
        name: currentTask.name,
        category: currentTask.category,
        tags: currentTask.tags.join(', '),
        details: currentTask.details,
      });
    }
  }, [currentTask, form]);

  const handleSubmit = (values: any) => {
    const task: Task = {
      id: currentTask ? currentTask.id : Date.now().toString(),
      name: values.name,
      category: values.category,
      tags: values.tags.split(',').map((tag: string) => tag.trim()),
      details: values.details,
      startTime: currentTask ? currentTask.startTime : format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
      endTime: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
      status: currentTask ? currentTask.status : '已完成',
    };
    saveTask(task);
    form.resetFields();
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item name="name" label="任务名称" rules={[{ required: true, message: '请输入任务名称' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="category" label="类别">
        <Input />
      </Form.Item>
      <Form.Item name="tags" label="标签">
        <Input placeholder="用逗号分隔多个标签" />
      </Form.Item>
      <Form.Item name="details" label="详情">
        <TextArea rows={4} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          保存任务
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TaskForm;