import { Form, Input, InputNumber } from 'antd';
import React, { ReactNode } from 'react';
export interface Item {
    teacherId: string; // Make sure you have a unique id for each item in the array
    teacherName: string;
    teacherImage: string;
    teacherEmail: string;
    teacherBirthDate: Date;
    teacherPhone: string;
    teacherAdress: string;
}
export interface ShowColumns {
    title: string;
    dataIndex: string;
    width: string;
    fixed: string;
    editable: boolean;
    render?: RenderFunction | RenderWithCellFunction;
}

type RenderFunction = (value: any, record: Item, index: number) => ReactNode;
type RenderWithCellFunction = (value: any, record: Item, index: number) => ReactNode;
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: Item;
    index: number;
    children: React.ReactNode;
}
export const EditableCell: React.FC<EditableCellProps> = ({
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