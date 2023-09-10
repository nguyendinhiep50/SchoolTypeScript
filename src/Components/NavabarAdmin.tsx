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
  getItem('User List', 'UserList', <UsergroupAddOutlined />, "/", [
    getItem('Student List', '5', null, "/Management/StudentList"),
    getItem('Teacher List', '6', null, "/Management/TeacherList"),
    getItem('Add Role', '7', null, "/Management/AddRole"),
  ]),
  getItem('School List', 'SchooldList', <OrderedListOutlined />, "/", [
    getItem('Subject List', '12', null, "/Management/SubjectList"),
    getItem('Class List', '13', null, "/Management/ClassList"),
    getItem('ClassLearn List', '14', null, "/Management/ClassLearnList"),
    getItem('Faculty List', '15', null, "/Management/FacultyList"),
    getItem('Semester List', '16', null, "/Management/SemesterList"),
    getItem('List Role', '17', null, "/Management/ListRoleAccount"),
    getItem('List Academic ', '18', null, "/Management/ListAcademicProgram")]),


  getItem('Log Out', 'setting', <FileOutlined />, "/Logout"),
];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
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