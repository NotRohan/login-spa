import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import "./App.css";

interface FormErrors {
  email?: string;
  password?: string;
  submit?: string;
}

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (value: string): string | undefined => {
    if (!value.trim()) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
    return undefined;
  };

  const validatePassword = (value: string): string | undefined => {
    if (!value) {
      return "Password is required";
    }
    if (value.length < 8) {
      return "Password must be at least 8 characters";
    }
    return undefined;
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (errors.email) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        const error = validateEmail(value);
        if (error) {
          newErrors.email = error;
        } else {
          delete newErrors.email;
        }
        return newErrors;
      });
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (errors.password) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        const error = validatePassword(value);
        if (error) {
          newErrors.password = error;
        } else {
          delete newErrors.password;
        }
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
      });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const mockFetch = (): Promise<Response> => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (email === "demo@example.com" && password === "password123") {
              resolve({
                ok: true,
                status: 200,
                json: async () => ({ success: true }),
              } as Response);
            } else {
              reject(new Error("Invalid credentials"));
            }
          }, 1500);
        });
      };

      const response = await mockFetch();

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      alert("Login successful!");
    } catch (error) {
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <main className="login-container">
        <div className="logo-container">
          <img src="/login-spa/logo.svg" alt="Evil Martians Logo" />
        </div>
        <h1 className="login-heading">Evil Martians</h1>
        <form onSubmit={handleSubmit} noValidate aria-label="Sign in form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={() => {
                if (isSubmitted) {
                  const error = validateEmail(email);
                  setErrors((prev) => ({
                    ...prev,
                    email: error,
                  }));
                }
              }}
              className={`form-input ${
                errors.email ? "form-input--error" : ""
              }`}
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              autoComplete="email"
              disabled={isLoading}
            />
            {errors.email && (
              <span id="email-error" className="form-error" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => {
                if (isSubmitted) {
                  const error = validatePassword(password);
                  setErrors((prev) => ({
                    ...prev,
                    password: error,
                  }));
                }
              }}
              className={`form-input ${
                errors.password ? "form-input--error" : ""
              }`}
              aria-required="true"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              autoComplete="current-password"
              disabled={isLoading}
            />
            {errors.password && (
              <span id="password-error" className="form-error" role="alert">
                {errors.password}
              </span>
            )}
          </div>

          {errors.submit && (
            <div
              className="form-error form-error--submit"
              role="alert"
              aria-live="polite"
            >
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            className="form-submit"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className="form-submit__spinner"
                  aria-hidden="true"
                ></span>
                <span>Signing in...</span>
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </main>
    </div>
  );
}

export default App;
