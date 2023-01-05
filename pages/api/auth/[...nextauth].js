import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import users from "../../../constants/users";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      id: "email-and-password",
      async authorize(credentials) {
        if (credentials == null) {
          return null;
        }

        const { email, password } = credentials;

        const user = users.find((user) => user.email === email);
        if (!user) return null;

        if (user.password === password) {
          return { email, name: user.name, role: user.role };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token["role"] = user.role;
      return Promise.resolve(token);
    },
    async session({ session, token }) {
      if (token) session["role"] = token.role;
      return Promise.resolve(session);
    },
  },
};
export default NextAuth(authOptions);
