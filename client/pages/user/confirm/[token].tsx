import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useConfirmUserMutation } from '../../../generated/graphql';

const ConfirmEmail: NextPage = () => {
  const router = useRouter();
  const [confirmUser, { error }] = useConfirmUserMutation();
  const { token } = router.query;

  useEffect(() => {
    confirmUser({ variables: { token: token as string } });
  }, []);

  if (error) {
    return (
      <div className="text-center">
        <h2 className="mb-3">Something went wrong</h2>
        <button className="btn btn-primary">
          <Link href="/">Back To Home</Link>
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h2 className="mb-3">Your account has been confirmed.</h2>
    </div>
  );
};

export default ConfirmEmail;
