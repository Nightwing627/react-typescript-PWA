import { Grid } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import * as React from "react";

export interface ITableWithGridProps {
  columns: any;
  options: any;
  data: any;
  md?: string;
  title: string;
  xs?: string;
  sm?: string;
}

export class TableWithGrid extends React.PureComponent<
  ITableWithGridProps,
  {}
> {
  constructor(props: ITableWithGridProps) {
    super(props);
  }

  public render() {
    const { columns, options, data, title } = this.props;
    return (
      <Grid container={true} spacing={4}>
        <Grid item={true} lg={12} xs={12} sm={12}>
          <MUIDataTable
            title={title}
            data={data}
            columns={columns}
            options={
              {
                ...options,
                ...{ search: false, selectableRows: false },
              } as any
            }
          />
        </Grid>
      </Grid>
    );
  }
}
