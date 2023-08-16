import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Form,
  Input,
  Radio,
  Col, Row, Layout, theme
} from 'antd';
import axios from "axios";
import { BrowserRouter as Link, useHistory } from 'react-router-dom';
const FormDisabledDemo: React.FC = () => {
  const accessToken = localStorage.getItem("access_tokenAdmin");
  const history = useHistory();
  const [form] = Form.useForm();
  const [DataPost, setDataPost] = useState({
    subjectName: "",
    subjectCredit: 0,
    subjectMandatory: false,
  });
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.target.value === 'true' ? true : false;
    // Now you can use the selectedValue as needed
    setDataPost((prevData) => ({
      ...prevData,
      subjectMandatory: selectedValue,
    }));
  };
  const handlesubjectNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newsubjectName = event.target.value;
    setDataPost((prevData) => ({
      ...prevData,
      subjectName: newsubjectName,
    }));
  };
  const handlesubjectCreditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newsubjectCredit = parseInt(event.target.value, 10);
    setDataPost((prevData) => ({
      ...prevData,
      subjectCredit: newsubjectCredit,
    }));
  };

  const handleSaveClick = async () => {
    console.log(DataPost);
    axios
      .post("https://localhost:7232/api/Subjects", DataPost, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then((response) => {
        alert("thêm môn thành công")
        history.push("/Management/SubjectList");
      })
      .catch((err) => console.log(err));
  };
  const { Content } = Layout;
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <>
      <Layout>
        <Content
          style={{
            padding: "0 24px",
            margin: 0,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Form
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            style={{ maxWidth: 600 }}
          >
            <Form.Item label="Tên môn">
              <Input onBlur={handlesubjectNameChange} placeholder={"Tên môn"} />
            </Form.Item>
            <Form.Item label="Chứng chỉ">
              <Input onBlur={handlesubjectCreditChange} placeholder={"chứng chỉ"} />
            </Form.Item>
            <Form.Item label="Loại môn">
              <Radio.Group >
                <Radio value="true">Bắt buộc</Radio>
                <Radio value="false">Không bắt buộc</Radio>
              </Radio.Group>
            </Form.Item>

            <Button type="primary" block onClick={handleSaveClick}>
              Add Subject
            </Button>
          </Form>
        </Content>
      </Layout>


    </>
  );
};

export default () => <FormDisabledDemo />;