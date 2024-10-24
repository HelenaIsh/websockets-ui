import { Res } from '../types';
import { registerNewUser } from '../controllers/registration';
import { updateRoom } from '../controllers/rooms';

export default (type: Res, data: any, ws: any) => {
  switch (type) {
    case Res.reg:
      ws.send(registerNewUser(data));
      ws.send(updateRoom());
    default:
      () => {
        console.log('default');
      };
  }
};
