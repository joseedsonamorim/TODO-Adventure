interface Mission {
  id?: number;
  nomeDaJornada?: string,
  title: string;
  description: string;
  deadline: string;
  difficulty: string;
  status?: string;
  runningTime?: string;
}

export default Mission;
