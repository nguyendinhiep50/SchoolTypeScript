import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, useHistory } from 'react-router-dom';
import { Button, DatePicker, Form, Input, Switch, Upload } from 'antd';
import dayjs from 'dayjs';
interface InfoAccount {
  teacherPhone: string,
  teacherName: string,
  teacherEmail: string
  teacherImage: string,
  teacherBirthDate: Date,
  teacherAdress: string
}
const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
interface InfomationProps {
  dataInfoAccount: InfoAccount;
}
const FormDisabledDemo: React.FC<InfomationProps> = ({ dataInfoAccount }) => {

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
        <Form.Item label="Name Login">
          <Input defaultValue={dataInfoAccount.teacherName} />
        </Form.Item>
        <Form.Item label="Email">
          <Input defaultValue={dataInfoAccount.teacherEmail} />
        </Form.Item>
        <Form.Item label="Ngày sinh">
          <DatePicker
            defaultValue={dayjs(dataInfoAccount.teacherBirthDate, "YYYY-MM-DD")}
          />
        </Form.Item>
        <Form.Item label="Số điện thoại">
          <Input defaultValue={dataInfoAccount.teacherPhone} />
        </Form.Item>
        <Form.Item label="Địa chỉ">
          <Input defaultValue={dataInfoAccount.teacherAdress} />
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
