import React, { useEffect, useState, ReactNode } from 'react';
import { Form, Button, Pagination, Popconfirm, Table, Typography, Checkbox, Col } from 'antd';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { PagesAndSize } from '../../../services/types'
import { format } from 'date-fns';
import { Item, EditableCell } from "../../../InterFace/IRoleUserAccount";
import { GetListRoleAccountPage, CountRoleAccounts, UpdateRoleAccount } from '../../../services/APIRoleAccount';
import { Console } from 'console';


const App: React.FC = () => {
  const [form] = Form.useForm();
  const [Pageschange, setPageschange] = useState(1);

  const [dataRoleAccount, setdataRoleAccount] = useState<Item[]>([]);
  const [dataUpdate, setdataUpdate] = React.useState<Item>();
  const [countRoleAccount, setcountRoleAccount] = useState(0);

  // role
  let [CheckRoleStudent, setCheckRoleStudent] = useState(false);
  let [CheckRoleTeacher, setCheckRoleTeacher] = useState(false);
  let [CheckRoleManagement, setCheckRoleManagement] = useState(false);


  const [Size, setSize] = useState(6);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await CountRoleAccounts();
        const value: any = response;
        setcountRoleAccount(value.data);
        console.log('Fetch data successful');
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const pagesAndSize: PagesAndSize = { pages: Pageschange, size: 6 };
      try {
        const response = await GetListRoleAccountPage(pagesAndSize);
        if (typeof response === 'undefined') {
          console.log('RoleAccountList is of type void');
        } else {
          const RoleAccountsData = response.data.map((RoleAccount: any, index: number) => ({
            nameUser: RoleAccount.nameUser,
            emailUser: RoleAccount.emailUser,
            roleManagement: RoleAccount.roleManagement == undefined ? false : RoleAccount.roleManagement,
            roleTeacher: RoleAccount.roleTeacher == undefined ? false : RoleAccount.roleTeacher,
            roleStudent: RoleAccount.roleStudent == undefined ? false : RoleAccount.roleStudent,
          }));
          setdataRoleAccount(RoleAccountsData);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    // form.setFieldsValue({ key: 'new' });
  }, [Pageschange]);
  const DeleteID = async (record: Partial<Item> & { nameUser: string }) => {
    try {
      const newDataRoleAccount = dataRoleAccount.filter(item => item.nameUser !== record.nameUser);
      setdataRoleAccount(newDataRoleAccount);

      console.log('Role account deleted successfully');
    } catch (error) {
      console.error('Error deleting role account:', error);
    }
  };
  const isEditing = (record: Item) => record.nameUser === dataUpdate?.nameUser;

  const edit = (record: Partial<Item>) => {
    if (record != null) {
      setdataUpdate(record as Item);
      if (record.roleManagement != null && record.roleStudent != null && record.roleTeacher != null) {
        setCheckRoleManagement(record.roleManagement);
        setCheckRoleTeacher(record.roleTeacher);
        setCheckRoleStudent(record.roleStudent);
      }
    }

    form.setFieldsValue({ nameUser: '', emailUser: '', ...record });

  };

  const cancel = () => {
    setdataUpdate({} as Item);
  };
  const handleChanegStudent = () => {
    setCheckRoleStudent(!CheckRoleStudent);

  };

  const handleChanegTeacher = () => {
    setCheckRoleTeacher(!CheckRoleTeacher);
  };

  const handleChanegManagement = () => {
    setCheckRoleManagement(!CheckRoleManagement);
  };
  const save = async (RoleAccountId: string) => {
    try {
      const row = (await form.validateFields());
      if (dataUpdate !== null) {
        const result_ = row === dataUpdate;
      }
      row.nameUser = dataUpdate?.nameUser;
      row.emailUser = dataUpdate?.emailUser;
      row.roleManagement = CheckRoleManagement;
      row.roleTeacher = CheckRoleTeacher;
      row.roleStudent = CheckRoleStudent;
      const newData = [...dataRoleAccount];
      const index = newData.findIndex((item) => RoleAccountId === item.nameUser);

      if (index > -1) {
        newData.splice(index, 1, row);
        setdataRoleAccount(newData);
        setdataUpdate({} as Item);
        const update = UpdateRoleAccount(newData[index]);
        console.log(update)
        if (typeof update === 'undefined') {
          setdataUpdate({} as Item);
          console.log('Validate Failed');
        }
      } else {
        newData.push(row);
        setdataRoleAccount(newData);
        setdataUpdate({} as Item);
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  const handleChanegPages = (newPages: number) => {
    console.log(newPages);
    setPageschange(newPages);
  };
  const columns = [
    {
      title: 'Name Account',
      dataIndex: 'nameUser',
      width: '8%',
    },
    {
      title: 'Email Account',
      dataIndex: 'emailUser',
      width: '15%',
    },
    {
      title: 'Role Management',
      dataIndex: 'roleManagement',
      width: '10%',
      render: (_: any, record: Item) => {
        const editable = isEditing(record);

        if (editable) {
          return (
            <Checkbox
              key={record.nameUser}
              disabled={false}
              onChange={(e) => handleChanegManagement()}
              defaultChecked={record.roleManagement}
            >
              Management
            </Checkbox>
          );
        } else {
          return (
            <Checkbox
              key={record.nameUser}
              disabled={true}
              onChange={(e) => handleChanegManagement()}
              defaultChecked={record.roleManagement}
            >
              Management
            </Checkbox>
          );
        }
      },
    },
    {
      title: 'Role Teacher',
      dataIndex: 'roleTeacher',
      width: '10%',
      render: (_: any, record: Item) => {
        const editable = isEditing(record);

        if (editable) {
          return (
            <Checkbox
              key={record.nameUser}
              disabled={false}
              onChange={(e) => handleChanegTeacher()}
              defaultChecked={record.roleTeacher}
            >
              Teacher
            </Checkbox>
          );
        } else {
          return (
            <Checkbox
              key={record.nameUser}
              disabled={true}
              onChange={(e) => handleChanegTeacher()}
              defaultChecked={record.roleTeacher}
            >
              Teacher
            </Checkbox>
          );
        }
      },
    },
    {
      title: 'Role Student',
      dataIndex: 'roleStudent',
      width: '10%',
      render: (_: any, record: Item) => {
        const editable = isEditing(record);

        if (editable) {
          return (
            <Checkbox
              key={record.nameUser}
              disabled={false}
              onChange={(e) => handleChanegStudent()}
              defaultChecked={record.roleStudent}
            >
              Student
            </Checkbox>
          );
        } else {
          return (
            <Checkbox
              key={record.nameUser}
              disabled={true}
              onChange={(e) => handleChanegStudent()}
              defaultChecked={record.roleStudent}
            >
              Student
            </Checkbox>
          );
        }
      },
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      width: '8%',
      editable: false,
      render: (_: any, record: Item) => {
        const editableShow = isEditing(record);
        return editableShow ? (
          <span>
            <Typography.Link onClick={() => save(record.nameUser)} style={{ marginRight: 8 }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Typography.Link disabled={dataUpdate?.nameUser == ''} onClick={() => edit(record)}>
              Edit
            </Typography.Link>
            <Typography.Link
              disabled={dataUpdate?.nameUser == ''}
              style={{ marginLeft: '20px' }}
              onClick={() => DeleteID(record)}
            >
              Delete
            </Typography.Link>
          </>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
      <Link to="/Management/RoleAccountAdd">
        <Button type="primary" style={{ width: "120px", marginBottom: "20px" }}>Add RoleAccount</Button>
      </Link>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={dataRoleAccount}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={false}
        />
        <Pagination defaultCurrent={1} defaultPageSize={Size} onChange={handleChanegPages} total={countRoleAccount.valueOf()} />
      </Form>
    </>
  );
}

export default App;