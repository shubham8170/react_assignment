import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './Contest.css'
import {createContest} from '../../api/admin'

export default function Contest({showModal, setShowModal}) {
    const [contestData, setContestData] = useState({
      name: '',
      description: '',
      expiration: '',
      totalRounds: 1,
      rounds: [{ likes: '', expireAt: '' }],
    });
  
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
  
    const handleInputChange = (e, index) => {
      const { name, value } = e.target;
      const updatedRounds = [...contestData.rounds];
      updatedRounds[index][name] = value;
  
      setContestData({
        ...contestData,
        rounds: updatedRounds,
      });
    };
  
    const handleAddRound = () => {
      setContestData({
        ...contestData,
        rounds: [...contestData.rounds, { likes: '', expireAt: '' }],
      });
    };
  
    const handleCreateContest = () => {
        if (
            contestData.name.trim() === '' ||
            contestData.description.trim() === '' ||
            contestData.expiration === '' ||
            contestData.totalRounds < 1
        ) {
            alert('Please fill in all required fields.');
            return;
        }
      // Handle creating the contest with contestData
      console.log(contestData);
      const contestPayload = {
        contestName: contestData.name,
        contestDescription: contestData.description,
        expireAt: contestData.expiration,
        contestTotalround: contestData.rounds.length,
        contestSteps: contestData.rounds
      }
      createContest(contestPayload).then((data)=>{
        console.log('contest created');
      }).catch((err)=>{
        console.error(err.message);
      })
      handleCloseModal();
    };
  
    return (
      <div className="create_contest">
      
  
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Create Contest</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="contestName" style={{alignItems:'center', textAlign:'center'}}>
                <Form.Label style={{fontSize:'18px', fontWeight:'800'}} >Contest Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={contestData.name}
                  onChange={(e) => setContestData({ ...contestData, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="contestDescription">
                <Form.Label style={{fontSize:'18px', fontWeight:'800'}} >Contest Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  style={{border:'1px solid black', borderRadius:'5px'}}
                  value={contestData.description}
                  onChange={(e) => setContestData({ ...contestData, description: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="contestExpiration">
                <Form.Label style={{fontSize:'18px', fontWeight:'800'}}>Contest Expiration Date</Form.Label>
                <Form.Control tyle={{border:'1px solid red'}}
                  type="date"
                  name="expiration"
                  value={contestData.expiration}
                  onChange={(e) => setContestData({ ...contestData, expiration: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="contestRounds">
                <Form.Label style={{fontSize:'18px', fontWeight:'800'}}  >Total Number of Rounds</Form.Label>
                <Form.Control style={{border:'1px solid red', fontSize:'16px'}}
                  type="number"
                  min="1"
                  name="totalRounds"
                  value={contestData.totalRounds}
                  onChange={(e) => setContestData({ ...contestData, totalRounds: e.target.value })}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label style={{fontSize:'18px', fontWeight:'800'}}  >Rounds</Form.Label>
                {contestData.rounds.map((round, index) => (
                  <div key={index}>
                    <Form.Group controlId={`roundLikes${index}`}>
                      <Form.Label style={{fontSize:'18px', fontWeight:'800'}}  >Likes Needed for Round {index + 1}</Form.Label>
                      <Form.Control style={{border:'1px solid red', fontSize:'16px'}}
                        type="number"
                        min="1"
                        name="likes"
                        value={round.likes}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    </Form.Group>
                    <Form.Group controlId={`roundExpiration${index}`}>
                      <Form.Label style={{fontSize:'18px', fontWeight:'800'}}  >Round Expiration Date for Round {index + 1}</Form.Label>
                      <Form.Control
                        type="date"
                        name="expireAt"
                        value={round.expireAt}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    </Form.Group>
                  </div>
                ))}
                <Button variant="secondary" onClick={handleAddRound} style={{fontSize:'18px', fontWeight:'800'}}  >
                  Add Round
                </Button>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer style={{display:'flex', justifyContent:'space-around'}}>
            <Button variant="secondary" onClick={handleCloseModal}
            style={{cursor:'pointer',
            border:'1px solid black', borderRadius:'5px', fontSize:'18px',padding:'2px', color:'red'
            }}
            >
              Close
            </Button>
            <Button variant="primary" onClick={handleCreateContest} style={{cursor:'pointer',
            border:'1px solid red', borderRadius:'5px', fontSize:'18px',padding:'2px'
            }}>
              Create Contest
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
