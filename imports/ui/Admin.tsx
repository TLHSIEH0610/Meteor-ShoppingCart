import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { GoodsCollection } from "/imports/db/goodsCollection";
import { useTracker } from "meteor/react-meteor-data";
import Button from "@mui/material/Button";
import { NewGoods, initialFormData } from "/imports/ui/Goods";

const Admin = () => {
  const [open, setOpen] = React.useState(false);
  const [record, setRecord] = React.useState(initialFormData);
  const { goods, isLoading }: any = useTracker(() => {
    const handler = Meteor.subscribe("goods.all");

    if (!handler.ready()) {
      return { goods: [], isLoading: true };
    }

    const goods = GoodsCollection.find().fetch();

    return { goods, isLoading: false };
  });

  const deleteItem = (_id: string) => {
    Meteor.call("goods.delete", _id);
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => {
          setOpen(true);
          setRecord(initialFormData);
        }}
      >
        New Good
      </Button>

      <NewGoods open={open} setOpen={setOpen} data={record} />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">Action</TableCell>
              {/* <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {goods.map((good: any) => (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                key={good._id}
              >
                <TableCell component="th" scope="row">
                  {good.name}
                </TableCell>
                <TableCell align="right">{good.price}</TableCell>
                <TableCell align="right">{good.description}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setRecord({
                        name: good.name,
                        _id: good._id,
                        description: good.description,
                        price: good.price,
                        image_path: good.image_path,
                        image_id: good.image_id,
                      });
                      setOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button size="small" onClick={() => deleteItem(good._id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Admin;
