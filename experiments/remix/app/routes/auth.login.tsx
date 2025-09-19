// routes/auth.login.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "~/stores/authStore";
import { Button } from "~/components/ui/Button";
import { FormItem } from "~/components/forms/form-item";
import { PasswordInput } from "~/components/forms/form-item/PasswordInput";
import { Checkbox } from "~/components/forms/form-item/Checkbox";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  // Checkbox state
  const [rememberMe, setRememberMe] = useState(false);

  // Input Handling
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (error) clearError();
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate("/account"); // Redirect after successful login
    } catch (err) {
      // Error is handled in store
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Melde dich in deinem Konto an
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Oder{" "}
            <Link
              to="/auth/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              erstelle ein neues Konto
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* ✅ Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="text-red-800 text-sm">⚠️ {error}</div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* E-Mail Feld */}
            <FormItem
              label="E-Mail-Adresse"
              id="email"
              type="email"
              placeholder="E-Mail-Adresse"
              required
              inputProps={{
                name: "email",
                autoComplete: "email",
                value: formData.email,
                onChange: handleInputChange,
              }}
            />

            {/* Passwort Feld (PasswordInput als inputComponent) */}
            <FormItem
              label="Passwort"
              id="password"
              required
              helperText="Mindestens 8 Zeichen"
              inputComponent={PasswordInput}
              inputProps={{
                name: "password",
                value: formData.password,
                onChange: handleInputChange,
                autoComplete: "current-password",
              }}
            />
          </div>

          {/* Checkbox + Link für Passwort vergessen */}
          <div className="flex items-center justify-between">
            <FormItem
              label="Angemeldet bleiben"
              id="remember-me"
              inputComponent={Checkbox}
              inputProps={{
                name: "remember-me",
                checked: rememberMe,
                onCheckedChange: setRememberMe,
              }}
              containerClassName="flex items-center gap-2 m-0"
              labelProps={{ className: "ml-2 text-sm text-gray-900 mb-0" }}
            />

            <div className="text-sm ml-2">
              <Link
                to="/auth/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Passwort vergessen?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              disabled={isLoading || !formData.email || !formData.password}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Wird angemeldet...
                </>
              ) : (
                "Anmelden"
              )}
            </Button>
          </div>

          {/* Social Login (Optional) */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">
                  Oder anmelden mit
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span>🔵</span>
                <span className="ml-2">Google</span>
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span>📘</span>
                <span className="ml-2">Facebook</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
