import React, {useEffect,useState,ReactNode}  from 'react';
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from 'antd';
import axios from 'axios';  
import { format } from 'date-fns';
interface Item {
  id: string; // Make sure you have a unique id for each item in the array
  studentName: string;
  studentImage: string;
  studentEmail: string;
  studentPassword:string;
  studentBirthDate: Date;
  studentPhone:string;
  studentAdress :string;
  studentDateCome:Date; 
}
interface ShowColumns {
  title: string;
  dataIndex: string;
  width: string;
  fixed: string;   
  editable: boolean;
  render?: RenderFunction | RenderWithCellFunction;
}

type RenderFunction = (value: any, record: Item, index: number) => ReactNode;
type RenderWithCellFunction = (value: any, record: Item, index: number) => ReactNode ;
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: Item;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const App: React.FC = () => {
  const [form] = Form.useForm(); 
  const [editingid, setEditingid] = useState('');
  const [dataListCLass, setdataListCLass] = useState<Item[]>([]);
  const [dataUpdate, setdataUpdate] = React.useState({ Item:{} as Item})
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://localhost:7232/api/Students");
        console.log(response.data);
        const studentsData = response.data.map((student: any, index: number) => ({
          id: student.id,
          studentName: student.studentName,
          studentImage: student.studentImage,
          studentEmail: student.studentEmail,
          studentBirthDate: format(new Date(student.studentBirthDate), 'yyyy-MM-dd'),        
          facultyId: student.facultyId,
          studentAdress :student.studentAdress,
          studentDateCome:format(new Date( student.studentDateCome), 'yyyy-MM-dd'),
          studentPhone:student.studentPhone,
          studentPassword:student.studentPassword,
        }));
        setdataListCLass(studentsData);
        console.log('Fetch data successful');
      } catch (error) {
        console.error(error);
        
      }
    };

    fetchData();
  }, [dataUpdate]);
  const handleDataChange = (newData :Item) => {
    setdataUpdate(prevData => ({
      ...prevData,
      Item: newData
    }));
  };
  const DeleteID = (record: Partial<Item> & { id: string }) => {
    axios
      .delete(
        "https://localhost:7232/api/Teachers/" +record.id
      )
      .then((response) =>{ 
        alert("Đã xóa giáo viên");
        const newDataStudent = dataListCLass.filter(item => item.id !== record.id);
        setdataListCLass(newDataStudent);
      })
      .catch((err) => console.log(err));
  };

  const isEditing = (record: Item) => record.id === editingid;

  const edit = (record: Partial<Item> & { id: string }) => {
    form.setFieldsValue({  studentName: '', studentEmail: '',studentPassword: '',studentAdress:'',studentDateCome:'',studentPhone:'',facultyId:'', ...record });
    setEditingid(record.id);
  };

  const cancel = () => {
    setEditingid('');
  };

  const save = async (id: string) => {
    try {
      const row = (await form.validateFields()) as Item;

      const newData = [...dataListCLass];
      const index = newData.findIndex((item) => id === item.id);
      // id
      console.log(id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setdataListCLass(newData);
        setEditingid('');
        // xử lý cập nhật dữ liệu
        axios
        .put(
          "https://localhost:7232/api/ClassLearns/" +
            id,
            newData[index]
        )
        .then((response) => console.log(response))
        .catch((err) => console.log(err));

        console.log(newData[index]);
      } else {
        newData.push(row);
        setdataListCLass(newData);
        setEditingid('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

 const dataColumns: ShowColumns[]  = [
    {
      title: 'Tên học sinh',
      dataIndex: 'studentName',
      width: '20%',
      fixed: 'left',
      editable: true, 
    },
    {
      title: 'Ảnh',
      dataIndex: 'studentImage',
      width: '10%',
      fixed: '',
      editable: true,
    },
    {
      title: 'Email',
      dataIndex: 'studentEmail',
      fixed: '',
      width: '30%',
      editable: true,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'studentBirthDate',
      fixed: '',
      width: '15%',
      editable: true,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'studentAdress',
      width: '20%',
      fixed: '',
      editable: true,
    },
    {
      title: 'điện thoại',
      dataIndex: 'studentPhone',
      fixed: '',
      width: '15%',
      editable: true,
    },
    {
      title: 'Ngày nhập học',
      dataIndex: 'studentDateCome',
      fixed: '',
      width: '15%',
      editable: true,
    },
   {
      title: 'Mat khau',
      dataIndex: 'studentPassword',
      fixed: '',
      width: '15%',
      editable: true,
    },
    {
      title: 'Khoa',
      dataIndex: 'facultyId',
      fixed: '',
      width: '15%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      width: '15%',
      fixed: 'right',      
      editable: true,
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.id)} style={{ marginRight: 8 }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Typography.Link disabled={editingid !== ''} onClick={() => edit(record)}>
              Edit
            </Typography.Link>
            <Typography.Link disabled={editingid !== ''} style={{marginLeft:"20px"}} onClick={() => DeleteID(record)}>
              Delete
            </Typography.Link>
          </>
        );
      },
    },
  ];

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={dataListCLass} 
        scroll={{ x: 1300 }} 
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      >
      {dataColumns.map((column:ShowColumns, demcolumn) => {
        const count: number = demcolumn + 1;
        const { dataIndex, title, width, fixed, ...restColumnProps } = column;
        const mappedFixed = fixed === 'left' ? 'left' : fixed === 'right' ? 'right' : undefined;

        // Adjust the render function to pass the count as the index parameter
        const adjustedRender = column.render
        ? (value: any, record: Item, index: number) =>
            column.render!(value, record as Item, index)
        : undefined;
        return (
          <Table.Column<Item>
            key={dataIndex}
            title={title}
            dataIndex={dataIndex}
            width={width}
            fixed={mappedFixed}
            render={adjustedRender}
            {...restColumnProps}
          />
        );
      })}
      </Table>
    </Form>
  );
};

export default App;