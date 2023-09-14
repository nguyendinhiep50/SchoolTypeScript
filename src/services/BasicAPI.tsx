import axios from 'axios';
const UrlBasic = "https://localhost:7232/api/";
export const GetDatabase = async (StringAPI: string, AccessToken: string) => {
    const response = await axios.get(`${UrlBasic}${StringAPI}`,
        {
            headers: {
                Authorization: `Bearer ${AccessToken}`
            }
        }).catch((err) => console.log(err));
    return response;
}
export const DeleteDatabase = async (StringAPI: string, AccessToken: string) => {
    const response = await axios.delete(`${UrlBasic}${StringAPI}`,
        {
            headers: {
                Authorization: `Bearer ${AccessToken}`
            }
        }).catch((err) => console.log(err));
    return response;
}
export const UpDataDatabase = async (StringAPI: string, SubjectGradesAddDto: any, AccessToken: string) => {
    const response = await axios.put(`${UrlBasic}${StringAPI}`, SubjectGradesAddDto, {
        headers: {
            Authorization: `Bearer ${AccessToken}`
        }
    }).catch((err) => console.log(err));
    return response;
}