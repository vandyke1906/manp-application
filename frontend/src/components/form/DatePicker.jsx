import { useEffect } from "react";
import Flatpickr from "flatpickr";
import Label from "./Label";
import { CalenderIcon } from "../../icons";
//import Hook = flatpickr.Options.Hook;
//import DateOption = flatpickr.Options.DateOption;


import "flatpickr/dist/flatpickr.css";


export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  placeholder,
  isRequired=false,
  name="",
  success = true,
  error = false,
  hint,
}) {
  useEffect(() => {
    const flatPickr = Flatpickr (`#${id}`, {
      mode: mode || "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      defaultDate,
      onChange,
    });

    return () => {
      if (!Array.isArray(flatPickr)) {
        flatPickr.destroy();
      }
    };
  }, [mode, onChange, id, defaultDate]);

  return (
    <div>
      {label && <Label htmlFor={id}>{label}{isRequired && <span className="text-error-500">*</span>}</Label>}

      <div className="relative">
        <div className="relative">
          <input
            id={id}
            name={name}
            placeholder={placeholder}
            className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
            required={isRequired}
          />

          <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
            <CalenderIcon className="size-6" />
          </span>
        </div>

        {hint && (
          <p
            className={`mt-1.5 text-xs ${
              error
                ? "text-error-500"
                : success
                ? "text-success-500"
                : "text-gray-500"
            }`}
          >
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}
