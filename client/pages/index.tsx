import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useMeQuery } from "../generated/graphql";

const Home: NextPage = () => {
  const router = useRouter();
  const { data, error } = useMeQuery();
  console.log(data, error);
  // useEffect(() => {
  //   if (!data) {
  //     router.push("/user/login");
  //   }
  // }, [data]);
  return (
    <div>
      <h3 className="text-center mb-3">Hello {data?.me?.fullName}</h3>
      <p className="mb-3">Email: {data?.me?.email}</p>
      <p className={`text-${data?.me?.isConfirmed ? "success" : "danger"}`}>
        You have {data?.me?.isConfirmed ? "" : "not"} been confirmed.
      </p>
    </div>
  );
};

export default Home;
