// src/components/ProgressBar.tsx
import { 
  NewsIcon, 
  CreditCardIcon, 
  BusinessIcon, 
  TravelIcon, 
  AirlineIcon, 
  HotelIcon, 
  CruiseIcon 
} from './ProgressIcons';

interface Step {
  label: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  { label: 'News', icon: <NewsIcon /> },
  { label: 'Credit Cards', icon: <CreditCardIcon /> },
  { label: 'Business', icon: <BusinessIcon /> },
  { label: 'Travel', icon: <TravelIcon /> },
  { label: 'Airlines', icon: <AirlineIcon /> },
  { label: 'Hotels', icon: <HotelIcon /> },
  { label: 'Cruises', icon: <CruiseIcon /> }
];

interface ProgressBarProps {
  currentStep: number;
}

export const ProgressBar = ({ currentStep }: ProgressBarProps) => {
  return (
    <div className="progress-bar">
      {steps.map((step, index) => (
        <div 
          key={step.label}
          className={`step ${index <= currentStep ? 'completed' : ''}`}
        >
          <div className="icon">{step.icon}</div>
          <div className="label">{step.label}</div>
        </div>
      ))}
    </div>
  );
};
