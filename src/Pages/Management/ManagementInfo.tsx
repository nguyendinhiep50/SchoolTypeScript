import Infomation from "../../Components/InfomationAccount";
import ImgAccount from "../../Components/ImageInfomation";
import NavbarManagement from "../../Components/NavabarAdmin";
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useHistory } from 'react-router-dom';
import { Layout, theme, Col, Row } from "antd";
import axios from "axios";
interface InfoAccount {
    id: string,
    nameManagement: string,
    phoneManagement: string,
    emailManagement: string
}
function IndexManagement() {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const [dataInfoAccount, setdataInfoAccount] = useState<InfoAccount>({
        id: '',
        nameManagement: '',
        phoneManagement: '',
        emailManagement: '',
    });
    const history = useHistory();
    useEffect(() => {
        const fetchUserData = async () => {
            const accessToken = localStorage.getItem("access_tokenAdmin");

            if (accessToken != null) {
                axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

                try {
                    const response = await axios.get(
                        `https://localhost:7232/api/Managements/GetManagementInfo`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                    );

                    const InfoAccount1 = {
                        id: response.data.id,
                        nameManagement: response.data.nameManagement,
                        phoneManagement: response.data.phoneManagement,
                        emailManagement: response.data.emailManagement,
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
                            <ImgAccount />
                        </Col>
                        <Col span={12}>
                            <Infomation dataInfoAccount={dataInfoAccount} />
                        </Col>
                    </Row>
                </Content>
                : <p>Đang tải...</p>
            }

        </>
    )
}
export default IndexManagement