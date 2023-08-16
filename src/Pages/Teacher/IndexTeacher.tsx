import React, { useState, useEffect } from "react";
import { } from "@ant-design/icons";
import { Layout, theme, Col, Row } from "antd";
import NavbarStudent from "./Component/NavbarTeacher";
import InFomationAccount from "./Component/InfomationAccount";
import ImageInfomation from "./Component/ImageInfomation";

function ManagementStudent() {
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
          <h1>hiển thị</h1>
          <Row>
            <Col span={12}>
              <ImageInfomation />
            </Col>
            <Col span={12}>
              <InFomationAccount />
            </Col>
          </Row>
        </Content>
      </Layout>
    </>
  );
}
export default ManagementStudent;
