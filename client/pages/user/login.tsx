import { NextPage } from 'next';
import AuthInput from '../../components/AuthInput';
import Link from 'next/link';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useLoginMutation } from '../../generated/graphql';
import { useRouter } from 'next/router';

const login: NextPage = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const [loginFunction, { data }] = useLoginMutation();
  const router = useRouter();
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data } = await loginFunction({ variables: { userInfo: values } });
    console.log(data);
    if (data?.login.user) {
      localStorage.setItem('token', JSON.stringify(data.login.token));
      router.push('/');
    }
  };

  return (
    <>
      <h3 className="mb-3 text-center">Login</h3>
      <form onSubmit={onSubmit}>
        <AuthInput
          name="email"
          onChange={onChange}
          value={values.email}
          placeholder="Email address"
          type="email"
          errors={data?.login.errors}
        />
        <AuthInput
          name="password"
          onChange={onChange}
          value={values.password}
          placeholder="Password"
          type="password"
          errors={data?.login.errors}
        />
        <button type="submit" className="btn w-100 btn-primary mb-3">
          Login
        </button>
        <div className="text-center">
          Don't have an account? <Link href="/user/signup">Sign up</Link>{' '}
        </div>
      </form>
    </>
  );
};

export default login;
