import React, { useEffect, useState } from "react";
import './App.css';
import SignIn from "./components/SignIn";
import Dashboard from "./components/Dashboard";
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, GlobalStyles } from "@mui/material";


export default function App() {
  const [bearerToken, setBearerToken] = useState('');
  const [user, setUser] = useState({});
  const theme = createTheme();

  const auth = async (email, password) => {
    try {
      const res = await axios({
        method: 'post',
        url: 'http://localhost:9000/api/auth', 
        data: { email: email, password: password}
      });
      setUser(res.data);
      setBearerToken(res.data.token);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    auth("", "");
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* <GlobalStyles
        styles={{
          body: { backgroundColor: "cyan" }
        }}
      /> */}
      <div className="App">
      {bearerToken===''? <SignIn auth={auth}/>:<Dashboard user={user} bearerToken={bearerToken}/>}
      </div>
    </ThemeProvider>
  );
}