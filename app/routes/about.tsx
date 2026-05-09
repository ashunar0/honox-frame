import { createRoute } from "honox/factory";
import About from "../pages/About";

export default createRoute((c) => {
  return c.render(About);
});
