import { Form, Input, InputNumber } from 'antd';
import React, { ReactNode } from 'react';


export interface Item {
    subjectGradesId: string;
    studentName: string;
    subjectName: string;
    gpaRank1: 0;
    gpaRank2: 0;
    gpaRank3: 0;
    gpaRank4: 0;
    passSubject: false;
}
export interface ChildProps {
    ListItem: Item[]; // Để định nghĩa một mảng chứa các phần tử kiểu Item
}

export interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: Item;
    index: number;
    children: React.ReactNode;
}

export interface ShowColumns {
    title: string;
    dataIndex: string;
    width: string;
    editable: boolean;
    render?: RenderFunction | RenderWithCellFunction;
}
type RenderFunction = (value: any, record: Item, index: number) => ReactNode;
type RenderWithCellFunction = (value: any, record: Item, index: number) => ReactNode;
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