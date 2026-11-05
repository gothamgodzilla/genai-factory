import { localDev, placeholderAuth, vercelOidc } from "eve/channels/auth";
import { eveChannel } from "eve/channels/eve";

const authenticateLocal = localDev();

export default eveChannel({
  auth: [
    vercelOidc(),
    async (request) => {
      const caller = await authenticateLocal(request);
      return caller ? { ...caller, allowToolStubs: true } : null;
    },
    placeholderAuth(),
  ],
});
