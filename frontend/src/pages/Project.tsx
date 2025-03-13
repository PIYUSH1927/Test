import React, {useEffect} from 'react';
import { useNavigate} from 'react-router-dom';
import './Project.css';

export default function Project() {
  const navigate = useNavigate();

  useEffect(() => {
    const hasRefreshed = sessionStorage.getItem('projectPageRefreshed');
    if (!hasRefreshed) {
      sessionStorage.setItem('projectPageRefreshed', 'true');
      window.location.reload();
    }
  }, []);

  const handleCreateProject = () => {
    sessionStorage.removeItem('projectPageRefreshed');
    navigate('/playground');
  };



  return (
    <div className="project-header">
      <h1 className="project-title">Projects</h1>
      <button className="create-project-btn" onClick={handleCreateProject}>
        <span className="plus-sign">+</span> New Project
      </button>
    </div>
  );
}
