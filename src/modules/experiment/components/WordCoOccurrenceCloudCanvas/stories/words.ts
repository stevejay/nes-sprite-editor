import { random, sampleSize, reverse, sortBy } from "lodash";
import { WordCloudNode } from "../../WordCloudCanvasChart";

const WORDS = [
  "rich",
  "battlefield",
  "lip",
  "screw",
  "experiment",
  "frog",
  "flower",
  "sermon",
  "screen",
  "report",
  "direction",
  "survivor",
  "attitude",
  "feeling",
  "difference",
  "kidnap",
  "appetite",
  "confrontation",
  "guide",
  "confine",
  "health",
  "parade",
  "perception",
  "impact",
  "slab",
  "evening",
  "teacher",
  "lily",
  "dip",
  "avenue",
  "bill",
  "victory",
  "marsh",
  "describe",
  "exploration",
  "despair",
  "autonomy",
  "salvation",
  "notice",
  "species",
  "impound",
  "conglomerate",
  "exhibition",
  "nominate",
  "shed",
  "format",
  "harmony",
  "integrity",
  "cycle",
  "advice",
  "begin",
  "texture",
  "dictate",
  "dedicate",
  "carrot",
  "craftsman",
  "introduction",
  "acceptance",
  "slime",
  "tradition",
  "contradiction",
  "insure",
  "organisation",
  "bake",
  "challenge",
  "sacred",
  "bald",
  "mile",
  "accept",
  "charismatic",
  "critical",
  "tolerate",
  "miner",
  "session",
  "route",
  "snub",
  "basic",
  "outlet",
  "steel",
  "novel",
  "tourist",
  "important",
  "symbol",
  "window",
  "criminal",
  "pasture",
  "husband",
  "satisfied",
  "contain",
  "tactic",
  "engagement",
  "past",
  "alarm",
  "pick",
  "cheese",
  "surprise",
  "clearance",
  "decay",
  "station",
  "commission",
  "unpleasant",
  "complete",
  "fool around",
  "gain",
  "interface",
  "revolutionary",
  "conservation",
  "policeman",
  "stall",
  "audience",
  "sense",
  "young",
  "art",
  "part",
  "dash",
  "determine",
  "response",
  "bend",
  "crisis",
  "bury",
  "notion",
  "bargain",
  "economist",
  "dry",
  "occasion",
  "see",
  "thought",
  "structure",
  "entitlement",
  "wording",
  "eaux",
  "vegetation",
  "line",
  "rise",
  "failure",
  "rain",
  "lack",
  "productive",
  "technique",
  "railroad",
  "unaware",
  "oak",
  "moral",
  "manufacture",
  "sandwich",
  "due",
  "power",
  "essential",
  "question",
  "flood",
  "poor",
  "turn",
  "waiter",
  "strict",
  "civilian",
  "fight",
  "shortage",
  "fisherman",
  "joke",
  "close",
  "first",
  "paralyzed",
  "publisher",
  "digress",
  "jaw",
  "blackmail",
  "will",
  "finished",
  "detail",
  "means",
  "reduce",
  "bowel",
  "cottage",
  "hesitate",
  "request",
  "mislead",
  "catalogue",
  "possession",
  "neighborhood",
  "guideline",
  "fee",
  "advertising",
  "architect",
  "price",
  "equal",
  "econobox",
  "loot",
  "reptile",
  "fixture",
  "stunning",
  "dull",
  "rider",
  "dirty",
  "cell phone",
  "brainstorm",
  "regular",
  "entry",
  "aware",
  "construct",
  "celebration",
  "well",
  "dynamic",
  "understand",
  "diamond",
  "direct",
  "tissue",
  "program",
  "voter",
  "absolute",
  "pain",
  "pill",
  "mixture",
  "card",
  "pleasure",
  "mourning",
  "short",
  "ring",
  "coverage",
  "ferry",
  "domestic",
  "champion",
  "surround",
  "crosswalk",
  "enter",
  "dictionary",
  "serve",
  "spend",
  "crack",
  "user",
  "crown",
  "appointment",
  "illness",
  "stable",
  "racism",
  "laundry",
  "fit",
  "prayer",
  "express",
  "likely",
  "colon",
  "orientation",
  "sensation",
  "guilt",
  "text",
  "relative",
  "cake",
  "education",
  "product",
  "light",
  "surface",
  "responsibility",
  "spectrum",
  "warn",
  "speech",
  "wreck",
  "feather",
  "doll",
  "hierarchy",
  "shot",
  "tap",
  "industry",
  "pawn",
  "bench",
  "say",
  "stand",
  "reception",
  "voyage",
  "opposite",
  "letter",
  "referee",
  "constellation",
  "tone",
  "invite",
  "design",
  "leg",
  "absence",
  "jam",
  "define",
  "model",
  "suit",
  "snatch",
  "riot",
  "remunerate",
  "tract",
  "fog",
  "map",
  "circle",
  "ex",
  "court",
  "butterfly",
  "presidential",
  "defeat",
  "produce",
  "expression",
  "parachute",
  "comfortable",
  "mechanical",
  "cap",
  "funeral",
  "closed"
];

function getRandomValue() {
  switch (random(0, 4)) {
    case 0:
      return random(1, 25);
    case 1:
      return random(26, 75);
    case 2:
      return random(76, 150);
    case 3:
      return random(151, 250);
    case 4:
      return random(251, 500);
    default:
      throw new Error("oops");
  }
}

export default function generateWordCloudNodes(count: number) {
  let words = sampleSize(
    WORDS.filter((v, i, a) => a.indexOf(v) === i),
    count
  ).map(
    text =>
      ({
        id: text,
        text,
        value: getRandomValue()
      } as WordCloudNode)
  );
  words = reverse(sortBy(words, word => word.value));
  return words;
}