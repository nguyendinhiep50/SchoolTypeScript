import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme, Breadcrumb } from 'antd';
import {
  OrderedListOutlined,
  FileOutlined,
  HomeOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import { BrowserRouter as Router, Route, Link, useHistory, useLocation } from 'react-router-dom';
import axios from "axios";

const { Sider } = Layout;
const { SubMenu } = Menu;

type MenuItem = {
  label: React.ReactNode;
  key: React.Key;
  icon?: React.ReactNode;
  to?: string; // Thêm thuộc tính to
  children?: MenuItem[];
};

const getItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  to?: string, // Thêm tham số to
  children?: MenuItem[]
): MenuItem => {
  return {
    key,
    icon,
    to, // Gán tham số to vào thuộc tính to của menu item
    children,
    label,
  };
};

const items: MenuItem[] = [
  getItem('Account', 'sub', <HomeOutlined />, "/", [
    getItem('Infomation', '1', null, "/Management/ManagementIndex"),
    getItem('PassWord', '2', null, "/Management/ManagementPassword"),
  ]),
  getItem('Management User List', 'UserList', <UsergroupAddOutlined />, "/", [
    getItem('Student List', '5', null, "/Management/StudentList"),
    getItem('Teacher List', '6', null, "/Management/TeacherList")
  ]),
  getItem('Management School List', 'SchooldList', <OrderedListOutlined />, "/", [
    getItem('Subject List', '12', null, "/Management/SubjectList"),
    getItem('Class List', '13', null, "/Management/ClassList"),
    getItem('ClassLearn List', '14', null, "/Management/ClassLearnList"),
    getItem('Faculty List', '15', null, "/Management/FacultyList"),
    getItem('Semester List', '16', null, "/Management/SemesterList")]),
  getItem('Log Out', 'setting', <FileOutlined />, "/Logout"),
];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const history = useHistory();

  useEffect(() => {
    const fetchUserData = async () => {
      // Lấy access token từ localStorage
      const accessToken = localStorage.getItem("access_tokenAdmin");
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
            "https://localhost:7232/api/Managements/user?stringToken=" +
            accessToken
          ).catch((err) => {
            localStorage.removeItem("access_tokenAdmin");
            history.push("/");
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        history.push("/");
      }
    };
    fetchUserData(); // Gọi hàm fetchUserData để lấy dữ liệu
  }, []);
  return (
    <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
      <div className="demo-logo-vertical" />
      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
        {items.map(item => {
          if (item.children && item.children.length > 0) {
            return (
              <SubMenu key={item.key} icon={item.icon} title={item.label}>
                {item.children.map(childItem => (
                  <Menu.Item key={childItem.key}>
                    <Link to={childItem.to || ''}>{childItem.label}</Link>
                  </Menu.Item>
                ))}
              </SubMenu>
            );
          } else {
            return (
              <Menu.Item key={item.key} icon={item.icon}>
                <Link to={item.to || ''}>{item.label}</Link>
              </Menu.Item>
            );
          }
        })}
      </Menu>
    </Sider>
  );
};

export default App;