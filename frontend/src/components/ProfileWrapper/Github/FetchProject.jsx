import React, { useState } from "react";
import { getGitProject } from "../../../api";
import GithubRepoScreen from "./GithubRepoScreen";
import { useSelector, useDispatch } from "react-redux";
import { storeProject } from "../../../Redux/slices/githubprojects";
import { Button,Form, FormGroup, FormControl, Row, Col  } from 'react-bootstrap';

export default function FetchProject() {
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [isHidden, setIsHidden] = useState(true);
  const [projectData, setprojectData] = useState([]);
  const weatherData = useSelector((state) => state.github?.data);
  const dispatch = useDispatch();
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(username, token);
    const result = await getGitProject(username, token);
    dispatch(storeProject(result));
    setprojectData(result);
    setIsHidden(false);

    //   onSubmit({ username, token });
  };

  const handleClick = () => {
    setIsHidden(!isHidden);
  };

  return (
    <div>
            <Button onClick={handleClick} style={{ marginLeft: '15px', padding: '5px' }}>Click to fetch GitHub project</Button>
            {!isHidden && (
                <Row>
                    <Col>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Form.Label>GitHub Username:</Form.Label>
                                <FormControl
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Form.Label>GitHub Personal Access Token:</Form.Label>
                                <FormControl
                                    type="text"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    required
                                />
                            </FormGroup>
                            <Button type="submit">Submit</Button>
                        </Form>
                    </Col>
                </Row>
            )}
            {projectData ? <GithubRepoScreen projects={projectData} /> : null}
        </div>
  );
}
