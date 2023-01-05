import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home() {
  const [fetching, setFetching] = useState(false);
  const [data, setData] = useState([]);

  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignOut = () => {
    signOut({ redirect: false });
    router.push("/auth/signin");
  };

  const fetchData = async () => {
    setFetching(true);
    try {
      const response = await axios.get("/api/todos");
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
    setFetching(false);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status]);

  if (status === "loading" && status === "unauthenticated") {
    return <div>Authenticating...</div>;
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div>
        <b>Protected routes</b>
      </div>
      <div>
        Loged in as: {session?.user.email} <u>({session?.role})</u>
      </div>
      <br />
      <div>
        {fetching && <div>Fetching...</div>}
        {!fetching && (
          <div>
            <div>My Todo Today:</div>
            <ul>
              {data.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <br />
      <button type="button" onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
}
