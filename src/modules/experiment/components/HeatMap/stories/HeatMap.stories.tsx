import { State, Store } from "@sambego/storybook-state";
import { withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import { includes, random, range, sumBy, clamp } from "lodash";
import * as React from "react";
import { host } from "storybook-host";
import "../../../../../index.scss";
import HeatMap, { HeatMapEntry } from "../HeatMap";

const storyHost = host({
  align: "center middle",
  backdrop: "#272936",
  width: "100%"
});

const RESPONSE = {
  aggregations: {
    hour_of_day: {
      buckets: [
        {
          key: 1,

          doc_count: 10,

          day_of_week: {
            buckets: [
              {
                key: 1,

                doc_count: 2,

                data_source: {
                  doc_count_error_upper_bound: 0,

                  sum_other_doc_count: 0,

                  buckets: [
                    {
                      key: "Bloomberg",

                      doc_count: 1
                    },

                    {
                      key: "Microsoft Exchange",

                      doc_count: 1
                    }
                  ]
                }
              },

              {
                key: 2,

                doc_count: 4,

                data_source: {
                  doc_count_error_upper_bound: 0,

                  sum_other_doc_count: 0,

                  buckets: [
                    {
                      key: "Microsoft Exchange",

                      doc_count: 2
                    },

                    {
                      key: "Bloomberg",

                      doc_count: 1
                    }
                  ]
                }
              },

              {
                key: 3,

                doc_count: 2,

                data_source: {
                  doc_count_error_upper_bound: 0,

                  sum_other_doc_count: 0,

                  buckets: [
                    {
                      key: "Bloomberg",

                      doc_count: 1
                    },

                    {
                      key: "Microsoft Exchange",

                      doc_count: 1
                    }
                  ]
                }
              },

              {
                key: 5,

                doc_count: 2,

                data_source: {
                  doc_count_error_upper_bound: 0,

                  sum_other_doc_count: 0,

                  buckets: [
                    {
                      key: "Microsoft Exchange",

                      doc_count: 2
                    }
                  ]
                }
              }
            ]
          }
        },

        {
          key: 8,

          doc_count: 48,

          day_of_week: {
            buckets: [
              {
                key: 1,

                doc_count: 9,

                data_source: {
                  doc_count_error_upper_bound: 0,

                  sum_other_doc_count: 0,

                  buckets: [
                    {
                      key: "Microsoft Exchange",

                      doc_count: 4
                    },

                    {
                      key: "Bloomberg",

                      doc_count: 3
                    },

                    {
                      key: "Verint",

                      doc_count: 1
                    }
                  ]
                }
              },

              {
                key: 2,

                doc_count: 9,

                data_source: {
                  doc_count_error_upper_bound: 0,

                  sum_other_doc_count: 0,

                  buckets: [
                    {
                      key: "Microsoft Exchange",

                      doc_count: 6
                    },

                    {
                      key: "Bloomberg",

                      doc_count: 3
                    }
                  ]
                }
              },

              {
                key: 3,

                doc_count: 9,

                data_source: {
                  doc_count_error_upper_bound: 0,

                  sum_other_doc_count: 0,

                  buckets: [
                    {
                      key: "Microsoft Exchange",

                      doc_count: 8
                    },

                    {
                      key: "Bloomberg",

                      doc_count: 1
                    }
                  ]
                }
              },

              {
                key: 4,

                doc_count: 11,

                data_source: {
                  doc_count_error_upper_bound: 0,

                  sum_other_doc_count: 0,

                  buckets: [
                    {
                      key: "Microsoft Exchange",

                      doc_count: 5
                    },

                    {
                      key: "Bloomberg",

                      doc_count: 3
                    },

                    {
                      key: "Verint",

                      doc_count: 1
                    }
                  ]
                }
              },

              {
                key: 5,

                doc_count: 10,

                data_source: {
                  doc_count_error_upper_bound: 0,

                  sum_other_doc_count: 0,

                  buckets: [
                    {
                      key: "Microsoft Exchange",

                      doc_count: 7
                    },

                    {
                      key: "Bloomberg",

                      doc_count: 3
                    }
                  ]
                }
              }
            ]
          }
        },

        {
          key: 9,

          doc_count: 300,

          day_of_week: {
            buckets: [
              {
                key: 1,

                doc_count: 61,

                data_source: {
                  doc_count_error_upper_bound: 0,

                  sum_other_doc_count: 0,

                  buckets: [
                    {
                      key: "Microsoft Exchange",

                      doc_count: 39
                    },

                    {
                      key: "Bloomberg",

                      doc_count: 18
                    },

                    {
                      key: "Verint",

                      doc_count: 1
                    }
                  ]
                }
              },

              {
                key: 2,

                doc_count: 73,

                data_source: {
                  doc_count_error_upper_bound: 0,

                  sum_other_doc_count: 0,

                  buckets: [
                    {
                      key: "Microsoft Exchange",

                      doc_count: 53
                    },

                    {
                      key: "Bloomberg",

                      doc_count: 7
                    },

                    {
                      key: "Verint",

                      doc_count: 2
                    }
                  ]
                }
              },

              {
                key: 3,

                doc_count: 48,

                data_source: {
                  doc_count_error_upper_bound: 0,

                  sum_other_doc_count: 0,

                  buckets: [
                    {
                      key: "Microsoft Exchange",

                      doc_count: 27
                    },

                    {
                      key: "Bloomberg",

                      doc_count: 13
                    },

                    {
                      key: "Verint",

                      doc_count: 2
                    }
                  ]
                }
              },

              {
                key: 4,

                doc_count: 64,

                data_source: {
                  doc_count_error_upper_bound: 0,

                  sum_other_doc_count: 0,

                  buckets: [
                    {
                      key: "Microsoft Exchange",

                      doc_count: 40
                    },

                    {
                      key: "Bloomberg",

                      doc_count: 11
                    },

                    {
                      key: "Verint",

                      doc_count: 3
                    }
                  ]
                }
              },

              {
                key: 5,

                doc_count: 54,

                data_source: {
                  doc_count_error_upper_bound: 0,

                  sum_other_doc_count: 0,

                  buckets: [
                    {
                      key: "Microsoft Exchange",

                      doc_count: 35
                    },

                    {
                      key: "Bloomberg",

                      doc_count: 6
                    },

                    {
                      key: "Verint",

                      doc_count: 3
                    }
                  ]
                }
              }
            ]
          }
        },

        {
          key: 10,

          doc_count: 61,

          day_of_week: {
            buckets: [
              {
                key: 1,

                doc_count: 11,

                data_source: {
                  doc_count_error_upper_bound: 0,

                  sum_other_doc_count: 0,

                  buckets: [
                    {
                      key: "Microsoft Exchange",

                      doc_count: 8
                    },

                    {
                      key: "Bloomberg",

                      doc_count: 2
                    }
                  ]
                }
              },

              {
                key: 2,

                doc_count: 18,

                data_source: {
                  doc_count_error_upper_bound: 0,

                  sum_other_doc_count: 0,

                  buckets: [
                    {
                      key: "Microsoft Exchange",

                      doc_count: 14
                    }
                  ]
                }
              },

              {
                key: 3,

                doc_count: 9,

                data_source: {
                  doc_count_error_upper_bound: 0,

                  sum_other_doc_count: 0,

                  buckets: [
                    {
                      key: "Microsoft Exchange",

                      doc_count: 6
                    },

                    {
                      key: "Bloomberg",

                      doc_count: 2
                    }
                  ]
                }
              },

              {
                key: 4,

                doc_count: 12,

                data_source: {
                  doc_count_error_upper_bound: 0,

                  sum_other_doc_count: 0,

                  buckets: [
                    {
                      key: "Microsoft Exchange",

                      doc_count: 10
                    }
                  ]
                }
              },

              {
                key: 5,

                doc_count: 11,

                data_source: {
                  doc_count_error_upper_bound: 0,

                  sum_other_doc_count: 0,

                  buckets: [
                    {
                      key: "Microsoft Exchange",

                      doc_count: 9
                    },

                    {
                      key: "Bloomberg",

                      doc_count: 1
                    }
                  ]
                }
              }
            ]
          }
        },

        {
          key: 11,

          doc_count: 25,

          day_of_week: {
            buckets: [
              {
                key: 1,

                doc_count: 9,

                data_source: {
                  doc_count_error_upper_bound: 0,

                  sum_other_doc_count: 0,

                  buckets: [
                    {
                      key: "Microsoft Exchange",

                      doc_count: 5
                    },

                    {
                      key: "Bloomberg",

                      doc_count: 3
                    }
                  ]
                }
              },

              {
                key: 2,

                doc_count: 3,

                data_source: {
                  doc_count_error_upper_bound: 0,

                  sum_other_doc_count: 0,

                  buckets: [
                    {
                      key: "Microsoft Exchange",

                      doc_count: 2
                    },

                    {
                      key: "Bloomberg",

                      doc_count: 1
                    }
                  ]
                }
              },

              {
                key: 3,

                doc_count: 3,

                data_source: {
                  doc_count_error_upper_bound: 0,

                  sum_other_doc_count: 0,

                  buckets: [
                    {
                      key: "Microsoft Exchange",

                      doc_count: 3
                    }
                  ]
                }
              },

              {
                key: 4,

                doc_count: 4,

                data_source: {
                  doc_count_error_upper_bound: 0,

                  sum_other_doc_count: 0,

                  buckets: [
                    {
                      key: "Bloomberg",

                      doc_count: 2
                    },

                    {
                      key: "Microsoft Exchange",

                      doc_count: 2
                    }
                  ]
                }
              },

              {
                key: 5,

                doc_count: 6,

                data_source: {
                  doc_count_error_upper_bound: 0,

                  sum_other_doc_count: 0,

                  buckets: [
                    {
                      key: "Microsoft Exchange",

                      doc_count: 3
                    },

                    {
                      key: "Bloomberg",

                      doc_count: 2
                    }
                  ]
                }
              }
            ]
          }
        },

        {
          key: 12,

          doc_count: 23,

          day_of_week: {
            buckets: [
              {
                key: 1,

                doc_count: 2,

                data_source: {
                  doc_count_error_upper_bound: 0,

                  sum_other_doc_count: 0,

                  buckets: [
                    {
                      key: "Bloomberg",

                      doc_count: 1
                    },

                    {
                      key: "Microsoft Exchange",

                      doc_count: 1
                    }
                  ]
                }
              },

              {
                key: 2,

                doc_count: 2,

                data_source: {
                  doc_count_error_upper_bound: 0,

                  sum_other_doc_count: 0,

                  buckets: [
                    {
                      key: "Microsoft Exchange",

                      doc_count: 2
                    }
                  ]
                }
              },

              {
                key: 3,

                doc_count: 8,

                data_source: {
                  doc_count_error_upper_bound: 0,

                  sum_other_doc_count: 0,

                  buckets: [
                    {
                      key: "Microsoft Exchange",

                      doc_count: 4
                    },

                    {
                      key: "Bloomberg",

                      doc_count: 3
                    }
                  ]
                }
              },

              {
                key: 4,

                doc_count: 8,

                data_source: {
                  doc_count_error_upper_bound: 0,

                  sum_other_doc_count: 0,

                  buckets: [
                    {
                      key: "Microsoft Exchange",

                      doc_count: 6
                    }
                  ]
                }
              },

              {
                key: 5,

                doc_count: 3,

                data_source: {
                  doc_count_error_upper_bound: 0,

                  sum_other_doc_count: 0,

                  buckets: [
                    {
                      key: "Microsoft Exchange",

                      doc_count: 3
                    }
                  ]
                }
              }
            ]
          }
        },

        {
          key: 13,

          doc_count: 4,

          day_of_week: {
            buckets: [
              {
                key: 2,

                doc_count: 1,

                data_source: {
                  doc_count_error_upper_bound: 0,

                  sum_other_doc_count: 0,

                  buckets: [
                    {
                      key: "Microsoft Exchange",

                      doc_count: 1
                    }
                  ]
                }
              },

              {
                key: 3,

                doc_count: 1,

                data_source: {
                  doc_count_error_upper_bound: 0,

                  sum_other_doc_count: 0,

                  buckets: [
                    {
                      key: "Microsoft Exchange",

                      doc_count: 1
                    }
                  ]
                }
              },

              {
                key: 4,

                doc_count: 1,

                data_source: {
                  doc_count_error_upper_bound: 0,

                  sum_other_doc_count: 0,

                  buckets: [
                    {
                      key: "Microsoft Exchange",

                      doc_count: 1
                    }
                  ]
                }
              },

              {
                key: 5,

                doc_count: 1,

                data_source: {
                  doc_count_error_upper_bound: 0,

                  sum_other_doc_count: 0,

                  buckets: [
                    {
                      key: "Microsoft Exchange",

                      doc_count: 1
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  }
};

const HOURS_IN_DAY = 24;
const DAYS_IN_WEEK = 7;

function responseParser(response: any): Array<HeatMapEntry | null> {
  const result: Array<HeatMapEntry | null> = range(
    0,
    HOURS_IN_DAY * DAYS_IN_WEEK
  ).map(() => null);
  let maxTotal = 0;

  const hoursOfDay = response.aggregations.hour_of_day.buckets || [];
  hoursOfDay.forEach((hourOfDay: any) => {
    const daysOfWeek = hourOfDay.day_of_week.buckets || [];
    daysOfWeek.forEach((dayOfWeek: any) => {
      const totalDocCount = dayOfWeek.doc_count || 0;
      if (totalDocCount > maxTotal) {
        maxTotal = totalDocCount;
      }
      const sources = dayOfWeek.data_source.buckets || [];
      const totalSourcesCount = sumBy(
        sources,
        (source: any) => source.doc_count || 0
      );
      const resultIndex = (+dayOfWeek.key - 1) * HOURS_IN_DAY + +hourOfDay.key;

      const item = {
        id: `${dayOfWeek.key}-${hourOfDay.key}`,
        count: totalDocCount,
        normalisedCount: 0.1,
        details: sources.map((source: any) => ({
          id: source.key,
          count: source.doc_count
        }))
      };

      if (totalDocCount > totalSourcesCount) {
        item.details.push({
          id: "Other",
          count: totalDocCount - totalSourcesCount
        });
      }

      result[resultIndex] = item;
    });
  });

  result.forEach(element => {
    if (!element) {
      return;
    }
    element.normalisedCount = clamp(element.count / maxTotal, 0, 1);
  });

  return result;
}

let count = 0;

function generateData() {
  const result = responseParser(RESPONSE);
  result.forEach(datum => {
    if (datum) {
      datum.normalisedCount = random(0, 1, true);
    }
  });
  if (count % 2 === 1) {
    result[0] = {
      id: "0-0",
      count: 44,
      normalisedCount: 0.8,
      details: []
    };
  }
  ++count;
  return result;
}

const store = new Store<{
  data: Array<HeatMapEntry | null>;
  selectedIds: Array<HeatMapEntry["id"]>;
}>({
  data: [],
  selectedIds: []
});

const X_LABELS = [
  "1",
  "",
  "",
  "",
  "",
  "6",
  "",
  "",
  "",
  "",
  "",
  "12",
  "",
  "",
  "",
  "",
  "",
  "18",
  "",
  "",
  "",
  "",
  "",
  "24"
];

const Y_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

storiesOf("SteelEye/HeatMap", module)
  .addDecorator(storyHost)
  .addDecorator(withKnobs)
  .add("Basic", () => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button
        onClick={() => store.set({ data: generateData() })}
        style={{ marginBottom: 30, maxWidth: 100 }}
      >
        New Data
      </button>
      <div>
        <State store={store}>
          {state => (
            <HeatMap
              data={state.data}
              xLabels={X_LABELS}
              yLabels={Y_LABELS}
              selectedIds={state.selectedIds}
              onTileClick={tile => {
                let newSelectedIds = state.selectedIds.slice();
                if (includes(newSelectedIds, tile.id)) {
                  newSelectedIds = newSelectedIds.filter(x => x !== tile.id);
                } else {
                  newSelectedIds.push(tile.id);
                }
                store.set({ selectedIds: newSelectedIds });
              }}
            />
          )}
        </State>
      </div>
    </div>
  ));
