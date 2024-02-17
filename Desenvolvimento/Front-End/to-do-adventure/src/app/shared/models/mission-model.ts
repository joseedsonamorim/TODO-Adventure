interface Mission {
  id: number;
  title: string;
  description: string;
  deadline: string;
  difficulty: string;
  status?: string;
  runningTime?: string;
}

export default Mission;
