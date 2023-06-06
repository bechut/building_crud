import { axiosCaller, BuildingCRUDInstance } from "./api";

export const apiNames = {
  buildings: {
    create: "create_building",
    detail: "detail_building",
  },
};

const metadata = [
  {
    root: "/buildings",
    instance: BuildingCRUDInstance,
    child: [
      {
        method: axiosCaller("post"),
        uri: "",
        name: apiNames.buildings.create,
      },
      {
        method: axiosCaller("get"),
        uri: "/:id",
        name: apiNames.buildings.detail,
      },
    ],
  },
];

export default metadata;