import TableForm from "../components/Tables/TableForm";
import TableGrid from "../components//Tables/TableGrid";
import ModalWrapper from "../components/Layout/ModalWrapper";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";
import { useDispatch } from "react-redux";
import { useRedirect } from "../hooks/use-redirect";

function TablesLayoutEditorPage() {
  const [restaurantName, uid] = useRedirect();
  const freeTableId = useSelector((state) => state.tables.newTableId);
  const dispatch = useDispatch();
  const tableToEdit = useSelector((state) => state.ui.tableToEdit);

  const showTableModalHandler = (cellData) => {
    const tableData = {
      row: cellData.row,
      column: cellData.column,
      size: cellData.size,
      tableId: cellData.tableId ? cellData.tableId : freeTableId,
      isNewTable: cellData.tableId ? false : true,
    };
    dispatch(uiActions.setTableToEdit(tableData));
  };

  const updateCreateText =
    tableToEdit && !tableToEdit.isNewTable ? "Update" : "Create";

  const idTableText =
    tableToEdit && !tableToEdit.isNewTable ? "#" + tableToEdit.tableId : "";

  return (
    <Fragment>
      {tableToEdit && (
        <ModalWrapper
          title={`${updateCreateText} Table ${idTableText}`}
          description="Select the number of seats:"
        >
          <TableForm
            tableToEdit={tableToEdit}
            restaurantName={restaurantName}
          />
        </ModalWrapper>
      )}
      <TableGrid
        restaurantName={restaurantName}
        gridInfo={'Table Layout for'}
        userId={uid}
        onTableClick={showTableModalHandler}
        draggableCells={true}
      />
    </Fragment>
  );
}

export default TablesLayoutEditorPage;
