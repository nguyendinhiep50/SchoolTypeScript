import React from "react";
import { BrowserRouter as Router, Route, Switch, useLocation } from "react-router-dom";
import LayoutComponentManahement from "./Pages/Management/LayOutManagement";
import LayoutComponentStudent from "./Pages/Student/LayOutStudent";
import LayoutComponentTeacher from "./Pages/Teacher/LayOutTeacher";
import LogOut from "./Components/LogOut";
import NotFound from "./Components/NotFound";
import Login from "./Components/LoginAccount";
import ForgotPasswordAccoun from "./Components/ForgotPasswordAccoun";
import RegisterAccount from "./Components/RegisterAccount";


function App() {
  return (
    <Router>
      <Route path="/Management" component={LayoutComponentManahement} />
      {/* <Route path="/Management/ManagementPassword" exact={true} component={LayoutComponentManahement} />
      <Route path="/Management/StudentAdd" exact={true} component={LayoutComponentManahement} />
      <Route path="/Management/TeacherAdd" exact={true} component={LayoutComponentManahement} />
      <Route path="/Management/FacultyAdd" exact={true} component={LayoutComponentManahement} />
      <Route path="/Management/SubjectAdd" exact={true} component={LayoutComponentManahement} />
      <Route path="/Management/SemesterAdd" exact={true} component={LayoutComponentManahement} />
      <Route path="/Management/ClassAdd" exact={true} component={LayoutComponentManahement} />
      <Route path="/Management/ClassLearnAdd" exact={true} component={LayoutComponentManahement} />
      <Route path="/Management/StudentList" exact={true} component={LayoutComponentManahement} />

      <Route path="/Management/TeacherList" component={LayoutComponentManahement} />

      <Route path="/Management/SubjectList" exact={true} component={LayoutComponentManahement} />
      <Route path="/Management/FacultyList" exact={true} component={LayoutComponentManahement} />
      <Route path="/Management/SemesterList" exact={true} component={LayoutComponentManahement} />
      <Route path="/Management/ClassLearnList" exact={true} component={LayoutComponentManahement} />
      <Route path="/Management/ClassList" exact={true} component={LayoutComponentManahement} /> */}

      <Route path="/Student" component={LayoutComponentStudent} />
      <Route path="/Teacher" component={LayoutComponentTeacher} />
      <Route path="/LogOut" component={LogOut} />
      <Route path="/" exact={true} component={Login} />
      <Route path="/ForgotPasswordAccount" exact={true} component={ForgotPasswordAccoun} />
      <Route path="/RegisterAccount" exact={true} component={RegisterAccount} />

      <Route component={() => null} />
    </Router>
  );
}
export default App;
