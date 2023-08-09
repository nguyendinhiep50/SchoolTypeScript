import React, { useState } from 'react'; 
import { PlusOutlined } from '@ant-design/icons';
import {
  Button, 
  DatePicker,
  Form,
  Input,
  Col, Row,Layout,theme
} from 'antd';
import axios from "axios"; 


const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const FormDisabledDemo: React.FC = () => {
  const [form] = Form.useForm();
  const [componentDisabled, setComponentDisabled] = useState<boolean>(false);
  const [DataPost,setDataPost] = useState({ 
    facultyName:"",
  });
  const handleFacultyNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newfacultyName = event.target.value;
    setDataPost((prevData) => ({
      ...prevData,
      facultyName: newfacultyName.toString(),
    }));
  };
  const handleSaveClick = async () => {
    console.log(DataPost);
    axios
      .post("https://localhost:7232/api/Faculties", DataPost)
      .then((response) => alert("thêm khoa thành công"))
      .catch((err) => console.log(err));
  };
  const { Content } = Layout;
   const {
        token: { colorBgContainer },
    } = theme.useToken();
  return (
    <>
      <Layout style={{ padding: "0 24px 24px" }}>
        <Content
            style={{
            padding: "0 24px",
            margin: 0,
            minHeight: 280,
            background: colorBgContainer,
            }}
        >
            <h1>Account </h1>
            <Form
              form={form}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
              style={{ maxWidth: 600 }}
            >
              <Form.Item name="NameFaculty" label="Tên khoa">
                <Input onBlur={handleFacultyNameChange} placeholder={"Tên khoa"} />
              </Form.Item>
              
              <Button type="primary" block onClick={handleSaveClick}>
                  Add Faculty
              </Button> 
            </Form>
        </Content>
      </Layout> 
    </>
  );
};

export default () => <FormDisabledDemo />;