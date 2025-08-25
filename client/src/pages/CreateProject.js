import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SetLoading } from '../../redux/loadersSlice';
import { AddNewProject } from '../../apicalls/projects'; // We will create this API call next

function CreateProject() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(SetLoading(true));
      const response = await AddNewProject(values); // API call
      dispatch(SetLoading(false));
      if (response.success) {
        message.success("Project created successfully!");
        navigate('/'); // Navigate back to the homepage after success
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-2xl">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl text-gray-800 font-semibold">
            Let's Start a New Project
          </h1>
          <p className="text-gray-500 mt-1">
            Fill in the details below to get your new project up and running.
          </p>
        </div>

        {/* Project Creation Form */}
        <Form
          layout="vertical"
          onFinish={onFinish}
          className="bg-white p-8 rounded-lg shadow-md border border-gray-200"
        >
          <Form.Item
            label="Project Name"
            name="name"
            rules={[{ required: true, message: 'Please enter a name for your project' }]}
          >
            <Input size="large" placeholder="e.g., Q3 Marketing Campaign" />
          </Form.Item>

          <Form.Item
            label="Project Description"
            name="description"
            rules={[{ required: true, message: 'Please provide a brief description' }]}
          >
            <Input.TextArea rows={4} placeholder="Describe the main goals of this project..." />
          </Form.Item>

          <Form.Item className="mt-6">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
            >
              Create Project
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default CreateProject;