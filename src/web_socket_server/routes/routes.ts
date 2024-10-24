import { Res } from "../types";
import { registerNewUser } from '../controllers/registration'

export default (type: Res, data: any) => {
  switch (type) {
    case Res.reg:
      return registerNewUser(data);
    default:
      () => {
        console.log('default');
      };
  }
};
