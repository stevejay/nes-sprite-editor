import { NodeEntity, LinkEntity } from "../NetworkGraph";

export type CommunicationsNode = NodeEntity & {
  name: string;
  initials: string;
  type: "account" | "market";
  totalComms: number;
  commsDetail: {
    [key: string]: {
      name: string;
      count: number;
    };
  };
};

export type CommunicationsLink = LinkEntity & {
  comms: number;
};
