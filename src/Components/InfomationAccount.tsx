import React, { useState } from 'react';
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
  const [dataEdit, setDataEdit] = useState<InfoAccount>(dataInfoAccount);
  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newdataName = event.target.value;
    setDataEdit(prevData => ({
      ...prevData,
      managementName: newdataName
    }))
  };

  const handleSaveName = async () => {
    console.log(dataEdit);
    axios
      .put(
        "https://localhost:7232/api/Managements/" + dataEdit.managementId,
        dataEdit
      )
      .then((response) => { alert("hello") })
      .catch((err) => {
        console.log(err)
      });
  };
  return (
    <>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        disabled={!componentDisabled}
        style={{ maxWidth: "1000px" }}
      >
        <Form.Item label="Name ADMIN">
          <Input defaultValue={dataInfoAccount?.managementName} onChange={handleChangeName} />
        </Form.Item>
        <Form.Item label="Email">
          <Input value={dataInfoAccount?.managementEmail} disabled />
        </Form.Item>
        <Form.Item label="cập nhật" style={{ display: 'block' }}>
          <Button type="primary" onClick={handleSaveName}  >
            Cập nhật tên
          </Button>
        </Form.Item>
      </Form>
      <Form.Item
        label="Cập nhật tên "
        valuePropName=""

      >
        <Switch checked={componentDisabled} onChange={(checked) => setComponentDisabled(checked)} />
      </Form.Item>
    </>
  );
};

export default FormDisabledDemo;