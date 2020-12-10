import React, { useEffect, useState } from "react"
import { Formik, Form, ErrorMessage, Field, setFieldValue } from "formik"
import Grid from '@material-ui/core/Grid';
import f from './f.png';
import m from './m.png';
import * as Yup from "yup"
import {
  TextField,
  makeStyles,
  withStyles,
  Button,
  Box,
  Typography,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  CircularProgress,
} from "@material-ui/core"
//css





//validation scehema
const validationSchema = Yup.object().shape({
  //message: Yup.string().required("Message is Required"),
  name: Yup.string().required("Name is required").max(15, "max 15 chars allowed"),
  //age: Yup.number().max(40, "Age should be less than 40").min(10, "ge should be more than 10"),
  gender: Yup.string().required("gender is required"),
  course: Yup.string().required("course is required"),      
  age: Yup.string().required("age is required")
      
})

export default function Home() {
  
  const [data, setData] = useState()
  //const [messages, setmessages] = useState()
  const [students, setStudents] = useState()
  const [updateData, setUpdateData] = useState()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isloading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  let updateStd;

  useEffect(() => {
    (async () => {
      await fetch(`/.netlify/functions/get`)
        .then(res => res.json())
        .then(data => {
            setStudents(data)            
        })
        console.log("students", students)
    })()
  }, [data, isloading, isDeleting, isUpdating])

  const handleDelete = (id) => {
    console.log(JSON.stringify(id))
    setIsDeleting(true)
    fetch("/.netlify/functions/delete", {
      method: "delete",
      body: JSON.stringify(id),
    })
      .then(res => res.json())
      .then(data => {
        console.log(data.name)
        setIsDeleting(false)
        
      })
  }
  const handleUpdate = (id) => {
    updateStd = students.find(std => std.ref["@ref"].id === id)
    setIsUpdating(true)
    setUpdateData(updateStd)
    
    //document.getElementById("age").innerText = updateStd.data.age
    //document.getElementById("gender").textContent= updateStd.data.gender
    //document.getElementById("course").textContent= updateStd.data.course
  }


  return (
    <div >
      <div >
        <Box pb={4}>
          <Typography
            align="center"
            variant="h5"
            
          >
            Register a Course
          </Typography>
        </Box>
        <Box display="flex" justifyContent="center" m={1} p={1} bgcolor="background.paper">
        <Formik
          enableReinitialize={true}
          validationSchema={validationSchema}
           
          initialValues={{      
              id:  !updateData ? "" : updateData.ref["@ref"].id,
            name: !updateData ? "" : updateData.data.name,
            age: !updateData ? "" : updateData.data.age,
            gender: !updateData ? "" : updateData.data.gender,
            course: !updateData ? "" : updateData.data.course,
          }}
          onSubmit={(values, actions) => {
            console.log(updateData)
            isUpdating ?(
                
                fetch(`/.netlify/functions/update`, {
                    method: "put",
                    body: JSON.stringify(values),
                  })
                    .then(response => response.json())
                    .then(data => {
                      setData(data)
                      console.log(data)
                    })
                    .catch(err => {
                        console.log(err)                    
                    })
                       
            )

            :(
            fetch(`/.netlify/functions/add`, {
                method: "post",
                body: JSON.stringify(values),
              })
                .then(response => response.json())
                .then(data => {
                  setData(data)
                  console.log(data)
                })
                .catch(err => {
                    console.log(err)                    
                }))
                setIsUpdating(false) 
                setUpdateData()
                actions.resetForm({
                    values: {
                      id: "",
                      name: "",
                      age: "",
                      gender: "",
                      course: "",
                    },
                  })
            }}
        >
          {formik => (
            <Form onSubmit={formik.handleSubmit}>
              
              <div>
                <Field                  
                  type="text"
                  as={TextField}                  
                  color="secondary"
                  variant="outlined"
                  label="Name"
                  name="name"                                    
                  id="name"                  
                />                
                  <ErrorMessage
                    name="name"
                    render={msg => <span style={{ color: "red" }}>{msg}</span>}
                  />                
              </div>
              <div>
                <Field                  
                  type="text"
                  as={TextField}                  
                  color="secondary"
                  variant="outlined"
                  label="Age"
                  name="age"
                  id="age"                  
                />                
                  <ErrorMessage
                    name="age"
                    render={msg => <span style={{ color: "red" }}>{msg}</span>}
                  />
               
              </div>
              <div >
              <FormControl style={{width:150}} >
                <InputLabel > &nbsp;&nbsp;Gender </InputLabel>
              
                <Field
                  
                  type="text"
                  as={Select}
                  color="secondary"
                  variant="outlined"
                  inputlabel="Gender"                  
                  name="gender"
                  id="gender"
                  
                >       
                     
            <MenuItem value="male" selected>Male</MenuItem>
             <MenuItem value="female">Female</MenuItem>
             
                </Field>
                </FormControl>  
                  <ErrorMessage
                    name="gender"
                    render={msg => <span style={{ color: "red" }}>{msg}</span>}
                  />   
                             
              </div>
              <div>
              <FormControl style={{width:230}} >
                <InputLabel > &nbsp;&nbsp;Course </InputLabel>
                <Field
                  
                  type="text"
                  as={Select}                  
                  color="secondary"
                  variant="outlined"
                  label="Course"
                  name="course"
                  id="course"
                  
                >                
                    <MenuItem value="Algorithm Analysis" selected>Algorithm Analysis</MenuItem>
                    <MenuItem value="Data Science">Data Science</MenuItem>
                    <MenuItem value="Responsive Web Design">Responsive Web Design</MenuItem>
                    <MenuItem value="Front End with React">Front End with React</MenuItem>
                </Field>
                </FormControl>    
                  <ErrorMessage
                    name="course"
                    render={msg => <span style={{ color: "red" }}>{msg}</span>}
                  />    
                            
              </div>
              <div>
                <Box mt={2}>
                  <Button
                    disableElevation
                    variant="contained"
                    color="secondary"
                    type="submit"
                    disabled={isloading ? true : false}
                    style={{ color: "white" }}
                  >
                    {isUpdating
                      
                    ? "Update"                      
                    : "Add New"}
                  </Button>
                </Box>
              </div>
            </Form>
          )}
        </Formik>
        </Box>
        <div style={{marginTop:'40px'}}>
         
            {!students ? (
              <div >
                {/* <CircularProgress color="secondary" /> */}
                <p> loading ..</p>
              </div>
            ) : (
              students.map(std => (
                <div
                  
                  key={std.ref["@ref"].id}
                >
                  
                  <Grid container spacing={3}>
                  <Grid item xs={1} md={3}></Grid>
                  <Grid item xs={1}>
                     { (std.data.gender == 'male') 
                        ? <img src={m} alt="male" width="60px"/>
                        : <img src={f} alt="female" width= "60px" />
                     }
                     </Grid>
                    <Grid item xs={1}>
                    {std.data.name}
                    </Grid>
                    <Grid item xs={1}>
                    {std.data.age}
                    </Grid>
                    <Grid item xs={2}>
                    {std.data.course}
                    </Grid>
                     
                    <Grid item xs={2}>
                    <Button                      
                      variant="contained"
                      color={"primary"}
                      size="small"
                      onClick={() => {
                        setIsUpdating(true)                          
                        handleUpdate(std.ref["@ref"].id)}
                    }
                    >
                      Edit
                    </Button>
                     </Grid>
                     <Grid item xs={2}>
                     <Button
                      variant="contained"
                      color={"secondary"}
                      onClick={() => handleDelete(std.ref["@ref"].id)}
                      size="small"                    
                      style={{ color: "white" }}
                    >                     
                      Delete
                    </Button>
                     </Grid>
                     
                 </Grid>         
                                
                      
                   
                   

                  
                </div>
              ))
            )}
         
        </div>
      </div>
    </div>
  )
}
