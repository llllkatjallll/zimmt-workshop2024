/* eslint-disable */
import { TypeStore } from "@needle-tools/engine"

// Import types
import { OSCSender } from "../OSCSender.js";
import { RangeAndViewTrigger } from "../RangeAndViewTrigger.js";

// Register types
TypeStore.add("OSCSender", OSCSender);
TypeStore.add("RangeAndViewTrigger", RangeAndViewTrigger);
