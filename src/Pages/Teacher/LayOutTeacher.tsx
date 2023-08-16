import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Layout } from "antd";
import NavBar from "./Component/NavbarTeacher"; // Thay NavBar bằng thành phần NavBar thật của bạn 
import IndexTeacher from "./IndexTeacher"
import ChangePasswordTeacher from "./ChangePasswordTeacher"
import SubjectResgister from "./Component/ClassResgister"


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
                <Route path="/Teacher/SubjectResgister" exact={false} component={SubjectResgister} />

              </Layout>
            </Layout>
          </>
        )}
      />
    </Router>
  );
}

export default App;
