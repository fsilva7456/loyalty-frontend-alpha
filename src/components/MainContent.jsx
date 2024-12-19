import { useGlobal } from '../context/GlobalContext';
import Welcome from './Welcome';
import StepScreen from './StepScreen';

export default function MainContent() {
  const { companyName } = useGlobal();
  return companyName ? <StepScreen /> : <Welcome />;
}