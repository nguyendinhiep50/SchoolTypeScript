import React, { useState, useEffect } from "react";
import {
  LaptopOutlined,
  UserOutlined,
  DatabaseOutlined,
  LogoutOutlined
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import axios from "axios";
import { Layout, Menu, theme } from "antd";
import { Link, useHistory } from "react-router-dom";
const { Sider } = Layout;
interface MenuItem {
  key: string;
  label: string;
  ArrayList: { key: string; value: string }[];
}

function generateArrayList(key: string) {
  if (key === "Tài khoản") {
    return [
      { key: "Student/IndexStudent", value: "Thông tin tài khoản" },
    ];
  } else if (key === "Đăng ký môn") {
    return [
      { key: "Student/SubjectResgister", value: "Đăng ký" },
      { key: "RegisteredSubjects", value: "Môn đã đăng ký" }, // Changed to a different key
    ];
  } else if (key === "Lịch") {
    return [
      { key: "subjects", value: "Môn học" },
      { key: "add", value: "Thêm" },
    ];
  } else if (key === "LogOut") {
    return [
      { key: "LogOut", value: "Đăng xuất" },
      { key: "Student/ChangePasswordStudent", value: "Đổi mật khẩu" },
    ];
  }
}

const menuKeys: string[] = ["Tài khoản", "Đăng ký môn", "Lịch", "LogOut"];

const items1 = menuKeys.map((key) => ({
  key,
  label: key,
  ArrayList: generateArrayList(key),
}));

const items2: MenuProps["items"] = [
  UserOutlined,
  LaptopOutlined,
  DatabaseOutlined,
  LogoutOutlined
].map((icon, index) => {
  const key = items1[index].label !== null ? (items1[index].label) : "";

  const arrayList = items1[index].ArrayList;
  if (!arrayList) {
    return null; // Return null or handle this case accordingly
  }
  return {
    key: `sub${key}`,
    icon: React.createElement(icon),
    label: `${key}`,
    children: arrayList.map((item) => ({
      label: <Link to={`/${item.key}`}>{item.value}</Link>,
    })),
  };
});
interface NavbarStudentProps {
  onDataChange: (data: any) => void;
}

const NavbarStudent: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const history = useHistory();
  useEffect(() => {
    const fetchUserData = async () => {
      // Lấy access token từ localStorage
      const accessToken = localStorage.getItem("access_tokenStudent");
      console.log(accessToken);
      // Nếu access token tồn tại
      if (accessToken != null) {
        // Đính kèm access token vào tiêu đề "Authorization" của yêu cầu
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;

        try {
          // Gửi yêu cầu tới API để lấy thông tin người dùng
          const response = await axios.get(
            "https://localhost:7232/api/Students/user?stringToken=" +
            accessToken
          );
          console.log("dăng nhập được", response);
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
        }
      } else {
        console.log("hien thi");
        history.push("/");
      }
    };
    fetchUserData(); // Gọi hàm fetchUserData để lấy dữ liệu
  }, []);

  const [collapsed, setCollapsed] = useState(false);
  return (
    <Sider
      width={200}
      style={{ background: colorBgContainer }}
      trigger={null}
      collapsible
      collapsed={collapsed}
    >
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        style={{ height: "100%", borderRight: 0 }}
        items={items2}
      ></Menu>
    </Sider>
  );
};

export default NavbarStudent;
