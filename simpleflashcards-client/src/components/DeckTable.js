import React, { Component } from "react";
import MaterialTable from "material-table";

// Zdroj: Vetsina veci je nakopirovana a lehce poupravena z dokumentace https://material-table.com
export class DeckTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { title: "Index", field: "index", editable: "never" },
        { title: "Front Page", field: "frontPage" },
        { title: "Back Page", field: "backPage" }
      ],
      data: [
        { index: 1, frontPage: "zvire", backPage: "animal" },
        { index: 2, frontPage: "kaktus", backPage: "cactus" },
        { index: 3, frontPage: "clovek", backPage: "human" }
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
        data={this.state.data}
        options={{
          search: false,
          actionsColumnIndex: -1,
          paging: false,
          grouping: false
        }}
        editable={{
          onRowAdd: newData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                {
                  const data = this.state.data;
                  newData.index = this.state.data.length + 1;
                  data.push(newData);
                  this.setState({ data }, () => resolve());
                }
                resolve();
              }, 1000);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                {
                  const data = this.state.data;
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
                  let data = this.state.data;
                  const index = data.indexOf(oldData);
                  data.splice(index, 1);
                  this.setState({ data }, () => resolve());
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
              const data = this.state.data;
              const index = data.indexOf(rowData);
              if (index - 1 >= 0) {
                let rowData2 = data[index - 1];

                // Switches the rows
                rowData2.index = rowData2.index + 1;
                rowData.index = rowData.index - 1;

                data[index - 1] = rowData;
                data[index] = rowData2;
              }
              this.setState({ data });
            }
          },
          {
            icon: "arrow_downward",
            tooltip: "Move Down",
            onClick: (event, rowData) => {
              const data = this.state.data;
              const index = data.indexOf(rowData);
              if (index + 1 < data.length) {
                let rowData2 = data[index + 1];

                // Switches the rows
                rowData2.index = rowData2.index - 1;
                rowData.index = rowData.index + 1;

                data[index + 1] = rowData;
                data[index] = rowData2;
              }
              this.setState({ data });
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
