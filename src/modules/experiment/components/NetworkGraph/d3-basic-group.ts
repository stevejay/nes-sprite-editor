import { GetOrSet } from "./types";

export interface IBasicGroup {
  (selection: d3.Selection<SVGElement, any, any, any>): d3.Selection<
    SVGElement,
    null,
    SVGElement,
    null
  >;

  class(): string;
  class(value: string): this;
}

export default function d3BasicGroup(): IBasicGroup {
  const data = [null];
  let className: string = "group";

  function renderer(selection: d3.Selection<SVGElement, any, any, any>) {
    let linksGroup = selection.selectAll("." + className).data(data);
    return (
      linksGroup
        .enter()
        .append("g")
        .classed(className, true)
        // @ts-ignore
        .merge(linksGroup)
    );
  }

  renderer.class = ((value?: string): string | IBasicGroup => {
    if (typeof value !== "undefined") {
      className = value;
      return renderer;
    }
    return className;
  }) as GetOrSet<string, IBasicGroup>;

  return renderer;
}
