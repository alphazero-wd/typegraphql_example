import { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import AuthInput from "../../components/AuthInput";
import { useSignupMutation } from "../../generated/graphql";

const signup: NextPage = () => {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const router = useRouter();
  const [signupFunction, { data }] = useSignupMutation();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data } = await signupFunction({ variables: { userInfo: values } });
    if (data?.signup.user) {
      localStorage.setItem("token", JSON.stringify(data.signup.token));
      router.push("/");
    }
  };
  return (
    <>
      <h3 className="text-center mb-3">Sign Up</h3>

      <form onSubmit={onSubmit}>
        <AuthInput
          placeholder="First Name"
          name="firstName"
          onChange={onChange}
          value={values.firstName}
          errors={data?.signup.errors}
        />
        <AuthInput
          placeholder="Last Name"
          name="lastName"
          onChange={onChange}
          value={values.lastName}
          errors={data?.signup.errors}
        />
        <AuthInput
          placeholder="Email"
          type="email"
          name="email"
          value={values.email}
          onChange={onChange}
          errors={data?.signup.errors}
        />
        <AuthInput
          placeholder="Password"
          type="password"
          name="password"
          value={values.password}
          onChange={onChange}
          errors={data?.signup.errors}
        />
        <button type="submit" className="btn w-100 btn-primary mb-3">
          Sign up
        </button>
        <div className="text-center">
          Already have an account? <Link href="/user/login">Login</Link>
        </div>
      </form>
    </>
  );
};

export default signup;
