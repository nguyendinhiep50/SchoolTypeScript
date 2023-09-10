import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Layout } from "antd";
import NavBar from "./Component/NavbarTeacher"; // Thay NavBar bằng thành phần NavBar thật của bạn 
import IndexTeacher from "./IndexTeacher"
import ChangePasswordTeacher from "./ChangePasswordTeacher"
import ClassLearn from "./Component/ClassLearn"
import ListStudentClassLean from "./Component/ListStudentClassLean"



function App() {
  return (
    <Router>
      <Route
        render={(props) => (
          <>
            <Layout>
              <NavBar />
              <Layout style={{ width: "80%" }}>
                <Route path="/Teacher/IndexTeacher" exact={false} component={IndexTeacher} />
                <Route path="/Teacher/ChangePasswordTeacher" exact={false} component={ChangePasswordTeacher} />
                <Route path="/Teacher/ClassLearn" exact={false} component={ClassLearn} />
                <Route path="/Teacher/ListStudentClassLean" exact={false} component={ListStudentClassLean} />

              </Layout>
            </Layout>
          </>
        )}
      />
    </Router>
  );
}

export default App;
