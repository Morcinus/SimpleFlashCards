import React, { Component } from "react";
import MaterialTable from "material-table";

// Other
import defaultDeckImageUrl from "../util/other";

// Zdroj: Vetsina veci je nakopirovana a lehce poupravena z dokumentace https://material-table.com
export class DeckTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { title: "Index", field: "index", editable: "never" },
        {
          title: "Deck Image",
          field: "imageUrl",
          render: rowData => (
            <img
              src={rowData.deckImage ? rowData.deckImage : defaultDeckImageUrl}
              style={{ width: "145px", height: "170px", borderRadius: 12 }}
            />
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
          // onRowAdd: newData =>
          //   new Promise((resolve, reject) => {
          //     setTimeout(() => {
          //       {
          //         const data = this.props.data;
          //         newData.index = this.props.data.length + 1;
          //         data.push(newData);
          //         this.setState({ data }, () => resolve());
          //       }
          //       resolve();
          //     }, 1000);
          //   }),
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
              deleteText:
                "Are you sure you want to remove this deck from collection?"
            }
          }
        }}
      />
    );
  }
}

export default DeckTable;
