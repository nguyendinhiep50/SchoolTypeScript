import { BrowserRouter as Router, useHistory } from 'react-router-dom';
function LogOut() {
    const history = useHistory();
    localStorage.removeItem("access_tokenAdmin");
    localStorage.removeItem("access_tokenStudent");
    localStorage.removeItem("access_tokenTeacher");
    history.push("/");
    return (
        null
    )
}
export default LogOut