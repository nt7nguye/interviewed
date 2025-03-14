import { useState } from 'react'
import  Calculator  from './components/calculator/Calculator'
import './App.css'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material'
import { Container } from '@mui/material'
import NavBar from './components/calculator/NavBar';
import axios from 'axios';

interface User {
  email: string;
  // TODO: Encrypt password before sending to backend
  password: string;
  // TODO: Convert to session token authentication
  //  token: string;
}

const App: React.FC = () => {
  const theme = createTheme({ 
    palette: {
      background: {
        default: '#4f5769',
      },
      text: {
        primary: '#e0e0e0',
      },
    }
  });

  const [user, setUser] = useState<User>({email: "", password: ""})
  const signOutHandler = () => {
    setUser({
      email:"",
      password:""
    })
  }

  const signInHandler = async (email: string, password: string): Promise<string> => {
    try { 
      const res = await axios({
        method: 'post',
        url: 'http://localhost:5000/signIn',
        data: {email: email, password: password}
      })
      if (res.status === 200) {
        if (res.data.success) {
          setUser({
            email: email,
            password: password
          })
          return "";
        } else {
          return res.data.message;
        }
      } else {
        return res.status + " " + res.statusText;
      }
    } catch (err) {
      return "Something went wrong";
    }
  }

  const signUpHandler = async (email: string, password: string): Promise<string> => {
    try {
      const res = await axios({
        method: 'post',
        url: 'http://localhost:5000/signUp',
        data: {email: email, password: password}
      })
      if (res.status === 200) {
        if (res.data.success) {
          setUser({
            email: email,
            password: password
          })
          return "";
        } else {
          return res.data.message;
        }
      } else {
        return res.status + " " + res.statusText;
      }
    } catch (err) {
      return "Something went wrong";
    } 
  }

  return (
    <ThemeProvider theme={theme}>
      <NavBar username={user.email} 
        signInHandler={signInHandler} 
        signUpHandler={signUpHandler}
        onSignOut={() => signOutHandler()}
      />
      <Container component="main" maxWidth="lg"> 
        <CssBaseline/>
        <Calculator/>
      </Container>
    </ThemeProvider>
  )
}

export default App
