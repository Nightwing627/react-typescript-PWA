import * as React from "react";
import { Form, Control, actions } from "react-redux-form";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  Grid,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import { store } from "../../store/Store";
import { changeValuesInStore, dispatch } from "src/state/Utility";
import { connect } from "react-redux";
import { SET_ERROR, REMOVE_ERROR } from "src/reducers/formReducer";

class FormComponentImpl extends React.Component {
  handleInputFocus = (model) => {
    dispatch({
      type: REMOVE_ERROR,
    });
  };

  componentWillUnmount() {
    dispatch({
      type: REMOVE_ERROR,
    });
  }

  render() {
    const { props } = this;
    return (
      <Form
        model={`rxFormReducer.${props.formModel}`}
        className="form-content"
        onSubmit={() => {
          const values = store.getState().rxFormReducer[props.formModel];
          props.onSubmit(values);
        }}
      >
        <Grid container>
          {props.options.map((opt: any) => {
            switch (opt.type) {
              case "text":
                return (
                  <React.Fragment>
                    {/* {opt.required && <div> "*"</div>} */}
                    <Control
                      component={MUITextField}
                      type="text"
                      name={opt.name}
                      onFocus={() => this.handleInputFocus(opt.model)}
                      onChange={(e) =>
                        changeValuesInStore(
                          `${props.formModel}${opt.model}`,
                          e.target.value
                        )
                      }
                      className={
                        props.errorFields.includes(opt.model)
                          ? "form-input field-error"
                          : "form-input"
                      }
                      required={opt.required}
                      model={opt.model}
                      label={opt.label}
                      // mapProps={{
                      //   hasError: props.errorFields.includes(opt.model),
                      // }}
                    />
                  </React.Fragment>
                );
              case "textarea":
                return (
                  <Control
                    component={MUITextArea}
                    className={
                      props.errorFields.includes(opt.model)
                        ? "form-input field-error"
                        : "form-input"
                    }
                    onFocus={() => this.handleInputFocus(opt.model)}
                    required={opt.required}
                    type="text"
                    name={opt.name}
                    model={opt.model}
                    label={opt.label}
                    errors={{ hasError: true }}
                    rows={4}
                  />
                );
              case "select":
                return (
                  <Control
                    component={MUISelectField}
                    type="select"
                    // name="Email"
                    mapProps={{
                      className: props.errorFields.includes(opt.model)
                        ? "form-input field-error"
                        : "form-input",
                      // onSelect: this.handleInputFocus,
                    }}
                    onFocus={() => this.handleInputFocus(opt.model)}
                    required={opt.required}
                    options={opt.options}
                    name={opt.name}
                    model={opt.model}
                    label={opt.label}
                    onChange={(e) => {
                      changeValuesInStore(
                        `${props.formModel}${opt.model}`,
                        e.target.value
                      );
                    }}
                  />
                );
              case "number":
                return (
                  <Control
                    className={
                      props.errorFields.includes(opt.model)
                        ? "form-input field-error"
                        : "form-input"
                    }
                    required={opt.required}
                    component={MUITextField}
                    type="number"
                    name={opt.name}
                    model={opt.model}
                    label={opt.label}
                    onFocus={() => this.handleInputFocus(opt.model)}
                    onChange={(e) =>
                      changeValuesInStore(
                        `${props.formModel}${opt.model}`,
                        e.target.value
                      )
                    }
                  />
                );
              case "custom":
                const Custom = opt.custom();
                return <Custom />;

              case "date":
                return(
                  <Control
                    className={
                      props.errorFields.includes(opt.model)
                        ? "form-input field-error"
                        : "form-input"
                    }
                    required={opt.required}
                    component={MUIDateField}
                    type="number"
                    name={opt.name}
                    model={opt.model}
                    label={opt.label}
                    onFocus={() => this.handleInputFocus(opt.model)}
                    onChange={(e) =>{ console.log("efblmflbkm")
                      changeValuesInStore(
                        `${props.formModel}${opt.model}`,
                        e.target.value
                      )
                    }}
                  />
                );

              default:
                return "";
            }
          })}
        </Grid>
        {props.hasSubmit && (
          <div className="button-container">
            <Button variant="contained" onClick={props.onCancel}>
              {props.cancelTitle || "Cancel"}
            </Button>
            <Button
              onClick={() => {
                const values = store.getState().rxFormReducer[props.formModel];
                console.log('>> props', props);
                const fieldErrors = [];
                (props.allFormOptions || props.options).map((option) => {
                  const valueName = option.model.split(".")[1];
                  if (option.required && !values[valueName]) {
                    fieldErrors.push(option.model);
                  }
                });
                dispatch({
                  type: SET_ERROR,
                  formError: fieldErrors,
                });
                console.log("Values: ", fieldErrors);
                console.log("Values: ", values);
                if (fieldErrors.length) {
                  return;
                }
                dispatch({
                  type: REMOVE_ERROR,
                });            
                props.onSubmit(values);
              }}
              variant="contained"
              color="primary"
              // type="submit"
            >
              {props.submitTitle || "Submit"}
            </Button>
          </div>
        )}
      </Form>
    );
  }
}

