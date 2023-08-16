import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NavBar from "../../Components/NavabarAdmin"; // Thay NavBar bằng thành phần NavBar thật của bạn
import { Layout } from "antd";
import ManagementIndex from "./ManagementInfo";
import ManagementPassword from "./ManagementPassword";
import AddStudent from "./Add/AddStudent";
import AddTeacher from "./Add/AddTeacher";
import AddFaculty from "./Add/AddFaculty";
import AddSubject from "./Add/AddSubject";
import AddSemester from "./Add/AddSemester";
import AddClass from "./Add/AddClass";
import AddListStudentClass from "./Add/AddListStudentClass";

import ListStudent from "./LayOutListStudent";
import ListTeacher from "./List/ListTeacher";
import ListSubject from "./List/ListSubject";
import ListSemester from "./List/ListSemester";
import ListFaculty from "./List/ListFaculty";
import ListClassLearn from "./List/ListClassLearn";
import ListClass from "./List/ListClass";

function App() {
  return (
    <Route
      render={(props) => (
        <>
          <Layout>
            <NavBar />
            <Layout style={{ width: "80%", padding: "20px 10px 0px 20px" }}>
              <Switch>
                <Route path="/Management/ManagementIndex" component={ManagementIndex} />
                <Route path="/Management/ManagementPassword" exact={false} component={ManagementPassword} />
                <Route path="/Management/StudentAdd" exact={false} component={AddStudent} />
                <Route path="/Management/TeacherAdd" exact={false} component={AddTeacher} />
                <Route path="/Management/FacultyAdd" exact={false} component={AddFaculty} />
                <Route path="/Management/SubjectAdd" exact={false} component={AddSubject} />
                <Route path="/Management/SemesterAdd" exact={false} component={AddSemester} />
                <Route path="/Management/ClassAdd" exact={false} component={AddClass} />
                <Route path="/Management/ClassLearnAdd" exact={false} component={AddListStudentClass} />

                <Route path="/Management/StudentList" exact={false} component={ListStudent} />
                <Route path="/Management/TeacherList" exact={false} component={ListTeacher} />
                <Route path="/Management/SubjectList" exact={false} component={ListSubject} />
                <Route path="/Management/FacultyList" exact={false} component={ListFaculty} />
                <Route path="/Management/SemesterList" exact={false} component={ListSemester} />
                <Route path="/Management/ClassLearnList" exact={false} component={ListClassLearn} />
                <Route path="/Management/ClassList" exact={false} component={ListClass} />
              </Switch>
            </Layout>
          </Layout>
        </>
      )}
    />
  );
}

export default App;
