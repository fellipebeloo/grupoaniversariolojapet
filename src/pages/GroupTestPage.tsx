import { GroupChatView } from '@/components/GroupChatView';
import { useNavigate } from 'react-router-dom';

const GroupTestPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return <GroupChatView onBack={handleBack} />;
};

export default GroupTestPage;