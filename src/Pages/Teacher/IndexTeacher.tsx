import React, { useState, useEffect } from "react";
import { } from "@ant-design/icons";
import { Layout, theme, Col, Row, DatePicker } from "antd";
import { BrowserRouter as Router, useHistory } from 'react-router-dom';
import InfomationAccount from "./Component/InfomationAccount";
import ImageInfomation from "./Component/ImageInfomation";
import axios from "axios";
import dayjs from 'dayjs';
interface InfoAccount {
  teacherPhone: string,
  teacherName: string,
  teacherEmail: string
  teacherImage: string,
  teacherBirthDate: Date,
  teacherAdress: string
}
function ManagementStudent() {
  const { Content } = Layout;
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [dataInfoAccount, setdataInfoAccount] = useState<InfoAccount>({
    teacherEmail: '',
    teacherName: '',
    teacherImage: '',
    teacherBirthDate: dayjs("2000-01-01", "YYYY-MM-DD").toDate(),
    teacherAdress: '',
    teacherPhone: ''
  });
  const history = useHistory();
  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = localStorage.getItem("access_tokenTeacher");

      if (accessToken != null) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        try {
          const response = await axios.get(
            `https://localhost:7232/api/Teachers/TakeInfoAccount`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            }
          );
          const InfoAccount1 = {
            teacherEmail: response.data.teacherEmail,
            teacherName: response.data.teacherName,
            teacherImage: response.data.teacherImage,
            teacherBirthDate: response.data.teacherBirthDate,
            teacherAdress: response.data.teacherAdress,
            teacherPhone: response.data.teacherPhone
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
          <h1>Account </h1>
          <Row>
            <Col span={12}>
              <ImageInfomation />
            </Col>
            <Col span={12}>
              <InfomationAccount dataInfoAccount={dataInfoAccount} />
            </Col>
          </Row>
        </Content>
        : <p>Đang tải...</p>
      }
    </>
  );
}
export default ManagementStudent;
