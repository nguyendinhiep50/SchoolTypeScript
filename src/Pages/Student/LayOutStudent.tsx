import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Layout } from "antd";
import NavBar from "./Component/NavbarStudent"; // Thay NavBar bằng thành phần NavBar thật của bạn 
import IndexStudent from "./IndexStudent"
import ChangePasswordStudent from "./ChangePasswordStudent"
import SubjectResgister from "./SubjectStudent/SubjectResgister"


function App() {
  return (
    <Router>
      <Route
        render={(props) => (
          <>
            <Layout>
              <NavBar />
              <Layout style={{ width: "80%" }}>
                <Route path="/Student/IndexStudent" exact={false} component={IndexStudent} />
                <Route path="/Student/ChangePasswordStudent" exact={false} component={ChangePasswordStudent} />
                <Route path="/Student/SubjectResgister" exact={false} component={SubjectResgister} />

              </Layout>
            </Layout>
          </>
        )}
      />
    </Router>
  );
}

export default App;
