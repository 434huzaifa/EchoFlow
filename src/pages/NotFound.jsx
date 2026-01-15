import { useNavigate } from 'react-router-dom';
import { Result, Button } from 'antd';
import './NotFound.scss';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="not-found-container">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" size="large" onClick={handleGoHome}>
            Back Home
          </Button>
        }
      />
    </div>
  );
};

export default NotFound;
