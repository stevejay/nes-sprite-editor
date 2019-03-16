import { SimulationWorkerEvent, SimulationWorkerResult } from "../NetworkGraph";
import commsNetworkGraphSimulation from "./comms-network-graph-simulation";

export default function commsNetworkGraphWorker(
  event: SimulationWorkerEvent
): SimulationWorkerResult {
  const { width, height, maxRadius, version } = event.data;
  const nodes = event.data.nodes;
  const links = event.data.links;
  const result = commsNetworkGraphSimulation(
    nodes,
    links,
    width,
    height,
    maxRadius
  );
  return { type: "end", nodes: result.nodes, links: result.links, version };
}
