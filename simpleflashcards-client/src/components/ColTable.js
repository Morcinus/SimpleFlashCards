import React, { Component } from "react";
import MaterialTable from "material-table";

// Other
import defaultDeckImageUrl from "../util/other";

/**
 * @class ColTable
 * @extends Component
 * @category Components
 * @classdesc Tento komponent zobrazuje tabulku pro upravování kolekcí. Je převážně založen na knihovně {@link https://material-table.com}.
 * @param {Object} props - Vstupní data pro daný komponent.
 * @property {Object} state - Vnitřní state komponentu.
 * @property {Array<Object>} state.columns - Určuje nastavení sloupců material-table tabulky (viz {@link https://material-table.com}).
 *
 * @see Tento komponent je založen na material-table {@link https://material-table.com}
 */
export class ColTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { title: "Index", field: "index", editable: "never" },
        {
          title: "Deck Image",
          field: "imageUrl",
          // Vykreslí obrázky jednotlivých balíčků
          render: rowData => (
            <img src={rowData.deckImage ? rowData.deckImage : defaultDeckImageUrl} style={{ width: "145px", height: "170px", borderRadius: 12 }} />
          )
        },
        { title: "Deck Name", field: "frontPage" }
      ]
    };

    this.tableRef = React.createRef();
  }
  render() {
    return (
      <MaterialTable
        tableRef={this.tableRef}
        title="Collection Decks"
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
           * @function onRowDelete
           * @memberOf ColTable
           * @description [Material-table]{@link https://material-table.com} funkce, která umožňuje odstraňování řádků z tabulky.
           * @param {Object} oldData - Stará data tabulky.
           */
          onRowDelete: oldData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                {
                  let data = this.props.data;
                  const index = data.indexOf(oldData);
                  data.splice(index, 1);
                  this.props.updateDeckArray(data);
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
             * @memberOf ColTable
             * @description Při kliknutí na tlačítko s šipkou nahoru posune daný řádek v tabulce o jednu pozici výše.
             * @param {Array<Object>} rowData - Data o řádcích tabulky.
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
              this.props.updateDeckArray(data);
            }
          },
          {
            icon: "arrow_downward",
            tooltip: "Move Down",
            /**
             * @function onClick
             * @memberOf DeckTable
             * @description Při kliknutí na tlačítko s šipkou dolu posune daný řádek v tabulce o jednu pozici níž.
             * @param {Array<Object>} rowData - Data o řádcích tabulky.
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
              this.props.updateDeckArray(data);
            }
          }
        ]}
        localization={{
          body: {
            editRow: {
              deleteText: "Are you sure you want to remove this deck from collection?"
            }
          }
        }}
      />
    );
  }
}

export default ColTable;
