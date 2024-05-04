import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function ProjectCard({project}) {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>{project.full_name}</Card.Title>
        <Card.Text>
          {project?.description || 'No Description present'}
        </Card.Text>
        <Card.Text> Default branch: 
          {project?.default_branch}
        </Card.Text>      </Card.Body>
    </Card>
  );
}

export default ProjectCard;