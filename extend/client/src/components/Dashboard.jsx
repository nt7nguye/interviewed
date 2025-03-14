import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Divider, Grid, Paper } from "@mui/material";
import axios from 'axios';
import { styled } from '@mui/material/styles';

const TxnItem = styled(Paper)(({ theme }) => ({
  backgroundColor: 'transparent',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: 'black',
  boxShadow: 'none',
  fontSize: 20,
}));


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: 'transparent',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: 'whitesmoke',
  boxShadow: 'none',
  fontSize: 20,
}));


export default function Dashboard({user, bearerToken}) {
  const [card, setCard] = useState({});
  const [txns, setTxns] = useState([]);

  const retrieveCard = async () => {
    try {
      const res = await axios({
        method: 'get',
        url: 'http://localhost:9000/api/virtualcards',
        headers: {
          'Authorization': 'Bearer ' + bearerToken,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.paywithextend.v2021-03-12+json',  
        }
      });
      setCard(res.data.virtualCards[0]); // hard code for one card
    } catch (e) {
      console.log(e);
    }
  }

  const retrieveTxns = async () => {
    try {
      const res = await axios({
        method: 'get',
        url: 'http://localhost:9000/api/virtualcards/' + card.id + '/transactions',
        headers: {
          'Authorization': 'Bearer ' + bearerToken,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.paywithextend.v2021-03-12+json',  
        }
      });
      setTxns(res.data.transactions);
    } catch (e) {
      console.log(e);
    }
  }

  // Render on bearer token updates
  useEffect(() => {
    retrieveCard()
  }, [bearerToken]);

  useEffect(() => {
    retrieveTxns()
  }, [card])

  return (
    <Container component="main" maxWidth="s" sx={{marginLeft: 10}}>
      <Box
        sx={{
          marginTop: 8,
          marginBottom: 8,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box>
          <Typography component="h1" variant="h4" align="left">
          Welcome back, 
            <Typography component="h2" variant="h4" fontWeight={600}>{user?.firstName}</Typography>
          </Typography>
        </Box>
        <Divider/> 
        <Box 
          sx={{
            marginTop: 4,
            display: 'flex',
            marginBottom: 5,
          }}
          >
          <Typography sx={{flexGrow: 1 }} component="h1" variant="h6" align="left" fontWeight={700}>
            Your card: {card.displayName}
          </Typography>

          <Typography sx={{flexGrow: 1}} component="h1" variant="h6" align="left" fontWeight={700}>
            Balance: US${(card.balanceCents/100)?.toFixed(2)} 
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1, marginBottom: 10 }}>
            <Grid container spacing={2} style={{
              backgroundImage: `url(${card.cardImageUrl})`,
              backgroundSize: 'contain',
              overflow: 'hidden',
              width: 500,
              height: 300,
            }}>
              <Grid item xs={12} sx={{ marginTop: 10}}>
                <Item>{user.firstName} {user.lastName}</Item>
              </Grid>
              <Grid item xs={12} sx={{ marginBottom: 0}}>
                  <Item>xxxx xxxx xxxx {card.last4}</Item>
              </Grid>
              <Grid item xs={5} sx={{ marginBottom: 0}}>
                  <Item>Expires: {card.expires?.slice(0,7)}</Item>
              </Grid>
              <Grid item xs={7} sx={{ marginBottom: 0}}>
                  <Item>CVC: xxx</Item>
              </Grid>
            </Grid>
        </Box>

        <Divider/> 
        <Box 
          sx={{
            marginTop: 4,
            display: 'flex'
          }}
          >
          <Typography component="h1" variant="h6" align="left" fontWeight={700}>
            Your transactions
          </Typography>
        </Box>
        <Box sx={{flexGrow:1}}>
          <Grid container spacing={2} style={{}}>
            <Grid item xs={3}>
              <TxnItem>Date</TxnItem>  
            </Grid>
            <Grid item xs={3}>
              <TxnItem>Merchant</TxnItem>  
            </Grid>
            <Grid item xs={3}>
              <TxnItem>References</TxnItem>  
            </Grid>
            <Grid item xs={3}>
              <TxnItem>Amount</TxnItem>  
            </Grid>
          {txns?.map((txn) => {return (
            <>
             <Grid item xs={3}>
              <TxnItem>{txn.authoredAt?.slice(0,10)}</TxnItem>  
            </Grid>
            <Grid item xs={3}>
              <TxnItem>{txn.merchantName}</TxnItem>  
            </Grid>
            <Grid item xs={3}>
              <TxnItem>- -</TxnItem>  
            </Grid>
            <Grid item xs={3}>
              <TxnItem>US${(txn.clearingBillingAmountCents/100)?.toFixed(2)} USD</TxnItem>  
            </Grid> 
            </>
          );})}
          </Grid> 
       </Box>
      </Box>
    </Container>
  );
}