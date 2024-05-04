import React from 'react';
import ProjectCard from './ProjectCard';

export default function GithubRepoScreen({ projects }) {
  return (
    <div>
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
