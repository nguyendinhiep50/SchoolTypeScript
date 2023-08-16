import React, { useState, useEffect } from 'react';
import axios from "axios";
import { PlusOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, useHistory } from 'react-router-dom';
import {
  Button,
  Form,
  Input,
  Switch,
} from 'antd';
const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
interface InfoAccount {
  managementId: string,
  managementName: string,
  managementEmail: string,
  managementPassword: string
}
interface InfomationProps {
  dataInfoAccount: InfoAccount;
}
const FormDisabledDemo: React.FC<InfomationProps> = ({ dataInfoAccount }) => {
  const [componentDisabled, setComponentDisabled] = useState<boolean>(false);
  const history = useHistory();
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
          <Input defaultValue={dataInfoAccount?.managementName} />
        </Form.Item>
        <Form.Item label="Email">
          <Input defaultValue={dataInfoAccount?.managementEmail} />
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