import { createRoute } from "honox/factory";
import Home from "../pages/Home";

export default createRoute((c) => {
  return c.render(Home);
});
