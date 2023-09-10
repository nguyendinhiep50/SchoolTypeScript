import axios from 'axios';
import { PagesAndSize } from './types';
import { Item } from '../InterFace/ISubject'
const accessToken = localStorage.getItem("access_tokenAdmin");

export const CountSubjects = async () => {
    const response = await axios.get("https://localhost:7232/api/Subjects/TakeCountAll",
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).catch((err) => console.log(err));
    return response;
}
export const GetListSubjectPage = async (params: PagesAndSize) => {
    const { pages, size } = params;
    const response = await axios.get("https://localhost:7232/api/Subjects?pages="
        + pages + "&size=" + size, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }).catch((err) => console.log(err));
    return response;
}
export const DeleteSubject = async (params: string) => {
    const bien = params;
    const response = await axios.delete("https://localhost:7232/api/Subjects/"
        + bien, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }).catch((err) => console.log(err));
    return response;
}
export const UpdateSubject = async (params: Item, id: string) => {
    const dataupdate = params;
    const response = axios.put("https://localhost:7232/api/Subjects/" + id, dataupdate,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    ).then(() => { alert("cạp nhat thanh cong") })
        .catch((err) => {
            console.log(err)
        });
    return response;
}
export const Register = async (params: string) => {
    const accessTokenStudent = localStorage.getItem("access_tokenStudent");
    const response = await axios.post("https://localhost:7232/api/ListStudentClassLearns/StudentRegisterClass/"
        + params, {
        headers: {
            Authorization: `Bearer ${accessTokenStudent}`
        }
    }).catch((err) => console.log(err));
    return response;
}

export const SubjectRegisterAll = async () => {
    const accessTokenStudent = localStorage.getItem("access_tokenStudent");
    const response = await axios.get(`https://localhost:7232/api/Subjects/TakeSubjectForStudent`
        , {
            headers: {
                Authorization: `Bearer ${accessTokenStudent}`
            }
        }).catch((err) => console.log(err));
    return response;
}
export const SubjectNoRegister = async () => {
    const accessTokenStudent = localStorage.getItem("access_tokenStudent");
    const response = await
        axios.get(`https://localhost:7232/api/Subjects/SubjectNoRegister`
            , {
                headers: {
                    Authorization: `Bearer ${accessTokenStudent}`
                }
            }).catch((err) => console.log(err));
    return response;
}

export const SubjectRegister = async () => {
    const accessTokenStudent = localStorage.getItem("access_tokenStudent");
    const response = await axios.get("https://localhost:7232/api/Subjects/SubjectRegister", {
        headers: {
            Authorization: `Bearer ${accessTokenStudent}`
        }
    }).catch((err) => console.log(err));
    return response;
}

