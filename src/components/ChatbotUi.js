import React, { useState } from 'react';
import axios from "axios";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import SendIcon from '@mui/icons-material/Send';
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { deepOrange, deepPurple } from '@mui/material/colors';


const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'wrap',
  width: 1,
});


const ChatBotUI = () => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [uploadedFileName, setUploadedFileName] = useState('');

  

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSend = () => {
    // Perform API request here
    setLoading(true);
    const temp = [{
        who: "User",
        text: inputText
    }];
    // Simulating API call with setTimeout
    let data = JSON.stringify({
        "question": inputText,
        "filename": uploadedFileName
    });

    let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://127.0.0.1:8000/answer-question',
    headers: { 
        'Content-Type': 'application/json'
    },
    data : data
    };

    axios(config)
    .then((response) => {
    console.log(JSON.stringify(response.data));
    temp.push({
        who: "AI",
        text: response.data.answer
    });
    setMessages([...messages, ...temp]);
    setInputText('');
    setLoading(false);
    })
    .catch((error) => {
    console.log(error);
    setLoading(false);
    setInputText('');
    });
  };

  const uploadFileOnServer = (file) => {
    console.log(file);
    let formData = new FormData();
    formData.append("file", file);
    let config = {
        method: 'post',
        url: 'http://127.0.0.1:8000/upload',
        headers: { 
            'Content-Type': 'multipart/form-data'
        },
        data : formData
    };

    axios(config).then((response) => {
    console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
    console.log(error);
    });
  }

  const handleFileUpload = (event) => {
    if (event.target.files.length === 0) {
        // No file selected
        return;
      }
    const file = event.target.files[0];
    uploadFileOnServer(file);
    setUploadedFileName(file.name);
  };
  return (
    
    <div className="chatgpt-ui">
        <AppBar position="static">
        <Container maxWidth="xl"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '50px',
        }}>
        <Typography
            variant="h6"
            sx={{
              mr: 2,
              display: 'inline-block',
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            DOC BASED LLM
          </Typography>
        
          
        <Button
            component="label"
            variant="filled"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            >
           Upload file
            <VisuallyHiddenInput type="file" onChange={handleFileUpload}/>
        </Button>
        </Container>
        </AppBar>
        <Box sx={{ margin:"20px", display: "flex", flexDirection: "column", width:"100%", height:"100%" }}>
  <Box sx={{ flexGrow: 1 }}>
    <Paper elevation={3} style={{ padding: '20px', margin: '20px 0' }}>
        <div style={{ marginBottom: '20px' }}>
        {uploadedFileName && <Typography
            sx={{
              mr: 2,
              marginBottom:2,
              display: 'inline-block',
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {uploadedFileName}
          </Typography>}
          <div style={{ overflowY: 'scroll', maxHeight: '300px', marginBottom: '10px' , marginTop:'10px'}}>
            {messages.map((message) => (
              <div style={{ display: 'flex', alignItems: 'center', mr:'10px' }}>
                {message.who == "AI" ?<Avatar sx={{ bgcolor: deepPurple[500], marginRight:"5px" }}>AI</Avatar>: <Avatar sx={{ bgcolor: deepOrange[500],marginRight:"5px" }}>U</Avatar> }
                <Typography variant="body1">
                    {message.text}
                </Typography>
               
              </div>
            ))}
          </div>
        {loading && <
        div style={{ textAlign: 'center' }}>
            <CircularProgress />
            <Typography variant="body1">Loading...</Typography>
          </div> }
        </div>
        </Paper>
  </Box>
  {uploadedFileName && (
    <Box sx={{ display: "flex", alignItems: "flex-center" }}>
      <TextField id="filled-basic" label="Send a Message" variant="outlined" fullWidth onChange={handleInputChange} />
      <Button endIcon={<SendIcon />} onClick={handleSend}></Button>
    </Box>
  )}
  {!uploadedFileName && (
    <Typography>Upload a File to send a User a Prompt</Typography>
  )}
     
        </Box>

    </div>
  );
};

export default ChatBotUI;