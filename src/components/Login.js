import { Input, TextField } from "@mui/material";
import React from "react";

const Login = () => {
  return (
    <div className="">
      <div className="card m-5">
        <div className="card-body">
          <div className="row">
            <div className="col-8 m-auto">
              <div className="row">
                <h1 className="title">Login</h1>
                <TextField className="my-3" label="Usuário" />
                <TextField label="Senha" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
