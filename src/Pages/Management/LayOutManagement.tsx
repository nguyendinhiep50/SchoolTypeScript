import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import NavBar from "../../Components/NavabarAdmin"; // Thay NavBar bằng thành phần NavBar thật của bạn
import ManagementIndex from "./ManagementInfo";
import ManagementPassword from "./ManagementPassword";
import AddStudent from "./Add/AddStudent";
import AddTeacher from "./Add/AddTeacher";
import { Layout } from "antd";
import AddFaculty from "./Add/AddFaculty";
import AddSubject from "./Add/AddSubject";
import AddSemester from "./Add/AddSemester";
import AddClass from "./Add/AddClass";
import AddListStudentClass from "./Add/AddListStudentClass";

import ListStudent from "./List/ListStudent";
import ListTeacher from "./List/ListTeacher";
import ListSubject from "./List/ListSubject";
import ListSemester from "./List/ListSemester";
import ListFaculty from "./List/ListFaculty"; 
import ListClassLearn from "./List/ListClassLearn"; 
import ListClass from "./List/ListClass"; 





function App() {
  return (
    <Router>
      <Route
        render={(props) => (
          <>
            <Layout>
            <NavBar /> 
            <Layout style={{width:"80%"}}>

              <Route path="/" exact component={ManagementIndex} />
              <Route path="/ManagementPassword" exact component={ManagementPassword} />
              <Route path="/StudentAdd" exact component={AddStudent} />
              <Route path="/TeacherAdd" exact component={AddTeacher} />
              <Route path="/FacultyAdd" exact component={AddFaculty} />
              <Route path="/SubjectAdd" exact component={AddSubject} />
              <Route path="/SemesterAdd" exact component={AddSemester} />      
              <Route path="/ClassAdd" exact component={AddClass} />              
              <Route path="/ClassLearnAdd" exact component={AddListStudentClass} />     
              
              <Route path="/StudentList" exact component={ListStudent} />             
              <Route path="/TeacherList" exact component={ListTeacher} />   
              <Route path="/SubjectList" exact component={ListSubject} />              
              <Route path="/FacultyList" exact component={ListFaculty} />              
              <Route path="/SemesterList" exact component={ListSemester} />     
              <Route path="/ClassLearnList" exact component={ListClassLearn} />              
              <Route path="/ClassList" exact component={ListClass} />              



              {/* <Route path="/ClassLearnAdd" exact component={AddListStudentClass} />              
              <Route path="/ClassLearnAdd" exact component={AddListStudentClass} />              
              <Route path="/ClassLearnAdd" exact component={AddListStudentClass} />              
              <Route path="/ClassLearnAdd" exact component={AddListStudentClass} />              
              <Route path="/ClassLearnAdd" exact component={AddListStudentClass} />              
              <Route path="/ClassLearnAdd" exact component={AddListStudentClass} />               */}
            </Layout>
                       


            </Layout>
          </>
        )}
      />
    </Router>
  );
}

export default App;
