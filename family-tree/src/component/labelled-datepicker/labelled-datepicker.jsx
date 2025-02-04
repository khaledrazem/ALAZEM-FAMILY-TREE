import React from "react";
import classes from "./labelled-datepicker.module.css";

function LabelledDatePicker({
  title,
  postfix,
  value,
  setValue,
  ref = null,
  name = "datepicker",
  register,
  rules
}) {
  const handleChange = (event) => {
    if (setValue && typeof setValue === "function") {
      setValue(event.target.value);
    }
  };

  return (
    <div className={classes.container}>
      {title ? (
        <div className={classes.titlecontainer}>
          <h5 className={classes.title}>{title}</h5>
        </div>
      ) : null}
      <div className={classes.dividervertical}></div>

      <input
        ref={ref}
        type="date"
        value={value}
        {...(register ? register(name, rules) : {})}
                onChange={handleChange}
        className={classes.userinput}
      />
      {postfix ? <span className={classes.postfix}>{postfix}</span> : null}
    </div>
  );
}

export default LabelledDatePicker;