const MUITextField = (props: any) => {
  return (
    <Grid item={true} xs={12} md={6} sm={6}>
      <TextField
        label={props.name}
        variant="outlined"
        className="form-input"
        type={props.type}
        {...props}
      />{" "}
      <div className={`error-text-hidden ${props.hasError} "error-text-show"}`}>
        Please fill in this field
      </div>
    </Grid>
  );
};

const MUITextArea = (props: any) => {
  return (
    <Grid item={true} xs={12} md={6} sm={6}>
      <TextField
        label={props.name}
        variant="outlined"
        className="form-input"
        type={props.type}
        {...props}
        multiline
        rows={4}
      />{" "}
      <div className={`error-text-hidden ${props.hasError} "error-text-show"}`}>
        Please fill in this field
      </div>
    </Grid>
  );
};

const MUISelectField = (props: any) => {
  const { className, ...rest } = props;
  return (
    <Grid item={true} xs={12} md={6} sm={6}>
      <FormControl variant="outlined" className={className}>
        <InputLabel id="demo-simple-select-outlined-label">
          {props.label}
        </InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          label={props.label}
          {...rest}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {props.options.map((opt) => {
            return <MenuItem value={opt.value}>{opt.label}</MenuItem>;
          })}
        </Select>
      </FormControl>
    </Grid>
  );
};

const MUIDateField = (props: any) => {
  const dateNow = new Date();
  const year = dateNow.getFullYear();
  const monthWithOffset = dateNow.getUTCMonth() + 1; 
  const month = monthWithOffset.toString().length < 2 ? `0${monthWithOffset}` : monthWithOffset; 
  const date = dateNow.getUTCDate().toString().length < 2 ? `0${dateNow.getUTCDate()}` : dateNow.getUTCDate();
  monthWithOffset.toString().length < 2 // Checking if month is < 10 and pre-prending 0 to adjust for date input.
    ? `0${monthWithOffset}`
    : monthWithOffset;
  const toDate = `${year}-${month}-${date}`;

  return (
    <Grid item={true} xs={12} md={6} sm={6}>
      <TextField
        id="date"
        label={props.label}
        type="date"
        defaultValue={toDate}
        variant="outlined"
        onChange={(e) =>{ console.log("props:", props)
        const model = props.name.split(".");
        console.log(`${model[1]}.${model[2]}`)
          changeValuesInStore(
            `${model[1]}.${model[2]}`,
            e.target.value
          )
        }}
        className="form-input"
        // InputLabelProps={{
        //   shrink: true
        // }}
      />
      <div className={`error-text-hidden ${props.hasError} "error-text-show"}`}>
        Please fill in this field
      </div>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    errorFields: state.formReducer.formError,
  };
};

export const FormComponent = connect(mapStateToProps)(FormComponentImpl);

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
