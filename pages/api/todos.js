import { getToken } from "next-auth/jwt";
import users from "../../constants/users";

export default async function handler(req, res) {
  const token = await getToken({ req });
  if (!token) {
    return res.status(401).send("Need authorization!");
  }

  const { email } = token;
  const isAuthorized = users.find((user) => user.email === email);
  if (!isAuthorized) {
    return res.status(401).send("Unathorized!");
  }

  console.log(req);

  res.status(200).json(["eat", "sleep", "code"]);
}
