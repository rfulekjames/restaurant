import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { noTablesWarningAndRedirect } from "../utils/window-methods";
import { LAYOUT_EDITOR_PATH } from "../components/Layout/Navigation";

export function useNoTableRedirect() {
  const tables = useSelector((state) => state.tables.tables);

  const history = useHistory();
  if (tables.length === 0) {
    noTablesWarningAndRedirect(LAYOUT_EDITOR_PATH, history);
  }
  return [tables, history];
}
