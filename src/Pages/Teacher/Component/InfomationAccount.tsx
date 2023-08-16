import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Cascader, Checkbox, DatePicker, Form, Input, InputNumber, Radio, Select, Slider, Switch, TreeSelect, Upload, Col, Row } from 'antd';

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
const FormDisabledDemo: React.FC = () => {
  const [componentDisabled, setComponentDisabled] = useState<boolean>(false);
  return (
    <>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        disabled={!componentDisabled}
        style={{ maxWidth: 600 }}
      >
        <Form.Item label="Họ và tên">
          <Input defaultValue={"Nguyen dinh hiep"} />
        </Form.Item>
        <Form.Item label="Email">
          <Input />
        </Form.Item>
        <Form.Item label="Ngày sinh">
          <DatePicker />
        </Form.Item>
        <Form.Item label="Số điện thoại">
          <Input defaultValue={"Nguyen dinh hiep"} />
        </Form.Item>
        <Form.Item label="Địa chỉ">
          <Input defaultValue={"Nguyen dinh hiep"} />
        </Form.Item>
        <Form.Item label="Thay đổi ảnh" valuePropName="fileList" getValueFromEvent={normFile}>
          <Upload action="/upload.do" listType="picture-card">
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>
        <Button type="primary" block>
          Cập nhật dữ liệu
        </Button>
      </Form>
      <Form.Item
        label="Cập nhật thông tin"
        valuePropName=""
      >
        <Switch checked={componentDisabled} onChange={(checked) => setComponentDisabled(checked)} />
      </Form.Item>
    </>
  );
};

export default FormDisabledDemo;
