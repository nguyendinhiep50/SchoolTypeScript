import React, {useEffect,useState,ReactNode}  from 'react';
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from 'antd';
import axios from 'axios';  
import { format } from 'date-fns';
interface Item {
  id: string; // Make sure you have a unique id for each item in the array
  teacherName: string;
  teacherImage: string;
  teacherEmail: string;
  teacherPassword:string;
  teacherBirthDate: Date;
  teacherPhone:string;
  teacherAdress :string;
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
  const [dataTeacher, setdataTeacher] = useState<Item[]>([]);
  const [dataUpdate, setdataUpdate] = React.useState({ Item:{} as Item})
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://localhost:7232/api/Teachers");
        console.log(response.data);
        const studentsData = response.data.map((teacher: any, index: number) => ({
          id: teacher.id,
          teacherName: teacher.teacherName,
          teacherImage: teacher.teacherImage,
          teacherEmail: teacher.teacherEmail,
          teacherPassword:teacher.teacherPassword,
          teacherBirthDate: format(new Date(teacher.teacherBirthDate), 'yyyy-MM-dd'),
          teacherPhone:teacher.teacherPhone,
          teacherAdress :teacher.teacherAdress,
        }));
          
        setdataTeacher(studentsData);
        console.log('Fetch data successful');
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [dataUpdate]);
  const isEditing = (record: Item) => record.id === editingid;

  const edit = (record: Partial<Item> & { id:string }) => {
    form.setFieldsValue({ teacherName: '', teacherImage: '',teacherEmail: '',teacherPassword:'',teacherBirthDate:'',teacherPhone:'',teacherAdress:'', ...record });
    setEditingid(record.id);
  };
  const handleDataChange = (newData :Item) => {
    setdataUpdate(prevData => ({
      ...prevData,
      Item: newData
    }));
  };
  const DeleteID = (record: Partial<Item> & { id:string }) => {
    axios
      .delete(
        "https://localhost:7232/api/Teachers/" +record.id
      )
      .then((response) =>{ 
        alert("Đã xóa giáo viên");
        const newDataStudent = dataTeacher.filter(item => item.id !== record.id);
        setdataTeacher(newDataStudent);
      })
      .catch((err) => console.log(err));
  };
  const cancel = () => {
    setEditingid('');
  };

  const save = async (id:string) => {
    try {
      const row = (await form.validateFields()) as Item;

      const newData = [...dataTeacher];
      const index = newData.findIndex((item) => id === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1);
        setdataTeacher(newData);
        setEditingid('');
        // xử lý cập nhật dữ liệu
        axios
        .put(
          "https://localhost:7232/api/Teachers/" +
            id,
          newData[index]
        )
        .then((response) => console.log(response))
        .catch((err) => console.log(err));
      } else {
        newData.push(row);
        setdataTeacher(newData);
        setEditingid('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

 const dataColumns: ShowColumns[]  = [
    {
      title: 'Tên giáo viên',
      dataIndex: 'teacherName',
      width: '20%',
      fixed: 'left',
      editable: true,
    },
    {
      title: 'Ảnh',
      dataIndex: 'teacherImage',
      width: '10%',
      editable: true,
      fixed: '',
    },
    {
      title: 'Email',
      dataIndex: 'teacherEmail',
      width: '35%',
      editable: true,
      fixed: '',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'teacherBirthDate',
      width: '15%',
      editable: true,
      fixed: '',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'teacherAdress',
      width: '25%',
      editable: true,
      fixed: '',
    },
    {
      title: 'điện thoại',
      dataIndex: 'teacherPhone',
      width: '20%',
      editable: true,
      fixed: '',
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      fixed: 'right',
      editable: true,
      width: '15%', 
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
            <Typography.Link style={{marginLeft:"20px"}} disabled={editingid !== ''} onClick={() => DeleteID(record)}>
              DELETE
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
        dataSource={dataTeacher} 
        scroll={{ x: 2000 }} 
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      >
      {dataColumns.map((column:ShowColumns, demcolumn) => {
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