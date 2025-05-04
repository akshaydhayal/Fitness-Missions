import { atom } from "recoil";

// Atom for user information
export const userState = atom({
  key: "userState", // unique ID (with respect to other atoms/selectors)
  default: null, // default value (aka initial value)
});

export const missionCount=atom({
    key:"missionCount",
    default:0
})
