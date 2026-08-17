export type GameData = {
  id: string;
  players: string;
  white: string;
  black: string;
  event: string;
  category: string;
  rating: string;
  pgn: string;
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

    pgn: `[Event "Candidates Tournament"]
[Site "Amsterdam"]
[Date "1960.??.??"]
[Round "?"]
[White "Mikhail Tal"]
[Black "Tigran Petrosian"]
[Result "*"]

1. e4 c6 2. d4 d5 3. Nc3 dxe4 4. Nxe4 Bf5 5. Ng3 Bg6 6. N1e2 e6 7. h4 h6 8. Nf4 Bh7 9. Bc4 Nf6 10. Qe2 Bd6 *`,
  },

  {
    id: "kasparov-vs-topalov-1999",
    players: "Kasparov vs Topalov",
    white: "Garry Kasparov",
    black: "Veselin Topalov",
    event: "Wijk aan Zee 1999",
    category: "Deep Preparation",
    rating: "4.8",

    pgn: `[Event "Hoogovens"]
[Site "Wijk aan Zee"]
[Date "1999.01.20"]
[Round "?"]
[White "Garry Kasparov"]
[Black "Veselin Topalov"]
[Result "*"]

1. e4 d6 2. d4 Nf6 3. Nc3 g6 4. Be3 Bg7 5. Qd2 O-O 6. O-O-O c6 7. f3 b5 8. Bb3 Nbd7 *`,
  },

  {
    id: "carlsen-vs-anand-2014",
    players: "Carlsen vs Anand",
    white: "Magnus Carlsen",
    black: "Viswanathan Anand",
    event: "World Championship 2014",
    category: "Endgame Mastery",
    rating: "4.9",

    pgn: `[Event "World Championship"]
[Site "Sochi"]
[Date "2014.11.08"]
[Round "1"]
[White "Magnus Carlsen"]
[Black "Viswanathan Anand"]
[Result "*"]

1. e4 c5 2. Nf3 Nc6 3. Bb5 g6 4. Bxc6 dxc6 5. d3 Bg7 6. h3 Nf6 7. Nc3 Nd7 *`,
  },

  {
    id: "fischer-vs-spassky-1972",
    players: "Fischer vs Spassky",
    white: "Bobby Fischer",
    black: "Boris Spassky",
    event: "Reykjavik 1972",
    category: "The Match of the Century",
    rating: "5.0",

    pgn: `[Event "World Championship"]
[Site "Reykjavik"]
[Date "1972.07.11"]
[Round "3"]
[White "Bobby Fischer"]
[Black "Boris Spassky"]
[Result "*"]

1. c4 Nf6 2. Nf3 g6 3. g3 Bg7 4. Bg2 O-O 5. d4 d6 6. Nc3 Nbd7 *`,
  },

  {
    id: "karpov-vs-kasparov-1985",
    players: "Karpov vs Kasparov",
    white: "Anatoly Karpov",
    black: "Garry Kasparov",
    event: "Moscow 1985",
    category: "World Championship",
    rating: "4.8",

    pgn: `[Event "World Championship"]
[Site "Moscow"]
[Date "1985.??.??"]
[Round "?"]
[White "Anatoly Karpov"]
[Black "Garry Kasparov"]
[Result "*"]

1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. f3 O-O 6. Be3 e5 7. d5 c6 *`,
  },
];