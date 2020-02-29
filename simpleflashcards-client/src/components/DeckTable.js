import React, { Component } from "react";
import MaterialTable from "material-table";

/**
 * @class DeckTable
 * @extends Component
 * @category Components
 * @classdesc Tento komponent zobrazuje tabulku pro upravování balíčku.
 * @property {Object} state - Vnitřní state komponentu
 * @property {Array<Object>} state.columns - Určuje nastavení sloupců material-table tabulky (viz {@link https://material-table.com}).
 *
 * @see Tento komponent je založen na material-table {@link https://material-table.com}
 */
export class DeckTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { title: "Index", field: "index", editable: "never" },
        { title: "Front Page", field: "frontPage" },
        { title: "Back Page", field: "backPage" }
      ]
    };

    this.tableRef = React.createRef();
  }
  render() {
    return (
      <MaterialTable
        tableRef={this.tableRef}
        title="Cards"
        columns={this.state.columns}
        data={this.props.data}
        options={{
          search: false,
          actionsColumnIndex: -1,
          paging: false,
          grouping: false
        }}
        editable={{
          /**
           * @function onRowAdd
           * @memberOf DeckTable
           * @description [Material-table]{@link https://material-table.com} funkce, která umožňuje přidávání nových řádků do tabulky.
           * @param {Object} newData - Nová data tabulky.
           */
          onRowAdd: newData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                {
                  const data = this.props.data;
                  newData.index = this.props.data.length + 1;
                  data.push(newData);
                  this.setState({ data }, () => resolve());
                }
                resolve();
              }, 1000);
            }),
          /**
           * @function onRowUpdate
           * @memberOf DeckTable
           * @description [Material-table]{@link https://material-table.com} funkce, která umožňuje upravování řádků tabulky.
           * @param {Object} newData - Nová data tabulky.
           * @param {Object} oldData - Stará data tabulky.
           */
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                {
                  const data = this.props.data;
                  const index = data.indexOf(oldData);
                  data[index] = newData;
                  this.setState({ data }, () => resolve());
                }
                resolve();
              }, 1000);
            }),
          /**
           * @function onRowDelete
           * @memberOf DeckTable
           * @description [Material-table]{@link https://material-table.com} funkce, která umožňuje odstraňování řádků tabulky.
           * @param {Object} oldData - Stará data tabulky.
           */
          onRowDelete: oldData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                {
                  let data = this.props.data;
                  const index = data.indexOf(oldData);
                  data.splice(index, 1);
                  this.props.updateDeckCards(data);
                  resolve();
                }
                resolve();
              }, 1000);
            })
        }}
        actions={[
          {
            icon: "arrow_upward",
            tooltip: "Move Up",
            /**
             * @function onClick
             * @memberOf DeckTable
             * @description Při kliknutí na tlačítko s šipkou nahoru posune daný řádek v tabulce o jednu pozici výš.
             * @param {Array<Object>} rowData - Data o řádcích tabulky
             */
            onClick: (event, rowData) => {
              const data = this.props.data;
              const index = data.indexOf(rowData);
              if (index - 1 >= 0) {
                let rowData2 = data[index - 1];

                // Switches the rows
                rowData2.index = rowData2.index + 1;
                rowData.index = rowData.index - 1;

                data[index - 1] = rowData;
                data[index] = rowData2;
              }
              this.props.updateDeckCards(data);
            }
          },
          {
            icon: "arrow_downward",
            tooltip: "Move Down",
            /**
             * @function onClick
             * @memberOf DeckTable
             * @description Při kliknutí na tlačítko s šipkou dolu posune daný řádek v tabulce o jednu pozici níž.
             * @param {Array<Object>} rowData - Data o řádcích tabulky
             */
            onClick: (event, rowData) => {
              const data = this.props.data;
              const index = data.indexOf(rowData);
              if (index + 1 < data.length) {
                let rowData2 = data[index + 1];

                // Switches the rows
                rowData2.index = rowData2.index - 1;
                rowData.index = rowData.index + 1;

                data[index + 1] = rowData;
                data[index] = rowData2;
              }
              this.props.updateDeckCards(data);
            }
          }
        ]}
        localization={{
          body: {
            editRow: {
              deleteText: "Are you sure you want to delete this card?"
            }
          }
        }}
      />
    );
  }
}

export default DeckTable;
