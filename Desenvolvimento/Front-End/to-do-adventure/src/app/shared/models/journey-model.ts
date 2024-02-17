import Mission from './mission-model';

interface Journey {
  id?: number;
  name?: string;
  missions?: Mission[];
}

export default Journey;
