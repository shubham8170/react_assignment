import { useEffect, useState } from "react";
import "./Admin.css";
import Card from 'react-bootstrap/Card';
import ReactJson from 'react-json-view';
import Contest from "./Contest";

import { getContest, getExpiredContest } from '../../api/admin';

export default function Contests() {
    const [contest, setContest] = useState([]);
    const [expiredcontest, setExpiredContest] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        getContest().then((data) => {
            setContest(data);
        });
        getExpiredContest().then((data) => {
            setExpiredContest(data);
        });
    }, [showModal]);

    const handleModal = ()=>{
        setShowModal(!showModal);
    }

    return (
        <div style={{ padding: "5vw" }}>
        <Contest showModal={showModal} setShowModal={setShowModal} />
            <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                <h1>Ongoing Contest</h1>
                <div className="fbutton" onClick={() => { }}>
                    <h1 className="buttonbox" onClick={handleModal}>Create Contest</h1>
                </div>
            </div>
            <hr style={{
                color: "black",
                backgroundColor: "black",
                height: "5px"
            }} />
            {contest.length ? (
                <div>
                    {contest.map((data, index) => (
                        <Card key={index} style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Title>{data.contestName}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                                <Card.Text>
                                    {data.contestDescription}
                                </Card.Text>
                                <Card.Text>
                                    Total number of round: {data.contestTotalround}
                                </Card.Text>
                                <Card.Text>
                                    Contest steps:
                                </Card.Text>
                                <ReactJson
                                    src={data.contestSteps}
                                    theme="monokai"
              collapsed={1}
              style={{
                backgroundColor: "black",
                color: "white",
                fontSize: "14px",
              }}
              enableClipboard={false}
              displayDataTypes={false}
              displayObjectSize={true}
              indentWidth={2}
              sortKeys={false}
              name={false}
                                />
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            ) : <h1>No contest available</h1>}


            <h1>Past Contest</h1>
            <hr style={{
                color: "black",
                backgroundColor: "black",
                height: "5px"
            }} />
            {expiredcontest.length ? (
                <>{expiredcontest.map((data, index) => (
                    <Card key={index} style={{ width: '18rem' }}>
                        <Card.Body>
                            <Card.Title>{data.contestName}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                            <Card.Text>
                                {data.contestDescription}
                            </Card.Text>
                            <Card.Text>
                                Total number of round: {data.contestTotalround}
                            </Card.Text>
                            <Card.Text>
                                Contest steps:
                            </Card.Text>
                            <ReactJson src={data.contestSteps} 
                                 theme="monokai"
              collapsed={1}
              style={{
                backgroundColor: "black",
                color: "white",
                fontSize: "14px",
              }}
              enableClipboard={false}
              displayDataTypes={false}
              displayObjectSize={true}
              indentWidth={2}
              sortKeys={false}
              name={false}
                            />
                            {/* <Card.Link href="#">Card Link</Card.Link>
                            <Card.Link href="#">Another Link</Card.Link> */}
                        </Card.Body>
                    </Card>
                ))}</>
            ) : <h1>No Expired contest available</h1>}
        </div>
    );
}
