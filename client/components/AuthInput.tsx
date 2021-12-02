import { ChangeEvent, FC } from "react";
import { FieldError } from "../generated/graphql";
interface Props {
  type?: "email" | "password";
  placeholder: string;
  name: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  errors?: FieldError[] | null;
  value: string;
}

const AuthInput: FC<Props> = ({
  type,
  onChange,
  placeholder,
  name,
  errors,
  value,
}) => {
  return (
    <div className="form-floating mb-3">
      <input
        type={type || "text"}
        className={`form-control ${
          errors?.some(err => err.field === name) ? "is-invalid" : null
        }`}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required
      />
      <label>{placeholder}</label>
      {errors?.some(err => err.field === name) && (
        <div
          className={
            errors?.some(err => err.field === name) ? "invalid-feedback" : ""
          }
        >
          {errors?.find(err => err.field === name)?.message}
        </div>
      )}
    </div>
  );
};

export default AuthInput;
