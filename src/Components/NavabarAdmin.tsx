import React, { useState } from 'react';
import { Layout, Menu, theme,Breadcrumb } from 'antd';
import {
  OrderedListOutlined,
  FileOutlined, 
  AppstoreAddOutlined,
  HomeOutlined,
  UserAddOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const {  Sider } = Layout;
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
  getItem('Account', 'sub', <HomeOutlined />,"/",[
    getItem('Infomation', '1',null,"/"),
    getItem('PassWord', '2',null,"/ManagementPassword"),
  ]),
  getItem('Management User Add', 'UserAdd', <UserAddOutlined />,"/",[
    getItem('Student Add', '3',null,"/StudentAdd"),
    getItem('Teacher Add', '4',null,"/TeacherAdd"),
  ]),
  getItem('Management User List', 'UserList', <UsergroupAddOutlined />,"/",[
    getItem('Student List', '5',null,"/StudentList"),
    getItem('Teacher List', '6',null,"/TeacherList")
  ]),
  getItem('Management School Add', 'SchoolAdd', <AppstoreAddOutlined />,"/", [
    getItem('Subject Add', '7',null,"/SubjectAdd"),
    getItem('Class Add', '8',null,"/ClassAdd"),
    getItem('ClassLearn Add', '9',null,"/ClassLearnAdd"),
    getItem('Faculty Add', '10',null,"/FacultyAdd"),
    getItem('Semester Add', '11',null,"/SemesterAdd")
  ]),
  getItem('Management School List', 'SchooldList', <OrderedListOutlined />,"/", [
    getItem('Subject List', '12',null,"/SubjectList"),
    getItem('Class List', '13',null,"/ClassList"),
    getItem('ClassLearn List', '14',null,"/ClassLearnList"),
    getItem('Faculty List', '15',null,"/FacultyList"),
    getItem('Semester List', '16',null,"/SemesterList")]),
  getItem('Setting', 'setting', <FileOutlined />,"/Setting"),
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