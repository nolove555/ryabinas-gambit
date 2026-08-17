export type GameData = {
  id: string;
  players: string;
  white: string;
  black: string;
  event: string;
  category: string;
  rating: string;
};

export const games: GameData[] = [
  {
    id: "tal-vs-petrosian-1960",
    players: "Tal vs Petrosian",
    white: "Mikhail Tal",
    black: "Tigran Petrosian",
    event: "1960 Candidates",
    category: "Brilliant Attack",
    rating: "4.9",
  },

  {
    id: "kasparov-vs-topalov-1999",
    players: "Kasparov vs Topalov",
    white: "Garry Kasparov",
    black: "Veselin Topalov",
    event: "Wijk aan Zee 1999",
    category: "Deep Preparation",
    rating: "4.8",
  },

  {
    id: "carlsen-vs-anand-2014",
    players: "Carlsen vs Anand",
    white: "Magnus Carlsen",
    black: "Viswanathan Anand",
    event: "World Championship 2014",
    category: "Endgame Mastery",
    rating: "4.9",
  },

  {
    id: "fischer-vs-spassky-1972",
    players: "Fischer vs Spassky",
    white: "Bobby Fischer",
    black: "Boris Spassky",
    event: "Reykjavik 1972",
    category: "The Match of the Century",
    rating: "5.0",
  },

  {
    id: "karpov-vs-kasparov-1985",
    players: "Karpov vs Kasparov",
    white: "Anatoly Karpov",
    black: "Garry Kasparov",
    event: "Moscow 1985",
    category: "World Championship",
    rating: "4.8",
  },
];