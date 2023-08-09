import Infomation from "../../Components/InfomationAccount";
import ImgAccount  from "../../Components/ImageInfomation";
import NavbarManagement  from "../../Components/NavabarAdmin";

import { Layout, theme, Col, Row } from "antd";
function IndexManagement() {
    const { Content } = Layout;
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <>  
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
                        <Infomation />
                    </Col>
                    </Row>
                </Content> 
        </>
  )
}
export default IndexManagement