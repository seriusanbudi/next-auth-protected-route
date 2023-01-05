import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

const SignInPage = () => {
  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const [submissonError, setSubmissionError] = useState(null);
  const router = useRouter();

  const handleInputChange = (e) => {
    let newValues = { ...formValues };
    newValues[e.target.name] = e.target.value;

    setFormValues(newValues);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionError("Unauthorized!");
    const { email, password } = formValues;
    try {
      const { ok } = await signIn("email-and-password", {
        email,
        password,
        redirect: false,
      });

      if (ok) {
        router.push("/");
      } else {
        setSubmissionError("Unauthorized!");
      }
    } catch (error) {
      throw error;
    }
  };

  const formErrors = useMemo(() => {
    let errors = {};
    Object.keys(formValues).forEach((key) => {
      if (!formValues[key]) {
        errors[key] = "required";
      }
    });

    return errors;
  }, [formValues]);

  return (
    <form onSubmit={handleSubmit}>
      {submissonError && (
        <div style={{ marginBottom: "12px" }}>{submissonError}</div>
      )}
      <div style={{ marginBottom: "12px" }}>
        <input
          name="email"
          placeholder="Email"
          onChange={handleInputChange}
          value={formValues.email}
        />
      </div>
      <div style={{ marginBottom: "12px" }}>
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleInputChange}
          value={formValues.password}
        />
      </div>
      <button disabled={Object.keys(formErrors).length > 0} type="submit">
        Submit
      </button>
    </form>
  );
};

export default SignInPage;
