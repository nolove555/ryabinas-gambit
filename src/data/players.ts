export type PlayerData = {
  id: string;
  name: string;
  title: string;
  country: string;
  games: number;
  rating: string;
  description: string;
};

export const players: PlayerData[] = [
  {
    id: "mikhail-tal",
    name: "Mikhail Tal",
    title: "Grandmaster",
    country: "Latvia",
    games: 122,
    rating: "2705",
    description:
      "Known as the Magician from Riga, Tal built his chess around calculation, initiative, sacrifice, and positions that seemed to obey rules nobody else had been told about.",
  },

  {
    id: "jose-capablanca",
    name: "José Capablanca",
    title: "World Champion",
    country: "Cuba",
    games: 85,
    rating: "2725",
    description:
      "Capablanca was renowned for extraordinary positional clarity, technical precision, and an endgame technique that made complicated positions look almost embarrassingly simple.",
  },

  {
    id: "bobby-fischer",
    name: "Bobby Fischer",
    title: "World Champion",
    country: "United States",
    games: 67,
    rating: "2785",
    description:
      "Fischer combined brutal preparation with exceptional calculation and an uncompromising approach to competition.",
  },

  {
    id: "anatoly-karpov",
    name: "Anatoly Karpov",
    title: "World Champion",
    country: "Russia",
    games: 95,
    rating: "2780",
    description:
      "Karpov's chess was built around restriction, prophylaxis, positional pressure, and the slow accumulation of advantages that eventually became impossible to defend.",
  },

  {
    id: "magnus-carlsen",
    name: "Magnus Carlsen",
    title: "Grandmaster",
    country: "Norway",
    games: 210,
    rating: "2882",
    description:
      "Carlsen's strength combines extraordinary positional understanding, calculation, practical decision-making, and an almost pathological ability to keep positions alive.",
  },

  {
    id: "daniel-naroditsky",
    name: "Daniel Naroditsky",
    title: "Grandmaster",
    country: "United States",
    games: 74,
    rating: "2617",
    description:
      "Naroditsky was celebrated for his deep understanding of chess, exceptional instructional ability, and precise calculation across classical and online play.",
  },

  {
    id: "hikaru-nakamura",
    name: "Hikaru Nakamura",
    title: "Grandmaster",
    country: "United States",
    games: 88,
    rating: "2816",
    description:
      "Nakamura combines tactical sharpness, practical decision-making, rapid calculation, and elite speed across multiple formats of chess.",
  },

  {
    id: "boris-spassky",
    name: "Boris Spassky",
    title: "World Champion",
    country: "Russia",
    games: 56,
    rating: "2690",
    description:
      "Spassky was known for universal chess, combining tactical imagination with positional understanding and a remarkably flexible style.",
  },

  {
    id: "daniil-dubov",
    name: "Daniil Dubov",
    title: "Grandmaster",
    country: "Russia",
    games: 62,
    rating: "2702",
    description:
      "Dubov is known for unconventional opening ideas, dynamic positions, and a willingness to challenge established chess structures.",
  },

  {
    id: "judit-polgar",
    name: "Judit Polgar",
    title: "Grandmaster",
    country: "Hungary",
    games: 91,
    rating: "2735",
    description:
      "Polgar became the strongest woman in chess history and built her career on aggressive calculation, tactical awareness, and fearless competition.",
  },

  {
    id: "garry-kasparov",
    name: "Garry Kasparov",
    title: "World Champion",
    country: "Russia",
    games: 143,
    rating: "2851",
    description:
      "Kasparov combined extraordinary opening preparation, calculation, dynamic play, and relentless competitive energy to dominate elite chess for decades.",
  },
];