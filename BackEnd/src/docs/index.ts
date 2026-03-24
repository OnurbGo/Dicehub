import { userDocs } from "./userDocs";
import { authDocs } from "./authDocs";

export const allDocs = {
  ...userDocs,
  ...authDocs,
};
