import React, { useState, useEffect } from "react";
import { } from "@ant-design/icons";
import { Layout, theme, Col, Row } from "antd";
import NavbarStudent from "./Component/NavbarStudent";
import InFomationAccount from "./Component/InfomationAccount";
import ImageInfomation from "./Component/ImageInfomation";
import axios from "axios";
import { BrowserRouter as Router, useHistory } from 'react-router-dom';

interface InfoAccount {
  studentId: string,
  studentName: string,
  studentImage: string,
  studentBirthDate: string,
  facultyName: string,
  facultyId: string,
  phoneStudent: string,
}
function ManagementStudent() {
  const [dataInfoAccount, setdataInfoAccount] = useState<InfoAccount>({
    studentId: '',
    studentName: '',
    studentImage: '',
    studentBirthDate: '',
    facultyName: '',
    facultyId: '',
    phoneStudent: '',
  });
  const history = useHistory();
  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = localStorage.getItem("access_tokenStudent");

      if (accessToken != null) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        try {
          const response = await axios.get(
            `https://localhost:7232/api/Students/TakeInfoStudent`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
          );
          const InfoAccount1 = {
            studentId: response.data.studentId,
            studentName: response.data.studentName,
            studentImage: response.data.studentImage,
            studentBirthDate: response.data.studentBirthDate,
            facultyName: response.data.facultyName,
            facultyId: response.data.facultyId,
            phoneStudent: response.data.phoneStudent,
          };

          setdataInfoAccount(InfoAccount1);
        } catch (error) {
          console.log(error);
        }
      } else {
        history.push("/");
      }

      setIsLoaded(true);
    };
    fetchUserData();
  }, []);
  const [isLoaded, setIsLoaded] = useState(false);
  const { Content } = Layout;
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <>
      {isLoaded ?
        <Content
          style={{
            padding: "0 24px",
            margin: 0,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <h1>InfoStudent</h1>
          <Row>
            <Col span={12}>
              <ImageInfomation />
            </Col>
            <Col span={12}>
              <InFomationAccount dataInfoAccount={dataInfoAccount} />

            </Col>
          </Row>
        </Content>
        : <p>Đang tải...</p>
      }
    </>
  );
}
export default ManagementStudent;
