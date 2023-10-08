import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NavBar from "../../Components/NavabarAdmin"; // Thay NavBar bằng thành phần NavBar thật của bạn
import { Layout } from "antd";
import ManagementIndex from "./ManagementInfo";
import ManagementPassword from "./ManagementPassword";
import AddStudent from "./Student/AddStudent";
import AddTeacher from "./Teacher/AddTeacher";
import AddFaculty from "./Faculty/AddFaculty";
import AddSubject from "./Subject/AddSubject";
import AddSemester from "./Semester/AddSemester";
import AddClass from "./Class/AddClass";
import AddListStudentClass from "./Add/AddListStudentClass";
import AddRole from "./Role/AddRole";
import AddAcademicProgram from "./AcademicProgram/AddAcademicProgram";
import AddExcel from "./Student/AddExcel";

import ListStudent from "./LayOutListStudent";
import ListTeacher from "./Teacher/ListTeacher";
import ListSubject from "./Subject/ListSubject";
import ListSemester from "./Semester/ListSemester";
import ListFaculty from "./Faculty/ListFaculty";
import ListClassLearn from "./List/ListClassLearn";
import ListClass from "./Class/ListClass";
import ListRoleAccount from "./Role/ListRoleAccount";
import ListAcademicProgram from "./AcademicProgram/ListAcademicProgram";


function App() {
  return (
    <Route
      render={(props) => (
        <>
          <Layout>
            <NavBar />
            <Layout style={{ width: "80%", minHeight: "650px", padding: "20px 10px 0px 20px" }}>
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
                <Route path="/Management/AddRole" exact={false} component={AddRole} />
                <Route path="/Management/AddAcademicProgram" exact={false} component={AddAcademicProgram} />
                <Route path="/Management/AddExcel" exact={false} component={AddExcel} />


                <Route path="/Management/StudentList" exact={false} component={ListStudent} />
                <Route path="/Management/TeacherList" exact={false} component={ListTeacher} />
                <Route path="/Management/SubjectList" exact={false} component={ListSubject} />
                <Route path="/Management/FacultyList" exact={false} component={ListFaculty} />
                <Route path="/Management/SemesterList" exact={false} component={ListSemester} />
                <Route path="/Management/ClassLearnList" exact={false} component={ListClassLearn} />
                <Route path="/Management/ClassList" exact={false} component={ListClass} />
                <Route path="/Management/ListRoleAccount" exact={false} component={ListRoleAccount} />
                <Route path="/Management/ListAcademicProgram" exact={false} component={ListAcademicProgram} />


              </Switch>
            </Layout>
          </Layout>
        </>
      )}
    />
  );
}

export default App;
