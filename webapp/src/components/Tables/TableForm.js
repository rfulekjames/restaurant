import { useDispatch } from "react-redux";
import { setTable, removeTable } from "../../store/tables-actions";
import { confirmAction } from "../../utils/window-methods";
import { uiActions } from "../../store/ui-slice";
import { useRef } from "react";

function TableForm(props) {
  const dispatch = useDispatch();
  const tableSizeInputRef = useRef();

  const restaurantName = props.restaurantName;
  const tableToEdit = props.tableToEdit;

  const getNewTable = () => {
    const chosenTableSize = +tableSizeInputRef.current.value;
    const newTable = {
      id: tableToEdit.tableId,
      size: chosenTableSize,
      row: tableToEdit.row,
      column: tableToEdit.column,
      restaurantName: restaurantName,
    };
    return newTable;
  };

  const cancelHandler = (event) => {
    event.preventDefault();
    dispatch(uiActions.dismissTableToEdit());
  };

  const deleteHandler = (event) => {
    event.preventDefault();
    confirmAction(
      "Are you sure you want to delete Table #" + tableToEdit.tableId + " and all its reservations?",
      () => {
        dispatch(removeTable(getNewTable()));
        dispatch(uiActions.dismissTableToEdit());
      }
    );
  };

  const setTableHandler = (event) => {
    event.preventDefault();
    dispatch(setTable(getNewTable()));
    dispatch(uiActions.dismissTableToEdit());
  };

  return (
    <form className="form-inline" onSubmit={setTableHandler}>
      {/* Number of Seats: */}

      <table className="table  text-center">
        <tbody>
          <tr>
            <td>
              <input
                ref={tableSizeInputRef}
                defaultValue={tableToEdit.size ? tableToEdit.size : "4"}
                step="1"
                inputMode="numeric"
                max="99"
                min="1"
                name="firstName"
                type="number"
                className="form-control input-sm"
                autoFocus
              ></input>
            </td>
          </tr>
        </tbody>
      </table>

      <br />
      <div className="table-responsive">
        <table className="table">
          <tbody>
            <tr>
              <td className="align-left">
                <button
                  onClick={cancelHandler}
                  className="btn btn-danger btn-block align-left"
                >
                  Cancel
                </button>
              </td>
              {!tableToEdit.isNewTable && (
                <td className="align-left">
                  <button
                    onClick={deleteHandler}
                    className="btn btn-warning btn-block align-left"
                  >
                    Delete Table
                  </button>
                </td>
              )}
              <td className="align-right">
                <button
                  formAction="submit"
                  className="btn btn-success btn-block align-right"
                >
                  Set Table
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </form>
  );
}

export default TableForm;
