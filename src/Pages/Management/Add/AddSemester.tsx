import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Form,
  Input,
  Layout, theme
} from 'antd';
import { BrowserRouter as Link, useHistory } from 'react-router-dom';
import moment from 'moment';
import axios from "axios";
import dayjs from 'dayjs';

const FormDisabledDemo: React.FC = () => {
  const accessToken = localStorage.getItem("access_tokenAdmin");
  const history = useHistory();
  const [form] = Form.useForm();
  const [DataPost, setDataPost] = useState({
    semesterName: "",
    semesterDayBegin: "",
    semesterDayEnd: "",
  });
  const handleSemesterNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newemesterName = event.target.value;
    setDataPost((prevData) => ({
      ...prevData,
      semesterName: newemesterName,
    }));
  };
  const handleSemesterDayBeginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSemesterDayBegin = event.target.value;
    setDataPost((prevData) => ({
      ...prevData,
      semesterDayBegin: newSemesterDayBegin,
    }));
  };
  const handleSemesterDayEndChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSemesterDayEnd = event.target.value;
    setDataPost((prevData) => ({
      ...prevData,
      semesterDayEnd: newSemesterDayEnd,
    }));
  };
  const handleSaveClick = async () => {
    console.log(DataPost);
    axios
      .post("https://localhost:7232/api/Semesters", DataPost, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then((response) => {
        alert("thêm học kì thành công")
        history.push("/Management/SemesterList");

      })
      .catch((err) => console.log(err));
  };
  const { Content } = Layout;
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <>
      <Layout >
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
            <Form.Item name="NameStudent" label="Tên học kì">
              <Input onBlur={handleSemesterNameChange} placeholder={"Tên học kì"} />
            </Form.Item>
            <Form.Item name="datebegin" label="Ngày bắt đầu">
              <DatePicker onBlur={handleSemesterDayBeginChange} defaultValue={dayjs("2000-01-01", "YYYY-MM-DD")} />
            </Form.Item>
            <Form.Item name="datend" label="Ngày kết thúc">
              <DatePicker onBlur={handleSemesterDayEndChange} defaultValue={dayjs("2000-01-01", "YYYY-MM-DD")} />
            </Form.Item>
            <Button type="primary" block onClick={handleSaveClick}>
              Add Semester
            </Button>
          </Form>
        </Content>
      </Layout>

    </>
  );
};

export default () => <FormDisabledDemo />;