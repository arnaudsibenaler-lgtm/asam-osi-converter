import { getMovingObjectColor } from "@features/movingobjects";
import {
  MovingObject,
  MovingObject_Type,
  MovingObject_VehicleClassification_Type,
} from "@lichtblick/asam-osi-types";
import { DeepRequired } from "ts-essentials";

import { MOVING_OBJECT_COLOR, VEHICLE_TYPE_COLOR } from "@/config/constants";

function makeObject(
  type: MovingObject_Type,
  vehicleType?: MovingObject_VehicleClassification_Type,
): DeepRequired<MovingObject> {
  return {
    type,
    vehicle_classification: vehicleType != undefined ? { type: vehicleType } : undefined,
  } as unknown as DeepRequired<MovingObject>;
}

describe("OSI Visualizer: Moving object colors", () => {
  it("colors vehicles by their vehicle classification type", () => {
    const truck = getMovingObjectColor(
      makeObject(MovingObject_Type.VEHICLE, MovingObject_VehicleClassification_Type.HEAVY_TRUCK),
    );
    const bicycle = getMovingObjectColor(
      makeObject(MovingObject_Type.VEHICLE, MovingObject_VehicleClassification_Type.BICYCLE),
    );
    const car = getMovingObjectColor(
      makeObject(MovingObject_Type.VEHICLE, MovingObject_VehicleClassification_Type.CAR),
    );

    expect(truck).toEqual(VEHICLE_TYPE_COLOR[MovingObject_VehicleClassification_Type.HEAVY_TRUCK]);
    expect(bicycle).toEqual(VEHICLE_TYPE_COLOR[MovingObject_VehicleClassification_Type.BICYCLE]);
    expect(truck).not.toEqual(car);
    expect(bicycle).not.toEqual(car);
  });

  it("falls back to the moving object type color when vehicle classification is missing", () => {
    expect(getMovingObjectColor(makeObject(MovingObject_Type.VEHICLE))).toEqual(
      MOVING_OBJECT_COLOR[MovingObject_Type.VEHICLE],
    );
  });

  it("colors non-vehicle objects by their moving object type", () => {
    expect(getMovingObjectColor(makeObject(MovingObject_Type.PEDESTRIAN))).toEqual(
      MOVING_OBJECT_COLOR[MovingObject_Type.PEDESTRIAN],
    );
    expect(getMovingObjectColor(makeObject(MovingObject_Type.ANIMAL))).toEqual(
      MOVING_OBJECT_COLOR[MovingObject_Type.ANIMAL],
    );
  });

  it("defines a color for every vehicle classification type", () => {
    const values = Object.values(MovingObject_VehicleClassification_Type).filter(
      (v): v is MovingObject_VehicleClassification_Type => typeof v === "number",
    );
    for (const v of values) {
      expect(VEHICLE_TYPE_COLOR[v]).toBeDefined();
    }
  });
});
