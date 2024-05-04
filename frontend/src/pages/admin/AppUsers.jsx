import React, { useEffect, useState } from "react"
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import {getusers, suspendUser} from '../../api/admin'

export default function AppUsers() {
  const [usersList, setusersList] = useState([]);
  const [pageno, setpageno] = useState(0)
  useEffect(() => {
    getusers(pageno).then((data)=>{
      setusersList(...usersList, data);
    }).catch((err)=>{
      console.error(err.message)
    })
  }, [])

  const handleBlockuser = (userId)=>{
    suspendUser(userId).then((data)=>{
      console.log('Successfully suspended');
    }).catch((err)=>{
      console.error(err.message);
    })
  }
  
    return (<div style={{ padding: "5vw" }}>
      <h1>Platform Users</h1>
      <hr style={{
        color: "black",
        backgroundColor: "black",
        height: "5px"
      }} />
      {usersList.map((user,index)=>
        <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={user?.image} />
      <Card.Body>
        <Card.Title>{user?.name}</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Button variant="primary" onClick={(e)=>handleBlockuser(user?._id)}>Suspend</Button>
      </Card.Body>
    </Card>
      )}
      </div>)
  }