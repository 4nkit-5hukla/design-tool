import { v4 as uuid } from "uuid";

export const useId = () => ({
  generateId: () => uuid(),
});
