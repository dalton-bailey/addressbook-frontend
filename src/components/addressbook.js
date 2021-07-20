import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add"
import { IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, Button, DialogActions } from "@material-ui/core";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const useStyles = makeStyles({
    searchDiv: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
    },
    search: {
        display: "flex",
        alignItems: "center",
        width: 340,
        padding: 8,
        borderRadius: 10,
    },

    searchBar: {
        border: "none",
        width: 340,
        padding: 8,
    },
});

const AddressBook = () => {
    const classes = useStyles();
    const [addressBookData, setAddressBookData] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [selectedAddress, setSelectedAddress] = useState('');
    const [edit, setEdit] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);

    const handleChange = (event) => {
        setSearchValue(event.target.value);
    }

    const fetchAddressBook = async () => {
        try {
            const addresses = await axios.get(`https://glacial-coast-35607.herokuapp.com/address`);
            setAddressBookData(addresses.data);
            console.log(addresses.data);
        }
        catch (err) {
            console.log(err)
        }
    }

    const handleUpdate = async (values) => {
        console.log(selectedAddress.name)
        try {
            const result = await axios.put(`https://glacial-coast-35607.herokuapp.com/address/update`, {
                data: {
                    addressId: values.id,
                    name: values.name,
                    address: values.address,
                    city: values.city,
                    state: values.state,
                    zipCode: values.zipCode
                },
            });
            if (result.status === 200) {
                fetchAddressBook();
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    const handleDelete = async () => {
        setDeleteOpen(false);
        try {
            await axios.delete(`https://glacial-coast-35607.herokuapp.com/address/delete`, {
                data: {
                    addressId: selectedAddress._id,
                }
            })
            setSelectedAddress('')
            fetchAddressBook()
        } catch (err) {
            console.err(err)
        }
    }

    const handleCurrentAddress = (address) => {
        setSelectedAddress(address.address)
    }

    const handleAdd = async (values) => {
        try {
            const result = await axios.post(`https://glacial-coast-35607.herokuapp.com/address`, {
                name: values.name,
                address: values.address,
                city: values.city,
                state: values.state,
                zipCode: values.zipCode,
            })
            if (result.status === 200) {
                fetchAddressBook()
            }
        }
        catch (err) {
            console.error(err)
        }
    }

    const handleClickEdit = () => {
        setEdit(true);
    };

    const handleCloseEdit = () => {
        setEdit(false);
    };

    const handleClickDeleteOpen = () => {
        setDeleteOpen(true);
    };

    const handleCloseDelete = () => {
        setDeleteOpen(false);
    };

    const handleClickAddOpen = () => {
        setAddOpen(true);
    };

    const handleCloseAdd = () => {
        setAddOpen(false);
    };

    useEffect(() => {
        fetchAddressBook();
    }, []);


    const showAddresses = addressBookData.filter((address) => {
        return address.name.toLowerCase().includes(searchValue.toLowerCase())
    })
        .map((address) => {
            return (
                <div key={address._id} className="listItem">
                    <div className="address">
                        <button onClick={() => handleCurrentAddress({ address })}>{address.name}</button>
                    </div>
                </div>
            )
        })

    return (
        <div>
            <h1>Address Book</h1>
            <div className={classes.searchDiv}>
                <div className={classes.search}>
                    <SearchIcon />
                    <input
                        className={classes.searchBar}
                        placeholder="Search Address Book"
                        onChange={handleChange}
                        value={searchValue}
                    />
                </div>
            </div>
            <IconButton onClick={() => handleClickAddOpen()} >
                <AddIcon />
            </IconButton>

            <Dialog open={edit} onClose={handleCloseEdit}>
                <Formik
                    initialValues={{
                        id: selectedAddress?._id,
                        name: selectedAddress?.name,
                        address: selectedAddress?.address,
                        city: selectedAddress?.city,
                        state: selectedAddress?.state,
                        zipCode: selectedAddress?.zipCode
                    }}
                    validationSchema={Yup.object().shape({
                        name: Yup.string("Enter name").required("Name is required"),
                        address: Yup.string("Address").required("Address is required"),
                        city: Yup.string("City").required("City is required"),
                        state: Yup.string("State").required("State is required"),
                        zipCode: Yup.number("Zip Code").required("Zip Code is required")
                    })}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        try {
                            await handleUpdate(values);
                            handleCloseEdit();
                        } catch (err) {
                            console.error(err);
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
                            setSubmitting(false);
                        }
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                    }) => (
                        <form
                            noValidate
                            autoComplete="off"
                            onSubmit={handleSubmit}
                            className={classes.dialogContent}
                        >
                            <DialogTitle>Edit Address</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Make changes below to the data about this address
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    id="name"
                                    name="name"
                                    label="Name"
                                    type="text"
                                    fullWidth
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(touched.name && errors.name)}
                                    helperText={touched.name && errors.name}
                                />
                                <TextField
                                    id="address"
                                    name="address"
                                    label="Address"
                                    type="text"
                                    fullWidth
                                    value={values.address}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(touched.address && errors.address)}
                                    helperText={touched.address && errors.address}
                                />
                                <TextField
                                    id="city"
                                    name="city"
                                    label="City"
                                    fullWidth
                                    value={values.city}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(touched.city && errors.city)}
                                    helperText={touched.city && errors.city}
                                />
                                <TextField
                                    id="state"
                                    name="state"
                                    label="State"
                                    fullWidth
                                    value={values.state}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(touched.state && errors.state)}
                                    helperText={touched.state && errors.state}
                                />
                                <TextField
                                    id="zipCode"
                                    name="zipCode"
                                    label="Zip Code"
                                    type="number"
                                    fullWidth
                                    value={values.zipCode}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(touched.zipCode && errors.zipCode)}
                                    helperText={touched.zipCode && errors.zipCode}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseEdit}>Cancel</Button>
                                <Button type="submit">Save</Button>
                            </DialogActions>
                        </form>
                    )}
                </Formik>
            </Dialog>

            <Dialog open={deleteOpen} onClose={handleCloseDelete}>
                <DialogTitle>Delete Address</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure want to delete this address?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDelete}>Cancel</Button>
                    <Button onClick={handleDelete}>Delete</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={addOpen} onClose={handleCloseAdd}>
                <Formik
                    initialValues={{
                        name: '',
                        address: '',
                        city: '',
                        state: '',
                        zipCode: '',
                    }}
                    validationSchema={Yup.object().shape({
                        name: Yup.string("Enter name").required("Name is required"),
                        address: Yup.string("Address").required("Address is required"),
                        city: Yup.string("City").required("City is required"),
                        state: Yup.string("State").required("State is required"),
                        zipCode: Yup.number("Zip Code").required("Zip Code is required")
                    })}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        try {
                            await handleAdd(values);
                            handleCloseAdd();
                        } catch (err) {
                            console.error(err);
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
                            setSubmitting(false);
                        }
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                    }) => (
                        <form
                            noValidate
                            autoComplete="off"
                            onSubmit={handleSubmit}
                            className={classes.dialogContent}
                        >
                            <DialogTitle>Add Address</DialogTitle>
                            <DialogContent>
                                <DialogContentText>Add a New Address</DialogContentText>
                                <TextField
                                    autoFocus
                                    id="name"
                                    name="name"
                                    label="Name"
                                    type="text"
                                    fullWidth
                                    placeholder="Name"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(touched.name && errors.name)}
                                    helperText={touched.name && errors.name}
                                />
                                <TextField
                                    id="address"
                                    name="address"
                                    label="Address"
                                    type="text"
                                    fullWidth
                                    placeholder="Address"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(touched.address && errors.address)}
                                    helperText={touched.address && errors.address}
                                />
                                <TextField
                                    id="city"
                                    name="city"
                                    label="City"
                                    fullWidth
                                    placeholder="City"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(touched.city && errors.city)}
                                    helperText={touched.city && errors.city}
                                />
                                <TextField
                                    id="state"
                                    name="state"
                                    label="State"
                                    fullWidth
                                    placeholder="State"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(touched.state && errors.state)}
                                    helperText={touched.state && errors.state}
                                />
                                <TextField
                                    id="zipCode"
                                    name="zipCode"
                                    label="Zip Code"
                                    type="number"
                                    fullWidth
                                    placeholder="Zip Code"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(touched.zipCode && errors.zipCode)}
                                    helperText={touched.zipCode && errors.zipCode}
                                />

                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseAdd}>Cancel</Button>
                                <Button type="submit">Add</Button>
                            </DialogActions>
                        </form>
                    )}
                </Formik>
            </Dialog>

            <div className="addressBook">
                <div className="list">{showAddresses}</div>
                <div className="selectedAddress">
                    <p>{selectedAddress.name}</p>
                    <div>
                        <p>{selectedAddress.address}</p>
                        <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}</p>
                    </div>
                    <div className="btnList">
                        <IconButton
                            className="editBtn btn"
                            onClick={() => handleClickEdit()}
                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            className="deleteBtn btn"
                            onClick={() => handleClickDeleteOpen(selectedAddress)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddressBook