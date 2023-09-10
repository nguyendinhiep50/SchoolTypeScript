import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Cascader, Checkbox, DatePicker, Form, Input, Switch, TreeSelect, Upload, Col, Row } from 'antd';
import dayjs from 'dayjs';
const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
interface InfoAccount {
  studentId: string,
  studentName: string,
  studentImage: string,
  studentBirthDate: string,
  facultyName: string,
  facultyId: string,
  phoneStudent: string,
}
interface InfomationProps {
  dataInfoAccount: InfoAccount;
}
const FormDisabledDemo: React.FC<InfomationProps> = ({ dataInfoAccount }) => {
  const [componentDisabled, setComponentDisabled] = useState<boolean>(false);
  console.log(dataInfoAccount)
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
          <Input defaultValue={dataInfoAccount?.studentName} />
        </Form.Item>
        <Form.Item label="Khoa">
          <Input defaultValue={dataInfoAccount?.facultyName} />
        </Form.Item>

        <Form.Item label="Ngày sinh">
          <DatePicker defaultValue={dayjs(dataInfoAccount.studentBirthDate, "YYYY-MM-DD")} />
        </Form.Item>
        <Form.Item label="Số điện thoại">
          <Input defaultValue={dataInfoAccount?.phoneStudent} />
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
