import React, { Fragment } from "react";
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
import Box from "@mui/material/Box";
import GoodsFrom, { initialFormData } from "/imports/ui/GoodsForm";
import SimpleBackdrop from "./BackDrop";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
    <Box>
      {isLoading ? (
        <SimpleBackdrop isLoading={isLoading} />
      ) : (
        <Fragment>
          <Button
            variant="contained"
            onClick={() => {
              setOpen(true);
              setRecord(initialFormData);
            }}
            sx={{ marginBottom: "1.5rem" }}
          >
            New Good
          </Button>

          <GoodsFrom open={open} setOpen={setOpen} data={record} />

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="left">Price</TableCell>
                  <TableCell align="left">Description</TableCell>
                  <TableCell align="left">Action</TableCell>
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
                    <TableCell align="left">{good.price}</TableCell>
                    <TableCell align="left">{good.description}</TableCell>
                    <TableCell align="left">
                      <IconButton
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
                        sx={{ p: 0, mr: 2 }}
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        onClick={() => deleteItem(good._id)}
                        sx={{ p: 0 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Fragment>
      )}
    </Box>
  );
};

export default Admin;
